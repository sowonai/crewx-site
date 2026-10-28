import React, { useEffect, useState, useRef, useCallback } from 'react';

export default function HeroDemo(): React.ReactNode {
  const [tab, setTab] = useState<number>(1);
  const [stepsVisible, setStepsVisible] = useState<number[]>([]);
  const [appOpen, setAppOpen] = useState(false);
  const [cellsShown, setCellsShown] = useState<number[]>([]);
  const [cellsSwapped, setCellsSwapped] = useState(false);
  const [shareHot, setShareHot] = useState(false);
  const [sentVisible, setSentVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ left: string; top: string; show: boolean }>({
    left: '40%',
    top: '62%',
    show: false,
  });
  const [whoText, setWhoText] = useState('Your computer · your AI');
  const [appSubText, setAppSubText] = useState('Week 1 · 5 days');
  const [shopText, setShopText] = useState('chicken, beef, turkey, quinoa, lentils, tortillas…');

  const containerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const play = useCallback(() => {
    clearTimers();
    // Reset state
    setTab(1);
    setStepsVisible([]);
    setAppOpen(false);
    setCellsShown([]);
    setCellsSwapped(false);
    setShareHot(false);
    setSentVisible(false);
    setCursorPos({ left: '40%', top: '62%', show: false });
    setWhoText('Your computer · your AI');
    setAppSubText('Week 1 · 5 days');
    setShopText('chicken, beef, turkey, quinoa, lentils, tortillas…');

    const at = (ms: number, fn: () => void) => {
      const id = setTimeout(fn, ms);
      timersRef.current.push(id);
    };

    // Step 1: You make it
    at(150, () => setStepsVisible((s) => [...s, 1]));
    at(650, () => {
      setStepsVisible((s) => [...s, 2]);
      setAppOpen(true);
    });
    for (let i = 0; i < 10; i++) {
      at(800 + i * 110, () => setCellsShown((c) => [...c, i]));
    }

    // Step 2: You send it
    at(4200, () => {
      setTab(2);
      setStepsVisible((s) => [...s, 5]);
      setShareHot(true);
    });
    at(5000, () => setSentVisible(true));
    at(5600, () => setStepsVisible((s) => [...s, 6]));

    // Step 3: They make it theirs
    at(7200, () => {
      setSentVisible(false);
      setShareHot(false);
      setTab(3);
      setStepsVisible([]);
      setWhoText("Sam's computer · Sam's own AI");
      setAppSubText('Shared by you · Week 1');
    });
    at(7700, () => setStepsVisible([8]));
    at(8700, () => setCursorPos({ left: '40%', top: '62%', show: true }));
    at(9300, () => {
      setCellsSwapped(true);
    });
    at(10800, () => {
      setStepsVisible((s) => [...s, 9]);
      setCursorPos((c) => ({ ...c, show: false }));
      setShopText('tofu, chickpeas, black beans, mushrooms, lentils, tortillas…');
    });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTab(3);
      setAppOpen(true);
      setStepsVisible([8, 9]);
      setCellsShown([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      setCellsSwapped(true);
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
    setCellsShown([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    setCursorPos({ left: '40%', top: '62%', show: false });
    if (n === 1) {
      setStepsVisible([1, 2]);
      setCellsSwapped(false);
      setShareHot(false);
      setSentVisible(false);
      setWhoText('Your computer · your AI');
      setAppSubText('Week 1 · 5 days');
      setShopText('chicken, beef, turkey, quinoa, lentils, tortillas…');
    } else if (n === 2) {
      setStepsVisible([1, 2, 5, 6]);
      setCellsSwapped(false);
      setShareHot(true);
      setSentVisible(true);
      setWhoText('Your computer · your AI');
      setAppSubText('Week 1 · 5 days');
      setShopText('chicken, beef, turkey, quinoa, lentils, tortillas…');
    } else {
      setStepsVisible([8, 9]);
      setCellsSwapped(true);
      setShareHot(false);
      setSentVisible(false);
      setWhoText("Sam's computer · Sam's own AI");
      setAppSubText('Shared by you · Week 1');
      setShopText('tofu, chickpeas, black beans, mushrooms, lentils, tortillas…');
    }
  };

  return (
    <div className="stage" id="demo" ref={containerRef}>
      <div className="stage-tabs">
        <span className={tab === 1 ? 'on' : ''} onClick={() => jumpToStage(1)}>
          1 · You make it
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
          <span style={{ marginLeft: 8 }}>CrewX</span>
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
              Here's the 4-week meal plan I keep sending people. Make it an app.
              <div className="att">📄 meal-plan-notes.docx</div>
            </div>
            <div className={`msg ai ${stepsVisible.includes(2) ? 'show' : ''}`}>
              Done — opened <b>Meal Plan</b>. Swap any meal, and the shopping list updates itself.
            </div>
            <div className={`msg me ${stepsVisible.includes(5) ? 'show' : ''}`}>Share it with Sam.</div>
            <div className={`msg ai ${stepsVisible.includes(6) ? 'show' : ''}`}>
              Sent. Sam gets it in CrewX and uses it with his own AI.
            </div>
            <div className={`msg me ${stepsVisible.includes(8) ? 'show' : ''}`}>
              I'm vegetarian. Swap the meat & fish dinners.
            </div>
            <div className={`msg ai ${stepsVisible.includes(9) ? 'show' : ''}`}>
              Swapped 3 dinners. Shopping list updated.
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
              <b>✉ Meal Plan sent to Sam</b>
              <small>Sam installs CrewX once, signs in, and it's there.</small>
            </div>
            <div className="empty">Ask your AI, and an app opens here.</div>
            <div className="appwin">
              <div className="aw-bar">
                <span className="ico">🥗</span>
                <div>
                  <b>Meal Plan</b>
                  <small>Swap a meal, the shopping list follows.</small>
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
                    <b>Week plan</b>
                    <div className="sub">{appSubText}</div>
                  </div>
                  <span className={`share ${shareHot ? 'hot' : ''}`}>Share</span>
                </div>
                <div className="grid">
                  <span />
                  <span className="h">Mon</span>
                  <span className="h">Tue</span>
                  <span className="h">Wed</span>
                  <span className="h">Thu</span>
                  <span className="h">Fri</span>
                  <span className="row">Lunch</span>
                  <div className={`cell ${cellsShown.includes(0) ? 'show' : ''}`}>
                    <b>Quinoa bowl</b>
                    <small>520 kcal</small>
                  </div>
                  <div className={`cell ${cellsShown.includes(1) ? 'show' : ''}`}>
                    <b>Lentil soup</b>
                    <small>430 kcal</small>
                  </div>
                  <div className={`cell ${cellsShown.includes(2) ? 'show' : ''}`}>
                    <b>{cellsSwapped ? 'Avocado wrap' : 'Tuna wrap'}</b>
                    <small>{cellsSwapped ? '450 kcal' : '480 kcal'}</small>
                  </div>
                  <div className={`cell ${cellsShown.includes(3) ? 'show' : ''}`}>
                    <b>Greek salad</b>
                    <small>410 kcal</small>
                  </div>
                  <div className={`cell ${cellsShown.includes(4) ? 'show' : ''}`}>
                    <b>Rice &amp; beans</b>
                    <small>540 kcal</small>
                  </div>
                  <span className="row">Dinner</span>
                  <div
                    className={`cell dinner ${cellsShown.includes(5) ? 'show' : ''} ${
                      cellsSwapped ? 'swap' : ''
                    }`}
                  >
                    <b>{cellsSwapped ? 'Tofu stir-fry' : 'Chicken stir-fry'}</b>
                    <small>{cellsSwapped ? 'vegetarian' : '610 kcal'}</small>
                  </div>
                  <div className={`cell dinner ${cellsShown.includes(6) ? 'show' : ''}`}>
                    <b>Veggie pasta</b>
                    <small>580 kcal</small>
                  </div>
                  <div
                    className={`cell dinner ${cellsShown.includes(7) ? 'show' : ''} ${
                      cellsSwapped ? 'swap' : ''
                    }`}
                  >
                    <b>{cellsSwapped ? 'Chickpea curry' : 'Beef chili'}</b>
                    <small>{cellsSwapped ? 'vegetarian' : '640 kcal'}</small>
                  </div>
                  <div
                    className={`cell dinner ${cellsShown.includes(8) ? 'show' : ''} ${
                      cellsSwapped ? 'swap' : ''
                    }`}
                  >
                    <b>{cellsSwapped ? 'Mushroom risotto' : 'Miso salmon'}</b>
                    <small>{cellsSwapped ? 'vegetarian' : '590 kcal'}</small>
                  </div>
                  <div
                    className={`cell dinner ${cellsShown.includes(9) ? 'show' : ''} ${
                      cellsSwapped ? 'swap' : ''
                    }`}
                  >
                    <b>{cellsSwapped ? 'Black bean tacos' : 'Turkey tacos'}</b>
                    <small>{cellsSwapped ? 'vegetarian' : '600 kcal'}</small>
                  </div>
                </div>
                <div className="side">
                  <div>
                    <b>Shopping list</b>
                    <span>{shopText}</span>
                  </div>
                  <div>
                    <b>This week</b>2,820 kcal avg · 4 prep sessions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stage-foot">
        <span>Illustrative demo · You choose what matters. Your AI updates the app. You review the result.</span>
        <button className="replay" onClick={play} type="button">
          ↺ Replay
        </button>
      </div>
    </div>
  );
}
