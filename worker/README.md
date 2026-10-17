# 民謡ABC API

Cloudflare Workers + D1 API for LINE-authenticated voting, live results, song recommendations, and magazine entitlements.

## Deploy

1. Create a Cloudflare D1 database and replace `database_id` in `wrangler.toml`.
2. Run `npx wrangler d1 execute min-yoh-abc --remote --file=schema.sql`.
3. Set `LINE_CHANNEL_ID` to the LINE Login channel ID used by the LIFF app.
4. Set secrets: `npx wrangler secret put USER_ID_SALT` and `npx wrangler secret put ADMIN_TOKEN`.
5. Deploy with `npx wrangler deploy`.
6. Configure the frontend with the LIFF ID and API URL.

## Important

- Do not commit real tokens, secrets, LINE user IDs, vote records, or raw recommendation submissions.
- Configure campaign, songs, and magazine issue rows in D1 before opening a campaign.
- The admin endpoints currently use a bearer secret as a first operational MVP. Replace this with an authenticated operator workflow before broad public use.
- Magazine issue metadata can be listed after LINE login; serving protected article bodies needs to be implemented before private content is published.
- Live results are public while a campaign is active. Do not expose user-level vote records.


## Shared song catalog API

`GET /api/songs.jsonl` returns the public song catalog as NDJSON (one JSON object per line), including `id`, `title`, `region`, `area`, `description`, `source_url`, and `status`. No user, vote, or recommendation-submission data is included. CORS is enabled for browser clients such as Neo Minyo Land.

Before deploying this endpoint to an existing D1 database, apply the description migration:

```sh
npx wrangler d1 execute min-yoh-abc --remote --file=worker/migrations/0002_song_description.sql
```

For a fresh database, apply `worker/schema.sql`, then `worker/migrations/0002_song_description.sql`, then `worker/seed.sql`. Confirm the D1 schema and seed order for your deployment before opening voting.
