# 恋型診断（koigata）

9 つの 2 択に答えると、8 つの恋愛タイプのどれかがわかる診断サイト。
登録不要で、結果は X・Instagram（ストーリーズ）・LINE にシェアできる。
初回のデプロイから、すべてのページ表示と操作を D1 にアクセスログとして残す。

- 企画とマネタイズの段取り: [docs/plan.md](docs/plan.md)
- アクセスログの設計と集計: [docs/access-log.md](docs/access-log.md)
- 初回デプロイの手順: [docs/deploy.md](docs/deploy.md)

## 構成

```
src/
  index.tsx          # Hono のルーティング・アクセスログのミドルウェア・イベント API
  pages.tsx          # 画面（Hono JSX でサーバー側で HTML を作る。OGP もここ）
  content/           # タイプと質問の定義（文言を変えるのはここ）
  lib/score.ts       # 回答 → タイプの判定（ブラウザとテストで共有）
  lib/access-log.ts  # D1 への書き込み
client/app.ts        # ブラウザ側（診断の進行・シェアボタン・イベント送信）→ public/assets/app.js
public/              # 静的ファイル。og/・story/ はシェア用画像（scripts/gen-images.ts で生成）
migrations/          # D1 のスキーマ
scripts/             # 画像の生成・ログの集計
```

Cloudflare Workers（静的ファイルは Workers Assets）＋ D1。サーバーは 1 つで、DB はログだけ。

## ローカル開発

```sh
pnpm install
cp .dev.vars.example .dev.vars
pnpm db:migrate:local
pnpm dev            # http://127.0.0.1:47310
```

ポートは本職の開発環境とぶつからないよう 127.0.0.1 の 47310（デバッガ 47311）に固定している。

| コマンド | 内容 |
| --- | --- |
| `pnpm gen:images` | タイプの文言・色を変えたら実行して、`public/og`・`public/story` をコミットする |
| `pnpm stats [日数] [--local]` | アクセスログの集計（既定は本番の直近 7 日） |
| `pnpm test` / `pnpm type-check` / `pnpm check` | テスト・型・Biome |
| `pnpm deploy` | 本番へデプロイ |
