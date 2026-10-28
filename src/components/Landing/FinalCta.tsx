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
          <Link className="btn primary" to="/download">
            ⬇&nbsp; Download for Mac
          </Link>
          <Link className="btn" to="/download">
            Download for Windows
          </Link>
        </div>
        <p className="download-hint">Free to download · Works with your ChatGPT or Claude plan</p>
      </div>
    </section>
  );
}
