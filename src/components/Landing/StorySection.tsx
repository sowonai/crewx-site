import React from 'react';

export default function StorySection(): React.ReactNode {
  return (
    <section className="story center" aria-label="A little app, a little closer">
      <div className="wrap">
        <span className="eyebrow" style={{ color: '#916843' }}>
          <span className="dot" style={{ background: '#916843' }} />
          The moment
        </span>
        <h2 style={{ marginTop: 14 }}>
          A little app.
          <br />
          <span className="warm">A little closer.</span>
        </h2>
        <div className="frames">
          <figure className="frame">
            <div className="pic">
              <div className="phone">
                <div className="bub dim">What are you making this week?</div>
                <div className="bub r dim">I've been using a little app I made.</div>
                <div className="bub">You made that?</div>
                <div className="bub r">I plan in it with my AI.</div>
                <div className="bub">Could I try it?</div>
              </div>
            </div>
            <span className="n">01</span>
            <h3>“You made that?”</h3>
            <p>Something you use every week turns out to be just what a friend was looking for.</p>
          </figure>
          <figure className="frame">
            <div className="pic">
              <div className="mail">
                <div className="to">To: Sam</div>
                This is the app I use. Try planning your week with your own AI.
                <div className="card">
                  <span>🥗</span>
                  <div>
                    <b>Meal Plan</b>
                    <br />
                    <small style={{ color: '#888' }}>CrewX app · v1</small>
                  </div>
                </div>
                <div className="go">Open in CrewX</div>
              </div>
            </div>
            <span className="n">02</span>
            <h3>“Here. Try it.”</h3>
            <p>Send your app over. Your friend opens it in CrewX and makes it their own with their AI.</p>
          </figure>
          <figure className="frame">
            <div className="pic">
              <div className="laptop">
                <div className="scr">
                  <div className="t">
                    Sam's Meal Plan <em>My week</em>
                  </div>
                  <div className="mini">
                    <i />
                    <i />
                    <i />
                    <i />
                    <i className="s" />
                    <i className="o" />
                    <i className="s" />
                    <i className="o" />
                    <i />
                    <i />
                    <i className="s" />
                    <i />
                  </div>
                </div>
                <div className="base" />
              </div>
            </div>
            <span className="n">03</span>
            <h3>Their week. Their AI.</h3>
            <p>They choose the meals with their AI, then get on with making dinner.</p>
          </figure>
        </div>
      </div>
    </section>
  );
}
