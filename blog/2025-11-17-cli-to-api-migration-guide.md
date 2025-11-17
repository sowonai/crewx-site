---
slug: cli-to-api-migration-guide
title: From Local Development to Production Deployment with CrewX - A Journey from CLI to API Provider
authors: [doha]
tags: [crewx, tutorial, ai]
---

How can you integrate an AI agent developed locally into a production web server? CrewX provides a clear path to migrate from the CLI Provider to the API Provider. In this guide, we'll follow a real development scenario and learn how to migrate step by step.

<!--truncate-->

## Scenario: From Local Development to Production

As a developer, you'll follow a journey like this:

1. **Local Development**: Rapidly prototype AI agents using the CLI Provider
2. **Testing and Validation**: Verify agent behavior in the local environment
3. **Production Ready**: Switch to the API Provider for integration into web applications
4. **Team Sharing** (Optional): Share with your entire team via Slack Bot

Let's explore this process step by step.

---

## Step 1: Local Development (CLI Provider)

### Why Start with the CLI Provider?

The CLI Provider is the fastest way to get started in a local development environment:

- **Immediate Availability**: Just install `claude`, `gemini`, or `copilot` CLI
- **File System Access**: Direct access to local project files
- **Fast Iteration**: Test immediately after code changes
- **Permission Model**: Agents request confirmation before modifying files

### Setting Up the Local Development Environment

**Initialize the project:**

```bash
# Install CrewX
npm install -g crewx

# Create project folder
mkdir my-ai-project
cd my-ai-project

# Initialize CrewX
crewx init
```

**Create crewx.yaml:**

```yaml
agents:
  - id: "dev_assistant"
    name: "Development Assistant"
    provider: "cli/claude"  # Use CLI Provider
    working_directory: "./src"
    inline:
      model: "sonnet"
      prompt: |
        You are a development assistant.

        Your role:
        - Code review and analysis
        - Bug fix suggestions
        - Refactoring guidance
        - Test code writing

        Always prioritize code quality and best practices.
```

**Test the agent locally:**

```bash
# Analyze code (query mode)
crewx query "@dev_assistant Analyze the src/utils.ts file"

# Fix bugs (execute mode)
crewx execute "@dev_assistant Fix the API call error"
```

### Advantages of the CLI Provider

✅ **Fast Development Cycle**
```bash
# Test immediately after code changes
vim src/api.ts
crewx query "@dev_assistant Review the code I just modified"
```

✅ **File System Integration**
- Automatic support for reading/writing project files
- Git operations automation
- Direct execution of local tools (npm, git, etc.)

✅ **Security and Permission Control**
```bash
# Confirmation request when modifying files in execute mode
crewx execute "@dev_assistant Refactor index.ts"
# → Agent requests approval before modifying the file
```

---

## Step 2: Production Ready (Migrate to API Provider)

### Why Migrate to the API Provider?

To deploy a validated agent from local development to a production environment, you need the API Provider:

- **Server Deployment**: Integrate into web applications
- **HTTP-based**: Call agents via RESTful API
- **Tool Calling**: Integrate custom tools via function invocation
- **MCP Support**: Connect to external services (GitHub, Slack, etc.)

### Update crewx.yaml

**CLI Provider Configuration (Existing):**

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
    provider: "api/anthropic"  # Switch to API Provider
    model: "claude-sonnet-4-5-20250929"
    temperature: 0.7
    options:
      query:
        tools: ["read_file", "grep", "find"]  # Read-only tools
      execute:
        tools: ["read_file", "write_file", "run_shell"]  # Add write tools
    inline:
      prompt: |
        You are a production AI assistant.

        Your role:
        - Code analysis and review
        - Automated bug fixing
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
| **Performance** | Slow (process creation) | Fast (HTTP) |
| **Streaming** | stdio | HTTP SSE |
| **MCP Support** | Limited | Full support |
| **Multiple Models** | Provider array | LiteLLM Gateway |
| **Cost** | Provider cost only | Provider + gateway |

---

## Step 3: Web Server Integration (Using SDK)

### TypeScript Web Server Example

