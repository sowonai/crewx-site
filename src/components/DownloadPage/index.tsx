import React, {useEffect, useState} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import manifest from '@site/data/download-manifest.json';
import {TopNav, LandingFooter} from '@site/src/components/Landing/TopNav';
import '@site/src/css/landing-v03.css';

const ISSUES_URL = 'https://github.com/sowonlabs/crewx/issues/new/choose';
const RELEASES_URL = 'https://github.com/sowonlabs/crewx/releases';
const NODE_DOWNLOAD_URL = 'https://nodejs.org/en/download';
const DOWNLOAD_PAGE_URL = 'crewx.dev/download';
// @latest makes npx check for a new version instead of reusing an old cached copy.
const MAC_COMMAND = 'npx crewx@latest';

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

type Platform = 'windows' | 'mac' | 'mobile' | 'other';

function detectPlatform(): Platform {
  const nav = navigator as Navigator & {userAgentData?: {platform?: string; mobile?: boolean}};
  const ua = nav.userAgent || '';
  if (nav.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return 'mobile';
  const platform = (nav.userAgentData?.platform || nav.platform || ua).toLowerCase();
  if (platform.includes('mac')) return 'mac';
  if (platform.includes('win')) return 'windows';
  return 'other';
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

type Locale = 'en' | 'ko';

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Download CrewX',
    subtitle: 'Free on Windows and Mac. Pick your computer.',
    mobileNotice: 'CrewX runs on a computer. Open this page on your Windows PC or Mac:',
    detected: 'Your computer',
    winBadge: 'Windows · x64',
    winTitle: 'CrewX for Windows',
    winBody: 'One installer. No Terminal, no extra setup.',
    stableCta: 'Download for Windows',
    previewCta: 'Download for Windows',
    previewTag: 'Preview',
    alsoPreviewNote: 'Want to try what’s next?',
    alsoPreviewCta: 'Download the preview',
    notReadyTitle: 'The Windows installer is almost ready.',
    notReadyBody: 'Check GitHub Releases for the latest build.',
    versionLabel: 'Version',
    winStep1: 'Run the installer.',
    winStep2: 'Open CrewX.',
    winStep3: 'Connect your ChatGPT or Claude plan.',
    winReq: 'Windows 10 or 11, 64-bit.',
    changelogLink: 'What’s new',
    macBadge: 'macOS · Terminal',
    macTitle: 'CrewX on Mac',
    macBody: 'Start CrewX with one command. It opens in your browser.',
    macStep1Title: 'Install Node.js',
    macStep1Body: 'Get the LTS version (20.19 or later). Skip this if you already have it.',
    macStep1Link: 'nodejs.org',
    macStep2Title: 'Run this in Terminal',
    macStep2Body: 'Press ⌘ Space, type “Terminal”, and paste:',
    macStep3Title: 'CrewX opens in your browser',
    macStep3Body: 'Keep Terminal open while you use it. Run the same command to start CrewX again.',
    copy: 'Copy',
    copied: 'Copied ✓',
    macAppSoon: 'A Mac app is on the way.',
    nextHeading: 'Then make your first app',
    nextBody: 'Connect your AI and describe something you already do — a trip, a shortlist, a weekly plan.',
    nextLink: 'See examples',
    reportHeading: 'Something not working?',
    reportBody: 'Tell us on GitHub with your version and what happened. Please leave out tokens and private chats.',
    reportLink: 'Report a problem',
  },
  ko: {
    title: 'CrewX 다운로드',
    subtitle: 'Windows와 Mac에서 무료로 쓸 수 있어요. 내 컴퓨터를 고르세요.',
    mobileNotice: 'CrewX는 컴퓨터에서 실행돼요. Windows PC나 Mac에서 이 주소를 열어 주세요:',
    detected: '지금 쓰는 컴퓨터',
    winBadge: 'Windows · x64',
    winTitle: 'Windows용 CrewX',
    winBody: '설치 파일 하나면 끝나요. 터미널도, 추가 설정도 필요 없어요.',
    stableCta: 'Windows용 다운로드',
    previewCta: 'Windows용 다운로드',
    previewTag: '미리보기',
    alsoPreviewNote: '다음 버전을 먼저 써보고 싶다면',
    alsoPreviewCta: '미리보기 다운로드',
    notReadyTitle: 'Windows 설치 파일을 곧 공개해요.',
    notReadyBody: '최신 빌드는 GitHub Releases에서 확인하세요.',
    versionLabel: '버전',
    winStep1: '설치 파일을 실행하세요.',
    winStep2: 'CrewX를 여세요.',
    winStep3: 'ChatGPT나 Claude 요금제를 연결하세요.',
    winReq: 'Windows 10·11 64비트에서 실행돼요.',
    changelogLink: '새로운 점',
    macBadge: 'macOS · 터미널',
    macTitle: 'Mac에서 CrewX 쓰기',
    macBody: '명령어 한 줄로 시작해요. CrewX는 브라우저에서 열려요.',
    macStep1Title: 'Node.js 설치',
    macStep1Body: 'LTS 버전(20.19 이상)을 받으세요. 이미 있다면 건너뛰세요.',
    macStep1Link: 'nodejs.org',
    macStep2Title: '터미널에서 실행',
    macStep2Body: '⌘ Space를 누르고 “터미널”을 열어 붙여 넣으세요:',
    macStep3Title: '브라우저에서 CrewX가 열려요',
    macStep3Body: '쓰는 동안 터미널은 열어 두세요. 다음에도 같은 명령어로 다시 시작해요.',
    copy: '복사',
    copied: '복사됨 ✓',
    macAppSoon: 'Mac 앱도 준비 중이에요.',
    nextHeading: '이제 첫 앱을 만들어 보세요',
    nextBody: 'AI를 연결하고 평소에 하는 일을 말해 보세요. 여행 계획, 구매 후보 비교, 주간 계획처럼요.',
    nextLink: '예시 보기',
    reportHeading: '잘 안 되나요?',
    reportBody: 'GitHub에 버전과 증상을 남겨 주세요. 토큰이나 개인 대화 내용은 빼 주세요.',
    reportLink: '문제 신고',
  },
};

