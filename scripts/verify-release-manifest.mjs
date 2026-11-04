/**
 * Tests for scripts/lib/release-manifest.mjs and the CLI's argument parsing.
 * Covers the R1 review (tsk_5ou5a10a) reproductions: an ARM64 installer paired
 * with mac metadata, an RC tag whose prerelease flag disagrees, a backwards
 * move, an asset URL pointing at another repo, and updater metadata whose
 * name/size/sha512 don't match the real bytes. Byte-level tests run a real
 * local HTTP server, so the SHA-512 streaming path runs against real bytes
 * over a real socket.
 *
 * Run with: node --test scripts/verify-release-manifest.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import {
  buildManifest,
  inspectRelease,
  mergeTaggedRelease,
  ownSetupCandidate,
  ManifestError,
} from './lib/release-manifest.mjs';
import { parseArgs } from './generate-release-manifest.mjs';

const OWNER = 'sowonlabs';
const REPO = 'crewx';

// The contract's filenames are written out here on purpose, so the tests
// state the rule instead of reading it back from the library.
const STABLE = { metadata: 'latest.yml', feed: 'latest-app.yml', installer: 'CrewX-Setup-x64.exe' };
const PREVIEW = { metadata: 'rc.yml', feed: 'rc-app.yml', installer: 'CrewX-Setup-rc-x64.exe' };
const channelFiles = (prerelease) => (prerelease ? PREVIEW : STABLE);

function sha512Base64(buf) {
  return createHash('sha512').update(buf).digest('base64');
}

function githubAssetUrl(tag, name) {
  return `https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${name}`;
}

function updaterYaml({ version, path, sha512, size, topSha512 }) {
  return (
    `version: ${version}\n` +
    `files:\n  - url: ${path}\n    sha512: ${sha512}\n    size: ${size}\n` +
    `path: ${path}\n` +
    `sha512: ${topSha512 ?? sha512}\n` +
    `releaseDate: '2026-09-01T00:00:00.000Z'\n`
  );
}

/**
 * Real local HTTP server keyed by "tag/filename" — exercises real streaming,
 * not a mock. Keying on the filename alone would collide: every stable
 * release's metadata asset is named "latest.yml", so each release's fixtures
 * need their own tag-scoped slot.
 */
