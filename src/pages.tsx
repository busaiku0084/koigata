import type { Child } from "hono/jsx";
import { QUESTIONS } from "./content/questions.ts";
import { ALL_TYPES, LOVE_TYPES, type LoveType } from "./content/types.ts";

export const SITE_NAME = "恋型診断";
const SITE_DESCRIPTION = "9 つの質問でわかる、あなたの恋愛タイプ。登録不要・1 分で診断できます。";
const HASHTAG = "恋型診断";

type Meta = { title: string; description: string; url: string; image: string };

function Layout(props: { meta: Meta; accent?: string; children: Child }) {
  const { meta } = props;
  return (
    <html lang="ja">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:url" content={meta.url} />
        <meta property="og:image" content={meta.image} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#e0559b" />
        <link rel="stylesheet" href="/assets/style.css" />
        <script type="module" src="/assets/app.js" />
      </head>
      <body style={props.accent ? `--accent:${props.accent}` : undefined}>
        <main class="wrap">{props.children}</main>
        <footer class="footer">
          <a href="/">{SITE_NAME}</a> ・ <a href="/types">全タイプ一覧</a> ・{" "}
          <a href="/privacy">プライバシー</a>
          <p class="note">診断結果はエンターテインメントとしてお楽しみください。</p>
        </footer>
      </body>
    </html>
  );
}

export function TopPage(props: { origin: string }) {
  return (
    <Layout
      meta={{
        title: `${SITE_NAME}｜1 分でわかる、あなたの恋愛タイプ`,
        description: SITE_DESCRIPTION,
        url: `${props.origin}/`,
        image: `${props.origin}/og/top.png`,
      }}
    >
      <section class="hero">
        <p class="eyebrow">登録不要・{QUESTIONS.length} 問・1 分</p>
        <h1>{SITE_NAME}</h1>
        <p class="lead">あなたは 8 つの恋愛タイプのうち、どれ？</p>
        <a class="button" href="/quiz" data-event="quiz_start">
          診断をはじめる
        </a>
      </section>
      <section class="type-grid">
        {ALL_TYPES.map((t) => (
          <a class="type-chip" href={`/r/${t.slug}`} style={`--accent:${t.color}`}>
            {t.name}
          </a>
        ))}
      </section>
    </Layout>
  );
}

export function QuizPage(props: { origin: string }) {
  return (
    <Layout
      meta={{
        title: `診断中｜${SITE_NAME}`,
        description: SITE_DESCRIPTION,
        url: `${props.origin}/quiz`,
        image: `${props.origin}/og/top.png`,
      }}
    >
      <section id="quiz" class="quiz" data-total={QUESTIONS.length}>
        <noscript>この診断を使うには JavaScript を有効にしてください。</noscript>
      </section>
    </Layout>
  );
}

