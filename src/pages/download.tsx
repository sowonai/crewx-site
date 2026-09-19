import React from 'react';
import Layout from '@theme/Layout';
import DownloadPage from '@site/src/components/DownloadPage';

export default function Download(): React.ReactElement {
  return (
    <Layout
      title="Download"
      description="Download CrewX Desktop for Windows — version, size, and install steps from the latest verified GitHub Release.">
      <DownloadPage locale="en" />
    </Layout>
  );
}