function CopyCommand({label, copiedLabel}: {label: string; copiedLabel: string}): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(MAC_COMMAND);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = MAC_COMMAND;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="npx-pill dl-cmd" role="group" aria-label={MAC_COMMAND}>
      <code className="npx-cmd">
        <span className="npx-prompt">$</span>
        {MAC_COMMAND}
      </code>
      <button className={`npx-copy ${copied ? 'copied' : ''}`} type="button" onClick={onCopy}>
        {copied ? copiedLabel : label}
      </button>
    </div>
  );
}

export default function DownloadPage({locale}: {locale: Locale}): React.ReactElement {
  const t = STRINGS[locale];
  const m = manifest as Manifest;
  const primary = m.stable ?? m.preview;
  const changelogHref = primary?.htmlUrl ?? RELEASES_URL;
  const showSeparatePreviewLink = Boolean(m.stable && m.preview);
  const [platform, setPlatform] = useState<Platform>('other');

  useEffect(() => {
    setPlatform(detectPlatform());
    document.body.classList.add('landing-page-active');
    return () => document.body.classList.remove('landing-page-active');
  }, []);

  const cardClass = (os: 'windows' | 'mac') => `dl-card${platform === os ? ' is-mine' : ''}`;

  return (
    <div className="landing-page-wrapper">
      <Head>
        <html className="crewx-landing" />
      </Head>
      <TopNav />

      <main className="dl-page">
        <div className="wrap">
          <header className="dl-head">
            <h1>{t.title}</h1>
            <p className="lede">{t.subtitle}</p>
          </header>

          {platform === 'mobile' && (
            <div className="dl-mobile">
              {t.mobileNotice} <b>{DOWNLOAD_PAGE_URL}</b>
            </div>
          )}

          <div className={`dl-grid${platform === 'mac' ? ' mac-first' : ''}`}>
            <article className={cardClass('windows')}>
              <div className="dl-card-top">
                <span className="dl-os dl-os-win" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 5.1 10.4 4v7.2H3V5.1Zm8.4-1.2L21 2.5v8.7h-9.6V3.9ZM3 12.8h7.4V20L3 18.9v-6.1Zm8.4 0H21v8.7l-9.6-1.4v-7.3Z" />
                  </svg>
                </span>
                <span className="dl-badge">{t.winBadge}</span>
                {platform === 'windows' && <span className="dl-mine">{t.detected}</span>}
              </div>
              <h2>{t.winTitle}</h2>
              <p className="dl-body">{t.winBody}</p>

              {primary ? (
                <>
                  <a className="btn primary btn-lg dl-main" href={primary.windows.url}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
                    </svg>
                    {primary === m.stable ? t.stableCta : t.previewCta}
                  </a>
                  <div className="dl-meta">
                    <span>
                      {t.versionLabel} {primary.version}
                    </span>
                    <span>{formatSize(primary.windows.sizeBytes)}</span>
                    {primary === m.preview && <span className="dl-tag">{t.previewTag}</span>}
                    <a href={changelogHref} target="_blank" rel="noopener noreferrer">
                      {t.changelogLink}
                    </a>
                  </div>
                  {showSeparatePreviewLink && m.preview && (
                    <p className="dl-note">
                      {t.alsoPreviewNote}{' '}
                      <a href={m.preview.windows.url}>
                        {t.alsoPreviewCta} ({m.preview.version})
                      </a>
                    </p>
                  )}
                </>
              ) : (
                <div className="dl-note">
                  <b>{t.notReadyTitle}</b>{' '}
                  <a href={changelogHref} target="_blank" rel="noopener noreferrer">
                    {t.notReadyBody}
                  </a>
                </div>
              )}

              <ol className="dl-steps">
                <li>{t.winStep1}</li>
                <li>{t.winStep2}</li>
                <li>{t.winStep3}</li>
              </ol>
              <p className="dl-note dl-soon">{t.winReq}</p>
            </article>

            <article className={cardClass('mac')}>
              <div className="dl-card-top">
                <span className="dl-os dl-os-mac" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M7 9l3 2-3 2M12 13h4M9 21h6M12 17v4" />
                  </svg>
                </span>
                <span className="dl-badge">{t.macBadge}</span>
                {platform === 'mac' && <span className="dl-mine">{t.detected}</span>}
              </div>
              <h2>{t.macTitle}</h2>
              <p className="dl-body">{t.macBody}</p>

              <ol className="dl-mac-steps">
                <li>
                  <b>{t.macStep1Title}</b>
                  <span>
                    {t.macStep1Body}{' '}
                    <a href={NODE_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer">
                      {t.macStep1Link} ↗
                    </a>
                  </span>
                </li>
                <li>
                  <b>{t.macStep2Title}</b>
                  <span>{t.macStep2Body}</span>
                  <CopyCommand label={t.copy} copiedLabel={t.copied} />
                </li>
                <li>
                  <b>{t.macStep3Title}</b>
                  <span>{t.macStep3Body}</span>
                </li>
              </ol>
              <p className="dl-note dl-soon">{t.macAppSoon}</p>
            </article>
          </div>

          <div className="dl-after">
            <div>
              <h3>{t.nextHeading}</h3>
              <p>
                {t.nextBody} <Link to="/#apps">{t.nextLink} →</Link>
              </p>
            </div>
            <div>
              <h3>{t.reportHeading}</h3>
              <p>
                {t.reportBody}{' '}
                <a href={ISSUES_URL} target="_blank" rel="noopener noreferrer">
                  {t.reportLink} ↗
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
