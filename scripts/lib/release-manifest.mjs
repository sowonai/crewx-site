/**
 * Turns a GitHub Releases API response into the download manifest the
 * /download page renders from.
 *
 * R1 review (tsk_5ou5a10a) showed the first version of this file only
 * checked for "a file named *Setup*.exe" and "a file ending in .yml", which
 * an ARM64/mac build or a mismatched RC could pass. This version requires an
 * exact filename per channel, cross-checks the GitHub asset URL, and — since
 * naming alone can lie — downloads the updater metadata and streams the
 * actual Setup.exe bytes through SHA-512 to confirm they match. That network
 * work lives behind an injected `fetchAsset`/`fetchApi` so it can still be
 * exercised with local HTTP fixtures in scripts/verify-release-manifest.mjs.
 */
import { createHash } from 'node:crypto';

export const OWNER = 'sowonlabs';
export const REPO = 'crewx';

export class ManifestError extends Error {}

// Strict semver, plus the one prerelease shape we support: -rc.N. Anything
// else (-beta.1, -alpha, -rc without a number, ...) is an unknown channel.
const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(?:-([a-z]+)\.(\d+))?$/;

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

function compareVersions(a, b) {
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

function expectedAssetNames(version, channel) {
  return {
    installer: `CrewX-Setup-${version}-x64.exe`,
    metadata: channel === 'stable' ? 'latest.yml' : 'rc.yml',
  };
}

function assetUrlMatches(url, owner, repo, tag, assetName) {
  try {
    const u = new URL(url);
    return u.hostname === 'github.com' && u.pathname === `/${owner}/${repo}/releases/download/${tag}/${assetName}`;
  } catch {
    return false;
  }
}

function countMatches(assets, name) {
  return assets.filter((a) => a.name === name).length;
}

/**
 * Shape-only, synchronous, no network: exact filenames, strict semver /
 * GitHub-prerelease-flag agreement, and asset URLs that actually point at
 * this owner/repo/tag. Returns a rejection reason string, or null if the
 * release passes. Byte-level verification is a separate, async step
 * (verifyReleaseBytes) because it needs network access.
 */
export function describeShape(release, { owner = OWNER, repo = REPO } = {}) {
  if (!release) return 'release not found';
  if (release.draft) return 'release is a draft';
  const version = String(release.tag_name || '').replace(/^v/, '');
  const parsed = parseVersion(version);
  const channelResult = channelFor(parsed, !!release.prerelease);
  if (channelResult.error) return channelResult.error;
  const { channel } = channelResult;
  const names = expectedAssetNames(version, channel);
  const assets = release.assets || [];
  if (countMatches(assets, names.installer) !== 1) {
    return `expected exactly one asset named exactly "${names.installer}"`;
  }
  if (countMatches(assets, names.metadata) !== 1) {
    return `expected exactly one asset named exactly "${names.metadata}" for the ${channel} channel`;
  }
  const installer = assets.find((a) => a.name === names.installer);
  const metadata = assets.find((a) => a.name === names.metadata);
  if (!assetUrlMatches(installer.browser_download_url, owner, repo, release.tag_name, names.installer)) {
    return `installer asset URL does not point at ${owner}/${repo} tag ${release.tag_name}`;
  }
  if (!assetUrlMatches(metadata.browser_download_url, owner, repo, release.tag_name, names.metadata)) {
    return `updater metadata asset URL does not point at ${owner}/${repo} tag ${release.tag_name}`;
  }
  return null;
}

/** Shape-checked descriptor for the manifest JSON. Null if describeShape rejects. */
export function toDesktopRelease(release, opts = {}) {
  if (describeShape(release, opts) !== null) return null;
  const { owner = OWNER, repo = REPO } = opts;
  const version = String(release.tag_name).replace(/^v/, '');
  const channel = release.prerelease ? 'preview' : 'stable';
  const names = expectedAssetNames(version, channel);
  const assets = release.assets || [];
  const installer = assets.find((a) => a.name === names.installer);
  return {
    tag: release.tag_name,
    version,
    name: release.name || release.tag_name,
    prerelease: !!release.prerelease,
    publishedAt: release.published_at || release.created_at,
    htmlUrl: release.html_url,
    windows: {
      assetName: installer.name,
      url: installer.browser_download_url,
      sizeBytes: installer.size,
    },
  };
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
 * Downloads the updater metadata and the actual installer bytes for a
 * shape-checked descriptor and confirms they all agree with each other and
 * with the GitHub API's asset size. Never attaches an auth header — both
 * fetches go through `fetchAsset` against public release-asset URLs, and
 * this function never logs its own request headers.
 */
export async function verifyReleaseBytes(release, descriptor, { owner = OWNER, repo = REPO, fetchAsset } = {}) {
  const channel = descriptor.prerelease ? 'preview' : 'stable';
  const metadataName = channel === 'stable' ? 'latest.yml' : 'rc.yml';
  const metadataAsset = (release.assets || []).find((a) => a.name === metadataName);

  const metaRes = await fetchAsset(metadataAsset.browser_download_url);
  if (!metaRes.ok) {
    throw new ManifestError(`could not download updater metadata (status ${metaRes.status})`);
  }
  const parsed = parseUpdaterYaml(await metaRes.text());

  if (parsed.version !== descriptor.version) {
    throw new ManifestError(`updater metadata version "${parsed.version}" does not match release version "${descriptor.version}"`);
  }
  if (parsed.path !== descriptor.windows.assetName) {
    throw new ManifestError(`updater metadata path "${parsed.path}" does not match installer asset "${descriptor.windows.assetName}"`);
  }
  const matchingFiles = parsed.files.filter((f) => f.url === descriptor.windows.assetName);
  if (matchingFiles.length !== 1) {
    throw new ManifestError(`updater metadata files[] must have exactly one entry named "${descriptor.windows.assetName}", found ${matchingFiles.length}`);
  }
  const fileEntry = matchingFiles[0];
  if (fileEntry.sha512 !== parsed.sha512) {
    throw new ManifestError('updater metadata top-level sha512 does not match its own files[] entry');
  }
  if (fileEntry.size !== descriptor.windows.sizeBytes) {
    throw new ManifestError(`updater metadata size ${fileEntry.size} does not match GitHub asset size ${descriptor.windows.sizeBytes}`);
  }

  const actual = await sha512Base64(fetchAsset, descriptor.windows.url);
  if (actual.size !== descriptor.windows.sizeBytes) {
    throw new ManifestError(`downloaded Setup.exe is ${actual.size} bytes, GitHub reports ${descriptor.windows.sizeBytes}`);
  }
  if (actual.sha512 !== fileEntry.sha512) {
    throw new ManifestError('downloaded Setup.exe sha512 does not match updater metadata — refusing to publish this link');
  }
  return descriptor;
}

/** Full check: shape, then real bytes. Throws ManifestError on any failure. */
export async function verifyDesktopRelease(release, { owner = OWNER, repo = REPO, fetchAsset } = {}) {
  const reason = describeShape(release, { owner, repo });
  if (reason) throw new ManifestError(reason);
  const descriptor = toDesktopRelease(release, { owner, repo });
  return verifyReleaseBytes(release, descriptor, { owner, repo, fetchAsset });
}

function newest(list) {
  if (list.length === 0) return null;
  return list.reduce((a, b) => (compareVersions(b.version, a.version) > 0 ? b : a));
}

/**
 * Rebuilds the whole manifest from a full release list — the "honest empty
 * state" path. Releases that fail verification are skipped (reported via
 * `onReject`, never thrown) so one bad or unrelated release can't take down
 * manifest generation for the rest; the release that resolves stays out of
 * the manifest either way, so no dead or unverified link is ever produced.
 *
 * Deliberately never calls GET /releases/latest — that endpoint returns the
 * newest non-prerelease release regardless of asset shape, which today is an
 * old CLI tag.
 */
export async function buildManifest(releases, { owner = OWNER, repo = REPO, fetchAsset, onReject } = {}) {
  assertRepo(owner, repo);
  const verified = [];
  for (const release of releases || []) {
    try {
      verified.push(await verifyDesktopRelease(release, { owner, repo, fetchAsset }));
    } catch (err) {
      if (!(err instanceof ManifestError)) throw err;
      onReject?.(release, err);
    }
  }
  return {
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    stable: newest(verified.filter((r) => !r.prerelease)),
    preview: newest(verified.filter((r) => r.prerelease)),
  };
}

/**
 * Applies one CTO-supplied tag on top of an existing manifest. Only the
 * channel that tag belongs to is targeted, but the *other* channel is
 * re-verified against GitHub too (via fetchApi + fetchAsset) rather than
 * carried forward from the old JSON on trust — a manifest file that was
 * hand-edited or went stale should not survive silently. Refuses to move a
 * channel backwards in semver order; re-submitting the same tag is fine.
 */
export async function mergeTaggedRelease(manifest, release, { owner = OWNER, repo = REPO, fetchAsset, fetchApi } = {}) {
  assertRepo(owner, repo);
  const descriptor = await verifyDesktopRelease(release, { owner, repo, fetchAsset });
  const channel = descriptor.prerelease ? 'preview' : 'stable';
  const existing = manifest[channel];
  if (existing && existing.tag !== descriptor.tag && compareVersions(descriptor.version, existing.version) < 0) {
    throw new ManifestError(
      `refusing to move ${channel} backwards from ${existing.version} (${existing.tag}) to ${descriptor.version} (${descriptor.tag})`
    );
  }

  const otherChannel = channel === 'stable' ? 'preview' : 'stable';
  const otherExisting = manifest[otherChannel];
  let otherVerified = otherExisting ?? null;
  if (otherExisting) {
    if (!fetchApi) {
      throw new ManifestError(`cannot re-verify the retained ${otherChannel} channel (${otherExisting.tag}) without fetchApi`);
    }
    const otherRelease = await fetchApi(`/repos/${owner}/${repo}/releases/tags/${encodeURIComponent(otherExisting.tag)}`);
    otherVerified = await verifyDesktopRelease(otherRelease, { owner, repo, fetchAsset });
  }

  return {
    ...manifest,
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    [channel]: descriptor,
    [otherChannel]: otherVerified,
  };
}
