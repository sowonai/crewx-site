# Project Scaffolding

CrewX project scaffolding allows you to package agent configurations and documents as reusable templates. Share your team's workflows, best practices, and specialized agents across projects using the `crewx template` command.

## Overview

The `crewx template` command provides **project scaffolding** capabilities that include:
- Pre-configured agents (`agents/` directory)
- Supporting documents (`documents/` directory)
- Team workflows and best practices

This is different from the [Handlebars Template System](../advanced/templates.md) used for dynamic variable substitution in agent prompts.

## Template Commands

### List Available Templates

```bash
crewx template list
```

Shows all available templates with their descriptions.

### Install a Template

```bash
crewx template init <template-name>
```

Installs the specified template to your project:
- Copies agent configurations to `agents/` directory
- Copies documents to `documents/` directory
- Makes agents immediately available via `crewx agent ls`

**Example:**
```bash
crewx template init wbs-automation
# Installed agents:
# - @crewx_claude_dev (main developer)
# - @crewx_codex_dev (assistant developer)
# - @crewx_crush_dev (junior developer)
# - @wbs_updater (WBS document updater)
# - @time_tracker (work time tracker)
```

### Show Template Information

```bash
crewx template info <template-name>
```

Displays detailed information about a template:
- Description
- Included agents
- Included documents
- Usage instructions

## Built-in Templates

### wbs-automation

**Description:** Work Breakdown Structure (WBS) based project management system with multi-agent collaboration.

**Agents:**
- `@crewx_claude_dev` - Main developer (Claude Sonnet)
  - Complex feature development
  - Architecture design
  - Critical refactoring

- `@crewx_codex_dev` - Assistant developer (GitHub Copilot)
  - Standard feature implementation
  - Code review
  - Test writing

- `@crewx_crush_dev` - Junior developer (GLM-4.6, free)
  - Simple repetitive tasks
  - Document organization
  - Log analysis

- `@wbs_updater` - WBS document updater
  - Updates WBS based on completed work
  - Tracks progress

- `@time_tracker` - Work time tracker
  - Analyzes Git commit logs
  - Tracks time spent per agent
  - Generates time reports

**Documents:**
- `wbs_guide.md` - WBS documentation guide
- `agent_responsibilities.md` - Agent role definitions

**Usage Example:**
```bash
# Install template
crewx template init wbs-automation

# Complex work → Claude
crewx x "@crewx_claude_dev implement user authentication system"

# Standard work → Codex
crewx x "@crewx_codex_dev create 10 REST API endpoints"

# Simple work → Free model
crewx x "@crewx_crush_dev analyze and organize log files"

# Update WBS
crewx x "@wbs_updater reflect today's work in WBS document"
```

## Creating Custom Templates

### Template Directory Structure

```
templates/
└── my-template/
    ├── agents/
    │   ├── agent1.yaml
    │   ├── agent2.yaml
    │   └── ...
    └── documents/
        ├── guide.md
        ├── reference.md
        └── ...
```

### Agent Configuration Files

Each agent is defined in a separate YAML file:

**Example: `templates/my-template/agents/code_reviewer.yaml`**
```yaml
id: code_reviewer
name: Code Review Expert
provider: api/anthropic
inline:
  apiKey: "{{env.ANTHROPIC_API_KEY}}"
  model: "claude-sonnet-4-5-20250929"
  prompt: |
    You are a professional code reviewer.

    Review code for:
    - Bugs and logic errors
    - Security vulnerabilities
    - Performance issues
    - Code style and best practices

    Provide actionable recommendations.
```

### Document Files

Supporting documents in Markdown format:

**Example: `templates/my-template/documents/review_checklist.md`**
```markdown
# Code Review Checklist

## Security
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection

## Performance
- [ ] Algorithm efficiency
- [ ] Database query optimization
- [ ] Caching strategy

## Code Quality
- [ ] Error handling
- [ ] Logging
- [ ] Documentation
```

### Installing Custom Templates

```bash
# From local directory
crewx template init ./templates/my-template

# From Git repository
git clone https://github.com/team/crewx-templates.git
crewx template init ./crewx-templates/my-template
```

