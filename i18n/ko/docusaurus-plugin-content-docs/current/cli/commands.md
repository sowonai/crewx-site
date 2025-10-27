# CLI 가이드

CrewX의 명령줄 인터페이스 완전 참고자료입니다.

## 핵심 명령어

### `crewx` (기본값)
도움말 및 사용 가능한 명령어를 표시합니다.

```bash
crewx
```

### `crewx init`
`crewx.yaml` 설정으로 프로젝트를 초기화합니다.

```bash
crewx init                          # 기본 설정으로 초기화
crewx init --config custom.yaml    # 사용자 정의 설정 파일명 사용
crewx init --force                 # 기존 설정 덮어쓰기
```

**기능:**
- 기본 에이전트(Claude, Gemini, Copilot)와 함께 `crewx.yaml` 생성
- `.crewx/logs` 디렉토리 설정
- 실수로 인한 덮어쓰기 방지 (`--force` 사용해 재정의)

> **참고:** 하위 호환성을 위해 `agents.yaml`은 여전히 지원되지만, `crewx.yaml`을 권장합니다.

### `crewx doctor`
시스템 상태 확인 및 진단입니다.

```bash
crewx doctor                        # 전체 시스템 진단
crewx doctor --config path/to/config.yaml  # 사용자 정의 설정 파일 사용
```

**확인 사항:**
- 설정 파일(`crewx.yaml` 또는 `agents.yaml`) 유효성
- AI CLI 도구 사용 가능성(Claude, Gemini, Copilot)
- 응답 검증을 위한 실제 테스트 쿼리
- 세션 제한 및 성능
- 문제 해결 권장사항 제공

### `crewx query`
읽기 전용 분석 및 쿼리입니다.

```bash
# 기본 쿼리
crewx query "@claude analyze this function"
crewx query "@gemini explain the algorithm"

# 병렬로 여러 에이전트 사용
crewx query "@claude @gemini @copilot review security"

# 모델 선택 포함
crewx query "@claude:opus detailed code review"
crewx query "@gemini:gemini-2.5-pro optimize algorithm"
crewx query "@copilot:gpt-5 suggest best practices"

# 대화 기록 포함
crewx query "@claude explain auth" --thread "auth-session"

# 파이프라인 입력
echo "user auth code" | crewx query "@claude explain this"
```

**사용 가능한 모델:**
- **Claude**: `opus`, `sonnet`, `haiku`, `claude-sonnet-4-5`, `claude-sonnet-4-5-20250929`
- **Gemini**: `gemini-2.5-pro` (기본값), `gemini-2.5-flash`
- **Copilot**: `gpt-5`, `claude-sonnet-4`, `claude-sonnet-4.5`
- **Codex**: `gpt-5-codex`, `gpt-5`

> **Codex 추론 난이도:**
> `cli/codex`를 호출할 때 `-c model_reasoning_effort="..."`를 사용해 추론 깊이를 즉시 재정의할 수 있습니다.
> - `gpt-5-codex`: `low`, `medium`, `high` 지원
> - `gpt-5`: `minimal`, `low`, `medium`, `high` 지원

예시:

```bash
codex exec --experimental-json \
  -c model="gpt-5-codex" \
  -c model_reasoning_effort="medium" \
  "Respond with OK."
```

지원되지 않는 조합은 400 오류를 반환합니다(예: `gpt-5-codex` + `minimal`).

### `crewx execute`
파일 생성/수정으로 작업을 실행합니다.

```bash
# 기본 실행
crewx execute "@claude create a React component"

# 병렬로 여러 에이전트 실행
crewx execute "@claude @gemini implement different sorting algorithms"

# 모델 선택 포함
crewx execute "@claude:opus implement complex auth system"
crewx execute "@gemini:gemini-2.5-pro optimize critical code"

# 대화 기록 포함
crewx execute "@claude implement login" --thread "auth-feature"

# 파이프라인 워크플로우
crewx query "@architect design API" | \
crewx execute "@backend implement the design"
```

