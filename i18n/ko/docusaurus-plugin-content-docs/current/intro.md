---
sidebar_position: 1
---

# 소개

> 기존 구독 중인 AI를 Slack/IDE(MCP)에서 팀으로 운영하세요(BYOA)

Claude, Gemini, Codex, Copilot을 협업 개발팀으로 변환하세요. 추가 비용 없이—기존 AI 구독이 함께 작동합니다.

## CrewX를 선택해야 하는 이유

### **Slack 팀 협업** - Slack에서 AI 팀 운영
AI 에이전트를 팀 워크스페이스에 직접 가져오세요:
- **팀 전체 AI 접근** - Slack 채널에서 모든 사람이 AI 전문성의 이점을 누립니다
- **스레드 기반 컨텍스트** - 대화 기록이 자동으로 유지됩니다
- **다중 에이전트 협업** - `@claude`, `@gemini`, `@copilot`이 실시간으로 함께 작동합니다
- **자연스러운 통합** - 팀 멤버와 채팅하는 것처럼 작동합니다
- **공유 지식** - 팀이 AI 상호작용에서 학습하며, 격리된 세션이 아닙니다

### **원격 에이전트** - 분산 AI 팀 (실험 버전)
프로젝트와 서버 전반에서 CrewX 인스턴스를 연결하고 조율하세요:
- **프로젝트 간 전문가** - 프론트엔드 개발자가 백엔드 팀의 API 전문가 에이전트에 질문합니다
- **팀 협업** - 각 팀이 자체 에이전트를 구축하면 전체 조직에서 사용할 수 있습니다
- **전문 지식 공유** - 선임의 코드 리뷰 에이전트, 보안팀의 감시 에이전트를 언제든 활용합니다
- **분리되지만 연결** - 각 프로젝트는 자체 컨텍스트를 유지하며, 필요할 때 협업합니다

```yaml
# 다른 프로젝트의 전문화된 에이전트 접근
providers:
  - id: backend_project
    type: remote
    location: "file:///workspace/backend-api/crewx.yaml"
    external_agent_id: "api_expert"

# 프로젝트에서 전문 지식 사용
crewx query "@api_expert design user authentication API"
crewx execute "@api_expert implement OAuth flow"
```

### **플러그인 제공자 시스템** - 범용 AI 통합
모든 CLI 도구 또는 AI 서비스를 에이전트로 변환하세요:
- **자신의 AI 가져오기** - OpenAI, Anthropic, Ollama, LiteLLM, 또는 모든 AI 서비스
- **자신의 도구 가져오기** - jq, curl, ffmpeg, 또는 모든 CLI 도구가 에이전트가 됩니다
- **자신의 프레임워크 가져오기** - LangChain, CrewAI, AutoGPT를 원활하게 통합합니다
- **코딩 불필요** - 간단한 YAML 설정
- **혼합 및 일치** - 한 워크플로우에서 다양한 AI 서비스를 결합합니다

```yaml
# 예시: 플러그인으로 모든 AI 서비스 추가
providers:
  - id: ollama
    type: plugin
    cli_command: ollama
    default_model: "llama3"
    query_args: ["run", "{model}"]
    prompt_in_args: false

agents:
  - id: "local_llama"
    provider: "plugin/ollama"
```

### **프로젝트 스캐폴딩** - 템플릿 시스템
사전 구성된 에이전트와 문서가 포함된 프로젝트 템플릿을 다운로드하고 설치하세요:
- **즉시 설정** - 바로 사용 가능한 에이전트 설정 설치
- **팀 공유** - 프로젝트 전반에 에이전트 설정 패키징 및 배포
- **템플릿 관리** - CLI를 통한 템플릿 목록 조회, 설치 및 관리
- **빠른 시작** - 검증된 에이전트 설정으로 빠르게 시작

```bash
# 사용 가능한 템플릿 목록
crewx template list

# 템플릿 설치
crewx template init wbs-automation

# 설치된 에이전트 확인
crewx agent ls
```

👉 **[프로젝트 스캐폴딩 가이드 →](./cli/templates.md)** 자세한 사용법은 여기를 참조하세요

### **Claude Skills 호환** - 재사용 가능한 AI 전문성
Claude Code 스킬 형식을 사용하여 전문화된 AI 능력을 공유하고 재사용하세요:
- **100% Claude Code 호환** - 기존 Claude 스킬을 수정 없이 사용
- **에이전트 강화** - 모든 에이전트에 전문 능력 추가
- **점진적 공개** - 스킬은 메타데이터를 먼저 로드하고 필요 시 콘텐츠 로드
- **에이전트 간 공유** - 하나의 스킬, 여러 에이전트
- **간단한 YAML + Markdown** - 생성 및 유지관리가 쉬움

