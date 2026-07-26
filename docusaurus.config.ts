import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

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

const config: Config = {
  title: 'SowonAI CrewX',
  tagline: 'Bring Your Own AI(BYOA) team in Slack/IDE with your existing subscriptions',
  favicon: 'img/favicon.ico',

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
  ],

  themeConfig: {
    image: 'img/crewx_logo_512x512.png',
    colorMode: {
      respectPrefersColorScheme: true,
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
        {to: '/templates', label: 'Templates', position: 'left'},
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
              label: 'Blog',
              to: '/blog',
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
  } satisfies Preset.ThemeConfig,
};

export default config;
