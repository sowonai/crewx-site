import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/slack-setup',
      ],
    },
    {
      type: 'category',
      label: 'CLI',
      items: ['cli/commands', 'cli/templates'],
    },
    {
      type: 'category',
      label: 'Configuration',
      items: ['configuration/agents'],
    },
    {
      type: 'category',
      label: 'Integration',
      items: ['integration/mcp'],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'advanced/skills',
        'advanced/remote-agents',
        'advanced/templates',
        'advanced/template-variables',
        'advanced/layouts',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['troubleshooting/common-issues'],
    },
    {
      type: 'category',
      label: 'Contributing',
      items: [
        'contributing/guide',
        'contributing/development',
      ],
    },
  ],
};

export default sidebars;
