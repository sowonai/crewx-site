import React from 'react';
import Link from '@docusaurus/Link';

export default function FinalCta(): React.ReactNode {
  return (
    <section className="final" id="get">
      <div className="wrap">
        <h2>What will you make yours?</h2>
        <p className="lede" style={{ margin: '16px auto 0' }}>
          Make an app for your life. Use it with your AI. Share it when someone comes to mind.
        </p>
        <div className="download-actions">
          <Link className="btn primary btn-lg" to="/download">
            Download CrewX
          </Link>
        </div>
        <p className="download-hint">Free · Windows installer · One command on Mac & Linux</p>
      </div>
    </section>
  );
}
