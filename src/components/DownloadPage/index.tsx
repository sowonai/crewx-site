import React from 'react';
import styles from '@site/src/pages/download.module.css';
import manifest from '@site/data/download-manifest.json';

const ISSUES_URL = 'https://github.com/sowonlabs/crewx/issues/new/choose';
const RELEASES_URL = 'https://github.com/sowonlabs/crewx/releases';
const DOWNLOAD_PAGE_URL = 'https://www.crewx.dev/download';

type DesktopRelease = {
  tag: string;
  version: string;
  prerelease: boolean;
  publishedAt: string;
  htmlUrl: string;
  windows: {
    assetName: string;
    url: string;
    sizeBytes: number;
  };
};

type Manifest = {
  generatedAt: string;
  repo: string;
  stable: DesktopRelease | null;
  preview: DesktopRelease | null;
};

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(0)} MB`;
}

type Locale = 'en' | 'ko';

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Download CrewX',
    subtitle: 'CrewX Desktop for Windows — a native app for your AI agent team, no terminal required.',
    mobileNotice:
      "You're on a phone. CrewX Desktop is a Windows PC app. Open this address on your PC to install it:",
    platformBadge: 'Windows x64',
    stableCta: 'Download for Windows',
    previewCta: 'Download preview (RC) for Windows',
    previewOnlyNote:
      "There's no stable release yet — this is a preview (release candidate) build for people willing to try it early. Expect rough edges.",
    notReadyTitle: 'Windows installer not published yet',
    notReadyBody:
      "We haven't published a Desktop Setup.exe yet, so there's nothing real to link to here. Check the GitHub Releases page for the current status, or use the CrewX CLI in the meantime.",
    trialLabel: 'Free',
    versionLabel: 'Version',
    sizeLabel: 'Size',
    changelogLink: 'Changelog',
    reportLink: 'Report a problem',
    macNotice: 'macOS: in progress, not yet available.',
    installGuideHeading: 'Install & first run',
    installStep1Title: 'Run the installer',
    installStep1Body: 'Download Setup.exe above and run it. No Node.js or npm required — the Desktop app is self-contained.',
    installStep2Title: 'First launch',
    installStep2Body:
      "CrewX starts a local server on first launch; give it a few seconds. If it doesn't come up, the app shows a retry/diagnose option instead of a blank screen.",
    installStep3Title: 'Connect an AI provider',
    installStep3Body:
      "The app runs without Node/npm, but it still needs an AI provider account connected (Claude, GPT, etc.) before it can answer anything — connecting an AI account is a separate step from installing the app.",
    reportHeading: 'Something not working?',
    reportBody: "This links to our public GitHub Issues. Please include your version, Windows build, and steps to reproduce — and please don't paste tokens or private conversation content.",
  },
  ko: {
    title: 'CrewX 다운로드',
    subtitle: 'Windows용 CrewX Desktop — 터미널 없이 AI 에이전트 팀을 쓰는 네이티브 앱입니다.',
    mobileNotice: '휴대폰에서 접속하셨네요. CrewX Desktop은 Windows PC용 앱입니다. PC에서 아래 주소로 접속해 설치하세요:',
    platformBadge: 'Windows x64',
    stableCta: 'Windows용 다운로드',
    previewCta: 'Windows용 체험판(RC) 다운로드',
    previewOnlyNote: '아직 정식 버전은 없습니다 — 먼저 써보고 싶은 분들을 위한 체험판(RC)입니다. 미흡한 부분이 있을 수 있습니다.',
    notReadyTitle: 'Windows 설치본이 아직 공개되지 않았습니다',
    notReadyBody:
      '아직 Desktop용 Setup.exe를 배포하지 않아 여기에 실제로 연결할 다운로드가 없습니다. 현재 상태는 GitHub Releases 페이지에서 확인하시거나, 그동안 CrewX CLI를 이용해 주세요.',
    trialLabel: '무료',
    versionLabel: '버전',
    sizeLabel: '크기',
    changelogLink: '변경 내역',
    reportLink: '문제 신고',
    macNotice: 'macOS: 준비 중이며 아직 제공되지 않습니다.',
    installGuideHeading: '설치 및 첫 실행',
    installStep1Title: '설치 파일 실행',
    installStep1Body: '위에서 Setup.exe를 내려받아 실행하세요. Node.js나 npm 설치가 필요하지 않습니다 — Desktop 앱은 그 자체로 완결되어 있습니다.',
    installStep2Title: '첫 실행',
    installStep2Body: '첫 실행 시 CrewX가 로컬 서버를 띄웁니다. 몇 초 정도 기다려 주세요. 서버가 뜨지 않으면 빈 화면 대신 재시도·진단 안내가 표시됩니다.',
    installStep3Title: 'AI provider 연결',
    installStep3Body: '앱 실행 자체에는 Node/npm이 필요 없지만, 실제로 응답을 받으려면 별도로 AI provider 계정(Claude, GPT 등)을 연결해야 합니다 — 앱 설치와 AI 계정 연결은 서로 다른 단계입니다.',
    reportHeading: '문제가 있나요?',
    reportBody: '아래 링크는 공개 GitHub Issues로 연결됩니다. 버전, Windows 빌드, 재현 절차를 함께 남겨 주세요 — 토큰이나 개인 대화 내용은 남기지 말아 주세요.',
  },
};

export default function DownloadPage({locale}: {locale: Locale}): React.ReactElement {
  const t = STRINGS[locale];
  const m = manifest as Manifest;
  const primary = m.stable ?? m.preview;

  return (
    <>
      <main className={styles.downloadPage}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{t.title}</h1>
            <p className={styles.subtitle}>{t.subtitle}</p>
          </div>

          <div className={styles.mobileNotice}>
            {t.mobileNotice}
            <span className={styles.mobileNoticeUrl}>{DOWNLOAD_PAGE_URL}</span>
          </div>

          <div className={styles.downloadCard}>
            <div className={styles.platformBadge}>{t.platformBadge}</div>

            {primary ? (
              <>
                <a className={styles.primaryButton} href={primary.windows.url}>
                  {primary === m.stable ? t.stableCta : t.previewCta}
                </a>
                {primary === m.preview && <p className={styles.previewNote}>{t.previewOnlyNote}</p>}
                <div className={styles.metaRow}>
                  <span>{t.versionLabel}: <strong>{primary.version}</strong></span>
                  <span>{t.sizeLabel}: <strong>{formatSize(primary.windows.sizeBytes)}</strong></span>
                  <span><strong>{t.trialLabel}</strong></span>
                </div>
              </>
            ) : (
              <div className={styles.notReadyBox}>
                <strong>{t.notReadyTitle}</strong>
                <p style={{marginTop: '0.5rem', marginBottom: 0}}>{t.notReadyBody}</p>
              </div>
            )}

            <div className={styles.secondaryLinks}>
              <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer">{t.changelogLink}</a>
              <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">{t.reportLink}</a>
            </div>

            <div className={styles.macNotice}>{t.macNotice}</div>
          </div>

          <div className={styles.section}>
            <h2>{t.installGuideHeading}</h2>
            <ol className={styles.stepsList}>
              <li><strong>{t.installStep1Title}.</strong> {t.installStep1Body}</li>
              <li><strong>{t.installStep2Title}.</strong> {t.installStep2Body}</li>
              <li><strong>{t.installStep3Title}.</strong> {t.installStep3Body}</li>
            </ol>
          </div>

          <div className={styles.reportBox}>
            <h2 style={{marginTop: 0, fontSize: '1.15rem'}}>{t.reportHeading}</h2>
            <p style={{marginBottom: '0.75rem'}}>{t.reportBody}</p>
            <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">{ISSUES_URL}</a>
          </div>
        </div>
      </main>
    </>
  );
}
