# Agent Configuration Guide

CrewX에서 커스텀 전문가 에이전트를 구성하기 위한 완벽한 가이드입니다.

## Quick Start

프로젝트에 `crewx.yaml` 파일을 생성합니다:

```yaml
agents:
  - id: "frontend_dev"
    name: "React Expert"
    working_directory: "./src"
    inline:
      type: "agent"
      provider: "cli/claude"  # Built-in CLI provider
      prompt: |
        You are a senior React developer.
        Provide detailed examples and best practices.
```

> **참고:** `agents.yaml`는 여전히 하위 호환성을 위해 지원되지만 `crewx.yaml`이 권장하는 파일명입니다. 두 파일이 모두 존재하면 `crewx.yaml`이 우선합니다.

## Agent Configuration Structure

```yaml
agents:
  - id: "agent_id"                       # 필수: 고유 식별자
    name: "Human Readable Name"          # 선택: 표시명
    working_directory: "/path/to/dir"    # 선택: 작업 디렉토리
    options:                             # 선택: CLI 옵션
      query:                             # Query 모드 옵션
        - "--add-dir=."
      execute:                           # Execute 모드 옵션
        - "--add-dir=."
        - "--allowedTools=Edit,Bash"
    inline:                              # 필수: Agent 정의
      type: "agent"                      # 필수: 타입
      provider: "cli/claude"             # 필수: AI provider (namespace/id 형식)
      model: "opus"                      # 선택: 특정 모델
      prompt: |                          # 필수: 지시사항
        Your agent's system prompt
```

## Provider Configuration

### Provider Namespace Format

CrewX는 namespace 기반 provider 이름 지정 시스템을 사용합니다:

**형식:** `{namespace}/{id}`

**사용 가능한 Namespaces:**
- `cli/*` - Built-in CLI providers (claude, gemini, copilot)
- `plugin/*` - User-defined plugin providers
- `api/*` - API-based providers (future: openai, anthropic, ollama, litellm)

### Single Provider (Fixed)

단일 문자열을 사용하여 provider를 고정합니다:

```yaml
agents:
  - id: "claude_only"
    provider: "cli/claude"  # Always uses Claude CLI, no fallback

  - id: "custom_agent"
    provider: "plugin/my-tool"  # Uses custom plugin provider
```

### Multiple Providers (Fallback)

자동 fallback을 위해 배열을 사용합니다:

```yaml
agents:
  - id: "flexible_agent"
    provider: ["cli/claude", "cli/gemini", "cli/copilot"]  # Tries in order
```

**동작:**
- 사용 가능한 provider를 순서대로 시도합니다
- 모델이 지정되면 fallback 없이 첫 번째 provider를 사용합니다

## Mode-Specific Options

### Query Mode vs Execute Mode

**Query Mode** (읽기 전용):
```yaml
options:
  query:
    - "--add-dir=."
    - "--verbose"
    # No file modification tools
```

**Execute Mode** (파일 작업):
```yaml
options:
  execute:
    - "--add-dir=."
    - "--allowedTools=Edit,Bash"
    # Can create/modify files
```

## Model Selection

구성이나 런타임에서 AI 모델을 지정합니다:

### In Configuration
```yaml
agents:
  - id: "opus_agent"
    provider: "cli/claude"
    inline:
      model: "opus"  # Fixed model
      prompt: "You are an expert."
```

### At Runtime
```bash
# Override model with @agent:model syntax
crewx query "@claude:haiku quick analysis"
crewx execute "@gemini:gemini-2.5-flash rapid prototyping"
```

**사용 가능한 모델:**

**Claude:**
- `opus` - Most capable, detailed
- `sonnet` - Balanced performance
- `haiku` - Fast, concise
- `claude-sonnet-4-5`
- `claude-sonnet-4-5-20250929`

**Gemini:**
- `gemini-2.5-pro` - High quality (default)
- `gemini-2.5-flash` - Fast responses

**Copilot:**
- `gpt-5`
- `claude-sonnet-4`
- `claude-sonnet-4.5`

## Working Directory

각 에이전트의 작업 디렉토리를 설정합니다:

```yaml
agents:
  - id: "frontend_dev"
    working_directory: "./src/frontend"

  - id: "backend_dev"
    working_directory: "./src/backend"

  - id: "full_stack"
    working_directory: "."  # Project root
```

## Complete Example

