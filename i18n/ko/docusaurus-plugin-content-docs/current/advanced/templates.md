# 템플릿 시스템 가이드

CrewX의 템플릿 시스템 사용법에 대한 완전한 가이드입니다. 문서 관리, Handlebars 헬퍼, 동적 프롬프트를 다룹니다.

## 목차

- [개요](#개요)
- [문서 시스템](#문서-시스템)
- [Handlebars 헬퍼](#handlebars-헬퍼)
- [내장 헬퍼](#내장-헬퍼)
- [템플릿 예시](#템플릿-예시)
- [레이아웃 시스템](#레이아웃-시스템)
- [모범 사례](#모범-사례)

## 개요

CrewX의 템플릿 시스템은 다음을 가능하게 합니다:
- **지식 공유** - 에이전트 간의 지식 공유
- **프로젝트 문서 접근** - 템플릿 변수를 통한 문서 접근
- **동적 프롬프트** - Handlebars를 활용한 동적 프롬프트
- **컨텍스트 보존** - 에이전트 시스템 프롬프트의 컨텍스트 보존
- **코딩 표준 강화** - 코딩 표준 강화

## 문서 시스템

### 3단계 문서 시스템

문서는 명확한 우선순위를 가진 3가지 레벨에서 정의됩니다:

1. **`documents.yaml`** - 글로벌 문서 (프로젝트 전체 공유)
2. **`crewx.yaml` documents:** - 프로젝트 레벨 문서
3. **`agent.inline.documents`** - 에이전트별 문서

**우선순위:** `agent.inline.documents` > `crewx.yaml documents` > `documents.yaml`

### 문서 정의 방법

#### 1. 인라인 마크다운 (간단함)

```yaml
# documents.yaml
documents:
  quick_tips: |
    # Quick Tips
    - Use @agent:model to specify AI model
    - Use q/x shortcuts for query/execute
```

#### 2. 메타데이터를 포함한 객체 형식

```yaml
documents:
  coding_standards:
    content: |
      # Coding Standards
      ## TypeScript
      - Always use strict type checking
    summary: "Project coding standards"
    type: "markdown"
```

#### 3. 파일 경로에서 로드

```yaml
documents:
  readme:
    path: "docs/README.md"
    summary: "Main project documentation"
    type: "markdown"
    lazy: false  # Load immediately

  large_guide:
    path: "docs/large-guide.md"
    summary: "Comprehensive guide"
    lazy: true   # Load on-demand (for large files)
```

### 에이전트에서 문서 사용

프롬프트에서 Handlebars 템플릿 변수를 사용하여 문서를 참조합니다:

```yaml
# crewx.yaml
documents:
  project_guide: |
    # Project Guide
    This is project-specific documentation.

agents:
  - id: "my_agent"
    inline:
      documents:
        agent_doc: |
          # Agent-Specific Doc
          Only this agent can see this.

      prompt: |
        You are a helpful assistant.

        <document name="quick_tips">
        {{{documents.quick_tips.content}}}
        </document>

        <toc>
        {{{documents.readme.toc}}}
        </toc>

        Summary: {{documents.readme.summary}}
```

### 템플릿 변수

**콘텐츠:**
- `{{{documents.name.content}}}` - 전체 문서 콘텐츠 (이스케이프 없음)
- `{{documents.name.content}}` - 이스케이프된 콘텐츠

**메타데이터:**
- `{{{documents.name.toc}}}` - 목차 (마크다운 제목)
- `{{documents.name.summary}}` - 문서 요약
- `{{documents.name.type}}` - 문서 타입

**중요:** 마크다운 형식을 보존하려면 `{{{...}}}` (중괄호 3개)를 사용하세요.

## Handlebars 헬퍼

### 사용 가능한 컨텍스트 변수

**문서:**
```handlebars
{{{documents.doc_name.content}}}  - Full document content (unescaped)
{{{documents.doc_name.toc}}}      - Table of contents
{{documents.doc_name.summary}}     - Document summary (escaped)
```

**환경 변수:**
```handlebars
{{env.NODE_ENV}}           - Access any environment variable
{{env.API_KEY}}
{{env.DEBUG}}
```

**에이전트 메타데이터:**
```handlebars
{{agent.id}}               - Agent ID
{{agent.name}}             - Agent name
{{agent.provider}}         - AI provider (cli/claude, cli/gemini, cli/copilot, plugin/*)
{{agent.model}}            - Model name (sonnet, haiku, etc.)
{{agent.workingDirectory}} - Working directory
```

**모드:**
```handlebars
{{mode}}                   - 'query' or 'execute'
```

**사용자 정의 변수:**
```handlebars
{{vars.customKey}}         - Any custom variable passed in context
```

### 조건 헬퍼

#### 동등성 확인

```handlebars
{{#if (eq agent.provider "cli/claude")}}
You are using Claude AI.
{{else}}
You are using another AI provider.
{{/if}}
```

#### 부등식

```handlebars
{{#if (ne env.NODE_ENV "production")}}
Debug mode is enabled.
{{/if}}
```

#### 포함 여부 (배열)

```handlebars
{{#if (contains options "--verbose")}}
Verbose output enabled.
{{/if}}
```

#### 논리 AND

```handlebars
{{#if (and agent.model env.DEBUG)}}
Model: {{agent.model}}, Debug enabled
{{/if}}
```

#### 논리 OR

```handlebars
{{#if (or (eq agent.provider "cli/claude") (eq agent.provider "cli/gemini"))}}
Web search is available.
{{/if}}
```

#### 논리 NOT

```handlebars
{{#if (not env.PRODUCTION)}}
Running in development mode.
{{/if}}
```

## 내장 헬퍼

### formatConversation 헬퍼

`formatConversation` 헬퍼는 대화 기록을 AI 프롬프트에 맞게 형식화합니다. 기본 템플릿(권장)과 사용자 정의 템플릿 두 가지 모드를 지원합니다.

#### 기본 사용법 (권장)

내장 템플릿을 한 줄로 사용합니다:

```handlebars
{{{formatConversation messages platform}}}
```

**출력 예시:**
```xml
<messages>
Previous conversation (22 messages):
(Slack thread)

**Doha (<@U08LSF2KNVD>)**: 안녕하세요
**crewxdev (<@U09J206RP8V>) (@CrewX)**: 안녕하세요! 무엇을 도와드릴까요?
...
</messages>
```

**특징:**
- ✅ 자동 `<messages>` 태그 감싸기
- ✅ Slack 멘션 형식화
- ✅ 메시지 개수 표시
- ✅ 플랫폼 라벨 표시 (Slack thread)
- ✅ 사용자/에이전트 구분

#### 사용자 정의 템플릿 사용

특수한 형식화가 필요한 경우 블록 헬퍼로 사용합니다:

```handlebars
{{#formatConversation messages platform}}
<conversation-history platform="{{platform}}" count="{{messagesCount}}">
{{#each messages}}
{{#if isAssistant}}
[AI] {{{text}}}
{{else}}
[USER] {{{text}}}
{{/if}}
{{/each}}
</conversation-history>
{{/formatConversation}}
```

**출력 예시:**
```xml
<messages>
<conversation-history platform="slack" count="22">
[USER] 안녕하세요
[AI] 안녕하세요! 무엇을 도와드릴까요?
...
</conversation-history>
</messages>
```

#### 블록 헬퍼에서 사용 가능한 변수

**컨텍스트 변수:**
- `messages`: 메시지 배열
- `platform`: 'slack' 또는 'cli'
- `messagesCount`: 메시지 개수

**각 메시지 객체:**
```javascript
{
  text: string,           // Message content
  isAssistant: boolean,   // AI message indicator
  metadata: {
    agent_id: string,     // Agent ID
    slack: {              // Slack metadata
      user_id: string,
      username: string,
      user_profile: {
        display_name: string,
        real_name: string
      },
      bot_user_id: string,
      bot_username: string
    }
  }
}
```

#### 모범 사례

**✅ 권장:**
1. 기본 템플릿부터 시작: `{{{formatConversation messages platform}}}`
2. 필요할 때 플랫폼별 분기 사용
3. 의미 있는 XML 태그 사용

**❌ 피해야 할 것:**
1. `<messages>` 태그를 수동으로 추가하기 (헬퍼가 자동으로 추가합니다)
2. 템플릿에서 복잡한 로직 사용 (간단하게 유지)
3. 메타데이터 안전성 확인 누락

## 템플릿 예시

### 예시 1: 환경별 동작

```yaml
agents:
  - id: "dev_assistant"
    inline:
      prompt: |
        You are a development assistant.

        {{#if (eq env.NODE_ENV "production")}}
        **Production Mode**: Be extra careful with suggestions.
        Always recommend testing changes thoroughly.
        {{else}}
        **Development Mode**: Feel free to experiment.
        You can suggest more experimental approaches.
        {{/if}}

        Working Directory: {{agent.workingDirectory}}
```

### 예시 2: 공급자별 기능

```yaml
agents:
  - id: "researcher"
    inline:
      prompt: |
        You are a research assistant.

        {{#if (or (eq agent.provider "cli/claude") (eq agent.provider "cli/gemini"))}}
        ## Web Search Available
        You have access to web search capabilities.
        Use them to find the latest information.
        {{else}}
        ## Local-Only Analysis
        You don't have web search. Focus on analyzing provided code and files.
        {{/if}}

        Provider: {{agent.provider}}
        Model: {{agent.model}}
```

### 예시 3: 모델별 지침

```yaml
agents:
  - id: "coder"
    inline:
      prompt: |
        You are a coding assistant.

        {{#if (eq agent.model "haiku")}}
        ## Fast Response Mode
        Provide concise, quick answers.
        Focus on the most important information.
        {{else if (eq agent.model "opus")}}
        ## Deep Analysis Mode
        Provide detailed, comprehensive analysis.
        Consider edge cases and architectural implications.
        {{else}}
        ## Balanced Mode
        Provide clear, thorough but efficient responses.
        {{/if}}
```

### 예시 4: 다단계 문서

**documents.yaml (글로벌):**
```yaml
documents:
  coding_standards: |
    # Coding Standards
    ## TypeScript
    - Use strict type checking
    - Prefer interfaces over types
    - Document public APIs
```

**crewx.yaml (프로젝트):**
```yaml
documents:
  project_conventions: |
    # Project Conventions
    - Follow trunk-based development
    - Write tests for all features
    - Use semantic commit messages

agents:
  - id: "code_reviewer"
    inline:
      documents:
        review_checklist: |
          # Review Checklist
          - Check type safety
          - Verify test coverage
          - Review error handling

      prompt: |
        You are a code reviewer.

        <coding_standards>
        {{{documents.coding_standards.content}}}
        </coding_standards>

        <project_conventions>
        {{{documents.project_conventions.content}}}
        </project_conventions>

        <review_checklist>
        {{{documents.review_checklist.content}}}
        </review_checklist>
```

### 예시 5: 대화 기록 통합

```yaml
agents:
  - id: "slack_bot"
    inline:
      prompt: |
        You are a Slack assistant.

        {{{formatConversation messages platform}}}

        Respond naturally based on the conversation history.
```

## 레이아웃 시스템

CrewX 레이아웃은 재사용 가능한 프롬프트 구조 템플릿을 제공합니다. 레이아웃은 템플릿 시스템과 함께 작동하여 에이전트 프롬프트를 구성합니다.

**빠른 비교:**

| 기능 | 템플릿 (이 문서) | 레이아웃 |
|------|-----------------|---------|
| 목적 | 문서 관리 & 변수 | 프롬프트 구조 & 재사용성 |
| 설정 | `documents`, `{{{variables}}}` | `inline.layout` props 사용 |
| 범위 | 콘텐츠 삽입 | 구조적 래핑 |
| 예시 | 코딩 표준 로드 | 시스템 프롬프트 형식 정의 |

**템플릿 시스템 (이 문서):**
- 에이전트 간 문서 관리
- `{{{documents.name.content}}}` 컨텐츠 참조
- 동적 콘텐츠를 위한 Handlebars 헬퍼 사용
- `{{agent.id}}`, `{{env.DEBUG}}` 같은 변수 삽입

**레이아웃 시스템:**
- 재사용 가능한 프롬프트 템플릿 정의
- React PropTypes 스타일의 props를 사용한 사용자 정의
- 여러 에이전트 간 구조 공유
- 보안 컨테이너 및 프롬프트 래핑

**예시 - 둘 다 함께 사용:**

```yaml
# 문서 정의 (템플릿 시스템)
documents:
  coding_standards: |
    # Coding Standards
    - Use TypeScript strict mode
    - Write unit tests

agents:
  - id: code_reviewer
    inline:
      # 구조를 위해 레이아웃 사용 (레이아웃 시스템)
      layout: "crewx/default"  # Full agent profile

      # 프롬프트에서 문서 참조 (템플릿 시스템)
      prompt: |
        You are a code reviewer.

        <standards>
        {{{documents.coding_standards.content}}}
        </standards>

        Environment: {{env.NODE_ENV}}
        Provider: {{agent.provider}}
```

자세한 레이아웃 사용법은 [레이아웃 시스템 가이드](layouts.md)를 참조하세요.

## 모범 사례

### 1. 문서 ID 네이밍 규칙

**문서 ID에 언더스코어(`_`)를 사용하세요:**

```yaml
# ✅ 권장: 언더스코어 사용
documents:
  coding_standards: |
    # Coding Standards
  api_guide: |
    # API Guide
  review_checklist: |
    # Review Checklist

# ❌ 피하기: 하이픈은 문제를 일으킬 수 있습니다
documents:
  coding-standards: |  # May not work in all contexts
    # Coding Standards
```

**언더스코어를 사용하는 이유는?**
- ✅ 모든 템플릿 컨텍스트에서 안정적으로 작동
- ✅ Handlebars 변수 구문과 호환성
- ✅ 잠재적 파싱 문제 방지
- ✅ JavaScript 네이밍 규칙과 일치

**사용 예시:**
```yaml
documents:
  project_conventions: |
    # Project Conventions
    - Follow trunk-based development

agents:
  - id: reviewer
    inline:
      prompt: |
        {{{documents.project_conventions.content}}}
```

### 2. 범위별로 구성

- **글로벌**: 코딩 표준, 일반 가이드라인
- **프로젝트**: 프로젝트별 규칙, 아키텍처
- **에이전트**: 역할별 체크리스트, 워크플로우

### 3. 지연 로딩 사용

큰 문서(>100KB)의 경우:
```yaml
documents:
  large_spec:
    path: "docs/large-spec.md"
    lazy: true  # Only load when accessed
```

### 4. 형식 보존

마크다운에는 항상 중괄호 3개 사용:
```yaml
{{{documents.name.content}}}  # 올바름
{{documents.name.content}}    # 이스케이프됨 (마크다운에 잘못됨)
```

### 5. 요약 제공

에이전트가 문서 목적을 이해하도록 도와줍니다:
```yaml
documents:
  api_guide:
    path: "docs/api.md"
    summary: "RESTful API design patterns and best practices"
```

### 6. 버전 관리

Git에 문서 저장:
```
project/
├── docs/
│   ├── *.md
├── documents.yaml
└── crewx.yaml
```

### 7. 환경 변수 사용

에이전트를 컨텍스트 인식적으로 만들기:
```bash
export NODE_ENV=production
export FEATURE_FLAGS=experimental,beta
crewx query "@dev analyze this feature"
```

### 8. 설명적인 변수명 사용

조건을 명확하게 만들기:
```handlebars
{{#if (eq env.DEPLOYMENT_ENV "production")}}  # 명확함
{{#if (eq env.DE "prod")}}                    # 불명확함
```

### 9. 폴백 제공

항상 `{{else}}` 절을 포함:
```handlebars
{{#if tools}}
  You have {{tools.count}} tools available.
{{else}}
  No tools available at this time.
{{/if}}
```

## 이점

✅ **버전 관리** - YAML/마크다운 파일에 문서 저장
✅ **재사용성** - 에이전트 간 문서 공유
✅ **구성** - 관심사 분리 (글로벌, 프로젝트, 에이전트)
✅ **성능** - 큰 문서의 지연 로딩
✅ **유연성** - 인라인과 파일 기반 문서 혼합
✅ **동적 동작** - 환경 및 에이전트 인식 프롬프트

## 참고

- [레이아웃 시스템 가이드](layouts.md) - props를 가진 재사용 가능한 프롬프트 템플릿
- [에이전트 설정 가이드](agent-configuration.md) - 에이전트 설정
- [CLI 가이드](cli-guide.md) - 명령줄 사용법
