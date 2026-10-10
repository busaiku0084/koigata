import type { Axis, Pole } from "./types.ts";

// 2 択の質問。1 つの軸につき 3 問（奇数）なので、軸ごとの結果は必ずどちらかに決まる
// 軸が順に回るように並べる（approach → temperature → distance → expression）
export type Question = {
  id: string;
  axis: Axis;
  text: string;
  choices: [{ label: string; pole: Pole }, { label: string; pole: Pole }];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    axis: "approach",
    text: "気になる人ができたら？",
    choices: [
      { label: "自分から話しかけにいく", pole: "A" },
      { label: "相手から来てくれるのを待つ", pole: "P" },
    ],
  },
  {
    id: "q2",
    axis: "temperature",
    text: "恋に落ちるのは？",
    choices: [
      { label: "ひとめぼれが多い", pole: "H" },
      { label: "話すうちにだんだん好きになる", pole: "C" },
    ],
  },
  {
    id: "q3",
    axis: "distance",
    text: "理想の連絡ペースは？",
    choices: [
      { label: "毎日やりとりしたい", pole: "D" },
      { label: "用があるときだけで十分", pole: "I" },
    ],
  },
  {
    id: "q4",
    axis: "expression",
    text: "好きな気持ちを伝えるなら？",
    choices: [
      { label: "「好き」とはっきり言葉にする", pole: "V" },
      { label: "態度や行動でわかってもらう", pole: "B" },
    ],
  },
  {
    id: "q5",
    axis: "approach",
    text: "初デートの行き先は？",
    choices: [
      { label: "自分でプランを決めたい", pole: "A" },
      { label: "相手の行きたい場所に合わせたい", pole: "P" },
    ],
  },
  {
    id: "q6",
    axis: "temperature",
    text: "ケンカしたときは？",
    choices: [
      { label: "その場で気持ちをぶつける", pole: "H" },
      { label: "落ち着いてから話す", pole: "C" },
    ],
  },
  {
    id: "q7",
    axis: "distance",
    text: "休日の過ごし方は？",
    choices: [
      { label: "できるだけ恋人と過ごしたい", pole: "D" },
      { label: "ひとりの時間もほしい", pole: "I" },
    ],
  },
  {
    id: "q8",
    axis: "expression",
    text: "恋人が落ち込んでいたら？",
    choices: [
      { label: "話を聞いて、励ましの言葉をかける", pole: "V" },
      { label: "好きな食べ物を持って会いに行く", pole: "B" },
    ],
  },
  {
    id: "q9",
    axis: "approach",
    text: "告白するなら？",
    choices: [
      { label: "自分から伝えたい", pole: "A" },
      { label: "できれば相手から言ってほしい", pole: "P" },
    ],
  },
  {
    id: "q10",
    axis: "temperature",
    text: "記念日のお祝いは？",
    choices: [
      { label: "サプライズで盛大に", pole: "H" },
      { label: "いつもどおり穏やかに", pole: "C" },
    ],
  },
  {
    id: "q11",
    axis: "distance",
    text: "恋人が友達と旅行に行くと言ったら？",
    choices: [
      { label: "ちょっとさみしい", pole: "D" },
      { label: "楽しんできてね！", pole: "I" },
    ],
  },
  {
    id: "q12",
    axis: "expression",
    text: "恋人にしてもらってうれしいのは？",
    choices: [
      { label: "「大好きだよ」のひとこと", pole: "V" },
      { label: "何も言わずにぎゅっとされる", pole: "B" },
    ],
  },
];