```yaml
agents:
  # Frontend specialist
  - id: "frontend_developer"
    name: "React Expert"
    provider: "cli/claude"
    working_directory: "./src/frontend"
    options:
      query:
        - "--add-dir=."
        - "--verbose"
      execute:
        - "--add-dir=."
        - "--allowedTools=Edit,Bash"
    inline:
      type: "agent"
      model: "sonnet"
      prompt: |
        You are a senior frontend developer specializing in React.

        **Expertise:**
        - React 18+ with TypeScript
        - State management (Redux, Zustand)
        - Component design patterns
        - Performance optimization

        **Guidelines:**
        - Always use TypeScript strict mode
        - Prefer functional components with hooks
        - Write comprehensive PropTypes/TypeScript types
        - Follow accessibility (a11y) best practices

  # Backend specialist with fallback
  - id: "backend_developer"
    name: "Backend Expert"
    provider: ["cli/gemini", "cli/claude", "cli/copilot"]
    working_directory: "./src/backend"
    options:
      execute:
        - "--add-dir=."
        - "--allowedTools=Edit,Bash"
    inline:
      type: "agent"
      prompt: |
        You are a backend engineering expert.

        **Expertise:**
        - RESTful API design
        - Database optimization
        - Authentication & authorization
        - Microservices architecture

        **Focus:**
        - Security best practices
        - Scalable architecture
        - Error handling and logging
        - API documentation

  # DevOps specialist
  - id: "devops_engineer"
    name: "DevOps Expert"
    provider: "cli/copilot"
    working_directory: "."
    options:
      query:
        - "--allow-tool=files"
      execute:
        - "--allow-tool=terminal"
        - "--allow-tool=files"
    inline:
      type: "agent"
      prompt: |
        You are a DevOps engineer expert in infrastructure and deployment.

        **Expertise:**
        - Docker and Kubernetes
        - CI/CD pipelines
        - Infrastructure as Code
        - Monitoring and logging

        **Focus:**
        - Deployment automation
        - Container orchestration
        - Security and compliance
        - Performance monitoring
```

## CLI Options Reference

### Common Options

**Claude Code:**
- `--add-dir=PATH` - Add directory to context
- `--allowedTools=TOOLS` - Allowed tools (e.g., Edit,Bash)
- `--permission-mode=MODE` - Permission mode (acceptEdits, etc.)
- `--verbose` - Verbose output

**Gemini CLI:**
- `--include-directories=PATH` - Include directories
- `--yolo` - Auto-execute without confirmation
- `--allowed-mcp-server-names=NAME` - Allow MCP server

**Copilot CLI:**
- `--allow-tool=TOOL` - Allow specific tools (files, terminal)
- `--add-dir=PATH` - Add directory

### Query Mode vs Execute Mode

**Query Mode** (읽기 전용):
- 분석 및 검토에 안전합니다
- 파일 수정이 없습니다
- 최소 권한 사용

**Execute Mode** (파일 작업):
- 파일 생성/수정/삭제 가능
- 적절한 도구 권한 필요
- 주의하여 사용하세요

## Creating Agents via CLI

SowonAI CrewX 어시스턴트를 사용하여 에이전트를 생성합니다:

```bash
# Create a Python expert
crewx execute "@crewx Create a Python expert agent. ID 'python_expert', use claude sonnet. Specializes in code review, optimization, and debugging."

# Create a React specialist
crewx execute "@crewx Create a React specialist agent with TypeScript expertise"

# Create a DevOps agent
crewx execute "@crewx Create a DevOps agent for Docker and Kubernetes"

# Create a security analyst
crewx execute "@crewx Create a security analyst agent"
```

SowonAI CrewX 어시스턴트는 귀하의 요청을 이해하고 완전한 에이전트 구성을 생성합니다.

## Best Practices

### 1. Specialize Your Agents
특정 도메인을 위한 focused 에이전트를 생성합니다:
- Frontend, backend, DevOps
- Testing, security, documentation
- Language-specific (Python, TypeScript, Go)

### 2. Use Appropriate Models
- **Haiku/Flash**: 빠른 답변, 간단한 작업
- **Sonnet/Pro**: 균형잡힌, 대부분의 사용 사례
- **Opus**: 복잡한 분석, 상세 작업

### 3. Set Working Directories
에이전트 scope를 관련 디렉토리로 제한합니다:
```yaml
working_directory: "./src/specific-module"
```

### 4. Configure Mode-Specific Options
Query와 execute를 위한 다른 옵션:
```yaml
options:
  query:    # Read-only analysis
    - "--add-dir=."
  execute:  # File modifications
    - "--add-dir=."
    - "--allowedTools=Edit"
```

### 5. Use Provider Fallback
여러 provider로 가용성을 보장합니다:
```yaml
provider: ["cli/claude", "cli/gemini", "cli/copilot"]
```

### 6. Write Clear System Prompts
다음을 포함합니다:
- 역할 및 전문성
- 구체적인 지침
- 예상 출력 형식
- 제약 사항 및 제한 사항

## Validation

구성을 확인합니다:

```bash
crewx doctor
```

이는 다음을 검증합니다:
- YAML syntax
- 필수 필드
- Provider 가용성
- 작업 디렉토리 존재
- 옵션 호환성

## Advanced Configuration

문서 및 템플릿과 같은 고급 기능은 다음을 참조하세요:
- [Template System Guide](../advanced/templates.md)
- [Layout System Guide](../advanced/layouts.md)