```yaml
# 에이전트에 스킬 활성화
skills:
  paths:
    - ./skills                    # 사용자 정의 스킬 디렉토리
  include:
    - hello                       # 로드할 특정 스킬
    - code-reviewer
    - api-designer

agents:
  - id: "senior_dev"
    provider: "cli/claude"
    skills:
      include:
        - code-reviewer           # 에이전트별 스킬
        - api-designer
    inline:
      prompt: |
        You are a senior developer with specialized skills.
```

👉 **[Skills 시스템 가이드 →](./advanced/skills.md)** 자세한 사용법은 여기를 참조하세요

### 기타 이점
- **추가 비용 없음** - 기존 Claude Pro, Gemini, Codex 또는 GitHub Copilot 구독 사용
- **다중 에이전트 협업** - 다양한 AI 모델이 전문화된 작업에서 작동합니다
- **병렬 실행** - 여러 에이전트가 동시에 작동합니다
- **유연한 통합** - CLI, MCP 서버 또는 Slack 봇

## 빠른 시작

### 🚀 한 번의 명령어 설정 (권장)
```bash
# 대화형 설정 - crewx.yaml을 생성하고 Slack 설정을 돕습니다
npx crewx-quickstart
```

### 📦 수동 설치
```bash
# 설치
npm install -g crewx

# 초기화
crewx init

# 시스템 확인
crewx doctor

# 시도해보기
crewx query "@claude analyze my code"
crewx execute "@claude create a login component"
```

## 세 가지 사용 방법

### Slack 모드 - 팀 협업 (권장)
```bash
# CrewX를 Slack 워크스페이스에 시작 (읽기 전용 쿼리 모드)
crewx slack

# 에이전트가 실행 작업을 수행하도록 허용 (파일 변경, 마이그레이션 등)
crewx slack --mode execute

# 팀은 이제 다음을 수행할 수 있습니다:
# - 채널에서 AI 에이전트를 @언급합니다
# - 스레드에서 컨텍스트 유지
# - AI 인사이트를 전체 팀과 공유합니다
```
👉 **[완전한 Slack 설정 가이드 →](./getting-started/slack-setup.md)**

### CLI 모드 - 직접 터미널 사용
```bash
crewx query "@claude review this code"
crewx execute "@gemini optimize performance"
crewx query "@claude @gemini @copilot compare approaches"
```

### MCP 서버 모드 - IDE 통합
```bash
crewx mcp  # VS Code, Claude Desktop, Cursor
```

## 지원하는 AI 도구

### CLI Providers (로컬)
- **Claude Code** - 고급 추론 및 분석
- **Gemini CLI** - 실시간 웹 접근
- **GitHub Copilot CLI** - 전문화된 코딩 어시스턴트
- **Codex CLI** - 워크스페이스 인식 실행을 통한 오픈 추론

### API Providers (클라우드 & 로컬)
CrewX는 다음을 포함한 통합 HTTP 기반 API 제공자를 지원합니다:
- **Ollama**, **OpenRouter**, **Anthropic**, **OpenAI**
- **LiteLLM**, **Google AI**, **AWS Bedrock** 등도 지원

👉 **[완전한 API Provider 가이드 →](./configuration/api-providers.md)** 자세한 설정 및 예제는 여기를 참조하세요

## 기본 사용법

```bash
# 읽기 전용 분석
crewx query "@claude explain this function"

# 파일 생성/수정
crewx execute "@claude implement user authentication"

# 병렬 작업
crewx execute "@claude create tests" "@gemini write docs"

# 파이프라인 워크플로우
crewx query "@architect design API" | \
crewx execute "@backend implement it"

# 스레드 기반 대화
crewx query "@claude design login" --thread "auth-feature"
crewx execute "@gemini implement it" --thread "auth-feature"

# Codex CLI 에이전트
crewx query "@codex draft a release checklist"
```

내장 CLI 제공자:

- `cli/claude`
- `cli/gemini`
- `cli/copilot`
- `cli/codex`

## 사용자 정의 에이전트 만들기

```bash
# SowonAI CrewX가 에이전트를 생성하도록 합니다
crewx execute "@crewx Create a Python expert agent"
crewx execute "@crewx Create a React specialist with TypeScript"
crewx execute "@crewx Create a DevOps agent for Docker"

# 새 에이전트 테스트
crewx query "@python_expert Review my code"
```

## 에이전트 구성

`crewx.yaml` 생성 (하위 호환성을 위해 `agents.yaml` 사용 가능):

```yaml
agents:
  - id: "frontend_dev"
    name: "React Expert"
    working_directory: "./src"
    inline:
      type: "agent"
      provider: "cli/claude"  # 내장 CLI 제공자
      prompt: |
        You are a senior React developer.
        Provide detailed examples and best practices.
```

