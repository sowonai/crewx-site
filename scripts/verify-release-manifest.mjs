/**
 * Tests for scripts/lib/release-manifest.mjs, including the R1 review
 * (tsk_5ou5a10a) reproductions: an ARM64 installer paired with mac updater
 * metadata, an RC tag whose GitHub prerelease flag disagrees with its
 * version, a tag that would downgrade a channel, an asset URL pointing at a
 * different repo, and updater metadata whose Setup/version/size/sha512
 * don't match the real bytes. Byte-level tests run a real local HTTP server
 * so the SHA-512 streaming path in the library actually executes against
 * real bytes over a real socket, not an in-memory stub.
 *
 * Run with: node --test scripts/verify-release-manifest.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import {
  buildManifest,
  mergeTaggedRelease,
  verifyDesktopRelease,
  toDesktopRelease,
  ManifestError,
} from './lib/release-manifest.mjs';

const OWNER = 'sowonlabs';
const REPO = 'crewx';

function sha512Base64(buf) {
  return createHash('sha512').update(buf).digest('base64');
}

function githubAssetUrl(tag, name) {
  return `https://github.com/${OWNER}/${REPO}/releases/download/${tag}/${name}`;
}

function updaterYaml({ version, assetName, sha512, size, filesLine, topSha512 }) {
  const line = filesLine ?? `  - url: ${assetName}\n    sha512: ${sha512}\n    size: ${size}\n`;
  return (
    `version: ${version}\n` +
    `files:\n${line}` +
    `path: ${assetName}\n` +
    `sha512: ${topSha512 ?? sha512}\n` +
    `releaseDate: '2026-09-01T00:00:00.000Z'\n`
  );
}

/**
 * Real local HTTP server keyed by "tag/filename" — exercises real streaming,
 * not a mock. Keying on the filename alone would collide: every stable
 * release's metadata asset is named exactly "latest.yml", so two different
 * releases' fixtures need their own tag-scoped slot.
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
  return async () => {
    throw new Error('fetchAsset must not be called — this release should be rejected by shape checks alone');
  };
}

/** Builds a GitHub release object plus the fixture files it references. */
function desktopRelease({
  tag = 'v0.9.0',
  version = '0.9.0',
  prerelease = false,
  draft = false,
  assetName,
  metadataName = 'latest.yml',
  assetUrl,
  metadataUrl,
  extraAssets = [],
  installerSize,
  yamlText,
  exeBytes,
} = {}) {
  const name = assetName ?? `CrewX-Setup-${version}-x64.exe`;
  const bytes = exeBytes ?? Buffer.from(`fake-installer-bytes-for-${tag}-${name}`);
  const sha = sha512Base64(bytes);
  const size = installerSize ?? bytes.length;
  const yaml = yamlText ?? updaterYaml({ version, assetName: name, sha512: sha, size: bytes.length });
  return {
    release: {
      tag_name: tag,
      name: `CrewX Desktop ${version}`,
      draft,
      prerelease,
      published_at: '2026-09-01T00:00:00Z',
      html_url: `https://github.com/${OWNER}/${REPO}/releases/tag/${tag}`,
      assets: [
        { name, size, browser_download_url: assetUrl ?? githubAssetUrl(tag, name) },
        { name: metadataName, size: yaml.length, browser_download_url: metadataUrl ?? githubAssetUrl(tag, metadataName) },
        ...extraAssets,
      ],
    },
    files: { [`${tag}/${name}`]: bytes, [`${tag}/${metadataName}`]: yaml },
  };
}

// Real shape of every release currently on sowonlabs/crewx: old CLI tags
// with no installer asset at all (just QA report markdown files).
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

test('old CLI releases with no installer asset produce an honest empty manifest', async () => {
  const manifest = await buildManifest(OLD_CLI_RELEASES, { fetchAsset: throwingFetchAsset() });
  assert.equal(manifest.stable, null);
  assert.equal(manifest.preview, null);
  assert.equal(manifest.repo, 'sowonlabs/crewx');
});

test('a release missing the updater metadata file is excluded even with the exact installer name present', () => {
  const { release } = desktopRelease();
  release.assets = release.assets.filter((a) => a.name !== 'latest.yml');
  assert.equal(toDesktopRelease(release), null);
});

test('a release missing the Setup.exe is excluded even with updater metadata present', () => {
  const { release } = desktopRelease();
  release.assets = release.assets.filter((a) => a.name !== 'CrewX-Setup-0.9.0-x64.exe');
  assert.equal(toDesktopRelease(release), null);
});

test('draft releases are excluded even if they have both required assets', () => {
  const { release } = desktopRelease({ draft: true });
  assert.equal(toDesktopRelease(release), null);
});

