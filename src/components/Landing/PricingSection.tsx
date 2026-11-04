import React from 'react';
import Link from '@docusaurus/Link';
import { useLandingCopy } from './copy/useLandingCopy';

const EARLY_ACCESS_WAITLIST_URL = 'https://app.sowonai.com/early-access?source=crewx-dev';

export default function PricingSection(): React.ReactNode {
  const { t } = useLandingCopy();
  const p = t.pricing;
  return (
    <section id="pricing" className="center">
      <div className="wrap">
        <span className="eyebrow">
          <span className="dot" />
          {p.eyebrow}
        </span>
        <h2 style={{ marginTop: 14 }}>{p.title}</h2>
        <p className="pricing-lede">{p.lede}</p>
        <div className="tiers">
          <div className="tier">
            <b>{p.freeName}</b>
            <div className="price">
              {p.freePrice} <small>{p.freePriceNote}</small>
            </div>
            <div className="per">{p.freePer}</div>
            <ul>
              {p.freeFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <Link className="btn" to="/download">
              {p.freeCta}
            </Link>
          </div>
          <div className="tier pro">
            <div>
              <b>{p.proName}</b>
              <span className="soon">{p.proBadge}</span>
            </div>
            <div className="price">
              {p.proPrice} <small>{p.proPriceNote}</small>
            </div>
            <div className="per">{p.proPer}</div>
            <ul>
              {p.proFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              className="btn primary"
              href={EARLY_ACCESS_WAITLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.proCta}
            </a>
          </div>
        </div>
        <p className="tiers-note">{p.note}</p>
      </div>
    </section>
  );
}
