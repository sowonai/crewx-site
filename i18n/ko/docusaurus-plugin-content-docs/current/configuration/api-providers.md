# API Provider 설정

:::info 0.6.0의 새 기능
API Provider 지원으로 AI 제공자 API와 직접 통합이 가능해져, 향상된 도구 호출 기능과 더욱 유연한 배포 옵션을 제공합니다.
:::

## 개요

CrewX는 두 가지 유형의 AI 제공자를 지원합니다:

1. **CLI Providers** (`cli/*`) - 내장 커맨드 라인 도구 (Claude Code, Gemini CLI, Copilot CLI)
2. **API Providers** (`api/*`) - AI 서비스와의 직접 API 통합 (0.6.0의 새 기능)

이 가이드는 AI 제공자 API에 직접 연결하는 **API Providers**를 다룹니다.

## 지원되는 API Provider

### 현재 사용 가능

| 제공자 | 네임스페이스 | 설명 | 도구 호출 |
|--------|-------------|------|-----------|
| **OpenAI** | `api/openai` | GPT-4, GPT-3.5 및 기타 OpenAI 모델 | ✅ 지원됨 |
| **OpenRouter** | `api/openai` | OpenRouter를 통한 여러 모델 액세스 | ✅ 지원됨 |
| **Anthropic** | `api/anthropic` | Claude 3.5 Sonnet, Opus, Haiku | ✅ 지원됨 |
| **Ollama** | `api/ollama` | 로컬 LLM 런타임 (Llama, Mistral 등) | ✅ 지원됨 |

### 출시 예정

| 제공자 | 네임스페이스 | 상태 |
|--------|-------------|------|
| **Google AI** | `api/google` | 🚧 계획 중 |
| **AWS Bedrock** | `api/bedrock` | 🚧 계획 중 |
| **LiteLLM** | `api/litellm` | 🚧 계획 중 |

## API Provider vs CLI Provider

### 주요 차이점

| 기능 | API Provider | CLI Provider |
|------|--------------|--------------|
| **통합 방식** | 직접 API 호출 | 외부 CLI 도구 |
| **도구 호출** | 네이티브 함수 호출 | CLI 도구 실행 |
| **설정** | API 키만 필요 | CLI 설치 + 인증 |
| **성능** | 빠른 직접 연결 | 서브프로세스 오버헤드 |
| **오프라인** | 인터넷 필요 (Ollama 제외) | 제공자에 따라 다름 |
| **비용** | API 사용량 | 구독료 |

### API Provider를 사용해야 하는 경우

**API Provider 사용 권장:**
- AI 모델과의 네이티브 도구 호출이 필요한 경우
- 모델 파라미터에 대한 세밀한 제어가 필요한 경우
- CLI 의존성 없이 가벼운 배포를 선호하는 경우
- 로컬 모델을 사용하려는 경우 (Ollama)
- 더 빠른 응답 시간이 필요한 경우

**CLI Provider 사용 권장:**
- 고급 IDE 기능이 필요한 경우 (Claude Code, Copilot)
- 관리되는 인증 플로우를 선호하는 경우
- 풍부한 터미널 상호작용이 필요한 경우
- 이미 CLI 도구가 구성되어 있는 경우

## 설정

### 기본 설정

`crewx.yaml` 파일에 API Provider 에이전트를 생성합니다:

```yaml
agents:
  - id: "gpt_assistant"
    name: "GPT-4 도우미"
    provider: "api/openai"
    model: "gpt-4o"
    temperature: 0.7
    maxTokens: 2000
    inline:
      prompt: |
        당신은 GPT-4로 구동되는 유용한 AI 도우미입니다.
        명확하고 간결하며 정확한 답변을 제공하세요.
```

### 제공자별 설정

#### OpenAI / OpenRouter

```yaml
agents:
  - id: "gpt_assistant"
    provider: "api/openai"
    model: "gpt-4o"              # GPT-4, GPT-3.5 등
    temperature: 0.7
    maxTokens: 2000
    inline:
      prompt: |
        당신은 GPT-4 도우미입니다.
```

