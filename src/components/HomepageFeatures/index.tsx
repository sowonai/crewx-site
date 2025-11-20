import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Translate, {translate} from '@docusaurus/Translate';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.features.slackCollaboration.title',
      message: 'Slack Team Collaboration',
      description: 'Title for Slack Team Collaboration feature',
    }),
    emoji: '💬',
    description: (
      <Translate
        id="homepage.features.slackCollaboration.description"
        description="Description for Slack Team Collaboration feature">
        Bring AI agents directly into your team's Slack workspace.
        @claude, @gemini, and @copilot work together in real-time with thread-based context.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.byoa.title',
      message: 'Bring Your Own AI',
      description: 'Title for BYOA feature',
    }),
    emoji: '🤖',
    description: (
      <Translate
        id="homepage.features.byoa.description"
        description="Description for BYOA feature">
        Use your existing AI subscriptions. Transform any CLI tool or AI service
        into an agent with simple YAML configuration. No coding required.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.features.pluginSystem.title',
      message: 'Plugin Provider System',
      description: 'Title for Plugin Provider System feature',
    }),
    emoji: '🔌',
    description: (
      <Translate
        id="homepage.features.pluginSystem.description"
        description="Description for Plugin Provider System feature">
        Universal AI integration. Connect OpenAI, Anthropic, Ollama, LiteLLM, or
        integrate frameworks like LangChain, CrewAI, and AutoGPT seamlessly.
      </Translate>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className={styles.featureCard}>
        <div className="text--center">
          <div className={styles.featureEmoji}>{emoji}</div>
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
