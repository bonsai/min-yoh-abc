# Shared song catalog: Minyo ABC API → Neo Minyo Land

## Decision

- The authoritative song catalog lives in `bonsai/min-yoh-abc`.
- Neo Minyo Land reads public song metadata from `GET /api/songs.jsonl`.
- The API format is JSONL / NDJSON: one JSON object per line.
- Neo Minyo Land owns only map/game metadata: location key, `songId`, map coordinates, and game link.
- The public endpoint returns only `published` songs.
- No vote records, LINE identifiers, or raw recommendations are exposed by the song endpoint.

## API contract

The provider-side OpenAPI 3.1 contract is maintained at [`worker/openapi.yaml`](../../worker/openapi.yaml).

The endpoint responds with `application/x-ndjson; charset=utf-8`. Each non-empty line is one Song object; the response is not a JSON array. Song `id` values are stable identifiers and must match Land's `spots.json[].songId`.

## Public record

```json
{"id":"yasugi-bushi","title":"安来節","region":"島根県","area":"中国","description":"島根県安来地方の民謡。","source_url":null,"status":"published"}
```

## Consumer setup

Set `data/config.json` in `bonsai/neo-minyo-land`:

```json
{
  "songsApiUrl": "https://YOUR-DEPLOYED-ABC-WORKER/api/songs.jsonl"
}
```

Use the actual deployed Worker URL; do not commit credentials or tokens in this file. The current config contains a placeholder until the API is deployed.

## Deployment order

1. Merge and deploy the Minyo ABC API change.
2. Apply `worker/migrations/0002_song_description.sql` to D1.
3. Verify the endpoint returns one JSON object per line and includes all 20 `songId` values used by Neo Minyo Land.
4. Set the real API URL in Land's `data/config.json`.
5. Deploy Land and test map loading, spot details, and the Yasugi game link.

## Failure behavior

Land shows an explicit error if the API URL is missing, the API is unreachable, or a referenced `songId` is absent. It does not silently use a second copy of song titles/descriptions.