async function withFixtureServer(files, run) {
  const server = createServer((req, res) => {
    const key = decodeURIComponent(req.url.slice(1));
    const body = files[key];
    if (body === undefined) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200);
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const fetchAsset = (url) => {
    const key = new URL(url).pathname.split('/').slice(-2).join('/');
    return fetch(`${base}/${encodeURIComponent(key)}`);
  };
  try {
    await run(fetchAsset);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

function throwingFetchAsset() {
  return async (url) => {
    throw new Error(`fetchAsset must not be called (${url}) — this release should be rejected before any download`);
  };
}

/** Asserts that `run` rejects with a ManifestError whose message matches `pattern`. */
async function rejectsWith(run, pattern) {
  await assert.rejects(
    run,
    (err) => err instanceof ManifestError && pattern.test(err.message),
    `expected a ManifestError matching ${pattern}`
  );
}

const emptyManifest = () => ({ generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null });

/** fetchApi stub: serves the given raw releases by tag; any other tag is a GitHub 404. */
function apiServing(...releases) {
  const byTag = new Map(releases.map((r) => [r.tag_name, r]));
  return async (path) => {
    const match = /\/releases\/tags\/([^/]+)$/.exec(path);
    const tag = match ? decodeURIComponent(match[1]) : undefined;
    if (!byTag.has(tag)) throw new Error(`GitHub API ${path} -> 404 Not Found`);
    return byTag.get(tag);
  };
}

function ghRelease({ tag, prerelease = false, draft = false, assets }) {
  return {
    tag_name: tag,
    name: `CrewX Desktop ${tag.replace(/^v/, '')}`,
    draft,
    prerelease,
    published_at: '2026-09-01T00:00:00Z',
    html_url: `https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`,
    assets,
  };
}

function ghAsset(tag, name, size, url) {
  return { name, size, browser_download_url: url ?? githubAssetUrl(tag, name) };
}

/**
 * A release that hosts a Setup: installer + channel updater metadata, plus the
 * channel app feed unless withFeed is false. Defaults: the versionless
 * installer name for the channel, and a shell version equal to the app version.
 * Returns { release, files } where files are the bytes the fixture server serves.
 */
function setupRelease({
  tag = 'v0.9.0',
  prerelease = false,
  draft = false,
  shellVersion = tag.replace(/^v/, ''),
  installerName = channelFiles(prerelease).installer,
  metadataName = channelFiles(prerelease).metadata,
  withFeed = true,
  installerUrl,
  metadataUrl,
  installerSize,
  exeBytes,
  yamlText,
} = {}) {
  const bytes = exeBytes ?? Buffer.from(`fake-installer-bytes-for-${tag}-${installerName}`);
  const yaml =
    yamlText ?? updaterYaml({ version: shellVersion, path: installerName, sha512: sha512Base64(bytes), size: bytes.length });
  const assets = [
    ghAsset(tag, installerName, installerSize ?? bytes.length, installerUrl),
    ghAsset(tag, metadataName, yaml.length, metadataUrl),
    ...(withFeed ? [ghAsset(tag, channelFiles(prerelease).feed)] : []),
  ];
  return {
    release: ghRelease({ tag, prerelease, draft, assets }),
    files: { [`${tag}/${installerName}`]: bytes, [`${tag}/${metadataName}`]: yaml },
  };
}

/** An app release with only the channel app feed: it reuses an older release's Setup. */
function appOnlyRelease({ tag, prerelease = false, draft = false }) {
  return {
    release: ghRelease({ tag, prerelease, draft, assets: [ghAsset(tag, channelFiles(prerelease).feed)] }),
    files: {},
  };
}

/** A CLI-only release, like the real ones: no installer, no updater metadata, no app feed. */
function cliOnlyRelease(tag) {
  return {
    release: ghRelease({ tag, assets: [ghAsset(tag, 'qa-smoke-test-PASS.md', 1200, 'https://x/qa.md')] }),
    files: {},
  };
}

// Real shape of releases on sowonlabs/crewx: old CLI tags with no installer
// asset at all (just QA report markdown files).
const OLD_CLI_RELEASES = [
  {
    tag_name: 'v0.7.8',
    name: 'v0.7.8 - Slack Thread Handling & Node Version Requirement',
    draft: false,
    prerelease: false,
    published_at: '2025-12-17T22:25:53Z',
    html_url: 'https://github.com/sowonlabs/crewx/releases/tag/v0.7.8',
    assets: [],
  },
  {
    tag_name: 'v0.7.7',
    name: '0.7.7 - Maintenance Release',
    draft: false,
    prerelease: false,
    published_at: '2025-12-10T00:00:00Z',
    html_url: 'https://github.com/sowonlabs/crewx/releases/tag/v0.7.7',
    assets: [{ name: 'qa-smoke-test-PASS.md', size: 1200, browser_download_url: 'https://x/qa.md' }],
  },
];

test('rejects any repo other than sowonlabs/crewx', async () => {
  await assert.rejects(() => buildManifest([], { owner: 'someone-else', repo: 'crewx', fetchAsset: throwingFetchAsset() }), ManifestError);
  await assert.rejects(() => buildManifest([], { owner: 'sowonlabs', repo: 'crewx-fork', fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('old CLI releases produce an honest empty manifest and are ignored, not reported as rejected', async () => {
  const rejected = [];
  const manifest = await buildManifest(OLD_CLI_RELEASES, {
    fetchAsset: throwingFetchAsset(),
    onReject: (release) => rejected.push(release.tag_name),
  });
  assert.equal(manifest.stable, null);
  assert.equal(manifest.preview, null);
  assert.equal(manifest.repo, 'sowonlabs/crewx');
  assert.deepEqual(rejected, []);
});

test('(e) a CLI-only release is ignored by the full rebuild, not thrown, and a desktop release next to it still builds', async () => {
  const cli = cliOnlyRelease('v0.8.0');
  const preview = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const rejected = [];
  await withFixtureServer(preview.files, async (fetchAsset) => {
    const manifest = await buildManifest([cli.release, preview.release], {
      fetchAsset,
      onReject: (release) => rejected.push(release.tag_name),
    });
    assert.equal(manifest.preview.tag, 'v0.9.0-rc.2');
    assert.equal(manifest.stable, null);
    assert.deepEqual(rejected, []);
  });
});

test('(e) --tag on a CLI-only release fails with a clear message', async () => {
  await rejectsWith(
    () => mergeTaggedRelease(emptyManifest(), cliOnlyRelease('v0.8.0').release, { fetchAsset: throwingFetchAsset() }),
    /is not a desktop app release/
  );
});

test('a release missing the channel metadata is rejected even with the installer present', async () => {
  const { release } = setupRelease();
  release.assets = release.assets.filter((a) => a.name !== 'latest.yml');
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /"latest\.yml"/);
});

test('a release missing the Setup installer is rejected even with the updater metadata present', async () => {
  const build = setupRelease();
  build.release.assets = build.release.assets.filter((a) => a.name !== 'CrewX-Setup-x64.exe');
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /"CrewX-Setup-x64\.exe"/);
  });
});

test('draft releases are rejected even if they have every required asset', async () => {
  const { release } = setupRelease({ draft: true });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /is a draft release/);
});

test('a generic Setup.exe is rejected: only the exact channel installer names qualify', async () => {
  const build = setupRelease({ installerName: 'Setup.exe' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /is not an installer name for the stable channel/);
  });
});

test('R1 repro: ARM64 installer + mac updater metadata is rejected even though both are plausibly named', async () => {
  const { release } = setupRelease({ installerName: 'CrewX-Setup-0.9.0-arm64.exe', metadataName: 'latest-mac.yml' });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /"latest\.yml"/);
});

test('a metadata file with an unexpected name (latest-linux.yml) is rejected', async () => {
  const { release } = setupRelease({ metadataName: 'latest-linux.yml' });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /"latest\.yml"/);
});

