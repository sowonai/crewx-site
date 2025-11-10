---
sidebar_position: 5
---

# Skills 시스템

> Claude Code와 호환되는 재사용 가능한 AI 능력

CrewX Skills 시스템을 사용하면 에이전트가 호출할 수 있는 재사용 가능한 AI 능력을 만들 수 있습니다. Skills는 **Claude Code와 100% 호환**되므로 기존 Claude Code 스킬을 CrewX에서 바로 사용할 수 있습니다.

## Skills란?

Skills는 에이전트의 능력을 확장하는 특화된 기능입니다:
- **Query 스킬**: 읽기 전용 분석 및 검사 작업
- **Execute 스킬**: 파일 생성, 수정 및 시스템 작업
- **에이전트 간 공유**: 모든 에이전트가 사용 가능한 스킬을 호출 가능

## 빠른 시작

### 1. Skill 생성

`.claude/skills/` 디렉토리에 `.md` 파일 생성:

```bash
mkdir -p .claude/skills
```

예제 스킬 (`.claude/skills/code-review.md`):

```markdown
# Code Review Skill

다음 항목을 검토:
- 보안 취약점
- 성능 이슈
- 모범 사례
- 코드 스타일 일관성

구체적인 라인 번호와 함께 실행 가능한 피드백 제공.
```

### 2. Skill 등록

`crewx.yaml`에 추가:

```yaml
skills:
  - code-review  # 파일명과 일치: .claude/skills/code-review.md
  - test-generator
  - docs-writer
```

### 3. Skill 사용

이제 에이전트가 스킬을 호출할 수 있습니다:

```bash
crewx query "@claude src/auth.ts에 code-review 스킬 사용해줘"
crewx execute "@gemini LoginComponent에 test-generator 사용해줘"
```

## Claude Code 호환성

CrewX 스킬은 Claude Code와 완전히 호환됩니다:

1. **기존 Claude Code 스킬 사용** - `crewx.yaml`에 스킬 이름만 추가
2. **도구 간 스킬 공유** - 동일한 `.claude/skills/` 디렉토리 사용
3. **변환 불필요** - 스킬이 양쪽 도구에서 그대로 작동

### Claude Code Skills 사용하기

이미 `.claude/skills/`에 스킬이 있다면 바로 활성화:

```yaml
# crewx.yaml
skills:
  - my-existing-skill  # .claude/skills/my-existing-skill.md에서 가져옴
```

## Skill 정의 형식

Skills는 명확한 지침이 담긴 Markdown 파일입니다:

```markdown
# Skill 이름

이 스킬이 하는 일에 대한 간단한 설명.

## 사용 시기
- 시나리오 1
- 시나리오 2

## 지침
1. 단계별 프로세스
2. 예상 동작
3. 출력 형식

## 예제
[선택사항] 사용 예제
```

## 예제 Skills

### 코드 보안 감사

`.claude/skills/security-audit.md`:

```markdown
# Security Audit Skill

종합적인 보안 분석 수행:

## 검사 항목
- SQL 인젝션 취약점
- 사용자 입력의 XSS 위험
- 인증/인가 결함
- 민감한 데이터 노출
- 의존성 취약점

## 출력
각 이슈마다 다음을 포함:
- 심각도 (High/Medium/Low)
- 파일 및 라인 번호
- 설명
- 수정 권장사항
```

### API 문서 생성기

`.claude/skills/api-docs.md`:

```markdown
# API Documentation Generator

코드에서 OpenAPI/Swagger 문서 생성.

## 프로세스
1. 모든 API 엔드포인트 식별
2. 요청/응답 스키마 추출
3. 인증 요구사항 문서화
4. OpenAPI 3.0 스펙 생성
5. 예제 요청 생성

## 형식
OpenAPI 3.0 표준을 따르는 `openapi.yaml`로 출력.
```

## 설정

### 전역 Skills

모든 에이전트가 사용할 수 있도록 `crewx.yaml`에 정의:

```yaml
skills:
  - code-review
  - test-generator
  - security-audit
```

### 에이전트별 Skills

특정 에이전트로 스킬 제한:

