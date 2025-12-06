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
