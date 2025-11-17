---
slug: cli-to-api-migration-guide
title: CrewX로 로컬 개발에서 프로덕션 배포까지 - CLI에서 API Provider로의 여정
authors: [doha]
tags: [crewx, tutorial, ai]
---

로컬에서 완성한 AI 에이전트를 프로덕션 웹서버에 어떻게 녹여낼 수 있을까요? CrewX는 CLI Provider로 시작해서 API Provider로 마이그레이션하는 명확한 경로를 제공합니다. 이 가이드에서는 실제 개발 시나리오를 따라가며 단계별로 마이그레이션하는 방법을 알아봅니다.

<!--truncate-->

## 시나리오: 로컬 개발에서 프로덕션까지

당신은 개발자로서 다음과 같은 여정을 걷게 됩니다:

1. **로컬 개발**: CLI Provider로 AI 에이전트를 빠르게 프로토타이핑
2. **API Provider 전환**: 프로덕션 환경을 위한 설정 변경
3. **프로덕션 배포**: CLI 명령어로 자동화 및 운영

이 과정을 하나씩 살펴보겠습니다.

---

## Step 1: 로컬 개발 (CLI Provider)

### 왜 CLI Provider로 시작하나요?

CLI Provider는 로컬 개발 환경에서 가장 빠르게 시작할 수 있는 방법입니다:

- **즉시 사용 가능**: `claude`, `gemini`, `copilot` CLI만 설치하면 됨
- **파일 시스템 접근**: 로컬 프로젝트 파일에 직접 접근
- **빠른 반복**: 코드 변경 후 즉시 테스트 가능
- **권한 모델**: 에이전트가 파일을 수정하기 전에 확인 가능

### 로컬 개발 환경 구성

**프로젝트 초기화:**

```bash
# CrewX 설치
npm install -g crewx

# 프로젝트 폴더 생성
mkdir my-ai-project
cd my-ai-project

# CrewX 초기화
crewx init
```

**crewx.yaml 작성:**

```yaml
agents:
  - id: "dev_assistant"
    name: "Development Assistant"
    provider: "cli/claude"  # CLI Provider 사용
    working_directory: "./src"
    inline:
      model: "sonnet"
      prompt: |
        당신은 개발 어시스턴트입니다.

        역할:
        - 코드 리뷰 및 분석
        - 버그 수정 제안
        - 리팩토링 가이드
        - 테스트 코드 작성

        항상 코드 품질과 베스트 프랙티스를 우선시하세요.
```

**로컬에서 에이전트 테스트:**

```bash
# 코드 분석 (query mode)
crewx query "@dev_assistant src/utils.ts 파일을 분석해줘"

# 버그 수정 (execute mode)
crewx execute "@dev_assistant API 호출 에러를 수정해줘"
```

### CLI Provider의 장점

✅ **빠른 개발 사이클**
```bash
# 코드 수정 후 즉시 테스트
vim src/api.ts
crewx query "@dev_assistant 방금 수정한 코드 리뷰해줘"
```

✅ **파일 시스템 통합**
- 프로젝트 파일 읽기/쓰기 자동 지원
- Git 작업 자동화 가능
- 로컬 도구 (npm, git 등) 직접 실행

✅ **보안 및 권한 제어**
```bash
# execute 모드에서 파일 수정 시 확인 요청
crewx execute "@dev_assistant index.ts 리팩토링해줘"
# → Agent가 파일을 수정하려고 할 때 승인 요청
```

---

## Step 2: 프로덕션 준비 (API Provider로 전환)

### 왜 API Provider로 마이그레이션하나요?

로컬 개발에서 검증된 에이전트를 프로덕션 환경에 배포하려면 API Provider가 필요합니다:

- **서버 배포**: 웹 애플리케이션에 통합 가능
- **HTTP 기반**: RESTful API로 에이전트 호출
- **Tool Calling**: 함수 호출 방식으로 커스텀 도구 통합
- **MCP 지원**: 외부 서비스 (GitHub, Slack 등) 연동

