#!/usr/bin/env node
/**
 * Generates/updates data/download-manifest.json from the sowonlabs/crewx
 * GitHub Releases API. The /download page imports that JSON file directly —
 * it never calls GitHub at request time.
 *
 * Usage:
 *   node scripts/generate-release-manifest.mjs
 *     Rebuild the whole manifest from scratch by scanning every release.
 *     Use this once to establish a baseline (today: both channels come back
 *     empty, because no release yet ships a Setup.exe + updater metadata).
 *
 *   node scripts/generate-release-manifest.mjs --tag v0.9.0
 *     CTO workflow: after publishing a Desktop release, point the manifest
 *     at that one tag. Only touches the channel (stable/preview) the tag
 *     belongs to; the other channel is left as-is. Fails loudly (non-zero
 *     exit) if the tag is a draft, or is missing the Windows installer or
 *     updater metadata.
 *
 * Options:
 *   --repo <owner/name>   defaults to sowonlabs/crewx; any other value fails
 *   --out <path>          defaults to data/download-manifest.json
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OWNER, REPO, assertRepo, buildManifest, mergeTaggedRelease, ManifestError } from './lib/release-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = join(root, 'data', 'download-manifest.json');

function parseArgs(argv) {
  const args = { owner: OWNER, repo: REPO, out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--tag') args.tag = argv[++i];
    else if (a === '--repo') {
      const value = argv[++i] || '';
      const [owner, repo] = value.split('/');
      args.owner = owner;
      args.repo = repo;
    } else if (a === '--out') args.out = argv[++i];
    else throw new Error(`unknown argument: ${a}`);
  }
  return args;
}

async function githubFetch(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'crewx-site-release-manifest-script',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${path} -> ${res.status} ${res.statusText}${body ? `\n${body}` : ''}`);
  }
  return res.json();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assertRepo(args.owner, args.repo); // fail before spending a network call on a repo we'd reject anyway

  if (args.tag) {
    if (!existsSync(args.out)) {
      throw new Error(`${args.out} does not exist yet. Run without --tag once first to create a baseline manifest.`);
    }
    const existing = JSON.parse(readFileSync(args.out, 'utf8'));
    const release = await githubFetch(
      `/repos/${args.owner}/${args.repo}/releases/tags/${encodeURIComponent(args.tag)}`
    );
    const manifest = mergeTaggedRelease(existing, release, { owner: args.owner, repo: args.repo });
    writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n');
    const channel = release.prerelease ? 'preview' : 'stable';
    console.log(`updated ${channel} -> ${args.tag} in ${args.out}`);
    return;
  }

  const releases = await githubFetch(`/repos/${args.owner}/${args.repo}/releases?per_page=100`);
  const manifest = buildManifest(releases, { owner: args.owner, repo: args.repo });
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`wrote ${args.out}`);
  console.log(`  stable:  ${manifest.stable ? `${manifest.stable.tag} (${manifest.stable.windows.assetName})` : '(none yet)'}`);
  console.log(`  preview: ${manifest.preview ? `${manifest.preview.tag} (${manifest.preview.windows.assetName})` : '(none yet)'}`);
}

main().catch((err) => {
  if (err instanceof ManifestError) {
    console.error(`manifest error: ${err.message}`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
