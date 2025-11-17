# API Provider Configuration

:::info New in 0.6.0
API Provider support enables direct integration with AI provider APIs, offering enhanced tool calling capabilities and more flexible deployment options.
:::

## Overview

CrewX supports two types of AI providers:

1. **CLI Providers** (`cli/*`) - Built-in command-line tools (Claude Code, Gemini CLI, Copilot CLI)
2. **API Providers** (`api/*`) - Direct API integration with AI services (New in 0.6.0)

This guide covers **API Providers** which connect directly to AI provider APIs.

## Supported API Providers

### Currently Available

| Provider | Namespace | Description | Tool Calling |
|----------|-----------|-------------|--------------|
| **OpenAI** | `api/openai` | GPT-4, GPT-3.5, and other OpenAI models | ✅ Supported |
| **OpenRouter** | `api/openai` | Access to multiple models via OpenRouter | ✅ Supported |
| **Anthropic** | `api/anthropic` | Claude 3.5 Sonnet, Opus, Haiku | ✅ Supported |
| **Ollama** | `api/ollama` | Local LLM runtime (Llama, Mistral, etc.) | ✅ Supported |

### Coming Soon

| Provider | Namespace | Status |
|----------|-----------|--------|
| **Google AI** | `api/google` | 🚧 Planned |
| **AWS Bedrock** | `api/bedrock` | 🚧 Planned |
| **LiteLLM** | `api/litellm` | 🚧 Planned |

## API Providers vs CLI Providers

### Key Differences

| Feature | API Providers | CLI Providers |
|---------|---------------|---------------|
| **Integration** | Direct API calls | External CLI tools |
| **Tool Calling** | Native function calling | CLI tool execution |
| **Setup** | API key only | CLI installation + auth |
| **Performance** | Fast, direct connection | Subprocess overhead |
| **Offline** | Requires internet (except Ollama) | Depends on provider |
| **Cost** | Your API usage | Your subscription |

### When to Use API Providers

**Use API Providers when:**
- You want native tool calling with AI models
- You need fine-grained control over model parameters
- You prefer lightweight deployment without CLI dependencies
- You want to use local models (Ollama)
- You need faster response times

**Use CLI Providers when:**
- You need advanced IDE features (Claude Code, Copilot)
- You prefer managed authentication flows
- You want rich terminal interactions
- You already have CLI tools configured

## Configuration

### Basic Configuration

Create a `crewx.yaml` file with API provider agents:

```yaml
agents:
  - id: "gpt_assistant"
    name: "GPT-4 Assistant"
    provider: "api/openai"
    model: "gpt-4o"
    temperature: 0.7
    maxTokens: 2000
    inline:
      prompt: |
        You are a helpful AI assistant powered by GPT-4.
        Provide clear, concise, and accurate responses.
```

### Provider-Specific Configuration

#### OpenAI / OpenRouter

```yaml
agents:
  - id: "gpt_assistant"
    provider: "api/openai"
    model: "gpt-4o"              # GPT-4, GPT-3.5, etc.
    temperature: 0.7
    maxTokens: 2000
    inline:
      prompt: |
        You are a GPT-4 assistant.
```

**Environment Variables:**
```bash
export OPENAI_API_KEY=sk-...
```

**For OpenRouter:**
```bash
export OPENAI_API_KEY=sk-or-v1-...  # OpenRouter API key
export OPENAI_BASE_URL=https://openrouter.ai/api/v1
```

#### Anthropic Claude

```yaml
agents:
  - id: "claude_assistant"
    provider: "api/anthropic"
    model: "claude-3-5-sonnet-20241022"
    temperature: 0.7
    maxTokens: 4000
    inline:
      prompt: |
        You are Claude, an AI assistant created by Anthropic.
        You excel at thoughtful analysis and clear communication.
```

**Environment Variables:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

**Available Models:**
- `claude-3-5-sonnet-20241022` - Most capable, balanced
- `claude-3-opus-20240229` - Highest intelligence
- `claude-3-haiku-20240307` - Fastest, most affordable

#### Ollama (Local Models)

```yaml
agents:
  - id: "local_llama"
    provider: "api/ollama"
    url: "http://localhost:11434/v1"
    model: "llama3.2"
    temperature: 0.8
    inline:
      prompt: |
        You are a locally-running AI assistant.
        No external API calls are made.
```

**Prerequisites:**
1. Install Ollama: https://ollama.ai
2. Pull a model: `ollama pull llama3.2`
3. Start Ollama server (usually auto-starts)

