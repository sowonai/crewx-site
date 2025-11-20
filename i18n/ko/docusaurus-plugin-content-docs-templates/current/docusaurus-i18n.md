---
sidebar_position: 3
title: Docusaurus i18n
---

# Docusaurus i18n 템플릿

AI 기반 자동 번역 워크플로우(한국어 ↔ 영어)가 포함된 Docusaurus 사이트 템플릿입니다.

## 🎯 개요

이 템플릿은 완전한 i18n 설정과 AI 기반 번역 자동화 기능이 포함된 즉시 사용 가능한 Docusaurus 사이트를 제공합니다. 한 번만 한국어로 콘텐츠를 작성하면 영어로 자동 번역됩니다.

## ✨ 주요 기능

- **고정된 Docusaurus 버전**: 안정성을 위해 3.9.2로 고정됨
- **사전 구성된 i18n**: 한국어 및 영어 로케일 바로 사용 가능
- **자동 번역 스크립트**: 한 명령어로 모든 콘텐츠 번역
- **번역 에이전트**: `@blog_translator`와 `@doc_translator` 포함
- **한 번 작성, 두 번 배포**: 단일 소스, 다중 언어

## 🚀 빠른 시작

### 설치

```bash
crewx template init docusaurus-i18n
cd docusaurus-i18n
npm install
```

### 개발

```bash
# 개발 서버 시작 (기본 로케일)
npm start

# 특정 로케일로 시작
npm start -- --locale ko

# 모든 로케일 빌드
npm run build && npm run serve
```

### 번역 워크플로우

#### 1. 한국어 콘텐츠 작성

```bash
# 한국어 블로그 작성
crewx x "@blog_manager 기능 소개 블로그를 한국어로 작성해줘"
```

#### 2. 영어로 자동 번역

```bash
# 미번역 콘텐츠 확인
npm run translate:check

# 모두 번역
npm run translate:ko-to-en
```

#### 3. 배포

```bash
npm run build
git add .
git commit -m "feat: Add new blog (ko+en)"
git push
```

## 📋 템플릿 구조

```
docusaurus-i18n/
├── blog/                   # 영어 블로그 포스트
├── docs/                   # 영어 문서
├── i18n/ko/               # 한국어 번역
│   ├── docusaurus-plugin-content-blog/
│   └── docusaurus-plugin-content-docs/
├── src/                   # React 컴포넌트
├── static/                # 정적 자산
├── crewx.yaml            # 에이전트 구성
├── docusaurus.config.ts  # Docusaurus 설정
└── package.json          # 의존성
```

## 🤖 포함된 에이전트

- **@blog_manager**: 블로그 콘텐츠 작성 (한국어 우선)
- **@blog_translator**: 전문 블로그 번역
- **@doc_translator**: 문서 번역
- **@template_page_manager**: 템플릿 페이지 관리

## 🔧 설정

### 새 로케일 추가

`docusaurus.config.ts` 편집:

```typescript
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ko', 'ja'], // 'ja' 추가
}
```

### 번역 커스터마이징

`crewx.yaml`의 에이전트 프롬프트를 편집하여 번역 스타일을 조정하세요.

## 📦 요구사항

- Node.js >= 20.0
- npm >= 8.0
- CrewX >= 0.7.0

## 💡 사용 사례

- **기술 문서**: 다국어 문서 사이트
- **개발자 블로그**: 글로벌 및 로컬 대상층 도달
- **제품 사이트**: 다양한 언어로 기능 소개
- **오픈소스 프로젝트**: 여러 언어로 커뮤니티 문서

## 🔗 리소스

- [템플릿 저장소](https://github.com/sowonlabs/crewx-templates/tree/main/docusaurus-i18n)
- [Docusaurus i18n 가이드](https://docusaurus.io/docs/i18n/introduction)
- [이 사이트](https://github.com/sowonlabs/crewx-site) - 이 템플릿으로 구축됨!
