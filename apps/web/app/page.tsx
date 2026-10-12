"use client";

import { useEffect, useState } from "react";

type Loach = { id: number; x: number; y: number; caught: boolean };
const initialLoaches: Loach[] = Array.from({ length: 9 }, (_, i) => ({
  id: i, x: 8 + ((i * 29 + 13) % 82), y: 12 + ((i * 37 + 7) % 72), caught: false
}));

export default function Home() {
  const [loaches, setLoaches] = useState(initialLoaches);
  const [caught, setCaught] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [started, setStarted] = useState(false);
  const [tip, setTip] = useState("どじょうをタップして、すくってみよう！");
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!started || paused || seconds <= 0) return;
    const timer = window.setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [started, paused, seconds]);

  useEffect(() => {
    if (seconds !== 0 || !started) return;
    fetch("http://localhost:8787/api/game/session", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caught, durationSeconds: 45 })
    }).catch(() => undefined);
    setTip(`おしまい！ ${caught}匹すくえたよ。また遊んでね！`);
  }, [seconds, started, caught]);

  function scoop(id: number) {
    if (!started) setStarted(true);
    if (paused || seconds === 0) return;
    setLoaches(old => old.map(f => f.id === id && !f.caught ? { ...f, caught: true } : f));
    setCaught(n => n + (loaches.find(f => f.id === id && !f.caught) ? 1 : 0));
    setTip(["やったー！すくえた！", "すばやい！名人みたい！", "泥の中にも、まだいるかも？"][caught % 3]);
  }

  function reset() {
    setLoaches(initialLoaches.map(f => ({ ...f, caught: false })));
    setCaught(0); setSeconds(45); setStarted(false); setPaused(false);
    setTip("どじょうをタップして、すくってみよう！");
  }

  return <main className="page">
    <header className="topbar">
      <div><p className="eyebrow">✦ min-yoh-abc ✦</p><h1>どじょうすくい <span>🐟</span></h1><p className="subtitle">〜 安来節と、どじょうと、わたし 〜</p></div>
      <div className="stats"><div className="stat"><small>つかまえた数</small><strong>{caught} <i>/ {loaches.length}</i></strong></div><div className="stat"><small>のこり時間</small><strong>00:{String(seconds).padStart(2,"0")}</strong></div></div>
    </header>
    <section className="layout">
      <div className="game-card">
        <div className="scene">
          <div className="sun">☀️</div><div className="mountains">⛰️　🌳　🏡　🌳　⛰️</div>
          <div className="field"><span>🌾</span><span>🌱</span><span>🌾</span><span>🌱</span><span>🌾</span></div>
          <div className="water">
            <div className="ripple r1" /><div className="ripple r2" /><div className="ripple r3" />
            {loaches.map(f => <button key={f.id} className={`loach ${f.caught ? "is-caught" : ""}`} style={{ left: `${f.x}%`, top: `${f.y}%` }} onClick={() => scoop(f.id)} disabled={f.caught || seconds === 0} aria-label="どじょうをすくう">🐟</button>)}
            <div className="player" aria-hidden="true">🧒🏻<span>🧺</span></div>
            <div className="water-note">💧 ちゃぷちゃぷ…</div>
          </div>
          <div className="dialog"><span className="avatar">🧒🏻</span><p>{tip}</p></div>
          {!started && <div className="start-overlay"><div className="start-panel"><span>🧺</span><h2>どじょうをすくおう！</h2><p>45秒で何匹つかまえられるかな？</p><button className="primary" onClick={() => setStarted(true)}>あそびはじめる ▶</button></div></div>}
          {seconds === 0 && <div className="start-overlay"><div className="start-panel"><span>🎉</span><h2>おつかれさま！</h2><p>{caught}匹すくえたよ！</p><button className="primary" onClick={reset}>もういちど遊ぶ ↻</button></div></div>}
        </div>
        <div className="game-controls"><span>👆 どじょうをタップしてすくう</span><button onClick={() => setPaused(p => !p)} disabled={!started || seconds === 0}>{paused ? "▶ 再開" : "Ⅱ 休憩"}</button><button onClick={reset}>↻ やりなおす</button></div>
      </div>
      <aside className="sidebar">
        <section className="paper"><h2>🌼 今日のミッション</h2><p className={caught >= 5 ? "done" : ""}>{caught >= 5 ? "☑" : "○"} どじょうを5匹すくう</p><div className="progress"><span style={{ width: `${Math.min(100, caught / 5 * 100)}%` }} /></div><small>{Math.min(caught,5)} / 5 ひき</small></section>
        <section className="paper"><h2>📖 どじょう図鑑</h2><div className="encyclopedia"><span className="fish-icon">🐟</span><div><strong>どじょう</strong><p>田んぼや川の泥の中にすむ魚。ぬるぬるした体で身を守るよ。</p></div></div></section>
        <section className="paper fact"><h2>💡 民謡の豆知識</h2><p>安来節は島根県の民謡。「どじょうすくい」の踊りでも知られているよ。</p><a href="https://y-hozon.com/about/" target="_blank" rel="noreferrer">安来節についてもっと知る ↗</a></section>
        <div className="score-key">🐟 +1匹　　🧺 すくう道具</div>
      </aside>
    </section>
    <footer>小さな民謡ゲーム図鑑 · min-yoh-abc</footer>
  </main>;
}