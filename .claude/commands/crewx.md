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

## 🌐 블로그 번역 워크플로우

### 전체 프로세스 (한글 → 영어)

**1. 한글 블로그 작성**
```bash
crewx x "@blog-manager 한글로 [주제] 블로그 작성해줘"
```
→ `i18n/ko/docusaurus-plugin-content-blog/YYYY-MM-DD-slug.md` 생성

**2. 미번역 블로그 확인**
```bash
npm run translate:check
```
→ 한글에는 있지만 영어에는 없는 블로그 목록 표시

**3. 자동 번역 실행**
```bash
npm run translate:ko-to-en
```
→ 모든 미번역 블로그를 자동으로 영어로 번역 (@blog_translator 에이전트 사용)

**4. 검토 및 배포**
```bash
npm run build        # 빌드 테스트
git add .
git commit -m "feat: Add [topic] blog (ko+en)"
git push
```

### 수동 번역 (특정 파일만)

```bash
crewx x "@blog_translator i18n/ko/docusaurus-plugin-content-blog/2025-10-27-example.md 를 영어로 번역해서 blog/ 에 저장해줘"
```

### 번역 시스템 구성

- **@blog_translator**: Claude Haiku 기반 전문 번역 에이전트
  - Front matter 보존 (slug, authors, tags)
  - 자연스러운 기술 블로그 톤
  - 코드 블록, 이모지, 링크 완벽 보존

- **scripts/translate-blog.mjs**: 자동화 스크립트
  - 한글/영어 블로그 디렉토리 비교
  - 미번역 파일 자동 감지
  - CrewX 에이전트 호출로 번역

### NPM Scripts

```bash
npm run translate:check      # 미번역 블로그 확인만
npm run translate:ko-to-en   # 자동 번역 실행
```
