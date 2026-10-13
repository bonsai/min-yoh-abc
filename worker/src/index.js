const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "access-control-allow-origin": "*", "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, OPTIONS" }
});
const fail = (message, status = 400) => json({ error: message }, status);
const id = () => crypto.randomUUID();

async function authenticate(request, env) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token || !env.LINE_CHANNEL_ID) return null;
  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: token, client_id: env.LINE_CHANNEL_ID })
  });
  if (!response.ok) return null;
  const profile = await response.json();
  if (!profile.sub) return null;
  const userId = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(profile.sub + env.USER_ID_SALT));
  return [...new Uint8Array(userId)].map(n => n.toString(16).padStart(2, "0")).join("");
}
async function requireUser(request, env) {
  const userId = await authenticate(request, env);
  if (!userId) throw new Response(JSON.stringify({ error: "LINEログインが必要です" }), { status: 401, headers: { "content-type": "application/json" } });
  await env.DB.prepare("INSERT OR IGNORE INTO users (id) VALUES (?)").bind(userId).run();
  return userId;
}
async function admin(request, env) {
  return !!env.ADMIN_TOKEN && request.headers.get("authorization") === "Bearer " + env.ADMIN_TOKEN;
}
export default {
 async fetch(request, env) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type, authorization", "access-control-allow-methods": "GET, POST, OPTIONS" } });
  const url = new URL(request.url), path = url.pathname;
  try {
   if (path === "/api/health") return json({ ok: true });
   if (path === "/api/songs.jsonl" && request.method === "GET") {
    const { results } = await env.DB.prepare(
      "SELECT id,title,region,area,description,source_url,status FROM songs WHERE status = 'published' ORDER BY title COLLATE NOCASE"
    ).all();
    const body = results.map(song => JSON.stringify(song)).join("\n") + (results.length ? "\n" : "");
    return new Response(body, { status: 200, headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=300",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS"
    }});
   }
   if (path === "/api/campaign" && request.method === "GET") {
    const campaign = await env.DB.prepare("SELECT id,title,status,magazine_issue_id,max_songs_per_vote,starts_at,ends_at FROM campaigns WHERE status='active' LIMIT 1").first();
    if (!campaign) return json({ campaign: null, songs: [] });
    const { results: songs } = await env.DB.prepare("SELECT s.id,s.title,s.region,s.area FROM campaign_songs cs JOIN songs s ON s.id=cs.song_id WHERE cs.campaign_id=? ORDER BY cs.position").bind(campaign.id).all();
    return json({ campaign, songs });
   }
   if (path === "/api/results" && request.method === "GET") {
    const campaignId = url.searchParams.get("campaignId");
    if (!campaignId) return fail("campaignId is required");
    const { results } = await env.DB.prepare("SELECT s.id,s.title,s.region,COUNT(v.id) AS votes FROM campaign_songs cs JOIN songs s ON s.id=cs.song_id LEFT JOIN vote_choices vc ON vc.song_id=s.id LEFT JOIN votes v ON v.id=vc.vote_id AND v.campaign_id=cs.campaign_id WHERE cs.campaign_id=? GROUP BY s.id ORDER BY votes DESC,s.title").bind(campaignId).all();
    const total = await env.DB.prepare("SELECT COUNT(*) AS count FROM votes WHERE campaign_id=?").bind(campaignId).first();
    return json({ campaignId, totalVotes: total.count, results });
   }
   if (path === "/api/vote" && request.method === "POST") {
    const userId = await requireUser(request, env), body = await request.json();
    if (!Array.isArray(body.songIds) || !body.songIds.length || new Set(body.songIds).size !== body.songIds.length) return fail("曲を重複なく選んでください");
    const campaign = await env.DB.prepare("SELECT * FROM campaigns WHERE id=? AND status='active'").bind(body.campaignId).first();
    if (!campaign) return fail("この投票企画は終了しています", 409);
    if (body.songIds.length > campaign.max_songs_per_vote) return fail("選択できる曲数を超えています");
    const { results: valid } = await env.DB.prepare("SELECT song_id FROM campaign_songs WHERE campaign_id=?").bind(campaign.id).all();
    const allowed = new Set(valid.map(x => x.song_id));
    if (!body.songIds.every(songId => allowed.has(songId))) return fail("候補にない曲が含まれています");
    const voteId = id();
    try {
      await env.DB.batch([
        env.DB.prepare("INSERT INTO votes (id,campaign_id,user_id) VALUES (?,?,?)").bind(voteId,campaign.id,userId),
        ...body.songIds.map(songId => env.DB.prepare("INSERT INTO vote_choices (vote_id,song_id) VALUES (?,?)").bind(voteId,songId)),
        env.DB.prepare("INSERT OR IGNORE INTO entitlements (user_id,issue_id,campaign_id) VALUES (?,?,?)").bind(userId,campaign.magazine_issue_id,campaign.id)
      ]);
    } catch (error) {
      if (String(error).includes("UNIQUE")) return fail("この企画には投票済みです", 409);
      throw error;
    }
    return json({ ok: true, unlockedIssueId: campaign.magazine_issue_id }, 201);
   }
   if (path === "/api/recommendations" && request.method === "POST") {
    const userId = await requireUser(request, env), body = await request.json();
    const title = String(body.title || "").trim();
    if (!title || title.length > 160) return fail("曲名は必須です（160文字以内）");
    const active = await env.DB.prepare("SELECT id FROM campaigns WHERE status='active' LIMIT 1").first();
    const campaignId = active?.id || null;
    if (campaignId) {
      const count = await env.DB.prepare("SELECT COUNT(*) AS count FROM recommendations WHERE user_id=? AND campaign_id=?").bind(userId,campaignId).first();
      if (count.count >= 3) return fail("この企画で推薦できるのは3曲までです", 409);
    }
    const rid = id();
    await env.DB.prepare("INSERT INTO recommendations (id,user_id,campaign_id,song_title,region,source_url,reason) VALUES (?,?,?,?,?,?,?)").bind(rid,userId,campaignId,title,String(body.region||"").slice(0,120),String(body.sourceUrl||"").slice(0,1000),String(body.reason||"").slice(0,1000)).run();
    return json({ ok: true, id: rid }, 201);
   }
   if (path === "/api/me/entitlements" && request.method === "GET") {
    const userId = await requireUser(request, env);
    const { results } = await env.DB.prepare("SELECT e.issue_id,e.granted_at,m.title,m.description,m.status FROM entitlements e JOIN magazine_issues m ON m.id=e.issue_id WHERE e.user_id=? ORDER BY e.granted_at").bind(userId).all();
    return json({ entitlements: results });
   }
   if (path === "/api/magazines" && request.method === "GET") {
    const userId = await requireUser(request, env);
    const { results } = await env.DB.prepare("SELECT m.id,m.title,m.description,m.cover_image,m.status,CASE WHEN e.user_id IS NULL THEN 0 ELSE 1 END AS unlocked FROM magazine_issues m LEFT JOIN entitlements e ON e.issue_id=m.id AND e.user_id=? ORDER BY m.id").bind(userId).all();
    return json({ issues: results });
   }
   if (path.startsWith("/api/admin/") && !await admin(request, env)) return fail("運営権限が必要です", 403);
   if (path === "/api/admin/recommendations" && request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT id,song_title,region,source_url,reason,status,created_at FROM recommendations ORDER BY created_at DESC").all();
    return json({ recommendations: results });
   }
   if (path === "/api/admin/recommendations/status" && request.method === "POST") {
    const body = await request.json();
    if (!["accepted","on_hold","rejected"].includes(body.status)) return fail("invalid status");
    await env.DB.prepare("UPDATE recommendations SET status=? WHERE id=?").bind(body.status,body.id).run();
    return json({ ok: true });
   }
   if (path === "/api/admin/campaign/close" && request.method === "POST") {
    const body = await request.json();
    await env.DB.prepare("UPDATE campaigns SET status='closed' WHERE id=? AND status='active'").bind(body.campaignId).run();
    return json({ ok: true });
   }
   return fail("Not found", 404);
  } catch (error) {
   if (error instanceof Response) return error;
   return fail("サーバーエラー", 500);
  }
 }
};
