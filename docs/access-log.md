# アクセスログ

初回のデプロイから、ページの表示と画面上の操作をすべて D1 の `access_logs` に残す（スキーマは `migrations/0001_access_logs.sql`）。

## 何を記録するか

| kind | いつ | 主な列 |
| --- | --- | --- |
| `pageview` | HTML のページを返したとき（Worker のミドルウェア） | path・status・referrer_host・`?s=`・utm_*・country・device |
| `event` | 画面から `POST /api/e`（sendBeacon） | name・result_type・share_target |

event の name は `src/index.tsx` の `EVENT_NAMES` にあるものだけ受け付ける。

- `quiz_start` 診断開始ボタン
- `quiz_complete` 診断完了（result_type に結果）
- `share` シェアボタン（share_target に x / instagram / line / copy）
- `teaser_click` 「詳細レポートが気になる」（有料化の需要を測る）

静的ファイル（画像・CSS・JS）は Workers Assets が直接返すので記録されない。

## 流入元の測り方

シェアするリンクには `?s=<共有先>` を付けている。X からのクリックは referrer が `t.co` になり、アプリ内ブラウザからは referrer が空になることが多いので、`?s=` のほうを主に見る。
広告やプロフィールのリンクには `utm_source` などを付ければ、そのまま列に入る。

## 個人情報の扱い

- 生の IP アドレスは保存しない。`visitor` は `LOG_SALT`・日付・IP・UA から作った SHA-256 の先頭 8 バイトで、日が変わると別の値になる（日ごとのユニーク数だけ数えられる）
- Cookie は使わない。診断の回答そのものはサーバーに送らない
- 内容は `/privacy` に書いてある。記録する項目を増やしたら、`/privacy` も同じ PR で直す

## 集計

```sh
pnpm stats          # 本番の直近 7 日
pnpm stats 30       # 直近 30 日
pnpm stats --local  # ローカルの D1
```

任意の SQL は `pnpm exec wrangler d1 execute koigata --remote --command "..."`。
bot（OGP を取りに来る Twitterbot など）は `is_bot = 1` で記録しているので、人の数を見るときは `is_bot = 0` で絞る。

## 生ログ

D1 とは別に、Cloudflare の Workers Logs（`wrangler.jsonc` の `observability`）も有効にしている。エラーの調査用で、保持期間は短い（無料プランで 3 日）。

## 規模が大きくなったら

D1 の無料枠は書き込み 10 万行/日。1 日の PV＋イベントがこれに近づいたら、有料プラン（$5/月）にするか、ログを Workers Analytics Engine に移す。
古い行は月ごとに集計表へまとめてから消す、などもその時に決める。