### crewx.yaml 업데이트

**CLI Provider 설정 (기존):**

```yaml
agents:
  - id: "dev_assistant"
    name: "Development Assistant"
    provider: "cli/claude"  # CLI Provider
    working_directory: "./src"
    inline:
      model: "sonnet"
      prompt: |
        당신은 개발 어시스턴트입니다.
```

**API Provider 설정 (프로덕션):**

```yaml
agents:
  - id: "prod_assistant"
    name: "Production Assistant"
    provider: "api/anthropic"  # API Provider로 변경
    model: "claude-sonnet-4-5-20250929"
    temperature: 0.7
    options:
      query:
        tools: ["read_file", "grep", "find"]  # 읽기 전용 도구
      execute:
        tools: ["read_file", "write_file", "run_shell"]  # 쓰기 도구 추가
    inline:
      prompt: |
        당신은 프로덕션 AI 어시스턴트입니다.

        역할:
        - 코드 분석 및 리뷰
        - 자동화된 버그 수정
        - 성능 최적화 제안
        - 보안 취약점 점검
```

### 환경 변수 설정

**.env 파일 생성:**

```bash
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# 프로덕션 환경 설정
NODE_ENV=production
```

### API vs CLI 비교표

| 항목 | CLI Provider | API Provider |
|------|--------------|--------------|
| **배포 환경** | 로컬 전용 | 로컬 + 서버 |
| **통합 방식** | 프로세스 spawn | HTTP API |
| **Tool Calling** | Spawn 기반 | 함수 주입 |
| **성능** | 느림 (프로세스 생성) | 빠름 (HTTP) |
| **스트리밍** | stdio | HTTP SSE |
| **MCP 지원** | 제한적 | 완전 지원 |
| **다중 모델** | Provider 배열 | LiteLLM Gateway |
| **비용** | Provider 비용만 | Provider + 게이트웨이 |

---

## Step 3: 프로덕션 배포 (CLI 기반)

### CLI로 프로덕션 운영하기

API Provider로 전환한 후에도 CLI 명령어를 활용해서 프로덕션 환경을 효율적으로 운영할 수 있습니다.

### 프로덕션 환경 설정

**crewx.yaml 프로덕션 설정:**

```yaml
agents:
  - id: "prod_assistant"
    name: "Production Assistant"
    provider: "api/anthropic"
    model: "claude-sonnet-4-5-20250929"
    working_directory: "/var/app/production"
    options:
      query:
        tools: ["read_file", "grep", "find"]
      execute:
        tools: ["read_file", "write_file", "run_shell"]
    inline:
      prompt: |
        당신은 프로덕션 AI 어시스턴트입니다.

        역할:
        - 로그 분석 및 모니터링
        - 자동화된 버그 수정
        - 성능 최적화 제안
        - 보안 취약점 점검
```

### 자동화 스크립트 작성

**1. 로그 분석 자동화 (scripts/analyze-logs.sh):**

```bash
#!/bin/bash

# 프로덕션 로그 분석
CREWX_CONFIG=./crewx.yaml crewx query "@prod_assistant \
  /var/log/app/error.log 파일을 분석해서 최근 1시간 이내 발생한 에러를 요약해줘"
```

**2. 일일 리포트 생성 (scripts/daily-report.sh):**

```bash
#!/bin/bash

# 일일 시스템 상태 리포트
REPORT_FILE="reports/daily-$(date +%Y%m%d).md"

CREWX_CONFIG=./crewx.yaml crewx query "@prod_assistant \
  시스템 상태를 분석하고 다음을 포함한 리포트를 작성해줘:
  1. 서버 리소스 사용량
  2. 최근 24시간 에러 로그 요약
  3. 성능 지표 분석
  4. 보안 취약점 점검 결과" > "$REPORT_FILE"

echo "Daily report saved to $REPORT_FILE"
```

**3. 긴급 버그 수정 (scripts/hotfix.sh):**

