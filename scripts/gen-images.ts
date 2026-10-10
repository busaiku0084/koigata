// シェア用の画像を作って public/ に書き出す。タイプの文言や色を変えたら実行してコミットする
//   public/og/<slug>.png    1200x630  X・LINE などのリンクカード（OGP）
//   public/story/<slug>.png 1080x1920 Instagram のストーリーズ用
//   public/og/top.png       1200x630  トップなどの共通 OGP
//   public/favicon.svg・favicon.ico・apple-touch-icon.png  ファビコン
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

// ピンクの角丸の上に白いハート。小さく表示されるので文字は入れない
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#e0559b"/>
  <path d="M32 52 C14 39 8 30 8 22 C8 14.5 13.5 9 20.5 9 C25.5 9 29.5 12 32 16.5 C34.5 12 38.5 9 43.5 9 C50.5 9 56 14.5 56 22 C56 30 50 39 32 52 Z" fill="#fff"/>
</svg>
`;

function toPng(svg: string, width?: number): Buffer {
  return new Resvg(svg, {
    font: { fontFiles: [FONT_FILE], loadSystemFonts: false, defaultFontFamily: FONT },
    ...(width ? { fitTo: { mode: "width" as const, value: width } } : {}),
  })
    .render()
    .asPng();
}

function render(svg: string, path: string): void {
  writeFileSync(path, toPng(svg));
  console.log(`wrote ${path}`);
}

// ICO の中に PNG をそのまま入れる形式（今のブラウザはすべて読める）
function toIco(png: Buffer, size: number): Buffer {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // 予約
  header.writeUInt16LE(1, 2); // 種類: アイコン
  header.writeUInt16LE(1, 4); // 画像の数
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // カラープレーン
  header.writeUInt16LE(32, 12); // 色深度
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // 画像データの位置
  return Buffer.concat([header, png]);
}

function renderFavicons(): void {
  writeFileSync("public/favicon.svg", FAVICON_SVG);
  writeFileSync("public/favicon.ico", toIco(toPng(FAVICON_SVG, 32), 32));
  // iOS のホーム画面用。角丸は iOS が付けるので、背景を四角で塗りつぶす
  writeFileSync(
    "public/apple-touch-icon.png",
    toPng(FAVICON_SVG.replace('rx="14"', 'rx="0"'), 180),
  );
  console.log("wrote public/favicon.svg, favicon.ico, apple-touch-icon.png");
}

mkdirSync("public/og", { recursive: true });
mkdirSync("public/story", { recursive: true });
renderFavicons();
render(topSvg(), "public/og/top.png");
for (const type of ALL_TYPES) {
  render(ogSvg(type), `public/og/${type.slug}.png`);
  render(storySvg(type), `public/story/${type.slug}.png`);
}
