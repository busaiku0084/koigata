// 恋愛タイプの定義。4 つの軸の組み合わせで 16 タイプになる（軸の根拠は ADR 0008）
//   approach:    A = 自分から動く   / P = 様子を見る
//   temperature: H = 燃え上がる     / C = じっくり温める
//   distance:    D = いつも一緒     / I = ひとりの時間も大事
//   expression:  V = 言葉で伝える   / B = 行動で示す
// 相性のいい相手は「動き方と温度が逆、距離感と伝え方が同じ」タイプ（テストで確かめている）

export type Axis = "approach" | "temperature" | "distance" | "expression";
export type Pole = "A" | "P" | "H" | "C" | "D" | "I" | "V" | "B";
export type TypeCode = `${"A" | "P"}${"H" | "C"}${"D" | "I"}${"V" | "B"}`;

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
  AHDV: {
    code: "AHDV",
    slug: "himawari",
    name: "ひまわり型",
    catchphrase: "「好き」を毎日まっすぐ届ける太陽",
    description:
      "好きになったら一直線。気持ちを隠さず言葉にして、毎日でも会いたいタイプ。あなたの明るさは相手の不安を吹き飛ばします。",
    strengths: ["気持ちを素直に言葉にできる", "一緒にいるだけで場が明るくなる"],
    cautions: ["返信が遅いと不安になりがち", "相手のペースも大事にして"],
    bestMatch: "PCDV",
    luckyAction: "朝いちばんに「おはよう」を送る",
    color: "#F0A202",
  },
  AHDB: {
    code: "AHDB",
    slug: "koinu",
    name: "子犬型",
    catchphrase: "全身で好きを表す、まっすぐな甘えん坊",
    description:
      "言葉より先に体が動くタイプ。会いたくなったらすぐ会いに行き、しっぽを振るように好意があふれます。その素直さが最大の魅力です。",
    strengths: ["行動力で距離を一気に縮められる", "うれしい気持ちが全部顔に出る"],
    cautions: ["かまってもらえないとしょんぼりしがち", "たまには言葉でも気持ちを伝えて"],
    bestMatch: "PCDB",
    luckyAction: "待ち合わせに少し早く着いて待つ",
    color: "#C9733A",
  },
  AHIV: {
    code: "AHIV",
    slug: "nagareboshi",
    name: "流れ星型",
    catchphrase: "ときめきを言葉にして飛び込む自由人",
    description:
      "ときめいた瞬間に気持ちを伝えられる行動派。でも自分の世界も大切にしたい。刺激と自由のバランスが取れた恋で一番輝きます。",
    strengths: ["出会いのチャンスを逃さない", "相手を縛らず、自分も縛られない"],
    cautions: ["熱が冷めるのも早いと思われがち", "大事な約束はちゃんと守って"],
    bestMatch: "PCIV",
    luckyAction: "行ったことのないお店にふたりで行く",
    color: "#7C5CFF",
  },
  AHIB: {
    code: "AHIB",
    slug: "hanabi",
    name: "花火型",
    catchphrase: "一瞬で燃え上がり、行動で驚かせる",
    description:
      "思い立ったらすぐ実行するサプライズの達人。言葉より体験で愛を伝えるタイプです。ひとりの時間も楽しめるので、会うたびに新鮮です。",
    strengths: ["デートを特別な思い出にできる", "相手を楽しませる企画力がある"],
    cautions: ["気分の波が大きく見られがち", "何気ない日常も大切にして"],
    bestMatch: "PCIB",
    luckyAction: "ふたりで小さな旅を計画する",
    color: "#E5484D",
  },
  ACDV: {
    code: "ACDV",
    slug: "toudai",
    name: "灯台型",
    catchphrase: "やさしい言葉で照らして、そっと寄り添う",
    description:
      "自分から誘えるのに、押しつけない穏やかさがあるタイプ。迷ったときに声をかけてくれる、帰ってきたくなる存在です。",
    strengths: ["相手を安心させる言葉を選べる", "長くつきあうほど魅力が増す"],
    cautions: ["聞き役に回りすぎて疲れることも", "たまには自分のわがままも言って"],
    bestMatch: "PHDV",
    luckyAction: "相手のがんばりを言葉でほめる",
    color: "#2BB3A3",
  },
  ACDB: {
    code: "ACDB",
    slug: "hidamari",
    name: "陽だまり型",
    catchphrase: "さりげなく尽くして、まるごと包みこむ",
    description:
      "自分から誘い、相手のために動くのが好きなタイプ。言葉は控えめでも、ごはんや送り迎えなど行動で愛情が伝わります。",
    strengths: ["相手の困りごとにすぐ気づいて動ける", "一緒にいると生活が楽になる"],
    cautions: ["尽くしすぎて見返りを求めがち", "「してほしいこと」も伝えてみて"],
    bestMatch: "PHDB",
    luckyAction: "ふたりで同じ料理を作る",
    color: "#8DB33A",
  },
  ACIV: {
    code: "ACIV",
    slug: "aibou",
    name: "相棒型",
    catchphrase: "何でも話せる、対等なパートナー",
    description:
      "恋人とは何でも話し合える相棒でいたいタイプ。お互いの夢を言葉で応援しあえる、自立した大人の関係が似合います。",
    strengths: ["ケンカしても話し合いで解決できる", "相手の挑戦を素直に応援できる"],
    cautions: ["正論で話しすぎてしまうことも", "ロマンチックな演出も時には大事"],
    bestMatch: "PHIV",
    luckyAction: "ふたりの「やりたいことリスト」を作る",
    color: "#3B82F6",
  },
  ACIB: {
    code: "ACIB",
    slug: "rashinban",
    name: "羅針盤型",
    catchphrase: "迷わず進む、頼れる行動派",
    description:
      "自分から道を示し、行動で相手を引っぱるタイプ。べったりしなくても、いざというとき必ず力になってくれる頼もしさがあります。",
    strengths: ["決断が早く、デートの段取りが上手", "困ったときに一番頼りになる"],
    cautions: ["気持ちを言葉にするのが後回しに", "相手の意見も聞いてから決めて"],
    bestMatch: "PHIB",
    luckyAction: "相手の行きたい場所を調べて連れていく",
    color: "#1F6F8B",
  },
  PHDV: {
    code: "PHDV",
    slug: "gekkabijin",
    name: "月下美人型",
    catchphrase: "静かに咲いて、心を許すと深く愛する",
    description:
      "最初は控えめでも、胸の中には熱い想いを秘めているタイプ。心を開いた相手には、驚くほど深い愛情を言葉で伝えます。",
    strengths: ["一途で、愛情がとても深い", "相手の小さな変化に気づける"],
    cautions: ["想いを溜めこみすぎないように", "嫉妬は早めに言葉にすると楽になる"],
    bestMatch: "ACDV",
    luckyAction: "伝えられなかった「ありがとう」を伝える",
    color: "#E0559B",
  },
  PHDB: {
    code: "PHDB",
    slug: "shirousagi",
    name: "白うさぎ型",
    catchphrase: "そっとそばにいて、離れない一途さ",
    description:
      "自分からはなかなか動けないけれど、好きな人のそばにはずっといたいタイプ。言葉にしなくても、ふるまいから一途さがにじみます。",
    strengths: ["一度好きになったら気持ちが揺るがない", "相手のためにこっそり努力できる"],
    cautions: ["さみしさをがまんしすぎないで", "好きな気持ちはときどき言葉に"],
    bestMatch: "ACDB",
    luckyAction: "相手の好きなお菓子をさりげなく渡す",
    color: "#B07CC6",
  },
  PHIV: {
    code: "PHIV",
    slug: "kuroneko",
    name: "黒猫型",
    catchphrase: "気まぐれに見えて、実はいちばん一途",
    description:
      "そっけなく見えるのに、好きな人のことはずっと考えているタイプ。距離感を大事にしながら、ここぞというときに甘い言葉をくれます。",
    strengths: ["ミステリアスな魅力がある", "本気の恋はとことん大切にする"],
    cautions: ["素直になれず誤解されやすい", "好意はわかりやすく示してみて"],
    bestMatch: "ACIV",
    luckyAction: "いつもより少しだけ長く目を合わせる",
    color: "#4B4B6B",
  },
  PHIB: {
    code: "PHIB",
    slug: "ippikiookami",
    name: "一匹狼型",
    catchphrase: "多くは語らず、本気のときは行動で守る",
    description:
      "群れずに自分の道を行くタイプ。恋にはなかなか動かないけれど、本気になった相手は言葉より行動で全力で守ります。",
    strengths: ["口先だけでなく、行動で信頼を得られる", "ひとりでも自分を保てる強さ"],
    cautions: ["何を考えているか伝わりにくい", "うれしいときは顔に出してみて"],
    bestMatch: "ACIB",
    luckyAction: "相手の話を最後まで聞いてうなずく",
    color: "#7A6A53",
  },
  PCDV: {
    code: "PCDV",
    slug: "tegami",
    name: "手紙型",
    catchphrase: "ゆっくり言葉を重ねて、心を近づける",
    description:
      "時間をかけて距離を縮める慎重派。丁寧なメッセージや会話を重ねて、気づけば誰より相手を理解しているタイプです。",
    strengths: ["言葉選びがやさしく、丁寧", "記念日や約束を大切にする"],
    cautions: ["最初の一歩に時間がかかりすぎることも", "考えすぎる前に会いに行って"],
    bestMatch: "AHDV",
    luckyAction: "短くてもいいので手書きのメモを渡す",
    color: "#9C6644",
  },
  PCDB: {
    code: "PCDB",
    slug: "kotatsu",
    name: "こたつ型",
    catchphrase: "ゆっくり温まって、離れられなくなる",
    description:
      "時間をかけて距離を縮める慎重派。一度心を許したら、一緒にいるのが当たり前になるような、温かい居場所を作れます。",
    strengths: ["そばにいるだけで落ち着く存在", "相手の生活に自然になじめる"],
    cautions: ["マンネリには小さなサプライズを", "気持ちはたまに言葉にして"],
    bestMatch: "AHDB",
    luckyAction: "おうちでふたりで同じ映画を観る",
    color: "#E07B39",
  },
  PCIV: {
    code: "PCIV",
    slug: "toshokan",
    name: "図書館型",
    catchphrase: "静かで知的、言葉を大切にする人",
    description:
      "恋に振り回されず、自分のペースを守れるタイプ。会話を大切にし、少ない言葉でも深く通じ合える関係を育てます。",
    strengths: ["感情的にならず冷静に話し合える", "相手の話をよく覚えている"],
    cautions: ["理屈っぽく見られることも", "考えるより先に気持ちを伝えてみて"],
    bestMatch: "AHIV",
    luckyAction: "おすすめの本や音楽を教え合う",
    color: "#5B6CC2",
  },
  PCIB: {
    code: "PCIB",
    slug: "mizuumi",
    name: "森の湖型",
    catchphrase: "静かで深い、揺るがない信頼",
    description:
      "恋に振り回されず、自分のペースを守れるタイプ。言葉は少なくても、約束を守る行動で信頼を積み重ねていきます。",
    strengths: ["相手を信じて待つことができる", "どんなときも態度が変わらない"],
    cautions: ["気持ちが伝わっていないことがある", "「好き」はたまに口に出して"],
    bestMatch: "AHIB",
    luckyAction: "季節を感じる場所をふたりで散歩する",
    color: "#2F8F5B",
  },
};

export const ALL_TYPES: LoveType[] = Object.values(LOVE_TYPES);

export function findTypeBySlug(slug: string): LoveType | undefined {
  return ALL_TYPES.find((t) => t.slug === slug);
}
