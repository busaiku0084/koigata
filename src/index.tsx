import { Hono } from "hono";
import { secureHeaders } from "hono/secure-headers";
import { findTypeBySlug } from "./content/types.ts";
import { writeAccessLog } from "./lib/access-log.ts";
import { NotFoundPage, PrivacyPage, QuizPage, ResultPage, TopPage, TypesPage } from "./pages.tsx";

type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
  LOG_SALT?: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// 画面から送ってよいイベント名。これ以外は捨てる
const EVENT_NAMES = new Set(["quiz_start", "quiz_complete", "share", "teaser_click"]);

app.use(
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      // 結果ごとのアクセントカラーを style 属性で渡しているため
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  }),
);

// ページの表示を記録する（静的ファイルは Workers の assets が先に返すので、ここには来ない）
app.use(async (c, next) => {
  const started = Date.now();
  await next();
  // favicon.ico など、assets に無いファイルへのリクエストはページの表示として数えない
  if (c.req.method !== "GET" || c.req.path.startsWith("/api/") || /\.\w+$/.test(c.req.path)) {
    return;
  }
  const resultType = c.req.path.startsWith("/r/") ? c.req.path.slice(3) : null;
  c.executionCtx.waitUntil(
    writeAccessLog(c.env.DB, c.req.raw, c.env.LOG_SALT ?? "", {
      kind: "pageview",
      path: c.req.path,
      status: c.res.status,
      durationMs: Date.now() - started,
      resultType,
    }).catch((err) => console.error("access log failed", err)),
  );
});

app.get("/", (c) => c.html(<TopPage origin={new URL(c.req.url).origin} />));
app.get("/quiz", (c) => c.html(<QuizPage origin={new URL(c.req.url).origin} />));
app.get("/types", (c) => c.html(<TypesPage origin={new URL(c.req.url).origin} />));
app.get("/privacy", (c) => c.html(<PrivacyPage origin={new URL(c.req.url).origin} />));

app.get("/r/:slug", (c) => {
  const origin = new URL(c.req.url).origin;
  const type = findTypeBySlug(c.req.param("slug"));
  if (!type) return c.html(<NotFoundPage origin={origin} />, 404);
  const isOwnResult = c.req.query("from") === "quiz";
  return c.html(<ResultPage origin={origin} type={type} isOwnResult={isOwnResult} />);
});

// 画面上の操作（診断の開始・完了、シェアなど）。navigator.sendBeacon から送られてくる
app.post("/api/e", async (c) => {
  let body: { name?: unknown; path?: unknown; type?: unknown; target?: unknown };
  try {
    body = JSON.parse(await c.req.text());
  } catch {
    return c.body(null, 400);
  }
  if (typeof body.name !== "string" || !EVENT_NAMES.has(body.name)) return c.body(null, 400);
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  c.executionCtx.waitUntil(
    writeAccessLog(c.env.DB, c.req.raw, c.env.LOG_SALT ?? "", {
      kind: "event",
      name: body.name,
      path: str(body.path) ?? "/",
      resultType: str(body.type),
      shareTarget: str(body.target),
    }).catch((err) => console.error("event log failed", err)),
  );
  return c.body(null, 204);
});

app.notFound((c) => c.html(<NotFoundPage origin={new URL(c.req.url).origin} />, 404));

export default app;
