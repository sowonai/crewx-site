import React from 'react';
import Link from '@docusaurus/Link';

const EARLY_ACCESS_WAITLIST_URL = 'https://app.sowonai.com/early-access?source=crewx-dev';

export default function PricingSection(): React.ReactNode {
  return (
    <section id="pricing" className="center">
      <div className="wrap">
        <span className="eyebrow">
          <span className="dot" />
          Pricing
        </span>
        <h2 style={{ marginTop: 14 }}>Start with your own little app.</h2>
        <p className="pricing-lede">
          Free to build, use, and start sharing. Join the Early Access waitlist to try Pro for free as an early adopter.
        </p>
        <div className="tiers">
          <div className="tier">
            <b>Free</b>
            <div className="price">
              $0 <small>forever</small>
            </div>
            <div className="per">For you, your friends, and everyday use</div>
            <ul>
              <li>Make, use, and receive unlimited apps</li>
              <li>Use with your own ChatGPT or Claude account</li>
              <li>Starter sharing to try your apps with friends</li>
              <li>Explore and install ready-made apps</li>
            </ul>
            <Link className="btn" to="/download">
              Download CrewX
            </Link>
          </div>
          <div className="tier pro">
            <div>
              <b>Pro</b>
              <span className="soon">Early Access</span>
            </div>
            <div className="price">
              Free <small>for early adopters</small>
            </div>
            <div className="per">Share with up to 10 people, free for 30 days during early access</div>
            <ul>
              <li>Everything in Free, with expanded sharing</li>
              <li>Share with up to 10 people instead of 3</li>
              <li>Push updates and manage your shared releases</li>
              <li>Early access to new creator and sharing tools</li>
            </ul>
            <a
              className="btn primary"
              href={EARLY_ACCESS_WAITLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Request Free Pro Access
            </a>
          </div>
        </div>
        <p className="tiers-note">
          Everyone can download CrewX and start sharing on Free right away. Approved early adopters on the waitlist
          get a free 30-day Pro trial while we roll out expanded sharing.
        </p>
      </div>
    </section>
  );
}
