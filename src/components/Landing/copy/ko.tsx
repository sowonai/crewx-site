import React from 'react';
import Link from '@docusaurus/Link';
import type { LandingCopy } from './en';

// Non-breaking space / word joiner: keep "Early Access", "30일 무료" and "30%를" from splitting across lines.
const NBSP = '\u00a0';
const WJ = '\u2060';

/**
 * 한국어 랜딩 문구. 해요체, 짧고 쉬운 말.
 * 영어판과 같은 모양(`LandingCopy`)이어야 하고, 키가 빠지거나 남으면 타입 에러가 나요.
 *
 * CrewX·IronCalc 같은 제품명, 파일/시트 이름, CLI 명령(`npx crewx@latest`)은 그대로 둬요.
 * 데모 속 숫자(마진 8.3%, 35.8% 등)는 영어판과 같아서 계산이 그대로 맞아요.
 */
export const ko: LandingCopy = {
  // ------------------------------------------------------------------ page
  page: {
    title: 'CrewX — 내 AI와 앱을 만들어요. 친구와 나눠 써요.',
    description:
      '앱에서 직접 일하거나, 내 AI와 함께 일해요. 우선순위를 정하고 바꿔 달라고 부탁하면, 같은 앱에서 바로 보여요. 친구에게 앱을 나눠 주면, 친구는 자기 AI로 써요.',
  },

  // ----------------------------------------------------------- nav / footer
  nav: {
    logoAlt: 'CrewX',
    sections: [
      { id: 'demo', label: '사용 방법' },
      { id: 'apps', label: '앱' },
      { id: 'pricing', label: '가격' },
      { id: 'your-ai', label: '시작하기' },
    ],
    download: '다운로드',
    switchToLight: '라이트 테마로 바꾸기',
    switchToDark: '다크 테마로 바꾸기',
  },
  footer: {
    download: '다운로드',
    docs: '문서',
    blog: '블로그',
    templates: '템플릿',
  },

  // ------------------------------------------------------------------ hero
  hero: {
    restFirst: true,
    buildRest: '내 AI와',
    buildKey: '앱을 만들어요.',
    shareRest: '친구와',
    shareKey: '나눠 써요.',
    askLead: '나를 위한 앱.',
    askBold: '내 AI와 함께 쓰는 앱.',
    ledeFirst: '앱에서 직접 일하거나, 내 AI와 함께 일해요. 우선순위를 정하고 바꿔 달라고 부탁하면, 같은 앱에서 바로 보여요.',
    ledeSecond: '친구에게 앱을 나눠 주세요. 친구는 자기 AI로 써요.',
    download: 'CrewX 다운로드',
    seeExamples: '예시 보기',
    fine: ['무료', 'Windows, Mac, Linux', 'ChatGPT·Claude 요금제 그대로 사용', '내 파일은 내 컴퓨터에 있어요'],
  },

  discover: {
    eyebrow: '내 일상, 내 방식.',
    title: '조금 더 나답게.',
    lede: '이미 하고 있는 일에 맞는 작은 앱을 만들어요. 직접 써도 되고, 같은 앱에서 AI에게 부탁해도 돼요.',
  },

  // ------------------------------------------------------------- hero demo
  demo: {
    tabs: ['1 · 내가 써요', '2 · 보내요', '3 · 친구 것이 돼요'],
    who: {
      you: '내 컴퓨터 · 내 AI',
      sam: '지우의 컴퓨터 · 지우의 AI',
    },
    insight: {
      ctx: 'IronCalc에서 범위를 고르면, AI가 원본 셀은 건드리지 않고 수식과 차트 초안을 준비해요.',
      draft: `수식 =(C5-D5)/C5를 E3:E6에 초안으로 넣었어요. 5행(소셜 영상, 8.3%)${WJ}은 보라색 표시로 알려 줘요.`,
      sam: `지우가 AI와 D5를 조정했어요. 이제 4개 채널 모두 마진 목표 15%${WJ}를 넘어요.`,
    },
    profit: {
      checking: '$13,300 · 마진 확인 중…',
      flagged: '$13,300 · 15% 미만 채널 1개 (소셜 영상)',
      healthy: '$16,600 · 모든 채널 양호 (30% 초과)',
    },
    chatLabel: '채팅',
    msgAsk: (
      <>
        선택한 범위(<b>A3:E6</b>)의 마진율을 수식으로 채워 주세요. 15% 미만인 채널은 표시하고, 요약 차트도 추가해 주세요.
      </>
    ),
    msgDraft: (
      <>
        <b>E3:E6</b>에 <code>=(C5-D5)/C5</code> 수식으로 초안을 만들고 <b>소셜 영상(8.3%)</b>{WJ}을 표시했어요. 표 아래에{' '}
        <b>CrewX 차트</b> 초안도 만들었어요.
      </>
    ),
    msgShare: '초안을 적용하고, 이 스프레드시트 앱을 지우에게 보내 주세요.',
    msgSent: '적용하고 보냈어요. 지우는 CrewX에서 같은 스프레드시트를 열고, 자기 AI로 써요.',
    msgEdit: 'D5에서 소셜 영상 광고비를 30% 줄이고, 마진을 다시 계산해 주세요.',
    msgDone: (
      <>
        <b>D5</b>를 $7,700으로 바꿨어요. 소셜 영상 마진이 <b>35.8%</b>{WJ}가 되어서, 모든 채널이 30%{WJ}를 넘어요.
      </>
    ),
    composer: 'AI에게 부탁해 보세요…',
    sentTitle: '✉ 채널 스프레드시트를 지우에게 보냈어요',
    sentNote: '지우가 CrewX에 로그인하면, 수식까지 그대로 들어 있어요.',
    empty: '스프레드시트를 열고 셀을 골라, AI에게 부탁해 보세요.',
    appTitle: 'oct-channels.xlsx — Spreadsheet',
    appNote: 'IronCalc 통합 문서 · AI가 고른 범위를 읽어요.',
    layout: '레이아웃',
    switchFile: '파일 바꾸기',
    fileShared: 'oct-channels.xlsx · 내가 공유함',
    importReport: '가져오기 보고서',
    contextSynced: 'AI에 전달됨',
    share: '공유',
    fnote: {
      sam: '· D5 30% 줄임 ($7,700) → 마진 35.8%',
      draft: '· 마진 15% 미만 표시 (소셜 영상 8.3%)',
      ctx: '· 마진율 수식',
    },
    bar: {
      done: (
        <>
          <b>시트에 적용했어요</b> · D5 변경($7,700) · 모든 채널 마진 30% 초과
        </>
      ),
      draft: (
        <>
          <b>AI 초안이 준비됐어요</b> · 원본은 그대로 · E3:E6 수식 + 차트 미리보기
        </>
      ),
      ctx: (
        <>
          <b>Oct_Channels!A3:E6</b>(4행 × 5열)을 AI가 볼 수 있게 공유했어요
        </>
      ),
    },
    undo: '되돌리기',
    saved: '✓ 저장됨',
    discard: '버리기',
    apply: '시트에 적용',
    sheetTitle: '10월 채널 성과 리뷰 (USD)',
    cols: { channel: '채널', orders: '주문', revenue: '매출', adCogs: '광고비+원가', margin: '마진율' },
    channels: { search: '검색 광고', newsletter: '뉴스레터', social: '소셜 영상', affiliates: '제휴 마케팅' },
    chartTitle: '채널별 마진율',
    chartBadge: { synced: 'CrewX 차트 · 동기화됨 ✓', draft: 'CrewX 차트 · AI 초안' },
    draftPill: '초안',
    statusLine: '합계 $41,400 · 평균',
    poweredBy: 'Powered by IronCalc',
    sideContext: 'AI가 보는 범위와 초안',
    sideProfit: '총 순이익',
    footNote:
      '예시 데모예요. CrewX 안에서 실제 IronCalc 스프레드시트가 돌아가요. 범위를 고르고, 보라색 칸의 AI 초안을 확인한 뒤, 준비되면 적용하면 돼요.',
    replay: '↺ 다시 보기',
  },

  // ------------------------------------------------------ example showcase
  showcase: {
    kicker: (name: string) => `둘러보기 / ${name}`,
    browseMore: '아이디어 더 보기 ↓',
    startWithIdea: '이런 아이디어로 시작해요',
    tagline: '내 앱, 내 AI. 한곳에서.',
    byHand: '직접',
    screenLabel: '예시 앱 화면',
    withYourAi: 'AI와 함께',
    you: '나',
    yourAi: '내 AI',
    sameAppNext: '같은 앱, 다음 단계',
    idle: {
      read: '앱을 열어 둔 채로 AI에게 질문해요.',
      shape: '목업이 바뀌는 모습을 보고, 함께 살펴봐요.',
      use: '내 부탁이 눈에 보이는 변화가 돼요.',
    },
    reset: '↺ 이 예시 처음으로',
    askAi: 'AI에게 물어보기 →',
    updateAi: 'AI와 바꿔 보기 →',
    steps: ['01 내가 고르기', '02 AI가 돕기', '03 내가 확인하기'],
    proofIdle: '내 상황에 맞춘 작은 앱이에요.',
    filterLabel: '예시 필터',
    filters: {
      All: '전체',
      Life: '생활',
      Create: '창작',
      Learn: '학습',
      Work: '업무',
      Build: '개발자용',
    },
    cats: {
      All: '전체',
      Life: '생활',
      Create: '창작',
      Learn: '학습',
      Work: '업무',
      Build: '개발',
    },
    count: (shown: number, total: number) => `예시 ${total}개 중 ${shown}개`,
    youPlusAi: '나 + AI',
    ideaToStart: '시작 아이디어',
    exploreThis: '이 예시 살펴보기',
    showFewer: '예시 줄이기 ↑',
    exploreAll: (n: number) => `예시 ${n}개 모두 보기 ↓`,

    variants: {
      buyComparePriceReply: 'Everyday Keys를 자세히 볼 후보로 표시했어요. 소음 정도를 확인하라는 메모도 남겼어요.',
      sheetProfitPrompt: '선택한 행(A3:E6)의 순이익(=C5-D5)을 계산하고, 가장 많이 번 채널을 강조해 주세요.',
      sheetProfitReply:
        'E3:E6에 =C5-D5로 AI 초안을 만들었어요. 광고비가 가장 적은 뉴스레터가 순이익 +$5,700로 1위예요.',
    },

    surf: {
      buyCompare: {
        legend: '무엇이 더 중요하세요?',
        quietness: '조용함',
        price: '가격',
        labelQuiet: '내 비교 · 조용함 먼저',
        labelPrice: '내 비교 · 가격 먼저',
        title: '내 책상에 맞는 키보드',
        candidatesQuiet: [
          ['Quiet Mini', 86, '38 dB · $149'],
          ['Everyday Keys', 78, '44 dB · $89'],
          ['Studio Board', 71, '46 dB · $129'],
        ],
        candidatesPrice: [
          ['Everyday Keys', 88, '$89 · 가성비 최고'],
          ['Quiet Mini', 76, '$149 · 38 dB'],
          ['Studio Board', 72, '$129 · 46 dB'],
        ],
        firstChoice: (name: string, spec: string) => `1순위: ${name} (${spec})`,
        fitScore: (score: number) => `적합도 ${score}점`,
        reviewNext: '다음에 확인 ✓',
        noteQuiet: '메모 추가: Quiet Mini를 고르기 전에 키감과 반품 정책을 확인하기.',
        notePrice: '메모 추가: Everyday Keys를 고르기 전에 소음 정도를 확인하기.',
      },
      travel: {
        label: '치앙마이 · 30일 워케이션',
        title: '일도 조금, 산책도 조금.',
        pills: ['님만해민 숙소', '예산 $1,420 / $1,800', '빠른 Wi-Fi ✓'],
        morningDone: '집중 근무 · 오전 시간 지킴 ✓',
        morning: '와로롯 시장 · 오전 방문',
        lunch: '올드타운 근처 카오소이 점심',
        afternoonDone: '와로롯 시장 · 오후로 옮김 ✓',
        afternoon: '비어 있는 오후 · 카페 투어',
        evening: '해 질 녘 루프톱 & 야시장',
      },
      workout: {
        label: '내 운동 · 오늘',
        title: '평범한 하루. 3세트 중 2세트.',
        session: '운동',
        sessionValue: '상체',
        exercise: '종목',
        exerciseValue: '로우',
        setHeader: '세트',
        repsHeader: '횟수 × 무게',
        notLogged: '기록 전',
        last: '지난 운동: 10 × 30 kg, 3세트.',
      },
      buyCar: {
        label: '내 다음 차',
        title: '가격표 그 이상.',
        candidate: '후보',
        candidateValue: '전기 밴',
        like: '마음에 드는 점',
        likeValue: '일과 주말에 넉넉한 공간',
        check: '확인할 점',
        checkValue: '주차 공간',
        done: '추가함: 정하기 전에 집 충전이 되는지 확인하기.',
        idle: '아직 남은 질문을 한곳에 모아 둬요.',
      },
      slides: {
        label: '4분기 전략 자료 · 8장 중 3장',
        thumbs: ['01 소개', '02 데이터', '03 결정', '04 다음'],
        pageLabel: '결정 슬라이드 · 16:9',
        titleDone: '어떤 성장 루프를 먼저 시작할까요?',
        title: '오늘 전략 회의 메모.',
        optionA: '옵션 A · 크리에이터 협업',
        optionADetail: '소형 유튜버 15명 · 빠른 초기 도달',
        optionB: '옵션 B · 리믹스 템플릿',
        optionBDetail: '고객 획득 비용 $0 · 앱 공유로 퍼지는 루프',
        done: '3장 재구성 · 결정 질문 + 옵션 2개 정렬 ✓',
        idle: '아이디어를 이야기하면, 옆에서 슬라이드가 만들어져요.',
      },
      japanese: {
        label: '일본어 · 내 연습',
        title: '한 번 더.',
        paperLabel: '카페에서',
        jp: 'これをください。',
        gloss: '“이거 주세요.”',
        pills: ['これ · 이것', 'それ · 그것'],
        done: '앱 옆의 설명을 읽고, 다시 해 봐요.',
        idle: '꼭 기억하고 싶은 표현 두 가지.',
      },
      timetable: {
        label: '나의 작은 일주일',
        title: '좋아하는 일을 위한 자리.',
        days: ['월', '화', '수', '목', '금'],
        school: '학교',
        classes: ['독서', '놀이', '음악', '도서관', '놀이'],
        artClub: '미술 동아리',
        artClubTime: '오후 4시',
        done: '화요일 · 미술 동아리 추가.',
        idle: '색이 살짝 더해진 한 주.',
      },
      mockup: {
        label: '실시간 목업 · 동네 정원 v2',
        navTitle: '작은 정원',
        navLinks: '소개 · 일정 · 참여',
        title: '동네에서 가장 푸른 한 모퉁이.',
        buttonDone: '정원 가꾸는 날 참여하기 ↗  · 첫 화면으로 옮김 ✓',
        warning: '⚠ 핵심 버튼이 스크롤을 내려야 보이는 곳에 있어요 ↓',
        done: '목업을 고쳤어요 · 버튼을 제목 옆으로 옮겨서 바로 확인할 수 있어요.',
        idle: '화면을 가리키고 AI에게 부탁하면, 바뀐 배치를 바로 볼 수 있어요.',
      },
      blog: {
        label: '내 초안',
        title: '요즘 배운 작은 것 하나.',
        paperLabel: '첫 문단',
        paragraphDone: '비 오는 아침, 더 작은 계획을 세웠어요. 끝낼 일 하나. 내려놓을 일 하나.',
        paragraph:
          '오래전부터 뭔가 바꿔 보고 싶다는 생각을 했어요. 비 오는 어느 아침, 마침내 끝낼 일 하나와 내려놓을 일 하나만 두는 더 작은 계획을 해 보기로 했어요.',
        done: '첫 문단을 고쳤어요 · 내 이야기는 그대로예요.',
        idle: '내 목소리가 중심에 있어요.',
      },
      planner: {
        label: '오늘',
        title: '숨 쉴 틈을 조금 남겨요.',
        draft: '초안 쓰기',
        lunch: '점심',
        catchUp: '밀린 일 정리',
        errandsMoved: '볼일 · 여기로 옮김',
        freeHour: '한 시간 비워 둠',
        errands: '볼일',
        banner: '바꿀 수 있는 계획이에요. 꼭 지켜야 하는 규칙이 아니에요.',
      },
      comments: {
        label: 'YouTube 댓글 레이더 · 댓글 257개',
        title: '시청자들이 계속 묻는 것.',
        topics: [
          ['설치·시작', '48%', '124번 언급'],
          ['앱 예시', '32%', '82번 언급'],
          ['가격·요금제', '20%', '51번 언급'],
        ],
        bars: ['설치 (124)', '예시 (82)', '가격 (51)'],
        done: '🎬 다음 영상 기획안이 준비됐어요: “처음 3단계 — 내 Claude/ChatGPT 요금제로 시작하기”',
        idle: '시청자 댓글을 자동으로 묶어서, 다음 인기 영상을 찾아봐요.',
      },
      sheet: {
        legend: '선택한 범위(A3:E6)에서 AI가 무엇을 살펴볼까요?',
        flagLow: '낮은 마진 표시 (<15%)',
        rankProfit: '순이익($) 순위 매기기',
        label: 'oct-channels.xlsx · Spreadsheet',
        title: '익숙한 IronCalc 표. 고른 셀에 AI 초안.',
        switchFile: '파일 바꾸기',
        importReport: '가져오기 보고서 · 1',
        badgeDone: 'E3:E6 AI 초안 · 적용 ✓',
        badge: 'A3:E6 범위를 AI에 전달',
        sheetTitle: '10월 채널 성과',
        cols: { channel: '채널', orders: '주문', revenue: '매출', adCogs: '광고비+원가', margin: '마진율', profit: '순이익' },
        channels: { search: '검색 광고', newsletter: '뉴스레터', social: '소셜 영상', affiliates: '제휴 마케팅' },
        statusLine: '합계 $41,400 · Powered by IronCalc',
        bannerMargin: 'AI 초안 =(C5-D5)/C5를 E3:E6에 넣었어요 · 5행 표시 (소셜 영상 광고비가 매출의 91.7%).',
        bannerProfit: 'AI 초안 =C5-D5를 E3:E6에 넣었어요 · 광고비가 가장 적은 뉴스레터가 순이익 +$5,700로 1위.',
        bannerIdle: 'IronCalc 표에서 셀을 고른 뒤, AI에게 수식 초안이나 이상한 값을 찾아 달라고 부탁해 보세요.',
      },
      notes: {
        label: '같이 계획하는 중',
        title: '쓸모 있는 것만 남겨요.',
        paperLabel: '계획',
        bring: '준비물',
        bringValue: '돗자리',
        invite: '초대',
        inviteValue: '늘 만나는 모임',
        decided: '결정',
        decidedValue: '토요일 · 공원에서',
        open: '아직 미정',
        openValue: '비가 오면 어떡하지?',
        done: '결정한 내용을 같은 메모에 추가했어요.',
        idle: '대화는 계속 흘러가도, 메모는 남아요.',
      },
      relationMap: {
        label: '행사 준비 관계도 · 4단계',
        title: '무엇을 먼저 해야 할까요?',
        pill: '행사 오픈',
        pillDone: '모든 단계 연결 완료 ✓',
        pillIdle: '빠진 단계 1개 발견',
        venue: '01 · 장소',
        venueNote: '확정 ✓',
        invitation: '02 · 초대장',
        invitationNote: '초안 완료',
        approvalDone: '03 · 인쇄 승인 ✓',
        approval: '03 · 승인 단계?',
        approvalNoteDone: '발송 전에 추가함',
        approvalNote: '빠진 단계',
        send: '04 · 발송',
        sendNote: '손님 200명',
        done: '디자인과 발송 사이에 인쇄 승인을 넣었어요 ✓',
        idle: '사람, 결정, 막힌 곳을 한 화면에 그려요.',
      },
      todo: {
        label: '토요일 나들이',
        title: '작은 목록, 더 좋은 하루.',
        pick: '☑ 가고 싶은 곳 정하기',
        pickStatus: '완료',
        pack: '○ 얇은 겉옷 챙기기',
        packStatus: '할 일',
        reserve: '○ 자리 예약하기',
        trains: '○ 기차 시간 확인하기',
        added: '추가됨',
        done: '두 가지를 추가했어요. 기억할 일이 하나 줄었어요.',
        idle: '대화에서 나온 다음 할 일.',
      },
      research: {
        label: '내 조사 · 예시 도구',
        title: '근거를 눈앞에 둬요.',
        theme: '주제',
        toolA: 'Tool A',
        toolB: 'Tool B',
        setup: '설정',
        import: '가져오기',
        support: '지원',
        mentioned: '언급됨',
        noSample: '사례 없음',
        done: '더 살펴볼 만해요: 기존 작업 가져오기.',
        idle: '작은 표본이에요. 결론이 아니라 더 알아볼 질문이에요.',
      },
      issue: {
        label: '데모 프로젝트 · 이슈 #12',
        title: '버튼을 눌러도 반응이 없어요.',
        pills: ['열림', '정보 필요'],
        stepsLabel: '재현 단계',
        steps: ['1. 목록 열기', '2. 항목 선택하기', '3. 저장 누르기'],
        expected: '기대한 결과',
        expectedValue: '항목이 저장돼요',
        browser: '브라우저 버전',
        browserMissing: '아직 없음',
        browserIdle: '적혀 있지 않음',
      },
      code: {
        label: '예시 파일 · search.js',
        title: '몇 줄의 코드, 좋은 질문 하나.',
        done: '일찍 반환 · 빈 입력은 건너뛰어요.',
        idle: '설명 옆에서 코드를 읽어요.',
      },
      codeMap: {
        label: '데모 저장소',
        title: '전체를 한눈에 느껴 봐요.',
        interface: '인터페이스',
        interfaceNote: '화면과 구성 요소',
        services: '서비스',
        tests: '테스트',
        utilities: '유틸리티',
      },
      timer: {
        label: '잠깐의 집중',
        title: '한 번에 하나씩.',
        ready: '준비',
        pillDone: '예시 · 집중 시간이 시작됐어요',
        pillIdle: '서두르지 않아도 돼요. 준비되면 시작하세요.',
      },
      hwp: {
        label: 'HWP 문서',
        title: '워케이션 신청서',
        paperLabel: '2쪽 · 필수 제출 사항',
        intro: '신청 전에 준비할 것:',
        items: ['간단한 자기소개', '희망 일정', '워케이션 계획'],
        done: '필요한 세 가지를 대화로 요약했어요.',
        idle: '일하는 동안 원문 페이지를 열어 두세요.',
      },
    },
  },

  // ----------------------------------------------------------------- story
  story: {
    ariaLabel: '작은 앱 하나, 한 뼘 더 가까이',
    eyebrow: '그 순간',
    titleFirst: '작은 앱 하나.',
    titleSecond: '한 뼘 더 가까이.',
    chat: [
      '이번 주엔 뭐 만들어요?',
      '제가 만든 작은 앱을 쓰고 있어요.',
      '그걸 직접 만들었어요?',
      'AI랑 같이 계획을 세워요.',
      '저도 써 봐도 돼요?',
    ],
    f1Title: '“직접 만든 거예요?”',
    f1Body: '매주 쓰는 앱이, 친구가 찾던 바로 그 앱일 수 있어요.',
    mailTo: '받는 사람: 지우',
    mailBody: '제가 쓰는 앱이에요. 지금 쓰는 AI로 한 주를 계획해 보세요.',
    cardTitle: '식단표',
    cardMeta: 'CrewX 앱 · v1',
    mailGo: 'CrewX에서 열기',
    f2Title: '“자, 한번 써 봐요.”',
    f2Body: '앱을 보내 보세요. 친구는 CrewX에서 열고, 자기 AI와 입맛에 맞게 바꿔요.',
    laptopTitle: '지우의 식단표',
    laptopTag: '나의 한 주',
    f3Title: '친구의 한 주. 친구의 AI.',
    f3Body: '친구는 AI와 메뉴를 고르고, 곧바로 저녁을 만들어요.',
  },

  // ------------------------------------------------------- getting started
  start: {
    eyebrow: '시작하기',
    titleFirst: '내 컴퓨터.',
    titleSecond: '내 AI. 내 앱.',
    lede: 'CrewX는 AI와 함께 작은 앱을 만들고 쓰는 데스크톱 작업 공간이에요. 위의 예시처럼, 일상의 부탁 하나로 시작해 보세요.',
    step1Title: 'CrewX 열기',
    step1Body: (
      <>
        Windows에서는 설치해서 쓰고, Mac과 Linux에서는 명령어 한 줄로 시작해요. <Link to="/download">{`다운로드${NBSP}→`}</Link>
      </>
    ),
    step2Title: '내 AI 연결하기',
    step2Body: 'ChatGPT나 Claude 계정을 그대로 써요.',
    step3Title: '첫 앱을 말로 설명하기',
    step3Body: '써 보고, 결과를 확인하고, 바꾸고 싶은 점을 부탁해요.',
    details: [
      {
        title: '하던 일로 돌아와요.',
        body: '후보 목록이나 계획, 기록을 앱에 담아 두세요. 열 때마다 그대로 기다리고 있어요.',
      },
      {
        title: '같은 앱에서 계속 해요.',
        body: '직접 눌러서 고치거나, AI에게 같은 화면을 바꿔 달라고 부탁해요.',
      },
      {
        title: '쓰던 AI를 그대로 가져와요.',
        body: '쓰고 있는 ChatGPT나 Claude 요금제를 연결하면 돼요. CrewX에서 따로 AI 구독을 결제할 필요는 없어요.',
      },
    ],
    faq: [
      {
        q: 'Windows와 Mac·Linux는 어떻게 시작하나요?',
        a: (
          <>
            Windows에서는 <Link to="/download">다운로드 페이지</Link>의 설치 파일을 실행해요. Mac과 Linux에서는 Node.js를
            설치한 뒤, 터미널에서 <code>npx crewx@latest</code>를 실행해요. 그러면 브라우저에서 CrewX가 열려요.
          </>
        ),
      },
      {
        q: 'AI는 어떻게 연결되나요?',
        a: 'CrewX가 ChatGPT(Codex 이용) 또는 Claude(Claude Code 이용) 계정에 연결돼요. 그래서 AI가 앱 안에서 만들고 일할 수 있어요.',
      },
      {
        q: '친구에게는 무엇이 필요한가요?',
        a: (
          <>
            친구는 <Link to="/download">다운로드 페이지</Link>에서 CrewX를 무료로 받고, 로그인한 뒤 자기 AI를 연결해요. 그러면
            내가 공유한 앱을 바로 쓸 수 있어요.
          </>
        ),
      },
      {
        q: '내 파일은 어떻게 되나요?',
        a: '앱과 파일은 내 컴퓨터에 있어요. AI는 내가 채팅에서 공유하기로 한 내용으로 일해요.',
      },
    ],
  },

  // --------------------------------------------------------------- pricing
  pricing: {
    eyebrow: '가격',
    title: '나만의 작은 앱으로 시작해요.',
    lede: `만들고, 쓰고, 공유를 시작하는 건 무료예요. Early${NBSP}Access 대기자 명단에 등록하면, 얼리어답터로서 Pro를 무료로 써 볼 수 있어요.`,
    freeName: 'Free',
    freePrice: '$0',
    freePriceNote: '영원히',
    freePer: '나와 친구, 매일 쓰는 용도로',
    freeFeatures: [
      '앱을 제한 없이 만들고, 쓰고, 받아요',
      '내 ChatGPT나 Claude 계정으로 써요',
      '친구와 앱을 써 볼 수 있는 기본 공유',
      '완성된 앱을 둘러보고 설치해요',
    ],
    freeCta: 'CrewX 다운로드',
    proName: 'Pro',
    proBadge: 'Early Access',
    proPrice: '무료',
    proPriceNote: '얼리어답터 대상',
    proPer: `Early${NBSP}Access 기간 동안 최대 10명에게 공유, 30일${NBSP}무료`,
    proFeatures: [
      'Free의 모든 기능 + 더 넓은 공유',
      '3명 대신 최대 10명에게 공유해요',
      '업데이트를 보내고, 공유한 버전을 관리해요',
      '새로운 제작·공유 도구를 먼저 써 봐요',
    ],
    proCta: '무료 Pro 이용 신청',
    note: `누구나 CrewX를 받아서 Free로 바로 공유를 시작할 수 있어요. 대기자 명단에서 승인된 얼리어답터는 확대된 공유 기능을 열어 가는 동안 30일${NBSP}무료 Pro 체험을 받아요.`,
  },

  // ------------------------------------------------------------- final cta
  finalCta: {
    title: '무엇을 내 것으로 만들까요?',
    lede: '내 일상에 맞는 앱을 만들어요. AI와 함께 써요. 누군가 떠오르면 나눠 줘요.',
    download: 'CrewX 다운로드',
    hint: '무료 · Windows 설치 파일 · Mac·Linux는 명령어 한 줄',
  },
};
