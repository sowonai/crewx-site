/**
 * Structural checks for the /download page wiring: nav/footer entries,
 * i18n strings, and that both locale page files render the same shared
 * component (so EN/KO can't drift independently).
 *
 * Run with: node --test scripts/verify-download-page.mjs
 */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(root, rel), 'utf8');

test('navbar has a Download item pointing at /download', () => {
  const config = read('docusaurus.config.ts');
  assert.match(config, /\{to: '\/download', label: 'Download'/);
});

test('footer has a Download link pointing at /download', () => {
  const config = read('docusaurus.config.ts');
  const moreSection = config.slice(config.indexOf("title: 'More'"));
  assert.match(moreSection, /label: 'Download'/);
  assert.match(moreSection, /to: '\/download'/);
});

test('Korean navbar/footer translate the Download label', () => {
  const navbar = JSON.parse(read('i18n/ko/docusaurus-theme-classic/navbar.json'));
  const footer = JSON.parse(read('i18n/ko/docusaurus-theme-classic/footer.json'));
  assert.equal(navbar['item.label.Download']?.message, '다운로드');
  assert.equal(footer['link.item.label.Download']?.message, '다운로드');
});

test('all homepage primary CTAs use the locale-aware Windows download and share its copy', () => {
  const home = read('src/pages/index.tsx');
  const headerStart = home.indexOf('{/* Top Nav */}');
  const headerEnd = home.indexOf('{/* Hero */}', headerStart);
  const header = home.slice(headerStart, headerEnd);
  const heroStart = home.indexOf('<div className="mt-8 flex flex-wrap items-center gap-3">');
  const heroEnd = home.indexOf('<div className="mt-12">', heroStart);
  const hero = home.slice(heroStart, heroEnd);
  const freeTierStart = home.indexOf('{/* Free */}');
  const freeTierEnd = home.indexOf('<ul className="mt-6 space-y-2.5 text-sm text-slate-300">', freeTierStart);
  const freeTier = home.slice(freeTierStart, freeTierEnd);

  // A raw <a href="/download"> would resolve to the English page even when rendered
  // on /ko — the R1 review flagged this. @docusaurus/Link resolves per current locale.
  for (const primaryCta of [header, hero, freeTier]) {
    assert.match(primaryCta, /<Link\s+to="\/download"/);
    assert.match(primaryCta, /to="\/download"\s+className="btn-primary/);
    assert.match(primaryCta, /id="landing\.cta\.downloadWindows"/);
  }
  assert.match(hero, /<Link\s+to="\/download"/);
  assert.doesNotMatch(home, /<a\s+href="\/download"/);
  assert.match(hero, /<Link\s+to="\/docs\/intro"\s+className="btn-ghost/);
  assert.ok(hero.indexOf('to="/download"') < hero.indexOf('to="/docs/intro"'));

  assert.equal(
    [...home.matchAll(/id="landing\.cta\.downloadWindows"/g)].length,
    3,
    'header, hero, and free-tier primary CTAs must share the Windows download copy',
  );
  assert.doesNotMatch(header, /href="\/docs\/intro"\s+className="btn-primary/);
  assert.doesNotMatch(freeTier, /href="\/docs\/intro"\s+className="btn-primary/);

  const cliStart = hero.indexOf('<details');
  const cli = hero.slice(cliStart, hero.indexOf('</details>', cliStart) + '</details>'.length);
  assert.match(cli, /Developer CLI alternative/);
  assert.match(cli, /npx\s+<span[^>]*>crewx@latest/);
  assert.match(cli, /onClick=\{handleCopy\}/);
  assert.match(cli, /to="\/docs\/cli\/commands"/);

  const ko = JSON.parse(read('i18n/ko/code.json'));
  assert.equal(ko['landing.cta.downloadWindows']?.message, 'Windows용 다운로드');
  assert.equal(ko['landing.hero.cliAlternative.summary']?.message, '개발자용 CLI 대안');
  assert.equal(ko['landing.hero.cliAlternative.docs']?.message, 'CLI 가이드 보기');
});

test('the changelog link uses the verified release htmlUrl instead of a hardcoded Releases URL', () => {
  const component = read('src/components/DownloadPage/index.tsx');
  assert.match(component, /changelogHref\s*=\s*primary\?\.htmlUrl\s*\?\?\s*RELEASES_URL/);
  assert.match(component, /href=\{changelogHref\}/);
});

test('a separate preview download link is offered when both stable and preview are available', () => {
  const component = read('src/components/DownloadPage/index.tsx');
  assert.match(component, /m\.stable\s*&&\s*m\.preview/);
  assert.match(component, /m\.preview\.windows\.url/);
});

test('the first-run copy does not use the "local server" implementation term', () => {
  const component = read('src/components/DownloadPage/index.tsx');
  assert.doesNotMatch(component, /local server/i);
  assert.doesNotMatch(component, /로컬\s*서버/);
});

test('both locale page files render the shared DownloadPage component', () => {
  const en = read('src/pages/download.tsx');
  const ko = read('i18n/ko/docusaurus-plugin-content-pages/download.tsx');
  assert.match(en, /<DownloadPage locale="en" \/>/);
  assert.match(ko, /<DownloadPage locale="ko" \/>/);
});

test('the manifest file exists and only names the approved repo', () => {
  const manifestPath = join(root, 'data', 'download-manifest.json');
  assert.ok(existsSync(manifestPath), 'data/download-manifest.json is missing — run scripts/generate-release-manifest.mjs');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(manifest.repo, 'sowonlabs/crewx');
  assert.ok('stable' in manifest && 'preview' in manifest);
});

test('DownloadPage never falls back to a hardcoded download URL outside the manifest', () => {
  const component = read('src/components/DownloadPage/index.tsx');
  // The only "href" driven by release data must come from primary.windows.url;
  // there must be no second, hardcoded asset URL a broken manifest could fall through to.
  const hardcodedAssetUrl = /href=\{?["'`]https:\/\/github\.com\/sowonlabs\/crewx\/releases\/download/;
  assert.doesNotMatch(component, hardcodedAssetUrl);
});
