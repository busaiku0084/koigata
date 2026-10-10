# コーディングルール

koigata のコードを書くときの決まりごと。CLAUDE.md は要点だけを載せ、詳細はここに書く。
迷ったら「周りのコードに合わせる」を優先し、このファイルにない判断をしたら追記する（大きな判断は ADR にする）。

## 1. 共通

### 命名
- 識別子は英語、コメント・ドキュメント・画面の文言は日本語
- 略語は避ける。広く通じるもの（`id`・`url`・`db`・`api`・`og`）だけ使う
- 時刻は UNIX ミリ秒で持ち、`ts` / `*Ms` / `*_ms` と名前で分かるようにする。集計で日付にするときは日本時間（`+9 hours`）

### コメント
- 「何をしているか」ではなく「なぜそうしているか」を書く
- `TODO` には issue 番号を付ける（`TODO(#12): ...`）。番号のない TODO は残さない

### エラー
- 握りつぶさない。ただしアクセスログの書き込みだけは、失敗してもページを返す（`console.error` に残す）
- 利用者向けの文言は「何が起きたか」と「どうすればよいか」を書く

### 個人情報・秘密の値（[ADR 0004](../adr/0004-no-signup-and-answers-stay-in-browser.md)・[ADR 0005](../adr/0005-access-log-in-d1.md)）
- 生の IP、氏名・メールアドレス、診断の回答そのものをサーバーに送らない・保存しない
- Cookie を使わない。ブラウザに残すものが必要になったら ADR を書く
- `.dev.vars`・`LOG_SALT` の実値はコミットしない
- SQL には必ずプレースホルダ（`?`）で値を渡す
- 外部からの入力（`/api/e` の本文など）は境界で型と長さを確かめる。イベント名は許可リストで絞る

### 依存の追加
- 追加する前に、標準の API や既存の依存で足りないか考える。Workers のランタイムで動くか確かめる
- バージョンは公開から 2 週間以上たったものを選ぶ
- ブラウザに配る JS（`public/assets/app.js`）を重くしない。ライブラリを入れる前に PR で相談する

## 2. TypeScript

- `strict` と `noUncheckedIndexedAccess` を前提に書く。`any` は使わない（外部入力は `unknown` で受けて絞る）
- `import type` を使い分ける（`verbatimModuleSyntax`）
- 相対 import には `.ts` / `.tsx` の拡張子を付ける（`node --test` で型を消して直接動かすため）
- Biome の警告 0 件を保つ
- `src/` は Workers の型、`client/` は DOM の型で別々に型チェックする（`client/tsconfig.json`）。両方から使うのは `src/content/` と `src/lib/score.ts` だけで、ここでは Workers・DOM どちらの API も使わない

## 3. サーバー（Hono）

- 画面は `src/pages.tsx` の関数コンポーネント。OGP の meta は `Layout` に `meta` を渡して作る
- ページ表示の記録はミドルウェアが行う。ルートの中でログを書かない
- 新しいイベントは `EVENT_NAMES` に足し、docs/access-log.md に意味を書く
- `/api/` のルートはページ表示として数えない

## 4. ブラウザ（client/app.ts）

- フレームワークは使わない。DOM の生成は `el()` を使う。`innerHTML` に文字列を入れない
- イベントは `track()` で送る（sendBeacon。画面遷移中でも届く）
- ブラウザの `alert` / `confirm` は使わない。結果は画面の `aria-live` の領域に出す
- JS が無くても、診断以外のページ（結果・一覧）は読めるようにする

## 5. スタイル

- 色・角丸は `public/assets/style.css` の `:root` の変数を使う。タイプごとの色は `--accent` で受け取る
- 幅 400px 前後で横スクロールが出ないこと。余白は `gap` で取る
- ボタンは何が起きるかを書く（「X でポスト」「診断をはじめる」）

## 6. DB・マイグレーション

- スキーマの変更は `migrations/NNNN_name.sql` を足して行う。当て済みのファイルは書き換えない
- 列の意味は SQL のコメントに書く
- 変えたら `src/lib/access-log.ts`・`scripts/stats.ts`・docs/access-log.md・`/privacy` を合わせて直す

## 7. テスト

- `test/*.test.ts` に置き、`node --test` で動かす（Vitest は使っていない）
- テスト名は日本語で、何を確かめるかを書く
- 純粋な関数（判定・UA の解釈など）は必ずテストする。文言の約束事（奇数個の質問・相性が対になる）もテストで守る
