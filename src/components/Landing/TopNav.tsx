import React, { useEffect, useRef, useState } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useLocation } from '@docusaurus/router';
import { useColorMode } from '@docusaurus/theme-common';

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

function ThemeToggle(): React.ReactNode {
  const { colorMode, setColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && colorMode === 'dark';
  const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';
  return (
    <button
      type="button"
      className="btn theme-toggle"
      onClick={() => setColorMode(isDark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Shared top bar for the landing and /download pages. On the landing the section
 * links are in-page anchors; elsewhere they point back to the landing sections.
 */
export function TopNav({ onLanding = false }: { onLanding?: boolean }): React.ReactNode {
  const sections = [
    { id: 'demo', label: 'How it works' },
    { id: 'apps', label: 'Apps' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'your-ai', label: 'Getting started' },
  ];
  return (
    <nav className="top">
      <div className="wrap">
        <Link className="logo" to="/">
          <img src="/assets/crewx-logo.png" alt="CrewX" className="logo-img" />
          CrewX
        </Link>
        <div className="links">
          {sections.map((s) =>
            onLanding ? (
              <a key={s.id} href={`#${s.id}`}>
                {s.label}
              </a>
            ) : (
              <Link key={s.id} to={`/#${s.id}`}>
                {s.label}
              </Link>
            ),
          )}
        </div>
        <div className="spacer" />
        <div className="nav-tools">
          <ThemeToggle />
          <LocaleDropdown />
        </div>
        <Link className="btn primary" to="/download">
          Download
        </Link>
      </div>
    </nav>
  );
}

export function LandingFooter(): React.ReactNode {
  const { i18n } = useDocusaurusContext();
  const showSowonLabsLink = i18n.currentLocale === 'ko';
  return (
    <footer>
      <div className="wrap">
        <span className="logo" style={{ fontSize: 15 }}>
          <img src="/assets/crewx-logo.png" alt="CrewX" className="logo-img" style={{ width: 20, height: 20 }} />
          CrewX
        </span>
        <Link to="/download">Download</Link>
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
  );
}
