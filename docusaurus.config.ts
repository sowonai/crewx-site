import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import fs from 'fs';
import path from 'path';

/**
 * Tailwind's preflight is a global reset: it drops heading sizes, list bullets
 * and button chrome. The landing page is written against it; the docs and blog
 * are styled by Infima and would visibly break under it.
 *
 * So we let Tailwind emit preflight into its own entry file
 * (src/css/tailwind-preflight.css) and rewrite every selector here to sit under
 * `.landing-page-wrapper`. The scope goes inside `:where()`, which contributes
 * zero specificity — so each rule keeps exactly the specificity preflight was
 * designed around, and any utility class still wins over it.
 */
const LANDING_SCOPE = '.landing-page-wrapper';

function scopeToLanding(selector: string): string {
  const sel = selector.trim();
  // Preflight's root rules describe "the page"; here the page is the wrapper.
  if (sel === 'html' || sel === ':host' || sel === 'body') {
    return `:where(${LANDING_SCOPE})`;
  }
  // The universal rule must also hit the wrapper element itself.
  if (sel === '*') {
    return `:where(${LANDING_SCOPE}), :where(${LANDING_SCOPE}) *`;
  }
  return `:where(${LANDING_SCOPE}) ${sel}`;
}

const scopePreflightPlugin = {
  postcssPlugin: 'crewx-scope-preflight',
  Once(root: any) {
    // Only the preflight entry file — never the utilities, never Infima.
    if (!root.source?.input?.file?.endsWith('tailwind-preflight.css')) return;
    root.walkRules((rule: any) => {
      rule.selectors = rule.selectors.map(scopeToLanding);
    });
  },
};

/**
 * Release notes live in releases/ (served at /releases) so /blog keeps the
 * tutorials and stories. Search engines already index the old addresses
 * (/blog/<slug>, /ko/blog/<slug>), so each moved post gets a client redirect.
 *
 * The list is read from releases/ rather than hard-coded. A post's slug is its
 * front matter `slug`; without one it follows the blog's own filename rule
 * (YYYY-MM-DD-name.md -> YYYY/MM/DD/name). `to` is baseUrl-relative, so the same
 * list gives /ko/blog/<slug> -> /ko/releases/<slug> in the ko build.
 * Duplicate `from` paths are dropped here, since client-redirects warns on them.
 */
const RELEASES_DIR = path.join(__dirname, 'releases');

