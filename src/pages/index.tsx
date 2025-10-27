import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import {translate} from '@docusaurus/Translate';
import HomepageHeader from '@site/src/components/HomepageHeader';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import HomepageQuickStart from '@site/src/components/HomepageQuickStart';

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'Welcome to CrewX',
        description: 'The homepage meta title',
      })}
      description={translate({
        id: 'homepage.description',
        message: 'Bring Your Own AI(BYOA) team in Slack/IDE with your existing subscriptions',
        description: 'The homepage meta description',
      })}>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageQuickStart />
      </main>
    </Layout>
  );
}
