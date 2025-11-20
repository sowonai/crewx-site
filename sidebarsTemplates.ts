import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  templatesSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'Available Templates',
      items: [
        'wbs-automation',
        'docusaurus-i18n',
      ],
    },
    {
      type: 'doc',
      id: 'creating-custom',
      label: 'Creating Custom Templates',
    },
  ],
};

export default sidebars;