test('R1 repro: an RC-shaped tag whose GitHub prerelease flag is false is rejected', async () => {
  const { release } = setupRelease({
    tag: 'v0.9.1-rc.1',
    prerelease: false,
    installerName: 'CrewX-Setup-rc-x64.exe',
    metadataName: 'rc.yml',
  });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /does not mark the release as a prerelease/);
});

test('a stable-shaped tag whose GitHub prerelease flag is true is rejected', async () => {
  const { release } = setupRelease({ tag: 'v0.9.0', prerelease: true });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /marks the release as a prerelease/);
});

test('an unknown prerelease channel (-beta.1) is rejected even with matching flags', async () => {
  const { release } = setupRelease({
    tag: 'v0.9.0-beta.1',
    prerelease: true,
    installerName: 'CrewX-Setup-0.9.0-beta.1-x64.exe',
    metadataName: 'rc.yml',
  });
  await rejectsWith(() => inspectRelease(release, { fetchAsset: throwingFetchAsset() }), /unknown prerelease channel/);
});

test('R1 repro: an installer asset URL pointing at a different repo is rejected', async () => {
  const build = setupRelease({
    installerUrl: 'https://github.com/sowonlabs/crewx-fork/releases/download/v0.9.0/CrewX-Setup-x64.exe',
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /installer asset URL does not point at/);
  });
});

test('metadata and app feed URLs pointing at a different repo are rejected', async () => {
  const forkMetadata = setupRelease({
    metadataUrl: 'https://github.com/sowonlabs/crewx-fork/releases/download/v0.9.0/latest.yml',
  });
  await rejectsWith(
    () => inspectRelease(forkMetadata.release, { fetchAsset: throwingFetchAsset() }),
    /updater metadata asset URL does not point at/
  );

  const forkFeed = appOnlyRelease({ tag: 'v0.9.1' });
  forkFeed.release.assets[0].browser_download_url =
    'https://github.com/sowonlabs/crewx-fork/releases/download/v0.9.1/latest-app.yml';
  await rejectsWith(() => inspectRelease(forkFeed.release, { fetchAsset: throwingFetchAsset() }), /app feed asset URL does not point at/);
});

test('a valid stable release verifies against its real streamed bytes and populates stable only', async () => {
  const build = setupRelease({ tag: 'v0.9.0' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await buildManifest([...OLD_CLI_RELEASES, build.release], { fetchAsset });
    assert.equal(manifest.stable.tag, 'v0.9.0');
    assert.equal(manifest.stable.windows.assetName, 'CrewX-Setup-x64.exe');
    assert.equal(manifest.stable.windows.releaseTag, 'v0.9.0');
    assert.equal(manifest.stable.windows.shellVersion, '0.9.0');
    assert.equal(manifest.preview, null);
  });
});

