import React from 'react';
import Link from '@docusaurus/Link';
import { useLandingCopy } from './copy/useLandingCopy';

export default function FinalCta(): React.ReactNode {
  const { t } = useLandingCopy();
  const c = t.finalCta;
  return (
    <section className="final" id="get">
      <div className="wrap">
        <h2>{c.title}</h2>
        <p className="lede" style={{ margin: '16px auto 0' }}>
          {c.lede}
        </p>
        <div className="download-actions">
          <Link className="btn primary btn-lg" to="/download">
            {c.download}
          </Link>
        </div>
        <p className="download-hint">{c.hint}</p>
      </div>
    </section>
  );
}
