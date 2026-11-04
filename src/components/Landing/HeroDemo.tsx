import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLandingCopy } from './copy/useLandingCopy';

export default function HeroDemo(): React.ReactNode {
  const { t: copy } = useLandingCopy();
  const t = copy.demo;
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
    top: '54%',
    show: false,
  });
  const [whoText, setWhoText] = useState(t.who.you);
  const [insightText, setInsightText] = useState(t.insight.ctx);
  const [profitText, setProfitText] = useState(t.profit.checking);

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
    setCursorPos({ left: '68%', top: '54%', show: false });
    setWhoText(t.who.you);
    setInsightText(t.insight.ctx);
    setProfitText(t.profit.checking);

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
      setInsightText(t.insight.draft);
      setProfitText(t.profit.flagged);
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
      setWhoText(t.who.sam);
    });
    at(7800, () => setStepsVisible([8]));
    at(8700, () => setCursorPos({ left: '68%', top: '54%', show: true }));
    at(9400, () => {
      setSamUpdated(true);
      setProfitText(t.profit.healthy);
    });
    at(10500, () => {
      setStepsVisible([8, 9]);
      setCursorPos((c) => ({ ...c, show: false }));
      setInsightText(t.insight.sam);
    });
  }, [t]);

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
      setProfitText(t.profit.healthy);
      setInsightText(t.insight.sam);
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
  }, [play, t]);

  const jumpToStage = (n: 1 | 2 | 3) => {
    clearTimers();
    setTab(n);
    setAppOpen(true);
    setRowsShown([0, 1, 2, 3]);
    setFormulasFilled(true);
    setCursorPos({ left: '68%', top: '54%', show: false });
    if (n === 1) {
      setStepsVisible([1, 2]);
      setSamUpdated(false);
      setShareHot(false);
      setSentVisible(false);
      setWhoText(t.who.you);
      setInsightText(t.insight.draft);
      setProfitText(t.profit.flagged);
    } else if (n === 2) {
      setStepsVisible([1, 2, 5, 6]);
      setSamUpdated(false);
      setShareHot(true);
      setSentVisible(true);
      setWhoText(t.who.you);
      setInsightText(t.insight.draft);
      setProfitText(t.profit.flagged);
    } else {
      setStepsVisible([8, 9]);
      setSamUpdated(true);
      setShareHot(false);
      setSentVisible(false);
      setWhoText(t.who.sam);
      setInsightText(t.insight.sam);
      setProfitText(t.profit.healthy);
    }
  };

  const agentBarMode = samUpdated ? 'done' : formulasFilled ? 'draft' : 'ctx';

  return (
    <div className="stage" id="demo" ref={containerRef}>
      <div className="stage-tabs">
        <span className={tab === 1 ? 'on' : ''} onClick={() => jumpToStage(1)}>
          {t.tabs[0]}
        </span>
        <span className={tab === 2 ? 'on' : ''} onClick={() => jumpToStage(2)}>
          {t.tabs[1]}
        </span>
        <span className={tab === 3 ? 'on' : ''} onClick={() => jumpToStage(3)}>
          {t.tabs[2]}
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
            <span className="label">{t.chatLabel}</span>
            <div className={`msg me ${stepsVisible.includes(1) ? 'show' : ''}`}>
              {t.msgAsk}
              <div className="att">📗 oct-channels.xlsx · Oct_Channels!A3:E6</div>
            </div>
            <div className={`msg ai ${stepsVisible.includes(2) ? 'show' : ''}`}>
              {t.msgDraft}
            </div>
            <div className={`msg me ${stepsVisible.includes(5) ? 'show' : ''}`}>
              {t.msgShare}
            </div>
            <div className={`msg ai ${stepsVisible.includes(6) ? 'show' : ''}`}>
              {t.msgSent}
            </div>
            <div className={`msg me ${stepsVisible.includes(8) ? 'show' : ''}`}>
              {t.msgEdit}
            </div>
            <div className={`msg ai ${stepsVisible.includes(9) ? 'show' : ''}`}>
              {t.msgDone}
            </div>
            <div className="composer">{t.composer}</div>
          </div>
          <div className={`app ${appOpen ? 'on' : ''}`}>
            <span
              className={`cursor-ai ${cursorPos.show ? 'show' : ''}`}
              style={{ left: cursorPos.left, top: cursorPos.top }}
            >
              AI
            </span>
            <div className={`sent ${sentVisible ? 'show' : ''}`}>
              <b>{t.sentTitle}</b>
              <small>{t.sentNote}</small>
            </div>
            <div className="empty">{t.empty}</div>
            <div className="appwin">
              <div className="aw-bar">
                <span className="ico" style={{ background: 'transparent', padding: 0 }}>
                  <svg viewBox="0 0 64 64" width="24" height="24" fill="none" aria-hidden="true">
                    <rect x="7" y="8" width="50" height="48" rx="9" fill="#137A4B" />
                    <rect x="15" y="17" width="34" height="30" rx="3" fill="#fff" />
                    <path
                      d="M15 26h34M15 36h34M26 17v30M38 17v30"
                      stroke="#B8E0C8"
                      strokeWidth="2"
                    />
                    <path d="M15 26h11v10H15z" fill="#DDF3E5" />
                    <path d="M38 36h11v11H38z" fill="#34A970" />
                  </svg>
                </span>
                <div>
                  <b>{t.appTitle}</b>
                  <small>{t.appNote}</small>
                </div>
                <span className="ctl" aria-hidden="true">
                  <span className="lay">{t.layout}</span>
                  <span>⤢</span>
                  <span>–</span>
                  <span>✕</span>
                </span>
              </div>
              <div className="aw-body">
                <div className="xl-hero" id="grid">
                  {/* 1. CrewX Spreadsheet Viewer Header */}
                  <div className="ic-viewer-head">
                    <span className="ic-btn">{t.switchFile}</span>
                    <span className="ic-fname">
                      {samUpdated ? t.fileShared : 'oct-channels.xlsx'}
                    </span>
                    <span className="ic-btn report">
                      {t.importReport} <span className="ic-pill">1</span>
                    </span>
                    <span className="ic-status">{t.contextSynced}</span>
                    <span
                      className={`share ${shareHot ? 'hot' : ''}`}
                      style={{
                        marginLeft: 6,
                        padding: '3px 9px',
                        fontSize: 11,
                        borderRadius: 6,
                        border: '1px solid #d5dbe3',
                        background: shareHot ? '#2563eb' : '#fff',
                        color: shareHot ? '#fff' : '#0f172a',
                        fontWeight: 700,
                      }}
                    >
                      {t.share}
                    </span>
                  </div>
                  {/* 2. IronCalc Formula Bar */}
                  <div className="ic-fbar">
                    <span className="ic-namebox">
                      {samUpdated ? 'D5:E5 ▾' : formulasFilled ? 'E5 ▾' : 'A3:E6 ▾'}
                    </span>
                    <span className="ic-fx">fx</span>
                    <span className="ic-finput">
                      =(<b className="ref-a">C5</b>-<b className="ref-b">D5</b>)/
                      <b className="ref-a">C5</b>
                      <span className="ic-fnote">
                        {samUpdated ? t.fnote.sam : formulasFilled ? t.fnote.draft : t.fnote.ctx}
                      </span>
                    </span>
                  </div>
                  {/* 3. CrewX Agent Draft / Context Bar */}
                  <div className={`ic-agent-bar ${agentBarMode}`}>
                    <span className="ic-dot" />
                    <span className="ic-agent-msg">
                      {samUpdated ? t.bar.done : formulasFilled ? t.bar.draft : t.bar.ctx}
                    </span>
                    <span className="ic-agent-actions">
                      {samUpdated ? (
                        <>
                          <span className="ic-act">{t.undo}</span>
                          <span className="ic-act primary green">{t.saved}</span>
                        </>
                      ) : (
                        <>
                          <span className="ic-act">{t.discard}</span>
                          <span className="ic-act primary">{t.apply}</span>
                        </>
                      )}
                    </span>
                  </div>
                  {/* 4. IronCalc Grid */}
                  <table className="xl-table">
                    <thead>
                      <tr>
                        <th className="rn" />
                        <th style={{ width: '26%' }}>A</th>
                        <th style={{ width: '14%' }}>B</th>
                        <th style={{ width: '20%' }}>C</th>
                        <th style={{ width: '20%' }}>D</th>
                        <th className="col-active" style={{ width: '20%' }}>
                          E
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="ic-title-row">
                        <td className="rn">1</td>
                        <td colSpan={5}>{t.sheetTitle}</td>
                      </tr>
                      <tr className="ic-header-row">
                        <td className="rn">2</td>
                        <td>{t.cols.channel}</td>
                        <td className="num">{t.cols.orders}</td>
                        <td className="num">{t.cols.revenue}</td>
                        <td className="num">{t.cols.adCogs}</td>
                        <td className="num">{t.cols.margin}</td>
                      </tr>
                      <tr className={`xl-row sel ${rowsShown.includes(0) ? 'show' : ''}`}>
                        <td className="rn">3</td>
                        <td>
                          <b>{t.channels.search}</b>
                        </td>
                        <td className="num">142</td>
                        <td className="num">$14,200</td>
                        <td className="num">$9,800</td>
                        <td className={`num fcell ${formulasFilled ? 'filled' : ''}`}>
                          {formulasFilled ? '31.0%' : '—'}
                        </td>
                      </tr>
                      <tr className={`xl-row sel ${rowsShown.includes(1) ? 'show' : ''}`}>
                        <td className="rn">4</td>
                        <td>
                          <b>{t.channels.newsletter}</b>
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
                        <td className="rn">5</td>
                        <td>
                          <b>{t.channels.social}</b>
                        </td>
                        <td className="num">210</td>
                        <td className="num">$12,000</td>
                        <td className="num">{samUpdated ? '$7,700' : '$11,000'}</td>
                        <td
                          className={`num fcell active-cell ${
                            formulasFilled ? (samUpdated ? 'filled' : 'warn') : ''
                          }`}
                        >
                          {formulasFilled ? (samUpdated ? '35.8% ✓' : '8.3% ⚠') : '—'}
                        </td>
                      </tr>
                      <tr className={`xl-row sel ${rowsShown.includes(3) ? 'show' : ''}`}>
                        <td className="rn">6</td>
                        <td>
                          <b>{t.channels.affiliates}</b>
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
                  {/* 5. CrewX Chart Overlay Strip */}
                  <div
                    className={`ic-chart-strip ${formulasFilled ? 'show' : ''} ${
                      samUpdated ? 'applied' : ''
                    }`}
                  >
                    <div className="ic-chart-title">
                      <b>{t.chartTitle}</b>
                      <span>Oct_Channels!A3:E6</span>
                      <span className="ic-chart-badge">
                        {samUpdated ? t.chartBadge.synced : t.chartBadge.draft}
                      </span>
                    </div>
                    <div className="ic-bars">
                      <div className="ic-bar-row">
                        <span className="lbl">{t.channels.newsletter}</span>
                        <div className="trk">
                          <div className="fill" style={{ width: '92%' }} />
                        </div>
                        <span className="val">64.8%</span>
                      </div>
                      <div className="ic-bar-row">
                        <span className="lbl">{t.channels.affiliates}</span>
                        <div className="trk">
                          <div className="fill" style={{ width: '52%' }} />
                        </div>
                        <span className="val">34.4%</span>
                      </div>
                      <div className="ic-bar-row">
                        <span className="lbl">{t.channels.search}</span>
                        <div className="trk">
                          <div className="fill" style={{ width: '47%' }} />
                        </div>
                        <span className="val">31.0%</span>
                      </div>
                      <div className="ic-bar-row">
                        <span className="lbl">{t.channels.social}</span>
                        <div className="trk">
                          <div
                            className={`fill ${samUpdated ? '' : 'low'}`}
                            style={{ width: samUpdated ? '55%' : '14%' }}
                          />
                        </div>
                        <span className={`val ${samUpdated ? '' : 'low'}`}>
                          {samUpdated ? '35.8% ✓' : '8.3% ⚠'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* 6. IronCalc Bottom Sheet Bar */}
                  <div className="xl-tabs">
                    <span className="ic-nav-icons" aria-hidden="true">
                      ＋ &nbsp;☰
                    </span>
                    <span className="xl-tab on">Oct_Channels ▾</span>
                    <span className="xl-tab">Raw_Data ▾</span>
                    {formulasFilled && (
                      <span className="xl-tab new">
                        Channel_Summary <i className="draft-pill">{samUpdated ? '✓' : t.draftPill}</i> ▾
                      </span>
                    )}
                    <span className="xl-status">
                      {t.statusLine} {samUpdated ? '41.5%' : '34.6%'}{' '}
                      <span className="ic-brand">{t.poweredBy}</span>
                    </span>
                  </div>
                </div>
                <div className="side">
                  <div>
                    <b>{t.sideContext}</b>
                    <span>{insightText}</span>
                  </div>
                  <div>
                    <b>{t.sideProfit}</b>
                    <span>{profitText}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stage-foot">
        <span>{t.footNote}</span>
        <button className="replay" onClick={play} type="button">
          {t.replay}
        </button>
      </div>
    </div>
  );
}