## 파이프라인 워크플로우

복잡한 다단계 워크플로우를 위해 명령어를 연결합니다:

```bash
# 다단계 개발
crewx query "@architect design user auth system" | \
crewx execute "@backend implement API endpoints" | \
crewx execute "@frontend create UI components"

# 코드 리뷰 및 개선
crewx query "@claude analyze code quality" | \
crewx execute "@gemini implement improvements"

# 설계, 구현, 테스트
crewx query "@architect design feature" | \
crewx execute "@developer build it" | \
crewx query "@tester verify implementation"
```

## `--thread`로 대화 기록 유지

여러 쿼리 및 실행에서 컨텍스트를 유지합니다:

```bash
# 스레드 시작
crewx query "@claude design a login system" --thread "auth-feature"

# 같은 스레드에서 계속(Claude가 이전 컨텍스트 기억)
crewx query "@claude add 2FA support" --thread "auth-feature"

# 스레드 컨텍스트로 실행
crewx execute "@claude implement the design" --thread "auth-feature"
```

**기능:**
- **지속적 컨텍스트** - `.crewx/conversations/`에 저장됨
- **크로스 세션** - 재시작 후에도 사용 가능
- **스레드 격리** - 다른 스레드는 별도의 컨텍스트 유지
- **모든 명령어 지원** - `query`, `execute`, `chat` 사용 가능

**예시 워크플로우:**
```bash
# 설계 단계
crewx query "@architect design REST API" --thread "api-project"

# 구현 단계(설계 기억)
crewx execute "@backend implement endpoints" --thread "api-project"

# 테스트 단계(설계 + 구현 기억)
crewx query "@tester review implementation" --thread "api-project"
```

## Slack 봇 통합

CrewX를 Slack 봇으로 실행합니다:

```bash
crewx slack                        # Claude로 쿼리 전용 모드(기본값)
crewx slack --mode execute         # Slack에서 실행 작업 허용
crewx slack --agent gemini         # Gemini 사용
crewx slack --agent copilot        # GitHub Copilot 사용
crewx slack --agent custom_agent   # 사용자 정의 에이전트 사용
```

**기능:**
- 선택한 AI 에이전트와의 자연스러운 대화
- 스레드 기록 유지
- @멘션 및 DM
- 깔끔한 응답
- 반응 표시(👀 처리 중, ✅ 완료, ❌ 오류)

**모드 선택:**
- `--mode query` *(기본값)*: 읽기 전용 응답, 일반 Q&A에 안전함
- `--mode execute`: 에이전트가 파일을 수정하고 명령어를 실행하며 변경사항을 적용할 수 있음

**설정:**
1. Slack 앱 생성 및 봇 토큰 구성
2. `.env.slack`에서 환경 변수 설정:
   ```bash
   SLACK_BOT_TOKEN=xoxb-...
   SLACK_APP_TOKEN=xapp-...
   SLACK_SIGNING_SECRET=...
   SLACK_MAX_RESPONSE_LENGTH=400000  # 선택 사항
   ```
3. 시작: `npm run start:slack`
4. *(선택 사항)* 로깅을 활성화하여 로컬에서 Slack 대화 유지:
   ```yaml
   # crewx.yaml
   settings:
     slack:
       log_conversations: true
   ```
   또는 환경 변수 설정: `CREWX_SLACK_LOG_CONVERSATIONS=true`.
   활성화되면 Slack 스레드가 CLI 세션처럼 `.crewx/conversations/`로 미러링되어 에이전트 성능 검토에 유용합니다.

[SLACK_INSTALL.md](../SLACK_INSTALL.md)에서 전체 설정 가이드를 참고하세요.

## MCP 서버 모드

원격 접근을 위해 CrewX를 MCP(모델 컨텍스트 프로토콜) 서버로 실행합니다:

