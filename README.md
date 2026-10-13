# min-yoh-abc

日本の民謡を ABC notation で記録し、遊びながら曲の背景も深掘りするプロジェクトです。

## ブラウザゲーム：どじょうすくい

どじょうをタップしてすくう、かわいいミニゲームです。45秒チャレンジ、ミッション、どじょう図鑑、安来節の豆知識を備えています。

## 技術構成

- Frontend: Vite+（`vp` CLI）+ TypeScript、軽量な DOM UI
- API: Hono + Node adapter
- Dev server: Vite+ が `apps/web` を配信し、`/api` と `/health` を Hono に proxy
- UI: CSS、スマートフォン対応

## 起動

Vite+ の CLI（`vp`）をインストールしてから、リポジトリのルートで実行します。

Windows PowerShell:

```powershell
irm https://vite.plus/ps1 | iex
```

macOS / Linux:

```sh
curl -fsSL https://vite.plus | bash
```

インストール後：

```sh
vp install
npm run dev
```

- ゲーム画面: http://localhost:5173
- Hono API: http://localhost:8787/health
- API の豆知識: http://localhost:8787/api/game/tip

Vite+ の開発・ビルド・チェックは `vp dev`、`vp build`、`vp check` でも実行できます。Hono API は並行して `npm run dev:api` で起動します。

## 曲目

1. [安来節（どじょうすくい）](songs/001-yasugi-bushi.md)

## 方針

- 旋律は信頼できる楽譜・録音を参照して採譜し、出典を記録する。
- 確認できていない音符を推測で埋めず、採譜状況を明記する。
- 歌詞・踊り・地域的な歌い回しは、旋律データと区別して記録する。
- ABC ファイルは曲ごとに `abc/` へ置く。

## ABC notation

ABC notation はテキストで旋律を表現する記法です。採譜を確認した曲から `abc/` に追加します。
