# 문제 해결 가이드

CrewX 사용 중 발생할 수 있는 일반적인 문제와 해결 방법입니다.

## 설치 문제

### 명령어를 찾을 수 없음

**문제:** `crewx: command not found`

**해결책:**
```bash
# 전역으로 설치
npm install -g crewx

# 설치 확인
crewx --version

# PATH 확인
echo $PATH | grep npm
```

### 권한 오류 (macOS/Linux)

**문제:** 설치 중 권한이 거부됨

**해결책:**
```bash
# sudo 사용 (권장하지 않음)
sudo npm install -g crewx

# 더 나은 방법: npm 권한 수정
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# 그 후 설치
npm install -g crewx
```

## Windows 특정 문제

### PowerShell 실행 정책

**문제:** `'crewx' is not recognized as an internal or external command`

**원인:** PowerShell 실행 정책이 `npx` 스크립트를 차단합니다.

**해결책 1 (권장): cmd.exe 사용**

MCP 구성을 업데이트하세요:
```json
{
  "servers": {
    "crewx": {
      "command": "cmd.exe",
      "args": ["/c", "crewx", "mcp"],
      "env": {
        "CREWX_CONFIG": "${workspaceFolder}/crewx.yaml"
      }
    }
  }
}
```

**해결책 2: 실행 정책 변경 (관리자 권한 필요)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**해결책 3: 직접 Node 실행**
```bash
# 전역으로 설치
npm install -g crewx

# 설치 경로 찾기
npm root -g

# MCP 설정 업데이트
{
  "servers": {
    "crewx": {
      "command": "node",
      "args": ["C:\\Users\\YourName\\AppData\\Roaming\\npm\\node_modules\\crewx\\dist\\main.js", "mcp"]
    }
  }
}
```

## 설정 문제

### 설정 파일을 찾을 수 없음

**문제:** `Error: crewx.yaml not found` (또는 `agents.yaml not found`)

**해결책:**
```bash
# crewx.yaml 생성 (권장)
crewx init

# 파일 존재 확인
ls crewx.yaml

# MCP 설정이 올바른 경로를 가리키는지 확인
cat .vscode/mcp.json  # 또는 Claude Desktop 설정
```

> **참고:** `crewx.yaml` (권장) 및 `agents.yaml` (레거시)이 모두 지원됩니다.

### 잘못된 YAML 문법

**문제:** `Error: Invalid YAML syntax`

**해결책:**
```bash
# doctor를 실행하여 검증
crewx doctor

# 일반적인 YAML 오류:
# - 잘못된 들여쓰기 (탭 대신 공백 사용)
# - 특수 문자 주위에 따옴표 없음
# - 콜론 또는 대시 누락
```

**올바른 YAML:**
```yaml
agents:
  - id: "my_agent"         # ✓ 올바른 들여쓰기
    name: "My Agent"       # ✓ 문자열 주위의 따옴표
    provider: "cli/claude" # ✓ 올바른 네임스페이스 형식
```

**잘못된 YAML:**
```yaml
agents:
- id: my_agent         # ✗ 따옴표 없음 (특수 문자로 손상될 수 있음)
  name: My Agent       # ✗ 따옴표 없음
   provider: claude    # ✗ 잘못된 들여쓰기, 오래된 형식
```

## MCP 통합 문제

### MCP 서버가 시작되지 않음

**문제:** VS Code/Claude Desktop에서 MCP 서버가 시작되지 않음

**체크리스트:**
1. 지정된 경로에 `crewx.yaml` (또는 `agents.yaml`)이 존재하는지 확인
2. CrewX 설치 확인: `crewx --version`
3. MCP 설정 문법 검증 (유효한 JSON)
4. 환경 변수 `CREWX_CONFIG`가 설정되어 있는지 확인
5. 설정 변경 후 MCP 클라이언트 재시작

**디버깅:**
```bash
# MCP 서버를 수동으로 테스트
crewx mcp

# 오류 메시지 확인
# 설정 파일 경로가 올바른지 확인
cat $CREWX_CONFIG
```

### MCP 도구가 나타나지 않음

