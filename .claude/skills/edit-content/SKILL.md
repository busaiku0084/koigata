---
name: edit-content
description: koigata の診断の文言（タイプ名・キャッチコピー・説明・質問・色）を直し、シェア画像を作り直して確かめる。「タイプの説明を変えたい」「質問を直したい」「画像のデザインを変えたい」で使う。
allowed-tools: Read, Glob, Grep, Edit, Write, Bash(pnpm *), Bash(git *)
---

# 診断の文言を直す (koigata)

詳細は `docs/development/content.md`。

## Step 1: 直す

- タイプ: `src/content/types.ts`
- 質問: `src/content/questions.ts`
- 画像のレイアウト: `scripts/gen-images.ts`

守ること:
- 公開済みの `slug` は変えない（シェア済みのリンクが切れる）
- 各軸の質問は奇数個
- `bestMatch` はお互いを指す
- 断定的な表現・不安をあおる表現は使わない。短所は「気をつけたいこと」としてどうすればよいかを添える

## Step 2: 画像を作り直す

```bash
pnpm gen:images
```

## Step 3: 画像を目で確かめる

変えたタイプの `public/og/<slug>.png` と `public/story/<slug>.png` を Read で開き、次を確かめる。

- 文字が枠からはみ出していない（ストーリーズは下端の「ラッキーアクション」まで白い枠の中に収まる）
- 句読点や長音（ー）だけの行ができていない
- 背景色と文字のコントラストが十分

はみ出したら、文言を短くするか `scripts/gen-images.ts` の折り返し文字数・位置を調整する。

## Step 4: 確認

```bash
pnpm test
pnpm check
```

画像もいっしょにコミットする（`content/<内容>` ブランチ）。
