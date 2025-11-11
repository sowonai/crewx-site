# 레이아웃 시스템 가이드

CrewX의 레이아웃 시스템을 사용하여 재사용 가능하고 사용자 정의할 수 있는 프롬프트 템플릿을 만드는 방법에 대한 완벽한 가이드입니다.

## 목차

- [개요](#개요)
- [빠른 시작](#빠른-시작)
- [기본 사용법](#기본-사용법)
- [내장 레이아웃](#내장-레이아웃)
- [사용자 정의 레이아웃 만들기](#사용자-정의-레이아웃-만들기)
- [Props 스키마](#props-스키마)
- [레이아웃 해석](#레이아웃-해석)
- [모범 사례](#모범-사례)
- [예제](#예제)
- [참고 자료](#참고-자료)

## 개요

CrewX 레이아웃은 에이전트 간에 공유할 수 있는 재사용 가능한 프롬프트 구조 템플릿을 만드는 방법을 제공합니다. 레이아웃을 AI 프롬프트의 React 컴포넌트로 생각해보세요. 구조를 정의하고 사용자 정의 가능한 props를 수용합니다.

### 레이아웃이란 무엇인가요?

레이아웃은 **프롬프트 구조** (컨테이너)를 **프롬프트 콘텐츠** (실제 지시사항)와 분리합니다:

| 측면 | 레이아웃 (`inline.layout`) | 프롬프트 (`inline.prompt`) |
|--------|-------------------------|-------------------------|
| **목적** | 구조 템플릿 정의 | 에이전트별 지시사항 포함 |
| **재사용성** | 여러 에이전트 간 공유 | 각 에이전트에 고유함 |
| **사용자 정의** | Props (React PropTypes처럼) | 직접 텍스트 콘텐츠 |
| **예제** | 보안 컨테이너, 문서 섹션 | "당신은 코드 리뷰어입니다..." |

### 왜 레이아웃을 사용하나요?

**레이아웃 없이:**
```yaml
agents:
  - id: agent1
    inline:
      prompt: |
        <crewx_system_prompt>
        {{{documents.manual.content}}}
        </crewx_system_prompt>
        <system_prompt key="{{vars.security_key}}">
        You are agent 1...
        </system_prompt>

  - id: agent2
    inline:
      prompt: |
        <crewx_system_prompt>
        {{{documents.manual.content}}}  # 중복된 구조
        </crewx_system_prompt>
        <system_prompt key="{{vars.security_key}}">
        You are agent 2...
        </system_prompt>
```

**레이아웃 사용:**
```yaml
agents:
  - id: agent1
    inline:
      layout: "crewx/default"  # 재사용 가능한 구조
      prompt: |
        You are agent 1...

  - id: agent2
    inline:
      layout: "crewx/default"  # 같은 구조, 다른 콘텐츠
      prompt: |
        You are agent 2...
```

## 빠른 시작

### 단계 1: 레이아웃 선택

내장 레이아웃으로 시작하세요:

```yaml
agents:
  - id: my_agent
    inline:
      layout: "crewx/default"  # 간단한 문자열 참조
      prompt: |
        You are a helpful assistant.
```

### 단계 2: 최소 레이아웃 사용

전체 에이전트 프로필이 없는 간단한 에이전트의 경우:

```yaml
agents:
  - id: simple_agent
    inline:
      layout: "crewx/minimal"  # 가벼운 래퍼
      prompt: |
        You are a simple assistant.
```

### 단계 3: 에이전트 테스트

```bash
crewx query "@simple_agent help me with my task"
```

이제 레이아웃을 사용하고 있습니다!

## 기본 사용법

### 내장 레이아웃 사용

레이아웃 ID로 참조하세요:

```yaml
agents:
  - id: simple_agent
    inline:
      layout: "crewx/default"  # 문자열 형식
      prompt: |
        Your instructions here.
```

**사용 가능한 내장 레이아웃:**
- `crewx/default` - 보안 컨테이너가 있는 전체 에이전트 프로필 (기본값)
- `crewx/minimal` - 최소 보안 래퍼만 (가벼움)

### 레이아웃 선택

사용 사례에 맞는 적절한 레이아웃을 선택하세요:

```yaml
agents:
  - id: full_agent
    inline:
      layout: "crewx/default"  # 전체 에이전트 프로필
      prompt: |
        You are a complex agent with full capabilities.

  - id: minimal_agent
    inline:
      layout: "crewx/minimal"  # 최소 래퍼만
      prompt: |
        You are a simple, focused agent.
```

### 기본 동작

`layout`을 생략하면 CrewX가 자동으로 `crewx/default`를 사용합니다:

```yaml
agents:
  - id: my_agent
    inline:
      # 레이아웃을 지정하지 않음 → crewx/default 사용
      prompt: |
        Your instructions here.
```

## 내장 레이아웃

### crewx/default

별도로 지정하지 않는 한 모든 에이전트가 사용하는 표준 레이아웃입니다. 전체 에이전트 프로필과 완벽한 컨텍스트를 제공합니다.

**구조:**
- 프롬프트를 `<crewx_system_prompt>`와 `<system_prompt>` 보안 컨테이너에 래핑
- 전체 에이전트 프로필 포함 (신원, CLI 옵션, 세션 정보)
- CrewX 사용자 설명서 문서 포함
- 에이전트의 `inline.prompt`를 보안 컨테이너에 주입

**Props:** 없음

**사용법:**
```yaml
agents:
  - id: my_agent
    inline:
      layout: "crewx/default"  # 명시적 (또는 기본값으로 생략)
      prompt: |
        You are a helpful assistant.
```

**언제 사용하나요:**
- 전체 컨텍스트와 기능이 필요한 표준 에이전트
- 완벽한 에이전트 프로필 정보의 이점을 받을 수 있는 에이전트
- 대부분의 사용 사례에 기본값

### crewx/minimal

전체 에이전트 프로필 없이 필수 보안 래퍼만 제공하는 가벼운 레이아웃입니다.

**구조:**
- 프롬프트를 `<crewx_system_prompt>`와 `<system_prompt>` 보안 컨테이너에 래핑
- 에이전트의 `inline.prompt`를 직접 주입 (추가 컨텍스트 없음)
- 간단한 에이전트를 위한 최소 오버헤드

**Props:** 없음

**사용법:**
```yaml
agents:
  - id: simple_agent
    inline:
      layout: "crewx/minimal"  # 가벼운 래퍼
      prompt: |
        You are a simple assistant.
```

**언제 사용하나요:**
- 명확하고 특정 작업에 집중하는 간단한 에이전트
- 최소한의 시스템 컨텍스트를 원할 때
- 토큰 사용을 최소화하려는 성능 민감한 시나리오
- 전체 에이전트 프로필 정보가 필요하지 않은 에이전트

## 사용자 정의 레이아웃 만들기

`crewx.yaml` 파일에서 사용자 정의 레이아웃을 정의하여 재사용 가능한 프롬프트 구조를 만들 수 있습니다.

### 기본 사용자 정의 레이아웃

`crewx.yaml`의 `layouts` 섹션에서 레이아웃을 정의하세요:

```yaml
# crewx.yaml
layouts:
  my_custom_layout: |
    <system_prompt key="{{vars.security_key}}">
    You are a specialized agent.

    {{{agent.inline.prompt}}}

    Always follow best practices.
    </system_prompt>

agents:
  - id: my_agent
    inline:
      layout: "my_custom_layout"  # 사용자 정의 레이아웃 참조
      prompt: |
        You are a code reviewer focusing on security.
```

### 단순 매개변수화된 레이아웃

여러 에이전트에서 공유되는 레이아웃의 경우 프롬프트에 직접 매개변수를 포함하세요:

```yaml
# crewx.yaml
layouts:
  team_layout: |
    <system_prompt key="{{vars.security_key}}">
    You are a specialized team member.

    {{{agent.inline.prompt}}}

    Always collaborate with your team and follow best practices.
    </system_prompt>

agents:
  - id: frontend_dev
    inline:
      layout: "team_layout"
      prompt: |
        You are a member of the Frontend Team.
        Your focus area: frontend
        You specialize in React and TypeScript.

  - id: backend_dev
    inline:
      layout: "team_layout"
      prompt: |
        You are a member of the Backend Team.
        Your focus area: backend
        You specialize in Node.js and databases.
```

**참고:** 대부분의 경우 `prompt` 필드에 직접 매개변수를 포함하는 것이 props 검증을 사용하는 것보다 더 간단하고 유지 관리하기 쉽습니다.

### 고급: Props 검증이 있는 레이아웃

유형 검증과 기본값이 필요한 고급 사용 사례의 경우 `propsSchema`를 사용하세요:

```yaml
# crewx.yaml
layouts:
  config_layout:
    propsSchema:
      teamName:
        type: string
        defaultValue: "Development Team"
      maxContextDocs:
        type: number
        min: 1
        max: 50
        defaultValue: 10
      verbose:
        type: bool
        defaultValue: false
    template: |
      <system_prompt key="{{vars.security_key}}">
      <team>{{props.teamName}}</team>
      <context_limit>{{props.maxContextDocs}}</context_limit>
      <verbose_mode>{{props.verbose}}</verbose_mode>

      {{{agent.inline.prompt}}}

      Follow team guidelines and best practices.
      </system_prompt>

agents:
  # 기본 props가 있는 에이전트
  - id: default_agent
    inline:
      layout: "config_layout"  # 기본값 사용
      prompt: |
        You are an agent with default settings.

  # 사용자 정의 props가 있는 에이전트
  - id: custom_agent
    inline:
      layout:
        id: "config_layout"
        props:
          teamName: "AI Research Team"
          maxContextDocs: 25
          verbose: true
      prompt: |
        You are an agent with custom settings.
```

**Props 검증을 언제 사용하나요:**
- 여러 에이전트가 다른 구성 값이 필요할 때
- 유형 안전성이 중요할 때 (숫자 범위, 열거형, 부울)
- 잘못된 값에 대해 검증 오류를 원할 때
- 다양한 설정이 있는 많은 에이전트에서 공유하는 레이아웃

### 사용 가능한 템플릿 변수

사용자 정의 레이아웃에서 이러한 변수를 사용하세요:

- `{{{agent.inline.prompt}}}` - 에이전트의 프롬프트 콘텐츠
- `{{{agent.id}}}`, `{{{agent.name}}}` - 에이전트 메타데이터
- `{{vars.security_key}}` - 컨테이너용 보안 키
- `{{{documents.doc-name.content}}}` - 문서 콘텐츠
- `{{props.yourPropName}}` - 사용자 정의 props
- `{{env.YOUR_ENV_VAR}}` - 환경 변수

### 레이아웃 모범 사례

1. **항상 보안 컨테이너 사용**: `<system_prompt key="{{vars.security_key}}">`에 콘텐츠를 래핑하세요
2. **에이전트 프롬프트 주입**: 삼중 괄호로 `{{{agent.inline.prompt}}}`를 사용하세요
3. **기본값 제공**: 모든 props에 대해 `defaultValue` 설정
4. **간단하게 유지**: 최소 구조로 시작하여 필요할 때만 복잡성 추가
5. **일반적인 패턴 재사용**: 반복되는 구조를 레이아웃으로 추출

### 예제: 문서 중심 레이아웃

```yaml
layouts:
  doc_reviewer_layout: |
    <system_prompt key="{{vars.security_key}}">
    <role>Documentation Reviewer</role>

    <standards>
    {{{documents.writing-guide.content}}}
    </standards>

    <instructions>
    {{{agent.inline.prompt}}}
    </instructions>

    Always check for clarity, accuracy, and consistency.
    </system_prompt>

documents:
  writing-guide: |
    # Writing Guide
    - Use clear, concise language
    - Include code examples
    - Follow markdown conventions

agents:
  - id: doc_reviewer
    inline:
      layout: "doc_reviewer_layout"
      prompt: |
        Review documentation for technical accuracy and readability.
```

## Props 스키마

**참고:** 내장 레이아웃 (`crewx/default`와 `crewx/minimal`)은 props를 사용하지 않습니다. 이 섹션은 **사용자 정의 레이아웃**을 만들 때 관련이 있습니다.

CrewX는 레이아웃 props에 대해 **React PropTypes 스타일** 검증을 사용합니다. React에 익숙하다면 자연스러울 것입니다.

### Prop 유형

#### 문자열 Props

```yaml
propsSchema:
  name:
    type: string
    defaultValue: "default"
```

**제약 포함:**
```yaml
propsSchema:
  theme:
    type: string
    oneOf: ["light", "dark", "auto"]  # 열거형 값
    defaultValue: "auto"
```

**사용자 정의 레이아웃에서 사용:**
```yaml
layout:
  id: "my/custom-layout"
  props:
    theme: "dark"  # "light", "dark" 또는 "auto"이어야 함
```

#### 숫자 Props

```yaml
propsSchema:
  maxItems:
    type: number
    min: 1
    max: 100
    defaultValue: 10
```

**사용자 정의 레이아웃에서 사용:**
```yaml
layout:
  id: "my/custom-layout"
  props:
    maxItems: 25  # 1과 100 사이여야 함
```

#### 부울 Props

```yaml
propsSchema:
  enabled:
    type: bool
    defaultValue: true
```

**사용자 정의 레이아웃에서 사용:**
```yaml
layout:
  id: "my/custom-layout"
  props:
    enabled: false
```

#### 배열 Props

**단순 배열:**
```yaml
propsSchema:
  tags:
    type: array
    defaultValue: []
```

**입력된 배열 (arrayOf):**
```yaml
propsSchema:
  sections:
    type: arrayOf
    itemType: string
    itemOneOf: ["section1", "section2", "section3"]
    defaultValue: ["section1"]
```

**사용자 정의 레이아웃에서 사용:**
```yaml
layout:
  id: "my/custom-layout"
  props:
    sections: ["section1", "section2"]  # 각 항목이 유효해야 함
```

### 필수 Props

`isRequired`를 사용하여 필수 props를 적용하세요:

```yaml
propsSchema:
  userId:
    type: string
    isRequired: true  # 반드시 제공해야 함
```

**사용자 정의 레이아웃에서 사용:**
```yaml
layout:
  id: "my/custom-layout"
  props:
    userId: "user123"  # 필수, 생략 불가
```

### 복잡한 예제

```yaml
propsSchema:
  # 열거형 제약이 있는 문자열
  theme:
    type: string
    oneOf: ["light", "dark", "auto"]
    defaultValue: "auto"
    description: "UI theme preference"

  # 범위 제약이 있는 숫자
  maxDocs:
    type: number
    min: 1
    max: 50
    defaultValue: 10
    description: "Maximum documents to load"

  # 부울 플래그
  enableCache:
    type: bool
    defaultValue: true
    description: "Enable response caching"

  # 특정 문자열 배열
  features:
    type: arrayOf
    itemType: string
    itemOneOf: ["search", "analytics", "reporting"]
    defaultValue: ["search"]
    description: "Enabled features"

  # 필수 문자열
  agentName:
    type: string
    isRequired: true
    description: "Agent display name"
```

### React PropTypes 비교

React PropTypes를 알고 있다면 여기 매핑이 있습니다:

| React PropTypes | CrewX 스키마 | 예제 |
|----------------|--------------|---------|
| `PropTypes.string` | `type: string` | `name: "value"` |
| `PropTypes.number` | `type: number` | `count: 42` |
| `PropTypes.bool` | `type: bool` | `enabled: true` |
| `PropTypes.array` | `type: array` | `items: [1, 2, 3]` |
| `PropTypes.arrayOf(PropTypes.string)` | `type: arrayOf, itemType: string` | `tags: ["a", "b"]` |
| `PropTypes.oneOf(["a", "b"])` | `oneOf: ["a", "b"]` | `mode: "a"` |
| `.isRequired` | `isRequired: true` | 필수 필드 |

## 레이아웃 해석

### 해석 순서

CrewX는 두 단계로 레이아웃을 해석합니다:

1. **내장 레이아웃** - CrewX 시스템에서 로드 (`templates/agents/*.yaml`)
2. **Props 재정의** - `crewx.yaml`에서 사용자 제공 props 적용 (props가 있는 사용자 정의 레이아웃)

```
┌─────────────────────────┐
│  Built-in Layout        │  단계 1: 기본 레이아웃 로드
│  (crewx/default or      │         (default/minimal)
│   crewx/minimal)        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Custom Layout Props    │  단계 2: Props 적용
│  (if using custom       │         (사용자 정의 레이아웃만)
│   layout)               │
└─────────────────────────┘
            │
            ▼
┌─────────────────────────┐
│  Final Layout           │  결과: 에이전트 프롬프트와 함께
│                         │         렌더링된 레이아웃
└─────────────────────────┘
```

### Props 재정의 예제 (사용자 정의 레이아웃)

**사용자 정의 레이아웃 정의:**
```yaml
# my-custom-layout.yaml (사용자 정의 레이아웃)
id: "my/custom-layout"
propsSchema:
  theme:
    type: string
    defaultValue: "auto"
  maxItems:
    type: number
    defaultValue: 10
```

**crewx.yaml에서 재정의:**
```yaml
# crewx.yaml (프로젝트)
agents:
  - id: my_agent
    inline:
      layout:
        id: "my/custom-layout"
        props:
          theme: "dark"      # 재정의: "auto" → "dark"
          maxItems: 20       # 재정의: 10 → 20
      prompt: |
        Your instructions here.
```

**최종 렌더링된 레이아웃:**
- `theme` = `"dark"` (재정의됨)
- `maxItems` = `20` (재정의됨)

### 폴백 동작

| 시나리오 | 동작 | 예제 |
|----------|----------|---------|
| 레이아웃 존재 | 지정된 레이아웃 사용 | `layout: "crewx/minimal"` → 최소 로드 |
| 레이아웃 찾을 수 없음 | `crewx/default`로 폴백 | `layout: "unknown/layout"` → 기본값 사용 + 경고 |
| Props 유효하지 않음 (관대 모드) | 기본값 사용 + 경고 | 유효하지 않은 prop → 기본값 사용 |
| Props 유효하지 않음 (엄격 모드) | 오류, 실행 중지 | 유효하지 않은 prop → 오류 발생 |

### 검증 모드

**관대 모드 (기본값):**
- 유효하지 않은 props → 기본값 사용
- 알 수 없는 props → 경고와 함께 무시
- 누락된 필수 props → 사용 가능한 경우 기본값 사용

**엄격 모드:**
- 유효하지 않은 props → 검증 오류 발생
- 알 수 없는 props → 검증 오류 발생
- 누락된 필수 props → 검증 오류 발생

구성은 CrewX 시스템에서 설정되며 사용자 구성이 불가능합니다.

## 모범 사례

### 1. 간단하게 시작

사용자 정의 레이아웃을 만들기 전에 내장 레이아웃으로 시작하세요:

```yaml
# ✅ 좋음: 내장 레이아웃으로 시작
agents:
  - id: my_agent
    inline:
      layout: "crewx/default"
      prompt: |
        Your instructions.
```

### 2. 의미 있는 Prop 이름 사용

Props를 자체 문서화하도록 만드세요:

```yaml
# ✅ 좋음: 명확한 prop 이름
props:
  maxContextDocuments: 20
  enableConversationHistory: true

# ❌ 나쁨: 암호화된 이름
props:
  max: 20
  en: true
```

### 3. 기본값 제공

레이아웃 정의에서 항상 합리적인 기본값을 설정하세요:

```yaml
propsSchema:
  theme:
    type: string
    defaultValue: "auto"  # ✅ 기본값 제공됨

  mode:
    type: string
    # ❌ 기본값 없음 - 사용자가 항상 지정해야 함
```

### 4. Props 문서화

Props의 목적을 설명하려면 `description`을 사용하세요:

```yaml
propsSchema:
  maxContextDocs:
    type: number
    min: 1
    max: 50
    defaultValue: 10
    description: "최대 로드할 컨텍스트 문서 수입니다. 값이 높을수록 컨텍스트는 개선되지만 토큰 사용이 증가합니다."  # ✅ 도움말
```

### 5. 유형 제약 사용

`oneOf`, `min`, `max`를 사용하여 조기에 오류를 포착하세요:

```yaml
propsSchema:
  theme:
    type: string
    oneOf: ["light", "dark", "auto"]  # ✅ 입력 검증
    defaultValue: "auto"

  # ❌ 제약 없음 - 모든 문자열 허용 (오타 가능)
  theme:
    type: string
    defaultValue: "auto"
```

### 6. 레이아웃을 집중력 있게 유지

각 레이아웃은 특정 목적을 제공해야 합니다:

```yaml
# ✅ 좋음: 집중된 레이아웃
- crewx/default   → 완벽한 컨텍스트가 있는 전체 에이전트 프로필
- crewx/minimal   → 간단한 에이전트를 위한 가벼운 래퍼

# ❌ 나쁨: 모든 것을 하려는 하나의 레이아웃
- crewx/mega-layout  → 20가지 다른 모드와 수많은 props 지원
```

### 7. 보안 고려사항

**절대 비밀을 하드코딩하지 마세요:**
```yaml
# ❌ 절대 이렇게 하지 마세요
props:
  apiKey: "sk-1234567890"  # 하드코딩된 비밀
```

**대신 환경 변수를 사용하세요:**
```yaml
# ✅ 프롬프트에서 환경 변수 참조
prompt: |
  API Key: {{env.API_KEY}}  # 안전함: 환경에서
```

**시스템 레이아웃만 신뢰하세요:**
- 내장 CrewX 레이아웃은 보안 검토됨
- 사용자 정의 레이아웃은 보안 검토를 받아야 함
- Props는 CrewX에서 삭제 및 이스케이프됨

## 예제

### 예제 1: 기본 레이아웃이 있는 간단한 에이전트

**시나리오:** 기본 코드 검토 에이전트를 만드세요.

```yaml
agents:
  - id: code_reviewer
    name: "Code Review Assistant"
    inline:
      provider: "cli/claude"
      layout: "crewx/default"  # 간단한 기본값 사용
      prompt: |
        You are a code review assistant.

        Review code for:
        - Type safety
        - Error handling
        - Performance issues
        - Security vulnerabilities

        Provide constructive feedback with examples.
```

**사용법:**
```bash
crewx query "@code_reviewer review my authentication code"
```

### 예제 2: 간단한 작업을 위한 최소 에이전트

**시나리오:** 간단하고 집중된 작업을 위한 경량 도우미를 만드세요.

```yaml
agents:
  - id: quick_helper
    name: "Quick Helper"
    inline:
      provider: "cli/claude"
      layout: "crewx/minimal"  # 가벼운 래퍼
      prompt: |
        You are a quick helper for simple questions.

        Keep answers:
        - Concise and to the point
        - Clear and actionable
        - Under 3 sentences when possible

        Focus on efficiency and speed.
```

**사용법:**
```bash
crewx query "@quick_helper what is the syntax for array map in JavaScript?"
crewx query "@quick_helper explain git rebase in one sentence"
```

### 예제 3: 레이아웃 공유 여러 에이전트

**시나리오:** 같은 레이아웃 구조를 공유하는 프론트엔드 및 백엔드 전문가를 만드세요.

```yaml
agents:
  - id: frontend_specialist
    name: "Frontend Expert"
    inline:
      provider: "cli/claude"
      layout: "crewx/default"  # 공유 구조
      prompt: |
        You are a frontend development specialist.

        Expertise:
        - React, Vue, Angular
        - CSS, Tailwind, styled-components
        - Browser APIs and optimization

  - id: backend_specialist
    name: "Backend Expert"
    inline:
      provider: "cli/gemini"
      layout: "crewx/default"  # 같은 구조, 다른 콘텐츠
      prompt: |
        You are a backend development specialist.

        Expertise:
        - Node.js, Python, Go
        - Database design (SQL, NoSQL)
        - API design and security
```

**이점:**
- 에이전트 간 일관된 프롬프트 구조
- 유지 관리 용이 (레이아웃 한 번 업데이트)
- 명확한 관심사 분리

### 예제 4: 사용 사례에 따라 레이아웃 선택

**시나리오:** 다양한 복잡도 수준에 대해 다른 레이아웃을 사용하세요.

```yaml
agents:
  - id: simple_qa
    name: "Simple Q&A Assistant"
    inline:
      layout: "crewx/minimal"  # 간단한 작업을 위한 가벼움
      prompt: |
        You are a Q&A assistant for quick questions.
        Provide brief, direct answers without extra context.

  - id: complex_analyst
    name: "Complex Analysis Assistant"
    inline:
      layout: "crewx/default"  # 복잡한 작업을 위한 전체 컨텍스트
      prompt: |
        You are an analysis assistant for complex technical questions.

        Provide comprehensive analysis including:
        - Root cause investigation
        - Multiple solution approaches
        - Trade-off analysis
        - Best practice recommendations

        Use full context and agent capabilities as needed.
```

### 예제 5: 점진적 개선

**시나리오:** 간단하게 시작하여 필요에 따라 최적화하세요.

**버전 1: 암시적 기본값으로 시작**
```yaml
agents:
  - id: assistant
    inline:
      # 암시적 crewx/default 레이아웃
      prompt: |
        You are a helpful assistant.
```

**버전 2: 레이아웃 명시적으로 만들기**
```yaml
agents:
  - id: assistant
    inline:
      layout: "crewx/default"  # 명시적 선택
      prompt: |
        You are a helpful assistant.
```

**버전 3: 성능 최적화**
```yaml
agents:
  - id: assistant
    inline:
      layout: "crewx/minimal"  # 효율성을 위해 최소값으로 전환
      prompt: |
        You are a helpful assistant focused on quick responses.
```

## 참고 자료

### 관련 문서

- [템플릿 시스템](./templates.md) - 문서 관리 및 템플릿 변수
- [템플릿 변수](./template-variables.md) - 사용 가능한 변수 및 도우미
- [에이전트 구성](../configuration/agents.md) - 완벽한 에이전트 설정 가이드

### 빠른 링크

**사용자의 경우:**
- 프롬프트에서 템플릿을 사용하고 싶으신가요? → [템플릿 시스템](./templates.md)
- 변수를 참조해야 하나요? → [템플릿 변수](./template-variables.md)
- 사용자 정의 에이전트를 설정하시나요? → [에이전트 구성](../configuration/agents.md)

**개발자의 경우:**
- 기술적 구현 세부사항은 [CrewX GitHub 저장소](https://github.com/sowonlabs/crewx)를 참고하세요
