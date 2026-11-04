/**
 * Turns GitHub Releases API responses into the download manifest the
 * /download page renders from (data/download-manifest.json).
 *
 * A GitHub release can play two roles:
 *
 *  - Desktop APP release: its tag is the app version the page shows. It carries
 *    the channel app feed (latest-app.yml for stable, rc-app.yml for preview),
 *    its own verified Setup, or both.
 *  - Setup SOURCE: a release whose Windows installer and channel updater
 *    metadata (latest.yml / rc.yml) pass byte-level verification. The download
 *    link and the Setup's shell version come from it. An app-only release has
 *    the app feed and no installer, so it reuses the Setup of an older release;
 *    the link then points at that release (windows.releaseTag).
 *
 * Naming alone can lie (R1 review, tsk_5ou5a10a: an ARM64 installer paired with
 * mac metadata passed a name check). So a Setup source must have a filename the
 * channel allows, asset URLs cross-checked against this owner/repo/tag, and
 * installer bytes that stream through SHA-512 to match the updater metadata.
 * The network work sits behind injected `fetchAsset`/`fetchApi`, so it can be
 * exercised with local HTTP fixtures in scripts/verify-release-manifest.mjs.
 */
import { createHash } from 'node:crypto';

export const OWNER = 'sowonlabs';
export const REPO = 'crewx';

export class ManifestError extends Error {}

// Strict semver, plus the one prerelease shape we support: -rc.N. Anything
// else (-beta.1, -alpha, -rc without a number, ...) is an unknown channel.
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)\.(\d+))?$/;

const METADATA_FILE = { stable: 'latest.yml', preview: 'rc.yml' };
const APP_FEED_FILE = { stable: 'latest-app.yml', preview: 'rc-app.yml' };

export function assertRepo(owner, repo) {
  if (owner !== OWNER || repo !== REPO) {
    throw new ManifestError(
      `refusing to build a download manifest for ${owner}/${repo} — the only approved ` +
      `source of Desktop releases is ${OWNER}/${REPO} (see docs/cto/github.md section 9.3)`
    );
  }
}

function parseVersion(version) {
  const m = SEMVER_RE.exec(version);
  if (!m) return null;
  const [, major, minor, patch, prereleaseTag, prereleaseNum] = m;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prereleaseTag: prereleaseTag ?? null,
    prereleaseNum: prereleaseNum !== undefined ? Number(prereleaseNum) : null,
  };
}

export function compareVersions(a, b) {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (pa.major !== pb.major) return pa.major - pb.major;
  if (pa.minor !== pb.minor) return pa.minor - pb.minor;
  if (pa.patch !== pb.patch) return pa.patch - pb.patch;
  return (pa.prereleaseNum ?? 0) - (pb.prereleaseNum ?? 0);
}

function channelFor(parsedVersion, githubPrerelease) {
  if (!parsedVersion) {
    return { error: 'version is not strict semver (expected X.Y.Z or X.Y.Z-rc.N)' };
  }
  if (parsedVersion.prereleaseTag === null) {
    if (githubPrerelease) {
      return { error: 'tag looks like a stable version but GitHub marks the release as a prerelease' };
    }
    return { channel: 'stable' };
  }
  if (parsedVersion.prereleaseTag !== 'rc') {
    return { error: `unknown prerelease channel "-${parsedVersion.prereleaseTag}.${parsedVersion.prereleaseNum}" — only "-rc.N" is supported` };
  }
  if (!githubPrerelease) {
    return { error: 'tag has an -rc.N version but GitHub does not mark the release as a prerelease' };
  }
  return { channel: 'preview' };
}

/** Channel and app version of a release, from its tag and GitHub's prerelease flag. */
function releaseChannel(release) {
  const version = String(release.tag_name || '').replace(/^v/, '');
  const result = channelFor(parseVersion(version), !!release.prerelease);
  if (result.error) throw new ManifestError(result.error);
  return { version, channel: result.channel };
}

/**
 * The installer names a Setup source may use for a channel, given the shell
 * version its updater metadata reports. Mirrors crewx-ui's helper
 * scripts/windows/setup-asset-name.cjs; keep the two in sync. Releases publish
 * the versionless name now. Releases from before that switch published
 * CrewX-Setup-<shellVersion>-x64.exe, which is still accepted.
 */
