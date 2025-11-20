---
sidebar_position: 4
title: Creating Custom Templates
---

# Creating Custom Templates

Learn how to create your own CrewX templates for your team or organization.

## 🏢 Why Custom Templates?

- **Standardize workflows** across your team
- **Share best practices** through pre-configured agents
- **Speed up onboarding** with ready-to-use project structures
- **Maintain consistency** in project setup and configuration

## 🚀 Quick Start

### 1. Fork & Clone

```bash
git clone https://github.com/sowonlabs/crewx-templates
cd crewx-templates
```

### 2. Create New Template

```bash
# Create template directory
mkdir my-template
cd my-template

# Create required files
touch crewx.yaml
touch README.md
```

### 3. Define Template Metadata

Edit `crewx.yaml`:

```yaml
metadata:
  name: "my-template"
  displayName: "My Template"
  description: "Description of what this template does"
  version: "1.0.0"
  author: "Your Name"
  tags: ["category", "feature"]
  crewxVersion: ">=0.7.0"

agents:
  - id: "my_agent"
    name: "My Agent"
    description: "Agent description"
    capabilities:
      - query
      - implementation
    inline:
      provider: "cli/claude"
      model: "sonnet"
      prompt: |
        You are an expert agent for...
```

### 4. Update Template Registry

Edit `templates.json` at repository root:

```json
{
  "version": "1.0.0",
  "templates": [
    {
      "name": "my-template",
      "displayName": "My Template",
      "description": "Template description",
      "version": "1.0.0",
      "path": "my-template",
      "author": "Your Name",
      "tags": ["category", "feature"],
      "crewxVersion": ">=0.7.0",
      "features": [
        "Feature 1",
        "Feature 2"
      ]
    }
  ]
}
```

## 📝 Template Structure

### Minimal Template

```
my-template/
├── crewx.yaml    # Required: Agent config + metadata
└── README.md     # Required: Usage guide
```

### Full Template

```
my-template/
├── crewx.yaml           # Agent configuration
├── README.md            # Usage guide
├── .gitignore           # Git ignore patterns
├── package.json         # For Node.js projects
├── docs/                # Documentation
├── scripts/             # Automation scripts
└── examples/            # Example files
```

## 🤖 Using Template Manager Agent

The template repository includes a `@template_manager` agent to automate template creation:

### Create New Template

```bash
cd crewx-templates

crewx execute "@template_manager Create new template: my-template, description: 'My awesome template'"
```

**Agent automatically:**
- Creates template directory
- Generates `crewx.yaml` with metadata
- Creates `README.md` stub
- Updates `templates.json`

### Validate Templates

```bash
# Validate all templates
crewx query "@template_manager Validate all templates and report issues"

# Sync templates.json
crewx execute "@template_manager Sync templates.json with current templates"
```

## 📦 Publishing Your Template

### 1. Push to GitHub

```bash
git remote set-url origin https://github.com/yourorg/crewx-templates
git add .
git commit -m "Add my-template"
git push
```

### 2. Team Usage

```bash
# Set custom template repository
export CREWX_TEMPLATE_REPO=https://github.com/yourorg/crewx-templates

# Use your template
crewx template init my-template
```

### 3. Contributing to Official Repository

1. Fork [crewx-templates](https://github.com/sowonlabs/crewx-templates)
2. Create your template
3. Submit Pull Request
4. After merge, available to everyone!

## ✅ Template Requirements

### Must Have

- ✅ `crewx.yaml` with `metadata` section
- ✅ `README.md` with usage instructions
- ✅ Clear template description
- ✅ Working agent configurations

### Should Have

- ✅ Example files or starter code
- ✅ Documentation for key features
- ✅ `.gitignore` if applicable
- ✅ Version number following semver

### Nice to Have

- ✅ Automated tests
- ✅ CI/CD configuration
- ✅ Multiple agent examples
- ✅ Screenshots or demos

## 💡 Best Practices

### 1. Clear Documentation

```markdown
# Template Name

## What It Does
Brief description

## Quick Start
```bash
crewx template init template-name
```

## Configuration
How to customize...
```

### 2. Focused Agents

Create agents that solve **one specific problem** well:

```yaml
agents:
  - id: "code_reviewer"
    name: "Code Reviewer"
    description: "Reviews code for best practices"
    # Focused on code review only
```

### 3. Sensible Defaults

Provide good defaults, allow customization:

```yaml
metadata:
  name: "api-template"
  # Good defaults
  port: 3000
  environment: "development"
```

### 4. Version Compatibility

Specify minimum CrewX version:

```yaml
metadata:
  crewxVersion: ">=0.7.0"
```

## 🔗 Resources

- [Official Templates](https://github.com/sowonlabs/crewx-templates)
- [CrewX Documentation](/docs/intro)
- [Community Discussions](https://github.com/sowonlabs/crewx/discussions)

## 📄 License

Templates can use any license, but MIT is recommended for maximum sharing.