test('(a) a preview release with CrewX-Setup-rc-x64.exe + rc.yml verifies into preview; app and shell versions may differ', async () => {
  const build = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await buildManifest([build.release], { fetchAsset });
    assert.equal(manifest.stable, null);
    assert.deepEqual(manifest.preview, {
      tag: 'v0.9.0-rc.2',
      version: '0.9.0-rc.2',
      name: 'CrewX Desktop 0.9.0-rc.2',
      prerelease: true,
      publishedAt: '2026-09-01T00:00:00Z',
      htmlUrl: 'https://github.com/sowonlabs/crewx/releases/tag/v0.9.0-rc.2',
      windows: {
        assetName: 'CrewX-Setup-rc-x64.exe',
        url: githubAssetUrl('v0.9.0-rc.2', 'CrewX-Setup-rc-x64.exe'),
        sizeBytes: build.files['v0.9.0-rc.2/CrewX-Setup-rc-x64.exe'].length,
        releaseTag: 'v0.9.0-rc.2',
        shellVersion: '0.9.0-rc.3',
      },
    });
  });
});

test('(d) the legacy installer name CrewX-Setup-<shell>-x64.exe still verifies when the metadata path names it', async () => {
  const legacy = 'CrewX-Setup-0.9.0-rc.220-x64.exe';
  const build = setupRelease({ tag: 'v0.9.0-rc.220', prerelease: true, installerName: legacy });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await buildManifest([build.release], { fetchAsset });
    assert.equal(manifest.preview.version, '0.9.0-rc.220');
    assert.equal(manifest.preview.windows.assetName, legacy);
    assert.equal(manifest.preview.windows.releaseTag, 'v0.9.0-rc.220');
    assert.equal(manifest.preview.windows.shellVersion, '0.9.0-rc.220');
  });
});

test('(d) a metadata path that is neither allowed name for its channel is rejected', async () => {
  for (const path of ['CrewX-Setup-0.9.0-x64.exe', 'CrewX-Setup-rc-arm64.exe', 'Setup.exe']) {
    const build = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3', installerName: path });
    await withFixtureServer(build.files, async (fetchAsset) => {
      await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /is not an installer name for the preview channel/);
    });
  }
});

test('(d) channel mismatches are rejected: stable naming CrewX-Setup-rc-x64.exe, preview naming CrewX-Setup-x64.exe', async () => {
  const stableWithRc = setupRelease({ tag: 'v0.9.0', installerName: 'CrewX-Setup-rc-x64.exe' });
  const previewWithStable = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, installerName: 'CrewX-Setup-x64.exe' });
  await withFixtureServer({ ...stableWithRc.files, ...previewWithStable.files }, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(stableWithRc.release, { fetchAsset }), /is not an installer name for the stable channel/);
    await rejectsWith(() => inspectRelease(previewWithStable.release, { fetchAsset }), /is not an installer name for the preview channel/);
  });
});

test('(c) --tag: a stable release verifies into stable and leaves an existing preview entry unchanged', async () => {
  const preview = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const stable = setupRelease({ tag: 'v0.9.0' });
  await withFixtureServer({ ...preview.files, ...stable.files }, async (fetchAsset) => {
    const initial = await buildManifest([preview.release], { fetchAsset });
    const updated = await mergeTaggedRelease(initial, stable.release, {
      fetchAsset,
      fetchApi: apiServing(preview.release),
    });
    assert.equal(updated.stable.tag, 'v0.9.0');
    assert.equal(updated.stable.windows.assetName, 'CrewX-Setup-x64.exe');
    assert.equal(updated.stable.windows.releaseTag, 'v0.9.0');
    assert.deepEqual(updated.preview, initial.preview);
  });
});

test('(b) --tag: an app-only preview release with --setup-tag reuses that Setup and keeps its own version', async () => {
  const setup = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  await withFixtureServer(setup.files, async (fetchAsset) => {
    const initial = await buildManifest([setup.release], { fetchAsset });
    const updated = await mergeTaggedRelease(initial, appOnly.release, {
      fetchAsset,
      fetchApi: apiServing(setup.release),
      setupTag: 'v0.9.0-rc.2',
    });
    assert.equal(updated.preview.tag, 'v0.9.0-rc.3');
    assert.equal(updated.preview.version, '0.9.0-rc.3');
    assert.equal(updated.preview.htmlUrl, 'https://github.com/sowonlabs/crewx/releases/tag/v0.9.0-rc.3');
    assert.equal(updated.preview.windows.releaseTag, 'v0.9.0-rc.2');
    assert.equal(updated.preview.windows.url, githubAssetUrl('v0.9.0-rc.2', 'CrewX-Setup-rc-x64.exe'));
    assert.equal(updated.preview.windows.assetName, 'CrewX-Setup-rc-x64.exe');
    assert.equal(updated.preview.windows.shellVersion, '0.9.0-rc.3');
  });
});

