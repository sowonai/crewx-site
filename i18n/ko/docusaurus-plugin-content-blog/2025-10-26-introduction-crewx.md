---
slug: introduction-crewx
title: CrewX로 멀티 AI 개발팀 구축하기
authors: [doha]
tags: [crewx, ai, tutorial, release]
---

# CrewX로 멀티 AI 개발팀 구축하기

프레임워크 간 프로젝트를 마이그레이션하면서 우리는 놀라운 발견을 했습니다: **만약 우리의 AI 도구들이 서로 대화할 수 있다면?** 4일 동안 두 프로젝트 사이를 오가며 Claude와 Copilot 사이에서 사람 중개자 역할을 하다가, 우리는 더 나은 방법이 필요하다는 것을 깨달았습니다. 그렇게 CrewX가 탄생했습니다.

<!--truncate-->

## 문제: 고립된 AI 도구들

대부분의 개발자들은 AI 어시스턴트를 고립된 상태로 사용합니다. 여기서는 Claude 채팅을 열고, 저기서는 GitHub Copilot 세션을 열고, 수동으로 그들 사이에서 지식을 전달합니다. 비효율적이고 시간이 오래 걸리며, 소중한 컨텍스트를 잃게 됩니다.

진짜 문제는 뭘까요? **우리의 AI 어시스턴트들은 협업할 수 없습니다.** 우리는 그들이 협업하기를 원합니다.

## 해결책: 멀티 AI 협업

우리는 기존의 `nestjs-mcp-adapter` 작업을 기반으로 단 2일 만에 CrewX를 구축했습니다. 결과는 이렇습니다: 서로 다른 페르소나를 가진 AI 에이전트들이 Slack과 CLI를 통해 서로 소통하며 여러 AI 모델 간의 작업을 동시에 조율할 수 있습니다.

```yaml
# CrewX 설정 예제
agents:
  - id: "developer"
    name: "Developer Agent"
    provider: "cli/claude"
    inline:
      model: "sonnet"
      prompt: |
        You are a senior developer focused on implementation
        and architecture decisions.

  - id: "qa"
    name: "QA Agent"
    provider: "cli/copilot"
    inline:
      prompt: |
        You are a QA engineer focused on testing strategies
        and quality assurance.
```

## 실제 사용 사례

### 1. 가상 개발팀

기존 AI 구독을 사용하여 완전한 개발팀을 구성하세요:

- **Claude** → 시니어 개발자
- **Copilot** → 구현 전문가
- **Gemini** → 성능 최적화 전문가
- **GLM** → 문서화 전문가
- **Codex** → 테스트 엔지니어

각 AI가 자신의 강점을 발휘합니다. 추가 비용 없음—단지 당신의 기존 구독들이 함께 작동할 뿐입니다.

**결과:** 고용 비용 없이 팀 생산성이 배가됩니다.

### 2. WBS 기반 개발 파이프라인

한 번 작업 분해 구조(Work Breakdown Structure)를 만든 후, 전체 워크플로우를 자동화하세요:

```bash
crewx execute "@crew prepare release tests for v2.0"
```

응답으로:
- Developer 에이전트가 요구사항을 분해
- QA 에이전트가 테스트 시나리오 설계
- 구현 에이전트가 테스트 코드 작성
- 커버리지 분석기가 완성도 검토
- 모두 병렬로 자동 실행됨

**절약된 시간:** 하루 개발 작업의 2~4시간.

### 3. 전략적 의사결정

고위급 토론을 위해 에이전트들을 특정 역할로 설정하세요:

**CSO 에이전트** (Chief Strategy Officer 역할)
- 시장 포지셔닝 분석
- 경쟁 환경 검토

**CLO 에이전트** (Chief Legal Officer 역할)
- 규정 준수 영향도 평가
- 위험 평가 검토

이 에이전트들은 Slack 스레드에서 전략을 논의하고, 자동으로 보고서를 생성하며, Obsidian과 동기화하여 지식을 관리합니다.

### 4. 자율 비트코인 시뮬레이터

지속적인 금융 분석을 위한 에이전트를 배포하세요:

- **매시간 실행** 최신 시장 데이터와 함께
- **여러 AI 모델**이 동시에 거래
- **성과 추적** 다양한 전략 간의
- **자가 개선:** 에이전트들이 자신의 거래로부터 학습

간단한 설정 하나로 24/7 무한한 분석 능력이 실행됩니다.

### 5. 원격 분산 에이전트

로컬 머신을 넘어 에이전트를 확장하세요:

```yaml
providers:
  - id: remote_research_server
    type: remote
    location: "https://research-server.example.com"
    external_agent_id: "research_team"
    auth:
      type: bearer
      token: "${REMOTE_TOKEN}"

agents:
  - id: "remote-researcher"
    provider: "remote/remote_research_server"
    description: "Research team on dedicated server"
```

원격 서버, 클라우드 인스턴스 또는 특수 하드웨어에서 실행되는 AI 도구에 접근하세요—로컬 워크플로우에 완벽하게 통합됩니다.

