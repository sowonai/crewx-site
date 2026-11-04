#!/usr/bin/env node
/**
 * Prints the Desktop release tags that are newer than what
 * data/download-manifest.json links today — one per line, at most one per
 * channel (stable, then preview). Prints nothing when the manifest is current.
 *
 * Shape-only and metadata-only: it never downloads installer bytes. The
 * actual SHA-512 verification still happens in
 * `generate-release-manifest.mjs --tag <tag>`, which the sync workflow runs
 * for every tag this script prints.
 *
 * Only releases that host their own Setup are listed. App-only releases (app
 * feed, no installer) need `--tag <tag> --setup-tag <setupTag>`, and this sync
 * does not pass --setup-tag.
 *
 * Usage: node scripts/find-newer-release.mjs [--manifest <path>]
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OWNER, REPO, ownSetupCandidate, compareVersions } from './lib/release-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const manifestPath = args[0] === '--manifest' ? args[1] : join(root, 'data', 'download-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'crewx-site-release-sync' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/releases?per_page=50`, { headers });
if (!res.ok) {
  console.error(`GitHub API ${res.status} ${res.statusText}`);
  process.exit(1);
}
const candidates = (await res.json()).map((r) => ownSetupCandidate(r)).filter(Boolean);

for (const channel of ['stable', 'preview']) {
  const pool = candidates.filter((r) => (channel === 'preview') === r.prerelease);
  if (pool.length === 0) continue;
  const best = pool.reduce((a, b) => (compareVersions(b.version, a.version) > 0 ? b : a));
  const current = manifest[channel];
  if (!current || compareVersions(best.version, current.version) > 0) console.log(best.tag);
}
