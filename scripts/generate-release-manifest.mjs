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
 *     empty, because no release yet ships the exact Setup.exe + updater
 *     metadata pair this script requires).
 *
 *   node scripts/generate-release-manifest.mjs --tag v0.9.0
 *     CTO workflow: after publishing a Desktop release, point the manifest
 *     at that one tag. Downloads and SHA-512-verifies the actual installer
 *     bytes against the updater metadata before writing anything. Only
 *     touches the channel (stable/preview) the tag belongs to; the other
 *     channel is re-verified against GitHub rather than carried over
 *     unchecked. Fails loudly (non-zero exit) if the tag doesn't pass.
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
const USER_AGENT = 'crewx-site-release-manifest-script';

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

function redactToken(text) {
  const token = process.env.GITHUB_TOKEN;
  return token ? text.split(token).join('«redacted»') : text;
}

/** Authenticated call to the GitHub API (metadata only — never asset bytes). */
async function githubApi(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': USER_AGENT,
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`GitHub API ${path} -> ${res.status} ${res.statusText}${body ? `\n${redactToken(body)}` : ''}`);
  }
  return res.json();
}

/**
 * Fetch for public release assets (installer bytes, updater metadata YAML).
 * Deliberately does not attach GITHUB_TOKEN — these are public CDN URLs, and
 * sending an API token to them (or letting it leak into a response/error) is
 * exactly the kind of thing this script must not do.
 */
async function githubAsset(url) {
  return fetch(url, { headers: { 'User-Agent': USER_AGENT } });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assertRepo(args.owner, args.repo); // fail before spending a network call on a repo we'd reject anyway

  if (args.tag) {
    if (!existsSync(args.out)) {
      throw new Error(`${args.out} does not exist yet. Run without --tag once first to create a baseline manifest.`);
    }
    const existing = JSON.parse(readFileSync(args.out, 'utf8'));
    const release = await githubApi(
      `/repos/${args.owner}/${args.repo}/releases/tags/${encodeURIComponent(args.tag)}`
    );
    const manifest = await mergeTaggedRelease(existing, release, {
      owner: args.owner,
      repo: args.repo,
      fetchAsset: githubAsset,
      fetchApi: githubApi,
    });
    writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n');
    const channel = release.prerelease ? 'preview' : 'stable';
    console.log(`verified and updated ${channel} -> ${args.tag} in ${args.out}`);
    return;
  }

  const releases = await githubApi(`/repos/${args.owner}/${args.repo}/releases?per_page=100`);
  const manifest = await buildManifest(releases, {
    owner: args.owner,
    repo: args.repo,
    fetchAsset: githubAsset,
    onReject: (release, err) => console.warn(`skipping ${release.tag_name}: ${err.message}`),
  });
  mkdirSync(dirname(args.out), { recursive: true });
  writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`wrote ${args.out}`);
  console.log(`  stable:  ${manifest.stable ? `${manifest.stable.tag} (${manifest.stable.windows.assetName})` : '(none yet)'}`);
  console.log(`  preview: ${manifest.preview ? `${manifest.preview.tag} (${manifest.preview.windows.assetName})` : '(none yet)'}`);
}

main().catch((err) => {
  const message = redactToken(String(err && err.message ? err.message : err));
  if (err instanceof ManifestError) {
    console.error(`manifest error: ${message}`);
  } else {
    console.error(message);
  }
  process.exit(1);
});
