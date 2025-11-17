---
slug: cli-to-api-migration-guide
title: "CrewX: From Local Development to Production Deployment - The Journey from CLI to API Provider"
authors: [doha]
tags: [crewx, tutorial, ai]
---

How can you integrate an AI agent you've completed locally into a production web server? CrewX provides a clear migration path from the CLI Provider to the API Provider. This guide walks through real-world development scenarios and shows you step-by-step how to migrate.

<!--truncate-->

## Scenario: From Local Development to Production

As a developer, you'll embark on the following journey:

1. **Local Development**: Rapidly prototype AI agents using the CLI Provider
2. **API Provider Transition**: Configuration changes for the production environment
3. **Production Deployment**: Automate and operate with CLI commands

Let's explore this process step by step.

---

## Step 1: Local Development (CLI Provider)

### Why Start with the CLI Provider?

The CLI Provider is the fastest way to get started in your local development environment:

- **Immediately Available**: Just install `claude`, `gemini`, or `copilot` CLI
- **File System Access**: Direct access to local project files
- **Fast Iteration**: Test immediately after code changes
- **Permission Model**: Agents can request approval before modifying files

### Setting Up Your Local Development Environment

**Initialize your project:**

```bash
# Install CrewX
npm install -g crewx

# Create project folder
mkdir my-ai-project
cd my-ai-project

# Initialize CrewX
crewx init
```

**Write your crewx.yaml:**

```yaml
agents:
  - id: "dev_assistant"
    name: "Development Assistant"
    provider: "cli/claude"  # Using CLI Provider
    working_directory: "./src"
    inline:
      model: "sonnet"
      prompt: |
        You are a development assistant.

        Your responsibilities:
        - Code review and analysis
        - Bug fix suggestions
        - Refactoring guidance
        - Writing test code

        Always prioritize code quality and best practices.
```

**Test your agent locally:**

```bash
# Analyze code (query mode)
crewx query "@dev_assistant Analyze the src/utils.ts file"

# Fix bugs (execute mode)
crewx execute "@dev_assistant Fix the API call error"
```

### Benefits of the CLI Provider

✅ **Fast Development Cycle**
```bash
# Test immediately after code changes
vim src/api.ts
crewx query "@dev_assistant Review the code I just modified"
```

✅ **File System Integration**
- Automatic read/write support for project files
- Git automation capabilities
- Direct execution of local tools (npm, git, etc.)

✅ **Security and Permission Control**
```bash
# Request approval when modifying files in execute mode
crewx execute "@dev_assistant Refactor index.ts"
# → Agent will request approval when trying to modify files
```

---

## Step 2: Production Preparation (Migrating to API Provider)

### Why Migrate to the API Provider?

To deploy your validated agent from local development to a production environment, you need the API Provider:

- **Server Deployment**: Integrate into web applications
- **HTTP-Based**: Call agents via RESTful APIs
- **Tool Calling**: Integrate custom tools using function calls
- **MCP Support**: Connect external services (GitHub, Slack, etc.)

### Update Your crewx.yaml

**CLI Provider Configuration (Current):**

```yaml
agents:
  - id: "dev_assistant"
    name: "Development Assistant"
    provider: "cli/claude"  # CLI Provider
    working_directory: "./src"
    inline:
      model: "sonnet"
      prompt: |
        You are a development assistant.
```

**API Provider Configuration (Production):**

```yaml
agents:
  - id: "prod_assistant"
    name: "Production Assistant"
    provider: "api/anthropic"  # Changed to API Provider
    model: "claude-sonnet-4-5-20250929"
    temperature: 0.7
    tools: ["read_file", "write_file", "grep", "ls", "replace", "run_shell_command"]
    inline:
      prompt: |
        You are a production AI assistant.

        Your responsibilities:
        - Code analysis and review
        - Automated bug fixes
        - Performance optimization suggestions
        - Security vulnerability checks
```

### Set Environment Variables

**Create .env file:**

```bash
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Production environment configuration
NODE_ENV=production
```

### API vs CLI Comparison

| Item | CLI Provider | API Provider |
|------|--------------|--------------|
| **Deployment Environment** | Local only | Local + Server |
| **Integration Method** | Process spawn | HTTP API |
| **Tool Calling** | Spawn-based | Function injection |
| **Performance** | Slower (process creation) | Faster (HTTP) |
| **Streaming** | stdio | HTTP SSE |
| **MCP Support** | Limited | Full support |
| **Multi-Model** | Provider array | LiteLLM Gateway |
| **Cost** | Provider cost only | Provider + gateway |

