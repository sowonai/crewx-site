import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type TemplateCardProps = {
  name: string;
  displayName: string;
  description: string;
  version: string;
  author: string;
  tags: string[];
  features: string[];
  crewxVersion: string;
};

function TemplateCard({
  name,
  displayName,
  description,
  version,
  author,
  tags,
  features,
  crewxVersion,
}: TemplateCardProps): ReactNode {
  return (
    <div className={clsx('card', styles.templateCard)}>
      <div className="card__header">
        <Heading as="h3">{displayName}</Heading>
        <div className={styles.templateMeta}>
          <span className={styles.version}>v{version}</span>
          <span className={styles.author}>by {author}</span>
        </div>
      </div>
      <div className="card__body">
        <p>{description}</p>

        {features.length > 0 && (
          <div className={styles.features}>
            <strong>Features:</strong>
            <ul>
              {features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.tags}>
          {tags.map((tag, idx) => (
            <span key={idx} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
      <div className="card__footer">
        <div className={styles.installCommand}>
          <code>crewx template init {name}</code>
        </div>
        <div className={styles.requirement}>
          Requires: CrewX {crewxVersion}
        </div>
      </div>
    </div>
  );
}

export default TemplateCard;
