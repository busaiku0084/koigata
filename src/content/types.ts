// 恋愛タイプの定義。3 つの軸の組み合わせで 8 タイプになる
//   approach:    A = 自分から動く   / P = 様子を見る
//   temperature: H = 燃え上がる     / C = じっくり温める
//   distance:    D = いつも一緒     / I = ひとりの時間も大事

export type Axis = "approach" | "temperature" | "distance";
export type Pole = "A" | "P" | "H" | "C" | "D" | "I";
export type TypeCode = `${"A" | "P"}${"H" | "C"}${"D" | "I"}`;

export type LoveType = {
  code: TypeCode;
  slug: string;
  name: string;
  catchphrase: string;
  description: string;
  strengths: string[];
  cautions: string[];
  bestMatch: TypeCode;
  luckyAction: string;
  color: string; // 画像とページのアクセントカラー
};

export const LOVE_TYPES: Record<TypeCode, LoveType> = {
  AHD: {
    code: "AHD",
    slug: "himawari",
    name: "ひまわり型",
    catchphrase: "好きな人だけを見つめる、まっすぐな太陽",
    description:
      "好きになったら一直線。気持ちを隠さず伝え、毎日でも会いたいタイプ。あなたの明るさは相手の不安を吹き飛ばします。",
    strengths: ["気持ちを言葉と行動で伝えられる", "一緒にいるだけで場が明るくなる"],
    cautions: ["返信が遅いと不安になりがち", "相手のペースを置いていかないように"],
    bestMatch: "PCD",
    luckyAction: "朝いちばんに「おはよう」を送る",
    color: "#F5A524",
  },
  AHI: {
    code: "AHI",
    slug: "nagareboshi",
    name: "流れ星型",
    catchphrase: "一瞬で恋に落ちる、自由なときめきハンター",
    description:
      "ときめいた瞬間に動ける行動派。でも自分の世界も大切にしたい。刺激と自由のバランスが取れた恋で一番輝きます。",
    strengths: ["出会いのチャンスを逃さない", "相手を縛らず、自分も縛られない"],
    cautions: ["熱が冷めるのも早いと思われがち", "大事な約束はちゃんと守って"],
    bestMatch: "PCI",
    luckyAction: "行ったことのないお店にふたりで行く",
    color: "#7C5CFF",
  },
  ACD: {
    code: "ACD",
    slug: "toudai",
    name: "灯台型",
    catchphrase: "自分から照らして、そっと寄り添う安心感",
    description:
      "自分から誘えるのに、押しつけない穏やかさがあるタイプ。迷ったときに帰ってきたくなる、包容力のある存在です。",
    strengths: ["相手を安心させるのが上手", "長くつきあうほど魅力が増す"],
    cautions: ["尽くしすぎて疲れてしまうことも", "たまには自分のわがままも言って"],
    bestMatch: "PHD",
    luckyAction: "相手の好きなものを一緒に楽しむ",
    color: "#2BB3A3",
  },
  ACI: {
    code: "ACI",
    slug: "aibou",
    name: "相棒型",
    catchphrase: "恋人で親友、対等に並んで歩くパートナー",
    description:
      "恋人とは何でも話せる相棒でいたいタイプ。お互いの夢を応援しあえる、自立した大人の関係が似合います。",
    strengths: ["ケンカしても話し合いで解決できる", "相手の挑戦を素直に応援できる"],
    cautions: ["甘えるのが苦手で、さみしさを隠しがち", "ロマンチックな演出も時には大事"],
    bestMatch: "PHI",
    luckyAction: "ふたりの「やりたいことリスト」を作る",
    color: "#3B82F6",
  },
  PHD: {
    code: "PHD",
    slug: "gekkabijin",
    name: "月下美人型",
    catchphrase: "静かに咲いて、心を許すと深く愛する",
    description:
      "最初は控えめでも、胸の中には熱い想いを秘めているタイプ。心を開いた相手には、驚くほど深い愛情を注ぎます。",
    strengths: ["一途で、愛情がとても深い", "相手の小さな変化に気づける"],
    cautions: ["想いを溜めこみすぎないように", "嫉妬は言葉にして伝えると楽になる"],
    bestMatch: "ACD",
    luckyAction: "伝えられなかった「ありがとう」を伝える",
    color: "#E0559B",
  },
  PHI: {
    code: "PHI",
    slug: "kuroneko",
    name: "黒猫型",
    catchphrase: "気まぐれに見えて、実はいちばん一途",
    description:
      "そっけなく見えるのに、好きな人のことはずっと考えているタイプ。距離感を大事にしながら、ここぞというときに熱くなります。",
    strengths: ["ミステリアスな魅力がある", "本気の恋はとことん大切にする"],
    cautions: ["素直になれず誤解されやすい", "好意はわかりやすく示してみて"],
    bestMatch: "ACI",
    luckyAction: "いつもより少しだけ長く目を合わせる",
    color: "#4B4B6B",
  },
  PCD: {
    code: "PCD",
    slug: "kotatsu",
    name: "こたつ型",
    catchphrase: "ゆっくり温まって、離れられなくなる居心地",
    description:
      "時間をかけて距離を縮める慎重派。一度心を許したら、一緒にいるのが当たり前になるような、温かい関係を築けます。",
    strengths: ["そばにいるだけで落ち着く存在", "記念日や約束を大切にする"],
    cautions: ["最初の一歩に時間がかかりすぎることも", "マンネリには小さなサプライズを"],
    bestMatch: "AHD",
    luckyAction: "おうちでふたりで同じ映画を観る",
    color: "#E07B39",
  },
  PCI: {
    code: "PCI",
    slug: "mizuumi",
    name: "森の湖型",
    catchphrase: "静かで深い、揺るがない信頼",
    description:
      "恋に振り回されず、自分のペースを守れるタイプ。言葉は少なくても、信頼で結ばれた落ち着いた関係を育てます。",
    strengths: ["感情的にならず冷静に向き合える", "相手を信じて待つことができる"],
    cautions: ["気持ちが伝わっていないことがある", "「好き」はたまに口に出して"],
    bestMatch: "AHI",
    luckyAction: "季節を感じる場所をふたりで散歩する",
    color: "#2F8F5B",
  },
};

export const ALL_TYPES: LoveType[] = Object.values(LOVE_TYPES);

export function findTypeBySlug(slug: string): LoveType | undefined {
  return ALL_TYPES.find((t) => t.slug === slug);
}
