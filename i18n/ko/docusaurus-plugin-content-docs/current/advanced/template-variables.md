# 템플릿 변수 참조

이 문서는 CrewX 에이전트 템플릿(agents.yaml)에서 사용 가능한 Handlebars 변수 및 헬퍼를 설명합니다.

모든 변수는 `src/utils/template-processor.ts`에서 Handlebars 템플릿 엔진을 사용하여 처리됩니다.

## 문서 변수

`.crewx/docs/` 디렉토리에서 로드된 문서에 접근합니다:

```handlebars
{{{documents.doc-name.content}}}    # 전체 문서 내용
{{{documents.doc-name.toc}}}        # 목차 (제목만)
{{documents.doc-name.summary}}      # 문서 요약
```

**예시:**
```yaml
system_prompt: |
  당신은 개발자 어시스턴트입니다.

  {{{documents.coding-standards.content}}}

  프로젝트 구조:
  {{{documents.project-structure.toc}}}
```

**주의사항:**
- 문서명은 하이픈을 사용합니다 (예: `coding-standards`, `project-structure`)
- 문서는 `.crewx/docs/<doc-name>.md`에서 로드됩니다
- 삼중 중괄호 `{{{ }}}` 를 사용하여 형식을 보존합니다 (HTML 이스케이핑 없음)

## 환경 변수

환경 변수에 접근합니다:

```handlebars
{{env.VARIABLE_NAME}}               # 환경 변수 읽기
{{#if env.DEBUG}}...{{/if}}         # 환경 변수 기반 조건
```

**예시:**
```yaml
system_prompt: |
  {{#if env.DEBUG}}
  디버그 모드가 활성화되었습니다. 상세한 로그를 제공하세요.
  {{else}}
  프로덕션 모드입니다. 간단하게 설명하세요.
  {{/if}}
```

## 에이전트 메타데이터

현재 에이전트 속성에 접근합니다:

```handlebars
{{agent.id}}                        # 에이전트 ID (예: "claude", "gemini")
{{agent.name}}                      # 에이전트 표시 이름
{{agent.provider}}                  # 제공자 (예: "claude", "gemini", "copilot")
{{agent.model}}                     # 모델명 (지정된 경우)
{{agent.workingDirectory}}          # 작업 디렉토리 경로
```

**예시:**
```yaml
system_prompt: |
  당신은 {{agent.name}} ({{agent.id}})입니다.
  제공자: {{agent.provider}}
  {{#if agent.model}}모델: {{agent.model}}{{/if}}
```

## 모드

쿼리 대 실행 모드를 감지합니다:

```handlebars
{{mode}}                            # "query" 또는 "execute"
{{#if (eq mode "query")}}...{{/if}} # 쿼리 모드 조건
{{#if (eq mode "execute")}}...{{/if}} # 실행 모드 조건
```

**예시:**
```yaml
system_prompt: |
  {{#if (eq mode "query")}}
  읽기 전용 모드입니다. 분석하고 설명하되 파일을 수정하지 마세요.
  {{else}}
  실행 모드입니다. 파일을 수정하고 변경할 수 있습니다.
  {{/if}}
```

## 플랫폼

CLI 대 Slack 플랫폼을 감지합니다:

```handlebars
{{platform}}                        # "cli" 또는 "slack"
{{#if (eq platform "slack")}}...{{/if}} # Slack 특정 지침
```

**예시:**
```yaml
system_prompt: |
  {{#if (eq platform "slack")}}
  Slack 스레드에 있습니다. 응답을 간단하게 유지하세요.
  {{else}}
  CLI 모드입니다. 상세한 결과물을 제공할 수 있습니다.
  {{/if}}
```

## CLI 옵션

에이전트에 전달된 CLI 플래그에 접근합니다:

```handlebars
{{options}}                         # 옵션 문자열 배열
{{#if (contains options "--verbose")}}...{{/if}} # 특정 플래그 확인
```

**예시:**
```yaml
system_prompt: |
  {{#if (contains options "--verbose")}}
  상세 모드가 활성화되었습니다. 상세한 설명을 제공하세요.
  {{/if}}
```

## 대화 기록

대화의 이전 메시지에 접근합니다:

```handlebars
{{messages}}                        # 메시지 객체 배열
{{messages.length}}                 # 메시지 개수
{{{formatConversation messages platform}}} # 형식화된 대화
```

**메시지 객체 구조:**
```typescript
{
  text: string;                     // 메시지 텍스트
  isAssistant: boolean;             // 어시스턴트면 true, 사용자면 false
  metadata?: {                      // 선택적 플랫폼 메타데이터
    slack?: {                       // Slack 특정 정보
      user_id: string;
      username: string;
      user_profile: {
        display_name: string;
        real_name: string;
      }
    };
    agent_id?: string;              // 어시스턴트 메시지의 에이전트 ID
  }
}
```

**기본 formatConversation 템플릿:**
```handlebars
{{{formatConversation messages platform}}}
```

출력 형식:
```
이전 대화 (3개 메시지):
**사용자**: 날씨가 어떻게 되나요?
**어시스턴트 (@claude)**: 날씨가 맑습니다.
**사용자**: 감사합니다!
```

**사용자 정의 formatConversation 템플릿:**
```handlebars
{{#formatConversation messages platform}}
<conversation>
{{#each messages}}
{{#if isAssistant}}
[AI]: {{{text}}}
{{else}}
[Human]: {{{text}}}
{{/if}}
{{/each}}
</conversation>
{{/formatConversation}}
```

**예시:**

