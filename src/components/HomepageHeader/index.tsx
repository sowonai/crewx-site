import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Translate from '@docusaurus/Translate';

import styles from './index.module.css';

export default function HomepageHeader(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>
          <Translate
            id="homepage.tagline"
            description="The homepage tagline">
            Bring Your Own AI(BYOA) team in Slack/IDE with your existing subscriptions
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            <Translate
              id="homepage.getStarted"
              description="Get Started button text">
              Get Started - 5min ⏱️
            </Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="https://github.com/sowonlabs/crewx">
            <Translate
              id="homepage.viewOnGitHub"
              description="View on GitHub button text">
              View on GitHub
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}