```yaml
agents:
  - id: "security_expert"
    skills:
      - security-audit
      - vulnerability-scan
    inline:
      provider: "cli/claude"
      prompt: |
        당신은 보안 전문가입니다. 철저한 분석을 위해 사용 가능한 스킬을 활용하세요.
```

## Skill 호출

에이전트가 적절한 경우 자동으로 스킬을 감지하고 사용:

```bash
# 명시적 호출
crewx query "@claude src/에 security-audit 스킬 사용해줘"

# 암묵적 (에이전트가 결정)
crewx query "@claude 인증 코드의 보안 이슈 확인해줘"
```

## 모범 사례

### 1. 명확한 이름
설명적이고 행동 지향적인 이름 사용:
- ✅ `api-docs-generator`
- ✅ `database-migration-helper`
- ❌ `helper`
- ❌ `util`

### 2. 단일 책임
각 스킬은 하나의 명확한 목적을 가져야 함:

```markdown
# ✅ 좋음: 구체적인 작업
# Database Schema Migration

스키마 변경에 대한 SQL 마이그레이션 스크립트 생성.
```

```markdown
# ❌ 너무 광범위
# Database Helper

다양한 데이터베이스 작업 수행.
```

### 3. 실행 가능한 지침
단계별 가이드 제공:

```markdown
## 프로세스
1. 현재 스키마 분석
2. 차이점 식별
3. ALTER 문 생성
4. 롤백 스크립트 생성
5. 버전화된 마이그레이션 파일로 출력
```

### 4. 예제 출력
예상 결과 표시:

```markdown
## 예제 출력

```sql
-- Migration: 20250111_add_users_table.sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL
);
```
```

## Skills 공유

`.claude/skills/`의 스킬은 자동으로 다음에서 사용 가능:
- CrewX 에이전트
- Claude Code (VS Code 확장)
- 스킬 규칙을 준수하는 모든 도구

이는 다음을 의미합니다:
1. 스킬을 한 번만 생성
2. 여러 도구에서 사용
3. git을 통해 팀과 공유

## Skills vs. Agents

| 특징 | Skills | Agents |
|------|--------|--------|
| 목적 | 재사용 가능한 능력 | 전체 워크플로우 오케스트레이션 |
| 범위 | 특정 작업 | 일반적인 문제 해결 |
| 호출 | 에이전트가 호출 | 사용자가 호출 |
| 컨텍스트 | 작업별 | 프로젝트 전체 |

**Skills를 사용해야 할 때:**
- 명확한 단계가 있는 반복 작업
- 특화된 도메인 지식
- 일관된 출력 형식이 필요한 경우

**Agents를 사용해야 할 때:**
- 복잡한 다단계 워크플로우
- 의사 결정이 필요한 경우
- 동적인 문제 해결

## 문제 해결

### Skill을 찾을 수 없음

```bash
Error: Skill 'my-skill' not found
```

**해결책:**
1. 파일 존재 확인: `.claude/skills/my-skill.md`
2. `crewx.yaml`에 스킬이 등록되었는지 확인
3. 파일명이 정확히 일치하는지 확인 (대소문자 구분)

### Skill이 예상대로 작동하지 않음

**해결책:**
1. 스킬 정의의 명확성 검토
2. 더 구체적인 지침 추가
3. 예제 입력/출력 포함
4. 명시적 호출로 먼저 테스트

## 고급 사용법

### 조건부 Skills

환경에 따라 스킬 활성화:

```yaml
skills:
  - code-review
  - test-generator
  {{#if (eq env.NODE_ENV "production")}}
  - deployment-checker
  {{/if}}
```

### Skill 체이닝

에이전트가 여러 스킬을 자동으로 체인:

```bash
# 에이전트가 여러 스킬을 자동으로 사용
crewx execute "@claude
  1. security-audit으로 코드 확인
  2. 실패 케이스에 test-generator 사용
  3. 최종 검증을 위해 code-review 사용
"
```

## 다음 단계

- 📖 [Template System](./templates.md) - 동적 프롬프트 및 지식 관리
- 🎨 [Layout System](./layouts.md) - 재사용 가능한 프롬프트 템플릿
- ⚙️ [Agent Configuration](../configuration/agents.md) - 고급 에이전트 설정

---

**관련 자료:**
- [Claude Code Skills 문서](https://docs.anthropic.com/claude-code/skills)
