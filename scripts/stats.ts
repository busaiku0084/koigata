// D1 のアクセスログをざっと集計する
// 使い方: pnpm stats [日数=7] [--local]
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const days = Number(args.find((a) => /^\d+$/.test(a)) ?? 7);
const target = args.includes("--local") ? "--local" : "--remote";
const since = `(CAST(strftime('%s','now') AS INTEGER) - ${days} * 86400) * 1000`;
const human = "is_bot = 0";

const queries: [string, string][] = [
  [
    "日別の PV・訪問者・診断完了・シェア",
    `SELECT date(ts / 1000, 'unixepoch', '+9 hours') AS day,
       COALESCE(SUM(kind = 'pageview'), 0) AS pv,
       COUNT(DISTINCT visitor) AS visitors,
       COALESCE(SUM(name = 'quiz_start'), 0) AS starts,
       COALESCE(SUM(name = 'quiz_complete'), 0) AS completes,
       COALESCE(SUM(name = 'share'), 0) AS shares
     FROM access_logs WHERE ts >= ${since} AND ${human} GROUP BY day ORDER BY day`,
  ],
  [
    "流入元（参照元ホスト・?s= の共有先・utm_source）",
    `SELECT COALESCE(referrer_host, '(direct)') AS referrer, share_target AS s, utm_source,
       COUNT(*) AS pv
     FROM access_logs WHERE ts >= ${since} AND ${human} AND kind = 'pageview'
     GROUP BY 1, 2, 3 ORDER BY pv DESC LIMIT 20`,
  ],
  [
    "シェア先ごとのクリック数",
    `SELECT share_target, COUNT(*) AS clicks FROM access_logs
     WHERE ts >= ${since} AND ${human} AND name = 'share' GROUP BY 1 ORDER BY clicks DESC`,
  ],
  [
    "診断結果の分布",
    `SELECT result_type, COUNT(*) AS n FROM access_logs
     WHERE ts >= ${since} AND ${human} AND name = 'quiz_complete' GROUP BY 1 ORDER BY n DESC`,
  ],
  [
    "詳細レポート（準備中）への関心",
    `SELECT COUNT(*) AS clicks, COUNT(DISTINCT visitor) AS visitors FROM access_logs
     WHERE ts >= ${since} AND ${human} AND name = 'teaser_click'`,
  ],
  [
    "bot・クローラー（OGP の取得など）",
    `SELECT substr(user_agent, 1, 60) AS ua, COUNT(*) AS n FROM access_logs
     WHERE ts >= ${since} AND is_bot = 1 GROUP BY 1 ORDER BY n DESC LIMIT 10`,
  ],
];

for (const [title, sql] of queries) {
  console.log(`\n■ ${title}`);
  const out = execFileSync(
    "pnpm",
    ["exec", "wrangler", "d1", "execute", "koigata", target, "--json", "--command", sql],
    { encoding: "utf8" },
  );
  console.table(JSON.parse(out)[0]?.results ?? []);
}