## Template Best Practices

### 1. Clear Agent Roles

Define specific, non-overlapping responsibilities for each agent:

```yaml
# ✅ Good - Specific role
id: security_auditor
prompt: |
  You are a security auditor specializing in web application vulnerabilities.
  Focus on OWASP Top 10 risks...

# ❌ Bad - Too general
id: helper
prompt: |
  You help with everything.
```

### 2. Use Environment Variables

Store API keys and sensitive data in environment variables:

```yaml
# ✅ Good - Uses environment variable
inline:
  apiKey: "{{env.ANTHROPIC_API_KEY}}"

# ❌ Bad - Hardcoded API key
inline:
  apiKey: "sk-ant-api03-hardcoded-key"
```

### 3. Include Supporting Documents

Reference documents in agent prompts using the Handlebars template system:

```yaml
id: code_reviewer
inline:
  documents:
    - id: checklist
      path: ./documents/review_checklist.md
  prompt: |
    You are a code reviewer. Use this checklist:

    {{{documents.checklist.content}}}
```

### 4. Version Your Templates

Use Git tags for template versioning:

```bash
git clone https://github.com/team/templates.git
git checkout v1.2.0
crewx template install ./templates/review-system
```

## Project Scaffolding vs Handlebars Template System

CrewX has two different "template" features that serve different purposes:

| Feature | Project Scaffolding | Handlebars Template System |
|---------|---------------------|----------------------------|
| **Purpose** | Package & distribute agents | Dynamic variable substitution |
| **Commands** | `crewx template` | N/A (built into agent prompts) |
| **Location** | `templates/` directory | Agent `prompt` field |
| **Content** | Agents + documents | Variables + helpers |
| **Use case** | Team sharing, reuse | Prompt customization |

**Project Scaffolding (`crewx template`):**
```bash
crewx template init wbs-automation
```

**Handlebars Template System (in agent prompts):**
```yaml
agents:
  - id: my_agent
    inline:
      prompt: |
        You are {{agent.name}}.
        Environment: {{env.NODE_ENV}}
        {{{documents.guide.content}}}
```

See the [Handlebars Template System](../advanced/templates.md) guide for dynamic prompt templates.

## Example Workflows

### Scenario 1: Team Onboarding

```bash
# New team member setup
git clone https://github.com/company/project
cd project

# Install standard company templates
crewx template init code-standards
crewx template init security-review

# Agents now available
crewx agent ls
# - @code_reviewer
# - @security_auditor
# - @performance_optimizer
```

### Scenario 2: Multi-Project Consistency

```bash
# Project A
cd project-a
crewx template init backend-api
crewx x "@api_generator create user endpoints"

# Project B - Same agents, consistent results
cd ../project-b
crewx template init backend-api
crewx x "@api_generator create product endpoints"
```

### Scenario 3: Specialized Workflows

```bash
# Install WBS automation
crewx template init wbs-automation

# Complex architecture → Main developer
crewx x "@crewx_claude_dev design microservices architecture"

# Implementation → Assistant developer
crewx x "@crewx_codex_dev implement service endpoints"

# Simple tasks → Free model
crewx x "@crewx_crush_dev organize documentation files"

# Track progress
crewx x "@wbs_updater update WBS with completed work"
```

## Troubleshooting

### Template Not Found

```bash
crewx template list
# Check available templates

crewx template info <name>
# Verify template exists
```

### Agent Conflicts

If template agents conflict with existing agents:

```bash
# Rename existing agents in crewx.yaml before installing
vim crewx.yaml

# Or modify template agents before installation
vim templates/my-template/agents/agent1.yaml
# Change agent id to avoid conflicts
```

### Missing Environment Variables

Template agents may require API keys:

```bash
# Check agent configuration
cat agents/code_reviewer.yaml

# Set required environment variables
export ANTHROPIC_API_KEY="your-key"
export OPENAI_API_KEY="your-key"
```

## Next Steps

- Learn about [Handlebars Template System](../advanced/templates.md) for dynamic prompt variables
- Explore Agent Configuration
- Check Remote Agents guide for team collaboration
