# CrewX Site - Project Overview

## Project Introduction

**CrewX Site** is the official documentation and blog site for the CrewX project. Built on Docusaurus, it provides comprehensive information about CrewX features, usage guides, and tutorials.

### What is CrewX?

CrewX is a **multi-AI agent collaboration platform** that enables developers to work with multiple AI assistants simultaneously.

**Key Features:**
- **CLI Interface**: Direct agent interaction via command-line tool
- **Slack Bot**: Team collaboration through Slack workspace integration
- **MCP Server**: IDE integration via Model Context Protocol (VS Code, etc.)
- **Multiple AI Providers**: Support for Claude, Gemini, GitHub Copilot, and more

## Site Information

- **Site URL**: https://sowonlabs.github.io/crewx-site/
- **GitHub Repository**: https://github.com/sowonlabs/crewx
- **Organization**: SowonLabs
- **License**: MIT

## Project Structure

```
crewx-site/
├── blog/                    # Blog posts
├── docs/                    # Documentation files
│   ├── tutorial-basics/     # Basic tutorials
│   └── tutorial-extras/     # Advanced tutorials
├── src/                     # Source code
│   ├── components/          # React components
│   ├── css/                 # Custom styles
│   └── pages/               # Custom pages
├── static/                  # Static files (images, favicon, etc.)
│   └── img/                 # Image files
├── .github/                 # GitHub Actions workflows
├── build/                   # Build output (auto-generated)
├── node_modules/            # Dependencies
├── docusaurus.config.ts     # Docusaurus configuration
├── sidebars.ts              # Sidebar structure definition
├── package.json             # Project metadata and dependencies
├── tsconfig.json            # TypeScript configuration
├── crewx.yaml               # CrewX agent configuration
├── crewx-manual.md          # CrewX user manual
├── slack-app-manifest.yaml  # Slack app manifest
└── start-slack.sh           # Slack bot startup script
```

## Technology Stack

### Framework & Libraries
- **Docusaurus 3.9.2**: Documentation site generator
- **React 19.0.0**: UI library
- **TypeScript 5.6.2**: Type-safe language
- **MDX**: Markdown + JSX support

### Build & Deployment
- **Node.js**: >=20.0
- **npm**: >=8.0
- **GitHub Pages**: Hosting platform

## Main Commands

```bash
# Start development server
npm start

# Production build
npm run build

# Preview build locally
npm run serve

# Type check
npm run typecheck

# Deploy to GitHub Pages
npm run deploy

# Clear cache
npm run clear
```

## Development Workflow

1. **Local Development**
   ```bash
   npm start
   # Live preview at http://localhost:3000
   ```

2. **Writing Documentation**
   - Add Markdown files to `docs/` folder
   - Configure navigation structure in `sidebars.ts`

3. **Writing Blog Posts**
   - Add date-formatted Markdown files to `blog/` folder
   - Set metadata using Front matter

4. **Build & Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## CrewX Integration

This project is integrated with CrewX agents:

- **crewx.yaml**: Custom agent configuration
- **crewx-manual.md**: CrewX user manual (agent reference documentation)
- **slack-app-manifest.yaml**: Slack integration configuration
- **start-slack.sh**: Slack bot startup script

### Using CrewX Agents

```bash
# List available agents
crewx agent ls

# Query quickstart agent
crewx query "@quickstart explain this project"

# Execute tasks via agent
crewx execute "@quickstart create a new documentation page"

# Query blog manager agent
crewx query "@blog-manager suggest 3 blog topics for next week"

# Create blog post via agent
crewx execute "@blog-manager write a tutorial about Slack integration"
```

## Available Agents

### @quickstart
Friendly assistant for the crewx-site project. Provides concise, actionable help.

### @blog-manager
Blog content creation and promotion specialist. Handles:
- Writing blog posts about CrewX features and tutorials
- Suggesting blog topics and content ideas
- Analyzing and improving existing blog posts
- Creating social media promotion content
- Supporting SEO optimization

## Documentation Management

### Documentation Structure
- **intro**: Getting started guide
- **tutorial-basics**: Basic feature tutorials
- **tutorial-extras**: Advanced features and additional content

### Documentation Writing Guide
1. Create `.md` or `.mdx` file in `docs/` folder
2. Add Front matter:
   ```md
   ---
   sidebar_position: 1
   title: Document Title
   ---
   ```
3. Write content in Markdown
4. Embed React components if needed (MDX)

## Blog Management

### Blog Structure
Blog files are located in `blog/` directory with the following format:

**File naming convention:**
- `YYYY-MM-DD-slug-name.md` (e.g., `2025-01-15-welcome-to-crewx.md`)

**Front Matter required fields:**
```yaml
---
slug: article-slug
title: Blog Title
authors: [sowonlabs, doha]
tags: [crewx, ai, slack, tutorial, release]
---
```

**Available Authors:**
- `sowonlabs`: SowonLabs Team
- `doha`: Doha Lee (Founder)

**Available Tags:**
- `crewx`: CrewX product updates
- `ai`: AI and machine learning topics
- `slack`: Slack integration and collaboration
- `tutorial`: How-to guides
- `release`: Product releases and updates

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

MIT License - Free to use, modify, and distribute

## Contact

- **Organization**: SowonLabs
- **Website**: https://sowonlabs.com
- **GitHub**: https://github.com/sowonlabs/crewx
- **Issue Tracker**: https://github.com/sowonlabs/crewx-site/issues

---

**Reference**: For detailed CrewX usage, see [crewx-manual.md](crewx-manual.md).