```bash
#!/bin/bash

FILE=$1
ISSUE=$2

# 긴급 버그 수정
CREWX_CONFIG=./crewx.yaml crewx execute "@prod_assistant \
  $FILE 파일의 버그를 수정해주세요: $ISSUE"

# Git 커밋
git add "$FILE"
git commit -m "fix: Hotfix for $ISSUE"
git push origin main
```

### Cron Job으로 정기 작업 자동화

**crontab 설정:**

```bash
# Crontab 편집
crontab -e
```

```cron
# 매일 오전 9시 일일 리포트 생성
0 9 * * * /var/app/scripts/daily-report.sh

# 매 시간마다 로그 분석
0 * * * * /var/app/scripts/analyze-logs.sh

# 매주 월요일 오전 10시 보안 감사
0 10 * * 1 CREWX_CONFIG=/var/app/crewx.yaml crewx query "@prod_assistant 전체 코드베이스를 스캔해서 보안 취약점을 찾아줘"
```

### CI/CD 파이프라인 통합

**GitHub Actions 예제 (.github/workflows/ai-review.yml):**

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install CrewX
        run: npm install -g crewx

      - name: AI Code Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          crewx query "@prod_assistant \
            PR #${{ github.event.pull_request.number }}의 변경사항을 리뷰하고 \
            다음을 확인해줘:
            1. 코드 품질 및 베스트 프랙티스
            2. 잠재적 버그 및 에러
            3. 성능 이슈
            4. 보안 취약점" > review.md

          cat review.md
```

**GitLab CI 예제 (.gitlab-ci.yml):**

```yaml
ai_code_review:
  stage: test
  script:
    - npm install -g crewx
    - export CREWX_CONFIG=./crewx.yaml
    - |
      crewx query "@prod_assistant \
        최근 커밋을 분석하고 개선사항을 제안해줘" > ai-review.txt
    - cat ai-review.txt
  only:
    - merge_requests
```

### Docker 컨테이너에서 실행

**Dockerfile:**

```dockerfile
FROM node:20-alpine

# CrewX 설치
RUN npm install -g crewx

# 프로젝트 파일 복사
WORKDIR /app
COPY crewx.yaml .
COPY scripts/ ./scripts/

# 환경 변수 설정
ENV ANTHROPIC_API_KEY=your_api_key
ENV CREWX_CONFIG=/app/crewx.yaml

# Cron 설정
RUN apk add --no-cache dcron
COPY crontab /etc/crontabs/root