Now let's integrate the API Provider into a web application using CrewX.

**Project setup:**

```bash
# Create project
mkdir ai-web-app
cd ai-web-app
npm init -y

# Install dependencies
npm install express @sowonai/crewx-sdk
npm install -D typescript @types/node @types/express
```

**TypeScript configuration (tsconfig.json):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

**Web server implementation (src/server.ts):**

```typescript
import express from 'express';
import { CrewX } from '@sowonai/crewx-sdk';

// Initialize CrewX
const crewx = new CrewX({
  configPath: './crewx.yaml',
  // Inject custom tools (optional)
  tools: [
    {
      name: 'web_search',
      description: 'Performs web search',
      parameters: z.object({
        query: z.string().describe('Search query'),
      }),
      execute: async ({ query }, context) => {
        // Call actual web search API
        const results = await searchAPI(query);
        return { results };
      },
    },
  ],
});

const app = express();
app.use(express.json());

// AI Agent endpoint
app.post('/api/agent/query', async (req, res) => {
  try {
    const { agentId, input } = req.body;

    // Call agent (query mode)
    const response = await crewx.runAgent(agentId, {
      input,
      mode: 'query',
    });

    res.json({
      success: true,
      content: response.content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Agent execution endpoint (file modification possible)
app.post('/api/agent/execute', async (req, res) => {
  try {
    const { agentId, input } = req.body;

    // Call agent (execute mode)
    const response = await crewx.runAgent(agentId, {
      input,
      mode: 'execute',
    });

    res.json({
      success: true,
      content: response.content,
      toolCalls: response.toolCalls,  // List of executed tools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AI Web Server running on port ${PORT}`);
});
```

**Frontend integration example:**

```typescript
// Client-side code
async function askAI(question: string) {
  const response = await fetch('/api/agent/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: 'prod_assistant',
      input: question,
    }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('AI response:', data.content);
  } else {
    console.error('Error:', data.error);
  }
}

// Example usage
askAI('Analyze the current system status');
```

### Adding Custom Tools

With the API Provider, you can add custom tools via function injection:

**Define tool (tools/database.tool.ts):**

```typescript
import { z } from 'zod';
import { FrameworkToolDefinition } from '@sowonai/crewx-sdk';

export const queryDatabaseTool: FrameworkToolDefinition = {
  name: 'query_database',
  description: 'Execute SQL queries (SELECT only)',

  parameters: z.object({
    query: z.string().describe('SQL SELECT query'),
  }),

  execute: async ({ query }, context) => {
    // Security: Allow SELECT only
    if (!query.trim().toLowerCase().startsWith('select')) {
      throw new Error('Only SELECT queries are allowed');
    }

    // Database connection
    const dbUrl = context.env.DATABASE_URL;
    const results = await executeQuery(dbUrl, query);

    return {
      rows: results,
      count: results.length,
    };
  },
};
```

**Inject tool:**

```typescript
import { queryDatabaseTool } from './tools/database.tool';

const crewx = new CrewX({
  configPath: './crewx.yaml',
  tools: [queryDatabaseTool],  // Inject tool
});
```

**Enable in crewx.yaml:**

```yaml
agents:
  - id: "data_analyst"
    provider: "api/anthropic"
    model: "claude-sonnet-4-5-20250929"
    tools: ["query_database"]  # Enable tool
    inline:
      prompt: |
        You are a data analyst.
        Use the query_database tool to query and analyze data.
```

---

## Step 4: (Optional) Share with Team via Slack

You can share your production agent with your entire team as a Slack Bot.

### Slack Bot Configuration

**Set environment variables:**

```bash
# .env.slack file
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx
SLACK_APP_TOKEN=xapp-xxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxx

# CrewX configuration
CREWX_CONFIG=./crewx.yaml
```

**Run Slack Bot:**

```bash
# Read-only mode (query only)
crewx slack

