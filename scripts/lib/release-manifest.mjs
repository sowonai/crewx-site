/**
 * Pure logic for turning a GitHub Releases API response into the download
 * manifest the /download page renders from. No network calls in this file
 * so it can be unit-tested with fixtures (see scripts/verify-release-manifest.mjs).
 */

export const OWNER = 'sowonlabs';
export const REPO = 'crewx';

const WINDOWS_INSTALLER_RE = /Setup.*\.exe$/i;
const UPDATER_METADATA_RE = /\.(yml|yaml)$/i;

export class ManifestError extends Error {}

export function assertRepo(owner, repo) {
  if (owner !== OWNER || repo !== REPO) {
    throw new ManifestError(
      `refusing to build a download manifest for ${owner}/${repo} — the only approved ` +
      `source of Desktop releases is ${OWNER}/${REPO} (see docs/cto/github.md section 9.3)`
    );
  }
}

function findAsset(assets, re) {
  return assets.find((a) => re.test(a.name));
}

/**
 * A release only counts as a real Desktop release if it ships a Windows
 * installer AND updater metadata. Every existing release on sowonlabs/crewx
 * today is an old CLI release with no installer asset at all, so this check
 * excludes them by construction rather than needing a separate "ignore the
 * old CLI" special case.
 */
export function toDesktopRelease(release) {
  if (!release || release.draft) return null;
  const assets = release.assets || [];
  const installer = findAsset(assets, WINDOWS_INSTALLER_RE);
  const updaterMeta = findAsset(assets, UPDATER_METADATA_RE);
  if (!installer || !updaterMeta) return null;
  return {
    tag: release.tag_name,
    version: String(release.tag_name || '').replace(/^v/, ''),
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

function rejectDesktopRelease(release) {
  if (!release) return 'release not found';
  if (release.draft) return 'release is a draft';
  const assets = release.assets || [];
  if (!findAsset(assets, WINDOWS_INSTALLER_RE)) return 'no Windows *Setup*.exe asset found';
  if (!findAsset(assets, UPDATER_METADATA_RE)) return 'no updater metadata (.yml) asset found';
  return null;
}

function newest(list) {
  if (list.length === 0) return null;
  return list.reduce((a, b) => (new Date(a.publishedAt) > new Date(b.publishedAt) ? a : b));
}

/**
 * Rebuilds the whole manifest from a full release list. This is the "honest
 * empty state" path: if nothing in `releases` qualifies, stable/preview both
 * come back null and the download page must show a "not ready" state rather
 * than fabricate a link.
 *
 * Deliberately does not call GET /releases/latest anywhere in this file or
 * its caller — that endpoint returns the newest non-prerelease release
 * regardless of asset shape, which today is an old CLI tag.
 */
export function buildManifest(releases, {owner = OWNER, repo = REPO} = {}) {
  assertRepo(owner, repo);
  const desktopReleases = (releases || []).map(toDesktopRelease).filter(Boolean);
  const stable = newest(desktopReleases.filter((r) => !r.prerelease));
  const preview = newest(desktopReleases.filter((r) => r.prerelease));
  return {
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    stable,
    preview,
  };
}

/**
 * Applies one CTO-supplied tag on top of an existing manifest, updating only
 * the channel (stable/preview) that tag belongs to. Throws ManifestError —
 * does not silently no-op — when the tag doesn't resolve to a real Desktop
 * release, so a bad tag never produces a manifest pointing at a dead link.
 */
export function mergeTaggedRelease(manifest, release, {owner = OWNER, repo = REPO} = {}) {
  assertRepo(owner, repo);
  const reason = rejectDesktopRelease(release);
  if (reason) {
    throw new ManifestError(`tag ${release?.tag_name ?? '(unknown)'} is not a usable Desktop release: ${reason}`);
  }
  const desktop = toDesktopRelease(release);
  const channel = desktop.prerelease ? 'preview' : 'stable';
  return {
    ...manifest,
    generatedAt: new Date().toISOString(),
    repo: `${owner}/${repo}`,
    [channel]: desktop,
  };
}
