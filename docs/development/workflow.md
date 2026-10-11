# 開発の進め方

## 流れ

1. **issue を起点にする**。やることが issue になっていなければ先に作る
2. **ブランチを切る**。`main` に直接コミットしない
   - `feat/<内容>`: 機能追加
   - `fix/<内容>`: 不具合の修正
   - `content/<内容>`: タイプ・質問の文言だけ
   - `docs/<内容>`: ドキュメントのみ
   - `chore/<内容>`: 設定・依存・雑務
3. **実装する**。設計の判断を伴うなら ADR を書く（`docs/adr/`）
4. **確認する**。`pnpm check`・`pnpm type-check`・`pnpm test` を通す。画面を変えたら `pnpm dev` で起動し、スマホ幅（320px と 375px）で見る。Claude Code では `quality-gate` スキルでまとめて確認できる
5. **PR を出す**（後述のテンプレート）
6. **CI が成功したことを確認してから**、スカッシュでマージする。マージ後はブランチを消す
7. **デプロイする**（[operations.md](../operations.md)）。マイグレーションがあれば先に当てる

## コミットメッセージ

```
<type>(<scope>): <日本語で要約>

- 変更の要点を箇条書き

Closes #N
```

- `type`: `feat` / `fix` / `content` / `docs` / `refactor` / `test` / `chore`
- `scope`: 省略可（`quiz` / `result` / `log` / `share` など）
- スカッシュマージするので、PR のタイトルがそのまま `main` のコミットになる。PR タイトルも同じ形式にする

## PR の書き方

```
## 概要
何のための変更か

## 変更内容
- 主な変更

## 確認
- [x] pnpm check / pnpm type-check / pnpm test
- [x] 画面・動作の確認（何を見たか）

Closes #N
```

- issue を完了させる PR には `Closes #N`、一部だけなら `Refs #N`
- 画面を変えたらスクリーンショットを付ける。確認できなかったことがあれば書く

## CI

`.github/workflows/ci.yml` で、PR と `main` への push ごとに次を実行する。

- `pnpm check`（Biome）・`pnpm type-check`・`pnpm test`
- `pnpm build:client` と `wrangler deploy --dry-run`（Worker がビルドできること）
- `pnpm gen:images` をして、コミットされた画像と差がないこと

## GitHub のアカウント

このリポジトリは busaiku0084 アカウントで操作する。`gh` を使うときは `GH_TOKEN=$(gh auth token --user busaiku0084)` を付ける。設定の詳細は [operations.md](../operations.md#github-のアカウント)。
