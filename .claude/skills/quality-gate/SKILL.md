---
name: quality-gate
description: koigata の品質ゲート。pnpm check / type-check / test と、CLAUDE.md の禁止パターン検出を実行して PASS/FAIL を判定する。PR を出す前や「品質チェックして」で使う。
allowed-tools: Bash(pnpm *), Bash(git *), Bash(grep *), Read, Glob, Grep
---

# 品質ゲート (koigata)

## Step 1: 変更範囲の検出

```bash
MB=$(git merge-base HEAD origin/main)
git diff "$MB" --name-only        # コミット済み + 未コミット
git status --short | grep '^??'   # 未追跡
```

- `src/` `client/` → TS チェック対象
- `src/content/` → 画像の作り直しが必要か
- `migrations/` → マイグレーションの確認対象
- `src/lib/access-log.ts` `migrations/` `src/index.tsx` の `EVENT_NAMES` → 記録する情報が変わったか

## Step 2: 自動チェック

```bash
pnpm check
pnpm type-check
pnpm test
pnpm build:client
```

修正可能な format / lint は `pnpm check:fix` で直してよい。ただし今回の変更ファイル以外に差分が出たら戻す。

`src/content/` か `scripts/gen-images.ts` が変わっていたら `pnpm gen:images` を実行し、`git status public/og public/story` に差分が残らないこと（残ればコミット漏れ）。

## Step 3: 禁止パターン検出

追加行（`git diff "$MB"` の `^+` 行と未追跡ファイル全体）を対象に調べる。

| # | 内容 | 判定 |
|---|---|---|
| 1 | `.dev.vars`・`LOG_SALT` の実値・API キー・トークンのコミット | **[CRITICAL] FAIL** |
| 2 | 生の IP（`cf-connecting-ip` など）・氏名・メールアドレス・診断の回答をサーバーに送る / 保存する処理 | **[CRITICAL] FAIL** |
| 3 | 会員登録・ログイン・Cookie の追加（ADR なし） | **[CRITICAL] FAIL** |
| 4 | 外部のスクリプト・広告・解析タグ・決済の追加で、`/privacy`（src/pages.tsx）に送信先の記載がない | **[CRITICAL] FAIL** |
| 5 | アクセスログの列・イベントを増やしたのに `/privacy` と docs/access-log.md が直っていない | FAIL |
| 6 | 当て済みのマイグレーションファイルの書き換え | FAIL |
| 7 | 公開済みのタイプの `slug` の変更（シェア済みのリンクが切れる） | FAIL |
| 8 | 断定的・不安をあおる占いの文言（「必ず」「絶対に〜できない」「不幸になる」など） | FAIL |
| 9 | TS の `any`、`innerHTML` への文字列の代入、文字列連結で組み立てた SQL | FAIL |
| 10 | `console.log` の残骸、`/Users/` などのローカルパス | FAIL |
| 11 | issue 番号のない TODO | FAIL |
| 12 | 設計の判断（依存の追加・スキーマ変更・外部とのやり取り・守るラインの変更）があるのに ADR がない | FAIL（`new-adr` スキルで追加） |
| 13 | コードの変更と `docs/`（architecture.md・access-log.md・operations.md）が食い違っている | FAIL |
| 14 | 47310〜47319 以外のポート、`127.0.0.1` 以外での待ち受け（本職の開発と競合させない。ADR 0007） | FAIL |

機械的に判定しきれないもの（2・8 など）は該当箇所を読んで判断する。

## 結果サマリー

```
## quality-gate 結果: PASS / FAIL

| チェック | 結果 | 詳細 |
|---|---|---|
| pnpm check | | |
| pnpm type-check | | |
| pnpm test | | |
| 画像 | | |
| 禁止パターン | | |
```
