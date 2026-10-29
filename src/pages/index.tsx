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

import '../css/landing-v03.css';

export default function LandingPage(): React.ReactNode {
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
        <html className="crewx-landing" />
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
        <TopNav onLanding />

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
                <Link className="btn primary btn-lg" to="/download">
                  Download CrewX
                </Link>
                <a className="btn btn-lg ghost" href="#apps">
                  See examples
                </a>
              </div>
              <div className="fine">
                <span>Free</span>
                <span>Windows, Mac &amp; Linux</span>
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

        <LandingFooter />
      </div>
    </Layout>
  );
}
