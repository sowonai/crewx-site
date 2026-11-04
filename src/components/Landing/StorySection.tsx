import React from 'react';
import { useLandingCopy } from './copy/useLandingCopy';

export default function StorySection(): React.ReactNode {
  const { t } = useLandingCopy();
  const s = t.story;
  return (
    <section className="story center" aria-label={s.ariaLabel}>
      <div className="wrap">
        <span className="eyebrow" style={{ color: 'var(--orange)' }}>
          <span className="dot" style={{ background: 'var(--orange)' }} />
          {s.eyebrow}
        </span>
        <h2 style={{ marginTop: 14 }}>
          {s.titleFirst}
          <br />
          <span className="warm" style={{ color: 'var(--orange)' }}>{s.titleSecond}</span>
        </h2>
        <div className="frames">
          <figure className="frame">
            <div className="pic">
              <div className="phone">
                <div className="bub dim">{s.chat[0]}</div>
                <div className="bub r dim">{s.chat[1]}</div>
                <div className="bub">{s.chat[2]}</div>
                <div className="bub r">{s.chat[3]}</div>
                <div className="bub">{s.chat[4]}</div>
              </div>
            </div>
            <span className="n">01</span>
            <h3>{s.f1Title}</h3>
            <p>{s.f1Body}</p>
          </figure>
          <figure className="frame">
            <div className="pic">
              <div className="mail">
                <div className="to">{s.mailTo}</div>
                {s.mailBody}
                <div className="card">
                  <span>🥗</span>
                  <div>
                    <b>{s.cardTitle}</b>
                    <br />
                    <small style={{ color: '#888' }}>{s.cardMeta}</small>
                  </div>
                </div>
                <div className="go">{s.mailGo}</div>
              </div>
            </div>
            <span className="n">02</span>
            <h3>{s.f2Title}</h3>
            <p>{s.f2Body}</p>
          </figure>
          <figure className="frame">
            <div className="pic">
              <div className="laptop">
                <div className="scr">
                  <div className="t">
                    {s.laptopTitle} <em>{s.laptopTag}</em>
                  </div>
                  <div className="mini">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i className="s" />
                    <i className="o" />
                    <i className="s" />
                    <i className="o" />
                    <i />
                    <i />
                    <i className="s" />
                    <i />
                  </div>
                </div>
                <div className="base" />
              </div>
            </div>
            <span className="n">03</span>
            <h3>{s.f3Title}</h3>
            <p>{s.f3Body}</p>
          </figure>
        </div>
      </div>
    </section>
  );
}