**문제:** CrewX 도구가 MCP 클라이언트에 표시되지 않음

**해결책:**
1. MCP 클라이언트 재시작 (VS Code, Claude Desktop 등)
2. MCP 클라이언트 로그에서 연결 오류 확인
3. `CREWX_CONFIG` 환경 변수 확인
4. 서버를 수동으로 테스트: `crewx mcp`

**VS Code 특정:**
```bash
# VS Code MCP 로그 확인
# View > Output > 드롭다운에서 "MCP" 선택
```

## AI 제공자 문제

### 제공자를 사용할 수 없음

**문제:** `Error: AI provider not available`

**해결책:**
```bash
# 제공자 상태 확인
crewx doctor

# CLI 도구 설치 확인
claude --version
gemini --version
gh copilot --version

# 누락된 도구 설치
npm install -g @anthropic/claude-code
npm install -g @google/generative-ai-cli
gh extension install github/gh-copilot
```

### 제공자 인증 실패

**문제:** AI 제공자의 인증 오류

**Claude Code:**
```bash
# 다시 인증
claude login

# 세션 확인
claude session
```

**Gemini CLI:**
```bash
# API 키 설정
export GOOGLE_API_KEY="your-api-key"

# 또는 설정
gemini config set apiKey YOUR_API_KEY
```

**Copilot CLI:**
```bash
# 다시 인증
gh auth login

# 확인
gh auth status
```

### 세션 한계 도달

**문제:** `Error: Session limit reached`

**해결책:**
```bash
# 세션 재설정 대기 (보통 5분)
# 또는 다른 제공자 사용

# 제공자 폴백 사용
crewx query "@flexible_agent your question"
# flexible_agent에서: provider: ["cli/claude", "cli/gemini", "cli/copilot"]
```

## 실행 문제

### 에이전트 실행 실패

**문제:** 에이전트 작업이 실패하거나 시간 초과됨

**진단:**
```bash
# doctor 실행
crewx doctor

# 작업 로그 확인
crewx logs <task-id>

# 에이전트 설정 확인
cat crewx.yaml
```

**일반적인 원인:**
1. 작업 디렉토리가 존재하지 않음
2. 잘못된 제공자 옵션
3. 복잡한 작업에 대해 너무 짧은 시간 제한
4. 제공자 세션 한계
5. **크로스 플랫폼 경로 문제** (OS 특정 절대 경로)

**해결책:**
```yaml
# 작업 디렉토리 수정
working_directory: "./src"  # 경로가 존재하는지 확인

# 시간 제한 조정
CODECREW_TIMEOUT_CLAUDE_EXECUTE=120000 crewx execute "@claude task"

# 제공자 폴백 사용
provider: ["cli/claude", "cli/gemini", "cli/copilot"]
```

### 크로스 플랫폼 경로 문제

**문제:** `ENOENT` 오류로 다른 운영 체제에서 에이전트가 실패함

**원인:** `crewx.yaml`의 하드코딩된 절대 경로가 특정 OS에서만 작동함

**예시 오류:**
```
ERROR: Process error: spawn C:\WINDOWS\system32\cmd.exe ENOENT
```

**잘못된 설정 (OS 특정):**
```yaml
agents:
  - id: "my_agent"
    working_directory: "/Users/username/project"  # ✗ macOS만 해당
    # 또는
    working_directory: "C:\\Users\\username\\project"  # ✗ Windows만 해당
```

**올바른 설정 (크로스 플랫폼):**
```yaml
agents:
  - id: "my_agent"
    # 옵션 1: 상대 경로 사용 (권장)
    working_directory: "."

    # 옵션 2: working_directory 생략 (현재 디렉토리 사용)
    # working_directory 미지정 = 현재 디렉토리

    # 옵션 3: 환경 변수 사용
    working_directory: "${PROJECT_ROOT}/src"
```

**빠른 수정:**
1. `crewx.yaml` 편집
2. 절대 경로를 상대 경로로 변경 (`.`, `./src` 등)
3. 또는 현재 디렉토리를 사용하도록 `working_directory` 제거
4. 테스트: `crewx query "@agent hello"`

