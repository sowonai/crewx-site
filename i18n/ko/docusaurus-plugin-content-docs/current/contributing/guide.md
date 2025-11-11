# CrewX에 기여하기

기여해주셔서 감사합니다! 이 가이드는 CrewX 모노레포 워크플로우를 소개하여 여러분의 변경사항이 CLI와 SDK 패키지에 자연스럽게 적용될 수 있도록 합니다.

## 📦 프로젝트 개요
- **패키지**: `packages/sdk` (Apache-2.0 + CLA) 및 `packages/cli` (MIT)
- **빌드 도구**: TypeScript, NestJS CLI, npm 워크스페이스
- **주요 문서**: 기술 문서는 [CrewX GitHub 저장소](https://github.com/sowonlabs/crewx)를 참고하세요

시작하기 전에 [행동 강령](https://github.com/sowonlabs/crewx/blob/main/CODE_OF_CONDUCT.md)을 읽고 [기여자 라이선스 계약](https://github.com/sowonlabs/crewx/blob/main/docs/CLA.md)에 서명해주세요.

## ✅ 사전 요구사항
- Node.js 20+
- npm 10+
- Git
- TypeScript 및 npm 워크스페이스에 대한 이해

## 🚀 시작하기
```bash
# 1. Fork 후 clone
$ git clone https://github.com/<your-username>/crewx.git
$ cd crewx

# 2. 의존성 설치 (모든 워크스페이스 설치)
$ npm install

# 3. 전체 빌드 실행 (SDK → CLI)
$ npm run build

# 4. 테스트 실행 (아래에서 더 많은 명령어 참조)
$ npm test
```

### 워크스페이스 단축 명령어
```bash
# SDK만
npm run build:sdk
npm test --workspace @sowonai/crewx-sdk

# CLI만
npm run build:cli
npm test --workspace crewx
```

## 🔐 기여자 라이선스 계약 (CLA)
- 모든 기여자는 pull request가 병합되기 전에 CLA에 서명해야 합니다.
- 개인은 첫 번째 pull request에서 봇 지침을 따라 직접 서명할 수 있습니다.
- 기업 기여자는 서명된 `docs/CLA.md` 복사본을 `legal@sowonlabs.com`으로 이메일로 보내주세요.

## 🌱 브랜치 전략
| 변경 유형 | 브랜치 접두사 | 예시 |
|----------|-------------|------|
| 기능 / 개선사항 | `feature/` | `feature/runtime-config` |
| 버그 수정 | `bugfix/` | `bugfix/cli-thread-history` |
| 잡무 / 문서 / 도구 | `chore/` | `chore/update-readme` |

내부 유지보수자는 병렬 버그 수정 브랜치를 위해 git 워크트리를 사용할 수 있지만, 외부 기여자는 자신의 포크에서 표준 브랜치로 작업할 수 있습니다.

## ✍️ 커밋 가이드라인
changelog 자동화를 건강하게 유지하기 위해 [Conventional Commits](https://www.conventionalcommits.org/)를 따릅니다.

```
<type>[optional scope]: <description>

feat(cli): add quickstart wizard
fix(sdk): guard undefined provider id
docs: clarify CLA flow
```

- 주요 타입: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `build`
- 변경이 특정 패키지를 대상으로 할 때는 스코프 (`cli`, `sdk`, `repo` 등)를 사용하세요.
- 설명은 72자 이하로 유지하세요.

## 🧪 테스팅 체크리스트
PR을 제출하기 전에:
1. `npm run build` (또는 영향받는 워크스페이스 빌드)
2. 관련 단위/통합 테스트
   ```bash
   npm test --workspace @sowonai/crewx-sdk
   npm test --workspace crewx
   ```
3. 동작이 변경될 때는 테스트를 업데이트하거나 생성하세요.
4. TypeScript 소스를 수정했다면 `npm run lint`를 실행하세요.

## 🔄 Pull Request 기대사항
모든 PR은 다음을 포함해야 합니다:
- 해당할 때 관련 이슈 또는 WBS 항목 참조.
- 변경사항과 동기에 대한 명확한 요약.
- 교차 패키지 영향 (CLI ↔ SDK) 언급.
- CLA 상태 확인 (처음 기여하는 경우).
- CI 통과 (빌드 + 테스트). 실패한 체크는 검토를 차단합니다.

유지보수자는 병합 전에 최소 **1개의 승인 검토**를 요구합니다. 중요한 변경사항은 2개의 검토 또는 `OWNERS.md` (곧 출시)에 나열된 패키지 담당자의 서명이 필요할 수 있습니다.

## 🐛 이슈 보고
GitHub 이슈 템플릿을 사용하여 분류를 돕습니다:
- **버그 보고** – 재현 단계, 워크스페이스 (`cli`/`sdk`), 버전 (`npm view crewx version`), 로그 포함.
- **기능 요청** – 문제, 제안, 대안, 예상 영향 설명.
- **질문 / 지원** – 질문 템플릿을 선택하거나 GitHub Discussions 사용.

이슈가 CLI 사용, SDK API, 또는 둘 다에 영향을 미치는지 명시해주세요.

## 📦 릴리스 & 버전 관리 참고사항
- SDK는 `0.1.x`부터 시작하는 의미체계적 버전 관리 (SemVer)를 사용합니다.
- CLI는 `crewx` npm 패키지로 배포되며 `workspace:*`를 통해 SDK에 의존합니다.
- 주요 변경사항은 문서 업데이트 및 지원 중단 알림이 필요합니다.
- 릴리스 워크플로우 세부사항은 [GitHub 저장소](https://github.com/sowonlabs/crewx)를 참조하세요.

## 🔎 검토 기준
유지보수자는 다음을 확인합니다:
- 프로젝트 아키텍처 목표와의 정렬
- 하위 호환성 및 마이그레이션 지침
- 새로운 동작을 검증하거나 회귀를 방지하는 테스트
- 새로운 공개 API 또는 플래그에 대한 문서 업데이트

## 📣 커뮤니케이션
- 모든 기술 논의는 GitHub Issues / PRs
- 보안 공개는 `security@sowonlabs.com`으로
- 커뮤니티 채팅 (곧 출시)은 행동 강령을 따를 예정입니다

CrewX에 기여해주셔서 다시 한번 감사합니다! 🚀