test('(b) full rebuild: an app-only release shows its own version with the Setup of the newest verified Setup source', async () => {
  const setup = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  await withFixtureServer(setup.files, async (fetchAsset) => {
    const manifest = await buildManifest([appOnly.release, setup.release], { fetchAsset });
    assert.equal(manifest.preview.version, '0.9.0-rc.3');
    assert.equal(manifest.preview.windows.releaseTag, 'v0.9.0-rc.2');
    assert.equal(manifest.preview.windows.url, githubAssetUrl('v0.9.0-rc.2', 'CrewX-Setup-rc-x64.exe'));
  });
});

test('an app-only release with no Setup source anywhere leaves its channel null in the full rebuild', async () => {
  const manifest = await buildManifest([appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true }).release], {
    fetchAsset: throwingFetchAsset(),
  });
  assert.equal(manifest.preview, null);
});

test('(b) --tag: an app-only release with no reachable Setup source fails', async () => {
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  await rejectsWith(
    () => mergeTaggedRelease(emptyManifest(), appOnly.release, { fetchAsset: throwingFetchAsset(), fetchApi: apiServing() }),
    /pass --setup-tag/
  );
  await assert.rejects(
    () => mergeTaggedRelease(emptyManifest(), appOnly.release, {
      fetchAsset: throwingFetchAsset(),
      fetchApi: apiServing(),
      setupTag: 'v0.9.0-rc.2',
    }),
    /404/
  );
  const otherAppOnly = appOnlyRelease({ tag: 'v0.9.0-rc.2', prerelease: true });
  await rejectsWith(
    () => mergeTaggedRelease(emptyManifest(), appOnly.release, {
      fetchAsset: throwingFetchAsset(),
      fetchApi: apiServing(otherAppOnly.release),
      setupTag: 'v0.9.0-rc.2',
    }),
    /does not host a verified preview Setup/
  );
});

test('(f) --setup-asset must equal the verified updater metadata path exactly', async () => {
  const setup = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  const api = apiServing(setup.release);
  await withFixtureServer(setup.files, async (fetchAsset) => {
    await rejectsWith(
      () => mergeTaggedRelease(emptyManifest(), appOnly.release, {
        fetchAsset,
        fetchApi: api,
        setupTag: 'v0.9.0-rc.2',
        setupAsset: 'CrewX-Setup-0.9.0-rc.3-x64.exe',
      }),
      /does not match the verified updater metadata path "CrewX-Setup-rc-x64\.exe"/
    );
    await rejectsWith(
      () => mergeTaggedRelease(emptyManifest(), setup.release, { fetchAsset, fetchApi: api, setupAsset: 'CrewX-Setup-x64.exe' }),
      /does not match the verified updater metadata path/
    );
    const accepted = await mergeTaggedRelease(emptyManifest(), appOnly.release, {
      fetchAsset,
      fetchApi: api,
      setupTag: 'v0.9.0-rc.2',
      setupAsset: 'CrewX-Setup-rc-x64.exe',
    });
    assert.equal(accepted.preview.windows.assetName, 'CrewX-Setup-rc-x64.exe');
  });
});

test('--setup-tag that fails verification is reported with the tag it names', async () => {
  const setup = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  const broken = { ...setup.release, assets: setup.release.assets.filter((a) => a.name !== 'rc.yml') };
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  await rejectsWith(
    () => mergeTaggedRelease(emptyManifest(), appOnly.release, {
      fetchAsset: throwingFetchAsset(),
      fetchApi: apiServing(broken),
      setupTag: 'v0.9.0-rc.2',
    }),
    /--setup-tag v0\.9\.0-rc\.2 does not verify: .*"rc\.yml"/
  );
});

test('(f) --setup-tag naming a release of another channel is rejected', async () => {
  const stable = setupRelease({ tag: 'v0.9.0' });
  const appOnly = appOnlyRelease({ tag: 'v0.9.0-rc.3', prerelease: true });
  await withFixtureServer(stable.files, async (fetchAsset) => {
    await rejectsWith(
      () => mergeTaggedRelease(emptyManifest(), appOnly.release, {
        fetchAsset,
        fetchApi: apiServing(stable.release),
        setupTag: 'v0.9.0',
      }),
      /must come from the same channel/
    );
  });
});

