// シェア用の画像を作って public/ に書き出す。タイプの文言や色を変えたら実行してコミットする
//   public/og/<slug>.png    1200x630  X・LINE などのリンクカード（OGP）
//   public/story/<slug>.png 1080x1920 Instagram のストーリーズ用
//   public/og/top.png       1200x630  トップなどの共通 OGP
// 使い方: pnpm gen:images
import { mkdirSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { QUESTIONS } from "../src/content/questions.ts";
import { ALL_TYPES, LOVE_TYPES, type LoveType } from "../src/content/types.ts";

const FONT_FILE = "assets/fonts/NotoSansJP-Bold.otf";
const FONT = "Noto Sans JP";
const SITE_NAME = "恋型診断";

function escape(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 日本語は単語の区切りが無いので文字数で折り返す。句読点が行頭に来ないようにだけ調整する
function wrap(text: string, perLine: number): string[] {
  const lines: string[] = [];
  let rest = text;
  while (rest.length > perLine) {
    let cut = perLine;
    if (/^[、。！？」）ー]/.test(rest.slice(cut))) cut += 1;
    lines.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest) lines.push(rest);
  return lines;
}

function textLines(
  lines: string[],
  opts: { x: number; y: number; size: number; lineHeight: number; fill: string },
): string {
  return lines
    .map(
      (line, i) =>
        `<text x="${opts.x}" y="${opts.y + i * opts.lineHeight}" font-size="${opts.size}" fill="${opts.fill}" text-anchor="middle" font-family="${FONT}">${escape(line)}</text>`,
    )
    .join("");
}

function ogSvg(type: LoveType): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${type.color}"/>
  <circle cx="1120" cy="80" r="180" fill="#fff" opacity="0.12"/>
  <circle cx="80" cy="580" r="140" fill="#fff" opacity="0.12"/>
  <rect x="60" y="60" width="1080" height="510" rx="40" fill="#fff"/>
  ${textLines(["あなたの恋愛タイプは"], { x: 600, y: 170, size: 40, lineHeight: 0, fill: "#7a6f7d" })}
  ${textLines([type.name], { x: 600, y: 300, size: 120, lineHeight: 0, fill: type.color })}
  ${textLines(wrap(type.catchphrase, 22), { x: 600, y: 390, size: 42, lineHeight: 58, fill: "#2b2230" })}
  ${textLines([`#${SITE_NAME}`], { x: 600, y: 530, size: 32, lineHeight: 0, fill: type.color })}
</svg>`;
}

function storySvg(type: LoveType): string {
  // 上から順に積む。キャッチコピーと説明の行数で下の要素の位置が変わる
  const catchphrase = wrap(type.catchphrase, 19);
  const description = wrap(type.description, 18);
  const descriptionY = 700 + catchphrase.length * 64 + 60;
  const strengthsY = descriptionY + description.length * 64 + 50;
  const extrasY = strengthsY + type.strengths.length * 60 + 70;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920">
  <rect width="1080" height="1920" fill="${type.color}"/>
  <circle cx="980" cy="200" r="260" fill="#fff" opacity="0.12"/>
  <circle cx="100" cy="1760" r="220" fill="#fff" opacity="0.12"/>
  <rect x="80" y="260" width="920" height="1400" rx="56" fill="#fff"/>
  ${textLines([SITE_NAME], { x: 540, y: 200, size: 56, lineHeight: 0, fill: "#fff" })}
  ${textLines(["あなたの恋愛タイプは"], { x: 540, y: 420, size: 48, lineHeight: 0, fill: "#7a6f7d" })}
  ${textLines([type.name], { x: 540, y: 560, size: 140, lineHeight: 0, fill: type.color })}
  ${textLines(catchphrase, { x: 540, y: 700, size: 46, lineHeight: 64, fill: "#2b2230" })}
  ${textLines(description, { x: 540, y: descriptionY, size: 40, lineHeight: 64, fill: "#4a4050" })}
  ${textLines(
    type.strengths.map((s) => `◎ ${s}`),
    { x: 540, y: strengthsY, size: 36, lineHeight: 60, fill: type.color },
  )}
  ${textLines(["相性のいいタイプ"], { x: 540, y: extrasY, size: 32, lineHeight: 0, fill: "#7a6f7d" })}
  ${textLines([LOVE_TYPES[type.bestMatch].name], { x: 540, y: extrasY + 64, size: 48, lineHeight: 0, fill: "#2b2230" })}
  ${textLines(["ラッキーアクション"], { x: 540, y: extrasY + 160, size: 32, lineHeight: 0, fill: "#7a6f7d" })}
  ${textLines(wrap(type.luckyAction, 20), { x: 540, y: extrasY + 220, size: 40, lineHeight: 56, fill: "#2b2230" })}
  ${textLines(["あなたも診断してみてね"], { x: 540, y: 1780, size: 48, lineHeight: 0, fill: "#fff" })}
</svg>`;
}

function topSvg(): string {
  const colors = ALL_TYPES.map((t) => t.color);
  const dots = colors
    .map((c, i) => `<circle cx="${270 + i * 94}" cy="470" r="30" fill="${c}"/>`)
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fff8f6"/>
  ${textLines(["1 分でわかる、あなたの恋愛タイプ"], { x: 600, y: 180, size: 44, lineHeight: 0, fill: "#7a6f7d" })}
  ${textLines([SITE_NAME], { x: 600, y: 330, size: 140, lineHeight: 0, fill: "#e0559b" })}
  ${dots}
  ${textLines([`登録不要・${QUESTIONS.length} 問・全 8 タイプ`], { x: 600, y: 570, size: 36, lineHeight: 0, fill: "#2b2230" })}
</svg>`;
}

function render(svg: string, path: string): void {
  const png = new Resvg(svg, {
    font: { fontFiles: [FONT_FILE], loadSystemFonts: false, defaultFontFamily: FONT },
  })
    .render()
    .asPng();
  writeFileSync(path, png);
  console.log(`wrote ${path}`);
}

mkdirSync("public/og", { recursive: true });
mkdirSync("public/story", { recursive: true });
render(topSvg(), "public/og/top.png");
for (const type of ALL_TYPES) {
  render(ogSvg(type), `public/og/${type.slug}.png`);
  render(storySvg(type), `public/story/${type.slug}.png`);
}
