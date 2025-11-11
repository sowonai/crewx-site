# MCP 통합 가이드

CrewX는 IDE 통합과 AI CLI 도구를 위한 MCP (모델 컨텍스트 프로토콜) 서버로 사용할 수 있습니다.

## MCP 서버 모드

MCP 서버를 시작합니다:

```bash
crewx mcp
```

이는 CrewX를 VS Code, Claude Desktop, Cursor 같은 MCP 호환 클라이언트에서 사용할 수 있도록 활성화합니다.

## MCP 통합 상태

CrewX는 다양한 AI 도구와 MCP 서버로 작동합니다:

| AI 도구 | MCP 지원 | 상태 | 비고 |
|---------|---------|------|------|
| **Claude CLI** | ✅ 완전 지원 | 작동 중 | `claude mcp add`를 통한 사용자 수준 등록 |
| **Gemini CLI** | ✅ 완전 지원 | 작동 중 | `prompts/list` 핸들러 필요 (구현됨) |
| **Copilot CLI** | ❌ 제한됨 | 작동 안 함 | MCP가 CLI 모드에서 불안정, VS Code에서만 작동 |

## IDE 통합

### VS Code MCP 확장

프로젝트에서 `.vscode/mcp.json`을 생성합니다:

**Windows (권장):**
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

**macOS/Linux:**
```json
{
  "servers": {
    "crewx": {
      "command": "npx",
      "args": ["-y", "crewx", "mcp"],
      "env": {
        "CREWX_CONFIG": "${workspaceFolder}/crewx.yaml"
      }
    }
  }
}
```

> **참고:** `agents.yaml`도 계속 지원되지만, `crewx.yaml`이 선호하는 설정 파일 이름입니다.

> **Windows 참고:** PowerShell 실행 정책 제한으로 인해 `cmd.exe`를 사용하세요.

### Claude Desktop

`claude_desktop_config.json`에 추가합니다:

```json
{
  "mcpServers": {
    "crewx": {
      "command": "npx",
      "args": ["-y", "crewx", "mcp"],
      "env": {
        "CREWX_CONFIG": "/path/to/your/crewx.yaml"
      }
    }
  }
}
```

**위치:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

### Cursor IDE

프로젝트 루트에서 `.cursor/mcp.json`을 생성합니다:

```json
{
  "mcpServers": {
    "crewx": {
      "command": "npx",
      "args": ["-y", "crewx", "mcp"],
      "env": {
        "CREWX_CONFIG": "${workspaceFolder}/crewx.yaml"
      }
    }
  }
}
```

**참고:** Cursor를 다시 시작하고 Settings > Cursor Settings > MCP Servers에서 MCP 서버를 활성화합니다.

### 기타 MCP 클라이언트

- **Cline**: VS Code MCP 확장을 통해 MCP 지원
- **Continue**: VS Code MCP 확장을 통해 MCP 지원
- **Windsurf**: MCP 지원은 다를 수 있음 - 설명서 확인

## 사용 가능한 MCP 도구

CrewX를 MCP 서버로 사용할 때 이러한 도구들을 사용할 수 있습니다:

### 에이전트 관리
1. **`crewx_listAgents`** - 사용 가능한 모든 전문가 에이전트 나열
2. **`crewx_queryAgent`** - 에이전트 쿼리 (읽기 전용 분석)
3. **`crewx_executeAgent`** - 에이전트를 통한 작업 실행 (파일 작업)
4. **`crewx_queryAgentParallel`** - 여러 에이전트 병렬 쿼리
5. **`crewx_executeAgentParallel`** - 여러 작업 병렬 실행

### 작업 모니터링
6. **`crewx_getTaskLogs`** - 작업 ID로 작업 실행 로그 검색

### 시스템 진단
7. **`crewx_checkAIProviders`** - AI CLI 도구 가용성 확인


## 설정

### 환경 변수

`CREWX_CONFIG`를 설정하여 설정 파일 위치를 지정합니다:

```bash
# MCP 클라이언트 설정에서
"env": {
  "CREWX_CONFIG": "/path/to/crewx.yaml"
}
```

> **참고:** `crewx.yaml` (선호) 및 `agents.yaml` (레거시) 모두 지원됩니다.

### 에이전트 설정

`crewx.yaml`을 생성합니다 ([에이전트 설정 가이드](../configuration/agents.md) 참조):

```yaml
agents:
  - id: "my_agent"
    name: "My Custom Agent"
    provider: "claude"
    working_directory: "./src"
    inline:
      type: "agent"
      system_prompt: |
        You are a helpful coding assistant.
```

## 설정 체크리스트

1. **프로젝트에 `crewx.yaml` 생성** (또는 레거시 `agents.yaml` 사용)
2. **MCP 클라이언트 설정** (VS Code, Claude Desktop 등)
3. **MCP 클라이언트 재시작** 서버 로드
4. **연결 확인** 에이전트 나열
5. **간단한 쿼리로 테스트**

## 문제 해결

### 서버가 시작되지 않음
- `crewx.yaml` (또는 `agents.yaml`)이 지정된 경로에 존재하는지 확인
- CrewX가 설치되어 있는지 확인 (`npm install -g crewx`)
- MCP 클라이언트 설정 문법 확인

### 도구가 나타나지 않음
- 설정 변경 후 MCP 클라이언트 재시작
- MCP 클라이언트 로그에서 연결 오류 확인
- `CREWX_CONFIG` 환경 변수가 올바르게 설정되어 있는지 확인

### 에이전트 실행 실패
- `crewx doctor`를 실행하여 AI CLI 가용성 확인
- `crewx.yaml`에서 에이전트 설정 확인
- `crewx_getTaskLogs`로 작업 로그 확인

더 많은 해결책은 [문제 해결 가이드](../troubleshooting/common-issues.md)를 참조하세요.
