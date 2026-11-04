#!/usr/bin/env node
/**
 * Generates/updates data/download-manifest.json from the sowonlabs/crewx
 * GitHub Releases API. The /download page imports that JSON file directly —
 * it never calls GitHub at request time.
 *
 * Usage:
 *   node scripts/generate-release-manifest.mjs
 *     Full rebuild. For each channel (stable, preview) it takes the newest
 *     desktop app release and the newest verified Setup source, by semver, and
 *     links the Setup from that source. Releases with no desktop artifacts at
 *     all (CLI-only) are ignored. Desktop releases that fail verification are
 *     reported and skipped, never published.
 *
 *   node scripts/generate-release-manifest.mjs --tag <appTag> [--setup-tag <setupTag>] [--setup-asset <name>]
 *     Point the manifest at one desktop app release. Only that release's
 *     channel (stable/preview) is updated; the other channel is re-verified
 *     against GitHub rather than carried over unchecked. The Setup bytes are
 *     downloaded and SHA-512-verified against the updater metadata before
 *     anything is written. Fails loudly (non-zero exit) if anything does not pass.
 *
 *     <appTag> must be a desktop app release: a non-draft release whose tag is
 *     channel-consistent, with a verified Setup of its own, or with the channel
 *     app feed (latest-app.yml for stable, rc-app.yml for preview). An app-only
 *     release has the feed and no installer, so it reuses the Setup of an older
 *     release. The manifest then shows the app release's version and links the
 *     Setup's own release tag and shell version.
 *
 *       --setup-tag <setupTag>   The release that hosts the Setup to link. Required
 *                                for an app-only release. Must be on the same channel
 *                                as <appTag>. Without it, <appTag> must host its own
 *                                verified Setup.
 *       --setup-asset <name>     Fail unless the verified updater metadata path is
 *                                exactly <name>. Only valid together with --tag.
 *
 * Options:
 *   --repo <owner/name>   defaults to sowonlabs/crewx; any other value fails
 *   --out <path>          defaults to data/download-manifest.json
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OWNER, REPO, assertRepo, buildManifest, mergeTaggedRelease, ManifestError } from './lib/release-manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEFAULT_OUT = join(root, 'data', 'download-manifest.json');
const USER_AGENT = 'crewx-site-release-manifest-script';

/** Exported for scripts/verify-release-manifest.mjs. Throws on unknown or incomplete arguments. */
export function parseArgs(argv) {
  const args = { owner: OWNER, repo: REPO, out: DEFAULT_OUT };
  let i = 0;
  const valueOf = (flag) => {
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${flag} needs a value`);
    return value;
  };
  for (i = 0; i < argv.length; i++) {
    const flag = argv[i];
    if (flag === '--tag') args.tag = valueOf(flag);
    else if (flag === '--setup-tag') args.setupTag = valueOf(flag);
    else if (flag === '--setup-asset') args.setupAsset = valueOf(flag);
    else if (flag === '--repo') {
      const [owner, repo] = valueOf(flag).split('/');
      args.owner = owner;
      args.repo = repo;
    } else if (flag === '--out') args.out = valueOf(flag);
    else throw new Error(`unknown argument: ${flag}`);
  }
  if (args.tag === undefined && (args.setupTag !== undefined || args.setupAsset !== undefined)) {
    throw new Error('--setup-tag and --setup-asset only apply together with --tag');
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
      setupTag: args.setupTag,
      setupAsset: args.setupAsset,
    });
    writeFileSync(args.out, JSON.stringify(manifest, null, 2) + '\n');
    const channel = release.prerelease ? 'preview' : 'stable';
    const { windows } = manifest[channel];
    console.log(`verified and updated ${channel} -> ${args.tag} in ${args.out}`);
    console.log(`  Setup: ${windows.assetName} (shell ${windows.shellVersion}) from ${windows.releaseTag}`);
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

// Run only as the entrypoint, so the test file can import parseArgs.
const isEntrypoint = process.argv[1] !== undefined && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isEntrypoint) {
  main().catch((err) => {
    const message = redactToken(String(err && err.message ? err.message : err));
    if (err instanceof ManifestError) {
      console.error(`manifest error: ${message}`);
    } else {
      console.error(message);
    }
    process.exit(1);
  });
}
