import React from 'react';
import Layout from '@theme/Layout';
import DownloadPage from '@site/src/components/DownloadPage';

export default function Download(): React.ReactElement {
  return (
    <Layout
      noFooter
      title="다운로드"
      description="Windows용 CrewX를 내려받거나, Mac에서는 명령어 한 줄로 시작하세요. 무료.">
      <DownloadPage locale="ko" />
    </Layout>
  );
}