export function setupInstallerNames(channel, shellVersion) {
  const versionless = { stable: 'CrewX-Setup-x64.exe', preview: 'CrewX-Setup-rc-x64.exe' }[channel];
  return [versionless, `CrewX-Setup-${shellVersion}-x64.exe`];
}

function isSetupInstallerName(name) {
  return /^CrewX-Setup.*\.exe$/i.test(name ?? '');
}

function assetUrlMatches(url, owner, repo, tag, assetName) {
  try {
    const u = new URL(url);
    return u.hostname === 'github.com' && u.pathname === `/${owner}/${repo}/releases/download/${tag}/${assetName}`;
  } catch {
    return false;
  }
}

function uniqueAsset(assets, name, what) {
  const matches = assets.filter((a) => a.name === name);
  if (matches.length !== 1) {
    throw new ManifestError(`expected exactly one ${what} asset named exactly "${name}", found ${matches.length}`);
  }
  return matches[0];
}

function releaseTagPath(owner, repo, tag) {
  return `/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(tag)}`;
}

function appFields(release, version) {
  return {
    tag: release.tag_name,
    version,
    name: release.name || release.tag_name,
    prerelease: !!release.prerelease,
    publishedAt: release.published_at || release.created_at,
    htmlUrl: release.html_url,
  };
}

/**
 * Shape-only, synchronous, no network. Used by find-newer-release.mjs to list
 * cheap candidates. Returns the app fields for a non-draft, channel-consistent
 * release that has exactly one channel metadata asset and one installer name
 * the channel allows, both on this owner/repo/tag. Returns null otherwise.
 * App-only releases return null: they need an explicit --setup-tag. Bytes are
 * checked later, by inspectRelease().
 */
export function ownSetupCandidate(release, { owner = OWNER, repo = REPO } = {}) {
  if (!release || release.draft) return null;
  let channelInfo;
  try {
    channelInfo = releaseChannel(release);
  } catch {
    return null;
  }
  const { version, channel } = channelInfo;
  const assets = release.assets || [];
  const metadata = assets.filter((a) => a.name === METADATA_FILE[channel]);
  const installers = assets.filter((a) => setupInstallerNames(channel, version).includes(a.name));
  if (metadata.length !== 1 || installers.length !== 1) return null;
  const urlsOk =
    assetUrlMatches(metadata[0].browser_download_url, owner, repo, release.tag_name, METADATA_FILE[channel]) &&
    assetUrlMatches(installers[0].browser_download_url, owner, repo, release.tag_name, installers[0].name);
  return urlsOk ? appFields(release, version) : null;
}

function stripQuotes(raw) {
  const t = raw.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1);
  }
  return t;
}

/**
 * Minimal parser for the one YAML shape electron-builder actually emits
 * (latest.yml / rc.yml): a few top-level scalars plus a `files:` list of
 * {url, sha512, size}. Not a general YAML parser — it only needs to read
 * what we generate, and it throws on anything that doesn't fit that shape.
 */
export function parseUpdaterYaml(text) {
  const lines = String(text).split(/\r?\n/);
  let version = null;
  let path = null;
  let topSha512 = null;
  const files = [];
  let inFiles = false;
  let current = null;

  for (const line of lines) {
    if (line.trim() === '') continue;
    if (inFiles) {
      const itemStart = /^\s*-\s*url:\s*(.+?)\s*$/.exec(line);
      if (itemStart) {
        if (current) files.push(current);
        current = { url: stripQuotes(itemStart[1]) };
        continue;
      }
      const kv = /^\s+([a-zA-Z0-9]+):\s*(.+?)\s*$/.exec(line);
      if (kv && current) {
        current[kv[1]] = stripQuotes(kv[2]);
        continue;
      }
      if (current) {
        files.push(current);
        current = null;
      }
      inFiles = false;
      // fall through: this line is not part of the files block, re-check it below
    }
    if (/^files:\s*$/.test(line)) {
      inFiles = true;
      continue;
    }
    const topMatch = /^([a-zA-Z0-9]+):\s*(.+?)\s*$/.exec(line);
    if (topMatch) {
      if (topMatch[1] === 'version') version = stripQuotes(topMatch[2]);
      else if (topMatch[1] === 'path') path = stripQuotes(topMatch[2]);
      else if (topMatch[1] === 'sha512') topSha512 = stripQuotes(topMatch[2]);
    }
  }
  if (current) files.push(current);

  if (!version || !path || !topSha512 || files.length === 0) {
    throw new ManifestError('updater metadata YAML is malformed or missing version/path/sha512/files');
  }
  for (const f of files) {
    if (!f.url || !f.sha512 || f.size === undefined || Number.isNaN(Number(f.size))) {
      throw new ManifestError('updater metadata YAML has a files[] entry missing url/sha512/size');
    }
    f.size = Number(f.size);
  }
  return { version, path, sha512: topSha512, files };
}

