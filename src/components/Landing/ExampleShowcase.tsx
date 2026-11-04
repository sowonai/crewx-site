import React, { useState } from 'react';
import { AppExample } from './appsData';
import { getAppExamples } from './localizedApps';
import { useLandingCopy } from './copy/useLandingCopy';

export default function ExampleShowcase(): React.ReactNode {
  const { locale, t: copy } = useLandingCopy();
  const t = copy.showcase;
  const apps = getAppExamples(locale);

  const [currentId, setCurrentId] = useState<string>(apps[0].id);
  const [after, setAfter] = useState<boolean>(false);
  const [priority, setPriority] = useState<'quiet' | 'price'>('quiet');
  const [sheetFocus, setSheetFocus] = useState<'margin' | 'profit'>('margin');
  const [filter, setFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<boolean>(false);

  const current = apps.find((a) => a.id === currentId) ?? apps[0];

  const handleSelectExample = (app: AppExample) => {
    setCurrentId(app.id);
    setAfter(false);
    setPriority('quiet');
    setSheetFocus('margin');
    const demoEl = document.getElementById('ex-demo-intro');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filteredApps = apps.filter((a) => filter === 'All' || a.cat === filter);
  const displayedApps = expanded ? filteredApps : filteredApps.slice(0, 6);

  const getIcon = (a: AppExample) => {
    if (['blog-editor', 'yt-sensor', 'rival-voice'].includes(a.id)) {
      return <span className="ex-appinitial">{a.name[0]}</span>;
    }
    return <img src={`/assets/app-catalog/icons/${a.id}.svg`} alt="" width={23} height={23} />;
  };

  const renderSurface = (a: AppExample, done: boolean, interactive: boolean = false) => {
    const s = t.surf;
    switch (a.id) {
      case 'buy-compare': {
        const c = s.buyCompare;
        const quiet = !interactive || priority === 'quiet';
        const candidates = quiet ? c.candidatesQuiet : c.candidatesPrice;
        return (
          <div className="ex-surface">
            {interactive && (
              <fieldset className="ex-direct-control">
                <legend>{c.legend}</legend>
                <button
                  type="button"
                  onClick={() => {
                    setPriority('quiet');
                    setAfter(false);
                  }}
                  aria-pressed={quiet}
                >
                  {c.quietness}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority('price');
                    setAfter(false);
                  }}
                  aria-pressed={!quiet}
                >
                  {c.price}
                </button>
              </fieldset>
            )}
            <div className="ex-label">{quiet ? c.labelQuiet : c.labelPrice}</div>
            <h4>{c.title}</h4>
            <div className="ex-criteria">
              <div>
                <div className="ex-weight">
                  <b>{c.quietness}</b>
                  <span>{quiet ? '5' : '2'} / 5</span>
                </div>
                <div className="ex-weight-track">
                  <i style={{ width: quiet ? '100%' : '40%' }} />
                </div>
              </div>
              <div>
                <div className="ex-weight">
                  <b>{c.price}</b>
                  <span>{quiet ? '2' : '5'} / 5</span>
                </div>
                <div className="ex-weight-track">
                  <i style={{ width: quiet ? '40%' : '100%' }} />
                </div>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {c.firstChoice(candidates[0][0], candidates[0][2])}
            </div>
            <div className="ex-columns">
              {candidates.map(([n, sc, spec], i) => (
                <div key={n} className={`ex-box ${done && i === 0 ? 'ex-highlight' : ''}`}>
                  <span className="ex-tiny">
                    #{i + 1} · {spec}
                  </span>
                  <div className="ex-keyboard">
                    {Array.from({ length: 26 }, (_, k) => (
                      <i key={k} />
                    ))}
                  </div>
                  <b>{n}</b>
                  <div className="ex-bar">
                    <i style={{ width: `${sc}%` }} />
                  </div>
                  <span className="ex-tiny">{c.fitScore(sc)}</span>
                  {done && i === 0 && <span className="ex-review-mark">{c.reviewNext}</span>}
                </div>
              ))}
            </div>
            {done && <div className="ex-banner ex-highlight">{quiet ? c.noteQuiet : c.notePrice}</div>}
          </div>
        );
      }

      case 'travel-map': {
        const c = s.travel;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-pills">
              {c.pills.map((p) => (
                <span key={p} className="ex-pill">
                  {p}
                </span>
              ))}
            </div>
            <div className="ex-travel-budget">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="ex-schedule">
              <time>09:00</time>
              <div className={`ex-slot ${done ? 'ex-highlight' : ''}`}>{done ? c.morningDone : c.morning}</div>
              <time>12:00</time>
              <div className="ex-slot">{c.lunch}</div>
              <time>14:00</time>
              <div className={`ex-slot ${done ? 'ex-mint' : ''}`}>{done ? c.afternoonDone : c.afternoon}</div>
              <time>18:00</time>
              <div className="ex-slot">{c.evening}</div>
            </div>
          </div>
        );
      }

      case 'workout-log': {
        const c = s.workout;
        return (
          <div className="ex-surface ex-workout">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-columns">
              <div className="ex-box">
                <div className="ex-label">{c.session}</div>
                <div className="ex-strong">{c.sessionValue}</div>
              </div>
              <div className="ex-box">
                <div className="ex-label">{c.exercise}</div>
                <div className="ex-strong">{c.exerciseValue}</div>
              </div>
            </div>
            <div className="ex-row">
              <span>{c.setHeader}</span>
              <b>{c.repsHeader}</b>
            </div>
            <div className="ex-row">
              <span>01</span>
              <b>10 × 30 kg</b>
            </div>
            <div className="ex-row">
              <span>02</span>
              <b>10 × 30 kg</b>
            </div>
            <div className="ex-row">
              <span>03</span>
              <b>{c.notLogged}</b>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{c.last}</div>
          </div>
        );
      }

      case 'buy-car': {
        const c = s.buyCar;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-van" />
            <div className="ex-row">
              <span>{c.candidate}</span>
              <b>{c.candidateValue}</b>
            </div>
            <div className="ex-row">
              <span>{c.like}</span>
              <b>{c.likeValue}</b>
            </div>
            <div className="ex-row">
              <span>{c.check}</span>
              <b>{c.checkValue}</b>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'crewx-slide': {
        const c = s.slides;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <div className="ex-slide-layout">
              <div className="ex-slide-strip">
                {c.thumbs.map((th, i) => (
                  <div key={th} className={`ex-slide-thumb ${i === 2 ? 'ex-highlight' : ''}`}>
                    {th}
                  </div>
                ))}
              </div>
              <div className="ex-slide-page">
                <div className="ex-label">{c.pageLabel}</div>
                <h4>{done ? c.titleDone : c.title}</h4>
                <div className="ex-columns">
                  <div className="ex-box">
                    <b>{c.optionA}</b>
                    <p className="ex-tiny">{c.optionADetail}</p>
                  </div>
                  <div className="ex-box">
                    <b>{c.optionB}</b>
                    <p className="ex-tiny">{c.optionBDetail}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'wrong-answer-notes': {
        const c = s.japanese;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-paper">
              <div className="ex-label">{c.paperLabel}</div>
              <div className="ex-jp">{c.jp}</div>
              <p>{c.gloss}</p>
              <div className="ex-pills">
                {c.pills.map((p) => (
                  <span key={p} className="ex-pill">
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'timetable': {
        const c = s.timetable;
        return (
          <div className="ex-surface ex-timetable">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-days">
              {c.days.map((d, i) => (
                <div key={d}>
                  <b>{d}</b>
                  <div className="ex-class">{c.school}</div>
                  <div className="ex-class">{c.classes[i]}</div>
                  {done && i === 1 && (
                    <div className="ex-class added">
                      {c.artClub}
                      <br />
                      {c.artClubTime}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="ex-banner">{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'html-viewer': {
        const c = s.mockup;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <div className="ex-mockup">
              <div className="ex-mockupnav">
                <b>{c.navTitle}</b>
                <span>{c.navLinks}</span>
              </div>
              <h4>{c.title}</h4>
              {done ? <span className="ex-fake-button">{c.buttonDone}</span> : null}
              <div className="ex-mockup-blocks">
                <i />
                <i />
                <i />
              </div>
              {!done && (
                <div className="ex-tiny" style={{ marginTop: 12 }}>
                  {c.warning}
                </div>
              )}
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'blog-editor': {
        const c = s.blog;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-paper">
              <div className="ex-label">{c.paperLabel}</div>
              <p className={done ? 'ex-highlight' : ''}>{done ? c.paragraphDone : c.paragraph}</p>
              <div className="ex-line" />
              <div className="ex-line" style={{ width: '78%' }} />
              <div className="ex-line" style={{ width: '91%' }} />
            </div>
            <div className="ex-banner">{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'daily-planner': {
        const c = s.planner;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-schedule">
              <time>09:00</time>
              <div className="ex-slot">{c.draft}</div>
              <time>12:00</time>
              <div className="ex-slot">{c.lunch}</div>
              <time>13:00</time>
              <div className={`ex-slot ${done ? 'ex-highlight' : ''}`}>{done ? c.errandsMoved : c.catchUp}</div>
              <time>15:00</time>
              <div className={`ex-slot ${done ? 'ex-mint' : ''}`}>{done ? c.freeHour : c.errands}</div>
            </div>
            <div className="ex-banner">{c.banner}</div>
          </div>
        );
      }

      case 'yt-sensor': {
        const c = s.comments;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-columns">
              {c.topics.map(([name, pct, mentions], i) => (
                <div key={name} className={i === 0 ? `ex-box ${done ? 'ex-highlight' : ''}` : 'ex-box'}>
                  <div className="ex-label">{name}</div>
                  <div className="ex-strong">{pct}</div>
                  <span className="ex-tiny">{mentions}</span>
                </div>
              ))}
            </div>
            <div className="ex-chart">
              <div style={{ height: '95%' }}>
                <span>{c.bars[0]}</span>
              </div>
              <div style={{ height: '63%' }}>
                <span>{c.bars[1]}</span>
              </div>
              <div style={{ height: '36%' }}>
                <span>{c.bars[2]}</span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'sheet': {
        const c = s.sheet;
        const isMargin = !interactive || sheetFocus === 'margin';
        const ftext = done ? (isMargin ? '=(C5-D5)/C5' : '=C5-D5') : '=SUM(C3:C6)';
        const cellRef = done ? 'E5 ▾' : 'A3:E6 ▾';
        return (
          <div className="ex-surface">
            {interactive && (
              <fieldset className="ex-direct-control">
                <legend>{c.legend}</legend>
                <button
                  type="button"
                  aria-pressed={isMargin}
                  onClick={() => {
                    setSheetFocus('margin');
                    setAfter(false);
                  }}
                >
                  {c.flagLow}
                </button>
                <button
                  type="button"
                  aria-pressed={!isMargin}
                  onClick={() => {
                    setSheetFocus('profit');
                    setAfter(false);
                  }}
                >
                  {c.rankProfit}
                </button>
              </fieldset>
            )}
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-xl">
              <div className="ex-xl-ribbon">
                <span className="ex-xl-btn">{c.switchFile}</span>
                <span style={{ fontSize: 10, fontWeight: 700 }}>oct-channels.xlsx</span>
                <span className="ex-xl-sep" />
                <span
                  className="ex-xl-btn"
                  style={{
                    background: '#fff3df',
                    borderColor: '#f2c98c',
                    color: '#955311',
                  }}
                >
                  {c.importReport}
                </span>
                <span className="ex-xl-badge">{done ? c.badgeDone : c.badge}</span>
              </div>
              <div className="ex-xl-fbar">
                <span className="ex-xl-namebox">{cellRef}</span>
                <span className="ex-xl-fx">fx</span>
                <span className="ex-xl-formula">
                  <em>{ftext}</em>
                </span>
              </div>
              <div className="ex-xl-grid-wrap">
                <table className="ex-xl-grid">
                  <thead>
                    <tr>
                      <th className="r-hdr" />
                      <th>A</th>
                      <th>B</th>
                      <th>C</th>
                      <th>D</th>
                      <th>E</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="ic-title">
                      <td className="r-hdr">1</td>
                      <td colSpan={5}>{c.sheetTitle}</td>
                    </tr>
                    <tr className="ic-head">
                      <td className="r-hdr">2</td>
                      <td>{c.cols.channel}</td>
                      <td className="num">{c.cols.orders}</td>
                      <td className="num">{c.cols.revenue}</td>
                      <td className="num">{c.cols.adCogs}</td>
                      <td className="num">{isMargin ? c.cols.margin : c.cols.profit}</td>
                    </tr>
                    <tr className="sel">
                      <td className="r-hdr">3</td>
                      <td className="sel-top sel-l">{c.channels.search}</td>
                      <td className="num sel-top">142</td>
                      <td className="num sel-top">$14,200</td>
                      <td className="num sel-top">$9,800</td>
                      <td className={`num sel-top sel-r ${done ? 'ai-cell' : ''}`}>
                        {done ? (isMargin ? '31.0%' : '+$4,400') : '—'}
                      </td>
                    </tr>
                    <tr className="sel">
                      <td className="r-hdr">4</td>
                      <td className="sel-l">{c.channels.newsletter}</td>
                      <td className="num">88</td>
                      <td className="num">$8,800</td>
                      <td className="num">$3,100</td>
                      <td className={`num sel-r ${done ? 'ai-cell' : ''}`}>
                        {done ? (isMargin ? '64.8% ★' : '+$5,700 ★') : '—'}
                      </td>
                    </tr>
                    <tr className={`sel ${done && isMargin ? 'anom' : ''}`}>
                      <td className="r-hdr">5</td>
                      <td className="sel-l">{c.channels.social}</td>
                      <td className="num">210</td>
                      <td className="num">$12,000</td>
                      <td className="num">$11,000</td>
                      <td className={`num sel-r ${done ? (isMargin ? '' : 'ai-cell') : ''}`}>
                        {done ? (isMargin ? '8.3% ⚠' : '+$1,000') : '—'}
                      </td>
                    </tr>
                    <tr className="sel">
                      <td className="r-hdr">6</td>
                      <td className="sel-bot sel-l">{c.channels.affiliates}</td>
                      <td className="num sel-bot">64</td>
                      <td className="num sel-bot">$6,400</td>
                      <td className="num sel-bot">$4,200</td>
                      <td className={`num sel-bot sel-r ${done ? 'ai-cell' : ''}`}>
                        {done ? (isMargin ? '34.4%' : '+$2,200') : '—'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="ex-xl-tabs">
                <span style={{ padding: '0 5px', opacity: 0.65, fontSize: 10 }}>＋ ☰</span>
                <span className="ex-xl-tab on">Oct_Channels ▾</span>
                <span className="ex-xl-tab">Raw_Data ▾</span>
                {done && <span className="ex-xl-tab ai-new">Channel_Summary ▾</span>}
                <span className="ex-xl-stat">{c.statusLine}</span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? (isMargin ? c.bannerMargin : c.bannerProfit) : c.bannerIdle}
            </div>
          </div>
        );
      }

      case 'notes': {
        const c = s.notes;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-paper">
              <div className="ex-label">{c.paperLabel}</div>
              <div className="ex-row">
                <span>{c.bring}</span>
                <b>{c.bringValue}</b>
              </div>
              <div className="ex-row">
                <span>{c.invite}</span>
                <b>{c.inviteValue}</b>
              </div>
              {done && (
                <div className="ex-row ex-highlight">
                  <span>{c.decided}</span>
                  <b>{c.decidedValue}</b>
                </div>
              )}
              <div className="ex-row">
                <span>{c.open}</span>
                <b>{c.openValue}</b>
              </div>
            </div>
            <div className="ex-banner">{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'relation-map': {
        const c = s.relationMap;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-pills">
              <span className="ex-pill">{c.pill}</span>
              <span className="ex-pill">{done ? c.pillDone : c.pillIdle}</span>
            </div>
            <div className="ex-map">
              <div className="ex-node">
                <b>{c.venue}</b>
                <br />
                <span className="ex-tiny">{c.venueNote}</span>
              </div>
              <div className="ex-arrow">→</div>
              <div className="ex-node">
                <b>{c.invitation}</b>
                <br />
                <span className="ex-tiny">{c.invitationNote}</span>
              </div>
              <div className={`ex-node ${done ? 'ex-highlight' : ''}`}>
                <b>{done ? c.approvalDone : c.approval}</b>
                <br />
                <span className="ex-tiny">{done ? c.approvalNoteDone : c.approvalNote}</span>
              </div>
              <div className="ex-arrow">→</div>
              <div className="ex-node">
                <b>{c.send}</b>
                <br />
                <span className="ex-tiny">{c.sendNote}</span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'todo': {
        const c = s.todo;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-row">
              <span>{c.pick}</span>
              <b>{c.pickStatus}</b>
            </div>
            <div className="ex-row">
              <span>{c.pack}</span>
              <b>{c.packStatus}</b>
            </div>
            {done && (
              <>
                <div className="ex-row ex-highlight">
                  <span>{c.reserve}</span>
                  <b>{c.added}</b>
                </div>
                <div className="ex-row ex-highlight">
                  <span>{c.trains}</span>
                  <b>{c.added}</b>
                </div>
              </>
            )}
            <div className="ex-banner">{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'rival-voice': {
        const c = s.research;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <table className="ex-sheet">
              <thead>
                <tr>
                  <th>{c.theme}</th>
                  <th>{c.toolA}</th>
                  <th>{c.toolB}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{c.setup}</td>
                  <td>{c.mentioned}</td>
                  <td>{c.mentioned}</td>
                </tr>
                <tr>
                  <td>{c.import}</td>
                  <td>{c.noSample}</td>
                  <td className={done ? 'ex-highlight' : ''}>{c.mentioned}</td>
                </tr>
                <tr>
                  <td>{c.support}</td>
                  <td>{c.noSample}</td>
                  <td>{c.noSample}</td>
                </tr>
              </tbody>
            </table>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'github-issues': {
        const c = s.issue;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-pills">
              {c.pills.map((p) => (
                <span key={p} className="ex-pill">
                  {p}
                </span>
              ))}
            </div>
            <div className="ex-paper">
              <div className="ex-label">{c.stepsLabel}</div>
              <p>
                {c.steps[0]}
                <br />
                {c.steps[1]}
                <br />
                {c.steps[2]}
              </p>
              <div className="ex-row">
                <span>{c.expected}</span>
                <b>{c.expectedValue}</b>
              </div>
              <div className={`ex-row ${done ? 'ex-highlight' : ''}`}>
                <span>{c.browser}</span>
                <b>{done ? c.browserMissing : c.browserIdle}</b>
              </div>
            </div>
          </div>
        );
      }

      case 'code-editor': {
        const c = s.code;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-code">
              01  function search(input) &#123;
              <br />
              02    {done ? <mark>if (!input) return [];</mark> : 'if (!input) return [];'}
              <br />
              03    const query = input.trim();
              <br />
              04    return findMatches(query);
              <br />
              05  &#125;
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>{done ? c.done : c.idle}</div>
          </div>
        );
      }

      case 'code-map': {
        const c = s.codeMap;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-treemap">
              <div className={done ? 'ex-highlight' : ''}>
                <b>{c.interface}</b>
                <br />
                <span className="ex-tiny">{c.interfaceNote}</span>
              </div>
              <div>
                <b>{c.services}</b>
              </div>
              <div>
                <b>{c.tests}</b>
              </div>
              <div>
                <b>{c.utilities}</b>
              </div>
            </div>
          </div>
        );
      }

      case 'timer': {
        const c = s.timer;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-timer">
              <div className={`ex-timer-ring ${done ? 'active' : ''}`}>{done ? '25:00' : c.ready}</div>
              <span className="ex-pill">{done ? c.pillDone : c.pillIdle}</span>
            </div>
          </div>
        );
      }

      case 'hop-hwp-viewer':
      default: {
        const c = s.hwp;
        return (
          <div className="ex-surface">
            <div className="ex-label">{c.label}</div>
            <h4>{c.title}</h4>
            <div className="ex-paper">
              <div className="ex-label">{c.paperLabel}</div>
              <p>{c.intro}</p>
              <div className="ex-row">
                <span>01</span>
                <b>{c.items[0]}</b>
              </div>
              <div className="ex-row">
                <span>02</span>
                <b>{c.items[1]}</b>
              </div>
              <div className="ex-row">
                <span>03</span>
                <b>{c.items[2]}</b>
              </div>
            </div>
            <div className="ex-banner">{done ? c.done : c.idle}</div>
          </div>
        );
      }
    }
  };

  return (
    <div className="ex-showcase">
      <div className="ex-demo-intro" id="ex-demo-intro">
        <div>
          <div className="ex-kicker">{t.kicker(current.name)}</div>
          <h3 id="ex-selected-title">{current.title}</h3>
          <p id="ex-selected-description">{current.desc}</p>
        </div>
        <a className="ex-browse" href="#example-library">
          {t.browseMore}
        </a>
      </div>

      <div className="ex-origins">
        <div>
          <b>{t.startWithIdea}</b>
          <p>“{current.start}”</p>
        </div>
      </div>

      <div className="ex-demo" id="ex-demo">
        <div className="ex-shellbar">
          <span className="ex-dots" aria-hidden="true">
            ● ● ●
          </span>
          <img
            src="/assets/crewx-logo.png"
            alt=""
            style={{ width: 15, height: 15, objectFit: 'contain' }}
          />
          <b>CrewX</b>
          <span>{t.tagline}</span>
        </div>
        <div className="ex-workspace">
          <div className="ex-rail" aria-hidden="true">
            <b>✳</b>
            <span>▦</span>
            <span>⌘</span>
          </div>
          <div className="ex-app-window">
            <div className="ex-appbar">
              {getIcon(current)}
              <b>{current.name}</b>
              <span className="ex-window-controls" aria-hidden="true">
                − □ ×
              </span>
            </div>
            <div className="ex-manual-note">
              <b>{t.byHand}</b>
              <span>{current.manual}</span>
            </div>
            <div id="ex-live-screen" aria-label={t.screenLabel}>
              {renderSurface(current, after, true)}
            </div>
          </div>
          <div className="ex-conversation">
            <div className="ex-chat-label">{t.withYourAi}</div>
            <div className="ex-user">
              <span className="ex-sender">{t.you}</span>
              <span>
                {current.id === 'sheet' ? (sheetFocus === 'margin' ? current.prompt : t.variants.sheetProfitPrompt) : current.prompt}
              </span>
            </div>
            <div className="ex-ai" aria-live="polite">
              {after ? (
                <>
                  <span className="ex-sender">{t.yourAi}</span>
                  <p>
                    {current.id === 'buy-compare'
                      ? priority === 'quiet'
                        ? current.reply
                        : t.variants.buyComparePriceReply
                      : current.id === 'sheet'
                      ? sheetFocus === 'margin'
                        ? current.reply
                        : t.variants.sheetProfitReply
                      : current.reply}
                  </p>
                </>
              ) : (
                <>
                  <span className="ex-sender">{t.sameAppNext}</span>
                  <p className="ex-ai-idle">
                    {current.kind === 'read' ? t.idle.read : current.kind === 'shape' ? t.idle.shape : t.idle.use}
                  </p>
                </>
              )}
            </div>
            <button className="ex-action" onClick={() => setAfter(!after)} type="button">
              {after ? t.reset : current.kind === 'read' ? t.askAi : t.updateAi}
            </button>
          </div>
        </div>
        <div className="ex-proof">
          <div className="ex-step">
            <span className={!after ? 'on' : ''}>{t.steps[0]}</span>
            <span className={after ? 'on' : ''}>{t.steps[1]}</span>
            <span className={after ? 'on' : ''}>{t.steps[2]}</span>
          </div>
          <strong>{after ? current.review : t.proofIdle}</strong>
        </div>
      </div>

      <div className="ex-browser-tools" id="example-library" aria-label={t.filterLabel}>
        {(['All', 'Life', 'Create', 'Learn', 'Work', 'Build'] as const).map((c) => (
          <button
            key={c}
            type="button"
            className="ex-filter"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {t.filters[c]}
          </button>
        ))}
        <span className="ex-count">{t.count(displayedApps.length, filteredApps.length)}</span>
      </div>

      <div className="ex-cards">
        {displayedApps.map((a) => {
          const isSelected = a.id === current.id;
          return (
            <article key={a.id} className={`ex-card ${isSelected ? 'is-selected' : ''}`}>
              <div className="ex-preview ex-mini" aria-hidden="true">
                <div className="ex-preview-window">
                  <div className="ex-preview-bar">
                    <b>{a.name}</b>
                    <span>{t.youPlusAi}</span>
                  </div>
                  {renderSurface(a, true, false)}
                </div>
              </div>
              <div className="ex-card-copy">
                <div className="ex-card-meta">
                  <span>
                    {a.name} · {t.cats[a.cat] ?? a.cat}
                  </span>
                </div>
                <h4>{a.title}</h4>
                <div className="ex-card-ask">
                  <b>{t.ideaToStart}</b>
                  <br />“{a.start}”
                </div>
              </div>
              <button
                className="ex-card-button"
                type="button"
                onClick={() => handleSelectExample(a)}
                aria-pressed={isSelected}
              >
                {t.exploreThis} <span aria-hidden="true">↗</span>
              </button>
            </article>
          );
        })}
      </div>

      {filteredApps.length > 6 && (
        <div className="ex-more-wrap">
          <button
            className="ex-more"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? t.showFewer : t.exploreAll(filteredApps.length)}
          </button>
        </div>
      )}
    </div>
  );
}