```bash
# 기본 MCP 서버(stdio만)
crewx mcp

# HTTP 지원 포함 MCP 서버
crewx mcp server --http

# 전체 설정
crewx mcp server \
  --http \
  --host 0.0.0.0 \
  --port 3000 \
  --key "sk-secret-key" \
  --log
```

**옵션:**
- `--http` - HTTP 트랜스포트 활성화(stdio 외에)
- `--host` - 서버 호스트명(기본값: localhost)
- `--port` - 서버 포트(기본값: 3000)
- `--key` - Bearer 인증용 API 키
- `--log` - 요청 로깅 활성화

**사용 사례:**
- IDE 통합(VS Code, Cursor, Claude Desktop)
- 원격 에이전트 접근([원격 에이전트 가이드](./remote-agents.md) 참고)
- HTTP를 통한 팀 협업

**노출된 MCP 도구:**
- `crewx_queryAgent` - 읽기 전용 에이전트 쿼리
- `crewx_executeAgent` - 파일 작업을 포함한 에이전트 실행

[MCP 통합 가이드](./mcp-integration.md)에서 IDE 설정을 보고 [원격 에이전트 가이드](./remote-agents.md)에서 원격 접근 구성을 참고하세요.

## 고급 기능

### 작업 추적
모든 작업은 고유 작업 ID로 기록됩니다:

```bash
# 작업은 자동으로 로그를 생성합니다
crewx execute "@claude create component"
# 출력: Task ID: abc123

# 작업 로그 보기
crewx logs abc123
```

### 성능 지표
- 실행 시간 추적
- 성공/실패율
- 병렬 vs 순차 비교

### 오류 복구
- 상세한 오류 메시지
- 해결 제안
- 세션 제한 처리

### 설정 검증
실행 전 에이전트 설정을 검증합니다:
- 제공자 가용성
- 필수 옵션
- 작업 디렉토리 존재 여부

## 환경 변수

`.env` 또는 환경 변수로 동작을 커스터마이징합니다:

### 타임아웃 설정

**모든 타임아웃은 기본값으로 30분(1800000ms)으로 통일되어** 모든 작업에서 일관된 동작을 제공합니다.

```bash
# 모든 제공자(30분으로 통일)
CODECREW_TIMEOUT_CLAUDE_QUERY=1800000       # 30분(기본값)
CODECREW_TIMEOUT_CLAUDE_EXECUTE=1800000     # 30분(기본값)
CODECREW_TIMEOUT_GEMINI_QUERY=1800000       # 30분(기본값)
CODECREW_TIMEOUT_GEMINI_EXECUTE=1800000     # 30분(기본값)
CODECREW_TIMEOUT_COPILOT_QUERY=1800000      # 30분(기본값)
CODECREW_TIMEOUT_COPILOT_EXECUTE=1800000    # 30분(기본값)

# 시스템
CODECREW_TIMEOUT_PARALLEL=1800000           # 30분(기본값)
CODECREW_TIMEOUT_STDIN_INITIAL=30000        # 30초
CODECREW_TIMEOUT_STDIN_CHUNK=1800000        # 30분(기본값)
CODECREW_TIMEOUT_STDIN_COMPLETE=100         # 100ms
```

**왜 30분인가?**
- 복잡한 AI 작업 처리(코드 생성, 분석, 리팩토링)
- 중단 없이 장시간 실행 작업 지원
- 모든 제공자 및 모드에서 일관성 있음
- `--timeout` 플래그로 명령별로 재정의 가능

**사용 방법:**
```bash
# .env 파일 사용(필요시 커스터마이징)
echo "CODECREW_TIMEOUT_CLAUDE_QUERY=3600000" >> .env  # 60분
crewx query "@claude complex analysis"

# 인라인 재정의
CODECREW_TIMEOUT_CLAUDE_QUERY=900000 crewx query "@claude quick check"  # 15분

# 명령별 타임아웃 플래그(권장)
crewx query "@claude analyze" --timeout 3600000  # 60분
```

