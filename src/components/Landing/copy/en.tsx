import React from 'react';
import Link from '@docusaurus/Link';

/**
 * English landing copy. This is the source of truth for the shape of the copy
 * tree: `ko.tsx` is typed as `LandingCopy`, so a missing or extra key in the
 * Korean file is a compile error.
 *
 * Product names (CrewX, IronCalc), file/sheet names and the CLI command stay the
 * same in every language. Example *app names* come from appsData.ts / appsData.ko.ts.
 */
export const en = {
  // ------------------------------------------------------------------ page
  page: {
    title: 'CrewX — Build an app with your AI. Share it with your friends.',
    description:
      'Work in your app by hand or with your AI. Set your priorities, ask for a change, and see it in the same app. Share it with a friend. They use it with their own AI.',
  },

  // ----------------------------------------------------------- nav / footer
  nav: {
    logoAlt: 'CrewX',
    sections: [
      { id: 'demo', label: 'How it works' },
      { id: 'apps', label: 'Apps' },
      { id: 'pricing', label: 'Pricing' },
      { id: 'your-ai', label: 'Getting started' },
    ],
    download: 'Download',
    switchToLight: 'Switch to light theme',
    switchToDark: 'Switch to dark theme',
  },
  footer: {
    download: 'Download',
    docs: 'Docs',
    blog: 'Blog',
    templates: 'Templates',
  },

  // ------------------------------------------------------------------ hero
  hero: {
    // `restFirst` flips the order of the small "rest" phrase and the big keyword (Korean puts the verb last).
    restFirst: false,
    buildKey: 'Build an app',
    buildRest: 'with your AI.',
    shareKey: 'Share it',
    shareRest: 'with your friends.',
    askLead: 'An app for you.',
    askBold: 'And your AI.',
    ledeFirst:
      'Work in your app by hand or with your AI. Set your priorities, ask for a change, and see it in the same app.',
    ledeSecond: 'Share it with a friend. They use it with their own AI.',
    download: 'Download CrewX',
    seeExamples: 'See examples',
    fine: ['Free', 'Windows, Mac & Linux', 'Works with your ChatGPT or Claude plan', 'Your files stay on your computer'],
  },

  discover: {
    eyebrow: 'Your life. Your way.',
    title: 'A little more like you.',
    lede: 'Make a small app for something you already do. Then use it yourself, or ask your AI to help in the same app.',
  },

  // ------------------------------------------------------------- hero demo
  demo: {
    tabs: ['1 · You work in it', '2 · You send it', '3 · They make it theirs'],
    who: {
      you: 'Your computer · your AI',
      sam: "Sam's computer · Sam's own AI",
    },
    insight: {
      ctx: 'Select a range in IronCalc, and your AI prepares formulas + a chart draft without touching original cells.',
      draft: 'Formula =(C5-D5)/C5 drafted on E3:E6. Row 5 (Social Video, 8.3%) flagged with purple diff markers.',
      sam: 'Sam adjusted D5 with his AI. All 4 channels now clear the 15% margin target.',
    },
    profit: {
      checking: '$13,300 · checking margins…',
      flagged: '$13,300 · 1 channel under 15% (Social Video)',
      healthy: '$16,600 · All channels healthy (>30%)',
    },
    chatLabel: 'Chat',
    msgAsk: (
      <>
        In the selected range (<b>A3:E6</b>), fill Margin % with a formula, flag any channel under 15%, and add a summary
        chart.
      </>
    ),
    msgDraft: (
      <>
        Prepared a draft on <b>E3:E6</b> with <code>=(C5-D5)/C5</code> and flagged <b>Social Video (8.3%)</b>. I also
        drafted a <b>CrewX Chart</b> below the grid.
      </>
    ),
    msgShare: 'Apply the draft and share this spreadsheet app with Sam.',
    msgSent: 'Applied and sent. Sam opens the same spreadsheet in CrewX and runs it with his own AI.',
    msgEdit: 'Cut Social Video ad spend by 30% in D5 and recalculate margins.',
    msgDone: (
      <>
        Updated <b>D5</b> to $7,700. Social Video margin is now <b>35.8%</b> — all channels are above 30%.
      </>
    ),
    composer: 'Ask your AI…',
    sentTitle: '✉ Channel Spreadsheet sent to Sam',
    sentNote: "Sam opens CrewX, signs in, and it's there with your formulas.",
    empty: 'Open your spreadsheet, select cells, and ask your AI.',
    appTitle: 'oct-channels.xlsx — Spreadsheet',
    appNote: 'IronCalc workbook · AI reads your selected range.',
    layout: 'Layout',
    switchFile: 'Switch file',
    fileShared: 'oct-channels.xlsx · Shared by you',
    importReport: 'Import report',
    contextSynced: 'Context synced',
    share: 'Share',
    fnote: {
      sam: '· D5 cut -30% ($7,700) → 35.8% margin',
      draft: '· Flag < 15% margin (Social Video 8.3%)',
      ctx: '· Margin % formula',
    },
    bar: {
      done: (
        <>
          <b>Applied to sheet</b> · D5 updated ($7,700) · All channels &gt; 30% margin
        </>
      ),
      draft: (
        <>
          <b>AI Draft ready</b> · Original untouched · E3:E6 formula + chart preview
        </>
      ),
      ctx: (
        <>
          <b>Oct_Channels!A3:E6</b> (4 rows × 5 cols) shared in AI view context
        </>
      ),
    },
    undo: 'Undo',
    saved: '✓ Saved',
    discard: 'Discard',
    apply: 'Apply to sheet',
    sheetTitle: 'OCTOBER CHANNEL PERFORMANCE REVIEW (USD)',
    cols: { channel: 'Channel', orders: 'Orders', revenue: 'Revenue', adCogs: 'Ad + COGS', margin: 'Margin %' },
    channels: { search: 'Search Ads', newsletter: 'Newsletter', social: 'Social Video', affiliates: 'Affiliates' },
    chartTitle: 'Margin % by Channel',
    chartBadge: { synced: 'CrewX Chart · Synced ✓', draft: 'CrewX Chart · AI Draft' },
    draftPill: 'Draft',
    statusLine: 'SUM $41,400 · AVG',
    poweredBy: 'Powered by IronCalc',
    sideContext: 'AI View Context & Draft',
    sideProfit: 'Total Net Profit',
    footNote:
      'Illustrative demo · Real IronCalc spreadsheet inside CrewX. Select a range, review the AI draft in purple diff cells, and apply when ready.',
    replay: '↺ Replay',
  },

  // ------------------------------------------------------ example showcase
  showcase: {
    kicker: (name: string) => `Explore / ${name}`,
    browseMore: 'Browse more ideas ↓',
    startWithIdea: 'Start with an idea',
    tagline: 'Your app. Your AI. One place.',
    byHand: 'By hand',
    screenLabel: 'Illustrated app screen',
    withYourAi: 'With your AI',
    you: 'YOU',
    yourAi: 'YOUR AI',
    sameAppNext: 'SAME APP, NEXT STEP',
    idle: {
      read: 'Keep the app in view while you ask a question.',
      shape: 'See a change to the mockup, then review it together.',
      use: 'Your request can become a change you can see.',
    },
    reset: '↺ Reset this example',
    askAi: 'Ask your AI →',
    updateAi: 'Update with your AI →',
    steps: ['01 You choose', '02 AI helps', '03 You review'],
    proofIdle: 'A small app shaped around your situation.',
    filterLabel: 'Filter examples',
    filters: {
      All: 'All',
      Life: 'Life',
      Create: 'Create',
      Learn: 'Learn',
      Work: 'Work',
      Build: 'For developers',
    },
    cats: {
      All: 'All',
      Life: 'Life',
      Create: 'Create',
      Learn: 'Learn',
      Work: 'Work',
      Build: 'Build',
    } as Record<string, string>,
    count: (shown: number, total: number) => `${shown} of ${total} examples`,
    youPlusAi: 'YOU + AI',
    ideaToStart: 'An idea to start with',
    exploreThis: 'Explore this example',
    showFewer: 'Show fewer examples ↑',
    exploreAll: (n: number) => `Explore all ${n} examples ↓`,

    // Variants of the prompt / reply that depend on the toggles inside two interactive examples.
    variants: {
      buyComparePriceReply: 'Marked Everyday Keys for a closer look. I added a reminder to check its noise level.',
      sheetProfitPrompt: 'In the selected rows (A3:E6), calculate Net Profit (=C5-D5) and highlight the top-earning channel.',
      sheetProfitReply:
        'Prepared an AI draft on E3:E6 with =C5-D5. Newsletter leads at +$5,700 net profit with the lowest ad spend.',
    },

    // Illustrated screens, one block per example id.
    surf: {
      buyCompare: {
        legend: 'What matters more to you?',
        quietness: 'Quietness',
        price: 'Price',
        labelQuiet: 'My comparison · quietness first',
        labelPrice: 'My comparison · price first',
        title: 'A keyboard for my desk',
        candidatesQuiet: [
          ['Quiet Mini', 86, '38 dB · $149'],
          ['Everyday Keys', 78, '44 dB · $89'],
          ['Studio Board', 71, '46 dB · $129'],
        ] as [string, number, string][],
        candidatesPrice: [
          ['Everyday Keys', 88, '$89 · Best value'],
          ['Quiet Mini', 76, '$149 · 38 dB'],
          ['Studio Board', 72, '$129 · 46 dB'],
        ] as [string, number, string][],
        firstChoice: (name: string, spec: string) => `First choice: ${name} (${spec})`,
        fitScore: (score: number) => `${score} fit score`,
        reviewNext: 'Review next ✓',
        noteQuiet: 'Note added: Check the key feel and return policy before choosing Quiet Mini.',
        notePrice: 'Note added: Check the noise level before choosing Everyday Keys.',
      },
      travel: {
        label: 'Chiang Mai · 30-Day Workation',
        title: 'Work a little. Wander a little.',
        pills: ['Nimman Base', '$1,420 / $1,800 budget', 'Fast Wi-Fi ✓'],
        morningDone: 'Deep Work · Morning block protected ✓',
        morning: 'Warorot Market · Morning visit',
        lunch: 'Khao Soi lunch near Old Town',
        afternoonDone: 'Warorot Market · Moved to afternoon ✓',
        afternoon: 'Open afternoon · Café hop',
        evening: 'Sunset rooftop & night bazaar',
      },
      workout: {
        label: 'My workout · Today',
        title: 'An ordinary day. 2 of 3 sets.',
        session: 'Session',
        sessionValue: 'Upper body',
        exercise: 'Exercise',
        exerciseValue: 'Row',
        setHeader: 'SET',
        repsHeader: 'REPS × WEIGHT',
        notLogged: 'Not logged',
        last: 'Last workout: 3 sets of 10 × 30 kg.',
      },
      buyCar: {
        label: 'My next car',
        title: 'More than the sticker price.',
        candidate: 'Candidate',
        candidateValue: 'Electric van',
        like: 'What I like',
        likeValue: 'Room for work + weekends',
        check: 'What to check',
        checkValue: 'Parking space',
        done: 'Added: confirm home charging before deciding.',
        idle: 'One place for the questions I still have.',
      },
      slides: {
        label: 'Q4 Strategy Deck · Slide 3 of 8',
        thumbs: ['01 Intro', '02 Data', '03 Decide', '04 Next'],
        pageLabel: 'Decision slide · 16:9',
        titleDone: 'Which growth loop should we launch first?',
        title: 'Notes from today’s strategy discussion.',
        optionA: 'Option A · Creator Collabs',
        optionADetail: '15 micro-YouTubers · Fast initial reach',
        optionB: 'Option B · Remix Templates',
        optionBDetail: '$0 CAC · Viral app sharing loop',
        done: 'Slide 3 restructured · Decision question + 2 options aligned ✓',
        idle: 'Talk through the idea while the slide takes shape beside you.',
      },
      japanese: {
        label: 'Japanese · My practice',
        title: 'One more try.',
        paperLabel: 'At a café',
        jp: 'これをください。',
        gloss: '“This one, please.”',
        pills: ['これ · this one', 'それ · that one'],
        done: 'Read the explanation beside the app, then try again.',
        idle: 'Two expressions I want to remember.',
      },
      timetable: {
        label: 'My little week',
        title: 'Room for the things I love.',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        school: 'School',
        classes: ['Reading', 'Play', 'Music', 'Library', 'Play'],
        artClub: 'Art club',
        artClubTime: '4 pm',
        done: 'Tuesday · art club added.',
        idle: 'A week with a little color.',
      },
      mockup: {
        label: 'Live Mockup · Community Garden v2',
        navTitle: 'the little garden',
        navLinks: 'About · Schedule · Join',
        title: 'A greener corner of the neighborhood.',
        buttonDone: 'Join a garden day ↗  · Moved above fold ✓',
        warning: '⚠ Primary button currently buried below the fold ↓',
        done: 'Updated mockup · CTA moved beside headline for instant review.',
        idle: 'Point at the screen, ask your AI, and review the layout change live.',
      },
      blog: {
        label: 'My draft',
        title: 'A small thing I learned.',
        paperLabel: 'Opening paragraph',
        paragraphDone: 'On a rainy morning, I tried a smaller plan. One thing to finish. One thing to let go.',
        paragraph:
          'I had been thinking for quite some time about making a change. On a rainy morning, I finally decided to try a smaller plan with just one thing to finish and one thing to let go.',
        done: 'Opening revised · your detail kept.',
        idle: 'Your voice stays at the center.',
      },
      planner: {
        label: 'Today',
        title: 'Leave a little breathing room.',
        draft: 'Write the first draft',
        lunch: 'Lunch',
        catchUp: 'Catch up',
        errandsMoved: 'Errands · moved here',
        freeHour: 'An hour kept free',
        errands: 'Errands',
        banner: 'A plan you can change, not a rule to follow.',
      },
      comments: {
        label: 'YouTube Comment Radar · 257 comments',
        title: 'What your audience keeps asking for.',
        topics: [
          ['Setup & Install', '48%', '124 mentions'],
          ['App Examples', '32%', '82 mentions'],
          ['Pricing & Plans', '20%', '51 mentions'],
        ] as [string, string, string][],
        bars: ['Setup (124)', 'Examples (82)', 'Pricing (51)'],
        done: '🎬 Next video brief ready: “First 3 Steps — Use Your Own Claude/ChatGPT Plan”',
        idle: 'Cluster viewer comments automatically and spot your next hit video.',
      },
      sheet: {
        legend: 'What should your AI check in the selected range (A3:E6)?',
        flagLow: 'Flag low margins (<15%)',
        rankProfit: 'Rank by net profit ($)',
        label: 'oct-channels.xlsx · Spreadsheet',
        title: 'Familiar IronCalc grid. AI draft on the selected cells.',
        switchFile: 'Switch file',
        importReport: 'Import report · 1',
        badgeDone: 'AI Draft on E3:E6 · Apply ✓',
        badge: 'Range A3:E6 in context',
        sheetTitle: 'OCTOBER CHANNEL PERFORMANCE',
        cols: { channel: 'Channel', orders: 'Orders', revenue: 'Revenue', adCogs: 'Ad + COGS', margin: 'Margin %', profit: 'Net Profit' },
        channels: { search: 'Search Ads', newsletter: 'Newsletter', social: 'Social Video', affiliates: 'Affiliates' },
        statusLine: 'SUM $41,400 · Powered by IronCalc',
        bannerMargin: 'AI Draft =(C5-D5)/C5 on E3:E6 · Row 5 flagged (Social Video ad spend hit 91.7% of revenue).',
        bannerProfit: 'AI Draft =C5-D5 on E3:E6 · Newsletter leads net profit at +$5,700 with the lowest ad spend.',
        bannerIdle: 'Select cells in the IronCalc grid, then ask your AI to draft formulas or spot anomalies.',
      },
      notes: {
        label: 'Planning together',
        title: 'Let’s keep the useful bits.',
        paperLabel: 'The plan',
        bring: 'Bring',
        bringValue: 'A picnic blanket',
        invite: 'Invite',
        inviteValue: 'Our usual group',
        decided: 'Decided',
        decidedValue: 'Saturday · at the park',
        open: 'Still open',
        openValue: 'What if it rains?',
        done: 'Decision added to the same note.',
        idle: 'The conversation can move on. The note stays.',
      },
      relationMap: {
        label: 'Launch Dependency Map · 4 nodes',
        title: 'What needs to happen first?',
        pill: 'Event Launch',
        pillDone: 'All dependencies linked ✓',
        pillIdle: '1 missing step spotted',
        venue: '01 · Venue',
        venueNote: 'Confirmed ✓',
        invitation: '02 · Invitation',
        invitationNote: 'Draft ready',
        approvalDone: '03 · Print Approval ✓',
        approval: '03 · Approval Gate?',
        approvalNoteDone: 'Inserted before send',
        approvalNote: 'Missing step',
        send: '04 · Send Out',
        sendNote: '200 guests',
        done: 'Print approval inserted between design and sending ✓',
        idle: 'Map people, decisions, and blockers in one visual canvas.',
      },
      todo: {
        label: 'Saturday away',
        title: 'A little list. A better day.',
        pick: '☑ Pick a destination',
        pickStatus: 'Done',
        pack: '○ Pack a light jacket',
        packStatus: 'To do',
        reserve: '○ Reserve a table',
        trains: '○ Check the train times',
        added: 'Added',
        done: 'Two things added. One less thing to remember.',
        idle: 'The next steps from our conversation.',
      },
      research: {
        label: 'My research · Sample tools',
        title: 'Keep the evidence in view.',
        theme: 'Theme',
        toolA: 'Tool A',
        toolB: 'Tool B',
        setup: 'Setup',
        import: 'Import',
        support: 'Support',
        mentioned: 'Mentioned',
        noSample: 'No sample',
        done: 'Worth a closer look: importing existing work.',
        idle: 'Small sample. Questions to investigate, not a verdict.',
      },
      issue: {
        label: 'Demo project · Issue #12',
        title: 'The button does not respond.',
        pills: ['Open', 'Needs information'],
        stepsLabel: 'Steps to reproduce',
        steps: ['1. Open the list', '2. Select an item', '3. Press Save'],
        expected: 'Expected',
        expectedValue: 'The item is saved',
        browser: 'Browser version',
        browserMissing: 'Still missing',
        browserIdle: 'Not provided',
      },
      code: {
        label: 'Sample file · search.js',
        title: 'A few lines. One good question.',
        done: 'Early return · skips empty input.',
        idle: 'Read the code beside the explanation.',
      },
      codeMap: {
        label: 'Demo repository',
        title: 'Get a feel for the whole.',
        interface: 'Interface',
        interfaceNote: 'Views and components',
        services: 'Services',
        tests: 'Tests',
        utilities: 'Utilities',
      },
      timer: {
        label: 'A little focus',
        title: 'One thing at a time.',
        ready: 'Ready',
        pillDone: 'Example · session started',
        pillIdle: 'No rush. Start when you are ready.',
      },
      hwp: {
        label: 'HWP document · English illustration',
        title: 'A workation application.',
        paperLabel: 'Page 2 · Required information',
        intro: 'Before applying, prepare:',
        items: ['A short introduction', 'Your proposed dates', 'A workation plan'],
        done: 'Three requirements summarized in the conversation.',
        idle: 'Keep the original page open as you work.',
      },
    },
  },

  // ----------------------------------------------------------------- story
  story: {
    ariaLabel: 'A little app, a little closer',
    eyebrow: 'The moment',
    titleFirst: 'A little app.',
    titleSecond: 'A little closer.',
    chat: ['What are you making this week?', "I've been using a little app I made.", 'You made that?', 'I plan in it with my AI.', 'Could I try it?'],
    f1Title: '“You made that?”',
    f1Body: 'Something you use every week turns out to be just what a friend was looking for.',
    mailTo: 'To: Sam',
    mailBody: 'This is the app I use. Try planning your week with your own AI.',
    cardTitle: 'Meal Plan',
    cardMeta: 'CrewX app · v1',
    mailGo: 'Open in CrewX',
    f2Title: '“Here. Try it.”',
    f2Body: 'Send your app over. Your friend opens it in CrewX and makes it their own with their AI.',
    laptopTitle: "Sam's Meal Plan",
    laptopTag: 'My week',
    f3Title: 'Their week. Their AI.',
    f3Body: 'They choose the meals with their AI, then get on with making dinner.',
  },

  // ------------------------------------------------------- getting started
  start: {
    eyebrow: 'Getting started',
    titleFirst: 'Your computer.',
    titleSecond: 'Your AI. Your app.',
    lede: 'CrewX is a desktop workspace for making and using small apps with AI. Start with an everyday request, like the ones above.',
    step1Title: 'Open CrewX',
    step1Body: (
      <>
        Install it on Windows, or start it with one command on Mac or Linux. <Link to="/download">Download →</Link>
      </>
    ),
    step2Title: 'Connect your AI',
    step2Body: 'Works with your ChatGPT or Claude account.',
    step3Title: 'Describe your first app',
    step3Body: 'Try it, check the result, and ask for changes.',
    details: [
      {
        title: 'Come back to your work.',
        body: 'Keep your shortlist, plan, or log in an app that stays ready whenever you open it.',
      },
      {
        title: 'Keep working in the same app.',
        body: 'Click and edit by hand, or ask your AI to update the same screen.',
      },
      {
        title: 'Bring the AI you already use.',
        body: 'Connect your existing ChatGPT or Claude plan—no extra AI subscription from us.',
      },
    ],
    faq: [
      {
        q: 'How do I start on Windows vs. Mac & Linux?',
        a: (
          <>
            On Windows, run the installer from the <Link to="/download">download page</Link>. On Mac and Linux, install
            Node.js, then run <code>npx crewx@latest</code> in Terminal. CrewX opens in your browser.
          </>
        ),
      },
      {
        q: 'How does the AI connection work?',
        a: 'CrewX connects to your ChatGPT (via Codex) or Claude (via Claude Code) account so your AI can build and work inside your apps.',
      },
      {
        q: 'What does a friend need?',
        a: (
          <>
            Your friend gets CrewX for free from the <Link to="/download">download page</Link>, signs in, and connects
            their own AI to start using the app you shared.
          </>
        ),
      },
      {
        q: 'What happens to my files?',
        a: 'Your apps and files live on your computer, and your AI works with the context you choose to share in chat.',
      },
    ],
  },

  // --------------------------------------------------------------- pricing
  pricing: {
    eyebrow: 'Pricing',
    title: 'Start with your own little app.',
    lede: 'Free to build, use, and start sharing. Join the Early Access waitlist to try Pro for free as an early adopter.',
    freeName: 'Free',
    freePrice: '$0',
    freePriceNote: 'forever',
    freePer: 'For you, your friends, and everyday use',
    freeFeatures: [
      'Make, use, and receive unlimited apps',
      'Use with your own ChatGPT or Claude account',
      'Starter sharing to try your apps with friends',
      'Explore and install ready-made apps',
    ],
    freeCta: 'Download CrewX',
    proName: 'Pro',
    proBadge: 'Early Access',
    proPrice: 'Free',
    proPriceNote: 'for early adopters',
    proPer: 'Share with up to 10 people, free for 30 days during early access',
    proFeatures: [
      'Everything in Free, with expanded sharing',
      'Share with up to 10 people instead of 3',
      'Push updates and manage your shared releases',
      'Early access to new creator and sharing tools',
    ],
    proCta: 'Request Free Pro Access',
    note: 'Everyone can download CrewX and start sharing on Free right away. Approved early adopters on the waitlist get a free 30-day Pro trial while we roll out expanded sharing.',
  },

  // ------------------------------------------------------------- final cta
  finalCta: {
    title: 'What will you make yours?',
    lede: 'Make an app for your life. Use it with your AI. Share it when someone comes to mind.',
    download: 'Download CrewX',
    hint: 'Free · Windows installer · One command on Mac & Linux',
  },
};

export type LandingCopy = typeof en;
