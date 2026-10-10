// アクセスログを D1 の access_logs に書く。書き込みは waitUntil でレスポンスの後に回し、
// 失敗してもページの表示には影響させない

export type LogRecord = {
  kind: "pageview" | "event";
  name?: string | null;
  path: string;
  status?: number | null;
  durationMs?: number | null;
  resultType?: string | null;
  shareTarget?: string | null;
};

const BOT_PATTERN =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|headless|lighthouse|curl|wget|python-requests/i;

export function isBot(userAgent: string): boolean {
  return BOT_PATTERN.test(userAgent);
}

export function deviceOf(userAgent: string): "mobile" | "tablet" | "desktop" {
  if (/ipad|tablet/i.test(userAgent)) return "tablet";
  if (/mobile|iphone|android/i.test(userAgent)) return "mobile";
  return "desktop";
}

export function referrerHostOf(referrer: string | null, selfHost: string): string | null {
  if (!referrer) return null;
  try {
    const host = new URL(referrer).host;
    return host === selfHost ? null : host;
  } catch {
    return null;
  }
}

// 生の IP は残さず、日付ごとに変わるハッシュだけを残す（同じ日の再訪はまとめて数えられる）
async function visitorHash(
  ip: string,
  userAgent: string,
  salt: string,
  now: Date,
): Promise<string> {
  const day = now.toISOString().slice(0, 10);
  const data = new TextEncoder().encode(`${salt}|${day}|${ip}|${userAgent}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest).slice(0, 8)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function truncate(value: string | null | undefined, max: number): string | null {
  if (!value) return null;
  return value.length > max ? value.slice(0, max) : value;
}

export async function writeAccessLog(
  db: D1Database,
  req: Request,
  salt: string,
  record: LogRecord,
): Promise<void> {
  const url = new URL(req.url);
  const userAgent = req.headers.get("user-agent") ?? "";
  const ip = req.headers.get("cf-connecting-ip") ?? "";
  const now = new Date();
  const cf = (req as Request & { cf?: { country?: string } }).cf;
  // pageview は ?s= の流入元、event は送られてきた共有先
  const shareTarget = record.shareTarget ?? url.searchParams.get("s");

  await db
    .prepare(
      `INSERT INTO access_logs
        (ts, kind, name, path, status, duration_ms, result_type, share_target, referrer_host,
         utm_source, utm_medium, utm_campaign, country, device, is_bot, visitor, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      now.getTime(),
      record.kind,
      truncate(record.name, 64),
      truncate(record.path, 256) ?? "/",
      record.status ?? null,
      record.durationMs ?? null,
      truncate(record.resultType, 32),
      truncate(shareTarget, 32),
      referrerHostOf(req.headers.get("referer"), url.host),
      truncate(url.searchParams.get("utm_source"), 64),
      truncate(url.searchParams.get("utm_medium"), 64),
      truncate(url.searchParams.get("utm_campaign"), 64),
      cf?.country ?? null,
      deviceOf(userAgent),
      isBot(userAgent) ? 1 : 0,
      await visitorHash(ip, userAgent, salt, now),
      truncate(userAgent, 512),
    )
    .run();
}
