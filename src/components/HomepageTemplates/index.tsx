import {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

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
            <pre className={styles.code}>
              <code>crewx template init wbs-automation</code>
            </pre>
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
            <pre className={styles.code}>
              <code>crewx template init docusaurus-i18n</code>
            </pre>
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
            <pre className={styles.code}>
              <code>crewx template init crewx-skill</code>
            </pre>
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
