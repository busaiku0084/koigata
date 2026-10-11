# CLAUDE.md - koigata（恋型診断）

## プロジェクト概要

登録不要の恋愛タイプ診断サイト。2 択 12 問・4 つの軸で 16 タイプのどれかを出し（軸の根拠は ADR 0008）、結果を X・Instagram（ストーリーズ）・LINE にシェアしてもらう。
シェア → 流入 → 診断 → シェアの輪で広げ、いずれ広告・相性診断・有料レポートで収益化する（docs/plan.md）。
初回のデプロイから、ページの表示と操作をすべて D1 にアクセスログとして残す。

## 守るライン（最優先）

- **会員登録・ログイン・Cookie は作らない**。氏名・メールアドレスなどの個人情報を受け取らない（ADR 0004）
- **診断の回答はブラウザの中だけで計算し、サーバーに送らない**。サーバーが知るのは結果のタイプだけ
- **生の IP アドレスを保存しない**。訪問者は日ごとに変わるハッシュだけで数える（ADR 0005）
- 記録する情報や外部の送信先（広告・解析・決済）を増やすときは、`/privacy`（`src/pages.tsx` の `PrivacyPage`）と docs/access-log.md を同じ PR で直す（電気通信事業法の外部送信規律）
- 診断の結果はエンタメとして書く。断定的な表現や不安をあおる表現は使わない
- 公開済みのタイプの `slug`（`/r/<slug>`）は変えない。シェア済みのリンクが切れる
- `.dev.vars` と `LOG_SALT` の実値はコミットしない

## アーキテクチャ

```
koigata/
├── src/
│   ├── index.tsx           # Hono。ルーティング・ページ表示の記録・イベント API（POST /api/e）
│   ├── pages.tsx           # 全画面（Hono JSX）と OGP の meta
│   ├── content/            # タイプ（types.ts）と質問（questions.ts）。文言はここだけ
│   └── lib/
│       ├── score.ts        # 回答 → タイプの判定（ブラウザにも配る）
│       └── access-log.ts   # D1 への書き込み・端末/bot の判定・訪問者のハッシュ
├── client/app.ts           # ブラウザ側（診断の進行・シェア・イベント送信）→ public/assets/app.js
├── public/                 # Workers Assets。og/・story/ はシェア画像（生成してコミット）
├── migrations/             # D1 のスキーマ（access_logs）
├── scripts/                # gen-images.ts（シェア画像）・stats.ts（ログの集計）
├── test/                   # node --test
└── docs/                   # 設計・運用・ADR
```

- Cloudflare Workers + Workers Assets + D1（ADR 0003）。フロントのフレームワークは使わない
- 静的ファイルは Worker を通らないのでログに残らない。ページ（HTML）と `/api/e` のイベントだけを記録する
- シェア用画像は実行時に作らず、`pnpm gen:images` で事前に作ってコミットする（ADR 0006）
- 時刻は UNIX ミリ秒。集計で日付にするときは日本時間

## ドキュメント

詳細は `docs/` にある（一覧は docs/README.md）。作業の前に関係するものを読み、コードを変えたら同じ PR で直す。

- `docs/plan.md` — 企画・マネタイズの段取り
- `docs/architecture.md` — 構成・画面・API・判定の仕組み
- `docs/access-log.md` — 記録する内容・集計の仕方
- `docs/operations.md` — デプロイ・秘密の値・GitHub と Cloudflare のアカウント
- `docs/development/coding-guidelines.md` — コーディングルールの詳細（このファイルは要点のみ）
- `docs/development/workflow.md` — issue・ブランチ・コミット・PR・CI の進め方
- `docs/development/content.md` — 文言とシェア画像の直し方
- `docs/adr/` — 設計判断の記録。判断を伴う変更をしたら `new-adr` スキルで ADR を追加する

## スキル

- `quality-gate` — PR の前に。チェック一式と禁止パターンの検出
- `edit-content` — タイプ・質問の文言や画像を直すとき
- `new-adr` — 設計判断を記録するとき

## 開発コマンド

```bash
pnpm install
cp .dev.vars.example .dev.vars
pnpm db:migrate:local
pnpm dev               # http://127.0.0.1:47310（デバッガ 47311）
pnpm gen:images        # シェア画像の作り直し（文言・色を変えたら必ず）
pnpm stats [日数] [--local]  # アクセスログの集計（既定は本番）
pnpm check             # Biome（警告 0 件）。check:fix で自動修正
pnpm type-check        # src（Workers の型）と client（DOM の型）を別々に
pnpm test              # node --test
pnpm deploy            # 本番へ（main にマージしたものだけ）
```

## ポート（本職の開発に影響させない）

- `wrangler dev` は 127.0.0.1 の 47310、デバッガは 47311 に固定する（ADR 0007）。ほかに要るときは 47312〜47319。8787・9229・3000 などの既定のポートは使わない
- 本職のプロセスやコンテナは止めない・触らない

## コーディング規約（要点）

- コメント・ドキュメント・コミットメッセージは日本語、識別子は英語
- `any` は使わない。外部入力（`/api/e` の本文）は境界で型と長さを確かめ、イベント名は `EVENT_NAMES` の許可リストで絞る
- 相対 import には `.ts` / `.tsx` を付ける（`node --test` で直接動かすため）
- `client/` では `innerHTML` に文字列を入れない。DOM は `el()` で作る
- 遊ぶ人のほとんどはスマホ。幅 320px でも横スクロールを出さず、iPhone の Safari とアプリ内ブラウザで動くようにする（coding-guidelines.md の 4・5）
- 色は `public/assets/style.css` の変数を使う
- マイグレーションは `migrations/NNNN_name.sql` を足す。当て済みのファイルは書き換えない
- TODO には issue 番号を付ける（`TODO(#4)`）

## Git 運用

- `main` に直接コミットしない。`feat/` `fix/` `content/` `docs/` `chore/` のブランチを切って PR を出し、CI が通ってからスカッシュマージする
- **このリポジトリは busaiku0084 アカウントで操作する**。`gh` は `GH_TOKEN=$(gh auth token --user busaiku0084) gh ...` で実行し、`gh auth switch` でアクティブアカウントを変えない。git の push はローカルの credential helper で busaiku0084 になる（docs/operations.md）
- Cloudflare も個人のアカウント。`wrangler whoami` で確かめてから操作する
