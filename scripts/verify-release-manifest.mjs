/**
 * Unit tests for scripts/lib/release-manifest.mjs. No network access — every
 * case is a hand-built fixture, several copied from the real (as of
 * 2026-09-19) sowonlabs/crewx releases API response so "old CLI release"
 * isn't a hypothetical.
 *
 * Run with: node --test scripts/verify-release-manifest.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { buildManifest, mergeTaggedRelease, ManifestError } from './lib/release-manifest.mjs';

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

function desktopAsset(overrides = {}) {
  return {
    tag_name: 'v0.9.0',
    name: 'CrewX Desktop 0.9.0',
    draft: false,
    prerelease: false,
    published_at: '2026-09-01T00:00:00Z',
    html_url: 'https://github.com/sowonlabs/crewx/releases/tag/v0.9.0',
    assets: [
      { name: 'CrewX-Setup-0.9.0.exe', size: 98765432, browser_download_url: 'https://dl/CrewX-Setup-0.9.0.exe' },
      { name: 'latest.yml', size: 512, browser_download_url: 'https://dl/latest.yml' },
    ],
    ...overrides,
  };
}

test('rejects any repo other than sowonlabs/crewx', () => {
  assert.throws(
    () => buildManifest(OLD_CLI_RELEASES, { owner: 'someone-else', repo: 'crewx' }),
    ManifestError
  );
  assert.throws(
    () => buildManifest(OLD_CLI_RELEASES, { owner: 'sowonlabs', repo: 'crewx-fork' }),
    ManifestError
  );
});

test('old CLI releases with no installer asset produce an honest empty manifest', () => {
  const manifest = buildManifest(OLD_CLI_RELEASES);
  assert.equal(manifest.stable, null);
  assert.equal(manifest.preview, null);
  assert.equal(manifest.repo, 'sowonlabs/crewx');
});

test('a release missing the updater metadata file is excluded even with an .exe present', () => {
  const release = desktopAsset({
    assets: [{ name: 'CrewX-Setup-0.9.0.exe', size: 1, browser_download_url: 'https://dl/x.exe' }],
  });
  const manifest = buildManifest([release]);
  assert.equal(manifest.stable, null);
});

test('a release missing the Setup.exe is excluded even with updater metadata present', () => {
  const release = desktopAsset({
    assets: [{ name: 'latest.yml', size: 1, browser_download_url: 'https://dl/latest.yml' }],
  });
  const manifest = buildManifest([release]);
  assert.equal(manifest.stable, null);
});

test('draft releases are excluded even if they have both required assets', () => {
  const release = desktopAsset({ draft: true });
  const manifest = buildManifest([release]);
  assert.equal(manifest.stable, null);
});

test('a valid stable release populates stable and never touches preview', () => {
  const manifest = buildManifest([...OLD_CLI_RELEASES, desktopAsset()]);
  assert.ok(manifest.stable);
  assert.equal(manifest.stable.tag, 'v0.9.0');
  assert.equal(manifest.stable.windows.assetName, 'CrewX-Setup-0.9.0.exe');
  assert.equal(manifest.preview, null);
});

test('a valid prerelease populates preview, not stable', () => {
  const release = desktopAsset({ tag_name: 'v0.9.1-rc.1', prerelease: true });
  const manifest = buildManifest([release]);
  assert.equal(manifest.stable, null);
  assert.ok(manifest.preview);
  assert.equal(manifest.preview.tag, 'v0.9.1-rc.1');
});

test('picks the newest valid release per channel by publish date', () => {
  const older = desktopAsset({ tag_name: 'v0.9.0', published_at: '2026-08-01T00:00:00Z' });
  const newer = desktopAsset({ tag_name: 'v0.9.2', published_at: '2026-09-15T00:00:00Z' });
  const manifest = buildManifest([older, newer]);
  assert.equal(manifest.stable.tag, 'v0.9.2');
});

test('mergeTaggedRelease rejects a tag from the wrong repo', () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  assert.throws(
    () => mergeTaggedRelease(manifest, desktopAsset(), { owner: 'sowonlabs', repo: 'crewx-desktop' }),
    ManifestError
  );
});

test('mergeTaggedRelease rejects a tag missing required assets instead of writing a dead link', () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  const badRelease = desktopAsset({ assets: [] });
  assert.throws(() => mergeTaggedRelease(manifest, badRelease), ManifestError);
});

test('mergeTaggedRelease rejects a draft tag', () => {
  const manifest = { generatedAt: 'x', repo: 'sowonlabs/crewx', stable: null, preview: null };
  assert.throws(() => mergeTaggedRelease(manifest, desktopAsset({ draft: true })), ManifestError);
});

test('mergeTaggedRelease updates only the matching channel, leaving the other intact', () => {
  const existingStable = desktopAsset({ tag_name: 'v0.9.0' });
  const manifest = buildManifest([existingStable]);
  const previewRelease = desktopAsset({ tag_name: 'v0.9.1-rc.1', prerelease: true });
  const updated = mergeTaggedRelease(manifest, previewRelease);
  assert.equal(updated.stable.tag, 'v0.9.0');
  assert.equal(updated.preview.tag, 'v0.9.1-rc.1');
});
