import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

export default function HomepageQuickStart() {
  return (
    <section className={styles.quickstart}>
      <div className="container">
        <h2 className={styles.title}>
          {translate({
            id: 'homepage.quickstart.title',
            message: 'Quick Start',
            description: 'Quick Start section title',
          })}
        </h2>

        <div className={styles.methods}>
          {/* Method 1: Quickstart - Full Setup with Slack */}
          <div className={styles.method}>
            <div className={styles.methodBadge}>
              {translate({
                id: 'homepage.quickstart.method1.badge',
                message: 'Recommended',
                description: 'Recommended badge',
              })}
            </div>
            <h3 className={styles.methodTitle}>
              {translate({
                id: 'homepage.quickstart.method1.title',
                message: '🚀 Full Setup with Slack (5 min)',
                description: 'Method 1 title',
              })}
            </h3>
            <p className={styles.methodDescription}>
              {translate({
                id: 'homepage.quickstart.method1.description',
                message: 'Complete workspace setup including Slack bot configuration',
                description: 'Method 1 description',
              })}
            </p>
            <pre className={styles.code}>
              <code>npx crewx-quickstart</code>
            </pre>
            <p className={styles.methodNote}>
              {translate({
                id: 'homepage.quickstart.method1.note',
                message: 'Creates crewx.yaml, Slack manifest, and setup scripts',
                description: 'Method 1 note',
              })}
            </p>
          </div>

          {/* Method 2: Global Install - For Quick CLI Usage */}
          <div className={styles.method}>
            <h3 className={styles.methodTitle}>
              {translate({
                id: 'homepage.quickstart.method2.title',
                message: '⚡ Global Install (CLI Only)',
                description: 'Method 2 title',
              })}
            </h3>
            <p className={styles.methodDescription}>
              {translate({
                id: 'homepage.quickstart.method2.description',
                message: 'For users who just need the CLI tool',
                description: 'Method 2 description',
              })}
            </p>
            <pre className={styles.code}>
              <code>npm install -g crewx</code>
            </pre>
            <p className={styles.methodNote}>
              {translate({
                id: 'homepage.quickstart.method2.note',
                message: 'Then run: crewx init && crewx doctor',
                description: 'Method 2 note',
              })}
            </p>
          </div>
        </div>

        <div className={styles.modes}>
          <h3 className={styles.modesTitle}>
            {translate({
              id: 'homepage.quickstart.modes.title',
              message: '3 Ways to Use CrewX',
              description: 'Deployment modes title',
            })}
          </h3>
          <div className={styles.modeCards}>
            <div className={styles.modeCard}>
              <h4>💻 CLI</h4>
              <pre className={styles.codeSmall}>
                <code>crewx q "@agent message"</code>
              </pre>
            </div>
            <div className={styles.modeCard}>
              <h4>💬 Slack Bot</h4>
              <pre className={styles.codeSmall}>
                <code>crewx slack</code>
              </pre>
            </div>
            <div className={styles.modeCard}>
              <h4>🔌 MCP Server</h4>
              <pre className={styles.codeSmall}>
                <code>crewx mcp</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