function releaseSlug(fileName: string, source: string): string {
  const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)?.[1] ?? '';
  const slugValue = /^slug:\s*(.+?)\s*$/m.exec(frontMatter)?.[1];
  if (slugValue) {
    return slugValue.replace(/^["']|["']$/g, '').replace(/^\/+|\/+$/g, '');
  }
  const dated = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.mdx?$/.exec(fileName);
  if (!dated) {
    throw new Error(`releases/${fileName}: needs a YYYY-MM-DD-name.md filename or a slug front matter`);
  }
  const [, year, month, day, text] = dated;
  return `${year}/${month}/${day}/${text}`;
}

const releaseRedirects = (() => {
  const byFrom = new Map<string, {from: string; to: string}>();
  const files = fs
    .readdirSync(RELEASES_DIR)
    .filter((file) => /\.mdx?$/.test(file))
    .sort();
  for (const file of files) {
    const slug = releaseSlug(file, fs.readFileSync(path.join(RELEASES_DIR, file), 'utf8'));
    const from = `/blog/${slug}`;
    if (!byFrom.has(from)) {
      byFrom.set(from, {from, to: `/releases/${slug}`});
    }
  }
  // Tag pages that only release posts used. Their /blog/tags URLs were indexed,
  // so they redirect too. Release tags that /blog posts still use (crewx, ai,
  // release) keep their /blog pages, so they need no entry.
  for (const tag of ['skills', 'slack']) {
    const from = `/blog/tags/${tag}`;
    byFrom.set(from, {from, to: `/releases/tags/${tag}`});
  }
  return Array.from(byFrom.values());
})();

const config: Config = {
  title: 'SowonAI CrewX',
  tagline: 'Bring Your Own AI(BYOA) team in Slack/IDE with your existing subscriptions',
  // New file name on purpose: browsers cache favicons per URL, so a changed
  // name forces a refresh. The old /img/favicon.ico and /favicon.ico stay in
  // static/ with the same CrewX bytes for anything still pointing at them.
  favicon: 'img/crewx-favicon.png',
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/img/crewx-apple-touch-icon.png',
      },
    },
  ],

  future: {
    v4: true,
  },

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  url: 'https://www.crewx.dev',
  baseUrl: '/',

  organizationName: 'sowonlabs',
  projectName: 'crewx-site',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ko: {
        label: '한국어',
        direction: 'ltr',
        htmlLang: 'ko-KR',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/sowonlabs/crewx-site/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/sowonlabs/crewx-site/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-TWF29XY17Y',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    function crewxTailwindPlugin() {
      return {
        name: 'crewx-tailwind',
        configurePostCss(postcssOptions: any) {
          postcssOptions.plugins.push(tailwindcss, scopePreflightPlugin, autoprefixer);
          return postcssOptions;
        },
      };
    },
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'templates',
        path: 'templates',
        routeBasePath: 'templates',
        sidebarPath: './sidebarsTemplates.ts',
        editUrl: 'https://github.com/sowonlabs/crewx-site/tree/main/',
      },
    ],
    // Release notes: a second blog instance at /releases, same options as /blog.
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'releases',
        path: 'releases',
        routeBasePath: 'releases',
        blogTitle: 'Release Notes',
        blogDescription: 'Release Notes',
        blogSidebarTitle: 'Recent releases',
        // All release notes on one page for now; use a number once the list grows.
        postsPerPage: 'ALL',
        showReadingTime: true,
        feedOptions: {
          type: ['rss', 'atom'],
          xslt: true,
        },
        editUrl: 'https://github.com/sowonlabs/crewx-site/tree/main/',
        onInlineTags: 'warn',
        onInlineAuthors: 'warn',
        onUntruncatedBlogPosts: 'warn',
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: releaseRedirects,
      },
    ],
    // Click-to-zoom for pictures. Its selector and background live in themeConfig.zoom.
    'docusaurus-plugin-image-zoom',
  ],

  themeConfig: {
    image: 'img/crewx_logo_512x512.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'CrewX',
      logo: {
        alt: 'CrewX Logo',
        src: 'img/crewx_logo_128x128.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/releases', label: 'Releases', position: 'left'},
        {to: '/templates', label: 'Templates', position: 'left'},
        {to: '/download', label: 'Download', position: 'right', className: 'navbar-download'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/sowonlabs/crewx',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/sowonlabs/crewx',
            },
            {
              label: 'Twitter',
              href: 'https://x.com/dohapark81',
            },
            {
              label: 'Threads',
              href: 'https://www.threads.com/@sowonlabs',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Download',
              to: '/download',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Releases',
              to: '/releases',
            },
            {
              label: 'Templates',
              to: '/templates',
            },
          ],
        },
      ],
      copyright: 'Copyright © 2025 SowonLabs. Built with Docusaurus.',
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    // Picture zoom for post and doc bodies. Logos, avatars, emoji, badges and
    // pictures wrapped in a link are left out of the selector.
    zoom: {
      selector: [
        '.markdown img:not(a *)',
        ':not([class*="emoji" i]):not([src*="emoji" i])',
        ':not([class*="avatar" i]):not([src*="avatar" i])',
        ':not([class*="logo" i]):not([alt*="logo" i]):not([src*="logo" i])',
        ':not([class*="badge" i]):not([alt*="badge" i]):not([src*="badge" i]):not([src*="shields.io" i])',
      ].join(''),
      background: {
        light: '#ffffff',
        dark: '#1b1b1d', // Infima's dark page background, so the zoom blends into the page
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
