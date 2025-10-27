# 원격 에이전트

다른 CrewX 인스턴스에 CrewX를 연결하여 분산 협업 및 리소스 공유를 구현합니다.

## 개요

원격 에이전트를 사용하면:
- **작업 위임**: 다른 프로젝트에서 실행 중인 CrewX 인스턴스로 작업 위임
- **리소스 공유**: 팀과 서버 간 리소스 공유
- **컨텍스트 격리**: 다른 코드베이스에 대한 독립적인 컨텍스트 유지
- **워크로드 확장**: 원격 서버로 작업 분산하여 처리량 증대

## 빠른 시작

### 1. 원격 MCP 서버 시작

```bash
# HTTP 및 인증을 사용하여 CrewX를 MCP 서버로 시작
crewx mcp server --http --host localhost --port 9001 --key "sk-secret-key" --log
```

**옵션:**
- `--http` - HTTP 전송 활성화 (stdio 외에)
- `--host` - 서버 호스트명 (기본값: localhost)
- `--port` - 서버 포트 (기본값: 3000)
- `--key` - Bearer 인증용 API 키
- `--log` - 요청 로깅 활성화

### 2. 원격 공급자 설정

로컬 `crewx.yaml`에 다음을 추가합니다:

```yaml
providers:
  - id: remote_server
    type: remote
    location: "http://localhost:9001"
    external_agent_id: "backend_team"
    display_name: "Backend Server"
    description: "원격 CrewX 인스턴스 (백엔드 작업용)"
    auth:
      type: bearer
      token: "sk-secret-key"
    timeout:
      query: 300000    # 5분
      execute: 600000  # 10분

agents:
  - id: "remote_backend"
    name: "Backend Team"
    provider: "remote/remote_server"
    description: "원격 서버의 백엔드 개발팀"
```

### 3. 원격 에이전트 사용

```bash
# 원격 에이전트에 쿼리 보내기
crewx query "@remote_backend check API status"

# 원격 에이전트에서 작업 실행
crewx execute "@remote_backend implement new endpoint"

# 로컬 에이전트와 함께 사용
crewx query "@claude @remote_backend compare approaches"
```

## 설정

### 공급자 설정

```yaml
providers:
  - id: unique_provider_id
    type: remote
    location: "http://hostname:port" or "file:///absolute/path/to/config.yaml"
    external_agent_id: "target_agent_id_on_remote"
    display_name: "Human Readable Name"
    description: "공급자 설명"
    auth:                    # 선택 사항
      type: bearer
      token: "your-token"
    headers:                 # 선택 사항 - 커스텀 헤더
      "User-Agent": "CrewX/1.0"
      "X-Client-ID": "client-123"
    timeout:
      query: 300000         # 밀리초 (기본값: 5분)
      execute: 600000       # 밀리초 (기본값: 10분)
```

### 에이전트 설정

```yaml
agents:
  - id: "local_agent_id"
    name: "Display Name"
    provider: "remote/provider_id"
    description: "에이전트 설명"
    working_directory: "/path/to/workdir"  # 선택 사항
```

## 연결 유형

### HTTP 기반 원격 서버

네트워크 기반 원격 연결에 가장 일반적으로 사용됩니다.

**원격 서버 설정:**
```bash
# 원격 서버(192.168.1.100)에서
cd /path/to/project
crewx mcp server --http --host 0.0.0.0 --port 3000 --key "production-key"
```

**로컬 설정:**
```yaml
providers:
  - id: production_server
    type: remote
    location: "http://192.168.1.100:3000"
    external_agent_id: "prod_backend"
    auth:
      type: bearer
      token: "production-key"
    timeout:
      query: 180000
      execute: 600000
```

### 파일 기반 로컬 원격

서버를 시작하지 않고 다른 로컬 CrewX 설정에 액세스합니다.

**사용 사례**: 같은 머신에서 여러 프로젝트 조율

```yaml
providers:
  - id: other_project
    type: remote
    location: "file:///Users/username/projects/other-project/crewx.yaml"
    external_agent_id: "specialist_agent"
    timeout:
      query: 300000
      execute: 600000

agents:
  - id: "other_project_team"
    provider: "remote/other_project"
```

**사용 예시:**
```bash
# 현재 프로젝트: 메인 애플리케이션
# 원격 프로젝트: 데이터 처리 파이프라인

crewx execute "@other_project_team process new dataset"
```

## 사용 사례

### 다중 프로젝트 조율

여러 저장소 간 작업을 조율합니다:

```yaml
# 메인 프로젝트의 crewx.yaml
providers:
  - id: frontend_project
    type: remote
    location: "file:///workspace/frontend-app/crewx.yaml"
    external_agent_id: "react_specialist"

  - id: backend_project
    type: remote
    location: "file:///workspace/backend-api/crewx.yaml"
    external_agent_id: "api_specialist"

agents:
  - id: "frontend_team"
    provider: "remote/frontend_project"

  - id: "backend_team"
    provider: "remote/backend_project"

  - id: "coordinator"
    inline:
      provider: "cli/claude"
      prompt: |
        프론트엔드와 백엔드 팀 간 조율을 담당합니다.
        React/UI 작업은 @frontend_team을 사용하세요.
        API/데이터베이스 작업은 @backend_team을 사용하세요.
```

