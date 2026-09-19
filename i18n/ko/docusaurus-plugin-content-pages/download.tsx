import React from 'react';
import Layout from '@theme/Layout';
import DownloadPage from '@site/src/components/DownloadPage';

export default function Download(): React.ReactElement {
  return (
    <Layout
      title="다운로드"
      description="CrewX Desktop(Windows) 다운로드 — 검증된 최신 GitHub Release 기준 버전, 크기, 설치 안내.">
      <DownloadPage locale="ko" />
    </Layout>
  );
}
