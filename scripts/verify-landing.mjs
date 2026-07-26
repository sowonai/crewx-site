/**
 * Landing page render verification.
 *
 * Loads the running site, walks the #features section, and fails loudly on the
 * things that are invisible in source review but obvious to a visitor:
 *   - an <img> that 404s or renders at zero size (the "broken screenshot" case)
 *   - a feature we pulled from the landing still being present
 *   - untranslated / missing i18n keys leaking through as raw key strings
 *
 * Usage:
 *   node scripts/verify-landing.mjs [baseUrl]        # default http://localhost:3000
 *   node scripts/verify-landing.mjs http://localhost:3000/ko
 *
 * Exit code is non-zero when any check fails, so it can gate a commit.
 */
import { createRequire } from 'module';
import { mkdirSync, existsSync } from 'fs';

// crewx-site does not depend on playwright and should not — this is a local QA
// script, not part of the site build. Borrow the copy the demo-video skill already
// installs, falling back to a normal resolve if it is available locally.
const require = createRequire(import.meta.url);
const PLAYWRIGHT_CANDIDATES = [
  'playwright',
  `${process.env.HOME}/git/crewx-sowonlabs/skills/demo-video/node_modules/playwright`,
];
let chromium;
for (const candidate of PLAYWRIGHT_CANDIDATES) {
  try {
    ({ chromium } = require(candidate));
    break;
  } catch { /* try next */ }
}
if (!chromium) {
  console.error(
    'playwright not found. Install it here, or run the demo-video skill setup:\n' +
    '  cd ~/git/crewx-sowonlabs/skills/demo-video && npm install'
  );
  process.exit(2);
}

const baseUrl = process.argv[2] || 'http://localhost:3000';
const OUT_DIR = '/tmp/landing-verify';

/** Copy that must NOT appear — features pulled from the landing on purpose. */
const FORBIDDEN_TEXT = [
  'AI beside your browser',
  '브라우저 옆 AI',
];

const errors = [];
const warnings = [];

mkdirSync(OUT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });

const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
const failedRequests = [];
page.on('requestfailed', (r) => failedRequests.push(`${r.failure()?.errorText} ${r.url()}`));
page.on('response', (r) => { if (r.status() >= 400) failedRequests.push(`HTTP ${r.status()} ${r.url()}`); });

await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 45000 });

// Tailwind used to come from the Play CDN (<script src="https://cdn.tailwindcss.com">
// in the page <Head>). Docusaurus injects that script only after hydration, so the
// CDN's initial build never fired — it only emits utility CSS when its
// MutationObserver sees a DOM change. Arriving on the landing page via a client-side
// route change, or with the CDN blocked, left the page completely unstyled: every
// SVG icon expanded to full width and #features measured ~15700px instead of ~3000px.
//
// Tailwind is now compiled at build time, so the stylesheet is a plain blocking
// <link> and the very first paint is styled. This check deliberately does NOT touch
// the DOM first — if someone reintroduces a runtime CDN, the utility below stays
// unresolved and this script fails, which is exactly the regression we want caught.
await page
  .waitForFunction(
    () => {
      const el = document.querySelector('.max-w-7xl');
      return Boolean(el) && getComputedStyle(el).maxWidth !== 'none';
    },
    { timeout: 15000 }
  )
  .catch(() => { /* reported by the tailwindApplied check below */ });