## CrewX의 장점

### BYOA: 자신의 AI 가져오기

당신은 이미 Claude Pro, GitHub Copilot, 또는 Gemini Advanced에 대한 비용을 지불하고 있습니다. 그 투자를 낭비하지 마세요.

CrewX는 기존 구독의 가치를 다음과 같이 증가시킵니다:
- 에이전트들이 병렬로 작동하도록 활성화
- 역할별로 전문화 가능
- 그들 간의 조율 자동화

**새로운 AI 비용 없음. 더 똑똑한 사용만 필요.**

### Slack 기반 협업

당신의 팀은 이미 Slack에서 생활합니다. CrewX는 대화가 발생하는 곳으로 AI를 직접 가져옵니다:

```bash
@CrewX prepare a technical proposal for the streaming feature
```

에이전트들이 조사하고, 토론하며, 채널에서 바로 결과를 전달합니다. 컨텍스트는 그대로 유지됩니다. 컨텍스트 전환이 필요 없습니다.

### 유연한 배포

당신의 워크플로우에 맞는 방식으로 CrewX를 사용하세요:

- **CLI 모드:** 로컬 개발 및 자동화
- **Slack 봇:** 팀 전체 AI 협업
- **MCP 서버:** IDE 통합 (VS Code, JetBrains)

## 시작하기

### 🚀 빠른 시작 (30초)

가장 빠른 시작 방법:

```bash
# 모든 것을 스캐폴딩하는 한 가지 명령어
npx crewx-quickstart

# 즉시 당신의 AI 팀과 대화하기
crewx query "@quickstart hi"
```

이것이 생성합니다:
- ✅ 사용 가능한 `@quickstart` 에이전트가 있는 `crewx.yaml`
- ✅ Slack 통합을 위한 `.env.slack` 템플릿
- ✅ 봇을 시작하는 `start-slack.sh` 스크립트
- ✅ 유용한 문서 및 예제

### 📦 수동 설정 (전체 제어)

모든 것을 직접 설정하고 싶으신가요?

```bash
# 1. CrewX를 전역으로 설치하기
npm install -g crewx

# 2. 당신의 프로젝트에서 초기화
crewx init

# 3. 설정 확인
crewx doctor
```

이것은 당신의 팀을 정의하는 `crewx.yaml` 파일을 생성합니다:

```yaml
# crewx.yaml
agents:
  - id: "analyst"
    name: "Data Analyst"
    provider: "cli/claude"
    inline:
      prompt: |
        You are a data analyst expert at finding insights.

  - id: "reporter"
    name: "Report Writer"
    provider: "cli/gemini"
    inline:
      prompt: |
        You are a technical writer skilled at clear communication.
```

### 4. 첫 번째 멀티 에이전트 워크플로우 실행

```bash
# 읽기 전용 분석
crewx query "@analyst @reporter analyze our Q3 metrics"

# 파일 생성/수정
crewx execute "@analyst @reporter analyze Q3 and draft a report"
```

## CrewX를 다르게 만드는 것

| 기능 | 전통적 AI | CrewX |
|---------|---|---|
| **모델 사용** | 한 번에 하나씩 | 병렬로 여러 개 |
| **에이전트 역할** | 일반적 | 전문화된 페르소나 |
| **협업** | 수동 핸드오프 | 자동 조율 |
| **비용** | 모델별 구독 | 이미 가진 것 사용 |
| **통합** | 고립된 채팅 창 | Slack, CLI, IDE |
| **커스터마이제이션** | 제한적 | YAML로 전체 제어 |

## 개발의 미래

CrewX는 근본적인 전환을 나타냅니다: **"나는 AI 도구를 사용한다"에서 "나는 AI 팀을 이끈다"로.**

당신의 AI 에이전트들이 개별적으로 똑똑할 필요는 없습니다—집단적으로 조율되어야 합니다. 그곳에서 지수적 생산성 향상이 나옵니다.

당신이:
- 복잡한 기능을 더 빠르게 구축
- 테스트 및 QA 자동화
- 데이터 기반 전략적 의사결정
- 지속적 분석 워크플로우 실행

...등의 작업을 하든, CrewX는 완전한 개발팀의 능력을 당신의 손끝에 줍니다.

---

## 당신의 AI 팀을 구축할 준비가 되셨나요?

```bash
# 30초 안에 시작하기
npx crewx-quickstart
crewx query "@quickstart hi"

# 또는 더 많은 제어를 위해 전역으로 설치
npm install -g crewx
crewx init

# 문서 탐색하기
crewx query "@claude what can I do with CrewX?"

# 멋진 것을 만들기
crewx execute "@your-team solve this problem"
```

**CrewX 커뮤니티에 참여하세요:**
- 📚 [전체 문서](/ko/docs/intro)
- 🐙 [GitHub 저장소](https://github.com/sowonlabs/crewx)

---

**당신은 AI 팀과 무엇을 만들까요?** CrewX 워크플로우와 성공 사례를 우리와 공유하세요!
