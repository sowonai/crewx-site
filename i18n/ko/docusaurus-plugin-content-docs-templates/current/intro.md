---
sidebar_position: 1
title: 소개
---

import TemplateCard from '@site/src/components/TemplateCard';

# 🚀 CrewX 템플릿

**미리 구성된 템플릿 모음**으로 CrewX 프로젝트를 빠르게 시작할 수 있습니다.

## 📦 사용 가능한 템플릿

<div className="row">
  <div className="col col--6">
    <TemplateCard
      name="wbs-automation"
      displayName="WBS Automation"
      description="작업 분해 구조(WBS) 기반 프로젝트 자동화 템플릿"
      version="1.0.0"
      author="SowonLabs"
      tags={["automation", "wbs", "project-management", "coordinator"]}
      features={[
        "코디네이터 에이전트가 자동으로 작업 실행",
        "단계별 병렬 처리",
        "Git 기반 시간 추적",
        "1시간 간격 자동화 루프"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
  <div className="col col--6">
    <TemplateCard
      name="docusaurus-i18n"
      displayName="Docusaurus i18n"
      description="AI 기반 자동 번역이 포함된 Docusaurus 사이트 템플릿 (한국어 ↔ 영어)"
      version="1.0.0"
      author="SowonLabs"
      tags={["docusaurus", "i18n", "translation", "documentation", "blog"]}
      features={[
        "Docusaurus 3.9.2 고정 버전",
        "미리 구성된 한국어/영어 i18n",
        "자동 번역 스크립트",
        "CrewX 번역 에이전트 포함",
        "한 번 작성하고 두 언어로 발행"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
</div>

<div className="row" style={{marginTop: '1rem'}}>
  <div className="col col--6">
    <TemplateCard
      name="crewx-skill"
      displayName="CrewX Skill"
      description="CrewX CLI 프레임워크 지원을 위한 Claude Code 스킬"
      version="1.0.0"
      author="SowonLabs"
      tags={["claude-code", "skill", "assistant", "documentation"]}
      features={[
        "자동 활성화되는 CrewX 전문가 스킬",
        "완전한 명령 참조",
        "구성 가이드",
        "멀티 AI 워크플로우 추천",
        "문제 해결 지원"
      ]}
      crewxVersion=">=0.7.0"
    />
  </div>
</div>

---

## 📖 빠른 시작

### 템플릿 설치

```bash
# 1. 템플릿 설치
crewx template init [template-name]

# 2. 디렉토리로 이동
cd [template-name]

# 3. 구성 확인
cat crewx.yaml

# 4. 에이전트 실행
crewx agent ls                    # 사용 가능한 에이전트 나열
crewx q "@agent_name question"    # 쿼리 모드
crewx x "@agent_name task"        # 실행 모드
```

### 특정 디렉토리에 설치

```bash
# 기존 프로젝트에 템플릿 적용
cd my-project
crewx template init wbs-automation
```

---

## 🔗 템플릿 저장소

모든 템플릿은 공식 저장소에서 관리합니다:

👉 [github.com/sowonlabs/crewx-templates](https://github.com/sowonlabs/crewx-templates)