test('--tag uses the release\'s own verified Setup as the Setup source when --setup-tag is absent', async () => {
  const build = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await mergeTaggedRelease(emptyManifest(), build.release, { fetchAsset });
    assert.equal(manifest.preview.windows.releaseTag, 'v0.9.0-rc.2');
    assert.equal(manifest.preview.windows.shellVersion, '0.9.0-rc.3');
  });
});

test('full rebuild: a newer release whose own Setup fails verification is rejected, and the older valid release is used', async () => {
  const good = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.2' });
  const bytes = Buffer.from('rc3-installer-bytes');
  const bad = setupRelease({
    tag: 'v0.9.0-rc.3',
    prerelease: true,
    exeBytes: bytes,
    yamlText: updaterYaml({
      version: '0.9.0-rc.3',
      path: 'CrewX-Setup-rc-x64.exe',
      sha512: sha512Base64(Buffer.from('other-bytes')),
      size: bytes.length,
    }),
  });
  const rejected = [];
  await withFixtureServer({ ...good.files, ...bad.files }, async (fetchAsset) => {
    const manifest = await buildManifest([bad.release, good.release], {
      fetchAsset,
      onReject: (release, err) => rejected.push([release.tag_name, err.message]),
    });
    assert.equal(manifest.preview.tag, 'v0.9.0-rc.2');
    assert.equal(manifest.preview.windows.releaseTag, 'v0.9.0-rc.2');
    assert.deepEqual(rejected.map(([tag]) => tag), ['v0.9.0-rc.3']);
    assert.match(rejected[0][1], /sha512 does not match updater metadata/);
  });
});

test('full rebuild picks the newest valid release per channel by semver, not publish date', async () => {
  const older = setupRelease({ tag: 'v0.9.2' });
  const newer = setupRelease({ tag: 'v0.9.10' });
  // publish date deliberately out of order with semver order
  older.release.published_at = '2026-09-15T00:00:00Z';
  newer.release.published_at = '2026-08-01T00:00:00Z';
  await withFixtureServer({ ...older.files, ...newer.files }, async (fetchAsset) => {
    const manifest = await buildManifest([older.release, newer.release], { fetchAsset });
    assert.equal(manifest.stable.tag, 'v0.9.10');
  });
});

test('R1 repro: updater metadata sha512 not matching the streamed installer bytes is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-sha-mismatch');
  const build = setupRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({ version: '0.9.0', path: 'CrewX-Setup-x64.exe', sha512: sha512Base64(Buffer.from('not-the-real-installer')), size: bytes.length }),
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /sha512 does not match updater metadata/);
  });
});

test('R1 repro: updater metadata size not matching the GitHub-reported asset size is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-size-mismatch');
  const build = setupRelease({
    exeBytes: bytes,
    installerSize: bytes.length + 999, // GitHub asset.size disagrees with the real bytes
    yamlText: updaterYaml({ version: '0.9.0', path: 'CrewX-Setup-x64.exe', sha512: sha512Base64(bytes), size: bytes.length }),
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /does not match GitHub asset size/);
  });
});

test('R1 repro: updater metadata naming a different Setup (arm64) than the installer is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-arm64-path');
  const build = setupRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({ version: '0.9.0', path: 'CrewX-Setup-0.9.0-arm64.exe', sha512: sha512Base64(bytes), size: bytes.length }),
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /is not an installer name for the stable channel/);
  });
});

test('a top-level sha512 disagreeing with its own files[] entry is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-top-sha');
  const build = setupRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({
      version: '0.9.0',
      path: 'CrewX-Setup-x64.exe',
      sha512: sha512Base64(bytes),
      size: bytes.length,
      topSha512: sha512Base64(Buffer.from('something-else')),
    }),
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /top-level sha512 does not match/);
  });
});

test('a shell version that is not strict semver is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-nightly');
  const build = setupRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({ version: 'nightly', path: 'CrewX-Setup-x64.exe', sha512: sha512Base64(bytes), size: bytes.length }),
  });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /is not strict semver/);
  });
});

test('malformed updater metadata YAML is rejected', async () => {
  const build = setupRelease({ yamlText: 'this is { not : valid\n  at all\n' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    await rejectsWith(() => inspectRelease(build.release, { fetchAsset }), /malformed/);
  });
});

