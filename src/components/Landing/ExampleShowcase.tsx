import React, { useState } from 'react';
import { APP_EXAMPLES, AppExample } from './appsData';

export default function ExampleShowcase(): React.ReactNode {
  const [current, setCurrent] = useState<AppExample>(APP_EXAMPLES[0]);
  const [after, setAfter] = useState<boolean>(false);
  const [priority, setPriority] = useState<'quiet' | 'price'>('quiet');
  const [sheetFocus, setSheetFocus] = useState<'margin' | 'profit'>('margin');
  const [filter, setFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Idea builder state
  const [idea, setIdea] = useState('');
  const [detail, setDetail] = useState('');
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>(
    'Generate a prompt you can copy and paste straight into CrewX.'
  );

  const handleSelectExample = (app: AppExample) => {
    setCurrent(app);
    setAfter(false);
    setPriority('quiet');
    setSheetFocus('margin');
    const demoEl = document.getElementById('ex-demo-intro');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) {
      setCopyStatus('Add a few words about the app you want to make.');
      setPromptResult(null);
      return;
    }
    const generated = `Help me make a small app for: ${idea.trim()}${
      detail.trim() ? `\nOne detail that matters: ${detail.trim()}` : ''
    }\nStart with the simplest useful version. Ask me about anything that is unclear.`;
    setPromptResult(generated);
    setCopyStatus('Your starter prompt is ready. Copy and paste it into CrewX.');
  };

  const handleCopyPrompt = async () => {
    if (!promptResult) return;
    try {
      await navigator.clipboard.writeText(promptResult);
      setCopyStatus('Prompt copied. Paste it into CrewX when you are ready to make your app.');
    } catch {
      setCopyStatus('Automatic copy unavailable. Please manually select and copy the text.');
    }
  };

  const filteredApps = APP_EXAMPLES.filter((a) => filter === 'All' || a.cat === filter);
  const displayedApps = expanded ? filteredApps : filteredApps.slice(0, 3);

  const getIcon = (a: AppExample) => {
    if (['blog-editor', 'yt-sensor', 'rival-voice'].includes(a.id)) {
      return <span className="ex-appinitial">{a.name[0]}</span>;
    }
    return <img src={`/assets/app-catalog/icons/${a.id}.svg`} alt="" width={23} height={23} />;
  };

  const renderSurface = (a: AppExample, done: boolean, interactive: boolean = false) => {
    switch (a.id) {
      case 'buy-compare': {
        const quiet = !interactive || priority === 'quiet';
        const candidates: [string, number][] = quiet
          ? [
              ['Quiet Mini', 86],
              ['Everyday Keys', 78],
              ['Studio Board', 71],
            ]
          : [
              ['Everyday Keys', 88],
              ['Quiet Mini', 76],
              ['Studio Board', 72],
            ];
        return (
          <div className="ex-surface">
            {interactive && (
              <fieldset className="ex-direct-control">
                <legend>What matters more to you?</legend>
                <button
                  type="button"
                  onClick={() => {
                    setPriority('quiet');
                    setAfter(false);
                  }}
                  aria-pressed={quiet}
                >
                  Quietness
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPriority('price');
                    setAfter(false);
                  }}
                  aria-pressed={!quiet}
                >
                  Price
                </button>
              </fieldset>
            )}
            <div className="ex-label">
              {quiet ? 'My comparison · quietness first' : 'My comparison · price first'}
            </div>
            <h4>A keyboard for my desk</h4>
            <div className="ex-criteria">
              <div>
                <div className="ex-weight">
                  <b>Quietness</b>
                  <span>{quiet ? '5' : '2'} / 5</span>
                </div>
                <div className="ex-weight-track">
                  <i style={{ width: quiet ? '100%' : '40%' }} />
                </div>
              </div>
              <div>
                <div className="ex-weight">
                  <b>Price</b>
                  <span>{quiet ? '2' : '5'} / 5</span>
                </div>
                <div className="ex-weight-track">
                  <i style={{ width: quiet ? '40%' : '100%' }} />
                </div>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              First choice: {candidates[0][0]}
            </div>
            <div className="ex-columns">
              {candidates.map(([n, s], i) => (
                <div key={n} className={`ex-box ${done && i === 0 ? 'ex-highlight' : ''}`}>
                  <span className="ex-tiny">#{i + 1}</span>
                  <div className="ex-keyboard">
                    {Array.from({ length: 26 }, (_, k) => (
                      <i key={k} />
                    ))}
                  </div>
                  <b>{n}</b>
                  <div className="ex-bar">
                    <i style={{ width: `${s}%` }} />
                  </div>
                  <span className="ex-tiny">{s} fit score</span>
                  {done && i === 0 && <span className="ex-review-mark">Review next ✓</span>}
                </div>
              ))}
            </div>
            {done && (
              <div className="ex-banner ex-highlight">
                Note added:{' '}
                {quiet
                  ? 'Check the key feel and return policy before choosing Quiet Mini.'
                  : 'Check the noise level before choosing Everyday Keys.'}
              </div>
            )}
          </div>
        );
      }

      case 'travel-map':
        return (
          <div className="ex-surface">
            <div className="ex-label">Chiang Mai · A month away</div>
            <h4>Work a little. Wander a little.</h4>
            <div className="ex-pills">
              <span className="ex-pill">Week 1</span>
              <span className="ex-pill">Your time, your pace</span>
            </div>
            <div className="ex-travel-budget">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="ex-schedule">
              <time>09:00</time>
              <div className={`ex-slot ${done ? 'ex-highlight' : ''}`}>
                {done ? 'Work · morning kept free' : 'Market · morning visit'}
              </div>
              <time>12:00</time>
              <div className="ex-slot">Lunch near the old town</div>
              <time>14:00</time>
              <div className={`ex-slot ${done ? 'ex-mint' : ''}`}>
                {done ? 'Market · moved here' : 'Open afternoon'}
              </div>
              <time>18:00</time>
              <div className="ex-slot">Dinner, wherever looks good</div>
            </div>
          </div>
        );

      case 'workout-log':
        return (
          <div className="ex-surface ex-workout">
            <div className="ex-label">My workout · Today</div>
            <h4>An ordinary day. 2 of 3 sets.</h4>
            <div className="ex-columns">
              <div className="ex-box">
                <div className="ex-label">Session</div>
                <div className="ex-strong">Upper body</div>
              </div>
              <div className="ex-box">
                <div className="ex-label">Exercise</div>
                <div className="ex-strong">Row</div>
              </div>
            </div>
            <div className="ex-row">
              <span>SET</span>
              <b>REPS × WEIGHT</b>
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
              <b>Not logged</b>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              Last workout: 3 sets of 10 × 30 kg.
            </div>
          </div>
        );

      case 'buy-car':
        return (
          <div className="ex-surface">
            <div className="ex-label">My next car</div>
            <h4>More than the sticker price.</h4>
            <div className="ex-van" />
            <div className="ex-row">
              <span>Candidate</span>
              <b>Electric van</b>
            </div>
            <div className="ex-row">
              <span>What I like</span>
              <b>Room for work + weekends</b>
            </div>
            <div className="ex-row">
              <span>What to check</span>
              <b>Parking space</b>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? 'Added: confirm home charging before deciding.' : 'One place for the questions I still have.'}
            </div>
          </div>
        );

      case 'crewx-slide':
        return (
          <div className="ex-surface">
            <div className="ex-label">Strategy notes · Slide 3</div>
            <div className="ex-slide-layout">
              <div className="ex-slide-strip">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className={`ex-slide-thumb ${n === 3 ? 'ex-highlight' : ''}`}>
                    {n}
                  </div>
                ))}
              </div>
              <div className="ex-slide-page">
                <div className="ex-label">The next chapter</div>
                <h4>{done ? 'Which idea should we try first?' : 'A few ideas for what comes next.'}</h4>
                <div className="ex-columns">
                  <div className="ex-box">
                    <b>A small workshop</b>
                    <p className="ex-tiny">Learn together</p>
                  </div>
                  <div className="ex-box">
                    <b>A useful guide</b>
                    <p className="ex-tiny">Start at your own pace</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="ex-banner">
              {done ? 'Title updated · same slide, clearer question.' : 'A conversation taking shape.'}
            </div>
          </div>
        );

      case 'wrong-answer-notes':
        return (
          <div className="ex-surface">
            <div className="ex-label">Japanese · My practice</div>
            <h4>One more try.</h4>
            <div className="ex-paper">
              <div className="ex-label">At a café</div>
              <div className="ex-jp">これをください。</div>
              <p>“This one, please.”</p>
              <div className="ex-pills">
                <span className="ex-pill">これ · this one</span>
                <span className="ex-pill">それ · that one</span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? 'Read the explanation beside the app, then try again.' : 'Two expressions I want to remember.'}
            </div>
          </div>
        );

      case 'timetable':
        return (
          <div className="ex-surface ex-timetable">
            <div className="ex-label">My little week</div>
            <h4>Room for the things I love.</h4>
            <div className="ex-days">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                <div key={d}>
                  <b>{d}</b>
                  <div className="ex-class">School</div>
                  <div className="ex-class">{['Reading', 'Play', 'Music', 'Library', 'Play'][i]}</div>
                  {done && i === 1 && (
                    <div className="ex-class added">
                      Art club
                      <br />4 pm
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="ex-banner">
              {done ? 'Tuesday · art club added.' : 'A week with a little color.'}
            </div>
          </div>
        );

      case 'html-viewer':
        return (
          <div className="ex-surface">
            <div className="ex-label">Mockup · Community garden</div>
            <div className="ex-mockup">
              <div className="ex-mockupnav">
                <b>the little garden</b>
                <span>About · Visit</span>
              </div>
              <h4>A greener corner of the neighborhood.</h4>
              {done ? <span className="ex-fake-button">Join a garden day ↗</span> : null}
              <div className="ex-mockup-blocks">
                <i />
                <i />
                <i />
              </div>
              {!done && (
                <div className="ex-tiny" style={{ marginTop: 12 }}>
                  Main button below the next section ↓
                </div>
              )}
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? 'Updated mockup · ready for your review.' : 'Look first. Then decide what to build.'}
            </div>
          </div>
        );

      case 'blog-editor':
        return (
          <div className="ex-surface">
            <div className="ex-label">My draft</div>
            <h4>A small thing I learned.</h4>
            <div className="ex-paper">
              <div className="ex-label">Opening paragraph</div>
              <p className={done ? 'ex-highlight' : ''}>
                {done
                  ? 'On a rainy morning, I tried a smaller plan. One thing to finish. One thing to let go.'
                  : 'I had been thinking for quite some time about making a change. On a rainy morning, I finally decided to try a smaller plan with just one thing to finish and one thing to let go.'}
              </p>
              <div className="ex-line" />
              <div className="ex-line" style={{ width: '78%' }} />
              <div className="ex-line" style={{ width: '91%' }} />
            </div>
            <div className="ex-banner">
              {done ? 'Opening revised · your detail kept.' : 'Your voice stays at the center.'}
            </div>
          </div>
        );

      case 'daily-planner':
        return (
          <div className="ex-surface">
            <div className="ex-label">Today</div>
            <h4>Leave a little breathing room.</h4>
            <div className="ex-schedule">
              <time>09:00</time>
              <div className="ex-slot">Write the first draft</div>
              <time>12:00</time>
              <div className="ex-slot">Lunch</div>
              <time>13:00</time>
              <div className={`ex-slot ${done ? 'ex-highlight' : ''}`}>
                {done ? 'Errands · moved here' : 'Catch up'}
              </div>
              <time>15:00</time>
              <div className={`ex-slot ${done ? 'ex-mint' : ''}`}>
                {done ? 'An hour kept free' : 'Errands'}
              </div>
            </div>
            <div className="ex-banner">A plan you can change, not a rule to follow.</div>
          </div>
        );

      case 'yt-sensor':
        return (
          <div className="ex-surface">
            <div className="ex-label">My sample comments</div>
            <h4>What people keep asking.</h4>
            <div className="ex-columns">
              <div className="ex-box">
                <div className="ex-label">Setup</div>
                <div className="ex-strong">12</div>
              </div>
              <div className="ex-box">
                <div className="ex-label">Examples</div>
                <div className="ex-strong">8</div>
              </div>
              <div className="ex-box">
                <div className="ex-label">Pricing</div>
                <div className="ex-strong">4</div>
              </div>
            </div>
            <div className="ex-chart">
              <div style={{ height: '95%' }}>
                <span>Setup</span>
              </div>
              <div style={{ height: '63%' }}>
                <span>Examples</span>
              </div>
              <div style={{ height: '32%' }}>
                <span>Pricing</span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? 'Pattern to explore: “Where do I start?”' : 'Read the comments behind each theme.'}
            </div>
          </div>
        );

      case 'sheet': {
        const isMargin = !interactive || sheetFocus === 'margin';
        const ftext = done ? (isMargin ? '= (C4 - D4) / C4' : '= C4 - D4') : '= SUM(C2:C5)';
        const cellRef = done ? 'E4 · B2:E5' : 'B2:E5';
        return (
          <div className="ex-surface">
            {interactive && (
              <fieldset className="ex-direct-control">
                <legend>What should your AI check in the selected range (B2:E5)?</legend>
                <button
                  type="button"
                  aria-pressed={isMargin}
                  onClick={() => {
                    setSheetFocus('margin');
                    setAfter(false);
                  }}
                >
                  Flag low margins (&lt;15%)
                </button>
                <button
                  type="button"
                  aria-pressed={!isMargin}
                  onClick={() => {
                    setSheetFocus('profit');
                    setAfter(false);
                  }}
                >
                  Rank by net profit ($)
                </button>
              </fieldset>
            )}
            <div className="ex-label">Monthly Channel Review · Sheet</div>
            <h4>Familiar grid. AI on the selected cells.</h4>
            <div className="ex-xl">
              <div className="ex-xl-ribbon">
                <span className="ex-xl-btn">B</span>
                <span className="ex-xl-btn">I</span>
                <span className="ex-xl-sep" />
                <span className="ex-xl-btn">$ %</span>
                <span className="ex-xl-btn">Conditional</span>
                <span className="ex-xl-badge">
                  {done ? 'AI updated E2:E5 ✓' : 'Range B2:E5 selected'}
                </span>
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
                      <th>A · Channel</th>
                      <th>B · Orders</th>
                      <th>C · Revenue</th>
                      <th>D · Ad + COGS</th>
                      <th>E · {isMargin ? 'Margin %' : 'Net Profit'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="sel">
                      <td className="r-hdr">2</td>
                      <td className="sel-top sel-l">Search Ads</td>
                      <td className="num sel-top">142</td>
                      <td className="num sel-top">$14,200</td>
                      <td className="num sel-top">$9,800</td>
                      <td className={`num sel-top sel-r ${done ? 'ai-cell' : ''}`}>
                        {done ? (isMargin ? '31.0%' : '+$4,400') : '—'}
                      </td>
                    </tr>
                    <tr className="sel">
                      <td className="r-hdr">3</td>
                      <td className="sel-l">Newsletter</td>
                      <td className="num">88</td>
                      <td className="num">$8,800</td>
                      <td className="num">$3,100</td>
                      <td className={`num sel-r ${done ? 'ai-cell' : ''}`}>
                        {done ? (isMargin ? '64.8% ★' : '+$5,700 ★') : '—'}
                      </td>
                    </tr>
                    <tr className={`sel ${done && isMargin ? 'anom' : ''}`}>
                      <td className="r-hdr">4</td>
                      <td className="sel-l">Social Video</td>
                      <td className="num">210</td>
                      <td className="num">$12,000</td>
                      <td className="num">$11,000</td>
                      <td className={`num sel-r ${done ? (isMargin ? '' : 'ai-cell') : ''}`}>
                        {done ? (isMargin ? '8.3% ⚠' : '+$1,000') : '—'}
                      </td>
                    </tr>
                    <tr className="sel">
                      <td className="r-hdr">5</td>
                      <td className="sel-bot sel-l">Affiliates</td>
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
                <span className="ex-xl-tab on">Oct_Channels</span>
                <span className="ex-xl-tab">Raw_Orders</span>
                {done && <span className="ex-xl-tab ai-new">+ AI_Summary</span>}
                <span className="ex-xl-stat">
                  SUM: $41,400 · AVG: {done ? (isMargin ? '34.6%' : '$3,325') : '—'}
                </span>
              </div>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done
                ? isMargin
                  ? 'Formula =(C-D)/C applied to E2:E5 · Row 4 flagged (Social Video ad spend spiked to 91% of revenue).'
                  : 'Formula =C-D applied to E2:E5 · Newsletter leads net profit at +$5,700 with the lowest ad spend.'
                : 'Select cells just like Excel, then ask your AI to write formulas or spot anomalies.'}
            </div>
          </div>
        );
      }

      case 'notes':
        return (
          <div className="ex-surface">
            <div className="ex-label">Planning together</div>
            <h4>Let’s keep the useful bits.</h4>
            <div className="ex-paper">
              <div className="ex-label">The plan</div>
              <div className="ex-row">
                <span>Bring</span>
                <b>A picnic blanket</b>
              </div>
              <div className="ex-row">
                <span>Invite</span>
                <b>Our usual group</b>
              </div>
              {done && (
                <div className="ex-row ex-highlight">
                  <span>Decided</span>
                  <b>Saturday · at the park</b>
                </div>
              )}
              <div className="ex-row">
                <span>Still open</span>
                <b>What if it rains?</b>
              </div>
            </div>
            <div className="ex-banner">
              {done ? 'Decision added to the same note.' : 'The conversation can move on. The note stays.'}
            </div>
          </div>
        );

      case 'relation-map':
        return (
          <div className="ex-surface">
            <div className="ex-label">A small event</div>
            <h4>What needs to happen first?</h4>
            <div className="ex-map">
              <div className="ex-node">Venue confirmed</div>
              <div className="ex-arrow">→</div>
              <div className="ex-node">Invitation design</div>
              <div className={`ex-node ${done ? 'ex-highlight' : ''}`}>
                {done ? 'Print approval' : 'Approval missing?'}
              </div>
              <div className="ex-arrow">→</div>
              <div className="ex-node">Send invitations</div>
            </div>
            <div className="ex-banner">
              {done ? 'A missing step is now in the picture.' : 'Keep the whole plan in view.'}
            </div>
          </div>
        );

      case 'todo':
        return (
          <div className="ex-surface">
            <div className="ex-label">Saturday away</div>
            <h4>A little list. A better day.</h4>
            <div className="ex-row">
              <span>☑ Pick a destination</span>
              <b>Done</b>
            </div>
            <div className="ex-row">
              <span>○ Pack a light jacket</span>
              <b>To do</b>
            </div>
            {done && (
              <>
                <div className="ex-row ex-highlight">
                  <span>○ Reserve a table</span>
                  <b>Added</b>
                </div>
                <div className="ex-row ex-highlight">
                  <span>○ Check the train times</span>
                  <b>Added</b>
                </div>
              </>
            )}
            <div className="ex-banner">
              {done ? 'Two things added. One less thing to remember.' : 'The next steps from our conversation.'}
            </div>
          </div>
        );

      case 'rival-voice':
        return (
          <div className="ex-surface">
            <div className="ex-label">My research · Sample tools</div>
            <h4>Keep the evidence in view.</h4>
            <table className="ex-sheet">
              <thead>
                <tr>
                  <th>Theme</th>
                  <th>Tool A</th>
                  <th>Tool B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Setup</td>
                  <td>Mentioned</td>
                  <td>Mentioned</td>
                </tr>
                <tr>
                  <td>Import</td>
                  <td>No sample</td>
                  <td className={done ? 'ex-highlight' : ''}>Mentioned</td>
                </tr>
                <tr>
                  <td>Support</td>
                  <td>No sample</td>
                  <td>No sample</td>
                </tr>
              </tbody>
            </table>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done
                ? 'Worth a closer look: importing existing work.'
                : 'Small sample. Questions to investigate, not a verdict.'}
            </div>
          </div>
        );

      case 'github-issues':
        return (
          <div className="ex-surface">
            <div className="ex-label">Demo project · Issue #12</div>
            <h4>The button does not respond.</h4>
            <div className="ex-pills">
              <span className="ex-pill">Open</span>
              <span className="ex-pill">Needs information</span>
            </div>
            <div className="ex-paper">
              <div className="ex-label">Steps to reproduce</div>
              <p>
                1. Open the list
                <br />
                2. Select an item
                <br />
                3. Press Save
              </p>
              <div className="ex-row">
                <span>Expected</span>
                <b>The item is saved</b>
              </div>
              <div className={`ex-row ${done ? 'ex-highlight' : ''}`}>
                <span>Browser version</span>
                <b>{done ? 'Still missing' : 'Not provided'}</b>
              </div>
            </div>
          </div>
        );

      case 'code-editor':
        return (
          <div className="ex-surface">
            <div className="ex-label">Sample file · search.js</div>
            <h4>A few lines. One good question.</h4>
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
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`}>
              {done ? 'Early return · skips empty input.' : 'Read the code beside the explanation.'}
            </div>
          </div>
        );

      case 'code-map':
        return (
          <div className="ex-surface">
            <div className="ex-label">Demo repository</div>
            <h4>Get a feel for the whole.</h4>
            <div className="ex-treemap">
              <div className={done ? 'ex-highlight' : ''}>
                <b>Interface</b>
                <br />
                <span className="ex-tiny">Views and components</span>
              </div>
              <div>
                <b>Services</b>
              </div>
              <div>
                <b>Tests</b>
              </div>
              <div>
                <b>Utilities</b>
              </div>
            </div>
          </div>
        );

      case 'timer':
        return (
          <div className="ex-surface">
            <div className="ex-label">A little focus</div>
            <h4>One thing at a time.</h4>
            <div className="ex-timer">
              <div className={`ex-timer-ring ${done ? 'active' : ''}`}>{done ? '25:00' : 'Ready'}</div>
              <span className="ex-pill">
                {done ? 'Example · session started' : 'No rush. Start when you are ready.'}
              </span>
            </div>
          </div>
        );

      case 'hop-hwp-viewer':
      default:
        return (
          <div className="ex-surface">
            <div className="ex-label">HWP document · English illustration</div>
            <h4>A workation application.</h4>
            <div className="ex-paper">
              <div className="ex-label">Page 2 · Required information</div>
              <p>Before applying, prepare:</p>
              <div className="ex-row">
                <span>01</span>
                <b>A short introduction</b>
              </div>
              <div className="ex-row">
                <span>02</span>
                <b>Your proposed dates</b>
              </div>
              <div className="ex-row">
                <span>03</span>
                <b>A workation plan</b>
              </div>
            </div>
            <div className="ex-banner">
              {done
                ? 'Three requirements summarized in the conversation.'
                : 'Keep the original page open as you work.'}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="ex-showcase">
      <div className="ex-demo-intro" id="ex-demo-intro">
        <div>
          <div className="ex-kicker">Explore / {current.name}</div>
          <h3 id="ex-selected-title">{current.title}</h3>
          <p id="ex-selected-description">{current.desc}</p>
        </div>
        <a className="ex-browse" href="#example-library">
          Browse more ideas ↓
        </a>
      </div>

      <div className="ex-origins">
        <div>
          <b>Start with an idea</b>
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
          <span>Your app. Your AI. One place.</span>
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
              <b>By hand</b>
              <span>{current.manual}</span>
            </div>
            <div id="ex-live-screen" aria-label="Illustrated app screen">
              {renderSurface(current, after, true)}
            </div>
          </div>
          <div className="ex-conversation">
            <div className="ex-chat-label">With your AI</div>
            <div className="ex-user">
              <span className="ex-sender">YOU</span>
              <span>
                {current.id === 'sheet'
                  ? sheetFocus === 'margin'
                    ? 'In the selected rows (B2:E5), fill Margin % with a formula, flag any channel under 15%, and explain why.'
                    : 'In the selected rows (B2:E5), calculate Net Profit (=C-D) and highlight the top-earning channel.'
                  : current.prompt}
              </span>
            </div>
            <div className="ex-ai" aria-live="polite">
              {after ? (
                <>
                  <span className="ex-sender">YOUR AI</span>
                  <p>
                    {current.id === 'buy-compare'
                      ? priority === 'quiet'
                        ? 'Marked Quiet Mini for a closer look. I added a reminder to check key feel and the return policy.'
                        : 'Marked Everyday Keys for a closer look. I added a reminder to check its noise level.'
                      : current.id === 'sheet'
                      ? sheetFocus === 'margin'
                        ? 'Filled E2:E5 with =(C4-D4)/C4 and flagged Row 4 (Social Video, 8.3% margin). I also opened an AI_Summary tab with the breakdown.'
                        : 'Filled E2:E5 with =C4-D4. Newsletter leads at +$5,700 net profit with the lowest ad spend.'
                      : current.reply}
                  </p>
                </>
              ) : (
                <>
                  <span className="ex-sender">SAME APP, NEXT STEP</span>
                  <p className="ex-ai-idle">
                    {current.kind === 'read'
                      ? 'Keep the app in view while you ask a question.'
                      : current.kind === 'shape'
                      ? 'See a change to the mockup, then review it together.'
                      : 'Your request can become a change you can see.'}
                  </p>
                </>
              )}
            </div>
            <button className="ex-action" onClick={() => setAfter(!after)} type="button">
              {after
                ? '↺ Reset this example'
                : current.kind === 'read'
                ? 'Ask your AI →'
                : 'Update with your AI →'}
            </button>
          </div>
        </div>
        <div className="ex-proof">
          <div className="ex-step">
            <span className={!after ? 'on' : ''}>01 You choose</span>
            <span className={after ? 'on' : ''}>02 AI helps</span>
            <span className={after ? 'on' : ''}>03 You review</span>
          </div>
          <strong>{after ? current.review : 'A small app shaped around your situation.'}</strong>
        </div>
      </div>

      <div className="ex-browser-tools" id="example-library" aria-label="Filter examples">
        {['All', 'Life', 'Create', 'Learn', 'Work', 'Build'].map((c) => (
          <button
            key={c}
            type="button"
            className="ex-filter"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
          >
            {c === 'Build' ? 'For developers' : c}
          </button>
        ))}
        <span className="ex-count">
          {displayedApps.length} of {filteredApps.length} examples
        </span>
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
                    <span>YOU + AI</span>
                  </div>
                  {renderSurface(a, true, false)}
                </div>
              </div>
              <div className="ex-card-copy">
                <div className="ex-card-meta">
                  <span>
                    {a.name} · {a.cat}
                  </span>
                </div>
                <h4>{a.title}</h4>
                <div className="ex-card-ask">
                  <b>An idea to start with</b>
                  <br />“{a.start}”
                </div>
              </div>
              <button
                className="ex-card-button"
                type="button"
                onClick={() => handleSelectExample(a)}
                aria-pressed={isSelected}
              >
                Explore this example <span aria-hidden="true">↗</span>
              </button>
            </article>
          );
        })}
      </div>

      {filteredApps.length > 3 && (
        <div className="ex-more-wrap">
          <button
            className="ex-more"
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show fewer examples ↑' : `Explore all ${filteredApps.length} examples ↓`}
          </button>
        </div>
      )}

      {/* Idea Builder */}
      <div className="idea-builder" id="your-idea">
        <div>
          <span className="eyebrow">Your turn</span>
          <h3>What would you make?</h3>
          <p>Write a starter prompt for an app you would use.</p>
        </div>
        <form className="idea-form" onSubmit={handlePromptSubmit}>
          <label htmlFor="yours-idea">I want an app for…</label>
          <input
            required
            maxLength={500}
            id="yours-idea"
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              setPromptResult(null);
              setCopyStatus('Generate a prompt you can copy and paste straight into CrewX.');
            }}
            placeholder="Planning weekend trips with my family"
          />
          <label htmlFor="brief-detail">
            One detail that matters <span>(optional)</span>
          </label>
          <input
            maxLength={300}
            id="brief-detail"
            value={detail}
            onChange={(e) => {
              setDetail(e.target.value);
              setPromptResult(null);
              setCopyStatus('Generate a prompt you can copy and paste straight into CrewX.');
            }}
            placeholder="Keep the walking short"
          />
          <button className="btn primary" type="submit">
            Write a starter prompt
          </button>
        </form>
        <p className="idea-note" role="status">
          {copyStatus}
        </p>
        {promptResult && (
          <>
            <output className="brief-result">{promptResult}</output>
            <button className="btn" type="button" onClick={handleCopyPrompt}>
              Copy prompt
            </button>
          </>
        )}
      </div>
    </div>
  );
}