test('a generic Setup.exe (old loose match) is rejected — only the exact versioned x64 filename qualifies', async () => {
  const { release } = desktopRelease({ assetName: 'Setup.exe' });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('R1 repro: ARM64 installer + mac updater metadata is rejected even though both are plausibly named', async () => {
  const { release } = desktopRelease({
    assetName: 'CrewX-Setup-0.9.0-arm64.exe',
    metadataName: 'latest-mac.yml',
  });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('a metadata file with an unexpected name (e.g. latest-linux.yml) is rejected', async () => {
  const { release } = desktopRelease({ metadataName: 'latest-linux.yml' });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('R1 repro: an RC-shaped tag whose GitHub prerelease flag is false is rejected', async () => {
  const { release } = desktopRelease({
    tag: 'v0.9.1-rc.1',
    version: '0.9.1-rc.1',
    prerelease: false,
    metadataName: 'rc.yml',
  });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('a stable-shaped tag whose GitHub prerelease flag is true is rejected', async () => {
  const { release } = desktopRelease({ tag: 'v0.9.0', version: '0.9.0', prerelease: true });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('an unknown prerelease channel (-beta.1) is rejected even with matching flags', async () => {
  const { release } = desktopRelease({
    tag: 'v0.9.0-beta.1',
    version: '0.9.0-beta.1',
    prerelease: true,
    assetName: 'CrewX-Setup-0.9.0-beta.1-x64.exe',
    metadataName: 'rc.yml',
  });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('R1 repro: an installer asset URL pointing at a different repo is rejected', async () => {
  const { release } = desktopRelease({
    assetUrl: 'https://github.com/sowonlabs/crewx-fork/releases/download/v0.9.0/CrewX-Setup-0.9.0-x64.exe',
  });
  await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('a valid stable release verifies against its real streamed bytes and populates stable only', async () => {
  const { release, files } = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  await withFixtureServer(files, async (fetchAsset) => {
    const manifest = await buildManifest([...OLD_CLI_RELEASES, release], { fetchAsset });
    assert.ok(manifest.stable);
    assert.equal(manifest.stable.tag, 'v0.9.0');
    assert.equal(manifest.stable.windows.assetName, 'CrewX-Setup-0.9.0-x64.exe');
    assert.equal(manifest.preview, null);
  });
});

test('a valid rc prerelease verifies and populates preview, not stable', async () => {
  const { release, files } = desktopRelease({
    tag: 'v0.9.1-rc.1',
    version: '0.9.1-rc.1',
    prerelease: true,
    metadataName: 'rc.yml',
  });
  await withFixtureServer(files, async (fetchAsset) => {
    const manifest = await buildManifest([release], { fetchAsset });
    assert.equal(manifest.stable, null);
    assert.ok(manifest.preview);
    assert.equal(manifest.preview.tag, 'v0.9.1-rc.1');
  });
});

test('picks the newest valid release per channel by semver, not publish date', async () => {
  const older = desktopRelease({ tag: 'v0.9.2', version: '0.9.2' });
  const newer = desktopRelease({ tag: 'v0.9.10', version: '0.9.10' });
  // publish date deliberately out of order with semver order
  older.release.published_at = '2026-09-15T00:00:00Z';
  newer.release.published_at = '2026-08-01T00:00:00Z';
  await withFixtureServer({ ...older.files, ...newer.files }, async (fetchAsset) => {
    const manifest = await buildManifest([older.release, newer.release], { fetchAsset });
    assert.equal(manifest.stable.tag, 'v0.9.10');
  });
});

test('R1 repro: updater metadata sha512 not matching the real streamed installer bytes is rejected', async () => {
  const wrongHash = sha512Base64(Buffer.from('not-the-real-installer'));
  const { release, files } = desktopRelease({
    yamlText: updaterYaml({ version: '0.9.0', assetName: 'CrewX-Setup-0.9.0-x64.exe', sha512: wrongHash, size: 42 }),
  });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('R1 repro: updater metadata size not matching the GitHub-reported asset size is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-v0.9.0-CrewX-Setup-0.9.0-x64.exe');
  const sha = sha512Base64(bytes);
  const { release, files } = desktopRelease({
    exeBytes: bytes,
    installerSize: bytes.length + 999, // GitHub asset.size disagrees with the real bytes
    yamlText: updaterYaml({ version: '0.9.0', assetName: 'CrewX-Setup-0.9.0-x64.exe', sha512: sha, size: bytes.length }),
  });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('R1 repro: updater metadata pointing at a different version is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-v0.9.0-CrewX-Setup-0.9.0-x64.exe');
  const { release, files } = desktopRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({ version: '0.8.0', assetName: 'CrewX-Setup-0.9.0-x64.exe', sha512: sha512Base64(bytes), size: bytes.length }),
  });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('R1 repro: updater metadata pointing at a different Setup filename is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-v0.9.0-CrewX-Setup-0.9.0-x64.exe');
  const { release, files } = desktopRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({ version: '0.9.0', assetName: 'CrewX-Setup-0.9.0-arm64.exe', sha512: sha512Base64(bytes), size: bytes.length }),
  });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('a top-level sha512 disagreeing with its own files[] entry is rejected', async () => {
  const bytes = Buffer.from('fake-installer-bytes-for-v0.9.0-CrewX-Setup-0.9.0-x64.exe');
  const realSha = sha512Base64(bytes);
  const { release, files } = desktopRelease({
    exeBytes: bytes,
    yamlText: updaterYaml({
      version: '0.9.0',
      assetName: 'CrewX-Setup-0.9.0-x64.exe',
      sha512: realSha,
      size: bytes.length,
      topSha512: sha512Base64(Buffer.from('something-else')),
    }),
  });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('malformed updater metadata YAML is rejected', async () => {
  const { release, files } = desktopRelease({ yamlText: 'this is { not : valid\n  at all\n' });
  await withFixtureServer(files, async (fetchAsset) => {
    await assert.rejects(() => verifyDesktopRelease(release, { fetchAsset }), ManifestError);
  });
});

test('mergeTaggedRelease rejects a tag from the wrong repo', async () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  const { release } = desktopRelease();
  await assert.rejects(
    () => mergeTaggedRelease(manifest, release, { owner: 'sowonlabs', repo: 'crewx-desktop', fetchAsset: throwingFetchAsset() }),
    ManifestError
  );
});

test('mergeTaggedRelease rejects a tag missing required assets instead of writing a dead link', async () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  const { release } = desktopRelease();
  release.assets = [];
  await assert.rejects(() => mergeTaggedRelease(manifest, release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('mergeTaggedRelease rejects a draft tag', async () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  const { release } = desktopRelease({ draft: true });
  await assert.rejects(() => mergeTaggedRelease(manifest, release, { fetchAsset: throwingFetchAsset() }), ManifestError);
});

test('R1 repro: mergeTaggedRelease refuses to move a channel backwards in semver order', async () => {
  const existingStable = desktopRelease({ tag: 'v0.9.2', version: '0.9.2' });
  const lowerTag = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  await withFixtureServer({ ...existingStable.files, ...lowerTag.files }, async (fetchAsset) => {
    const manifest = await buildManifest([existingStable.release], { fetchAsset });
    await assert.rejects(() => mergeTaggedRelease(manifest, lowerTag.release, { fetchAsset }), ManifestError);
  });
});

test('mergeTaggedRelease allows re-verifying the same tag without treating it as a downgrade', async () => {
  const build = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  await withFixtureServer(build.files, async (fetchAsset) => {
    const manifest = await buildManifest([build.release], { fetchAsset });
    const updated = await mergeTaggedRelease(manifest, build.release, { fetchAsset });
    assert.equal(updated.stable.tag, 'v0.9.0');
  });
});

test('mergeTaggedRelease updates only the matching channel and re-verifies the retained one against GitHub', async () => {
  const stableBuild = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  const previewBuild = desktopRelease({
    tag: 'v0.9.1-rc.1',
    version: '0.9.1-rc.1',
    prerelease: true,
    metadataName: 'rc.yml',
  });
  const allFiles = { ...stableBuild.files, ...previewBuild.files };
  await withFixtureServer(allFiles, async (fetchAsset) => {
    const manifest = await buildManifest([stableBuild.release], { fetchAsset });
    const fetchApi = async (path) => {
      assert.match(path, /releases\/tags\/v0\.9\.0$/);
      return stableBuild.release;
    };
    const updated = await mergeTaggedRelease(manifest, previewBuild.release, { fetchAsset, fetchApi });
    assert.equal(updated.stable.tag, 'v0.9.0');
    assert.equal(updated.preview.tag, 'v0.9.1-rc.1');
  });
});

test('mergeTaggedRelease throws rather than carrying the retained channel forward without fetchApi', async () => {
  const stableBuild = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  const previewBuild = desktopRelease({
    tag: 'v0.9.1-rc.1',
    version: '0.9.1-rc.1',
    prerelease: true,
    metadataName: 'rc.yml',
  });
  await withFixtureServer({ ...stableBuild.files, ...previewBuild.files }, async (fetchAsset) => {
    const manifest = await buildManifest([stableBuild.release], { fetchAsset });
    await assert.rejects(() => mergeTaggedRelease(manifest, previewBuild.release, { fetchAsset }), ManifestError);
  });
});

test('mergeTaggedRelease propagates rejection when the retained channel no longer verifies on GitHub', async () => {
  const stableBuild = desktopRelease({ tag: 'v0.9.0', version: '0.9.0' });
  const previewBuild = desktopRelease({
    tag: 'v0.9.1-rc.1',
    version: '0.9.1-rc.1',
    prerelease: true,
    metadataName: 'rc.yml',
  });
  await withFixtureServer({ ...stableBuild.files, ...previewBuild.files }, async (fetchAsset) => {
    const manifest = await buildManifest([stableBuild.release], { fetchAsset });
    const brokenStable = { ...stableBuild.release, assets: [] }; // e.g. someone deleted the asset since
    const fetchApi = async () => brokenStable;
    await assert.rejects(() => mergeTaggedRelease(manifest, previewBuild.release, { fetchAsset, fetchApi }), ManifestError);
  });
});