**환경 변수:**
```bash
export OPENAI_API_KEY=sk-...
```

**OpenRouter 사용 시:**
```bash
export OPENAI_API_KEY=sk-or-v1-...  # OpenRouter API 키
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
        당신은 Anthropic이 만든 AI 도우미 Claude입니다.
        사려 깊은 분석과 명확한 의사소통에 능숙합니다.
```

**환경 변수:**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
```

**사용 가능한 모델:**
- `claude-3-5-sonnet-20241022` - 가장 능력이 뛰어나고 균형 잡힘
- `claude-3-opus-20240229` - 최고 수준의 지능
- `claude-3-haiku-20240307` - 가장 빠르고 저렴함

#### Ollama (로컬 모델)

```yaml
agents:
  - id: "local_llama"
    provider: "api/ollama"
    url: "http://localhost:11434/v1"
    model: "llama3.2"
    temperature: 0.8
    inline:
      prompt: |
        당신은 로컬에서 실행되는 AI 도우미입니다.
        외부 API 호출이 없습니다.
```

**사전 요구사항:**
1. Ollama 설치: https://ollama.ai
2. 모델 다운로드: `ollama pull llama3.2`
3. Ollama 서버 시작 (보통 자동 시작됨)

**사용 가능한 모델:**
- `llama3.2` - Meta의 Llama 3.2
- `mistral` - Mistral 7B
- `codellama` - 코드 특화 Llama
- 전체 목록: `ollama list`

### 고급 설정

#### 환경 변수 사용

```yaml
agents:
  - id: "dynamic_assistant"
    provider: "api/{{env.AI_PROVIDER}}"
    model: "{{env.MODEL_NAME}}"
    temperature: 0.7
    inline:
      prompt: |
        당신은 유용한 도우미입니다.
```

```bash
export AI_PROVIDER=openai
export MODEL_NAME=gpt-4o
```

#### Inline 설정 우선순위

```yaml
agents:
  - id: "custom_assistant"
    provider: "api/openai"         # 루트 레벨 provider
    model: "gpt-3.5-turbo"         # 루트 레벨 model
    inline:
      provider: "api/anthropic"    # Inline이 루트를 재정의
      model: "claude-3-5-sonnet-20241022"
      prompt: |
        Inline 설정이 우선순위를 갖습니다.
```

**우선순위:** `inline` > 루트 레벨 필드

## 도구 호출 (Tool Calling)

API Provider는 네이티브 함수 호출을 지원하여 에이전트가 도구를 직접 사용할 수 있습니다.

### 내장 도구

CrewX는 API Provider를 위한 6가지 내장 도구를 제공합니다:

| 도구 | 설명 | 모드 |
|------|------|------|
| `read_file` | 파일 내용 읽기 | Query, Execute |
| `write_file` | 파일 내용 쓰기 | Execute만 |
| `replace` | 파일의 텍스트 교체 | Execute만 |
| `grep` | 파일에서 패턴 검색 | Query, Execute |
| `ls` | 디렉토리 내용 목록 | Query, Execute |
| `run_shell_command` | 셸 명령 실행 | Execute만 |

### 도구 활성화

```yaml
agents:
  - id: "research_agent"
    provider: "api/openai"
    model: "gpt-4o"
    tools: [read_file, grep, ls]  # 특정 도구 활성화
    inline:
      prompt: |
        당신은 파일 읽기 기능을 가진 연구 에이전트입니다.
        제공된 도구를 사용하여 코드베이스를 분석하세요.
