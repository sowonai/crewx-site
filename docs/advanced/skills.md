---
sidebar_position: 5
---

# Skills System

> Reusable AI capabilities compatible with Claude Code

CrewX Skills system allows you to create reusable AI capabilities that can be shared and invoked by agents. Skills are **100% compatible with Claude Code**, meaning you can use existing Claude Code skills directly in CrewX.

## What are Skills?

Skills are specialized functions that extend agent capabilities. They can be:
- **Query skills**: Read-only analysis and inspection tasks
- **Execute skills**: File creation, modification, and system operations
- **Shared across agents**: Any agent can invoke available skills

## Quick Start

### 1. Create a Skill

Create a `.md` file in `.claude/skills/` directory:

```bash
mkdir -p .claude/skills
```

Example skill (`.claude/skills/code-review.md`):

```markdown
# Code Review Skill

Review code for:
- Security vulnerabilities
- Performance issues
- Best practices
- Code style consistency

Provide actionable feedback with specific line numbers.
```

### 2. Register the Skill

Add to your `crewx.yaml`:

```yaml
skills:
  - code-review  # Matches filename: .claude/skills/code-review.md
  - test-generator
  - docs-writer
```

### 3. Use the Skill

Agents can now invoke skills:

```bash
crewx query "@claude use code-review skill on src/auth.ts"
crewx execute "@gemini use test-generator for LoginComponent"
```

## Claude Code Compatibility

CrewX skills are fully compatible with Claude Code. You can:

1. **Use existing Claude Code skills** - Simply add skill names to `crewx.yaml`
2. **Share skills between tools** - Same `.claude/skills/` directory
3. **No conversion needed** - Skills work as-is in both tools

### Using Claude Code Skills

If you already have skills in `.claude/skills/`, just enable them:

```yaml
# crewx.yaml
skills:
  - my-existing-skill  # From .claude/skills/my-existing-skill.md
```

## Skill Definition Format

Skills are Markdown files with clear instructions:

```markdown
# Skill Name

Brief description of what this skill does.

## When to Use
- Scenario 1
- Scenario 2

## Instructions
1. Step-by-step process
2. Expected behavior
3. Output format

## Examples
[Optional] Usage examples
```

## Example Skills

### Code Security Audit

`.claude/skills/security-audit.md`:

```markdown
# Security Audit Skill

Perform comprehensive security analysis:

## Checks
- SQL injection vulnerabilities
- XSS risks in user inputs
- Authentication/authorization flaws
- Sensitive data exposure
- Dependency vulnerabilities

## Output
List each issue with:
- Severity (High/Medium/Low)
- File and line number
- Explanation
- Fix recommendation
```

### API Documentation Generator

`.claude/skills/api-docs.md`:

```markdown
# API Documentation Generator

Generate OpenAPI/Swagger documentation from code.

## Process
1. Identify all API endpoints
2. Extract request/response schemas
3. Document authentication requirements
4. Generate OpenAPI 3.0 spec
5. Create example requests

## Format
Output as `openapi.yaml` following OpenAPI 3.0 standard.
```

## Configuration

### Global Skills

Define in `crewx.yaml` for all agents:

```yaml
skills:
  - code-review
  - test-generator
  - security-audit
```

### Agent-Specific Skills

Restrict skills to specific agents:

```yaml
agents:
  - id: "security_expert"
    skills:
      - security-audit
      - vulnerability-scan
    inline:
      provider: "cli/claude"
      prompt: |
        You are a security expert. Use available skills for thorough analysis.
```

## Skill Invocation

Agents automatically detect and use skills when appropriate:

```bash
# Explicit invocation
crewx query "@claude use security-audit skill on src/"

# Implicit (agent decides)
crewx query "@claude check security issues in authentication code"
```

## Best Practices

### 1. Clear Naming
Use descriptive, action-oriented names:
- ✅ `api-docs-generator`
- ✅ `database-migration-helper`
- ❌ `helper`
- ❌ `util`

### 2. Single Responsibility
Each skill should have one clear purpose:

```markdown
# ✅ Good: Specific task
# Database Schema Migration

Generate SQL migration scripts for schema changes.
```

```markdown
# ❌ Too broad
# Database Helper

Do various database tasks.
```

### 3. Actionable Instructions
Provide step-by-step guidance:

```markdown
## Process
1. Analyze current schema
2. Identify differences
3. Generate ALTER statements
4. Create rollback script
5. Output as versioned migration file
```

### 4. Example Outputs
Show expected results:

```markdown
## Example Output

```sql
-- Migration: 20250111_add_users_table.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);
```
```

## Sharing Skills

Skills in `.claude/skills/` are automatically available to:
- CrewX agents
- Claude Code (VS Code extension)
- Any tool respecting the skills convention

This means you can:
1. Create skills once
2. Use across multiple tools
3. Share with team via git

## Skills vs. Agents

| Feature | Skills | Agents |
|---------|--------|--------|
| Purpose | Reusable capabilities | Full workflow orchestration |
| Scope | Specific task | General problem-solving |
| Invocation | Called by agents | Called by users |
| Context | Task-specific | Project-wide |

**When to use Skills:**
- Repetitive tasks with clear steps
- Specialized domain knowledge
- Consistent output format needed

**When to use Agents:**
- Complex multi-step workflows
- Decision-making required
- Dynamic problem-solving

## Troubleshooting

### Skill Not Found

```bash
Error: Skill 'my-skill' not found
```

**Solution:**
1. Check file exists: `.claude/skills/my-skill.md`
2. Verify skill is registered in `crewx.yaml`
3. Ensure filename matches exactly (case-sensitive)

### Skill Not Working as Expected

**Solution:**
1. Review skill definition for clarity
2. Add more specific instructions
3. Include example inputs/outputs
4. Test with explicit invocation first

## Advanced Usage

### Conditional Skills

Enable skills based on environment:

```yaml
skills:
  - code-review
  - test-generator
  {{#if (eq env.NODE_ENV "production")}}
  - deployment-checker
  {{/if}}
```

### Skill Chaining

Agents can chain multiple skills:

```bash
# Agent will use multiple skills automatically
crewx execute "@claude
  1. Use security-audit to check code
  2. Use test-generator for failing cases
  3. Use code-review for final validation
"
```

## Next Steps

- 📖 [Template System](./templates.md) - Dynamic prompts and knowledge management
- 🎨 [Layout System](./layouts.md) - Reusable prompt templates
- ⚙️ [Agent Configuration](../configuration/agents.md) - Advanced agent setup

---

**Related:**
- [Claude Code Skills Documentation](https://docs.anthropic.com/claude-code/skills)