test('mergeTaggedRelease rejects a tag from the wrong repo', async () => {
  const { release } = setupRelease();
  await assert.rejects(
    () => mergeTaggedRelease(emptyManifest(), release, { owner: 'sowonlabs', repo: 'crewx-desktop', fetchAsset: throwingFetchAsset() }),
    ManifestError
  );
});

test('mergeTaggedRelease rejects a draft tag', async () => {
  const { release } = setupRelease({ draft: true });
  await rejectsWith(() => mergeTaggedRelease(emptyManifest(), release, { fetchAsset: throwingFetchAsset() }), /is a draft release/);
});

test('mergeTaggedRelease refuses to move a channel backwards in semver order', async () => {
  const existing = setupRelease({ tag: 'v0.9.2' });
  const lower = setupRelease({ tag: 'v0.9.0' });
  await withFixtureServer({ ...existing.files, ...lower.files }, async (fetchAsset) => {
    const manifest = await buildManifest([existing.release], { fetchAsset });
    await rejectsWith(() => mergeTaggedRelease(manifest, lower.release, { fetchAsset }), /refusing to move stable backwards/);
  });
});

test('mergeTaggedRelease allows re-verifying the same tag without treating it as a downgrade', async () => {
  const build = setupRelease({ tag: 'v0.9.0' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await buildManifest([build.release], { fetchAsset });
    const updated = await mergeTaggedRelease(manifest, build.release, { fetchAsset });
    assert.equal(updated.stable.tag, 'v0.9.0');
  });
});

test('mergeTaggedRelease updates only the matching channel and re-verifies the retained one against GitHub', async () => {
  const stable = setupRelease({ tag: 'v0.9.0' });
  const preview = setupRelease({ tag: 'v0.9.1-rc.1', prerelease: true });
  await withFixtureServer({ ...stable.files, ...preview.files }, async (fetchAsset) => {
    const manifest = await buildManifest([stable.release], { fetchAsset });
    const fetchApi = async (path) => {
      assert.match(path, /releases\/tags\/v0\.9\.0$/);
      return stable.release;
    };
    const updated = await mergeTaggedRelease(manifest, preview.release, { fetchAsset, fetchApi });
    assert.equal(updated.stable.tag, 'v0.9.0');
    assert.equal(updated.preview.tag, 'v0.9.1-rc.1');
  });
});

test('mergeTaggedRelease throws rather than carrying the retained channel forward without fetchApi', async () => {
  const stable = setupRelease({ tag: 'v0.9.0' });
  const preview = setupRelease({ tag: 'v0.9.1-rc.1', prerelease: true });
  await withFixtureServer({ ...stable.files, ...preview.files }, async (fetchAsset) => {
    const manifest = await buildManifest([stable.release], { fetchAsset });
    await rejectsWith(() => mergeTaggedRelease(manifest, preview.release, { fetchAsset }), /without fetchApi/);
  });
});

test('mergeTaggedRelease propagates rejection when the retained channel no longer verifies on GitHub', async () => {
  const stable = setupRelease({ tag: 'v0.9.0' });
  const preview = setupRelease({ tag: 'v0.9.1-rc.1', prerelease: true });
  await withFixtureServer({ ...stable.files, ...preview.files }, async (fetchAsset) => {
    const manifest = await buildManifest([stable.release], { fetchAsset });
    const brokenStable = { ...stable.release, assets: [] }; // e.g. someone deleted the assets since
    await rejectsWith(
      () => mergeTaggedRelease(manifest, preview.release, { fetchAsset, fetchApi: apiServing(brokenStable) }),
      /no longer verifies as a stable desktop release/
    );
  });
});

test('the retained channel is re-verified at its windows.releaseTag, which can differ from its own tag', async () => {
  const stableSetup = setupRelease({ tag: 'v0.9.0' });
  const stableAppOnly = appOnlyRelease({ tag: 'v0.9.1' });
  const preview = setupRelease({ tag: 'v0.9.0-rc.2', prerelease: true, shellVersion: '0.9.0-rc.3' });
  await withFixtureServer({ ...stableSetup.files, ...preview.files }, async (fetchAsset) => {
    const initial = await buildManifest([stableSetup.release, stableAppOnly.release, preview.release], { fetchAsset });
    assert.equal(initial.stable.tag, 'v0.9.1');
    assert.equal(initial.stable.windows.releaseTag, 'v0.9.0');

    const updated = await mergeTaggedRelease(initial, preview.release, {
      fetchAsset,
      fetchApi: apiServing(stableAppOnly.release, stableSetup.release),
    });
    assert.deepEqual(updated.stable, initial.stable);

    // The Setup source has disappeared from GitHub: the merge must fail, not carry it forward.
    await assert.rejects(
      () => mergeTaggedRelease(initial, preview.release, { fetchAsset, fetchApi: apiServing(stableAppOnly.release) }),
      /404/
    );
    // The Setup source is still there but no longer verifies.
    const brokenSetup = { ...stableSetup.release, assets: stableSetup.release.assets.filter((a) => a.name !== 'latest.yml') };
    await rejectsWith(
      () => mergeTaggedRelease(initial, preview.release, { fetchAsset, fetchApi: apiServing(stableAppOnly.release, brokenSetup) }),
      /retained stable Setup source v0\.9\.0 no longer verifies/
    );
  });
});

