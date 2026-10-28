import React, { useState } from 'react';
import { APP_EXAMPLES, AppExample } from './appsData';

export default function ExampleShowcase(): React.ReactNode {
  const [current, setCurrent] = useState<AppExample>(APP_EXAMPLES[0]);
  const [after, setAfter] = useState<boolean>(false);
  const [priority, setPriority] = useState<'quiet' | 'price'>('quiet');
  const [filter, setFilter] = useState<string>('All');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Idea builder state
  const [idea, setIdea] = useState('');
  const [detail, setDetail] = useState('');
  const [promptResult, setPromptResult] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>('Generate a prompt you can copy and paste straight into CrewX.');

  const handleSelectExample = (app: AppExample) => {
    setCurrent(app);
    setAfter(false);
    const demoEl = document.getElementById('ex-demo');
    if (demoEl) {
      demoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
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
    return <img src={`/assets/app-catalog/icons/${a.id}.svg`} alt="" />;
  };

  const renderSurface = (a: AppExample, done: boolean, interactive: boolean = false) => {
    switch (a.id) {
      case 'buy-compare': {
        const quiet = !interactive || priority === 'quiet';
        const candidates = quiet
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
                  onClick={() => setPriority('quiet')}
                  aria-pressed={quiet}
                >
                  Quietness
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('price')}
                  aria-pressed={!quiet}
                >
                  Price
                </button>
              </fieldset>
            )}
            <div className="ex-label">{quiet ? 'My comparison · quietness first' : 'My comparison · price first'}</div>
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
                <div key={i} className={`ex-box ${done && i === 0 ? 'ex-highlight' : ''}`}>
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
              <i style={{ width: '40%', background: '#6b93b8' }} />
              <i style={{ width: '22%', background: '#e7b36d' }} />
              <i style={{ width: '20%', background: '#80aa91' }} />
              <i style={{ width: '18%', background: '#e5eaf0' }} />
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
                  {done && i === 1 && <div className="ex-class added">Art club<br />4 pm</div>}
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
              {!done && <div className="ex-tiny" style={{ marginTop: 12 }}>Main button below the next section ↓</div>}
            </div>
            <div className="ex-banner">
              {done ? 'Updated mockup · ready for your review.' : 'Look first. Then decide what to build.'}
            </div>
          </div>
        );
      default:
        // Generic surface representation for remaining cards
        return (
          <div className="ex-surface">
            <div className="ex-label">{a.cat} · {a.name}</div>
            <h4>{a.title}</h4>
            <p className="ex-tiny">{a.desc}</p>
            <div className="ex-paper" style={{ marginTop: 12 }}>
              <div className="ex-label">Starter Idea</div>
              <p>“{a.start}”</p>
            </div>
            <div className={`ex-banner ${done ? 'ex-highlight' : ''}`} style={{ marginTop: 12 }}>
              {done ? a.review : a.manual}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="ex-showcase">
      <div className="ex-demo-intro">
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
            <div id="ex-live-screen">{renderSurface(current, after, true)}</div>
          </div>
          <div className="ex-conversation">
            <div className="ex-chat-label">With your AI</div>
            <div className="ex-user">
              <span className="ex-sender">YOU</span>
              <span>{current.prompt}</span>
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
            <button
              className="ex-action"
              onClick={() => setAfter(!after)}
              type="button"
            >
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

      <div className="ex-browser-tools" id="example-library">
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
          Showing {displayedApps.length} of {filteredApps.length}
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
