import "./style.css";

const water = document.querySelector<HTMLDivElement>("#water")!;
const scoreEl = document.querySelector<HTMLElement>("#score")!;
const timeEl = document.querySelector<HTMLElement>("#time")!;
const tipEl = document.querySelector<HTMLElement>("#tip")!;
const overlay = document.querySelector<HTMLDivElement>("#overlay")!;
const titleEl = document.querySelector<HTMLElement>("#panel-title")!;
const textEl = document.querySelector<HTMLElement>("#panel-text")!;
const startButton = document.querySelector<HTMLButtonElement>("#start")!;
const pauseButton = document.querySelector<HTMLButtonElement>("#pause")!;
const resetButton = document.querySelector<HTMLButtonElement>("#reset")!;
const missionEl = document.querySelector<HTMLElement>("#mission")!;
const progressEl = document.querySelector<HTMLElement>("#progress")!;
const progressTextEl = document.querySelector<HTMLElement>("#progress-text")!;

type Fish = { id: number; element: HTMLButtonElement; caught: boolean };
let fish: Fish[] = [];
let score = 0;
let seconds = 45;
let started = false;
let paused = false;
let timer: number | undefined;

function renderFish() {
  fish.forEach((f) => f.element.remove());
  fish = Array.from({ length: 9 }, (_, id) => {
    const element = document.createElement("button");
    element.className = "loach";
    element.type = "button";
    element.textContent = "🐟";
    element.setAttribute("aria-label", "どじょうをすくう");
    element.style.left = `${8 + ((id * 29 + 13) % 82)}%`;
    element.style.top = `${12 + ((id * 37 + 7) % 72)}%`;
    element.addEventListener("click", () => scoop(id));
    water.append(element);
    return { id, element, caught: false };
  });
}

function update() {
  scoreEl.textContent = String(score);
  timeEl.textContent = `00:${String(seconds).padStart(2, "0")}`;
  missionEl.textContent = score >= 5 ? "☑ ミッション達成！" : "○ どじょうを5匹すくう";
  missionEl.classList.toggle("done", score >= 5);
  progressEl.style.width = `${Math.min(100, score / 5 * 100)}%`;
  progressTextEl.textContent = `${Math.min(score, 5)} / 5 ひき`;
}

function startGame() {
  if (seconds === 0) resetGame();
  started = true;
  paused = false;
  overlay.hidden = true;
  pauseButton.disabled = false;
  pauseButton.textContent = "Ⅱ 休憩";
  if (timer !== undefined) window.clearInterval(timer);
  timer = window.setInterval(() => {
    if (!started || paused) return;
    seconds = Math.max(0, seconds - 1);
    update();
    if (seconds === 0) finishGame();
  }, 1000);
}

function scoop(id: number) {
  if (!started || paused || seconds <= 0) return;
  const target = fish.find((f) => f.id === id);
  if (!target || target.caught) return;
  target.caught = true;
  target.element.classList.add("caught");
  target.element.disabled = true;
  score++;
  tipEl.textContent = ["やったー！すくえた！", "すばやい！名人みたい！", "泥の中にも、まだいるかも？"][score % 3];
  update();
  if (fish.every((f) => f.caught)) {
    tipEl.textContent = "みんなすくえた！すごい名人だね！";
  }
}

async function finishGame() {
  started = false;
  paused = false;
  pauseButton.disabled = true;
  overlay.hidden = false;
  titleEl.textContent = "おつかれさま！";
  textEl.textContent = `${score}匹すくえたよ！`;
  startButton.textContent = "もういちど遊ぶ ↻";
  tipEl.textContent = `おしまい！ ${score}匹すくえたよ。また遊んでね！`;
  if (timer !== undefined) window.clearInterval(timer);
  try {
    await fetch("/api/game/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caught: score, durationSeconds: 45 - seconds })
    });
  } catch {
    // The game remains playable when the API is offline.
  }
}

function resetGame() {
  if (timer !== undefined) window.clearInterval(timer);
  score = 0;
  seconds = 45;
  started = false;
  paused = false;
  titleEl.textContent = "どじょうをすくおう！";
  textEl.textContent = "45秒で何匹つかまえられるかな？";
  startButton.textContent = "あそびはじめる ▶";
  tipEl.textContent = "どじょうをタップして、すくってみよう！";
  overlay.hidden = false;
  pauseButton.disabled = true;
  pauseButton.textContent = "Ⅱ 休憩";
  renderFish();
  update();
}

startButton.addEventListener("click", startGame);
pauseButton.addEventListener("click", () => {
  if (!started) return;
  paused = !paused;
  pauseButton.textContent = paused ? "▶ 再開" : "Ⅱ 休憩";
  tipEl.textContent = paused ? "ひとやすみ中だよ 🫖" : "よーし、またすくおう！";
});
resetButton.addEventListener("click", resetGame);
renderFish();
update();