test('a retained entry written before windows.releaseTag existed is re-verified on its own tag', async () => {
  const legacyName = 'CrewX-Setup-0.9.0-rc.220-x64.exe';
  const legacy = setupRelease({ tag: 'v0.9.0-rc.220', prerelease: true, installerName: legacyName });
  const stable = setupRelease({ tag: 'v0.9.0' });
  // The shape data/download-manifest.json has today: no releaseTag, no shellVersion.
  const existing = {
    generatedAt: 'x',
    repo: 'sowonlabs/crewx',
    stable: null,
    preview: {
      tag: 'v0.9.0-rc.220',
      version: '0.9.0-rc.220',
      name: 'CrewX Desktop 0.9.0-rc.220',
      prerelease: true,
      publishedAt: '2026-09-01T00:00:00Z',
      htmlUrl: 'https://github.com/sowonlabs/crewx/releases/tag/v0.9.0-rc.220',
      windows: {
        assetName: legacyName,
        url: githubAssetUrl('v0.9.0-rc.220', legacyName),
        sizeBytes: legacy.files[`v0.9.0-rc.220/${legacyName}`].length,
      },
    },
  };
  await withFixtureServer({ ...legacy.files, ...stable.files }, async (fetchAsset) => {
    const updated = await mergeTaggedRelease(existing, stable.release, { fetchAsset, fetchApi: apiServing(legacy.release) });
    assert.equal(updated.stable.tag, 'v0.9.0');
    assert.equal(updated.preview.windows.assetName, legacyName);
    assert.equal(updated.preview.windows.releaseTag, 'v0.9.0-rc.220');
    assert.equal(updated.preview.windows.shellVersion, '0.9.0-rc.220');
  });
});

test('ownSetupCandidate lists only releases that host their own Setup (find-newer-release.mjs relies on this)', () => {
  assert.equal(ownSetupCandidate(setupRelease({ tag: 'v0.9.0' }).release)?.tag, 'v0.9.0');
  assert.equal(ownSetupCandidate(appOnlyRelease({ tag: 'v0.9.1' }).release), null);
  assert.equal(ownSetupCandidate(setupRelease({ tag: 'v0.9.2', draft: true }).release), null);
  assert.equal(ownSetupCandidate(cliOnlyRelease('v0.8.0').release), null);
});

test('parseArgs accepts --tag with --setup-tag, --setup-asset and --out', () => {
  const args = parseArgs(['--tag', 'v0.9.0-rc.3', '--setup-tag', 'v0.9.0-rc.2', '--setup-asset', 'CrewX-Setup-rc-x64.exe', '--out', '/tmp/m.json']);
  assert.equal(args.tag, 'v0.9.0-rc.3');
  assert.equal(args.setupTag, 'v0.9.0-rc.2');
  assert.equal(args.setupAsset, 'CrewX-Setup-rc-x64.exe');
  assert.equal(args.out, '/tmp/m.json');
  assert.equal(args.owner, OWNER);
  assert.equal(args.repo, REPO);
});

test('parseArgs rejects setup flags without --tag, flags without a value, and unknown arguments', () => {
  assert.throws(() => parseArgs(['--setup-tag', 'v0.9.0']), /only apply together with --tag/);
  assert.throws(() => parseArgs(['--tag', 'v0.9.0', '--setup-asset']), /--setup-asset needs a value/);
  assert.throws(() => parseArgs(['--tag', '--setup-tag', 'v0.9.0']), /--tag needs a value/);
  assert.throws(() => parseArgs(['--tag', '']), /--tag needs a value/);
  assert.throws(() => parseArgs(['--bogus']), /unknown argument: --bogus/);
});