export function ResultPage(props: { origin: string; type: LoveType; isOwnResult: boolean }) {
  const { origin, type, isOwnResult } = props;
  const best = LOVE_TYPES[type.bestMatch];
  const pageUrl = `${origin}/r/${type.slug}`;
  const shareText = `私の恋愛タイプは「${type.name}」でした！\n${type.catchphrase}\n#${HASHTAG}`;
  return (
    <Layout
      accent={type.color}
      meta={{
        title: `${type.name}｜${SITE_NAME}`,
        description: `${type.catchphrase}。${SITE_DESCRIPTION}`,
        url: pageUrl,
        image: `${origin}/og/${type.slug}.png`,
      }}
    >
      <section class="result">
        <p class="eyebrow">{isOwnResult ? "あなたの恋愛タイプは" : "この人の恋愛タイプは"}</p>
        <h1 class="type-name">{type.name}</h1>
        <p class="catch">{type.catchphrase}</p>
        <img
          class="result-image"
          src={`/og/${type.slug}.png`}
          alt={`${type.name}：${type.catchphrase}`}
          width="1200"
          height="630"
        />
        <p>{type.description}</p>
      </section>

      {isOwnResult ? (
        <section
          class="share"
          data-share-url={pageUrl}
          data-share-text={shareText}
          data-type={type.slug}
        >
          <h2>結果をシェアする</h2>
          <div class="share-buttons">
            <button type="button" class="share-x" data-share="x">
              X でポスト
            </button>
            <button type="button" class="share-ig" data-share="instagram">
              インスタのストーリーズ
            </button>
            <button type="button" class="share-line" data-share="line">
              LINE で送る
            </button>
            <button type="button" class="share-copy" data-share="copy">
              リンクをコピー
            </button>
          </div>
          <p class="share-status" aria-live="polite" />
        </section>
      ) : (
        <section class="cta">
          <a class="button" href="/quiz" data-event="quiz_start">
            あなたも診断してみる
          </a>
        </section>
      )}

      <section class="detail">
        <h2>あなたの強み</h2>
        <ul>
          {type.strengths.map((s) => (
            <li>{s}</li>
          ))}
        </ul>
        <h2>気をつけたいこと</h2>
        <ul>
          {type.cautions.map((s) => (
            <li>{s}</li>
          ))}
        </ul>
        <h2>相性のいいタイプ</h2>
        <p>
          <a href={`/r/${best.slug}`}>{best.name}</a>：{best.catchphrase}
        </p>
        <h2>ラッキーアクション</h2>
        <p>{type.luckyAction}</p>
      </section>

      {/* 有料の詳細レポートの需要を測るための入口（中身はまだ無い。docs/monetization.md） */}
      <section class="teaser">
        <h2>もっと詳しく知りたい？</h2>
        <p>告白のタイミング・相手のタイプ別の攻略法をまとめた詳細レポートを準備中です。</p>
        <button
          type="button"
          class="button ghost"
          data-teaser="detail_report"
          data-type={type.slug}
        >
          詳細レポートが気になる
        </button>
        <p class="teaser-status" aria-live="polite" />
      </section>

      {isOwnResult && (
        <section class="cta">
          <a class="button ghost" href="/quiz" data-event="quiz_start">
            もう一度診断する
          </a>
        </section>
      )}
    </Layout>
  );
}

export function TypesPage(props: { origin: string }) {
  return (
    <Layout
      meta={{
        title: `全タイプ一覧｜${SITE_NAME}`,
        description: `${SITE_NAME}の 8 つの恋愛タイプの一覧です。`,
        url: `${props.origin}/types`,
        image: `${props.origin}/og/top.png`,
      }}
    >
      <h1>全タイプ一覧</h1>
      <ul class="type-list">
        {ALL_TYPES.map((t) => (
          <li style={`--accent:${t.color}`}>
            <a href={`/r/${t.slug}`}>
              <strong>{t.name}</strong>
              <span>{t.catchphrase}</span>
            </a>
          </li>
        ))}
      </ul>
      <section class="cta">
        <a class="button" href="/quiz" data-event="quiz_start">
          診断をはじめる
        </a>
      </section>
    </Layout>
  );
}

export function PrivacyPage(props: { origin: string }) {
  return (
    <Layout
      meta={{
        title: `プライバシーについて｜${SITE_NAME}`,
        description: `${SITE_NAME}で記録する情報について。`,
        url: `${props.origin}/privacy`,
        image: `${props.origin}/og/top.png`,
      }}
    >
      <h1>プライバシーについて</h1>
      <p>
        {SITE_NAME}は会員登録なしで使えます。氏名・メールアドレスなどの個人情報は受け取りません。
        診断の回答はお使いのブラウザの中だけで計算し、回答そのものはサーバーに送りません。
      </p>
      <h2>記録する情報</h2>
      <p>サービスの改善のため、次の情報をアクセスログとして記録します。</p>
      <ul>
        <li>表示したページ、日時、参照元のサイト、国、端末の種類、ブラウザの情報（User-Agent）</li>
        <li>診断の開始・完了、表示された診断結果、シェアボタンなどの操作</li>
        <li>
          同じ日の再訪をまとめて数えるための識別子（IP アドレスなどから作る、日ごとに変わる値。IP
          アドレスそのものは保存しません）
        </li>
      </ul>
      <p>Cookie は使っていません。記録した情報を第三者に提供・販売することはありません。</p>
      <h2>利用しているサービス</h2>
      <p>このサイトは Cloudflare, Inc. のサービス上で動いています。</p>
    </Layout>
  );
}

export function NotFoundPage(props: { origin: string }) {
  return (
    <Layout
      meta={{
        title: `ページが見つかりません｜${SITE_NAME}`,
        description: SITE_DESCRIPTION,
        url: `${props.origin}/`,
        image: `${props.origin}/og/top.png`,
      }}
    >
      <h1>ページが見つかりません</h1>
      <a class="button" href="/">
        トップへ戻る
      </a>
    </Layout>
  );
}
