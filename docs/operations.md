# 運用

## GitHub のアカウント

このリポジトリは **busaiku0084** アカウントで操作する。`gh` のアクティブアカウントは本職のものになっていることがあるので、切り替えずに次のようにする。

- `gh` は `GH_TOKEN=$(gh auth token --user busaiku0084) gh ...` で実行する
- ローカルのクローンには、busaiku0084 のトークンを使う credential helper と、コミットの作者（noreply アドレス）をリポジトリ単位で設定してある。クローンし直したら次を実行する

```sh
git config user.name busaiku0084
git config user.email 84085150+busaiku0084@users.noreply.github.com
git config --unset-all credential.helper
git config --add credential.helper ''   # グローバルの helper（本職アカウントの gh）を打ち消す
git config --add credential.helper '!f(){ echo username=busaiku0084; echo password=$(gh auth token --user busaiku0084); }; f'
```

Cloudflare も個人のアカウントを使う。`wrangler whoami` で確かめてから操作する。

## 初回デプロイ

```sh
pnpm exec wrangler login
pnpm exec wrangler whoami                 # 個人のアカウントか確認する
pnpm exec wrangler d1 create koigata      # 出てきた database_id を wrangler.jsonc に書いてコミット
pnpm db:migrate:remote                    # access_logs を作る（デプロイより先に）
openssl rand -hex 32 | pnpm exec wrangler secret put LOG_SALT
pnpm deploy
```

`https://koigata.<サブドメイン>.workers.dev` で公開される。

### デプロイ後の確認

- トップ → 診断 → 結果 → シェアまで一通り操作する
- `pnpm stats 1` で、いまの操作が pageview・event として入っていること
- 結果ページの URL を X の投稿画面に貼り、カード画像が出ること
- スマホで「インスタのストーリーズ」を押し、共有シートに Instagram が出ること

## 2 回目以降のデプロイ

```sh
pnpm db:migrate:remote   # migrations/ を足したときだけ。デプロイより先に
pnpm deploy
```

`main` にマージしたものだけをデプロイする。

## 秘密の値

| 名前 | 用途 | 設定 |
|---|---|---|
| `LOG_SALT` | 訪問者のハッシュに混ぜる値（[ADR 0005](adr/0005-access-log-in-d1.md)） | 本番は `wrangler secret put`、ローカルは `.dev.vars` |

`LOG_SALT` を変えると、その日の訪問者数が二重に数えられる。変えるなら日付の変わり目（UTC）にする。

## ログを見る

- 集計: `pnpm stats [日数]`（[access-log.md](access-log.md)）
- エラー: Cloudflare のダッシュボード → Workers → koigata → Logs。または `pnpm exec wrangler tail`

## 独自ドメイン

Cloudflare にドメインを追加し、Workers の Custom Domains に設定する。OGP の URL はリクエストの origin から作っているので、コードの変更は要らない。
`workers.dev` の URL でシェアされたリンクは、そのまま残る（リダイレクトはしていない）。

## 困ったとき

| 症状 | 確かめること |
|---|---|
| ページは出るがログが増えない | `pnpm db:migrate:remote` をしたか。Workers Logs に `access log failed` が出ていないか |
| X のカードに画像が出ない | `og:image` が `https://` の絶対 URL か。X 側のキャッシュは時間がたつと更新される |
| ローカルで `pnpm dev` が起動しない | 47310・47311 が使われていないか（`lsof -nP -iTCP:47310`）。本職のプロセスは止めない |
