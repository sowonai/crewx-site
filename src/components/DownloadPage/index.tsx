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

type Platform = 'windows' | 'mac' | 'linux' | 'mobile' | 'other';

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const nav = navigator as Navigator & {userAgentData?: {platform?: string; mobile?: boolean}};
  const ua = nav.userAgent || '';
  if (nav.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return 'mobile';
  const platform = (nav.userAgentData?.platform || nav.platform || ua).toLowerCase();
  if (platform.includes('mac')) return 'mac';
  if (platform.includes('win')) return 'windows';
  if (platform.includes('linux') || platform.includes('x11')) return 'linux';
  return 'other';
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
}

type Locale = 'en' | 'ko';

const STRINGS: Record<Locale, Record<string, string>> = {
  en: {
    title: 'Download CrewX',
    subtitle: 'Free on Windows, Mac, and Linux. Pick your computer.',
    mobileNotice: 'CrewX runs on a computer. Open this page on your Windows PC, Mac, or Linux computer:',
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
    macBadge: 'macOS & Linux · Terminal',
    macTitle: 'CrewX on Mac & Linux',
    macBody: 'Start CrewX with one command. It opens in your browser.',
    macStep1Title: 'Install Node.js',
    macStep1Body: 'Get the LTS version (20.19 or later). Skip this if you already have it.',
    macStep1Link: 'nodejs.org',
    macStep2Title: 'Run this in Terminal',
    macStep2Body: 'Open Terminal (⌘ Space on Mac, or your Linux terminal) and paste:',
    macStep3Title: 'CrewX opens in your browser',
    macStep3Body: 'Keep Terminal open while you use it. Run the same command to start CrewX again.',
    copy: 'Copy',
    copied: 'Copied ✓',
    macAppSoon: 'Desktop apps for Mac and Linux are on the way.',
    nextHeading: 'Then make your first app',
    nextBody: 'Connect your AI and describe something you already do — a trip, a shortlist, a weekly plan.',
    nextLink: 'See examples',
    reportHeading: 'Something not working?',
    reportBody: 'Tell us on GitHub with your version and what happened. Please leave out tokens and private chats.',
    reportLink: 'Report a problem',
  },
  ko: {
    title: 'CrewX 다운로드',
    subtitle: 'Windows, Mac, Linux에서 무료로 쓸 수 있어요. 내 컴퓨터를 고르세요.',
    mobileNotice: 'CrewX는 컴퓨터에서 실행돼요. Windows PC, Mac, Linux에서 이 주소를 열어 주세요:',
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
    macBadge: 'macOS · Linux · 터미널',
    macTitle: 'Mac · Linux에서 CrewX 쓰기',
    macBody: '명령어 한 줄로 시작해요. CrewX는 브라우저에서 열려요.',
    macStep1Title: 'Node.js 설치',
    macStep1Body: 'LTS 버전(20.19 이상)을 받으세요. 이미 있다면 건너뛰세요.',
    macStep1Link: 'nodejs.org',
    macStep2Title: '터미널에서 실행',
    macStep2Body: '터미널(Mac은 ⌘ Space, Linux는 터미널 앱)을 열고 붙여 넣으세요:',
    macStep3Title: '브라우저에서 CrewX가 열려요',
    macStep3Body: '쓰는 동안 터미널은 열어 두세요. 다음에도 같은 명령어로 다시 시작해요.',
    copy: '복사',
    copied: '복사됨 ✓',
    macAppSoon: 'Mac·Linux 데스크톱 앱도 준비 중이에요.',
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

  const isNpxPlatform = platform === 'mac' || platform === 'linux';
  const cardClass = (os: 'windows' | 'npx') =>
    `dl-card${(os === 'windows' && platform === 'windows') || (os === 'npx' && isNpxPlatform) ? ' is-mine' : ''}`;

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

          <div className={`dl-grid${isNpxPlatform ? ' mac-first' : ''}`}>
            <article className={cardClass('windows')}>
              <div className="dl-card-top">
                <span className="dl-os dl-os-win" aria-hidden="true" title="Windows">
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

            <article className={cardClass('npx')}>
              <div className="dl-card-top">
                <div className="dl-os-group" aria-label="macOS & Linux">
                  <span className="dl-os dl-os-mac" aria-hidden="true" title="macOS">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                    </svg>
                  </span>
                  <span className="dl-os dl-os-linux" aria-hidden="true" title="Linux">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.504 0q-.232 0-.48.021c-4.226.333-3.105 4.807-3.17 6.298c-.076 1.092-.3 1.953-1.05 3.02c-.885 1.051-2.127 2.75-2.716 4.521c-.278.832-.41 1.684-.287 2.489a.4.4 0 0 0-.11.135c-.26.268-.45.6-.663.839c-.199.199-.485.267-.797.4c-.313.136-.658.269-.864.68c-.09.189-.136.394-.132.602c0 .199.027.4.055.536c.058.399.116.728.04.97c-.249.68-.28 1.145-.106 1.484c.174.334.535.47.94.601c.81.2 1.91.135 2.774.6c.926.466 1.866.67 2.616.47c.526-.116.97-.464 1.208-.946c.587-.003 1.23-.269 2.26-.334c.699-.058 1.574.267 2.577.2c.025.134.063.198.114.333l.003.003c.391.778 1.113 1.132 1.884 1.071s1.592-.536 2.257-1.306c.631-.765 1.683-1.084 2.378-1.503c.348-.199.629-.469.649-.853c.023-.4-.2-.811-.714-1.376v-.097l-.003-.003c-.17-.2-.25-.535-.338-.926c-.085-.401-.182-.786-.492-1.046h-.003c-.059-.054-.123-.067-.188-.135a.36.36 0 0 0-.19-.064c.431-1.278.264-2.55-.173-3.694c-.533-1.41-1.465-2.638-2.175-3.483c-.796-1.005-1.576-1.957-1.56-3.368c.026-2.152.236-6.133-3.544-6.139m.529 3.405h.013c.213 0 .396.062.584.198c.19.135.33.332.438.533c.105.259.158.459.166.724c0-.02.006-.04.006-.06v.105l-.004-.021l-.004-.024a1.8 1.8 0 0 1-.15.706a.95.95 0 0 1-.213.335a1 1 0 0 0-.088-.042c-.104-.045-.198-.064-.284-.133a1.3 1.3 0 0 0-.22-.066c.05-.06.146-.133.183-.198q.08-.193.088-.402v-.02a1.2 1.2 0 0 0-.061-.4c-.045-.134-.101-.2-.183-.333c-.084-.066-.167-.132-.267-.132h-.016c-.093 0-.176.03-.262.132a.8.8 0 0 0 0 0z" />
                    </svg>
                  </span>
                </div>
                <span className="dl-badge">{t.macBadge}</span>
                {isNpxPlatform && <span className="dl-mine">{t.detected}</span>}
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
