import React, { useEffect, useState, useRef, useCallback } from 'react';

export default function HeroDemo(): React.ReactNode {
  const [tab, setTab] = useState<number>(1);
  const [stepsVisible, setStepsVisible] = useState<number[]>([]);
  const [appOpen, setAppOpen] = useState(false);
  const [rowsShown, setRowsShown] = useState<number[]>([]);
  const [formulasFilled, setFormulasFilled] = useState(false);
  const [samUpdated, setSamUpdated] = useState(false);
  const [shareHot, setShareHot] = useState(false);
  const [sentVisible, setSentVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ left: string; top: string; show: boolean }>({
    left: '68%',
    top: '58%',
    show: false,
  });
  const [whoText, setWhoText] = useState('Your computer · your AI');
  const [appSubText, setAppSubText] = useState('Oct_Channels · Range B2:E5 selected');
  const [insightText, setInsightText] = useState(
    'Select a range, and your AI writes formulas or spots anomalies right in the spreadsheet.'
  );
  const [profitText, setProfitText] = useState('$13,300 · checking margins…');

  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const play = useCallback(() => {
    clearTimers();
    setTab(1);
    setStepsVisible([]);
    setAppOpen(false);
    setRowsShown([]);
    setFormulasFilled(false);
    setSamUpdated(false);
    setShareHot(false);
    setSentVisible(false);
    setCursorPos({ left: '68%', top: '58%', show: false });
    setWhoText('Your computer · your AI');
    setAppSubText('Oct_Channels · Range B2:E5 selected');
    setInsightText(
      'Select a range, and your AI writes formulas or spots anomalies right in the spreadsheet.'
    );
    setProfitText('$13,300 · checking margins…');

    const at = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    // Step 1: You work in it
    at(200, () => setStepsVisible([1]));
    at(900, () => setAppOpen(true));
    for (let i = 0; i < 4; i++) {
      at(1100 + i * 140, () => setRowsShown((r) => [...r, i]));
    }
    at(2100, () => {
      setStepsVisible([1, 2]);
      setFormulasFilled(true);
      setInsightText('Formula =(C-D)/C applied to E2:E5. Row 4 (Social Video, 8.3%) flagged.');
      setProfitText('$13,300 · 1 channel under 15% (Social Video)');
    });

    // Step 2: You send it
    at(4400, () => {
      setTab(2);
      setStepsVisible([1, 2, 5]);
      setShareHot(true);
    });
    at(5100, () => setSentVisible(true));
    at(5700, () => setStepsVisible([1, 2, 5, 6]));

    // Step 3: They make it theirs
    at(7300, () => {
      setSentVisible(false);
      setShareHot(false);
      setTab(3);
      setStepsVisible([]);
      setWhoText("Sam's computer · Sam's own AI");
      setAppSubText('Shared by you · Oct_Channels');
    });
    at(7800, () => setStepsVisible([8]));
    at(8700, () => setCursorPos({ left: '68%', top: '58%', show: true }));
    at(9400, () => {
      setSamUpdated(true);
      setProfitText('$16,600 · All channels healthy (>30%)');
    });
    at(10500, () => {
      setStepsVisible([8, 9]);
      setCursorPos((c) => ({ ...c, show: false }));
      setInsightText(
        'Sam adjusted D4 with his AI. All 4 channels now clear the 15% margin target.'
      );
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTab(3);
      setAppOpen(true);
      setStepsVisible([8, 9]);
      setRowsShown([0, 1, 2, 3]);
      setFormulasFilled(true);
      setSamUpdated(true);
      setProfitText('$16,600 · All channels healthy (>30%)');
      setInsightText(
        'Sam adjusted D4 with his AI. All 4 channels now clear the 15% margin target.'
      );
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);

    return () => {
      clearTimers();
      observer.disconnect();
    };
  }, [play]);

  const jumpToStage = (n: 1 | 2 | 3) => {
    clearTimers();
    setTab(n);
    setAppOpen(true);
    setRowsShown([0, 1, 2, 3]);
    setFormulasFilled(true);
    setCursorPos({ left: '68%', top: '58%', show: false });
    if (n === 1) {
      setStepsVisible([1, 2]);
      setSamUpdated(false);
      setShareHot(false);
      setSentVisible(false);
      setWhoText('Your computer · your AI');
      setAppSubText('Oct_Channels · Range B2:E5 selected');
      setInsightText('Formula =(C-D)/C applied to E2:E5. Row 4 (Social Video, 8.3%) flagged.');
      setProfitText('$13,300 · 1 channel under 15% (Social Video)');
    } else if (n === 2) {
      setStepsVisible([1, 2, 5, 6]);
      setSamUpdated(false);
      setShareHot(true);
      setSentVisible(true);
      setWhoText('Your computer · your AI');
      setAppSubText('Oct_Channels · Range B2:E5 selected');
      setInsightText('Formula =(C-D)/C applied to E2:E5. Row 4 (Social Video, 8.3%) flagged.');
      setProfitText('$13,300 · 1 channel under 15% (Social Video)');
    } else {
      setStepsVisible([8, 9]);
      setSamUpdated(true);
      setShareHot(false);
      setSentVisible(false);
      setWhoText("Sam's computer · Sam's own AI");
      setAppSubText('Shared by you · Oct_Channels');
      setInsightText(
        'Sam adjusted D4 with his AI. All 4 channels now clear the 15% margin target.'
      );
      setProfitText('$16,600 · All channels healthy (>30%)');
    }
  };

  return (
    <div className="stage" id="demo" ref={containerRef}>
      <div className="stage-tabs">
        <span className={tab === 1 ? 'on' : ''} onClick={() => jumpToStage(1)}>
          1 · You work in it
        </span>
        <span className={tab === 2 ? 'on' : ''} onClick={() => jumpToStage(2)}>
          2 · You send it
        </span>
        <span className={tab === 3 ? 'on' : ''} onClick={() => jumpToStage(3)}>
          3 · They make it theirs
        </span>
      </div>
      <div className="win">
        <div className="win-bar">
          <i />
          <i />
          <i />
          <img
            src="/assets/crewx-logo.png"
            alt=""
            style={{ width: 16, height: 16, marginLeft: 6, objectFit: 'contain' }}
          />
          <span>CrewX</span>
          <span className="who">{whoText}</span>
        </div>
        <div className="win-body">
          <div className="rail" aria-hidden="true">
            <i />
            <i className="cur" />
            <i />
            <i />
            <i className="sp" />
          </div>
          <div className="chat">
            <span className="label">Chat</span>
            <div className={`msg me ${stepsVisible.includes(1) ? 'show' : ''}`}>
              Open my monthly channel spreadsheet. Fill Margin % in <b>E2:E5</b> and flag anything under
              15%.
              <div className="att">📊 oct-channels.xlsx</div>
            </div>
            <div className={`msg ai ${stepsVisible.includes(2) ? 'show' : ''}`}>
              Done — filled <b>E2:E5</b> with <code>=(C-D)/C</code> and flagged{' '}
              <b>Social Video (8.3%)</b>.
            </div>
            <div className={`msg me ${stepsVisible.includes(5) ? 'show' : ''}`}>
              Share this spreadsheet app with Sam.
            </div>
            <div className={`msg ai ${stepsVisible.includes(6) ? 'show' : ''}`}>
              Sent. Sam opens the same spreadsheet in CrewX and runs it with his own AI.
            </div>
            <div className={`msg me ${stepsVisible.includes(8) ? 'show' : ''}`}>
              Cut Social Video ad spend by 30% and recalculate my margins.
            </div>
            <div className={`msg ai ${stepsVisible.includes(9) ? 'show' : ''}`}>
              Updated <b>D4</b> to $7,700. Social Video margin is now <b>35.8%</b> — no channels
              under 15%.
            </div>
            <div className="composer">Ask your AI…</div>
          </div>
          <div className={`app ${appOpen ? 'on' : ''}`}>
            <span
              className={`cursor-ai ${cursorPos.show ? 'show' : ''}`}
              style={{ left: cursorPos.left, top: cursorPos.top }}
            >
              AI
            </span>
            <div className={`sent ${sentVisible ? 'show' : ''}`}>
              <b>✉ Channel Spreadsheet sent to Sam</b>
              <small>Sam opens CrewX, signs in, and it's there with your formulas.</small>
            </div>
            <div className="empty">Open your spreadsheet, select cells, and ask your AI.</div>
            <div className="appwin">
              <div className="aw-bar">
                <span className="ico">📊</span>
                <div>
                  <b>Spreadsheet</b>
                  <small>Familiar spreadsheet UX · AI works on the cells you select.</small>
                </div>
                <span className="ctl" aria-hidden="true">
                  <span className="lay">Layout</span>
                  <span>⤢</span>
                  <span>–</span>
                  <span>✕</span>
                </span>
              </div>
              <div className="aw-body">
                <div className="app-head">
                  <div>
                    <b>Monthly Channel Review</b>
                    <div className="sub">{appSubText}</div>
                  </div>
                  <span className={`share ${shareHot ? 'hot' : ''}`}>Share</span>
                </div>
                <div className="xl-hero" id="grid">
                  <div className="xl-fbar">
                    <span className="xl-cellref">
                      {samUpdated ? 'D4:E4' : formulasFilled ? 'E4' : 'E2:E5'}
                    </span>
                    <span className="xl-fx">fx</span>
                    <span className="xl-finput">
                      <b>=(C4-D4)/C4</b> &nbsp;·{' '}
                      {samUpdated
                        ? 'Ad spend -30% → 35.8% margin'
                        : formulasFilled
                        ? 'Low margin flagged (<15%)'
                        : 'Margin % formula'}
                    </span>
                    <span className="xl-tag">
                      {formulasFilled ? 'AI updated E2:E5 ✓' : 'B2:E5 selected'}
                    </span>
                  </div>
                  <table className="xl-table">
                    <thead>
                      <tr>
                        <th className="rn" />
                        <th>A · Channel</th>
                        <th>B · Orders</th>
                        <th>C · Revenue</th>
                        <th>D · Ad + COGS</th>
                        <th>E · Margin %</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`xl-row sel ${rowsShown.includes(0) ? 'show' : ''}`}>
                        <td className="rn">2</td>
                        <td>
                          <b>Search Ads</b>
                        </td>
                        <td className="num">142</td>
                        <td className="num">$14,200</td>
                        <td className="num">$9,800</td>
                        <td className={`num fcell ${formulasFilled ? 'filled' : ''}`}>
                          {formulasFilled ? '31.0%' : '—'}
                        </td>
                      </tr>
                      <tr className={`xl-row sel ${rowsShown.includes(1) ? 'show' : ''}`}>
                        <td className="rn">3</td>
                        <td>
                          <b>Newsletter</b>
                        </td>
                        <td className="num">88</td>
                        <td className="num">$8,800</td>
                        <td className="num">$3,100</td>
                        <td className={`num fcell ${formulasFilled ? 'filled' : ''}`}>
                          {formulasFilled ? '64.8% ★' : '—'}
                        </td>
                      </tr>
                      <tr
                        className={`xl-row sel ${rowsShown.includes(2) ? 'show' : ''} ${
                          formulasFilled && !samUpdated ? 'flagged' : ''
                        }`}
                      >
                        <td className="rn">4</td>
                        <td>
                          <b>Social Video</b>
                        </td>
                        <td className="num">210</td>
                        <td className="num">$12,000</td>
                        <td className="num">{samUpdated ? '$7,700' : '$11,000'}</td>
                        <td
                          className={`num fcell ${
                            formulasFilled ? (samUpdated ? 'filled' : 'warn') : ''
                          }`}
                        >
                          {formulasFilled ? (samUpdated ? '35.8% ✓' : '8.3% ⚠') : '—'}
                        </td>
                      </tr>
                      <tr className={`xl-row sel ${rowsShown.includes(3) ? 'show' : ''}`}>
                        <td className="rn">5</td>
                        <td>
                          <b>Affiliates</b>
                        </td>
                        <td className="num">64</td>
                        <td className="num">$6,400</td>
                        <td className="num">$4,200</td>
                        <td className={`num fcell ${formulasFilled ? 'filled' : ''}`}>
                          {formulasFilled ? '34.4%' : '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="xl-tabs">
                    <span className="xl-tab on">Oct_Channels</span>
                    <span className="xl-tab">Raw_Data</span>
                    {formulasFilled && <span className="xl-tab new">+ AI_Summary</span>}
                    <span className="xl-status">SUM(C2:C5): $41,400</span>
                  </div>
                </div>
                <div className="side">
                  <div>
                    <b>AI Insight</b>
                    <span>{insightText}</span>
                  </div>
                  <div>
                    <b>Total Net Profit</b>
                    <span>{profitText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stage-foot">
        <span>
          Illustrative demo · Keep your Excel workflow. Select cells by hand, let your AI write the
          formulas and spot anomalies.
        </span>
        <button className="replay" onClick={play} type="button">
          ↺ Replay
        </button>
      </div>
    </div>
  );
}
