import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Slack Team Collaboration',
    emoji: '💬',
    description: (
      <>
        Bring AI agents directly into your team's Slack workspace. 
        <code>@claude</code>, <code>@gemini</code>, and <code>@copilot</code> work 
        together in real-time with thread-based context.
      </>
    ),
  },
  {
    title: 'Bring Your Own AI',
    emoji: '🤖',
    description: (
      <>
        Use your existing AI subscriptions. Transform any CLI tool or AI service 
        into an agent with simple YAML configuration. No coding required.
      </>
    ),
  },
  {
    title: 'Plugin Provider System',
    emoji: '🔌',
    description: (
      <>
        Universal AI integration. Connect OpenAI, Anthropic, Ollama, LiteLLM, or 
        integrate frameworks like LangChain, CrewAI, and AutoGPT seamlessly.
      </>
    ),
  },
];

function Feature({title, emoji, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.featureEmoji}>{emoji}</div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
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
