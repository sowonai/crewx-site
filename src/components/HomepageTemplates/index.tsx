import {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import {useState} from 'react';
import styles from './styles.module.css';

function CopyButton({command}: {command: string}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      className={styles.copyButton}
      onClick={handleCopy}
      aria-label="Copy command">
      {copied ? (
        <span className={styles.copiedText}>✓ Copied!</span>
      ) : (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.5 4.5v-2a1 1 0 011-1h7a1 1 0 011 1v7a1 1 0 01-1 1h-2m-6 0h-3a1 1 0 01-1-1v-7a1 1 0 011-1h7a1 1 0 011 1v7a1 1 0 01-1 1z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function HomepageTemplates() {
  return (
    <section className={styles.templates}>
      <div className="container">
        <h2 className={styles.title}>
          {translate({
            id: 'homepage.templates.title',
            message: 'Project Templates',
            description: 'Templates section title',
          })}
        </h2>
        <p className={styles.subtitle}>
          {translate({
            id: 'homepage.templates.subtitle',
            message: 'Start your CrewX project with pre-configured templates',
            description: 'Templates section subtitle',
          })}
        </p>

        <div className={styles.templateCards}>
          <div className={styles.templateCard}>
            <h3>🤖 WBS Automation</h3>
            <p>
              {translate({
                id: 'homepage.templates.wbs.description',
                message: 'Project automation with Work Breakdown Structure',
                description: 'WBS template description',
              })}
            </p>
            <div className={styles.codeContainer}>
              <pre className={styles.code}>
                <code>crewx template init wbs-automation</code>
              </pre>
              <CopyButton command="crewx template init wbs-automation" />
            </div>
          </div>

          <div className={styles.templateCard}>
            <h3>🌐 Docusaurus i18n</h3>
            <p>
              {translate({
                id: 'homepage.templates.docusaurus.description',
                message: 'Documentation site with AI-powered translation',
                description: 'Docusaurus template description',
              })}
            </p>
            <div className={styles.codeContainer}>
              <pre className={styles.code}>
                <code>crewx template init docusaurus-i18n</code>
              </pre>
              <CopyButton command="crewx template init docusaurus-i18n" />
            </div>
          </div>

          <div className={styles.templateCard}>
            <h3>🎯 CrewX Skill</h3>
            <p>
              {translate({
                id: 'homepage.templates.crewxskill.description',
                message: 'Claude Code skill for CrewX CLI framework assistance',
                description: 'CrewX Skill template description',
              })}
            </p>
            <div className={styles.codeContainer}>
              <pre className={styles.code}>
                <code>crewx template init crewx-skill</code>
              </pre>
              <CopyButton command="crewx template init crewx-skill" />
            </div>
          </div>
        </div>

        <div className={styles.templatesCta}>
          <Link
            className="button button--primary button--lg"
            to="/templates/intro">
            {translate({
              id: 'homepage.templates.cta',
              message: 'Explore All Templates →',
              description: 'Templates CTA button',
            })}
          </Link>
        </div>
      </div>
    </section>
  );
}
