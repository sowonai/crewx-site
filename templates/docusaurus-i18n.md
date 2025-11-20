---
sidebar_position: 3
title: Docusaurus i18n
---

# Docusaurus i18n Template

Docusaurus site template with AI-powered automatic translation workflow (Korean ↔ English).

## 🎯 Overview

This template provides a ready-to-use Docusaurus site with complete i18n setup and AI-powered translation automation. Write content once in Korean, translate to English automatically.

## ✨ Key Features

- **Fixed Docusaurus Version**: Pinned to 3.9.2 for stability
- **Pre-configured i18n**: Korean and English locales ready to use
- **Auto-translation Scripts**: One command to translate all content
- **Translation Agents**: `@blog_translator` and `@doc_translator` included
- **Write Once, Publish Twice**: Single source, multiple languages

## 🚀 Quick Start

### Installation

```bash
crewx template init docusaurus-i18n
cd docusaurus-i18n
npm install
```

### Development

```bash
# Start development server (default locale)
npm start

# Start with specific locale
npm start -- --locale ko

# Build all locales
npm run build && npm run serve
```

### Translation Workflow

#### 1. Write Korean Content

```bash
# Write Korean blog
crewx x "@blog_manager 기능 소개 블로그를 한국어로 작성해줘"
```

#### 2. Auto-translate to English

```bash
# Check untranslated content
npm run translate:check

# Translate all
npm run translate:ko-to-en
```

#### 3. Deploy

```bash
npm run build
git add .
git commit -m "feat: Add new blog (ko+en)"
git push
```

## 📋 Template Structure

```
docusaurus-i18n/
├── blog/                   # English blog posts
├── docs/                   # English documentation
├── i18n/ko/               # Korean translations
│   ├── docusaurus-plugin-content-blog/
│   └── docusaurus-plugin-content-docs/
├── src/                   # React components
├── static/                # Static assets
├── crewx.yaml            # Agent configuration
├── docusaurus.config.ts  # Docusaurus config
└── package.json          # Dependencies
```

## 🤖 Agents Included

- **@blog_manager**: Blog content creation (Korean-first)
- **@blog_translator**: Professional blog translation
- **@doc_translator**: Documentation translation
- **@template_page_manager**: Template page management

## 🔧 Configuration

### Add New Locale

Edit `docusaurus.config.ts`:

```typescript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ko', 'ja'], // Add 'ja'
}
```

### Customize Translation

Edit agent prompts in `crewx.yaml` to adjust translation style.

## 📦 Requirements

- Node.js >= 20.0
- npm >= 8.0
- CrewX >= 0.7.0

## 💡 Use Cases

- **Technical Documentation**: Multi-language docs site
- **Developer Blog**: Reach global + local audiences
- **Product Site**: Showcase features in multiple languages
- **Open Source Projects**: Community docs in various languages

## 🔗 Resources

- [Template Repository](https://github.com/sowonlabs/crewx-templates/tree/main/docusaurus-i18n)
- [Docusaurus i18n Guide](https://docusaurus.io/docs/i18n/introduction)
- [This Site](https://github.com/sowonlabs/crewx-site) - Built with this template!
