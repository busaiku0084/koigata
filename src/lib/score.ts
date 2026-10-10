import { QUESTIONS } from "../content/questions.ts";
import type { Pole, TypeCode } from "../content/types.ts";

// answers[i] は QUESTIONS[i] で選んだ選択肢の番号（0 か 1）
export function scoreAnswers(answers: number[]): TypeCode {
  if (answers.length !== QUESTIONS.length) {
    throw new Error(`answers must have ${QUESTIONS.length} items`);
  }
  const count: Record<Pole, number> = { A: 0, P: 0, H: 0, C: 0, D: 0, I: 0 };
  QUESTIONS.forEach((q, i) => {
    const choice = q.choices[answers[i] === 1 ? 1 : 0];
    count[choice.pole] += 1;
  });
  const approach = count.A > count.P ? "A" : "P";
  const temperature = count.H > count.C ? "H" : "C";
  const distance = count.D > count.I ? "D" : "I";
  return `${approach}${temperature}${distance}`;
}
