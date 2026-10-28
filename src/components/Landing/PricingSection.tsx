import React from 'react';
import Link from '@docusaurus/Link';

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
          Free for making, using, and receiving apps. Upgrade only when you share privately with a larger group.
        </p>
        <div className="tiers">
          <div className="tier">
            <b>Personal</b>
            <div className="price">Free</div>
            <div className="per">For you and a few friends</div>
            <ul>
              <li>Make and use unlimited apps</li>
              <li>Receive apps from anyone</li>
              <li>Share privately with up to 3 people</li>
              <li>Use with your own ChatGPT or Claude account</li>
            </ul>
            <a className="btn primary" href="#apps">
              Explore the examples
            </a>
          </div>
          <div className="tier pro">
            <div>
              <b>Pro</b>
              <span className="soon">Coming soon</span>
            </div>
            <div className="price">For larger groups</div>
            <div className="per">When a few friends becomes a wider circle</div>
            <p className="sharing-description">
              Everything in Personal, plus room to share privately with more people, push updates, and manage access.
            </p>
            <Link className="btn" to="/download">
              Download CrewX
            </Link>
          </div>
        </div>
        <p className="tiers-note">
          We count people you share privately with, not the number of apps you make. Everyone you share with keeps the
          apps they received.
        </p>
      </div>
    </section>
  );
}