async function sha512Base64(fetchAsset, url) {
  const res = await fetchAsset(url);
  if (!res.ok) {
    throw new ManifestError(`could not download asset for hash verification (status ${res.status})`);
  }
  const hash = createHash('sha512');
  let size = 0;
  for await (const chunk of res.body) {
    hash.update(chunk);
    size += chunk.length;
  }
  return { sha512: hash.digest('base64'), size };
}

/**
 * Byte-level verification of a Setup source: the channel's updater metadata
 * and the installer it names. Never attaches an auth header — both fetches go
 * through `fetchAsset` against public release-asset URLs. Throws ManifestError.
 * The shell version (metadata `version`) only has to be strict semver; it does
 * not have to equal the app version.
 */
async function verifySetupSource(release, channel, { owner, repo, fetchAsset }) {
  const assets = release.assets || [];
  const metadataName = METADATA_FILE[channel];
  const metadataAsset = uniqueAsset(assets, metadataName, `${channel} updater metadata`);
  if (!assetUrlMatches(metadataAsset.browser_download_url, owner, repo, release.tag_name, metadataName)) {
    throw new ManifestError(`updater metadata asset URL does not point at ${owner}/${repo} tag ${release.tag_name}`);
  }

  const metaRes = await fetchAsset(metadataAsset.browser_download_url);
  if (!metaRes.ok) {
    throw new ManifestError(`could not download updater metadata (status ${metaRes.status})`);
  }
  const parsed = parseUpdaterYaml(await metaRes.text());

  if (!parseVersion(parsed.version)) {
    throw new ManifestError(`updater metadata version "${parsed.version}" is not strict semver`);
  }
  const allowed = setupInstallerNames(channel, parsed.version);
  if (!allowed.includes(parsed.path)) {
    throw new ManifestError(
      `updater metadata path "${parsed.path}" is not an installer name for the ${channel} channel ` +
      `(expected ${allowed.map((n) => `"${n}"`).join(' or ')})`
    );
  }
  const installer = uniqueAsset(assets, parsed.path, `${channel} Setup installer`);
  if (!assetUrlMatches(installer.browser_download_url, owner, repo, release.tag_name, parsed.path)) {
    throw new ManifestError(`installer asset URL does not point at ${owner}/${repo} tag ${release.tag_name}`);
  }

  const matchingFiles = parsed.files.filter((f) => f.url === parsed.path);
  if (matchingFiles.length !== 1) {
    throw new ManifestError(`updater metadata files[] must have exactly one entry named "${parsed.path}", found ${matchingFiles.length}`);
  }
  const fileEntry = matchingFiles[0];
  if (fileEntry.sha512 !== parsed.sha512) {
    throw new ManifestError('updater metadata top-level sha512 does not match its own files[] entry');
  }
  if (fileEntry.size !== installer.size) {
    throw new ManifestError(`updater metadata size ${fileEntry.size} does not match GitHub asset size ${installer.size}`);
  }

  const actual = await sha512Base64(fetchAsset, installer.browser_download_url);
  if (actual.size !== installer.size) {
    throw new ManifestError(`downloaded Setup.exe is ${actual.size} bytes, GitHub reports ${installer.size}`);
  }
  if (actual.sha512 !== fileEntry.sha512) {
    throw new ManifestError('downloaded Setup.exe sha512 does not match updater metadata — refusing to publish this link');
  }

  return {
    releaseTag: release.tag_name,
    releaseVersion: String(release.tag_name).replace(/^v/, ''),
    shellVersion: parsed.version,
    assetName: parsed.path,
    url: installer.browser_download_url,
    sizeBytes: installer.size,
  };
}

/**
 * Classifies one GitHub release. Returns one of:
 *   { status: 'cli-only' }
 *       No desktop artifacts at all (no installer, no updater metadata, no app
 *       feed). Ignored, not an error.
 *   { status: 'app', channel, app, setup }
 *       app:   the fields the entry shows (see appFields).
 *       setup: the verified Setup this release hosts, or null for an app-only release.
 * Throws ManifestError when the release carries desktop artifacts but is a
 * draft, is channel-inconsistent, has no Setup and no app feed, or fails
 * verification. Only a release that carries Setup artifacts is downloaded.
 */