**Available Models:**
- `llama3.2` - Meta's Llama 3.2
- `mistral` - Mistral 7B
- `codellama` - Code-specialized Llama
- See all: `ollama list`

### Advanced Configuration

#### Using Environment Variables

```yaml
agents:
  - id: "dynamic_assistant"
    provider: "api/{{env.AI_PROVIDER}}"
    model: "{{env.MODEL_NAME}}"
    temperature: 0.7
    inline:
      prompt: |
        You are a helpful assistant.
```

```bash
export AI_PROVIDER=openai
export MODEL_NAME=gpt-4o
```

#### Inline Configuration Precedence

```yaml
agents:
  - id: "custom_assistant"
    provider: "api/openai"         # Root-level provider
    model: "gpt-3.5-turbo"         # Root-level model
    inline:
      provider: "api/anthropic"    # Inline overrides root
      model: "claude-3-5-sonnet-20241022"
      prompt: |
        Inline configuration takes precedence.
```

**Precedence Order:** `inline` > root-level fields

## Tool Calling

API Providers support native function calling, enabling agents to use tools directly.

### Built-in Tools

CrewX provides 6 built-in tools for API providers:

| Tool | Description | Modes |
|------|-------------|-------|
| `read_file` | Read file contents | Query, Execute |
| `write_file` | Write file contents | Execute only |
| `replace` | Replace text in files | Execute only |
| `grep` | Search patterns in files | Query, Execute |
| `ls` | List directory contents | Query, Execute |
| `run_shell_command` | Execute shell commands | Execute only |

### Enabling Tools

```yaml
agents:
  - id: "research_agent"
    provider: "api/openai"
    model: "gpt-4o"
    tools: [read_file, grep, ls]  # Enable specific tools
    inline:
      prompt: |
        You are a research agent with file reading capabilities.
        Use the provided tools to analyze codebases.
```

### Query Mode vs Execute Mode

**Query Mode** (Read-Only):
- Tools: `read_file`, `grep`, `ls`
- Safe for analysis and search
- No file modifications

```bash
crewx query "@research_agent analyze this codebase"
```

**Execute Mode** (File Operations):
- Tools: All 6 tools including `write_file`, `replace`, `run_shell_command`
- Can create, modify, delete files
- Can execute shell commands

```bash
crewx execute "@research_agent refactor this module"
```

### Tool Calling Example

```yaml
vars:
  company_name: MyCompany

agents:
  - id: "code_assistant"
    provider: "api/openai"
    model: "gpt-4o"
    temperature: 0.7
    tools: [read_file, write_file, replace, grep]
    inline:
      prompt: |
        You are a code assistant for {{vars.company_name}}.

        Available tools:
        - read_file: Read source files
        - write_file: Create new files
        - replace: Refactor code
        - grep: Search codebase

        Use these tools to help with development tasks.
```

**Usage:**
```bash
crewx execute "@code_assistant Add error handling to utils/api.ts"
```

The agent can:
1. Use `read_file` to analyze `utils/api.ts`
2. Use `replace` to add try-catch blocks
3. Use `write_file` to create test files

## Complete Examples

### Full-Stack Development Team

```yaml
agents:
  # Frontend specialist
  - id: "frontend_dev"
    name: "React Expert"
    provider: "api/anthropic"
    model: "claude-3-5-sonnet-20241022"
    temperature: 0.7
    tools: [read_file, write_file, replace, grep]
    working_directory: "./src/frontend"
    inline:
      prompt: |
        You are a senior React developer.

        Expertise:
        - React 18+ with TypeScript
        - Component design patterns
        - State management (Redux, Zustand)
        - Performance optimization

        Use tools to read, modify, and create React components.

  # Backend specialist
  - id: "backend_dev"
    name: "Node.js Expert"
    provider: "api/openai"
    model: "gpt-4o"
    temperature: 0.7
    tools: [read_file, write_file, grep, ls]
    working_directory: "./src/backend"
    inline:
      prompt: |
        You are a backend engineering expert.

        Expertise:
        - RESTful API design
        - Database optimization
        - Authentication & authorization
        - Microservices architecture

        Use tools to analyze and implement backend services.

  # Local code reviewer
  - id: "code_reviewer"
    name: "Code Reviewer"
    provider: "api/ollama"
    url: "http://localhost:11434/v1"
    model: "codellama"
    temperature: 0.3
    tools: [read_file, grep, ls]
    inline:
      prompt: |
        You are a code review specialist.

        Focus on:
        - Code quality and best practices
        - Security vulnerabilities
        - Performance issues
        - Documentation completeness

        Use tools to analyze code and provide feedback.
```