**사용:**
```bash
# 풀스택 기능 조율
crewx query "@coordinator plan user authentication feature"
crewx execute "@frontend_team create login UI" "@backend_team create auth API"
```

### 분산 팀 설정

각 팀원이 자신의 전문화된 CrewX 설정으로 실행합니다:

**팀 리드의 설정:**
```yaml
providers:
  - id: alice_workstation
    type: remote
    location: "http://alice.local:3000"
    external_agent_id: "alice_specialist"
    auth:
      type: bearer
      token: "alice-key"

  - id: bob_workstation
    type: remote
    location: "http://bob.local:3000"
    external_agent_id: "bob_specialist"
    auth:
      type: bearer
      token: "bob-key"

agents:
  - id: "alice"
    provider: "remote/alice_workstation"
    description: "Alice의 전문화된 AI 설정 (ML 중심)"

  - id: "bob"
    provider: "remote/bob_workstation"
    description: "Bob의 전문화된 AI 설정 (DevOps 중심)"
```

### 리소스 공유

경량 클라이언트에서 강력한 컴퓨팅 리소스에 액세스합니다:

```yaml
# 노트북 설정
providers:
  - id: gpu_server
    type: remote
    location: "http://gpu-server.company.com:3000"
    external_agent_id: "ml_trainer"
    auth:
      type: bearer
      token: "${ML_SERVER_TOKEN}"  # 환경 변수 사용
    timeout:
      query: 600000    # ML 작업용 10분
      execute: 1800000 # 훈련용 30분

agents:
  - id: "ml_server"
    provider: "remote/gpu_server"
    description: "GPU 서버의 고성능 ML 에이전트"
```

## 환경 변수

민감한 설정에 환경 변수를 사용합니다:

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

**.env 파일:**
```bash
CREWX_REMOTE_URL=http://production.example.com:3000
CREWX_REMOTE_AGENT=backend_prod
CREWX_REMOTE_TOKEN=sk-prod-secret-key
```

## 인증

### Bearer 토큰 인증

HTTP 원격 서버에 가장 일반적인 방법입니다.

**서버 측:**
```bash
crewx mcp server --http --port 3000 --key "sk-production-key-123"
```

**클라이언트 측:**
```yaml
providers:
  - id: secure_server
    type: remote
    location: "http://server:3000"
    external_agent_id: "agent"
    auth:
      type: bearer
      token: "sk-production-key-123"
```

토큰은 다음과 같이 전송됩니다: `Authorization: Bearer sk-production-key-123`

### 커스텀 헤더

고급 인증 또는 라우팅을 위한 추가 헤더를 추가합니다:

```yaml
providers:
  - id: enterprise_server
    type: remote
    location: "http://api.company.com:3000"
    external_agent_id: "agent"
    auth:
      type: bearer
      token: "jwt-token-here"
    headers:
      "X-Tenant-ID": "company-123"
      "X-Environment": "production"
      "User-Agent": "CrewX/1.0"
```

## 타임아웃

작업의 복잡도와 네트워크 상태에 따라 적절한 타임아웃을 설정합니다:

```yaml
providers:
  - id: slow_network
    type: remote
    location: "http://remote:3000"
    external_agent_id: "agent"
    timeout:
      query: 600000    # 10분 (느린 네트워크 + 복잡한 쿼리)
      execute: 1800000 # 30분 (네트워크 + 파일 작업)
```

**권장 타임아웃:**
- **로컬 네트워크**: 쿼리 60-120초, 실행 180-300초
- **인터넷**: 쿼리 180-300초, 실행 600-900초
- **복잡한 작업**: 쿼리 300-600초, 실행 900-1800초

## 제한 사항

### 현재 제한 사항

1. **상태 비저장 호출**
   - `--thread` 대화 기록이 원격 서버로 전달되지 않음
   - 각 원격 호출은 독립적임
   - 해결책: 원격 서버의 자체 스레드 관리 사용

2. **MCP 도구 요구 사항**
   - 원격 서버는 `crewx_queryAgent` 및 `crewx_executeAgent` 도구를 노출해야 함
   - 표준 CrewX MCP 서버는 이를 자동으로 포함함

3. **네트워크 고려 사항**
   - 로컬 에이전트보다 높은 레이턴시
   - 적절하게 타임아웃 설정
   - 작업 세분성 고려

### 해결책

**대화 연속성:**
```bash
# 원격 경계를 넘어 --thread 사용하지 마세요
# 대신 원격 서버의 스레드를 로컬에서 사용하세요

# 원격 서버에서
crewx query "@agent design API" --thread "project"
crewx execute "@agent implement it" --thread "project"

# 클라이언트에서 (각 호출은 독립적)
crewx query "@remote_agent task description with full context"
```

