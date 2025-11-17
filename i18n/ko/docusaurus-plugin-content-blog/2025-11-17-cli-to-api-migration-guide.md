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
2. **테스트 및 검증**: 로컬 환경에서 에이전트 동작 확인
3. **프로덕션 준비**: API Provider로 전환하여 웹 애플리케이션에 통합
4. **팀 공유** (선택): Slack Bot으로 팀 전체와 공유

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

## Step 3: 웹서버 통합 (SDK 사용)

### TypeScript 웹서버 예제

이제 API Provider를 사용해서 웹 애플리케이션에 AI 에이전트를 통합해봅시다.

**프로젝트 설정:**

```bash
# 프로젝트 생성
mkdir ai-web-app
cd ai-web-app
npm init -y

# 의존성 설치
npm install express @sowonai/crewx-sdk
npm install -D typescript @types/node @types/express
```

**TypeScript 설정 (tsconfig.json):**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

**웹서버 구현 (src/server.ts):**

```typescript
import express from 'express';
import { CrewX } from '@sowonai/crewx-sdk';

// CrewX 초기화
const crewx = new CrewX({
  configPath: './crewx.yaml',
  // 커스텀 도구 주입 (선택)
  tools: [
    {
      name: 'web_search',
      description: '웹 검색을 수행합니다',
      parameters: z.object({
        query: z.string().describe('검색 쿼리'),
      }),
      execute: async ({ query }, context) => {
        // 실제 웹 검색 API 호출
        const results = await searchAPI(query);
        return { results };
      },
    },
  ],
});

const app = express();
app.use(express.json());

// AI 에이전트 엔드포인트
app.post('/api/agent/query', async (req, res) => {
  try {
    const { agentId, input } = req.body;

    // 에이전트 호출 (query 모드)
    const response = await crewx.runAgent(agentId, {
      input,
      mode: 'query',
    });

    res.json({
      success: true,
      content: response.content,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 에이전트 실행 엔드포인트 (파일 수정 가능)
app.post('/api/agent/execute', async (req, res) => {
  try {
    const { agentId, input } = req.body;

    // 에이전트 호출 (execute 모드)
    const response = await crewx.runAgent(agentId, {
      input,
      mode: 'execute',
    });

    res.json({
      success: true,
      content: response.content,
      toolCalls: response.toolCalls,  // 실행된 도구 목록
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 AI Web Server running on port ${PORT}`);
});
```

**프론트엔드 통합 예제:**

```typescript
// 클라이언트 측 코드
async function askAI(question: string) {
  const response = await fetch('/api/agent/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      agentId: 'prod_assistant',
      input: question,
    }),
  });

  const data = await response.json();

  if (data.success) {
    console.log('AI 응답:', data.content);
  } else {
    console.error('에러:', data.error);
  }
}

// 사용 예시
askAI('현재 시스템 상태를 분석해줘');
```

### 커스텀 도구 추가

API Provider에서는 함수 주입 방식으로 커스텀 도구를 추가할 수 있습니다:

**도구 정의 (tools/database.tool.ts):**

```typescript
import { z } from 'zod';
import { FrameworkToolDefinition } from '@sowonai/crewx-sdk';

export const queryDatabaseTool: FrameworkToolDefinition = {
  name: 'query_database',
  description: 'SQL 쿼리를 실행합니다 (SELECT만 허용)',

  parameters: z.object({
    query: z.string().describe('SQL SELECT 쿼리'),
  }),

  execute: async ({ query }, context) => {
    // 보안: SELECT만 허용
    if (!query.trim().toLowerCase().startsWith('select')) {
      throw new Error('SELECT 쿼리만 허용됩니다');
    }

    // 데이터베이스 연결
    const dbUrl = context.env.DATABASE_URL;
    const results = await executeQuery(dbUrl, query);

    return {
      rows: results,
      count: results.length,
    };
  },
};
```

**도구 주입:**

```typescript
import { queryDatabaseTool } from './tools/database.tool';

const crewx = new CrewX({
  configPath: './crewx.yaml',
  tools: [queryDatabaseTool],  // 도구 주입
});
```

**crewx.yaml에서 활성화:**

```yaml
agents:
  - id: "data_analyst"
    provider: "api/anthropic"
    model: "claude-sonnet-4-5-20250929"
    tools: ["query_database"]  # 도구 활성화
    inline:
      prompt: |
        당신은 데이터 분석가입니다.
        query_database 도구를 사용해서 데이터를 조회하고 분석하세요.
```

---

## Step 4: (선택) Slack으로 팀 공유

프로덕션 에이전트를 Slack Bot으로 팀 전체와 공유할 수 있습니다.

### Slack Bot 설정

**환경 변수 설정:**

```bash
# .env.slack 파일
SLACK_BOT_TOKEN=xoxb-xxxxxxxxxxxxx
SLACK_APP_TOKEN=xapp-xxxxxxxxxxxxx
SLACK_SIGNING_SECRET=xxxxxxxxxxxxx

