# LINE投票・雑誌連動 MVP 実装メモ

## 実装したもの

- Cloudflare Workers API: LINE ID token verification, one vote per LINE identity per campaign, up to five song choices, live aggregate results, up to three recommendations per user per active campaign, magazine entitlement creation, and operator-only recommendation status / campaign close endpoints.
- Cloudflare D1 schema for campaigns, songs, votes, recommendations, magazine issues/articles, and entitlements.
- Vote page connected to the API and polling live results every 10 seconds.
- Initial 26-song draft seed data. The campaign starts as `draft` and is not publicly votable until an operator activates it.
- GitHub branch + Pull Request workflow is intended for editorial content; deployment must be configured separately.

## Decisions represented

- Campaigns and magazine issues are independent entities linked by `campaigns.magazine_issue_id`.
- One successful vote unlocks the configured issue; the same issue entitlement is unique per reader.
- Campaign results are visible during voting and expose only aggregated counts.
- One vote per user per campaign. A campaign must be closed by the operator before a later campaign is activated.
- Recommendation submissions are private in D1 and do not go into public repository files.
- Public content should be JSON for structured data and Markdown for article text.
- Content changes are reviewed through Pull Requests and only become public after operator approval/merge.

## Setup required before real use

1. Create a Cloudflare D1 database. Apply `worker/schema.sql`, then `worker/seed.sql`.
2. Replace the placeholder D1 database ID and configure the real LINE Login channel ID in `worker/wrangler.toml`.
3. Set Worker secrets `USER_ID_SALT` and `ADMIN_TOKEN`.
4. Deploy the Worker and set `LIFF_ID` and `API_BASE` in `vote/index.html`.
5. Change `campaign-001` from `draft` to `active` in D1 only when ready to open voting.
6. Configure the LIFF endpoint URL and allowed callback URL in LINE Developers.
7. Add the required Pages deployment workflow for the repository's actual Pages settings and confirm the deployed URL.

## Current limitations

- The GitHub-connected implementation is a first implementation slice, not a production-ready launch.
- The frontend uses placeholders for LIFF ID and Worker URL until deployment settings are supplied.
- The Worker includes API endpoints for recommendation moderation, but a dedicated operator UI and the duplicate-song confirmation UI are not yet included.
- Magazine catalog metadata endpoint exists, but protected article-body delivery and the complete catalog reader UI remain to be implemented. Do not publish private issue body files at public static URLs.
- The admin API uses a bearer secret as an initial operator gate. Before broad public use, move operator access to a proper authenticated workflow and rotate secrets if they have ever been exposed.
- Rate limiting, abuse monitoring, automated integration tests, and a production campaign activation workflow are still needed.
