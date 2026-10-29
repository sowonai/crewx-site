import React, { useEffect, useState, useRef } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';

import HeroDemo from '@site/src/components/Landing/HeroDemo';
import ExampleShowcase from '@site/src/components/Landing/ExampleShowcase';
import StorySection from '@site/src/components/Landing/StorySection';
import GettingStarted from '@site/src/components/Landing/GettingStarted';
import PricingSection from '@site/src/components/Landing/PricingSection';
import FinalCta from '@site/src/components/Landing/FinalCta';

import '../css/landing-v03.css';

function LocaleDropdown(): React.ReactNode {
  const { i18n } = useDocusaurusContext();
  const { pathname, search, hash } = useLocation();
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

  const { currentLocale, defaultLocale, locales, localeConfigs } = i18n;

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
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="btn"
        style={{ height: 38, fontSize: 13, padding: '0 12px' }}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
        <span>{currentLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            right: 0,
            marginTop: 6,
            minWidth: 120,
            background: 'var(--card)',
            border: '1px solid var(--line)',
            borderRadius: 10,
            boxShadow: 'var(--shadow)',
            padding: 4,
            listStyle: 'none',
            zIndex: 50,
          }}
        >
          {locales.map((loc) => {
            const isActive = loc === currentLocale;
            return (
              <li key={loc}>
                <a
                  href={buildHref(loc)}
                  hrefLang={localeConfigs[loc]?.htmlLang}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    fontSize: 13,
                    borderRadius: 6,
                    fontWeight: isActive ? 700 : 500,
                    background: isActive ? 'var(--blue-soft)' : 'transparent',
                    color: isActive ? 'var(--blue)' : 'var(--ink)',
                  }}
                >
                  <span>{localeConfigs[loc]?.label ?? loc}</span>
                  {isActive && <span>✓</span>}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function LandingPage(): React.ReactNode {
  const { i18n } = useDocusaurusContext();
  const showSowonLabsLink = i18n.currentLocale === 'ko';
  const [heroCopied, setHeroCopied] = useState(false);

  const handleCopyNpx = async () => {
    try {
      await navigator.clipboard.writeText('npx crewx');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = 'npx crewx';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setHeroCopied(true);
    setTimeout(() => setHeroCopied(false), 1800);
  };

  useEffect(() => {
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  return (
    <Layout
      noFooter
      title="CrewX — Build an app with your AI. Share it with your friends."
      description="Work in your app by hand or with your AI. Set your priorities, ask for a change, and see it in the same app. Share it with a friend. They use it with their own AI."
    >
      <Head>
        <style>{`
          .navbar { display: none !important; }
          footer.footer { display: none !important; }
          .main-wrapper { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
        `}</style>
        <meta property="og:title" content="CrewX — Build an app with your AI. Share it with your friends." />
        <meta
          property="og:description"
          content="Work in your app by hand or with your AI. Set your priorities, ask for a change, and see it in the same app. Share it with a friend. They use it with their own AI."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="landing-page-wrapper">
        {/* Top Nav */}
        <nav className="top">
          <div className="wrap">
            <Link className="logo" to="/">
              <img src="/assets/crewx-logo.png" alt="CrewX" className="logo-img" />
              CrewX
            </Link>
            <div className="links">
              <a href="#demo">How it works</a>
              <a href="#apps">Apps</a>
              <a href="#pricing">Pricing</a>
              <a href="#your-ai">Getting started</a>
            </div>
            <div className="spacer" />
            <LocaleDropdown />
            <a className="btn primary" href="#get">
              Get CrewX
            </a>
          </div>
        </nav>

        {/* ===================== HERO ===================== */}
        <header className="hero">
          <div className="wrap">
            <div className="copy">
              <h1>
                <span className="key k-build">
                  <span className="badge" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="7.5" height="7.5" rx="1.8" />
                      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.8" />
                      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.8" />
                      <path d="M17.25 13.5v7.5M13.5 17.25h7.5" />
                    </svg>
                  </span>
                  Build an app
                </span>{' '}
                <span className="rest">with your AI.</span>
                <br />
                <span className="key k-share">
                  <span className="badge" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
                      <path d="M8 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-2" />
                    </svg>
                  </span>
                  Share it
                </span>{' '}
                <span className="rest">with your friends.</span>
              </h1>
              <p className="ask">
                An app for you. <b>And your AI.</b>
              </p>
              <p className="lede">
                Work in your app by hand or with your AI. Set your priorities, ask for a change, and see it in the same
                app.
                <br />
                Share it with a friend. They use it with their own AI.
              </p>
              <div className="ctas">
                <Link className="btn primary" to="/download">
                  ⬇&nbsp; Download for Windows <small>.exe</small>
                </Link>
                <div className="npx-pill" role="group" aria-label="Run on Mac with npx crewx">
                  <span className="npx-os">Mac</span>
                  <code className="npx-cmd">
                    <span className="npx-prompt">$</span>npx crewx
                  </code>
                  <button
                    className={`npx-copy ${heroCopied ? 'copied' : ''}`}
                    type="button"
                    onClick={handleCopyNpx}
                  >
                    {heroCopied ? 'Copied ✓' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="fine">
                <span>Free</span>
                <span>
                  Windows app or <code>npx crewx</code> on Mac
                </span>
                <span>Works with your ChatGPT or Claude plan</span>
                <span>Your files stay on your computer</span>
              </div>
            </div>

            <HeroDemo />
          </div>
        </header>

        {/* ===================== DISCOVERY / APPS ===================== */}
        <section id="apps" className="discover center">
          <div className="wrap">
            <span className="eyebrow">
              <span className="dot" />
              Your life. Your way.
            </span>
            <h2 style={{ marginTop: 14 }}>A little more like you.</h2>
            <p className="gallery-lede">
              Make a small app for something you already do. Then use it yourself, or ask your AI to help in the same
              app.
            </p>
            <ExampleShowcase />
          </div>
        </section>

        {/* Story, Getting Started, Pricing, Final CTA */}
        <StorySection />
        <GettingStarted />
        <PricingSection />
        <FinalCta />

        {/* Footer */}
        <footer>
          <div className="wrap">
            <span className="logo" style={{ fontSize: 15 }}>
              <img src="/assets/crewx-logo.png" alt="CrewX" className="logo-img" style={{ width: 20, height: 20 }} />
              CrewX
            </span>
            <Link to="/docs/intro">Docs</Link>
            <Link to="/blog">Blog</Link>
            <Link to="/templates">Templates</Link>
            <a href="https://github.com/sowonlabs/crewx" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            {showSowonLabsLink && (
              <a href="https://sowonlabs.com" target="_blank" rel="noopener noreferrer">
                SowonLabs
              </a>
            )}
            <span>© 2026 SowonLabs</span>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