export async function inspectRelease(release, { owner = OWNER, repo = REPO, fetchAsset } = {}) {
  if (!release) throw new ManifestError('release not found');
  const assets = release.assets || [];
  const hasArtifacts = assets.some(
    (a) =>
      isSetupInstallerName(a.name) ||
      Object.values(METADATA_FILE).includes(a.name) ||
      Object.values(APP_FEED_FILE).includes(a.name)
  );
  if (!hasArtifacts) return { status: 'cli-only' };
  if (release.draft) throw new ManifestError(`${release.tag_name} is a draft release`);
  const { version, channel } = releaseChannel(release);

  const feedName = APP_FEED_FILE[channel];
  const feeds = assets.filter((a) => a.name === feedName);
  if (feeds.length > 1) {
    throw new ManifestError(`expected at most one asset named exactly "${feedName}", found ${feeds.length}`);
  }
  if (feeds.length === 1 && !assetUrlMatches(feeds[0].browser_download_url, owner, repo, release.tag_name, feedName)) {
    throw new ManifestError(`app feed asset URL does not point at ${owner}/${repo} tag ${release.tag_name}`);
  }

  const hasSetupArtifacts = assets.some((a) => a.name === METADATA_FILE[channel] || isSetupInstallerName(a.name));
  const setup = hasSetupArtifacts
    ? await verifySetupSource(release, channel, { owner, repo, fetchAsset })
    : null;
  if (!setup && feeds.length === 0) {
    throw new ManifestError(
      `${release.tag_name} is not a desktop ${channel} release: no verified Setup (installer plus ${METADATA_FILE[channel]}) and no ${feedName}`
    );
  }

  return { status: 'app', channel, app: appFields(release, version), setup };
}

function toEntry(app, setup) {
  return {
    tag: app.tag,
    version: app.version,
    name: app.name,
    prerelease: app.prerelease,
    publishedAt: app.publishedAt,
    htmlUrl: app.htmlUrl,
    windows: {
      assetName: setup.assetName,
      url: setup.url,
      sizeBytes: setup.sizeBytes,
      releaseTag: setup.releaseTag,
      shellVersion: setup.shellVersion,
    },
  };
}

function newestBy(list, versionOf) {
  if (list.length === 0) return null;
  return list.reduce((a, b) => (compareVersions(versionOf(b), versionOf(a)) > 0 ? b : a));
}

function channelEntry(apps, setups) {
  const app = newestBy(apps, (a) => a.version);
  const setup = newestBy(setups, (s) => s.releaseVersion);
  return app && setup ? toEntry(app, setup) : null;
}

/**
 * Rebuilds the whole manifest from a full release list — the "honest empty
 * state" path. Per channel, the entry is the newest desktop app release
 * combined with the newest verified Setup source. Releases with no desktop
 * artifacts are ignored. Releases that fail verification are reported via
 * `onReject` and skipped, never thrown, so one bad release can't take down
 * generation for the rest. Nothing unverified is ever linked.
 *
 * Deliberately never calls GET /releases/latest — that endpoint returns the
 * newest non-prerelease release regardless of asset shape.
 */
export async function buildManifest(releases, { owner = OWNER, repo = REPO, fetchAsset, onReject } = {}) {
  assertRepo(owner, repo);
  const apps = { stable: [], preview: [] };
  const setups = { stable: [], preview: [] };
  for (const release of releases || []) {
    let inspected;
    try {
      inspected = await inspectRelease(release, { owner, repo, fetchAsset });
    } catch (err) {
      if (!(err instanceof ManifestError)) throw err;
      onReject?.(release, err);
      continue;
    }
    if (inspected.status === 'cli-only') continue;
    apps[inspected.channel].push(inspected.app);
    if (inspected.setup) setups[inspected.channel].push(inspected.setup);
  }
  return {
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    stable: channelEntry(apps.stable, setups.stable),
    preview: channelEntry(apps.preview, setups.preview),
  };
}

/**
 * Re-verifies a retained entry (the channel the --tag release does not
 * belong to) against GitHub rather than trusting the old JSON: its app
 * release, and the Setup source it names in windows.releaseTag. That source
 * can be a different release from the app's own tag.
 */