간단한 기록 확인:
```yaml
system_prompt: |
  {{#if messages}}
  이전 대화 ({{messages.length}}개 메시지):
  {{#each messages}}
  - {{#if isAssistant}}어시스턴트{{else}}사용자{{/if}}: {{{text}}}
  {{/each}}
  {{/if}}
```

기본 형식화된 대화:
```yaml
system_prompt: |
  {{{formatConversation messages platform}}}

  위의 대화를 기반으로 사용자를 계속 지원하세요.
```

사용자 정의 대화 형식:
```yaml
system_prompt: |
  {{#formatConversation messages platform}}
  # 채팅 기록
  {{#each messages}}
  {{#if isAssistant}}
  **🤖 AI**: {{{truncate text 1000}}}
  {{else}}
  **👤 사용자**: {{{text}}}
  {{/if}}
  {{/each}}
  {{/formatConversation}}
```

## 도구 (향후 - 아직 준비 중!)

사용 가능한 MCP 도구에 접근합니다:

```handlebars
{{tools.list}}                      # 도구 객체 배열
{{tools.count}}                     # 사용 가능한 도구 개수
{{{tools.json}}}                    # 모든 도구를 JSON 문자열로
```

**도구 객체 구조:**
```typescript
{
  name: string;
  description: string;
  input_schema: any;
  output_schema?: any;
}
```

**예시:**
```yaml
system_prompt: |
  {{#if tools}}
  {{tools.count}}개의 MCP 도구에 접근할 수 있습니다:
  {{{tools.json}}}
  {{/if}}
```

## 사용자 정의 변수 (실험적)

`vars` 컨텍스트를 통해 사용자 정의 변수를 전달합니다:

```handlebars
{{vars.customKey}}                  # 사용자 정의 변수 접근
{{#if vars.feature}}...{{/if}}      # 사용자 정의 변수 기반 조건
```

**주의:** 사용자 정의 변수는 YAML 설정이 아닌 CrewX 내부에서 프로그래밍 방식으로 설정됩니다.

## Handlebars 헬퍼

### 비교 헬퍼

```handlebars
{{#if (eq a b)}}...{{/if}}          # 동일성 (===)
{{#if (ne a b)}}...{{/if}}          # 불일치 (!==)
{{#if (contains array value)}}...{{/if}} # 배열에 값 포함
```

**예시:**
```yaml
system_prompt: |
  {{#if (eq agent.provider "claude")}}
  Claude 특정 기능을 사용하세요.
  {{/if}}

  {{#if (ne mode "query")}}
  파일을 수정할 수 있습니다.
  {{/if}}

  {{#if (contains options "--debug")}}
  디버그 모드가 활성화되었습니다.
  {{/if}}
```

### 논리 헬퍼

```handlebars
{{#if (and a b)}}...{{/if}}         # 논리 AND
{{#if (or a b)}}...{{/if}}          # 논리 OR
{{#if (not a)}}...{{/if}}           # 논리 NOT
```

**예시:**
```yaml
system_prompt: |
  {{#if (and (eq mode "execute") env.ALLOW_WRITES)}}
  파일을 작성할 수 있습니다.
  {{/if}}

  {{#if (or env.DEBUG (contains options "--verbose"))}}
  상세 출력이 활성화되었습니다.
  {{/if}}

  {{#if (not env.PRODUCTION)}}
  개발 모드입니다.
  {{/if}}
```

### 데이터 헬퍼

```handlebars
{{{json object}}}                   # JSON.stringify 형식화
{{truncate text 500}}               # 문자열을 최대 길이로 자르기
{{length array}}                    # 배열 또는 문자열 길이
```

**예시:**
```yaml
system_prompt: |
  사용 가능한 도구:
  {{{json tools.list}}}

  이전 컨텍스트 (축약됨):
  {{{truncate documents.context.content 1000}}}

  메시지 개수: {{length messages}}
```

## 완전한 예시

```yaml
agents:
  - id: crewx_dev
    provider: claude
    system_prompt: |
      당신은 CrewX 프로젝트의 개발자 {{agent.name}}입니다.

      # 프로젝트 컨텍스트
      {{{documents.project-structure.content}}}

      # 코딩 표준
      {{{documents.coding-standards.content}}}

      # 모드
      {{#if (eq mode "query")}}
      **쿼리 모드**: 읽기 전용입니다. 수정 없이 분석하고 설명하세요.
      {{else}}
      **실행 모드**: 파일을 수정하고 변경 사항을 구현할 수 있습니다.
      {{/if}}

      # 플랫폼
      {{#if (eq platform "slack")}}
      Slack 스레드에서 응답하고 있습니다. 응답을 간단하게 유지하세요.
      {{/if}}

      # 대화 기록
      {{#if messages}}
      {{{formatConversation messages platform}}}
      {{/if}}

      # 사용 가능한 도구
      {{#if tools}}
      {{tools.count}}개의 MCP 도구에 접근할 수 있습니다.
      {{/if}}

      # 환경
      {{#if env.DEBUG}}
      DEBUG 모드가 활성화되었습니다. 상세한 로그를 제공하세요.
      {{/if}}
```

## 템플릿 로딩 순서

1. **에이전트 템플릿** (agents.yaml의 `system_prompt`)이 로드됩니다
2. **문서 참조**가 감지되고 로드됩니다
3. **문서 내용**이 Handlebars 템플릿으로 처리됩니다 (중첩된 변수 지원)
4. **메인 템플릿**이 컴파일되고 모든 컨텍스트로 렌더링됩니다

이는 문서 내용에서도 `{{agent.id}}`, `{{env.VAR}}` 등을 사용할 수 있다는 뜻입니다.