> **참고:** `crewx.yaml`이 선호되는 설정 파일 이름입니다. 레거시 `agents.yaml`은 여전히 하위 호환성을 위해 지원됩니다. 두 파일이 모두 있으면 `crewx.yaml`이 우선합니다.

## 레이아웃 시스템

CrewX 레이아웃은 구조와 내용을 분리하는 재사용 가능한 프롬프트 템플릿을 제공합니다.

### 빠른 예시

```yaml
# crewx.yaml
agents:
  - id: full_agent
    inline:
      layout: "crewx/default"  # 전체 에이전트 프로필
      prompt: |
        You are a comprehensive assistant.

  - id: simple_agent
    inline:
      layout: "crewx/minimal"  # 경량 래퍼
      prompt: |
        You are a simple assistant.
```

**기능:**
- 🎨 **재사용 가능한 템플릿** - 에이전트 간 레이아웃 공유
- ⚛️ **Props 스키마** - 사용자 정의 레이아웃을 위한 React PropTypes 스타일 검증
- 🔧 **내장 레이아웃** - `crewx/default`, `crewx/minimal`
- 🛡️ **보안 컨테이너** - 자동 프롬프트 래핑

👉 **[레이아웃 시스템 가이드 →](./advanced/layouts.md)** 자세한 사용법은 여기를 참조하세요

## 원격 에이전트 (실험 버전)

다른 CrewX 인스턴스에 연결하고 프로젝트 또는 서버 간에 작업을 위임하세요.

**빠른 예시:**
```bash
# 원격 CrewX 인스턴스 추가
providers:
  - id: backend_server
    type: remote
    location: "http://api.example.com:3000"
    external_agent_id: "backend_team"

agents:
  - id: "remote_backend"
    provider: "remote/backend_server"

# 다른 에이전트처럼 사용하세요
crewx query "@remote_backend check API status"
```

**사용 사례:**
- **프로젝트 격리** - 다양한 코드베이스를 위한 별도의 구성
- **분산 팀** - 각 팀이 전문화된 에이전트를 가진 자체 CrewX를 실행합니다
- **리소스 공유** - 원격으로 강력한 컴퓨팅 리소스에 접근합니다
- **다중 프로젝트 조율** - 여러 프로젝트 간의 작업을 조율합니다

👉 **[원격 에이전트 가이드 →](./advanced/remote-agents.md)** 자세한 설정 및 구성은 여기를 참조하세요

## 문서

### 사용자 가이드
- [📖 CLI 가이드](./cli/commands.md) - 완전한 CLI 참조
- [🔌 MCP 통합](./integration/mcp.md) - IDE 설정 및 MCP 서버
- [⚙️ 에이전트 구성](./configuration/agents.md) - 사용자 정의 에이전트 및 고급 구성
- [🤖 API Providers](./configuration/api-providers.md) - 직접 API 통합 설정 (OpenAI, Anthropic, Google AI, Groq)
- [🌐 원격 에이전트](./advanced/remote-agents.md) - 원격 CrewX 인스턴스에 연결
- [🎯 Skills 시스템](./advanced/skills.md) - 재사용 가능한 AI 능력 (Claude Code 호환)
- [📚 템플릿 시스템](./advanced/templates.md) - 에이전트를 위한 지식 관리 및 동적 프롬프트
- [📝 템플릿 변수](./advanced/template-variables.md) - 에이전트 구성 및 TemplateContext 사용의 동적 변수
- [🎨 레이아웃 시스템](./advanced/layouts.md) - React PropTypes 스타일 props를 가진 재사용 가능한 프롬프트 템플릿
- [🔧 문제 해결](./troubleshooting/common-issues.md) - 일반적인 문제 및 솔루션
- [💬 Slack 통합](./getting-started/slack-setup.md) - Slack 봇 설정 및 Mention-Only 모드

### 개발자 가이드
- [🔧 개발 워크플로우](./contributing/development.md) - 기여 가이드라인
- [🏗️ SDK API 참조](https://github.com/sowonlabs/crewx/tree/main/packages/sdk) - 사용자 정의 통합 구축
- [⚙️ CLI 개발](https://github.com/sowonlabs/crewx/tree/main/packages/cli) - CLI 아키텍처 및 개발

## 라이선스

- **SDK** (`@sowonai/crewx-sdk`): Apache-2.0 라이선스
- **CLI** (`crewx`): MIT 라이선스

저작권 (c) 2025 SowonLabs

## 기여하기

우리는 기여를 환영합니다! Pull Request를 제출하기 전에 [기여 가이드](./contributing/guide.md)를 읽어주세요.

---

[SowonLabs](https://github.com/sowonlabs)에서 구축됨
