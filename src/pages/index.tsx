import type {ReactNode} from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate, {translate} from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useLocation} from '@docusaurus/router';

function LocaleDropdown(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const {pathname, search, hash} = useLocation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const {currentLocale, defaultLocale, locales, localeConfigs} = i18n;

  const stripLocale = (p: string) => {
    if (currentLocale === defaultLocale) return p;
    const prefix = `/${currentLocale}`;
    if (p === prefix) return '/';
    if (p.startsWith(`${prefix}/`)) return p.slice(prefix.length);
    return p;
  };

  const buildHref = (locale: string) => {
    const base = stripLocale(pathname);
    const path = locale === defaultLocale ? base : `/${locale}${base === '/' ? '' : base}`;
    return `${path}${search}${hash}`;
  };

  const currentLabel = localeConfigs[currentLocale]?.label ?? currentLocale;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 sm:inline-flex"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-slate-300">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span>{currentLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3 text-slate-400">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-30 mt-2 min-w-[140px] overflow-hidden rounded-xl border border-white/10 bg-[#0d1330]/95 p-1 shadow-2xl shadow-black/40 backdrop-blur"
        >
          {locales.map((loc) => {
            const isActive = loc === currentLocale;
            return (
              <li key={loc}>
                <a
                  href={buildHref(loc)}
                  hrefLang={localeConfigs[loc]?.htmlLang}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>{localeConfigs[loc]?.label ?? loc}</span>
                  {isActive && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3.5 w-3.5 text-emerald-400">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const LANDING_CSS = `
  .landing-page-wrapper {
    --bg: #10131a;
    --bg-2: #191b23;
    --surface-1: #1d2027;
    --surface-2: #272a31;
    --line: rgba(255, 255, 255, 0.05);
    --line-strong: #424754;
    --muted: #c2c6d6;
    --on-surface: #e1e2ec;
    --primary: #adc6ff;
    --primary-strong: #4d8eff;
    --on-primary: #002e6a;
    --secondary: #d0bcff;
    --tertiary: #ffb786;
    background: var(--bg);
    color: var(--on-surface);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-feature-settings: "cv02", "cv11", "ss01";
    min-height: 100vh;
    overflow-x: hidden;
  }
  .landing-page-wrapper .font-mono {
    font-family: "Space Grotesk", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
    font-feature-settings: "tnum", "zero";
  }
  .landing-page-wrapper .label-caps {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .landing-page-wrapper .glow-bg {
    background-image:
      radial-gradient(800px 520px at 12% 14%, rgba(139,92,246,0.14), transparent 60%),
      radial-gradient(900px 600px at 92% 8%, rgba(255,183,134,0.10), transparent 60%),
      radial-gradient(720px 520px at 70% 78%, rgba(173,198,255,0.08), transparent 60%);
  }
  .landing-page-wrapper .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse at 50% 28%, rgba(0,0,0,0.95), transparent 75%);
  }
  .landing-page-wrapper .btn-primary {
    background: var(--primary-strong);
    color: #ffffff;
    border: 1px solid rgba(173,198,255,0.4);
    box-shadow:
      0 0 0 1px rgba(173,198,255,0.15),
      0 8px 32px -12px rgba(77,142,255,0.55),
      inset 0 1px 0 rgba(255,255,255,0.15);
    transition: filter 120ms ease, box-shadow 120ms ease;
  }
  .landing-page-wrapper .btn-primary:hover {
    filter: brightness(1.08);
    box-shadow:
      0 0 0 1px rgba(173,198,255,0.3),
      0 12px 40px -10px rgba(77,142,255,0.7),
      inset 0 1px 0 rgba(255,255,255,0.2);
  }
  .landing-page-wrapper .btn-ghost {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--line-strong);
    transition: border-color 120ms ease, background 120ms ease;
  }
  .landing-page-wrapper .btn-ghost:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(173,198,255,0.4);
  }
  .landing-page-wrapper .card {
    background:
      linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005));
    border: 1px solid var(--line-strong);
    backdrop-filter: blur(8px);
  }
  .landing-page-wrapper .chip {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--line-strong);
  }
  .landing-page-wrapper .x-r { color: #ef4444; }
  .landing-page-wrapper .x-g { color: #22c55e; }
  .landing-page-wrapper .x-b { color: var(--primary); }
  .landing-page-wrapper .x-x {
    background: linear-gradient(135deg, #d0bcff 0%, #c4abff 35%, #ffb786 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .landing-page-wrapper .agent-pm { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
  .landing-page-wrapper .agent-ui { background: linear-gradient(135deg, #38bdf8, #0ea5e9); }
  .landing-page-wrapper .agent-be { background: linear-gradient(135deg, #10b981, #059669); }
  .landing-page-wrapper .agent-fe { background: linear-gradient(135deg, #f59e0b, #ef4444); }
  .landing-page-wrapper .agent-qa { background: linear-gradient(135deg, #ec4899, #d946ef); }
  .landing-page-wrapper .pulse-dot { position: relative; }
  .landing-page-wrapper .pulse-dot::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.35;
    animation: pulse 1.8s ease-out infinite;
  }
  @keyframes pulse {
    0% { transform: scale(0.6); opacity: 0.6; }
    100% { transform: scale(2); opacity: 0; }
  }
  .landing-page-wrapper .float-a { animation: floatA 6s ease-in-out infinite; }
  .landing-page-wrapper .float-b { animation: floatB 7s ease-in-out infinite; }
  @keyframes floatA {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .landing-page-wrapper .divider-line {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  }
  .landing-page-wrapper .logo-glow {
    filter: drop-shadow(0 4px 14px rgba(236,72,153,0.35)) drop-shadow(0 0 20px rgba(139,92,246,0.25));
  }
  .landing-page-wrapper .flow-line {
    stroke: rgba(255,255,255,0.16);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
    fill: none;
    animation: dashFlow 6s linear infinite;
  }
  @keyframes dashFlow { to { stroke-dashoffset: -54; } }
  .landing-page-wrapper .travel-dot { filter: drop-shadow(0 0 4px currentColor); }
  .landing-page-wrapper .progress-pulse {
    animation: progressPulse 6s linear infinite;
    transform-origin: left;
    will-change: transform, opacity;
  }
  @keyframes progressPulse {
    0%   { transform: scaleX(0);   opacity: 0.55; }
    8%   { transform: scaleX(0);   opacity: 1; }
    88%  { transform: scaleX(1);   opacity: 1; }
    100% { transform: scaleX(1);   opacity: 0; }
  }
  .landing-page-wrapper details > summary::-webkit-details-marker { display: none; }
  .landing-page-wrapper .grad-text {
    background: linear-gradient(135deg, #ffffff 0%, #e1e2ec 60%, #adc6ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .landing-page-wrapper .intel-text {
    background: linear-gradient(135deg, #d0bcff 0%, #c4abff 40%, #ffb786 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    filter: drop-shadow(0 0 32px rgba(208,188,255,0.18));
  }
  .landing-page-wrapper .hero-eyebrow-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: var(--primary);
    box-shadow: 0 0 12px rgba(173,198,255,0.8), 0 0 24px rgba(173,198,255,0.4);
  }
  .landing-page-wrapper .install-card {
    background: #0b0e15;
    border: 1px solid var(--line-strong);
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }
  .landing-page-wrapper .install-card:focus-within,
  .landing-page-wrapper .install-card:hover {
    border-color: rgba(173,198,255,0.5);
    box-shadow: 0 0 0 1px rgba(173,198,255,0.15), 0 0 32px -8px rgba(77,142,255,0.25);
  }
  /* React Flow overrides (scoped to landing page) */
  .landing-page-wrapper .react-flow__attribution { display: none !important; }
  .landing-page-wrapper .react-flow__pane { cursor: default !important; }
  .landing-page-wrapper .react-flow__handle {
    width: 1px !important;
    height: 1px !important;
    min-width: 1px !important;
    min-height: 1px !important;
    background: transparent !important;
    border: 0 !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
  .landing-page-wrapper .react-flow__edge-path { stroke-width: 1.5; }
  .landing-page-wrapper .react-flow__edge.animated path.react-flow__edge-path {
    stroke-dasharray: 5 4;
    animation: rfDashFlow 1.4s linear infinite;
  }
  @keyframes rfDashFlow { to { stroke-dashoffset: -18; } }

  /* Hide Docusaurus navbar on the landing page (rule scoped to this page via mounted style tag) */
  .navbar { display: none !important; }
  .main-wrapper {
    max-width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
`;

export default function LandingPage(): ReactNode {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText('npx crewx@latest');
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, []);

  return (
    <Layout
      noFooter
      title={translate({
        id: 'landing.meta.title',
        message: 'CrewX — Install AI Apps. Work with CrewX.',
        description: 'Browser tab title for the landing page',
      })}
      description={translate({
        id: 'landing.meta.description',
        message: 'Install AI apps from CrewX Marketplace, connect them to messenger apps, your website, email, or internal tools, and start using AI in real work.',
        description: 'Meta description for the landing page',
      })}
    >
      <Head>
        <meta property="og:title" content={translate({
          id: 'landing.meta.ogTitle',
          message: 'CrewX — Install AI Apps. Work with CrewX.',
          description: 'OpenGraph title',
        })} />
        <meta property="og:description" content={translate({
          id: 'landing.meta.ogDescription',
          message: 'Pick a verified AI app, connect it to your business channels, and start running real work with CrewX.',
          description: 'OpenGraph description',
        })} />
        <script src="https://cdn.tailwindcss.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style dangerouslySetInnerHTML={{__html: LANDING_CSS}} />

      <div className="landing-page-wrapper min-h-screen antialiased">
        {/* Background atmospherics */}
        <div className="pointer-events-none fixed inset-0 grid-bg" />
        <div className="pointer-events-none fixed inset-0 glow-bg" />

        {/* Top Nav */}
        <header className="relative z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <a href="/" className="flex items-center gap-2.5">
              <img src="/assets/crewx-logo.png" alt="CrewX" className="logo-glow h-8 w-8" />
              <span className="text-lg font-bold tracking-tight">CrewX</span>
            </a>

            <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
              <a className="hover:text-white" href="/docs/intro">
                <Translate id="landing.nav.docs" description="Top nav: Docs link">Docs</Translate>
              </a>
              <a className="hover:text-white" href="/blog">
                <Translate id="landing.nav.blog" description="Top nav: Blog link">Blog</Translate>
              </a>
              <a className="hover:text-white" href="/templates">
                <Translate id="landing.nav.templates" description="Top nav: Templates link">Templates</Translate>
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <LocaleDropdown />
              <a
                href="https://github.com/sowonlabs/crewx"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 sm:inline-flex"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-slate-300">
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.96 10.96 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                GitHub
              </a>
              <a
                href="/docs/intro"
                className="btn-primary rounded-md px-4 py-2 text-sm font-semibold text-white"
              >
                <Translate id="landing.nav.getStarted" description="Top nav: primary Get started CTA">
                  Get started
                </Translate>
              </a>
            </div>
          </div>
        </header>

        {/* Hero */}
        <main className="relative z-10">
          <section className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:pt-20">
            <div className="grid items-start gap-10 lg:grid-cols-12">
              {/* Left: copy */}
              <div className="min-w-0 lg:col-span-7">
                <div className="chip label-caps inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-slate-300">
                  <span className="hero-eyebrow-dot" />
                  <span>
                    <Translate id="landing.hero.eyebrow" description="Hero eyebrow above title">
                      CrewX Marketplace · Channel-ready AI Apps
                    </Translate>
                  </span>
                </div>

                <h1 className="mt-6 font-bold leading-[1.05]">
                  <span className="grad-text block text-5xl sm:text-7xl lg:text-[96px]">
                    <Translate id="landing.hero.title.line1" description="Hero title line 1">
                      Install AI Apps.
                    </Translate>
                  </span>
                  <span className="intel-text mt-3 block pb-2 text-3xl font-extrabold leading-[1.1] sm:text-5xl lg:text-[56px]">
                    <Translate id="landing.hero.title.line2" description="Hero title line 2">
                      Work with CrewX.
                    </Translate>
                  </span>
                </h1>

                <div className="mt-6 flex items-center gap-3 text-sm">
                  <img src="/assets/crewx-logo.png" alt="" className="h-5 w-5" />
                  <span className="label-caps text-slate-300">
                    <span className="text-white">
                      <Translate id="landing.hero.tagline.ready" description="Hero subtagline left part">
                        Marketplace Apps.
                      </Translate>
                    </span>
                    <span className="mx-2 text-slate-600">/</span>
                    <span className="x-x">
                      <Translate id="landing.hero.tagline.realWork" description="Hero subtagline right part">
                        Channel-ready.
                      </Translate>
                    </span>
                  </span>
                </div>

                <p className="mt-8 max-w-2xl text-lg leading-[1.6] text-slate-300/95 sm:text-xl">
                  <Translate
                    id="landing.hero.headline"
                    description="Hero headline; {bold} wraps the emphasized phrase"
                    values={{
                      bold: (
                        <span className="font-semibold text-white">
                          <Translate id="landing.hero.headline.bold" description="Hero headline emphasized part">
                            Connect AI apps to the channels your business already uses.
                          </Translate>
                        </span>
                      ),
                    }}
                  >
                    {'{bold}'}
                  </Translate>
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-[1.6] text-slate-400">
                  <Translate id="landing.hero.subheadline" description="Hero supporting paragraph">
                    Pick a verified AI app from CrewX Marketplace, connect it to messenger apps, your website, email, or internal tools, and start using AI in real work.
                  </Translate>
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="/docs/intro"
                    className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <Translate id="landing.hero.cta.getStarted" description="Hero primary CTA">
                      Start with free CrewX
                    </Translate>
                  </a>
                  <a
                    href="https://github.com/sowonlabs/crewx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-slate-200"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.27-5.24-5.66 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.17a10.96 10.96 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.4-2.69 5.36-5.25 5.65.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                    <Translate id="landing.hero.cta.github" description="Hero secondary CTA">
                      View on GitHub
                    </Translate>
                  </a>
                </div>

                <div className="mt-8 max-w-md">
                  <div className="install-card flex items-center gap-3 rounded-md px-4 py-3 font-mono text-sm">
                    <span className="text-[var(--primary)]">$</span>
                    <span className="flex-1 text-slate-200">
                      npx <span className="text-[var(--primary)]">crewx@latest</span>
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded border border-[var(--line-strong)] bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-[rgba(173,198,255,0.4)] hover:text-white"
                    >
                      <span>
                        {copied ? (
                          <Translate id="landing.hero.copy.copied" description="Copy button label after copying">
                            Copied
                          </Translate>
                        ) : (
                          <Translate id="landing.hero.copy.label" description="Copy button label">
                            Copy
                          </Translate>
                        )}
                      </span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-slate-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3 w-3">
                      <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                    <span>
                      <Translate id="landing.hero.install.help" description="Help text under the npx install command">
                        Open-source CrewX runs locally. Bring your own AI subscriptions.
                      </Translate>
                    </span>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="label-caps text-slate-500">
                    <Translate id="landing.hero.providers.heading" description="Section above provider logos">
                      Bring the AI subscriptions you already use — CrewX adds workflows, memory, and templates
                    </Translate>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
                        <img src="/assets/chatgpt-logo-dark.svg" alt="" className="h-[22px] w-[22px] object-contain" />
                      </span>
                      Codex
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/15">
                        <img src="/assets/claude-logo-dark.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      Claude Code
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/15">
                        <img src="/assets/opencode-logo.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      OpenCode
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/15">
                        <img src="/assets/gemini-logo.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      Antigravity CLI
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-500/20">
                        <img src="/assets/github-copilot-logo-dark.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      Copilot CLI
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Hero Diagram (orchestrator-workers) */}
              <div className="relative min-w-0 lg:col-span-5">
                <BrowserOnly
                  fallback={
                    <div
                      className="card relative overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
                      style={{aspectRatio: '5 / 6', minHeight: 540}}
                    />
                  }
                >
                  {() => {
                    const HeroDiagram = require('../components/HeroDiagram').default;
                    return <HeroDiagram />;
                  }}
                </BrowserOnly>
              </div>
            </div>

          </section>

          {/* Section divider */}
          <div className="mx-auto max-w-7xl px-6">
            <div className="divider-line h-px" />
          </div>

          {/* ── FEATURES ── */}
          <section id="product" className="mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <div className="chip inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-slate-300">
                <span className="text-pink-400">✦</span>{' '}
                <Translate id="landing.features.eyebrow" description="Why CrewX section eyebrow">
                  Why CrewX
                </Translate>
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl lg:text-6xl">
                <Translate
                  id="landing.features.heading"
                  description="Why CrewX section heading; {br} renders a line break"
                  values={{br: <br />}}
                >
                  {'Stop juggling.{br}Start operating.'}
                </Translate>
              </h2>
              <p className="mt-3 text-base text-slate-400">
                <Translate id="landing.features.subheading" description="Why CrewX subheading">
                  From AI tools to an AI team.
                </Translate>
              </p>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-400">
                <Translate id="landing.features.intro.p1" description="Why CrewX intro paragraph 1">
                  A chatbot can answer. A single AI tool can do one task. But real work needs planning, splitting, execution, review, and memory.
                </Translate>
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
                <Translate
                  id="landing.features.intro.p2"
                  description="Why CrewX intro paragraph 2; {bold} wraps 'role-based team'"
                  values={{
                    bold: (
                      <span className="font-semibold text-white">
                        <Translate id="landing.features.intro.p2.bold" description="Phrase 'role-based team'">
                          role-based team
                        </Translate>
                      </span>
                    ),
                  }}
                >
                  {'CrewX turns the AI tools you already use into a {bold}: a supervisor assigns the work, AI workers execute in parallel, reviewers check the result, and every decision stays in context — across engineering, design, content, support, and analytics.'}
                </Translate>
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                <Translate
                  id="landing.features.intro.p3"
                  description="Why CrewX intro paragraph 3; {bold} wraps 'AI-native team'"
                  values={{
                    bold: (
                      <span className="font-semibold text-white">
                        <Translate id="landing.features.intro.p3.bold" description="Phrase 'AI-native team'">
                          AI-native team
                        </Translate>
                      </span>
                    ),
                  }}
                >
                  {'You supervise the work from the browser. CrewX handles threads, roles, memory, and handoffs so you stop juggling prompts and start operating an {bold}.'}
                </Translate>
              </p>
            </div>

            <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature: Multi-provider */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <circle cx="12" cy="12" r="3" />
                    <circle cx="5" cy="5" r="2" />
                    <circle cx="19" cy="5" r="2" />
                    <circle cx="5" cy="19" r="2" />
                    <circle cx="19" cy="19" r="2" />
                    <path d="M9.5 9.5L7 7M14.5 9.5L17 7M9.5 14.5L7 17M14.5 14.5L17 17" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.multiProvider.title" description="Feature card 1 title">
                    Multi-provider orchestration
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.multiProvider.desc" description="Feature card 1 description">
                    Mix Claude, Gemini, Codex, Copilot, OpenCode in a single crew — Claude plans & reviews, Codex verifies, Gemini researches, Copilot runs personas, OpenCode handles bulk.
                  </Translate>
                </p>
              </div>

              {/* Feature: WI */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/15 text-pink-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M3 5h18M3 12h12M3 19h18" />
                    <circle cx="20" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.wi.title" description="Feature card 2 title">
                    Work Instructions (WI)
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.wi.desc" description="Feature card 2 description">
                    The PM agent writes structured tickets, then dispatches them to workers. Threaded, traceable, replayable — every change has a paper trail.
                  </Translate>
                </p>
              </div>

              {/* Feature: Threaded */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M21 12c0 4.97-4.03 9-9 9-1.5 0-2.91-.37-4.15-1.02L3 21l1.02-4.85A8.96 8.96 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.threaded.title" description="Feature card 3 title">
                    Threaded conversations
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.threaded.desc" description="Feature card 3 description">
                    Each topic lives in its own thread with full history. Agents keep context across days — no more re-pasting your stack.
                  </Translate>
                </p>
              </div>

              {/* Feature: Memory */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.memory.title" description="Feature card 4 title">
                    Long-term memory
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.memory.desc" description="Feature card 4 description">
                    Agents save decisions, knowhow, and worklogs as Markdown. BM25-indexed, model-readable, version-controlled with your repo.
                  </Translate>
                </p>
              </div>

              {/* Feature: Skills */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.skills.title" description="Feature card 5 title">
                    Skills & built-in tools
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.skills.desc" description="Feature card 5 description">
                    Drop-in skills for memory, search, docs, code review. Compose them per agent. Build your own with a single SKILL.md.
                  </Translate>
                </p>
              </div>

              {/* Feature: Hooks */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  <Translate id="landing.features.card.hooks.title" description="Feature card 6 title">
                    Hooks & automations
                  </Translate>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  <Translate id="landing.features.card.hooks.desc" description="Feature card 6 description">
                    Pre/post-tool hooks, scheduled jobs, custom slash commands. Wire CrewX into your existing workflow without leaving the browser.
                  </Translate>
                </p>
              </div>
            </div>
          </section>

          {/* ── PROVIDERS ── */}
          <section className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <div className="chip inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-slate-300">
                <span className="text-sky-400">◇</span>{' '}
                <Translate id="landing.providers.eyebrow" description="Providers section eyebrow">
                  Providers
                </Translate>
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl">
                <Translate
                  id="landing.providers.heading"
                  description="Providers heading; {br} renders a line break"
                  values={{br: <br />}}
                >
                  {'Pick the right model{br}per role.'}
                </Translate>
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-400">
                <Translate id="landing.providers.subheading" description="Providers subheading">
                  Each tool earns its role from how developers actually use it. Swap any time — no prompt rewrites, no lock-in.
                </Translate>
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/15 p-1.5">
                    <img src="/assets/chatgpt-logo-dark.svg" alt="Codex" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Codex</div>
                    <div className="text-xs text-slate-500">OpenAI</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· GPT-5.5-Codex</li>
                  <li>· Adversarial review · race conditions</li>
                  <li className="text-slate-300">
                    ·{' '}
                    <Translate id="landing.providers.roleLabel" description="Role label prefix in provider cards">
                      Role:
                    </Translate>{' '}
                    <span className="text-emerald-300">
                      <Translate id="landing.providers.role.verifier" description="Role: Verifier">
                        Verifier
                      </Translate>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-orange-500/15 p-1.5">
                    <img src="/assets/claude-logo-dark.svg" alt="Claude" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Claude</div>
                    <div className="text-xs text-slate-500">Anthropic</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· Opus 4.8 / Sonnet 4.6</li>
                  <li>· Plan Mode · 1M context</li>
                  <li className="text-slate-300">
                    ·{' '}
                    <Translate id="landing.providers.roleLabel" description="Role label prefix in provider cards">
                      Role:
                    </Translate>{' '}
                    <span className="text-orange-300">
                      <Translate id="landing.providers.role.plannerReviewer" description="Role: Planner & Reviewer">
                        Planner & Reviewer
                      </Translate>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-500/15 p-1.5">
                    <img src="/assets/opencode-logo.svg" alt="OpenCode" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">OpenCode</div>
                    <div className="text-xs text-slate-500">
                      <Translate id="landing.providers.opencode.label" description="OpenCode card subtitle">
                        Community provider
                      </Translate>
                    </div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· GLM-5.1 / 5.2 · Qwen / DeepSeek / Kimi</li>
                  <li>· Local via Ollama / LM Studio</li>
                  <li className="text-slate-300">
                    ·{' '}
                    <Translate id="landing.providers.roleLabel" description="Role label prefix in provider cards">
                      Role:
                    </Translate>{' '}
                    <span className="text-violet-300">
                      <Translate id="landing.providers.role.bulkWorker" description="Role: Bulk worker">
                        Bulk worker
                      </Translate>
                    </span>{' '}
                    <span className="text-slate-500">
                      ·{' '}
                      <Translate id="landing.providers.role.bulkWorker.note" description="Bulk worker note: low-sensitivity">
                        low-sensitivity
                      </Translate>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky-500/15 p-1.5">
                    <img src="/assets/gemini-logo.svg" alt="Antigravity" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Antigravity</div>
                    <div className="text-xs text-slate-500">Google</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· Gemini 3.1 Pro / 3.5 Flash</li>
                  <li>· Live web grounding</li>
                  <li className="text-slate-300">
                    ·{' '}
                    <Translate id="landing.providers.roleLabel" description="Role label prefix in provider cards">
                      Role:
                    </Translate>{' '}
                    <span className="text-sky-300">
                      <Translate id="landing.providers.role.researcher" description="Role: Researcher">
                        Researcher
                      </Translate>
                    </span>
                  </li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-500/20 p-1.5">
                    <img src="/assets/github-copilot-logo-dark.svg" alt="GitHub Copilot" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Copilot</div>
                    <div className="text-xs text-slate-500">GitHub</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· GPT / Claude / Gemini / o3</li>
                  <li>· Pick model per task</li>
                  <li className="text-slate-300">
                    ·{' '}
                    <Translate id="landing.providers.roleLabel" description="Role label prefix in provider cards">
                      Role:
                    </Translate>{' '}
                    <span className="text-pink-300">
                      <Translate id="landing.providers.role.personaSimulator" description="Role: Persona simulator">
                        Persona simulator
                      </Translate>
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <div className="chip inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-slate-300">
                <span className="text-orange-400">$</span>{' '}
                <Translate id="landing.pricing.eyebrow" description="Pricing section eyebrow">
                  Pricing
                </Translate>
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl">
                <Translate
                  id="landing.pricing.heading"
                  description="Pricing heading; {br} renders a line break"
                  values={{br: <br />}}
                >
                  {'Just FREE.'}
                </Translate>
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-400">
                <Translate id="landing.pricing.subheading" description="Pricing subheading">
                  CrewX is free. Bring your own AI subscription.
                </Translate>
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
              {/* Free */}
              <div className="card relative rounded-2xl p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  <Translate id="landing.pricing.tier.free.name" description="Free tier name">Free</Translate>
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">$0</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  <Translate id="landing.pricing.tier.free.desc" description="Free tier description">
                    Use CrewX with the AI accounts you already have. No seat fees. No token markup.
                  </Translate>
                </p>
                <a
                  href="/docs/intro"
                  className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Translate id="landing.pricing.tier.free.cta" description="Free tier CTA">
                    Start for free
                  </Translate>
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex justify-between gap-2">
                    <span className="text-slate-400">
                      <Translate id="landing.pricing.row.workspaces" description="Pricing row: Workspaces">
                        Workspaces
                      </Translate>
                    </span>
                    <span className="font-mono">20</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span className="text-slate-400">
                      <Translate id="landing.pricing.row.agentsPerWs" description="Pricing row: Agents (per WS)">
                        Agents (per WS)
                      </Translate>
                    </span>
                    <span className="font-mono">100</span>
                  </li>
                  <li className="flex justify-between gap-2">
                    <span className="text-slate-400">
                      <Translate id="landing.pricing.row.apiTokens" description="Pricing row: API tokens">
                        API tokens
                      </Translate>
                    </span>
                    <span className="font-mono">20</span>
                  </li>
                  <li className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                    <span className="text-emerald-400">✓</span>{' '}
                    <Translate id="landing.pricing.tier.free.feature1" description="Free tier feature 1">
                      Web UI (no install)
                    </Translate>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">✓</span>{' '}
                    <Translate id="landing.pricing.tier.free.feature2" description="Free tier feature 2">
                      Bring your own AI subscriptions
                    </Translate>
                  </li>
                </ul>
              </div>

              {/* Enterprise */}
              <div className="card relative rounded-2xl p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  <Translate id="landing.pricing.tier.enterprise.name" description="Enterprise tier name">Enterprise</Translate>
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">
                    <Translate id="landing.pricing.tier.enterprise.price" description="Enterprise tier price label (Custom)">
                      Custom
                    </Translate>
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-400">
                  <Translate id="landing.pricing.tier.enterprise.desc" description="Enterprise tier description">
                    Need higher limits or dedicated support? Let's talk.
                  </Translate>
                </p>
                <a
                  href="mailto:crewx@sowonlabs.com?subject=CrewX%20Enterprise%20inquiry"
                  className="btn-ghost mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Translate id="landing.pricing.tier.enterprise.cta" description="Enterprise tier CTA">
                    Contact us
                  </Translate>
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex gap-2">
                    <span className="text-emerald-400">✓</span>{' '}
                    <Translate id="landing.pricing.tier.enterprise.feature1" description="Enterprise tier feature 1">
                      Everything in Free
                    </Translate>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-400">✓</span>{' '}
                    <Translate id="landing.pricing.tier.enterprise.feature2" description="Enterprise tier feature 2">
                      Higher limits & dedicated support
                    </Translate>
                  </li>
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
              <Translate id="landing.pricing.footnote" description="Pricing section footnote">
                AI provider billing is handled by your own account. Marketplace apps may have their own terms.
              </Translate>
            </p>
          </section>

        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/assets/crewx-logo.png" alt="" className="h-4 w-4" />
              <span>
                <Translate id="landing.footer.tagline" description="Footer tagline">
                  CrewX · Open source CLI · Apache 2.0
                </Translate>
              </span>
            </div>
            <div className="flex items-center gap-5">
              <a className="hover:text-slate-300" href="https://github.com/sowonlabs/crewx" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="hover:text-slate-300" href="https://x.com/dohapark81" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <a className="hover:text-slate-300" href="https://www.threads.com/@sowonlabs" target="_blank" rel="noopener noreferrer">
                Threads
              </a>
              <a className="hover:text-slate-300" href="/docs/intro">
                <Translate id="landing.nav.docs" description="Top nav: Docs link">Docs</Translate>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
