import React, { useState } from 'react';
import Link from '@docusaurus/Link';

export default function FinalCta(): React.ReactNode {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('npx crewx');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = 'npx crewx';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="final" id="get">
      <div className="wrap">
        <h2>What will you make yours?</h2>
        <p className="lede" style={{ margin: '16px auto 0' }}>
          Make an app for your life. Use it with your AI. Share it when someone comes to mind.
        </p>
        <div className="get-grid">
          <div className="get-card">
            <span className="get-badge">Windows 10 / 11 · Desktop App</span>
            <h3>Download for Windows</h3>
            <p>Install the Electron desktop app and open CrewX from your Start menu.</p>
            <Link className="btn primary" to="/download">
              ⬇&nbsp; Download for Windows <small>.exe</small>
            </Link>
          </div>
          <div className="get-card">
            <span className="get-badge">macOS · Terminal (Node.js)</span>
            <h3>Run with npx on Mac</h3>
            <p>No installer needed. Run one command in Terminal to launch the CrewX workspace.</p>
            <div className="npx-pill dark" role="group" aria-label="Copy npx crewx command">
              <code className="npx-cmd">
                <span className="npx-prompt">$</span>npx crewx
              </code>
              <button
                className={`npx-copy ${copied ? 'copied' : ''}`}
                type="button"
                onClick={handleCopy}
              >
                {copied ? 'Copied ✓' : 'Copy command'}
              </button>
            </div>
          </div>
        </div>
        <p className="download-hint">
          Free to use · Works with your ChatGPT or Claude plan · Mac uses Node.js 18+
        </p>
      </div>
    </section>
  );
}
