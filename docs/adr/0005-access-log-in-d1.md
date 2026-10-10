# 0005. アクセスログは初回から D1 に残し、生の IP は保存しない

- ステータス: 採用
- 日付: 2026-10-11
- 関連: [docs/access-log.md](../access-log.md)、[ADR 0004](0004-no-signup-and-answers-stay-in-browser.md)

## 背景

初回のデプロイからアクセスを記録しておきたい。後から「最初の数日にどこから来たか」は取り直せない。収益化の判断（広告・有料レポート）にも数字が要る。

## 決定

- Worker のミドルウェアで、HTML のページを返すたびに `access_logs` に 1 行書く（kind=pageview）
- 画面上の操作は `POST /api/e` に sendBeacon で送り、許可した名前（`EVENT_NAMES`）だけを書く（kind=event）
- 書き込みは `waitUntil` でレスポンスの後に行い、失敗してもページは返す
- 生の IP は保存しない。`visitor` は `LOG_SALT`・日付・IP・UA の SHA-256 の先頭 8 バイトで、日が変わると別の値になる
- bot は捨てずに `is_bot = 1` で残す（OGP を取りに来たクローラーの数も、シェアされた回数の目安になる）
- シェアするリンクに `?s=<共有先>` を付け、流入元を referrer に頼らず測る
- Cloudflare の Workers Logs も有効にする（エラー調査用。保持は短い）

## 理由

- D1 なら同じ Worker から書け、SQL で自由に集計できる。外部の解析ツールを入れずに済み、外部送信の表記も要らない
- 日ごとに変わるハッシュなら、日ごとのユニーク数は数えられるが、人を日をまたいで追えない
- アプリ内ブラウザ（X・Instagram）からは referrer が空になりやすい

## 検討した他の案

- Google Analytics: 導入は簡単だが、外部送信の表記と Cookie の同意が要る。広告を入れる段階で改めて検討する
- Cloudflare Web Analytics: Cookie なしで手軽だが、イベント（診断完了・シェア）を自由に取れない
- Workers Analytics Engine: 大量の書き込みに強いが、保持が 3 か月で、SQL が限られる。D1 の無料枠（書き込み 10 万行/日）に近づいたら移す
- 生の IP を保存する: 不正アクセスの調査には便利だが、個人情報の扱いが重くなる

## 影響

- 列を足すときは `/privacy` と docs/access-log.md も直す
- 1 日の PV＋イベントが 10 万に近づいたら、有料プランか Analytics Engine への移行を決める
