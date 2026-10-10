# 初回デプロイの手順

Cloudflare のアカウントと GitHub のリポジトリは、個人用（busaiku0084）のものを使う。本職のアカウントでログインしたまま実行しないこと。

## 1. GitHub にリポジトリを作る

```sh
gh auth switch          # 個人用のアカウントに切り替える
gh repo create busaiku0084/koigata --private --source . --push
```

## 2. Cloudflare にログインして D1 を作る

```sh
pnpm exec wrangler login
pnpm exec wrangler whoami                 # 個人用のアカウントか確認する
pnpm exec wrangler d1 create koigata      # 出てきた database_id を wrangler.jsonc に書く
pnpm db:migrate:remote                    # access_logs を作る（デプロイより先に）
```

## 3. 秘密の値を入れる

```sh
openssl rand -hex 32 | pnpm exec wrangler secret put LOG_SALT
```

## 4. デプロイ

```sh
pnpm deploy
```

`https://koigata.<サブドメイン>.workers.dev` で公開される。

## 5. 確認

- トップ → 診断 → 結果 → シェアまで一通り操作する
- `pnpm stats 1` で、いまの操作が pageview・event として入っていること
- 結果ページの URL を X の投稿画面に貼り、カード画像が出ること
- スマホで「インスタのストーリーズ」を押し、共有シートに Instagram が出ること

## 独自ドメインにするとき

Cloudflare にドメインを追加し、Workers の Custom Domains に設定する。OGP の URL はリクエストの origin から作っているので、コードの変更は要らない。
