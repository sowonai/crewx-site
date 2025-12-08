import React from 'react';
import Layout from '@theme/Layout';
import TemplateCard from '@site/src/components/TemplateCard';
import styles from './templates.module.css';

export default function Templates(): JSX.Element {
  return (
    <Layout
      title="템플릿"
      description="CrewX 템플릿 - 빠르게 시작할 수 있는 사전 구성된 템플릿">
      <main className={styles.templatesPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>🚀 CrewX 템플릿</h1>
            <p className={styles.subtitle}>
              CrewX 프로젝트를 빠르게 시작할 수 있도록 도와주는 <strong>사전 구성된 템플릿 모음</strong>입니다.
            </p>
          </div>

          <section className={styles.templatesSection}>
            <h2>📦 사용 가능한 템플릿</h2>
            <div className={styles.templateGrid}>
              <TemplateCard
                name="wbs-automation"
                displayName="WBS 자동화"
                description="WBS (Work Breakdown Structure) 기반 프로젝트 자동화 템플릿"
                version="1.0.0"
                author="SowonLabs"
                tags={["automation", "wbs", "project-management", "coordinator"]}
                features={[
                  "자동 태스크 실행을 위한 코디네이터 에이전트",
                  "단계별 병렬 실행",
                  "Git 기반 시간 추적",
                  "1시간 간격 자동화 루프"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="docusaurus-i18n"
                displayName="Docusaurus i18n"
                description="AI 기반 자동 번역이 포함된 Docusaurus 사이트 템플릿 (한국어 ↔ 영어)"
                version="1.0.0"
                author="SowonLabs"
                tags={["docusaurus", "i18n", "translation", "documentation", "blog"]}
                features={[
                  "Docusaurus 3.9.2 고정 버전",
                  "한국어/영어 i18n 사전 구성",
                  "자동 번역 스크립트",
                  "CrewX 번역 에이전트 포함",
                  "한 번 작성, 두 언어로 배포"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="crewx-skill"
                displayName="CrewX Skill"
                description="CrewX CLI 프레임워크 지원을 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["claude-code", "skill", "assistant", "documentation"]}
                features={[
                  "자동 활성화되는 CrewX 전문가 스킬",
                  "완전한 명령어 레퍼런스",
                  "설정 가이드",
                  "멀티 AI 워크플로우 권장사항",
                  "문제 해결 지원"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="gmail-skill"
                displayName="Gmail Skill"
                description="Gmail 연동 및 이메일 관리를 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["gmail", "email", "skill", "google"]}
                features={[
                  "Gmail API 연동",
                  "이메일 발송 및 읽기",
                  "메시지 관리",
                  "라벨 구성"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="google-calendar-skill"
                displayName="Google Calendar Skill"
                description="Google Calendar 연동을 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["calendar", "scheduling", "skill", "google"]}
                features={[
                  "Google Calendar API 연동",
                  "이벤트 생성 및 관리",
                  "일정 조회",
                  "회의 조율"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="google-drive-skill"
                displayName="Google Drive Skill"
                description="Google Drive 파일 관리를 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["drive", "storage", "skill", "google"]}
                features={[
                  "Google Drive API 연동",
                  "파일 업로드 및 다운로드",
                  "폴더 관리",
                  "공유 및 권한 설정"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="notion-skill"
                displayName="Notion Skill"
                description="Notion 워크스페이스 연동을 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["notion", "productivity", "skill", "database"]}
                features={[
                  "Notion API 연동",
                  "페이지 및 데이터베이스 관리",
                  "콘텐츠 동기화",
                  "쿼리 및 업데이트 기능"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="image-resizer-skill"
                displayName="Image Resizer Skill"
                description="이미지 크기 조정 및 최적화를 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["image", "resize", "skill", "media"]}
                features={[
                  "이미지 크기 조정",
                  "포맷 변환",
                  "일괄 처리",
                  "품질 최적화"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="ocr-extractor-skill"
                displayName="OCR Extractor Skill"
                description="이미지에서 텍스트 추출을 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["ocr", "text-extraction", "skill", "vision"]}
                features={[
                  "OCR 텍스트 추출",
                  "다국어 지원",
                  "이미지 전처리",
                  "높은 정확도 인식"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="md-to-pdf-skill"
                displayName="Markdown to PDF Skill"
                description="Markdown을 PDF로 변환하는 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["markdown", "pdf", "skill", "conversion"]}
                features={[
                  "Markdown을 PDF로 변환",
                  "커스텀 스타일링 지원",
                  "목차 자동 생성",
                  "구문 강조"
                ]}
                crewxVersion=">=0.7.0"
              />
              <TemplateCard
                name="slack-upload-skill"
                displayName="Slack Upload Skill"
                description="Slack 파일 업로드 및 메시징을 위한 Claude Code 스킬"
                version="1.0.0"
                author="SowonLabs"
                tags={["slack", "upload", "skill", "messaging"]}
                features={[
                  "Slack API 연동",
                  "채널에 파일 업로드",
                  "메시지 게시",
                  "채널 관리"
                ]}
                crewxVersion=">=0.7.0"
              />
            </div>
          </section>

          <section className={styles.quickStartSection}>
            <h2>📖 빠른 시작</h2>

            <div className={styles.instructions}>
              <h3>템플릿 설치</h3>
              <pre><code>{`# 1. 템플릿 설치
crewx template init [템플릿-이름]

# 2. 디렉토리로 이동
cd [템플릿-이름]

# 3. 설정 확인
cat crewx.yaml

# 4. 에이전트 실행
crewx agent ls                    # 사용 가능한 에이전트 목록
crewx q "@agent_name 질문"        # 쿼리 모드
crewx x "@agent_name 태스크"      # 실행 모드`}</code></pre>

              <h3>특정 디렉토리에 설치</h3>
              <pre><code>{`# 기존 프로젝트에 템플릿 적용
cd my-project
crewx template init wbs-automation`}</code></pre>
            </div>
          </section>

          <section className={styles.repositorySection}>
            <h2>🔗 템플릿 저장소</h2>
            <p>
              모든 템플릿은 공식 저장소에서 관리됩니다:
            </p>
            <p>
              👉 <a href="https://github.com/sowonlabs/crewx-templates" target="_blank" rel="noopener noreferrer">
                github.com/sowonlabs/crewx-templates
              </a>
            </p>
          </section>
        </div>
      </main>
    </Layout>
  );
}
