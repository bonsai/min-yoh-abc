# 曲別コンテンツの共通スキーマ

このフォルダは、各曲フォルダで使うファイル構成・データ項目・制作ルールをまとめる共通仕様です。

## ディレクトリ規約

```text
songs/
├── 00-schema/
│   └── README.md
├── 001-yasugi-bushi/
│   ├── README.md
│   ├── source.json
│   └── source.md
├── 002-kokiriko-bushi/
│   ├── README.md
│   ├── source.json
│   └── source.md
└── 003-antagata-dokosa/
    ├── README.md
    ├── source.json
    └── source.md
```

- `00-schema/`：全曲共通のスキーマと制作ルール。曲番号より先に表示される。
- 各曲フォルダ：その曲に固有の原稿・出典・クイズを管理する。
- リポジトリ共通の一覧・シリーズ全体の情報は、曲別データに重複させず上位の共通ファイルで管理する。

## source.json のスキーマ

各曲のJSONは、次の項目を基本形とします。

```json
{
  "schema_version": "1.0",
  "id": "001-yasugi-bushi",
  "title": "安来節",
  "reading": "やすぎぶし",
  "english_title": "Yasugi Bushi",
  "region": "島根県・安来地方",
  "category": "民謡",
  "series": "あなたが知らない民謡の世界",
  "short_japanese": "やさしい日本語による短い解説",
  "short_english": "A short explanation in easy English.",
  "fact_check_notes": [
    "公開前に確認する事実や注意点"
  ],
  "sources": [
    {
      "title": "資料名",
      "url": "https://example.org/",
      "supports": "この資料で確認する内容",
      "checked": false
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "理解度チェックの問題",
      "options": ["選択肢A", "選択肢B", "選択肢C"],
      "answer": 0,
      "explanation_ja": "正解の短い説明",
      "explanation_en": "A short explanation in easy English."
    }
  ]
}
```

上記は構造を示す例です。公開用データでは、曲ごとの事実・出典・正解を確認して記入してください。クイズは各曲6問を標準とします。

## フィールド定義

| 項目 | 必須 | 内容 |
|---|---|---|
| `schema_version` | 必須 | スキーマのバージョン |
| `id` | 必須 | 曲フォルダと対応する一意なID |
| `title` | 必須 | 日本語の曲名 |
| `reading` | 必須 | 曲名の読み |
| `english_title` | 必須 | 英語表記 |
| `region` | 推奨 | 地域・伝承地。断定できない場合は注記する |
| `category` | 必須 | 民謡、わらべ歌など |
| `series` | 必須 | シリーズ名 |
| `short_japanese` | 必須 | 子どもにも伝わる短い日本語解説 |
| `short_english` | 必須 | 英語学習者にも伝わる簡潔な英語解説 |
| `fact_check_notes` | 必須 | 公開前の確認事項 |
| `sources` | 必須 | 主張を裏付ける資料とURL |
| `quiz` | 必須 | 理解度チェック。標準6問 |

### 出典オブジェクト

- `title`：資料名・ページ名
- `url`：直接参照できるURL
- `supports`：何の根拠として使うか
- `checked`：実際に内容を確認したら `true`

確認していないURLや資料を、確認済みとして扱わないでください。

### クイズオブジェクト

- `id`：曲内で一意な問題ID
- `question`：問題文
- `options`：選択肢
- `answer`：正解の選択肢番号。先頭は `0`
- `explanation_ja`：日本語の解説
- `explanation_en`：簡単な英語の解説

## source.md の構成

曲ごとの編集原稿は、次の順序にそろえます。

1. 基本情報
2. やさしい日本語の解説
3. Easy English
4. 歌詞・言葉の意味（必要な場合。伝承・由来と混同しない）
5. 出典と事実確認メモ
6. 理解度チェック6問
7. Shorts・ジン・教材などへの展開メモ

## 編集・公開ルール

- 日本語は短い文で、難しい言葉には説明を添える。
- 英語は短く自然にし、日本語の説明と意味をそろえる。
- 曲の成立・伝承の背景と、歌詞の一節の意味を分けて説明する。
- 地域差・異説がある場合は、ひとつの説を確定事項のように書かない。
- 事実の主張には、可能な限り一次資料または公的・専門機関の資料を付ける。
- 旋律・歌詞・音源を掲載するときは、著作権・利用条件も確認する。
- Shorts版は短く要点を伝え、ジン版では背景・出典・補足を追加する。
- `source.json` は機械処理用、`source.md` は人間が編集・校正するための原稿とする。両者の内容を同期する。

## 現在の対象曲

- `001-yasugi-bushi` — 安来節
- `002-kokiriko-bushi` — こきりこ節
- `003-antagata-dokosa` — あんたがたどこさ

新しい曲を追加するときは、このスキーマを参照して番号付きフォルダを作成します。
