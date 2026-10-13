import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";

const app = new Hono();
app.use("*", cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));

app.get("/health", (c) => c.json({ ok: true, service: "min-yoh-abc-api" }));
app.get("/api/game/tip", (c) => c.json({
  title: "安来節の豆知識",
  text: "安来節は島根県安来地方に伝わる民謡。「どじょうすくい」の踊りでも知られています。",
  source: "https://y-hozon.com/about/"
}));
app.post("/api/game/session", async (c) => {
  const body = await c.req.json<{ caught?: number; durationSeconds?: number }>().catch(() => ({}));
  const caught = Math.max(0, Math.min(1000, Number(body.caught) || 0));
  const durationSeconds = Math.max(0, Math.min(3600, Number(body.durationSeconds) || 0));
  return c.json({ caught, durationSeconds, score: caught * 10, message: caught >= 10 ? "名人級！" : "また挑戦してね！" });
});

const port = Number(process.env.API_PORT || 8787);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Hono API listening on http://localhost:${info.port}`);
});