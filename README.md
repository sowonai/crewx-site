# CrewX Documentation Site

This is the official documentation and blog site for [CrewX](https://github.com/sowonlabs/crewx), built with [Docusaurus](https://docusaurus.io/).

## 🚀 Quick Start

### Prerequisites

- Node.js version 20.0 or above
- npm 8.0 or above

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Serve

```bash
npm run serve
```

This command serves the built website locally.

## 📁 Project Structure

```
crewx-site/
├── blog/                   # Blog posts
│   ├── authors.yml        # Blog authors configuration
│   └── tags.yml          # Blog tags configuration
├── docs/                  # Documentation files
│   ├── intro.md          # Getting started guide
│   ├── tutorial-basics/  # Basic tutorials
│   └── tutorial-extras/  # Advanced tutorials
├── src/
│   ├── components/       # React components
│   ├── css/             # Custom CSS
│   └── pages/           # Custom pages
├── static/
│   └── img/             # Static images (logos, etc.)
├── docusaurus.config.ts  # Docusaurus configuration
├── sidebars.ts          # Documentation sidebar
└── package.json
```

## 🎨 Customization

### Updating the Logo

Replace the logo files in `static/img/`:
- `crewx_logo_128x128.png` - Navbar logo
- `crewx_logo_512x512.png` - Social card image
- `favicon.ico` - Browser favicon

### Modifying the Homepage

Edit `src/pages/index.tsx` and `src/components/HomepageFeatures/index.tsx` to customize the landing page.

### Adding Documentation

1. Create a new `.md` file in the `docs/` directory
2. Add frontmatter with `sidebar_position`
3. Update `sidebars.ts` if needed

### Writing Blog Posts

1. Create a new `.md` file in the `blog/` directory
2. Use the naming format: `YYYY-MM-DD-post-title.md`
3. Add frontmatter with title, authors, and tags

## 🚢 Deployment

This site is configured to deploy to GitHub Pages automatically via GitHub Actions.

### Setup GitHub Pages

1. Create a repository named `crewx-site` under the `sowonlabs` organization
2. Push this code to the `main` branch
3. Go to repository Settings → Pages
4. Set Source to "GitHub Actions"
5. The site will be available at `https://sowonlabs.github.io/crewx-site/`

### Manual Deployment

```bash
npm run deploy
```

This command builds the website and pushes to the `gh-pages` branch.

## 📝 Configuration

Key configuration files:

- **docusaurus.config.ts**: Main Docusaurus configuration
  - Site metadata (title, tagline, url)
  - Theme configuration
  - Plugin settings
  - Navbar and footer links

- **sidebars.ts**: Documentation sidebar structure

- **package.json**: Dependencies and scripts

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build production site
- `npm run serve` - Serve built site locally
- `npm run deploy` - Deploy to GitHub Pages
- `npm run clear` - Clear Docusaurus cache
- `npm run typecheck` - Run TypeScript type checking

## 📚 Documentation

For more information about Docusaurus, check out:

- [Docusaurus Documentation](https://docusaurus.io/)
- [Docusaurus GitHub](https://github.com/facebook/docusaurus)

## 📄 License

MIT License - see [CrewX repository](https://github.com/sowonlabs/crewx) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please visit the [CrewX repository](https://github.com/sowonlabs/crewx) or open an issue.
