import React from 'react';
import Layout from '@theme/Layout';
import DownloadPage from '@site/src/components/DownloadPage';

export default function Download(): React.ReactElement {
  return (
    <Layout
      noFooter
      title="Download"
      description="Download CrewX for Windows, or start it on Mac & Linux with one command. Free.">
      <DownloadPage locale="en" />
    </Layout>
  );
}