```

### Query Mode vs Execute Mode

**Query Mode** (읽기 전용):
- 도구: `read_file`, `grep`, `ls`
- 분석 및 검색에 안전
- 파일 수정 불가

```bash
crewx query "@research_agent 이 코드베이스를 분석해줘"
```

**Execute Mode** (파일 작업):
- 도구: `write_file`, `replace`, `run_shell_command`를 포함한 모든 6가지 도구
- 파일 생성, 수정, 삭제 가능
- 셸 명령 실행 가능

```bash
crewx execute "@research_agent 이 모듈을 리팩토링해줘"
```

### 도구 호출 예제

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
        당신은 {{vars.company_name}}의 코드 도우미입니다.

        사용 가능한 도구:
        - read_file: 소스 파일 읽기
        - write_file: 새 파일 생성
        - replace: 코드 리팩토링
        - grep: 코드베이스 검색

        이 도구들을 사용하여 개발 작업을 도와주세요.
```

**사용법:**
```bash
crewx execute "@code_assistant utils/api.ts에 에러 처리 추가해줘"
```

에이전트가 할 수 있는 작업:
1. `read_file`로 `utils/api.ts` 분석
2. `replace`로 try-catch 블록 추가
3. `write_file`로 테스트 파일 생성

## 전체 예제

### 풀스택 개발팀

```yaml
agents:
  # 프론트엔드 전문가
  - id: "frontend_dev"
    name: "React 전문가"
    provider: "api/anthropic"
    model: "claude-3-5-sonnet-20241022"
    temperature: 0.7
    tools: [read_file, write_file, replace, grep]
    working_directory: "./src/frontend"
    inline:
      prompt: |
        당신은 시니어 React 개발자입니다.

        전문 분야:
        - TypeScript를 사용한 React 18+
        - 컴포넌트 디자인 패턴
        - 상태 관리 (Redux, Zustand)
        - 성능 최적화

        도구를 사용하여 React 컴포넌트를 읽고, 수정하고, 생성하세요.

  # 백엔드 전문가
  - id: "backend_dev"
    name: "Node.js 전문가"
    provider: "api/openai"
    model: "gpt-4o"
    temperature: 0.7
    tools: [read_file, write_file, grep, ls]
    working_directory: "./src/backend"
    inline:
      prompt: |
        당신은 백엔드 엔지니어링 전문가입니다.

        전문 분야:
        - RESTful API 설계
        - 데이터베이스 최적화
        - 인증 및 권한 부여
        - 마이크로서비스 아키텍처

        도구를 사용하여 백엔드 서비스를 분석하고 구현하세요.

  # 로컬 코드 리뷰어
  - id: "code_reviewer"
    name: "코드 리뷰어"
    provider: "api/ollama"
    url: "http://localhost:11434/v1"
    model: "codellama"
    temperature: 0.3
    tools: [read_file, grep, ls]
    inline:
      prompt: |
        당신은 코드 리뷰 전문가입니다.

        집중 영역:
        - 코드 품질 및 모범 사례
        - 보안 취약점
        - 성능 이슈
        - 문서 완성도

        도구를 사용하여 코드를 분석하고 피드백을 제공하세요.
```

**사용법:**
```bash
# 프론트엔드 개발
crewx execute "@frontend_dev 새로운 사용자 프로필 컴포넌트 만들어줘"

# 백엔드 API
crewx execute "@backend_dev 인증 미들웨어 추가해줘"

# 코드 리뷰 (로컬)
crewx query "@code_reviewer 인증 모듈을 리뷰해줘"
```

## 환경 변수 참조

### OpenAI / OpenRouter

```bash
# 필수
export OPENAI_API_KEY=sk-...

# 선택 (커스텀 엔드포인트용)
export OPENAI_BASE_URL=https://api.openai.com/v1
export OPENAI_ORG_ID=org-...
```

### Anthropic

```bash
# 필수
export ANTHROPIC_API_KEY=sk-ant-...

# 선택
export ANTHROPIC_BASE_URL=https://api.anthropic.com
```

### Ollama

```bash
# 선택 (기본값: http://localhost:11434/v1)
export OLLAMA_BASE_URL=http://localhost:11434/v1
```

### Google AI (출시 예정)

```bash
export GOOGLE_API_KEY=...
export GOOGLE_PROJECT_ID=...
```

