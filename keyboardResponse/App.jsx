// React hooks are available globally via UMD build
const { useState, useEffect, useRef, useCallback } = React;

// ── Constants ────────────────────────────────────────────────────────────────
const STIMULI = [
  "A","B","C","D","E","F","G","H","J","K","M","N","P","Q","R","S","T","U","V","W","X","Y","Z",
  "1","2","3","4","5","6","7","8","9","0",
];
const isLetter  = (s) => isNaN(parseInt(s));
const getRandom = () => STIMULI[Math.floor(Math.random() * STIMULI.length)];
const TOTAL     = 10;

// ── App ───────────────────────────────────────────────────────────────────────
function HCILab() {
  const [phase,     setPhase]     = useState("intro");
  const [stimulus,  setStimulus]  = useState(null);
  const [trials,    setTrials]    = useState([]);
  const [currentRT, setCurrentRT] = useState(null);
  const [correct,   setCorrect]   = useState(null);
  const [t0,        setT0]        = useState(null);
  const timer = useRef(null);

  const avg = trials.length ? Math.round(trials.reduce((a, t) => a + t.rt, 0) / trials.length) : null;
  const acc = trials.length ? Math.round(trials.filter(t => t.correct).length / trials.length * 100) : null;
  const n   = trials.length;

  // ── Trial logic ─────────────────────────────────────────────────────────────
  const showStimulus = useCallback(() => {
    const s = getRandom();
    setStimulus(s);
    setPhase("stimulus");
    setT0(performance.now());
  }, []);

  const startTrial = useCallback(() => {
    setPhase("ready");
    setStimulus(null);
    setCurrentRT(null);
    setCorrect(null);
    timer.current = setTimeout(showStimulus, 800 + Math.random() * 1200);
  }, [showStimulus]);

  const respond = useCallback((pressedLeft) => {
    if (phase !== "stimulus") return;
    clearTimeout(timer.current);
    const rt = Math.round(performance.now() - t0);
    const ok = pressedLeft ? isLetter(stimulus) : !isLetter(stimulus);
    setCurrentRT(rt);
    setCorrect(ok);
    const next = [...trials, { stimulus, rt, correct: ok }];
    setTrials(next);
    setPhase("result");
    if (next.length >= TOTAL) setTimeout(() => setPhase("done"), 1200);
  }, [phase, t0, stimulus, trials]);

  // ── Keyboard listener ────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "a" || e.key === "A") respond(true);
      if (e.key === "l" || e.key === "L") respond(false);
      if (e.key === " ") {
        e.preventDefault();
        if (phase === "intro")  startTrial();
        if (phase === "result" && n < TOTAL) startTrial();
        if (phase === "done")  { setTrials([]); setPhase("intro"); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [respond, phase, startTrial, n]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // ── Derived class names ──────────────────────────────────────────────────────
  const boxClass  = `stimulus-box ${phase === "result" ? (correct ? "correct" : "wrong") : phase === "ready" ? "waiting" : ""}`;
  const charClass = `stimulus-char ${phase === "result" ? (correct ? "correct" : "wrong") : ""}`;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <span className="header-title">
          LAB PRACTICE 01 · HCI · WEEK 07
          <span className="header-badge">KEYBOARD RESPONSE</span>
        </span>
        <span className="header-trial">
          TRIAL {Math.min(n + (phase === "stimulus" || phase === "ready" ? 1 : 0), TOTAL)} / {TOTAL}
        </span>
      </header>

      <div className="body">

        {/* Sidebar */}
        <aside className="sidebar">
          <p className="section-label">INSTRUCTIONS</p>
          {[
            ["STIMULUS", "A letter or number appears"],
            ["LETTER",   "Press [A] — left"],
            ["NUMBER",   "Press [L] — right"],
          ].map(([key, val]) => (
            <div key={key} className="instruction-row">
              <span className="instruction-key">{key}</span>
              <span className="instruction-val">{val}</span>
            </div>
          ))}

          {n > 0 && (
            <div className="stats-block">
              <p className="section-label">LIVE STATS</p>
              {[
                ["Avg RT",   `${avg} ms`,        "#3fb950"],
                ["Accuracy", `${acc}%`,           acc >= 80 ? "#3fb950" : "#f85149"],
                ["Trials",   `${n} / ${TOTAL}`,  "#58a6ff"],
              ].map(([label, value, color]) => (
                <div key={label} className="stat-row">
                  <span className="stat-label">{label}</span>
                  <span style={{ color, fontWeight: "bold" }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="main">

          {/* Intro */}
          {phase === "intro" && (
            <div className="screen">
              <p className="screen-sub">REACTION TIME EXPERIMENT</p>
              <h1 className="screen-title">Ready?</h1>
              <p className="screen-hint">
                Place fingers on <kbd>A</kbd> and <kbd>L</kbd><br />
                Press <kbd>SPACE</kbd> to begin
              </p>
              <button className="btn btn-green" onClick={startTrial}>START EXPERIMENT</button>
            </div>
          )}

          {/* Waiting */}
          {phase === "ready" && (
            <div className="screen">
              <div className="stimulus-box waiting">
                <div className="pulse-dot" />
              </div>
              <p className="wait-label">WAIT FOR STIMULUS…</p>
            </div>
          )}

          {/* Stimulus / Result */}
          {(phase === "stimulus" || phase === "result") && (
            <div className="screen">
              <div className={boxClass}>
                <span className={charClass}>{stimulus}</span>
                <span className="stimulus-type-label">
                  {isLetter(stimulus) ? "LETTER" : "NUMBER"}
                </span>
              </div>

              {phase === "result" && (
                <div>
                  <p className={`result-text ${correct ? "correct" : "wrong"}`}>
                    {correct ? "CORRECT" : "WRONG"} · {currentRT}ms
                  </p>
                  {n < TOTAL && (
                    <button className="btn btn-blue" style={{ marginTop: "16px" }} onClick={startTrial}>
                      NEXT TRIAL ({n}/{TOTAL})
                    </button>
                  )}
                </div>
              )}

              {phase === "stimulus" && (
                <div className="respond-btns">
                  <button className="btn btn-blue" onClick={() => respond(true)}>[A] LETTER</button>
                  <button className="btn btn-blue" onClick={() => respond(false)}>NUMBER [L]</button>
                </div>
              )}
            </div>
          )}

          {/* Done */}
          {phase === "done" && (
            <div className="screen">
              <p className="screen-sub">EXPERIMENT COMPLETE</p>
              <h1 className="done-title">Results</h1>

              <div className="results-card">
                {[
                  ["Average RT", `${avg} ms`,                               true],
                  ["Accuracy",   `${acc}%`,                                 false],
                  ["Fastest",    `${Math.min(...trials.map(t => t.rt))} ms`, false],
                  ["Slowest",    `${Math.max(...trials.map(t => t.rt))} ms`, false],
                ].map(([label, value, big]) => (
                  <div key={label} className="results-row">
                    <span className="results-row-label">{label}</span>
                    <span className={`results-row-value ${big ? "big" : ""}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="trial-chips">
                {trials.map((t, i) => (
                  <div key={i} className={`chip ${t.correct ? "correct" : "wrong"}`}>
                    <div className="chip-stim">{t.stimulus}</div>
                    <div>{t.rt}ms</div>
                  </div>
                ))}
              </div>

              <button className="btn btn-green" onClick={() => { setTrials([]); setPhase("intro"); }}>
                RESTART
              </button>
            </div>
          )}

        </main>
      </div>

      {/* Footer hint during stimulus */}
      {phase === "stimulus" && (
        <footer className="footer">
          <span><kbd>A</kbd> = LETTER</span>
          <span><kbd>L</kbd> = NUMBER</span>
        </footer>
      )}

    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<HCILab />);