# CrewX 설정
CREWX_CONFIG=./crewx.yaml
```

**Slack Bot 실행:**

```bash
# 읽기 전용 모드 (query만)
crewx slack

# 실행 모드 (execute 가능)
crewx slack --mode execute
```

### Slack에서 사용하기

**채널에서 호출:**

```
@CrewX 현재 시스템 상태를 분석해줘
```

**DM으로 호출:**

```
서버 로그에서 에러를 찾아줘
```

**특정 에이전트 지정:**

```
@CrewX @prod_assistant 데이터베이스 쿼리 최적화해줘
```

### Slack Bot 장점

✅ **팀 협업**: 모든 팀원이 AI 에이전트 활용
✅ **컨텍스트 유지**: 스레드 기반 대화로 맥락 보존
✅ **투명성**: 팀 전체가 AI 인사이트 공유
✅ **편의성**: Slack에서 바로 사용, 별도 앱 불필요

---

## 실전 활용 시나리오

### 시나리오 1: 코드 리뷰 자동화

**로컬 개발 (CLI):**

```bash
# 로컬에서 코드 리뷰
crewx query "@dev_assistant PR #123의 변경사항을 리뷰해줘"
```

**프로덕션 (API + Slack):**

```typescript
// GitHub Webhook → API → Slack 알림
app.post('/webhook/github/pr', async (req, res) => {
  const { pull_request } = req.body;

  // AI 에이전트로 코드 리뷰
  const review = await crewx.runAgent('prod_assistant', {
    input: `PR #${pull_request.number}를 리뷰해주세요`,
    mode: 'query',
  });

  // Slack으로 결과 전송
  await slack.postMessage({
    channel: '#code-review',
    text: `🤖 AI Code Review for PR #${pull_request.number}\n\n${review.content}`,
  });

  res.status(200).send('OK');
});
```

### 시나리오 2: 버그 자동 수정

**로컬 개발 (CLI):**

```bash
# 로컬에서 버그 수정
crewx execute "@dev_assistant src/api.ts의 null 참조 에러를 수정해줘"
```

**프로덕션 (API):**

```typescript
// 웹 대시보드에서 버그 수정 요청
app.post('/api/fix-bug', async (req, res) => {
  const { file, description } = req.body;

  const result = await crewx.runAgent('prod_assistant', {
    input: `${file}의 버그를 수정해주세요: ${description}`,
    mode: 'execute',
  });

  res.json({
    success: true,
    changes: result.toolCalls.filter(t => t.name === 'write_file'),
    message: result.content,
  });
});
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

### ✅ Phase 3: 웹서버 통합

- [ ] `@sowonai/crewx-sdk` 설치
- [ ] TypeScript/Node.js 웹서버 구현
- [ ] API 엔드포인트 생성 (`/api/agent/query`, `/api/agent/execute`)
- [ ] 커스텀 도구 개발 및 주입
- [ ] 프론트엔드 통합
- [ ] 프로덕션 배포

### ✅ Phase 4: Slack Bot (선택)

- [ ] Slack App 생성 (https://api.slack.com/apps)
- [ ] Bot Token 및 App Token 발급
- [ ] `.env.slack` 파일 설정
- [ ] `crewx slack` 명령으로 Bot 실행
- [ ] 팀원에게 사용법 공유

---

## 결론: "아! 이렇게 쉽게 프로덕션 배포가 가능하구나"

CrewX의 마이그레이션 경로는 명확합니다:

1. **로컬 개발**: CLI Provider로 빠르게 프로토타이핑
2. **프로덕션 전환**: API Provider로 마이그레이션
3. **웹 통합**: SDK를 사용해서 웹 애플리케이션에 녹이기
4. **팀 공유**: Slack Bot으로 전사 확대

**핵심 인사이트:**

✨ **동일한 crewx.yaml**: CLI와 API Provider 모두 동일한 설정 파일 사용
✨ **점진적 마이그레이션**: 로컬과 프로덕션을 병행하며 단계적으로 전환
✨ **유연한 배포**: CLI, API, Slack 모두 같은 에이전트 활용
✨ **확장 가능**: 커스텀 도구, MCP 서버로 무한 확장

이제 여러분도 로컬에서 개발한 AI 에이전트를 프로덕션 서비스에 바로 적용할 수 있습니다. CrewX와 함께 AI 팀을 구축하세요! 🚀

---

**다음 단계:**

- [CrewX GitHub Repository](https://github.com/sowonlabs/crewx)
- [API Provider 가이드](https://github.com/sowonlabs/crewx/blob/main/docs/api-provider-guide.md)
- [Slack 통합 가이드](https://github.com/sowonlabs/crewx/blob/main/SLACK_INSTALL.md)
