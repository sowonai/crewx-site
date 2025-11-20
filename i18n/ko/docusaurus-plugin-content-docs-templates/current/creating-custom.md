---
sidebar_position: 4
title: 사용자 정의 템플릿 생성하기
---

# 사용자 정의 템플릿 생성하기

팀이나 조직을 위한 자신만의 CrewX 템플릿을 만드는 방법을 알아봅시다.

## 🏢 사용자 정의 템플릿이 필요한 이유?

- **팀 전체 워크플로우 표준화**
- **사전 구성된 에이전트를 통한 모범 사례 공유**
- **준비된 프로젝트 구조로 온보딩 가속화**
- **프로젝트 설정 및 구성의 일관성 유지**

## 🚀 빠른 시작

### 1. Fork & Clone

```bash
git clone https://github.com/sowonlabs/crewx-templates
cd crewx-templates
```

### 2. 새 템플릿 생성

```bash
# 템플릿 디렉토리 생성
mkdir my-template
cd my-template

# 필수 파일 생성
touch crewx.yaml
touch README.md
```

### 3. 템플릿 메타데이터 정의

`crewx.yaml`을 편집합니다:

```yaml
metadata:
  name: "my-template"
  displayName: "My Template"
  description: "이 템플릿이 하는 작업에 대한 설명"
  version: "1.0.0"
  author: "Your Name"
  tags: ["category", "feature"]
  crewxVersion: ">=0.7.0"

agents:
  - id: "my_agent"
    name: "My Agent"
    description: "에이전트 설명"
    capabilities:
      - query
      - implementation
    inline:
      provider: "cli/claude"
      model: "sonnet"
      prompt: |
        당신은 ... 분야의 전문 에이전트입니다.
```

### 4. 템플릿 레지스트리 업데이트

저장소 루트의 `templates.json`을 편집합니다:

```json
{
  "version": "1.0.0",
  "templates": [
    {
      "name": "my-template",
      "displayName": "My Template",
      "description": "템플릿 설명",
      "version": "1.0.0",
      "path": "my-template",
      "author": "Your Name",
      "tags": ["category", "feature"],
      "crewxVersion": ">=0.7.0",
      "features": [
        "기능 1",
        "기능 2"
      ]
    }
  ]
}
```

## 📝 템플릿 구조

### 최소 템플릿

```
my-template/
├── crewx.yaml    # 필수: 에이전트 설정 + 메타데이터
└── README.md     # 필수: 사용 설명서
```

### 완전한 템플릿

```
my-template/
├── crewx.yaml           # 에이전트 설정
├── README.md            # 사용 설명서
├── .gitignore           # Git 무시 패턴
├── package.json         # Node.js 프로젝트용
├── docs/                # 문서
├── scripts/             # 자동화 스크립트
└── examples/            # 예제 파일
```

## 🤖 템플릿 매니저 에이전트 사용하기

템플릿 저장소에는 템플릿 생성을 자동화하는 `@template_manager` 에이전트가 포함되어 있습니다:

### 새 템플릿 생성

```bash
cd crewx-templates

crewx execute "@template_manager Create new template: my-template, description: 'My awesome template'"
```

**에이전트가 자동으로:**
- 템플릿 디렉토리 생성
- 메타데이터가 포함된 `crewx.yaml` 생성
- `README.md` 스텁 생성
- `templates.json` 업데이트

### 템플릿 검증

```bash
# 모든 템플릿 검증
crewx query "@template_manager Validate all templates and report issues"

# templates.json 동기화
crewx execute "@template_manager Sync templates.json with current templates"
```

## 📦 템플릿 게시하기

### 1. GitHub에 푸시

```bash
git remote set-url origin https://github.com/yourorg/crewx-templates
git add .
git commit -m "Add my-template"
git push
```

### 2. 팀 사용

```bash
# 사용자 정의 템플릿 저장소 설정
export CREWX_TEMPLATE_REPO=https://github.com/yourorg/crewx-templates

# 템플릿 사용
crewx template init my-template
```

### 3. 공식 저장소에 기여하기

1. [crewx-templates](https://github.com/sowonlabs/crewx-templates) 포크
2. 템플릿 생성
3. Pull Request 제출
4. 병합 후 모든 사람이 사용할 수 있게 됩니다!

## ✅ 템플릿 요구사항

### 필수 항목

- ✅ `metadata` 섹션이 포함된 `crewx.yaml`
- ✅ 사용 설명이 포함된 `README.md`
- ✅ 명확한 템플릿 설명
- ✅ 작동하는 에이전트 설정

### 권장 항목

- ✅ 예제 파일 또는 시작 코드
- ✅ 주요 기능에 대한 문서
- ✅ 필요한 경우 `.gitignore`
- ✅ Semver를 따르는 버전 번호

### 있으면 좋은 항목

- ✅ 자동화된 테스트
- ✅ CI/CD 설정
- ✅ 여러 에이전트 예제
- ✅ 스크린샷 또는 데모

## 💡 모범 사례

### 1. 명확한 문서

```markdown
# 템플릿 이름

## 작동 방식
간단한 설명

## 빠른 시작
```bash
crewx template init template-name
```

## 구성
커스터마이징 방법...
```

### 2. 집중된 에이전트

**하나의 특정 문제를 잘 해결하는** 에이전트를 생성합니다:

```yaml
agents:
  - id: "code_reviewer"
    name: "Code Reviewer"
    description: "코드를 모범 사례에 맞게 검토합니다"
    # 코드 검토에만 집중
```

### 3. 합리적인 기본값

좋은 기본값을 제공하고 커스터마이징을 허용합니다:

```yaml
metadata:
  name: "api-template"
  # 좋은 기본값
  port: 3000
  environment: "development"
```

### 4. 버전 호환성

최소 CrewX 버전을 지정합니다:

```yaml
metadata:
  crewxVersion: ">=0.7.0"
```

## 🔗 리소스

- [공식 템플릿](https://github.com/sowonlabs/crewx-templates)
- [CrewX 문서](/ko/docs/intro)
- [커뮤니티 논의](https://github.com/sowonlabs/crewx/discussions)

## 📄 라이선스

템플릿은 모든 라이선스를 사용할 수 있지만, 최대한의 공유를 위해 MIT를 권장합니다.
