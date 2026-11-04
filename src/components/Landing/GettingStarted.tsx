import React from 'react';
import { useLandingCopy } from './copy/useLandingCopy';

export default function GettingStarted(): React.ReactNode {
  const { t } = useLandingCopy();
  const s = t.start;
  return (
    <section id="your-ai">
      <div className="wrap byo">
        <div>
          <span className="eyebrow">
            <span className="dot" />
            {s.eyebrow}
          </span>
          <h2 style={{ marginTop: 14 }}>
            {s.titleFirst}
            <br />
            {s.titleSecond}
          </h2>
          <p className="lede" style={{ marginTop: 16 }}>
            {s.lede}
          </p>
        </div>
        <div className="plans">
          <div className="plan">
            <span className="dot" style={{ background: '#475569' }}>
              1
            </span>
            <div>
              <b>{s.step1Title}</b>
              <small>{s.step1Body}</small>
            </div>
          </div>
          <div className="plan">
            <span className="dot" style={{ background: '#10a37f' }}>
              2
            </span>
            <div>
              <b>{s.step2Title}</b>
              <small>{s.step2Body}</small>
            </div>
          </div>
          <div className="plan">
            <span className="dot" style={{ background: '#7c3aed' }}>
              3
            </span>
            <div>
              <b>{s.step3Title}</b>
              <small>{s.step3Body}</small>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="start-details">
          {s.details.map((d) => (
            <div key={d.title}>
              <h3>{d.title}</h3>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
        {s.faq.map((item) => (
          <details className="setup-detail" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
