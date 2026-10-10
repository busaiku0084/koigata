# 構成

Cloudflare Workers 1 つと D1 1 つで動く（[ADR 0003](adr/0003-cloudflare-workers-and-d1.md)）。

```
ブラウザ ──GET /r/himawari──▶ Workers ─┬─ public/ にあるファイル → Workers Assets がそのまま返す（Worker は動かない）
                                       └─ それ以外 → Hono（src/index.tsx）
                                              ├─ HTML を返す（src/pages.tsx）
                                              └─ waitUntil で access_logs に 1 行書く（D1）
ブラウザ ──POST /api/e（sendBeacon）──▶ Hono → access_logs に event を 1 行書く
```

## ファイル

| 場所 | 役割 |
|---|---|
| `src/index.tsx` | ルーティング・セキュリティヘッダー・ページ表示の記録・イベント API |
| `src/pages.tsx` | 全画面の HTML（Hono JSX）と OGP の meta |
| `src/content/types.ts` | 8 タイプの定義（名前・文言・色・相性） |
| `src/content/questions.ts` | 質問と、選択肢がどの軸のどちらに効くか |
| `src/lib/score.ts` | 回答 → タイプの判定。ブラウザにも同じものを配る |
| `src/lib/access-log.ts` | D1 への書き込み・端末/bot の判定・訪問者のハッシュ |
| `client/app.ts` | ブラウザ側。診断の進行・シェアボタン・イベント送信。`pnpm build:client` で `public/assets/app.js` に |
| `public/assets/style.css` | 全画面の CSS |
| `public/og/`・`public/story/` | シェア用画像（`scripts/gen-images.ts` で生成してコミット） |
| `migrations/` | D1 のスキーマ |
| `scripts/stats.ts` | アクセスログの集計 |

## 画面

| パス | 内容 |
|---|---|
| `/` | トップ。診断の開始と、全タイプへのリンク |
| `/quiz` | 診断。中身は `client/app.ts` が描く（JS が無いと動かない） |
| `/r/:slug` | 結果。`?from=quiz` のときは自分の結果としてシェアボタンを出し、ないときは「あなたも診断」を出す |
| `/types` | 全タイプの一覧 |
| `/privacy` | 記録する情報の説明 |

`?from=quiz` は結果を表示したあとブラウザ側で URL から消す。シェアするリンクには付かない。

## API

| メソッド・パス | 内容 |
|---|---|
| `POST /api/e` | 画面上の操作の記録。本文は `{ name, path, type?, target? }` の JSON。`name` が `EVENT_NAMES` に無ければ 400、記録したら 204 |

## 診断の判定

3 つの軸に 3 問ずつ。各軸で多かった側の文字をつなげたものがタイプのコード（例: `AHD`）。

| 軸 | 文字 |
|---|---|
| approach（動き方） | A = 自分から動く / P = 様子を見る |
| temperature（恋の温度） | H = 燃え上がる / C = じっくり温める |
| distance（距離感） | D = いつも一緒 / I = ひとりの時間も大事 |

## セキュリティ

- `hono/secure-headers` で CSP などを付ける。スクリプトは自分のドメインのものだけ。タイプの色を `style` 属性で渡しているので、スタイルだけ `'unsafe-inline'` を許している
- 外部へのリクエストはしない。シェアは X・LINE の共有 URL を新しいタブで開くだけ