# Execute mode (execute possible)
crewx slack --mode execute
```

### Using in Slack

**Call from channel:**

```
@CrewX Analyze the current system status
```

**Call via DM:**

```
Find errors in the server logs
```

**Specify agent:**

```
@CrewX @prod_assistant Optimize the database query
```

### Slack Bot Benefits

✅ **Team Collaboration**: All team members can leverage AI agents
✅ **Context Retention**: Thread-based conversation preserves context
✅ **Transparency**: Share AI insights across the team
✅ **Convenience**: Use directly in Slack, no separate app needed

---

## Real-World Use Cases

### Scenario 1: Automated Code Review

**Local Development (CLI):**

```bash
# Code review locally
crewx query "@dev_assistant Review the changes in PR #123"
```

**Production (API + Slack):**

```typescript
// GitHub Webhook → API → Slack notification
app.post('/webhook/github/pr', async (req, res) => {
  const { pull_request } = req.body;

  // AI agent code review
  const review = await crewx.runAgent('prod_assistant', {
    input: `Please review PR #${pull_request.number}`,
    mode: 'query',
  });

  // Send results to Slack
  await slack.postMessage({
    channel: '#code-review',
    text: `🤖 AI Code Review for PR #${pull_request.number}\n\n${review.content}`,
  });

  res.status(200).send('OK');
});
```

### Scenario 2: Automated Bug Fixing

**Local Development (CLI):**

```bash
# Fix bugs locally
crewx execute "@dev_assistant Fix the null reference error in src/api.ts"
```

**Production (API):**

```typescript
// Request bug fix from web dashboard
app.post('/api/fix-bug', async (req, res) => {
  const { file, description } = req.body;

  const result = await crewx.runAgent('prod_assistant', {
    input: `Fix the bug in ${file}: ${description}`,
    mode: 'execute',
  });

  res.json({
    success: true,
    changes: result.toolCalls.filter(t => t.name === 'write_file'),
    message: result.content,
  });
});
```

---

## Migration Checklist

### ✅ Phase 1: Local Development

- [ ] Install CrewX (`npm install -g crewx`)
- [ ] Install Claude/Gemini/Copilot CLI
- [ ] Create `crewx.yaml` (using CLI Provider)
- [ ] Test agent locally
- [ ] Complete feature validation

### ✅ Phase 2: Switch to API Provider

- [ ] Issue API Key (Anthropic/OpenAI/Google)
- [ ] Create and configure `.env` file with API Key
- [ ] Update `crewx.yaml` (switch to API Provider)
- [ ] Configure tools and MCP
- [ ] Test API Provider locally

### ✅ Phase 3: Web Server Integration

- [ ] Install `@sowonai/crewx-sdk`
- [ ] Implement TypeScript/Node.js web server
- [ ] Create API endpoints (`/api/agent/query`, `/api/agent/execute`)
- [ ] Develop and inject custom tools
- [ ] Integrate frontend
- [ ] Deploy to production

### ✅ Phase 4: Slack Bot (Optional)

- [ ] Create Slack App (https://api.slack.com/apps)
- [ ] Issue Bot Token and App Token
- [ ] Configure `.env.slack` file
- [ ] Run Bot with `crewx slack` command
- [ ] Share usage instructions with team

---

## Conclusion: "Wow! Deploying to production is this easy!"

CrewX provides a clear migration path:

1. **Local Development**: Rapidly prototype with CLI Provider
2. **Production Switch**: Migrate to API Provider
3. **Web Integration**: Embed in web applications using SDK
4. **Team Sharing**: Expand across the organization with Slack Bot

**Key Insights:**

✨ **Same crewx.yaml**: Use the same configuration file for both CLI and API Providers
✨ **Gradual Migration**: Transition gradually by running local and production in parallel
✨ **Flexible Deployment**: Leverage the same agent across CLI, API, and Slack
✨ **Extensible**: Scale infinitely with custom tools and MCP servers

Now you can deploy AI agents developed locally directly to your production services. Build your AI team with CrewX! 🚀

---

**Next Steps:**

- [CrewX GitHub Repository](https://github.com/sowonlabs/crewx)
- [API Provider Guide](https://github.com/sowonlabs/crewx/blob/main/docs/api-provider-guide.md)
- [Slack Integration Guide](https://github.com/sowonlabs/crewx/blob/main/SLACK_INSTALL.md)
