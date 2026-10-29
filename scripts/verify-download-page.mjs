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

test('all landing primary CTAs route to the locale-aware /download page', () => {
  const nav = read('src/components/Landing/TopNav.tsx');
  const home = read('src/pages/index.tsx');
  const finalCta = read('src/components/Landing/FinalCta.tsx');
  const pricing = read('src/components/Landing/PricingSection.tsx');

  // A raw <a href="/download"> resolves to the English page even on /ko.
  // @docusaurus/Link resolves per current locale.
  assert.match(nav, /<Link className="btn primary" to="\/download">/);
  const hero = home.slice(home.indexOf('<div className="ctas">'), home.indexOf('<div className="fine">'));
  assert.match(hero, /<Link className="btn primary btn-lg" to="\/download">/);
  assert.match(finalCta, /<Link className="btn primary btn-lg" to="\/download">/);
  assert.match(pricing, /<Link className="btn" to="\/download">/);
  for (const src of [nav, home, finalCta, pricing]) {
    assert.doesNotMatch(src, /<a\s+[^>]*href="\/download"/);
    assert.doesNotMatch(src, /href="#get"/);
  }
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