CMD ["crond", "-f"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  crewx-automation:
    build: .
    volumes:
      - ./logs:/var/log/app
      - ./reports:/app/reports
    environment:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - CREWX_CONFIG=/app/crewx.yaml
    restart: unless-stopped
```

### 프로덕션 모니터링

**실시간 로그 모니터링:**

```bash
# 로그 파일 변경 감지 및 자동 분석
tail -f /var/log/app/error.log | while read line; do
  if echo "$line" | grep -i "error\|fatal\|exception"; then
    crewx query "@prod_assistant 다음 에러를 분석해줘: $line"
  fi
done
```

**시스템 헬스 체크:**

```bash
#!/bin/bash

# 시스템 상태 확인
HEALTH_STATUS=$(crewx query "@prod_assistant \
  다음 지표를 확인하고 시스템 상태를 평가해줘:
  - CPU 사용률: $(top -bn1 | grep 'Cpu(s)' | awk '{print $2}')
  - 메모리 사용률: $(free | grep Mem | awk '{print $3/$2 * 100.0}')
  - 디스크 사용률: $(df -h / | awk 'NR==2 {print $5}')
")

echo "$HEALTH_STATUS"

# Slack/Discord로 알림 (선택)
if echo "$HEALTH_STATUS" | grep -i "critical\|warning"; then
  curl -X POST -H 'Content-type: application/json' \
    --data "{\"text\":\"🚨 System Health Alert:\n$HEALTH_STATUS\"}" \
    $SLACK_WEBHOOK_URL
fi
```

---

## 실전 활용 시나리오

### 시나리오 1: 코드 리뷰 자동화

**로컬 개발 (CLI):**

```bash
# 로컬에서 코드 리뷰
crewx query "@dev_assistant PR #123의 변경사항을 리뷰해줘"
```

**프로덕션 (GitHub Actions):**

```yaml
# .github/workflows/pr-review.yml
name: AI Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install CrewX
        run: npm install -g crewx
      - name: AI Review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          REVIEW=$(crewx query "@prod_assistant PR #${{ github.event.pull_request.number }}를 리뷰해줘")
          echo "$REVIEW" >> $GITHUB_STEP_SUMMARY
```

### 시나리오 2: 버그 자동 수정

**로컬 개발 (CLI):**

```bash
# 로컬에서 버그 수정
crewx execute "@dev_assistant src/api.ts의 null 참조 에러를 수정해줘"
```

**프로덕션 (자동화 스크립트):**

```bash
#!/bin/bash
# scripts/auto-fix.sh

ERROR_FILE=$1
ERROR_DESC=$2

# AI로 버그 수정
crewx execute "@prod_assistant $ERROR_FILE의 버그를 수정해주세요: $ERROR_DESC"

# 자동 커밋
git add "$ERROR_FILE"
git commit -m "fix: Auto-fix by AI - $ERROR_DESC"
git push origin hotfix/auto-fix-$(date +%s)

echo "✅ Bug fix completed and pushed"
```

---

## 마이그레이션 체크리스트

### ✅ Phase 1: 로컬 개발

- [ ] CrewX 설치 (`npm install -g crewx`)
- [ ] Claude/Gemini/Copilot CLI 설치
- [ ] `crewx.yaml` 작성 (CLI Provider 사용)
- [ ] 로컬에서 에이전트 테스트
- [ ] 기능 검증 완료

### ✅ Phase 2: API Provider 전환

- [ ] API Key 발급 (Anthropic/OpenAI/Google)
- [ ] `.env` 파일 생성 및 API Key 설정
- [ ] `crewx.yaml` 업데이트 (API Provider로 변경)
- [ ] 도구 및 MCP 설정
- [ ] 로컬에서 API Provider 테스트

### ✅ Phase 3: 프로덕션 배포 (CLI 기반)

- [ ] 프로덕션 환경 `crewx.yaml` 설정
- [ ] 자동화 스크립트 작성 (로그 분석, 리포트 생성 등)
- [ ] Cron Job 설정으로 정기 작업 자동화
- [ ] CI/CD 파이프라인 통합 (GitHub Actions, GitLab CI 등)
- [ ] Docker 컨테이너 설정 (선택)
- [ ] 프로덕션 모니터링 구성

---

## 결론: "아! 이렇게 쉽게 프로덕션 배포가 가능하구나"

CrewX의 마이그레이션 경로는 명확합니다:

1. **로컬 개발**: CLI Provider로 빠르게 프로토타이핑
2. **프로덕션 전환**: API Provider로 마이그레이션
3. **자동화 배포**: CLI 명령어로 운영 및 자동화

**핵심 인사이트:**

✨ **동일한 crewx.yaml**: CLI와 API Provider 모두 동일한 설정 파일 사용
✨ **점진적 마이그레이션**: 로컬과 프로덕션을 병행하며 단계적으로 전환
✨ **CLI 기반 자동화**: Cron, CI/CD로 프로덕션 운영
✨ **확장 가능**: 스크립트, Docker, 모니터링으로 무한 확장

이제 여러분도 로컬에서 개발한 AI 에이전트를 프로덕션 환경에 CLI 명령어로 바로 배포하고 운영할 수 있습니다. CrewX와 함께 AI 자동화를 시작하세요! 🚀

---

**다음 단계:**

- [CrewX GitHub Repository](https://github.com/sowonlabs/crewx)
- [API Provider 가이드](https://github.com/sowonlabs/crewx/blob/main/docs/api-provider-guide.md)
