# min-yoh-abc

日本の民謡を ABC notation で記録し、遊びながら曲の背景も深掘りするプロジェクトです。

## ブラウザゲーム：どじょうすくい

Next.js の画面でどじょうをタップして捕まえる、かわいいミニゲームです。Hono API はヘルスチェック、民謡の豆知識、プレイ結果の受け取りを担当します。

### 起動

Node.js 20.9 以上を用意して、リポジトリのルートで実行します。

```sh
npm install
npm run dev
```

- ゲーム画面: http://localhost:3000
- Hono API: http://localhost:8787/health
- API の豆知識: http://localhost:8787/api/game/tip

## 曲目

1. [安来節（どじょうすくい）](songs/001-yasugi-bushi.md)

## 方針

- 旋律は信頼できる楽譜・録音を参照して採譜し、出典を記録する。
- 確認できていない音符を推測で埋めず、採譜状況を明記する。
- 歌詞・踊り・地域的な歌い回しは、旋律データと区別して記録する。
- ABC ファイルは曲ごとに `abc/` へ置く。

## 技術構成

- Frontend: Next.js App Router / React / TypeScript
- API: Hono + Node adapter
- UI: CSS、モバイル対応
- Game: クライアント側の状態管理。プレイ結果を Hono API に送信

## ABC notation

ABC notation はテキストで旋律を表現する記法です。採譜を確認した曲から `abc/` に追加します。