const section = page.locator('#features');
if (await section.count() === 0) {
  errors.push('#features section not found on the page');
} else {
  // The screenshots are loading="lazy", so they only decode once scrolled into view.
  // Walking the whole page in viewport-sized steps is what makes this check real —
  // measuring without it reports every lazy image as broken (false negative).
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 250));
    }
    window.scrollTo(0, 0);
  });
  // Then wait for decode to actually finish rather than guessing with a sleep.
  await page
    .waitForFunction(
      () => [...document.querySelectorAll('#features img')].every((el) => el.complete),
      { timeout: 20000 }
    )
    .catch(() => warnings.push('timed out waiting for #features images to finish loading'));

  const imgs = await section.locator('img').evaluateAll((els) =>
    els.map((el) => ({
      src: el.getAttribute('src'),
      alt: el.getAttribute('alt'),
      complete: el.complete,
      naturalWidth: el.naturalWidth,
      naturalHeight: el.naturalHeight,
      renderedWidth: Math.round(el.getBoundingClientRect().width),
    }))
  );

  if (imgs.length === 0) errors.push('#features contains no <img> at all');
  for (const img of imgs) {
    if (!img.complete || img.naturalWidth === 0) {
      errors.push(`broken image (failed to load): ${img.src}`);
    } else if (img.renderedWidth === 0) {
      errors.push(`image loaded but renders at zero width: ${img.src}`);
    }
    if (!img.alt || img.alt.trim() === '') warnings.push(`image has empty alt: ${img.src}`);
  }

  // Guard against the unstyled-render trap above: if Tailwind did not apply, the
  // section balloons and any visual review of the screenshot is meaningless.
  const tailwindApplied = await page.evaluate(() => {
    const el = document.querySelector('.max-w-7xl');
    return el ? getComputedStyle(el).maxWidth !== 'none' : false;
  });
  if (!tailwindApplied) {
    errors.push(
      'Tailwind did not apply on first paint — page rendered unstyled. ' +
      'Check that src/css/tailwind-*.css are still imported by src/pages/index.tsx ' +
      'and that nothing reintroduced the runtime CDN.'
    );
  }
  const sectionHeight = await section.evaluate((el) => Math.round(el.getBoundingClientRect().height));
  if (sectionHeight > 8000) {
    errors.push(`#features is ${sectionHeight}px tall — layout is broken (expected roughly 2500-4500px)`);
  }
  console.log(`  tailwind applied: ${tailwindApplied}, #features height: ${sectionHeight}px`);

  const sectionText = await section.innerText();
  for (const forbidden of FORBIDDEN_TEXT) {
    if (sectionText.includes(forbidden)) errors.push(`removed feature still on the page: "${forbidden}"`);
  }
  // Docusaurus renders an unresolved <Translate> id verbatim, e.g. "landing.highlights.x".
  const leakedKeys = sectionText.match(/landing\.[a-zA-Z0-9.]+/g);
  if (leakedKeys) errors.push(`untranslated i18n keys rendered as text: ${[...new Set(leakedKeys)].join(', ')}`);

  const label = baseUrl.endsWith('/ko') ? 'ko' : 'en';
  await section.screenshot({ path: `${OUT_DIR}/features-${label}.png` });
  console.log(`  images checked: ${imgs.length}`);
  for (const img of imgs) {
    console.log(`    ${img.naturalWidth > 0 ? 'OK  ' : 'FAIL'} ${img.src} (${img.naturalWidth}x${img.naturalHeight} natural)`);
  }
  console.log(`  section screenshot: ${OUT_DIR}/features-${label}.png`);
}

// Arriving at the landing page through a client-side route change is the path that
// actually broke for visitors under the Play CDN: the docs navbar brand is a
// Docusaurus <Link>, so no full page load happens and a runtime-injected stylesheet
// never gets a chance to build. Direct loads happened to work, which is why the bug
// read as "intermittent". Assert the styled render on this path too.
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  try {
    await p.goto(`${baseUrl}/docs/intro`, { waitUntil: 'networkidle', timeout: 45000 });
    const brand = p.locator('.navbar__brand').first();
    if (await brand.count()) {
      await brand.click();
      await p.waitForTimeout(2000);
      const styled = await p.evaluate(() => {
        const el = document.querySelector('.max-w-7xl');
        return el ? getComputedStyle(el).maxWidth !== 'none' : false;
      });
      console.log(`  spa-nav (docs -> landing) styled: ${styled}`);
      if (!styled) {
        errors.push('landing rendered unstyled when reached by client-side navigation from /docs');
      }
    }
  } catch (err) {
    warnings.push(`spa-nav check skipped: ${err.message.split('\n')[0]}`);
  }
  await p.close();
}

// Only report asset/network failures for the site itself. Dev-server HMR channels
// and third-party analytics beacons (which headless routinely aborts) say nothing
// about whether the landing page is correct.
const IGNORED_REQUEST_NOISE =
  /hot-update|sockjs|__docusaurus|google-analytics\.com|googletagmanager\.com|doubleclick\.net/;
const relevantFailures = failedRequests.filter((f) => !IGNORED_REQUEST_NOISE.test(f));
if (relevantFailures.length) errors.push(`failed requests:\n    ${relevantFailures.join('\n    ')}`);

await browser.close();

console.log(`\n=== ${baseUrl} ===`);
if (warnings.length) {
  console.log('WARNINGS:');
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length) {
  console.log('FAILED:');
  for (const e of errors) console.log(`  - ${e}`);
  process.exit(1);
}
console.log('PASS — all checks green');
