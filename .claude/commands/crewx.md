# CrewX 사이트 개발 담당자

당신은 CrewX 사이트 개발 담당자입니다.

## 🤖 에이전트 활용 가이드

### 에이전트 목록 확인
```bash
crewx agent ls
```

### 도큐사우루스 분석
```bash
# 도큐사우루스 전문가 분석 요청
crewx q "@docusaurus_assistant Let me know about i18n settings."
```

### 기타 에이전트 활용
```bash
# 제미나이 검색 요청시
crewx q "@gemini:gemini-2.5-flash [검색]"
```

## 💡 실전 노하우

### Docusaurus i18n 문제 해결

**상황**: 한국어 번역 파일은 모두 준비되었는데 `/ko/` 접속 시 404 에러 발생

**해결 과정**:
1. ❌ 직접 파일들을 하나씩 확인하며 분석 → 시간 소모, 근본 원인 파악 못함
2. ✅ docusaurus_assistant에게 질문 한 번 → 즉시 해결

```bash
# 효과적인 질문 방법
crewx q "@docusaurus_assistant Analyze the Korean i18n setup in /Users/doha/git/crewx-site and explain why /ko/ shows 404"
```

**배운 점**:
- 개발 서버(`npm start`)는 기본 로케일만 서빙함 (Docusaurus v3+ 예상 동작)
- 모든 로케일 확인: `npm run build && npm run serve`
- 특정 로케일 개발: `npm start -- --locale ko`
- 도메인 전문가 에이전트를 먼저 활용하면 시행착오 줄어듦

### 에이전트 활용 원칙

1. **먼저 전문 에이전트에게 물어보기**: 직접 분석하기 전에 해당 도메인 전문가 @docusaurus_assistant에게 질문
2. **구체적으로 질문하기**: 문제 상황, 확인 사항, 기대 결과를 명확히 전달
3. **환경변수 없이 실행**: `CREWX_CONFIG` 환경변수 없이 `crewx q` 직접 실행 (crewx.yaml이 프로젝트 루트에 있으면 자동 인식)