---

## Step 3: Production Deployment (CLI-Based)

### Operating Production with CLI

After switching to the API Provider, you can efficiently operate your production environment using CLI commands.

### Production Environment Configuration

**Production crewx.yaml setup:**

```yaml
agents:
  - id: "prod_assistant"
    name: "Production Assistant"
    provider: "api/anthropic"
    model: "claude-sonnet-4-5-20250929"
    working_directory: "/var/app/production"
    options:
      query:
        tools: ["read_file", "grep", "find"]
      execute:
        tools: ["read_file", "write_file", "run_shell"]
    inline:
      prompt: |
        You are a production AI assistant.

        Your responsibilities:
        - Log analysis and monitoring
        - Automated bug fixes
        - Performance optimization suggestions
        - Security vulnerability checks
```

### Writing Automation Scripts

**1. Log Analysis Automation (scripts/analyze-logs.sh):**

```bash
#!/bin/bash

# Analyze production logs
CREWX_CONFIG=./crewx.yaml crewx query "@prod_assistant \
  Analyze the /var/log/app/error.log file and summarize errors that occurred within the last hour"
```

**2. Daily Report Generation (scripts/daily-report.sh):**

```bash
#!/bin/bash

# Daily system status report
REPORT_FILE="reports/daily-$(date +%Y%m%d).md"

CREWX_CONFIG=./crewx.yaml crewx query "@prod_assistant \
  Analyze the system status and create a report including:
  1. Server resource usage
  2. Summary of errors from the last 24 hours
  3. Performance metrics analysis
  4. Security vulnerability check results" > "$REPORT_FILE"

echo "Daily report saved to $REPORT_FILE"
```

**3. Emergency Bug Fixes (scripts/hotfix.sh):**

```bash
#!/bin/bash

FILE=$1
ISSUE=$2

# Emergency bug fix
CREWX_CONFIG=./crewx.yaml crewx execute "@prod_assistant \
  Please fix the bug in $FILE: $ISSUE"

# Git commit
git add "$FILE"
git commit -m "fix: Hotfix for $ISSUE"
git push origin main
```

### Automate Scheduled Tasks with Cron

**Configure crontab:**

```bash
# Edit crontab
crontab -e
```

```cron
# Generate daily report at 9:00 AM
0 9 * * * /var/app/scripts/daily-report.sh

# Analyze logs every hour
0 * * * * /var/app/scripts/analyze-logs.sh

# Security audit every Monday at 10:00 AM
0 10 * * 1 CREWX_CONFIG=/var/app/crewx.yaml crewx query "@prod_assistant Scan the entire codebase for security vulnerabilities"
```

### CI/CD Pipeline Integration

**GitHub Actions Example (.github/workflows/ai-review.yml):**

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install CrewX
        run: npm install -g crewx

      - name: AI Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          crewx query "@prod_assistant \
            Review the changes in PR #${{ github.event.pull_request.number }} and check:
            1. Code quality and best practices
            2. Potential bugs and errors
            3. Performance issues
            4. Security vulnerabilities" > review.md

          cat review.md
```

**GitLab CI Example (.gitlab-ci.yml):**

```yaml
ai_code_review:
  stage: test
  script:
    - npm install -g crewx
    - export CREWX_CONFIG=./crewx.yaml
    - |
      crewx query "@prod_assistant \
        Analyze the recent commits and suggest improvements" > ai-review.txt
    - cat ai-review.txt
  only:
    - merge_requests
```

### Running in Docker Container

**Dockerfile:**

```dockerfile
FROM node:20-alpine

# Install CrewX
RUN npm install -g crewx

# Copy project files
WORKDIR /app
COPY crewx.yaml .
COPY scripts/ ./scripts/

# Set environment variables
ENV ANTHROPIC_API_KEY=your_api_key
ENV CREWX_CONFIG=/app/crewx.yaml

# Configure cron
RUN apk add --no-cache dcron
COPY crontab /etc/crontabs/root

