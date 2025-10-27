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

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>
              {translate({
                id: 'homepage.quickstart.install.title',
                message: 'Install CrewX',
                description: 'Install step title',
              })}
            </h3>
            <pre className={styles.code}>
              <code>npx crewx-quickstart</code>
            </pre>
            <p className={styles.description}>
              {translate({
                id: 'homepage.quickstart.install.description',
                message: 'Scaffold a ready-to-run CrewX workspace in 30 seconds',
                description: 'Install step description',
              })}
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>
              {translate({
                id: 'homepage.quickstart.verify.title',
                message: 'Verify Setup',
                description: 'Verify step title',
              })}
            </h3>
            <pre className={styles.code}>
              <code>crewx doctor</code>
            </pre>
            <p className={styles.description}>
              {translate({
                id: 'homepage.quickstart.verify.description',
                message: 'Check that your AI providers (Claude, Gemini, Copilot) are installed',
                description: 'Verify step description',
              })}
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>
              {translate({
                id: 'homepage.quickstart.start.title',
                message: 'Start Using',
                description: 'Start step title',
              })}
            </h3>
            <pre className={styles.code}>
              <code>crewx q "@claude analyze this code"</code>
            </pre>
            <p className={styles.description}>
              {translate({
                id: 'homepage.quickstart.start.description',
                message: 'Query agents from CLI, or deploy as Slack bot or MCP server',
                description: 'Start step description',
              })}
            </p>
          </div>
        </div>

        <div className={styles.modes}>
          <h3 className={styles.modesTitle}>
            {translate({
              id: 'homepage.quickstart.modes.title',
              message: 'Three Deployment Modes',
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
