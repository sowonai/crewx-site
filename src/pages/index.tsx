import type {ReactNode} from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
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
    --bg: #0a0e27;
    --bg-2: #0d1330;
    --line: rgba(255, 255, 255, 0.08);
    --muted: #9aa3c7;
    --pink: #ec4899;
    --orange: #f97316;
    --violet: #8b5cf6;
    background: var(--bg);
    color: #e8ebf5;
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
    font-feature-settings: "cv02", "cv11";
    min-height: 100vh;
    overflow-x: hidden;
  }
  .landing-page-wrapper .font-mono {
    font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .landing-page-wrapper .glow-bg {
    background-image:
      radial-gradient(900px 600px at 12% 18%, rgba(139,92,246,0.18), transparent 60%),
      radial-gradient(900px 700px at 92% 10%, rgba(236,72,153,0.16), transparent 60%),
      radial-gradient(700px 500px at 70% 80%, rgba(249,115,22,0.12), transparent 60%),
      radial-gradient(500px 400px at 30% 75%, rgba(56,189,248,0.1), transparent 60%);
  }
  .landing-page-wrapper .grid-bg {
    background-image:
      linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.9), transparent 70%);
  }
  .landing-page-wrapper .btn-primary {
    background: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f97316 100%);
    box-shadow: 0 12px 40px -12px rgba(236,72,153,0.6), inset 0 1px 0 rgba(255,255,255,0.25);
  }
  .landing-page-wrapper .btn-primary:hover {
    filter: brightness(1.08);
  }
  .landing-page-wrapper .btn-ghost {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
  }
  .landing-page-wrapper .btn-ghost:hover {
    background: rgba(255,255,255,0.08);
  }
  .landing-page-wrapper .card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--line);
    backdrop-filter: blur(8px);
  }
  .landing-page-wrapper .chip {
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--line);
  }
  .landing-page-wrapper .x-r { color: #ef4444; }
  .landing-page-wrapper .x-g { color: #22c55e; }
  .landing-page-wrapper .x-b { color: #3b82f6; }
  .landing-page-wrapper .x-x {
    background: linear-gradient(135deg, #ec4899, #f97316);
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
    background: linear-gradient(135deg, #fff 0%, #c8c9ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
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
      title="CrewX — 1 person. 1,000 agents."
      description="CrewX turns 1 person into 1,000 agents: many teams, many perspectives, one operator."
    >
      <Head>
        <meta property="og:title" content="CrewX — 1 person. 1,000 agents." />
        <meta property="og:description" content="Build your AI team. It's easy." />
        <script src="https://cdn.tailwindcss.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap"
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
              <a className="hover:text-white" href="/docs/intro">Docs</a>
              <a className="hover:text-white" href="/blog">Blog</a>
              <a className="hover:text-white" href="/templates">Templates</a>
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
                href="#get-started"
                className="btn-primary rounded-full px-4 py-2 text-sm font-semibold text-white"
              >
                Get started
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
                <h1 className="font-extrabold leading-[0.98] tracking-tight">
                  <span className="block text-3xl text-slate-100 sm:text-5xl lg:text-[56px]">
                    1 person.
                  </span>
                  <span className="grad-text mt-1 block pb-2 text-[40px] font-black leading-[1.25] sm:text-7xl lg:text-[88px]">
                    <span className="font-black">1,000</span> agents.
                  </span>
                </h1>

                <div className="mt-5 flex items-center gap-3 text-sm text-slate-400">
                  <img src="/assets/crewx-logo.png" alt="" className="h-5 w-5" />
                  <span className="font-semibold tracking-wide">
                    <span className="text-white">Ready Agents.</span>
                    <span className="text-slate-500">·</span>
                    <span className="x-x">Real Work.</span>
                  </span>
                </div>

                <p className="mt-8 max-w-2xl text-lg text-slate-300/90 sm:text-xl">
                  <span className="font-semibold text-white">Build your AI team.</span> It&apos;s easy.
                </p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Plan, market, ship, support — every function of your work, run
                  by specialists who remember, collaborate, and answer to you alone.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href="#get-started"
                    className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Get started in 5 min
                  </a>
                </div>

                <div className="mt-8 max-w-md">
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm">
                    <span className="text-emerald-400">$</span>
                    <span className="flex-1 text-slate-200">
                      npx <span className="text-pink-400">crewx@latest</span>
                    </span>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10"
                    >
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 px-1 text-[11px] text-slate-500">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3 w-3">
                      <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                    <span>Web UI opens automatically — no login, no install</span>
                  </div>
                </div>

                <div className="mt-12">
                  <div className="text-xs uppercase tracking-wider text-slate-500">
                    The coding agents you already use — now as one team
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3 text-slate-400">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-500/15">
                        <img src="/assets/claude-logo-dark.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      Claude Code
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/15">
                        <img src="/assets/chatgpt-logo-dark.svg" alt="" className="h-[22px] w-[22px] object-contain" />
                      </span>
                      Codex
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-sky-500/15">
                        <img src="/assets/gemini-logo.svg" alt="" className="h-4 w-4 object-contain" />
                      </span>
                      Gemini CLI
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
                <span className="text-pink-400">✦</span> Why CrewX
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl lg:text-6xl">
                Stop juggling.<br />Start operating.
              </h2>
              <p className="mt-3 text-base text-slate-400">From AI tools to an AI team.</p>
              <p className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-400">
                A chatbot can answer. A single AI tool can do one task. But real
                work needs planning, splitting, execution, review, and memory.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-400">
                CrewX turns the AI tools you already use into a{' '}
                <span className="font-semibold text-white">role-based team</span>:
                a supervisor assigns the work, AI workers execute in parallel,
                reviewers check the result, and every decision stays in context —
                across engineering, design, content, support, and analytics.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">
                You supervise the work from the browser. CrewX handles threads,
                roles, memory, and handoffs so you stop juggling prompts and start
                operating an{' '}
                <span className="font-semibold text-white">AI-native team</span>.
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
                <h3 className="mt-4 text-base font-semibold">Multi-provider orchestration</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Mix Claude, Gemini, Codex, Copilot, OpenCode in a single crew —
                  Claude plans &amp; reviews, Codex verifies, Gemini researches,
                  Copilot runs personas, OpenCode handles bulk.
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
                <h3 className="mt-4 text-base font-semibold">Work Instructions (WI)</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  The PM agent writes structured tickets, then dispatches them to
                  workers. Threaded, traceable, replayable — every change has a
                  paper trail.
                </p>
              </div>

              {/* Feature: Threaded */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M21 12c0 4.97-4.03 9-9 9-1.5 0-2.91-.37-4.15-1.02L3 21l1.02-4.85A8.96 8.96 0 0 1 3 12c0-4.97 4.03-9 9-9s9 4.03 9 9z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">Threaded conversations</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Each topic lives in its own thread with full history. Agents keep
                  context across days — no more re-pasting your stack.
                </p>
              </div>

              {/* Feature: Memory */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M12 3v18M3 12h18M5.5 5.5l13 13M18.5 5.5l-13 13" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">Long-term memory</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Agents save decisions, knowhow, and worklogs as Markdown.
                  BM25-indexed, model-readable, version-controlled with your repo.
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
                <h3 className="mt-4 text-base font-semibold">Skills & built-in tools</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Drop-in skills for memory, search, docs, code review. Compose them
                  per agent. Build your own with a single SKILL.md.
                </p>
              </div>

              {/* Feature: Hooks */}
              <div className="card group rounded-2xl p-6 hover:bg-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-base font-semibold">Hooks & automations</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Pre/post-tool hooks, scheduled jobs, custom slash commands. Wire
                  CrewX into your existing workflow without leaving the browser.
                </p>
              </div>
            </div>
          </section>

          {/* ── PROVIDERS ── */}
          <section className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <div className="chip inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-slate-300">
                <span className="text-sky-400">◇</span> Providers
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl">
                Pick the right model<br />per role.
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-400">
                Each tool earns its role from how developers actually use it.
                Swap any time — no prompt rewrites, no lock-in.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
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
                  <li>· Opus 4.7 / Sonnet 4.6</li>
                  <li>· Plan Mode · 1M context</li>
                  <li className="text-slate-300">· Role: <span className="text-orange-300">Planner & Reviewer</span></li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky-500/15 p-1.5">
                    <img src="/assets/gemini-logo.svg" alt="Gemini" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">Gemini</div>
                    <div className="text-xs text-slate-500">Google</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· 3 Pro / Flash</li>
                  <li>· Live web grounding</li>
                  <li className="text-slate-300">· Role: <span className="text-sky-300">Researcher</span></li>
                </ul>
              </div>

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
                  <li>· GPT-5.1-Codex</li>
                  <li>· Adversarial review · race conditions</li>
                  <li className="text-slate-300">· Role: <span className="text-emerald-300">Verifier</span></li>
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
                  <li className="text-slate-300">· Role: <span className="text-pink-300">Persona simulator</span></li>
                </ul>
              </div>

              <div className="card rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-violet-500/15 p-1.5">
                    <img src="/assets/opencode-logo.svg" alt="OpenCode" className="h-full w-full object-contain" />
                  </span>
                  <div>
                    <div className="text-sm font-semibold">OpenCode</div>
                    <div className="text-xs text-slate-500">Community provider</div>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  <li>· GLM / Qwen / DeepSeek / Kimi</li>
                  <li>· Local via Ollama / LM Studio</li>
                  <li className="text-slate-300">· Role: <span className="text-violet-300">Bulk worker</span> <span className="text-slate-500">· low-sensitivity</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* ── PRICING ── */}
          <section id="pricing" className="relative mx-auto max-w-7xl px-6 py-24">
            <div className="max-w-3xl">
              <div className="chip inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-base text-slate-300">
                <span className="text-orange-400">$</span> Pricing
              </div>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight grad-text sm:text-5xl">
                Pay for the wrapper.<br />Not the AI.
              </h2>
              <p className="mt-5 max-w-2xl text-lg text-slate-400">
                Use the AI subscriptions you already pay for — Claude Code, Codex,
                Gemini CLI, Copilot CLI. We never charge a token markup.
              </p>
            </div>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Free */}
              <div className="card relative rounded-2xl p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Free</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">$0</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Try it. Create your first agent.</p>
                <a
                  href="#get-started"
                  className="btn-ghost mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Start Free
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workflows</span><span className="font-mono">10</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Agents (per WS)</span><span className="font-mono">10</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Projects</span><span className="font-mono">10</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workspaces</span><span className="font-mono">3</span></li>
                  <li className="mt-3 flex gap-2 border-t border-white/5 pt-3"><span className="text-emerald-400">✓</span> Web UI (no install)</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span> Bring your own AI subscriptions</li>
                </ul>
              </div>

              {/* Basic */}
              <div className="card relative rounded-2xl p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Basic</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">$10</span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Solo builders. First real workflows.</p>
                <a
                  href="#"
                  className="btn-ghost mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Start with Basic
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workflows</span><span className="font-mono">20</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Agents (per WS)</span><span className="font-mono">20</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Projects</span><span className="font-mono">20</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workspaces</span><span className="font-mono">10</span></li>
                  <li className="mt-3 flex gap-2 border-t border-white/5 pt-3"><span className="text-emerald-400">✓</span> Community support</li>
                </ul>
              </div>

              {/* Pro (highlighted) */}
              <div className="relative rounded-2xl border border-pink-400/30 bg-gradient-to-b from-pink-500/[0.08] to-transparent p-7 shadow-2xl shadow-pink-500/10">
                <span className="absolute -top-3 left-7 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  1,000 agents
                </span>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-pink-300">Pro</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">$20</span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Power users. 1,000 agents in one workspace org.</p>
                <a
                  href="#"
                  className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Get Pro
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workflows</span><span className="font-mono">100</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Agents (per WS)</span><span className="font-mono text-pink-200">100</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Projects</span><span className="font-mono">40</span></li>
                  <li className="flex justify-between gap-2"><span className="text-slate-400">Workspaces</span><span className="font-mono">10</span></li>
                  <li className="flex justify-between gap-2 border-t border-pink-400/20 pt-3"><span className="font-semibold text-pink-200">Total agents</span><span className="font-mono font-semibold text-pink-200">1,000 ✦</span></li>
                </ul>
              </div>

              {/* Max */}
              <div className="card relative rounded-2xl p-7">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Max</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-5xl font-extrabold">Custom</span>
                </div>
                <p className="mt-3 text-sm text-slate-400">Bigger needs? Let&apos;s talk.</p>
                <a
                  href="mailto:contact@sowonlabs.com?subject=CrewX%20Max%20inquiry"
                  className="btn-ghost mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Contact us
                </a>
                <ul className="mt-6 space-y-2.5 text-sm text-slate-300">
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span> Everything in Pro</li>
                  <li className="flex gap-2"><span className="text-emerald-400">✓</span> Custom limits & support</li>
                </ul>
              </div>
            </div>

            <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-slate-500">
              All plans use the AI subscriptions you already pay for — Claude Code,
              Codex, Gemini CLI, Copilot CLI. CrewX charges 0% token markup.
            </p>
          </section>

        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-slate-500 sm:flex-row">
            <div className="flex items-center gap-2">
              <img src="/assets/crewx-logo.png" alt="" className="h-4 w-4" />
              <span>CrewX · Open source CLI · Apache 2.0</span>
            </div>
            <div className="flex items-center gap-5">
              <a className="hover:text-slate-300" href="https://github.com/sowonlabs/crewx" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className="hover:text-slate-300" href="/docs/intro">Docs</a>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