CMD ["crond", "-f"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  crewx-automation:
    build: .
    volumes:
      - ./logs:/var/log/app
      - ./reports:/app/reports
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - CREWX_CONFIG=/app/crewx.yaml
    restart: unless-stopped
```

### Production Monitoring

**Real-Time Log Monitoring:**

```bash
# Detect log file changes and auto-analyze
tail -f /var/log/app/error.log | while read line; do
  if echo "$line" | grep -i "error\|fatal\|exception"; then
    crewx query "@prod_assistant Analyze the following error: $line"
  fi
done
```

**System Health Check:**

```bash
#!/bin/bash

# Check system status
HEALTH_STATUS=$(crewx query "@prod_assistant \
  Evaluate the system status based on the following metrics:
  - CPU Usage: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')
  - Memory Usage: $(free | grep Mem | awk '{print $3/$2 * 100.0}')
  - Disk Usage: $(df -h / | awk 'NR==2 {print $5}')
")

echo "$HEALTH_STATUS"

# Send alerts to Slack/Discord (optional)
if echo "$HEALTH_STATUS" | grep -i "critical\|warning"; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 System Health Alert:\n$HEALTH_STATUS\"}" \
    $SLACK_WEBHOOK_URL
fi
```

---

## Real-World Use Case Scenarios

### Scenario 1: Automated Code Review

**Local Development (CLI):**

```bash
# Review code locally
crewx query "@dev_assistant Review the changes in PR #123"
```

**Production (GitHub Actions):**

```yaml
# .github/workflows/pr-review.yml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install CrewX
        run: npm install -g crewx
      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          REVIEW=$(crewx query "@prod_assistant Review PR #${{ github.event.pull_request.number }}")
          echo "$REVIEW" >> $GITHUB_STEP_SUMMARY
```

### Scenario 2: Automated Bug Fixes

**Local Development (CLI):**

```bash
# Fix bugs locally
crewx execute "@dev_assistant Fix the null reference error in src/api.ts"
```

**Production (Automation Script):**

```bash
#!/bin/bash
# scripts/auto-fix.sh

ERROR_FILE=$1
ERROR_DESC=$2

# Fix bugs with AI
crewx execute "@prod_assistant Please fix the bug in $ERROR_FILE: $ERROR_DESC"

# Auto-commit
git add "$ERROR_FILE"
git commit -m "fix: Auto-fix by AI - $ERROR_DESC"
git push origin hotfix/auto-fix-$(date +%s)

echo "✅ Bug fix completed and pushed"
```

---

## Migration Checklist

### ✅ Phase 1: Local Development

- [ ] Install CrewX (`npm install -g crewx`)
- [ ] Install Claude/Gemini/Copilot CLI
- [ ] Write `crewx.yaml` (using CLI Provider)
- [ ] Test agents locally
- [ ] Validate functionality

### ✅ Phase 2: API Provider Transition

- [ ] Obtain API Keys (Anthropic/OpenAI/Google)
- [ ] Create and configure `.env` file with API Keys
- [ ] Update `crewx.yaml` (switch to API Provider)
- [ ] Configure tools and MCP
- [ ] Test API Provider locally

### ✅ Phase 3: Production Deployment (CLI-Based)

- [ ] Configure production `crewx.yaml`
- [ ] Write automation scripts (log analysis, report generation, etc.)
- [ ] Set up scheduled tasks with Cron
- [ ] Integrate CI/CD pipelines (GitHub Actions, GitLab CI, etc.)
- [ ] Configure Docker container (optional)
- [ ] Set up production monitoring

---

## Conclusion: "Ah! Deploying to Production This Easily?"

CrewX's migration path is clear:

1. **Local Development**: Rapid prototyping with the CLI Provider
2. **Production Transition**: Migration to the API Provider
3. **Automated Deployment**: Operations and automation via CLI commands

**Key Insights:**

✨ **Same crewx.yaml**: Use the same configuration file for both CLI and API Providers
✨ **Gradual Migration**: Transition step-by-step while running local and production in parallel
✨ **CLI-Based Automation**: Operate production with Cron and CI/CD
✨ **Scalable**: Infinite expansion through scripts, Docker, and monitoring

Now you can develop AI agents locally and deploy them directly to production with CLI commands, all while operating them efficiently. Start your AI automation journey with CrewX! 🚀

---

**Next Steps:**

- [CrewX GitHub Repository](https://github.com/sowonlabs/crewx)
- [API Provider Guide](https://github.com/sowonlabs/crewx/blob/main/docs/api-provider-guide.md)