### AWS Bedrock (출시 예정)

```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=us-east-1
```

## 검증

API Provider 설정을 확인하세요:

```bash
crewx doctor
```

다음을 검증합니다:
- ✅ API Provider 자격 증명
- ✅ 모델 가용성
- ✅ 도구 설정
- ✅ 환경 변수
- ✅ 네트워크 연결 (API Provider용)

## 모범 사례

### 1. 적합한 Provider 선택

**프로덕션용:**
- 복잡한 추론과 분석에는 **Anthropic** 사용
- 범용 작업에는 **OpenAI** 사용
- 비용 최적화와 모델 다양성에는 **OpenRouter** 사용

**개발용:**
- 빠른 로컬 반복에는 **Ollama** 사용
- GPT 모델 테스트에는 **OpenAI** 사용

### 2. 도구 적절히 설정

**Query Mode (안전):**
```yaml
# 분석을 위한 읽기 전용 도구
tools: [read_file, grep, ls]
```

**Execute Mode (주의):**
```yaml
# 자동화를 위한 모든 도구
tools: [read_file, write_file, replace, grep, ls, run_shell_command]
```

### 3. Temperature 현명하게 설정

- **0.0-0.3**: 결정론적, 일관성 (코드 생성, 리팩토링)
- **0.5-0.7**: 균형 잡힌 (일반 개발 작업)
- **0.8-1.0**: 창의적 (브레인스토밍, 문서화)

### 4. 작업 디렉토리 사용

에이전트 범위를 관련 디렉토리로 제한:
```yaml
working_directory: "./src/specific-module"
```

### 5. 토큰 사용 최적화

```yaml
maxTokens: 2000  # 짧은 응답용
maxTokens: 4000  # 상세 분석용
maxTokens: 8000  # 복잡한 리팩토링용
```

### 6. API 키 보안

**API 키를 절대 버전 관리에 커밋하지 마세요.**

환경 변수 또는 `.env` 파일 사용:
```bash
# .env (.gitignore에 추가)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 문제 해결

### API Provider가 작동하지 않음

```bash
# Provider 상태 확인
crewx doctor

# API 키 확인
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

# 연결 테스트
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

### 도구 호출 실패

**문제:** 에이전트가 도구를 사용하지 않음

**해결책:**
1. 설정에서 도구가 활성화되었는지 확인
2. 모델이 함수 호출을 지원하는지 확인 (GPT-4, Claude 3+)
3. 모드 확인 (query vs execute)

**문제:** 권한 오류

**해결책:**
- 쓰기 작업에는 `execute` 모드 사용
- 작업 디렉토리 권한 확인
- 파일 경로가 올바른지 확인

### Ollama 연결 문제

```bash
# Ollama가 실행 중인지 확인
ollama list

# 서버 URL 확인
curl http://localhost:11434/api/tags

# 모델이 다운로드되었는지 확인
ollama pull llama3.2
```

## CLI Provider에서 마이그레이션

### 이전 (CLI Provider)

```yaml
agents:
  - id: "claude_dev"
    provider: "cli/claude"
    inline:
      prompt: "당신은 개발자 도우미입니다."
```

### 이후 (API Provider)

```yaml
agents:
  - id: "claude_dev"
    provider: "api/anthropic"
    model: "claude-3-5-sonnet-20241022"
    tools: [read_file, write_file, grep, ls]
    inline:
      prompt: "당신은 개발자 도우미입니다."
```

**장점:**
- ✅ CLI 설치 불필요
- ✅ 네이티브 도구 호출
- ✅ 더 빠른 시작 시간
- ✅ 더 많은 설정 옵션

## 다음 단계

- [에이전트 설정 가이드](./agents.md) - 에이전트 설정 배우기
- [템플릿 시스템](../advanced/templates.md) - 동적 프롬프트 템플릿
- [레이아웃 시스템](../advanced/layouts.md) - 재사용 가능한 프롬프트 레이아웃
