# Slack 앱 설치 가이드

CrewX Slack 봇을 워크스페이스에 연결하기 위한 단계별 지침입니다.

## 📋 개요

통합을 위해 3개의 Slack 자격증명이 필요합니다. Slack 앱을 생성한 후 다음을 수집하여 안전하게 보관하세요:

1. **Bot User OAuth Token** (`xoxb-…`)
2. **App-Level Token** (`xapp-…`)
3. **Signing Secret**

---

## ⚡ 빠른 설정 (매니페스트 사용)

범위와 이벤트를 수동으로 구성하고 싶지 않다면 이 저장소에 포함된 매니페스트를 가져올 수 있습니다.

1. [Slack 앱 대시보드](https://api.slack.com/apps)로 이동합니다.
2. **Create New App → From an app manifest**를 선택합니다.
3. 워크스페이스를 선택하고 프로젝트 루트의 `slack-app-manifest.yaml` 내용을 붙여넣습니다.
4. 요약을 검토하고 **Create**를 클릭합니다. 필요한 모든 범위, 이벤트 및 Socket Mode 설정이 미리 구성됩니다.
5. 아래 섹션을 계속 진행하여 토큰을 발급하고 환경 변수를 구성합니다.

> 매니페스트에는 OAuth 범위, 이벤트 구독 및 Socket Mode 구성이 포함되어 있으므로 원하는 경우 수동 설정 단계를 건너뛸 수 있습니다.

---

## 🚀 단계별 설정

### 단계 1: Slack 앱 생성

1. [https://api.slack.com/apps](https://api.slack.com/apps)를 방문합니다.
2. **Create New App**을 클릭합니다.
3. **From scratch**를 선택합니다.
4. 앱 이름으로 `CrewX`를 입력합니다.
5. 대상 워크스페이스를 선택합니다.
6. **Create App**을 클릭합니다.

---

### 단계 2: Bot Token 범위 추가 ⚡

> **중요:** 앱을 설치하고 토큰을 받기 전에 범위를 구성해야 합니다.

1. 왼쪽 사이드바에서 **OAuth & Permissions**를 엽니다.
2. **Scopes** 섹션으로 스크롤합니다.
3. **Bot Token Scopes** 아래에서 **Add an OAuth Scope**를 클릭합니다.
4. 다음 범위를 각각 추가합니다:

   | 범위 | 목적 |
   |-------|---------|
   | `app_mentions:read` | 봇이 언급될 때 메시지 읽기 |
   | `chat:write` | 봇으로 메시지 전송 |
   | `channels:history` | 채널 메시지 읽기 (스레드 기록) |
   | `channels:read` | 채널 메타데이터 보기 |
   | `reactions:write` | 이모지 반응 추가 (봇 상태 표시기) |
   | `reactions:read` | 기존 반응 읽기 |
   | `im:history` | 다이렉트 메시지 기록 읽기 |
   | `groups:history` | 비공개 채널 기록 읽기 (선택사항) |

✅ 계속하기 전에 모든 범위가 추가되었는지 확인하세요.

> **반응이 필요한 이유는?**
> 봇은 요청을 처리하는 동안 👀로 반응하고, 성공할 때 ✅로, 오류가 발생할 때 ❌로 반응합니다. 이를 통해 채널에서 한눈에 상태 업데이트를 볼 수 있습니다.

> **기록 범위가 필요한 이유는?**
> `channels:history`는 스레드 컨텍스트를 재구성하는 데 필요합니다. `im:history`는 다이렉트 메시지 내에서 동일한 동작을 활성화합니다.

---

### 단계 3: Socket Mode 활성화 🔌

1. 사이드바에서 **Socket Mode**를 엽니다.
2. **Enable Socket Mode**를 **On**으로 토글합니다.
3. 프롬프트가 나타나면:
   - 토큰 이름으로 `crewx-socket`을 입력합니다.
   - **Add Scope**를 클릭하고 `connections:write`를 선택한 후 **Generate**를 클릭합니다.
4. 생성된 App-Level Token (`xapp-…`)을 복사하여 안전하게 보관합니다.
   > 나중에 다시 볼 수 없습니다.

```
예시: xapp-1-A01234567-1234567890123-abcdefghijklmnop
```

---

### 단계 4: 이벤트 구독 구성 📡

1. 사이드바에서 **Event Subscriptions**를 엽니다.
2. **Enable Events**를 **On**으로 토글합니다.
3. **Subscribe to bot events**로 스크롤하고 **Add Bot User Event**를 클릭합니다.
4. 다음 이벤트를 추가합니다:

   | 이벤트 | 목적 |
   |-------|---------|
   | `app_mention` | 누군가 @crewx를 언급할 때 트리거 |
   | `message.channels` | 채널 메시지 수신 (선택사항) |

5. **Save Changes**를 클릭합니다.

---

### 단계 5: 앱을 워크스페이스에 설치 🏢

1. 사이드바에서 **Install App**을 엽니다.
2. **Install to Workspace**를 클릭합니다.
3. 요청된 권한 (메시지 액세스, 채널 정보, 메시지 전송)을 검토합니다.
4. **Allow**를 클릭합니다.
5. 설치 후 표시되는 Bot User OAuth Token (`xoxb-…`)을 복사합니다.

```
예시: xoxb-XXXXXXXXXXXX-XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXX
```

---

### 단계 6: Signing Secret 수집 🔐

1. **Basic Information**으로 이동합니다.
2. **App Credentials** 아래에서 **Signing Secret**을 찾습니다.
3. **Show**를 클릭하고 값을 복사하여 비밀 관리자에 저장합니다.

> 3개 모두의 자격증명 (`xoxb`, `xapp`, `Signing Secret`)을 보관하세요. 곧 로컬 환경 파일에 저장됩니다.

---

## 🧾 환경 변수

프로젝트 루트에 `.env.slack` 파일을 생성합니다:

```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token
SLACK_APP_TOKEN=xapp-your-app-level-token
SLACK_SIGNING_SECRET=your-signing-secret

# 선택적 설정
SLACK_LOG_LEVEL=info
SLACK_MAX_RESPONSE_LENGTH=400000
```

> 이 파일을 소스 제어에 커밋하지 마세요.

---

## 🚀 봇 실행

환경 변수가 준비되면 Slack 봇을 시작합니다:

```bash
# 한 번 빌드합니다 (아직 하지 않았다면)
npm run build

# 기본값: Claude 에이전트를 사용한 쿼리 전용 모드
source .env.slack && crewx slack

# 에이전트가 실행 작업을 수행하도록 허용 (파일 변경, 마이그레이션 등)
source .env.slack && crewx slack --mode execute

# Mention-Only 모드: @멘션했을 때만 봇이 응답
source .env.slack && crewx slack --mention-only

# 기본 에이전트 전환
source .env.slack && crewx slack --agent gemini
source .env.slack && crewx slack --agent copilot

# 상세 로깅 활성화
source .env.slack && crewx slack --log
source .env.slack && crewx slack --agent gemini --log
```

다음이 표시됩니다:

```
⚡️ CrewX Slack Bot is running!
📱 Socket Mode: Enabled
🤖 Using default agent for Slack: claude
⚙️  Slack bot mode: query
```

---

## 🎯 Mention-Only 모드

기본적으로 CrewX Slack Bot은 초대된 채널의 모든 메시지에 응답합니다. **Mention-Only 모드**는 명시적으로 @멘션했을 때만 봇이 응답하도록 동작을 변경합니다.

### Mention-Only 모드 사용 시기

**Mention-Only를 사용해야 할 때:**
- 봇이 모든 메시지에 AI 응답이 필요하지 않은 바쁜 채널에 있을 때
- 노이즈와 토큰 사용량을 줄이고 싶을 때
- 팀이 옵트인 AI 지원을 선호할 때
- 봇이 다른 봇이나 워크플로우와 공간을 공유할 때

**기본 모드를 사용해야 할 때:**
- 전용 AI 지원 채널
- AI 컨텍스트가 항상 유용한 소규모 팀 채널
- 원활하고 항상 사용 가능한 AI 지원을 원할 때

### 작동 방식

**기본 모드 (항상 듣기):**
```
사용자: "인증을 어떻게 구현하나요?"
봇: 🤖 [자동으로 응답]
```

**Mention-Only 모드:**
```
사용자: "인증을 어떻게 구현하나요?"
봇: [응답 없음]

사용자: "@crewx 인증을 어떻게 구현하나요?"
봇: 🤖 [멘션했을 때 응답]
```

### Mention-Only 모드로 시작하기

```bash
# Mention-only로 쿼리 모드
source .env.slack && crewx slack --mention-only

# Mention-only로 실행 모드
source .env.slack && crewx slack --mode execute --mention-only

# 특정 에이전트와 함께
source .env.slack && crewx slack --agent gemini --mention-only
```

### 다이렉트 메시지 (DM)

Mention-Only 모드는 다이렉트 메시지에 **영향을 주지 않습니다**. 봇은 이 설정과 관계없이 항상 DM에 응답합니다:

```
# 두 모드 모두에서 DM은 항상 작동
[@crewx에게 다이렉트 메시지]
사용자: "이 오류를 디버그하는 데 도움을 줘"
봇: 🤖 [DM에서 항상 응답]
```

### 비교표

| 기능 | 기본 모드 | Mention-Only 모드 |
|------|-----------|-------------------|
| 채널 메시지 | 모든 메시지 | @멘션만 |
| 스레드 답변 | 스레드의 모든 메시지 | @멘션했을 때만 |
| 다이렉트 메시지 | ✅ 응답 | ✅ 응답 |
| 토큰 사용량 | 높음 (모든 메시지) | 낮음 (옵트인만) |
| 최적 사용처 | 전용 AI 채널 | 바쁜 다목적 채널 |

### 팁

1. **워크스페이스별로 모드 선택** - 서로 다른 Slack 워크스페이스에는 서로 다른 모드가 필요할 수 있습니다
2. **채널과 결합** - `#ai-help` 채널에서는 기본 모드 사용, `#general`에서는 mention-only 사용
3. **팀 선호도** - 팀에게 어떤 모드를 선호하는지 물어보세요
4. **둘 다 테스트** - 각 모드를 시도하여 워크플로우에 맞는 것을 확인하세요

---

## 🧪 빠른 테스트 체크리스트

1. 채널에 봇을 초대합니다:
   ```
   /invite @crewx
   ```
2. 메시지를 보냅니다:
   ```
   @crewx Hello! What can you help me with?
   ```
3. 봇이 스레드에서 응답합니다 ✔️

---

## ❓ 문제 해결

### 봇이 응답하지 않음

1. 봇이 채널에 초대되었는지 확인합니다 (`/invite @crewx`).
2. 3개 모두의 토큰을 확인하고 앞뒤 공백이 없는지 확인합니다.
3. Socket Mode가 [https://api.slack.com/apps](https://api.slack.com/apps)에서 활성화되어 있는지 확인합니다.
4. `app_mention` 및 기타 필수 이벤트가 구독되어 있는지 확인합니다.

### "Missing Scope" 오류

봇에 권한이 없습니다. **단계 2**로 돌아가 모든 범위가 있는지 확인합니다:

- `app_mentions:read`
- `chat:write`
- `channels:history`
- `channels:read`
- `reactions:write`
- `reactions:read`
- `im:history`
- `groups:history` (선택사항)

범위를 추가한 후 앱을 다시 설치합니다:

1. **OAuth & Permissions**을 엽니다.
2. **Install App** → **Reinstall to Workspace**를 클릭합니다.
3. 업데이트된 범위 목록을 승인합니다.

### 스레드 컨텍스트가 없음

- 기록 범위 (`channels:history`, `im:history`)가 있는지 확인합니다.
- 새 범위를 추가한 후 앱을 다시 설치하여 권한 부여를 새로 고칩니다.

### 상세 로그 보기

```bash
source .env.slack && crewx slack --log-level debug
```

---

## 📚 다음 단계

- [Slack Bot 사용 가이드](./README_SLACK_BOT.md)
- [고급 구성](./SLACK_BOT_SETUP.md)
- [에이전트 커스터마이징](./crewx.yaml)

---

## 🔒 보안 주의사항

- `.env.slack`을 소스 제어에 커밋하지 마세요.
- 공개 채널이나 저장소에서 토큰을 공유하지 마세요.
- 자격증명이 유출된 경우 [https://api.slack.com/apps](https://api.slack.com/apps)에서 즉시 로테이션합니다.

---

**모두 완료되었습니다!** 🎉 CrewX는 Slack 내에서 작동할 준비가 되었습니다.