**장시간 실행 작업:**
```yaml
# 복잡한 작업의 타임아웃 증가
providers:
  - id: slow_tasks
    type: remote
    location: "http://server:3000"
    external_agent_id: "agent"
    timeout:
      execute: 3600000  # 1시간
```

## 문제 해결

### 연결 문제

**문제**: 원격 서버에 연결할 수 없음

```bash
# 네트워크 연결 확인
curl http://remote-host:3000/health

# 서버 로그 확인
crewx mcp server --http --port 3000 --log
```

**해결책:**
- 서버가 실행 중인지 확인: `crewx mcp server --http`
- 방화벽 규칙 확인
- 설정에서 호스트명/포트 확인
- curl로 먼저 테스트

### 인증 실패

**문제**: 401 Unauthorized

**해결책:**
- 클라이언트와 서버 간 토큰이 일치하는지 확인
- 설정에서 토큰이 올바르게 설정되었는지 확인
- `auth.type`이 `bearer`로 설정되었는지 확인

### 타임아웃 오류

**문제**: 작업 타임아웃

**해결책:**
- 공급자 설정에서 타임아웃 값 증가
- 네트워크 레이턴시 확인: `ping remote-host`
- 큰 작업을 작은 작업으로 분할

### 에이전트를 찾을 수 없음

**문제**: 원격 에이전트 ID가 존재하지 않음

**해결책:**
- 원격 서버의 사용 가능한 에이전트 나열: `crewx mcp server --list`
- `external_agent_id`가 원격 에이전트 ID와 일치하는지 확인
- 원격 서버의 `crewx.yaml` 설정 확인

## 모범 사례

1. **보안**
   - 강력한 API 키 사용 (최소 16자)
   - 토큰을 설정 파일이 아닌 환경 변수에 저장
   - 프로덕션에서는 원격 연결에 HTTPS 사용
   - 토큰을 정기적으로 교체

2. **성능**
   - 원격 에이전트를 모든 작업이 아닌 전문화된 작업에만 사용
   - 워크플로우 설계에서 네트워크 레이턴시 고려
   - 현실적인 타임아웃 설정
   - 원격 서버 리소스 사용량 모니터링

3. **조직**
   - 명확하고 설명적인 에이전트 ID 사용
   - 각 원격 에이전트의 역할 문서화
   - 원격 설정을 버전 관리에 포함
   - 원격 서버 설정 동기화 유지

4. **안정성**
   - 헬스 체크 구현
   - 로컬 에이전트 대체 방안 마련
   - 디버깅을 위해 원격 호출 로깅
   - 원격 서버 가용성 모니터링

## 예시

### 예시 1: 개발 → 스테이징 → 프로덕션

```yaml
# development.crewx.yaml
providers:
  - id: staging_server
    type: remote
    location: "http://staging.company.com:3000"
    external_agent_id: "staging_tester"
    auth:
      type: bearer
      token: "${STAGING_TOKEN}"

  - id: prod_server
    type: remote
    location: "http://prod.company.com:3000"
    external_agent_id: "prod_deployer"
    auth:
      type: bearer
      token: "${PROD_TOKEN}"

agents:
  - id: "dev_agent"
    provider: "cli/claude"
    working_directory: "./src"

  - id: "staging_agent"
    provider: "remote/staging_server"

  - id: "prod_agent"
    provider: "remote/prod_server"
```

**워크플로우:**
```bash
# 로컬에서 개발
crewx execute "@dev_agent implement feature"

# 스테이징에서 테스트
crewx query "@staging_agent run integration tests"

# 프로덕션으로 배포
crewx execute "@prod_agent deploy version 1.2.3"
```

### 예시 2: 전문화된 도메인 전문가

```yaml
providers:
  - id: ml_server
    type: remote
    location: "http://ml-gpu.local:3000"
    external_agent_id: "ml_expert"

  - id: security_server
    type: remote
    location: "http://security.local:3000"
    external_agent_id: "security_expert"

agents:
  - id: "ml_specialist"
    provider: "remote/ml_server"
    description: "GPU 접근 권한이 있는 ML/AI 전문가"

  - id: "security_specialist"
    provider: "remote/security_server"
    description: "보안 분석 전문가"

  - id: "architect"
    inline:
      provider: "cli/claude"
      prompt: |
        당신은 시스템 아키텍트입니다. 전문가들과 협력합니다:
        - ML/AI 질문은 @ml_specialist에게
        - 보안 검토는 @security_specialist에게
```

**사용:**
```bash
# 아키텍트가 전문가들을 조율
crewx query "@architect design user recommendation system"
# → 아키텍트가 @ml_specialist에게 ML 설계 자문

crewx query "@architect review authentication code"
# → 아키텍트가 @security_specialist에게 보안 검토 자문
```

## 참고

- [에이전트 설정](./agent-configuration.md) - 일반적인 에이전트 설정
- [MCP 통합](./mcp-integration.md) - MCP 서버 설정
- [CLI 가이드](./cli-guide.md) - 명령줄 참고
