# MyoABC（移転しました）

このリポジトリの内容は、2026-11-08 の民謡プロジェクト再編で **[bonsai/neo-minyo-land](https://github.com/bonsai/neo-minyo-land)** へ統合されました。
今後の編集・Issue・デプロイはすべて land 側で行います（DBはひとつ、デプロイもひとつ）。

## 移転先マップ（land 内部の部門）

| 旧 min-yoh-abc の置き場 | 移転先（neo-minyo-land） |
|---|---|
| `magazine/`（zine・WEB BOOK・企画書・クイズ正本） | `editorial/`（編集部） |
| `songs/`（曲データ・schema） | `songs/`（そのまま） |
| `songs/quiz/`（レシート型・民謡クイズPWA） | `school/quiz/`（スクール） |
| `songs/vote/`（投票PWA） | `songs/vote/`（そのまま） |
| （旧 bonsai/neo-minyo の playlist.json） | `radio/`（ラジオ）／運用は land Issue #23 |
| （旧 bonsai/minyo-db のIssue 3件） | land Issue #24–#26（スクール／民謡カード） |

## このリポジトリに残っているもの

- `docs/` — 過去の提案・方針ドキュメント（アーカイブ）
- `index.html` — 移転案内ページ（GitHub Pages で公開）
- Issue #1 — 移転時点で open のまま保留（land 側で扱うか未決定）

## 経緯

- 2026-10-12 リポジトリ作成（民謡の書誌・教材／出版プロジェクト）
- 2026-11-05 zine 企画書・原稿メモを追加、Private 化
- 2026-11-08 Public に復帰 → 同日、neo-minyo-land をハブとする monorepo へ再編・移転