async function reverifyRetained(existing, channel, { owner, repo, fetchAsset, fetchApi }) {
  const verify = async (tag, role) => {
    try {
      return await inspectRelease(await fetchApi(releaseTagPath(owner, repo, tag)), { owner, repo, fetchAsset });
    } catch (err) {
      if (err instanceof ManifestError) {
        throw new ManifestError(`retained ${channel} ${role} ${tag} no longer verifies: ${err.message}`);
      }
      throw err;
    }
  };

  const appInspected = await verify(existing.tag, 'release');
  if (appInspected.status === 'cli-only' || appInspected.channel !== channel) {
    throw new ManifestError(`retained ${channel} release ${existing.tag} no longer verifies as a ${channel} desktop release`);
  }
  // Entries written before windows.releaseTag existed hosted their Setup on their own tag.
  const setupTag = existing.windows?.releaseTag ?? existing.tag;
  const setupInspected = setupTag === existing.tag ? appInspected : await verify(setupTag, 'Setup source');
  if (!setupInspected.setup || setupInspected.channel !== channel) {
    throw new ManifestError(`retained ${channel} Setup source ${setupTag} no longer verifies as a ${channel} Setup`);
  }
  return toEntry(appInspected.app, setupInspected.setup);
}

/**
 * Applies one CTO-supplied desktop app release on top of an existing manifest.
 * Only the channel that release belongs to is targeted, and that channel's
 * Setup comes from:
 *   - setupTag, when given: that release's verified Setup (same channel required);
 *   - otherwise the release's own verified Setup.
 * setupAsset, when given, must equal the verified updater metadata path exactly.
 * The other channel is re-verified against GitHub (via fetchApi + fetchAsset)
 * rather than carried forward. Refuses to move a channel backwards in semver
 * order; re-submitting the same tag is fine.
 */
export async function mergeTaggedRelease(manifest, release, { owner = OWNER, repo = REPO, fetchAsset, fetchApi, setupTag, setupAsset } = {}) {
  assertRepo(owner, repo);
  const inspected = await inspectRelease(release, { owner, repo, fetchAsset });
  if (inspected.status === 'cli-only') {
    throw new ManifestError(
      `${release.tag_name} is not a desktop app release: it has no CrewX Setup installer, no updater metadata and no app feed`
    );
  }
  const { channel, app } = inspected;

  const existing = manifest[channel];
  if (existing && existing.tag !== app.tag && compareVersions(app.version, existing.version) < 0) {
    throw new ManifestError(
      `refusing to move ${channel} backwards from ${existing.version} (${existing.tag}) to ${app.version} (${app.tag})`
    );
  }

  let setup = inspected.setup;
  if (setupTag) {
    let hosted;
    try {
      hosted = await inspectRelease(await fetchApi(releaseTagPath(owner, repo, setupTag)), { owner, repo, fetchAsset });
    } catch (err) {
      if (err instanceof ManifestError) throw new ManifestError(`--setup-tag ${setupTag} does not verify: ${err.message}`);
      throw err;
    }
    if (!hosted.setup) {
      throw new ManifestError(`--setup-tag ${setupTag} does not host a verified ${channel} Setup`);
    }
    if (hosted.channel !== channel) {
      throw new ManifestError(
        `--setup-tag ${setupTag} is a ${hosted.channel} release, but ${app.tag} is a ${channel} release; the Setup must come from the same channel`
      );
    }
    setup = hosted.setup;
  } else if (!setup) {
    throw new ManifestError(
      `${app.tag} is an app-only release with no Setup of its own; pass --setup-tag <tag> naming the release that hosts the Setup to link`
    );
  }
  if (setupAsset !== undefined && setup.assetName !== setupAsset) {
    throw new ManifestError(
      `--setup-asset "${setupAsset}" does not match the verified updater metadata path "${setup.assetName}" of ${setup.releaseTag}`
    );
  }

  const otherChannel = channel === 'stable' ? 'preview' : 'stable';
  const otherExisting = manifest[otherChannel];
  let otherEntry = null;
  if (otherExisting) {
    if (!fetchApi) {
      throw new ManifestError(`cannot re-verify the retained ${otherChannel} channel (${otherExisting.tag}) without fetchApi`);
    }
    otherEntry = await reverifyRetained(otherExisting, otherChannel, { owner, repo, fetchAsset, fetchApi });
  }

  return {
    ...manifest,
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    [channel]: toEntry(app, setup),
    [otherChannel]: otherEntry,
  };
}
