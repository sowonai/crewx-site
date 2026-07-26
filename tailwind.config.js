/**
 * Tailwind is used by the landing page only (src/pages/index.tsx and the
 * components it renders). It used to be loaded from the Play CDN at runtime,
 * which meant the very first paint could land before any CSS existed — see
 * `scripts/postcss-scope-preflight` in docusaurus.config.ts for the rest.
 *
 * Keep this on Tailwind 3.x: the landing markup was written against the v3
 * default theme, and v4 changes the default palette and spacing scale.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  corePlugins: {
    // `container` is the one Tailwind class that is a bare, unprefixed word —
    // and Docusaurus/Infima already own `.container` for the docs and blog
    // content column. Tailwind's copy lands later in the bundle and would widen
    // it to 1536px on large screens. The landing page uses `mx-auto max-w-7xl`,
    // never `container`, so we simply do not emit it.
    container: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
