import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';

import HeroDemo from '@site/src/components/Landing/HeroDemo';
import ExampleShowcase from '@site/src/components/Landing/ExampleShowcase';
import StorySection from '@site/src/components/Landing/StorySection';
import GettingStarted from '@site/src/components/Landing/GettingStarted';
import PricingSection from '@site/src/components/Landing/PricingSection';
import FinalCta from '@site/src/components/Landing/FinalCta';
import { TopNav, LandingFooter } from '@site/src/components/Landing/TopNav';
import { useLandingCopy } from '@site/src/components/Landing/copy/useLandingCopy';

import '../css/landing-v03.css';

export default function LandingPage(): React.ReactNode {
  const { locale, t } = useLandingCopy();
  const h = t.hero;

  useEffect(() => {
    document.body.classList.add('landing-page-active');
    return () => {
      document.body.classList.remove('landing-page-active');
    };
  }, []);

  const buildKey = (
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
      {h.buildKey}
    </span>
  );
  const buildRest = <span className="rest">{h.buildRest}</span>;
  const shareKey = (
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
      {h.shareKey}
    </span>
  );
  const shareRest = <span className="rest">{h.shareRest}</span>;

  return (
    <Layout
      noFooter
      title={t.page.title}
      description={t.page.description}
    >
      <Head>
        <html className="crewx-landing" />
        <meta property="og:title" content={t.page.title} />
        <meta property="og:description" content={t.page.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={locale === 'ko' ? 'landing-page-wrapper landing-ko' : 'landing-page-wrapper'}>
        <TopNav onLanding />

        {/* ===================== HERO ===================== */}
        <header className="hero">
          <div className="wrap">
            <div className="copy">
              <h1>
                {h.restFirst ? (
                  <>
                    {buildRest}{' '}
                    {buildKey}
                  </>
                ) : (
                  <>
                    {buildKey}{' '}
                    {buildRest}
                  </>
                )}
                <br />
                {h.restFirst ? (
                  <>
                    {shareRest}{' '}
                    {shareKey}
                  </>
                ) : (
                  <>
                    {shareKey}{' '}
                    {shareRest}
                  </>
                )}
              </h1>
              <p className="ask">
                {h.askLead} <b>{h.askBold}</b>
              </p>
              <p className="lede">
                {h.ledeFirst}
                <br />
                {h.ledeSecond}
              </p>
              <div className="ctas">
                <Link className="btn primary btn-lg" to="/download">
                  {h.download}
                </Link>
                <a className="btn btn-lg ghost" href="#apps">
                  {h.seeExamples}
                </a>
              </div>
              <div className="fine">
                {h.fine.map((text) => (
                  <span key={text}>{text}</span>
                ))}
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
              {t.discover.eyebrow}
            </span>
            <h2 style={{ marginTop: 14 }}>{t.discover.title}</h2>
            <p className="gallery-lede">{t.discover.lede}</p>
            <ExampleShowcase />
          </div>
        </section>

        {/* Story, Getting Started, Pricing, Final CTA */}
        <StorySection />
        <GettingStarted />
        <PricingSection />
        <FinalCta />

        <LandingFooter />
      </div>
    </Layout>
  );
}