**디버깅:**
```bash
# 에이전트 설정 확인
cat crewx.yaml | grep -A 3 "working_directory"

# 에이전트 테스트
crewx query "@agent test query"

# 경로 오류에 대한 로그 확인
cat .crewx/logs/*.log | grep -i "enoent\|working"
```

### 시간 제한 오류

**문제:** 작업이 완료되기 전에 시간 초과

**해결책:**
```bash
# 환경 변수를 통해 시간 제한 증가
export CODECREW_TIMEOUT_CLAUDE_QUERY=1800000  # 30분
export CODECREW_TIMEOUT_GEMINI_EXECUTE=2400000  # 40분

# 또는 인라인
CODECREW_TIMEOUT_CLAUDE_QUERY=1800000 crewx query "@claude complex task"
```

**사용 가능한 시간 제한 변수:**
```bash
CODECREW_TIMEOUT_CLAUDE_QUERY=600000
CODECREW_TIMEOUT_CLAUDE_EXECUTE=45000
CODECREW_TIMEOUT_GEMINI_QUERY=600000
CODECREW_TIMEOUT_GEMINI_EXECUTE=1200000
CODECREW_TIMEOUT_COPILOT_QUERY=600000
CODECREW_TIMEOUT_COPILOT_EXECUTE=1200000
CODECREW_TIMEOUT_PARALLEL=300000
```

### 파이프라인 실패

**문제:** 파이프 명령이 실패하거나 컨텍스트를 잃음

**해결책:**
```bash
# 각 단계가 성공적으로 완료되도록 보장
crewx query "@claude design" && \
crewx execute "@gemini implement"

# 파이프라인 출력 확인
crewx query "@claude design" | tee design.txt | \
crewx execute "@gemini implement"

# 대신 스레드를 사용하여 컨텍스트 유지
crewx query "@claude design" --thread "project"
crewx execute "@gemini implement" --thread "project"
```

## 스레드/대화 문제

### 스레드를 찾을 수 없음

**문제:** `Error: Thread not found`

**해결책:**
```bash
# 기존 스레드 확인
ls .crewx/conversations/

# 새 스레드 생성
crewx query "@claude start" --thread "new-thread"

# 스레드 이름은 대소문자를 구분
crewx query "@claude continue" --thread "auth-feature"  # 올바름
crewx query "@claude continue" --thread "Auth-Feature"  # 다른 스레드
```

### 컨텍스트가 보존되지 않음

**문제:** 에이전트가 이전 대화를 기억하지 못함

**해결책:**
```bash
# 동일한 스레드 이름 사용 확인
crewx query "@claude design" --thread "myproject"
crewx query "@claude refine" --thread "myproject"  # 동일한 이름

# 스레드 파일이 존재하는지 확인
cat .crewx/conversations/myproject.json

# 스레드는 에이전트별
crewx query "@claude talk" --thread "chat"     # Claude의 스레드
crewx query "@gemini talk" --thread "chat"     # 다름 (Gemini의 스레드)
```

## Slack 통합 문제

### Slack 봇이 응답하지 않음

**문제:** 봇이 메시지에 응답하지 않음

**체크리스트:**
1. `.env.slack`에서 환경 변수 확인
2. 봇 토큰 권한 확인 (chat:write, app_mentions:read 등)
3. 봇이 채널에 초대되었는지 확인
4. 소켓 모드가 활성화되어 있는지 확인

**해결책:**
```bash
# .env.slack 확인
cat .env.slack

# 필수 변수:
# SLACK_BOT_TOKEN=xoxb-...
# SLACK_APP_TOKEN=xapp-...
# SLACK_SIGNING_SECRET=...

# 봇 재시작
npm run start:slack
```

### Slack 실행 모드가 작동하지 않음

**문제:** Slack에서 에이전트 실행 명령이 실패함

**원인:** Slack 봇 시작 시 `--mode execute` 플래그 누락

**해결책:**
```bash
# 실행 모드를 활성화하여 Slack 봇 시작
npm run start:slack -- --mode execute

# 또는 node 직접 사용
node dist/main.js slack --mode execute
```