**Usage:**
```bash
# Frontend development
crewx execute "@frontend_dev Create a new user profile component"

# Backend API
crewx execute "@backend_dev Add authentication middleware"

# Code review (local)
crewx query "@code_reviewer Review the authentication module"
```

## Environment Variables Reference

### OpenAI / OpenRouter

```bash
# Required
export OPENAI_API_KEY=sk-...

# Optional (for custom endpoints)
export OPENAI_BASE_URL=https://api.openai.com/v1
export OPENAI_ORG_ID=org-...
```

### Anthropic

```bash
# Required
export ANTHROPIC_API_KEY=sk-ant-...

# Optional
export ANTHROPIC_BASE_URL=https://api.anthropic.com
```

### Ollama

```bash
# Optional (defaults to http://localhost:11434/v1)
export OLLAMA_BASE_URL=http://localhost:11434/v1
```

### Google AI (Coming Soon)

```bash
export GOOGLE_API_KEY=...
export GOOGLE_PROJECT_ID=...
```

### AWS Bedrock (Coming Soon)

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
```

## Validation

Check your API provider configuration:

```bash
crewx doctor
```

This validates:
- ✅ API provider credentials
- ✅ Model availability
- ✅ Tool configuration
- ✅ Environment variables
- ✅ Network connectivity (for API providers)

## Best Practices

### 1. Choose the Right Provider

**For Production:**
- Use **Anthropic** for complex reasoning and analysis
- Use **OpenAI** for general-purpose tasks
- Use **OpenRouter** for cost optimization and model diversity

**For Development:**
- Use **Ollama** for fast local iteration
- Use **OpenAI** for testing with GPT models

### 2. Configure Tools Appropriately

**Query Mode (Safe):**
```yaml
# Read-only tools for analysis
tools: [read_file, grep, ls]
```

**Execute Mode (Careful):**
```yaml
# All tools for automation
tools: [read_file, write_file, replace, grep, ls, run_shell_command]
```

### 3. Set Temperature Wisely

- **0.0-0.3**: Deterministic, consistent (code generation, refactoring)
- **0.5-0.7**: Balanced (general development tasks)
- **0.8-1.0**: Creative (brainstorming, documentation)

### 4. Use Working Directories

Limit agent scope to relevant directories:
```yaml
working_directory: "./src/specific-module"
```

### 5. Optimize Token Usage

```yaml
maxTokens: 2000  # For short responses
maxTokens: 4000  # For detailed analysis
maxTokens: 8000  # For complex refactoring
```

### 6. Secure API Keys

**Never commit API keys to version control.**

Use environment variables or `.env` files:
```bash
# .env (add to .gitignore)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Troubleshooting

### API Provider Not Working

```bash
# Check provider status
crewx doctor

# Verify API key
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# Test connectivity
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### Tool Calling Failures

**Issue:** Agent doesn't use tools

**Solution:**
1. Verify tools are enabled in configuration
2. Ensure model supports function calling (GPT-4, Claude 3+)
3. Check mode (query vs execute)

**Issue:** Permission errors

**Solution:**
- Use `execute` mode for write operations
- Check working directory permissions
- Verify file paths are correct

### Ollama Connection Issues

```bash
# Check if Ollama is running
ollama list

# Check server URL
curl http://localhost:11434/api/tags

# Verify model is pulled
ollama pull llama3.2
```

## Migration from CLI Providers

### Before (CLI Provider)

```yaml
agents:
  - id: "claude_dev"
    provider: "cli/claude"
    inline:
      prompt: "You are a developer assistant."
```

### After (API Provider)

```yaml
agents:
  - id: "claude_dev"
    provider: "api/anthropic"
    model: "claude-3-5-sonnet-20241022"
    tools: [read_file, write_file, grep, ls]
    inline:
      prompt: "You are a developer assistant."
```

**Benefits:**
- ✅ No CLI installation required
- ✅ Native tool calling
- ✅ Faster startup time
- ✅ More configuration options

## Next Steps

- [Agent Configuration Guide](./agents.md) - Learn about agent configuration
- [Template System](../advanced/templates.md) - Dynamic prompt templates
- [Layout System](../advanced/layouts.md) - Reusable prompt layouts
