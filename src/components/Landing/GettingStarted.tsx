import React from 'react';

export default function GettingStarted(): React.ReactNode {
  return (
    <section id="your-ai">
      <div className="wrap byo">
        <div>
          <span className="eyebrow">
            <span className="dot" />
            Getting started
          </span>
          <h2 style={{ marginTop: 14 }}>
            Your computer.
            <br />
            Your AI. Your app.
          </h2>
          <p className="lede" style={{ marginTop: 16 }}>
            CrewX is a desktop workspace for making and using small apps with AI. Start with an everyday request, like
            the ones above.
          </p>
        </div>
        <div className="plans">
          <div className="plan">
            <span className="dot" style={{ background: '#475569' }}>
              1
            </span>
            <div>
              <b>Open CrewX</b>
              <small>
                Download the Windows app (.exe), or run <code>npx crewx</code> in Terminal on a Mac.
              </small>
            </div>
          </div>
          <div className="plan">
            <span className="dot" style={{ background: '#10a37f' }}>
              2
            </span>
            <div>
              <b>Connect your AI</b>
              <small>Works with your ChatGPT or Claude account.</small>
            </div>
          </div>
          <div className="plan">
            <span className="dot" style={{ background: '#7c3aed' }}>
              3
            </span>
            <div>
              <b>Describe your first app</b>
              <small>Try it, check the result, and ask for changes.</small>
            </div>
          </div>
        </div>
      </div>
      <div className="wrap">
        <div className="start-details">
          <div>
            <h3>Come back to your work.</h3>
            <p>Keep your shortlist, plan, or log in an app that stays ready whenever you open it.</p>
          </div>
          <div>
            <h3>Keep working in the same app.</h3>
            <p>Click and edit by hand, or ask your AI to update the same screen.</p>
          </div>
          <div>
            <h3>Bring the AI you already use.</h3>
            <p>Connect your existing ChatGPT or Claude plan—no extra AI subscription from us.</p>
          </div>
        </div>
        <details className="setup-detail">
          <summary>How do I start on Windows vs. Mac?</summary>
          <p>
            On Windows, download and run the desktop installer (<code>.exe</code>). On a Mac, open Terminal and run{' '}
            <code>npx crewx</code> (requires Node.js 18+)—it opens the exact same CrewX desktop workspace without a
            separate installer.
          </p>
        </details>
        <details className="setup-detail">
          <summary>How does the AI connection work?</summary>
          <p>
            CrewX connects to your ChatGPT (via Codex) or Claude (via Claude Code) account so your AI can build and work
            inside your apps.
          </p>
        </details>
        <details className="setup-detail">
          <summary>What does a friend need?</summary>
          <p>
            Your friend opens CrewX for free (via the Windows installer or <code>npx crewx</code> on Mac), signs in, and
            connects their own AI to start using the app you shared.
          </p>
        </details>
        <details className="setup-detail">
          <summary>What happens to my files?</summary>
          <p>Your apps and files live on your computer, and your AI works with the context you choose to share in chat.</p>
        </details>
      </div>
    </section>
  );
}