### 플러그인 제공자 환경 변수

플러그인 제공자는 설정을 위해 환경 변수를 사용할 수 있습니다:

```yaml
providers:
  - id: remote_ollama
    type: plugin
    cli_command: ollama
    env:
      OLLAMA_HOST: "${OLLAMA_REMOTE_HOST}"  # 환경 변수 참조
      OLLAMA_API_KEY: "${OLLAMA_API_KEY}"

  - id: custom_tool
    type: plugin
    cli_command: mytool
    env:
      API_ENDPOINT: "https://api.example.com"
      API_TOKEN: "${MY_API_TOKEN}"  # 환경에서 가져옴
```

**.env 예시:**
```bash
OLLAMA_REMOTE_HOST=http://192.168.1.100:11434
OLLAMA_API_KEY=sk-ollama-key-123
MY_API_TOKEN=custom-api-token-456
```

### 원격 에이전트 설정

```bash
# 원격 서버 연결
CREWX_REMOTE_URL=http://production.example.com:3000
CREWX_REMOTE_AGENT=backend_prod
CREWX_REMOTE_TOKEN=sk-prod-secret-key
```

`crewx.yaml`에서 사용:
```yaml
providers:
  - id: prod_server
    type: remote
    location: "${CREWX_REMOTE_URL}"
    external_agent_id: "${CREWX_REMOTE_AGENT}"
    auth:
      type: bearer
      token: "${CREWX_REMOTE_TOKEN}"
```

## 예시

### 기본 분석
```bash
# 단일 에이전트 쿼리
crewx query "@claude explain this function"

# 여러 에이전트 비교
crewx query "@claude @gemini @copilot which approach is better?"
```

### 파일 작업
```bash
# 파일 생성
crewx execute "@claude create a login component"

# 파일 수정
crewx execute "@claude refactor authentication"

# 여러 작업
crewx execute "@claude create tests" "@gemini write docs"
```

### 복잡한 워크플로우
```bash
# 설계 → 구현 → 테스트
crewx query "@architect design user management" --thread "user-mgmt" && \
crewx execute "@backend implement it" --thread "user-mgmt" && \
crewx query "@tester create test plan" --thread "user-mgmt"

# 코드 리뷰 파이프라인
git diff | crewx query "@claude review these changes" | \
crewx execute "@refactor improve code quality"
```

### 모델 선택
```bash
# 다양한 작업을 위해 특정 모델 사용
crewx query "@claude:haiku quick analysis"           # 빠르고 간결함
crewx query "@claude:opus comprehensive review"      # 상세하고 철저함
crewx execute "@gemini:gemini-2.5-flash rapid prototyping"  # 빠른 실행
crewx execute "@gemini:gemini-2.5-pro production code"      # 높은 품질
```

### 원격 에이전트
```bash
# 원격 CrewX 인스턴스에 연결
crewx query "@remote_backend check API status"

# 프로젝트 전체에 작업 분산
crewx execute "@frontend_team create UI" "@backend_team create API"

# 다중 프로젝트 기능 조정
crewx query "@coordinator design cross-service authentication"

# 전문화된 리소스 접근
crewx execute "@ml_server train recommendation model"
```

[원격 에이전트 가이드](./remote-agents.md)에서 설정 및 구성을 참고하세요.

## 팁

1. **분석을 위해 `query` 사용** - 안전하고 읽기 전용이며 파일 변경 없음
2. **구현을 위해 `execute` 사용** - 파일을 수정하고 새로운 파일 생성 가능
3. **`--thread` 활용** - 명령어 전체에서 컨텍스트 유지
4. **에이전트 결합** - 다양한 AI 모델의 강점 활용
5. **복잡한 작업 파이프라인** - 다단계 워크플로우를 위해 명령어 연결
6. **`doctor`로 확인** - 작업 실행 전 문제 진단
7. **특정 모델 사용** - 작업 복잡도에 맞는 모델 선택