**이런 일이 발생하는 이유:**
- `--mode execute` 없으면 Slack 봇은 쿼리 작업만 처리
- 실행 명령 (`@agent do something`)은 명시적 실행 모드 필요
- 이는 무단 코드 실행을 방지하는 보안 기능

**확인:**
```bash
# 봇이 실행 모드로 실행 중인지 확인
# 봇 시작 메시지에 다음이 표시되어야 함: "Slack bot started in execute mode"
```

### Slack 메시지가 너무 큼

**문제:** `invalid_blocks` 오류

**해결책:**
```bash
# 최대 응답 길이 감소
echo "SLACK_MAX_RESPONSE_LENGTH=200000" >> .env.slack

# 봇 재시작
npm run start:slack
```

## 성능 문제

### 느린 응답

**문제:** 쿼리가 응답하는 데 너무 오래 걸림

**최적화:**
```bash
# 더 빠른 모델 사용
crewx query "@claude:haiku quick question"
crewx query "@gemini:gemini-2.5-flash fast task"

# 컨텍스트 크기 감소
# crewx.yaml에서 --add-dir 범위 제한
options:
  query:
    - "--add-dir=./src/specific-module"  # "." 대신

# 병렬 실행 사용
crewx query "@claude task1" "@gemini task2"  # 병렬
```

### 높은 메모리 사용

**문제:** CrewX가 너무 많은 메모리를 사용함

**해결책:**
```bash
# 문서에 지연 로딩 사용
# documents.yaml에서:
documents:
  large-doc:
    path: "docs/large.md"
    lazy: true  # 필요할 때만 로드

# 대화 기록 제한
# 오래된 스레드 삭제
rm .crewx/conversations/old-thread.json

# 오래된 로그 삭제
crewx clear-logs
```

## 디버깅

### 디버그 로깅 활성화

```bash
# 디버그 환경 변수 설정
export DEBUG=crewx:*

# 상세 출력으로 실행
crewx query "@claude test" --verbose

# 로그 확인
cat .crewx/logs/*.log
```

### 시스템 상태 확인

```bash
# 포괄적인 상태 검사
crewx doctor

# 제공자 가용성 확인
crewx query "@claude hello"
crewx query "@gemini hello"
crewx query "@copilot hello"

# 설정 확인
cat agents.yaml
```

### 작업 로그 가져오기

```bash
# 특정 작업 보기
crewx logs <task-id>

# 모든 최근 작업 보기
crewx logs

# 이전 출력에서 작업 ID 찾기
# 찾는 항목: "Task ID: abc123"
```

## 도움말 받기

문제가 계속되면:

1. **진단 실행:**
   ```bash
   crewx doctor
   ```

2. **로그 확인:**
   ```bash
   ls .crewx/logs/
   cat .crewx/logs/latest.log
   ```

3. **설정 확인:**
   ```bash
   cat crewx.yaml  # 또는 agents.yaml
   crewx init --force  # 기본값으로 재설정
   ```

4. **제공자 개별 테스트:**
   ```bash
   claude "hello"
   gemini -p "hello"
   gh copilot suggest "hello"
   ```

5. **문제 보고:**
   - GitHub: https://github.com/sowonlabs/crewx/issues
   - 포함: 오류 메시지, `crewx doctor` 출력, 로그

## 일반적인 오류 메시지

| 오류 | 원인 | 해결책 |
|-------|-------|----------|
| `crewx.yaml not found` | 설정 누락 | `crewx init` 실행 |
| `Provider not available` | CLI 도구 미설치 | 제공자 CLI 설치 |
| `Session limit reached` | 요청이 너무 많음 | 대기 또는 다른 제공자 사용 |
| `Timeout exceeded` | 작업이 너무 복잡함 | 환경 변수를 통해 시간 제한 증가 |
| `Invalid YAML syntax` | 잘못된 설정 | `crewx doctor` 실행 |
| `Thread not found` | 잘못된 스레드 이름 | `.crewx/conversations/` 확인 |
| `Permission denied` | 파일/디렉토리 접근 | 작업 디렉토리 권한 확인 |
