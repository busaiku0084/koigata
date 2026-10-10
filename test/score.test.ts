import assert from "node:assert/strict";
import { test } from "node:test";
import { QUESTIONS } from "../src/content/questions.ts";
import { ALL_TYPES, LOVE_TYPES, type TypeCode } from "../src/content/types.ts";
import { scoreAnswers } from "../src/lib/score.ts";

test("すべて 1 つ目の選択肢なら AHD", () => {
  assert.equal(scoreAnswers(QUESTIONS.map(() => 0)), "AHDV");
});

test("すべて 2 つ目の選択肢なら PCI", () => {
  assert.equal(scoreAnswers(QUESTIONS.map(() => 1)), "PCIB");
});

test("回答の数が質問の数と違えばエラー", () => {
  assert.throws(() => scoreAnswers([0, 1]));
});

test("全パターンの回答で 16 タイプすべてに到達できる", () => {
  const reached = new Set<TypeCode>();
  for (let bits = 0; bits < 2 ** QUESTIONS.length; bits++) {
    reached.add(scoreAnswers(QUESTIONS.map((_, i) => (bits >> i) & 1)));
  }
  assert.equal(reached.size, 16);
  assert.equal(ALL_TYPES.length, 16);
});

test("各軸の質問は奇数個（同点にならない）", () => {
  for (const axis of ["approach", "temperature", "distance", "expression"]) {
    assert.equal(QUESTIONS.filter((q) => q.axis === axis).length % 2, 1);
  }
});

test("slug は重複せず、相性の相手はお互いを指す", () => {
  assert.equal(new Set(ALL_TYPES.map((t) => t.slug)).size, ALL_TYPES.length);
  for (const t of ALL_TYPES) assert.equal(LOVE_TYPES[t.bestMatch].bestMatch, t.code);
});

test("相性の相手は、動き方と温度が逆で、距離感と伝え方が同じ", () => {
  for (const t of ALL_TYPES) {
    const [a, h, d, v] = t.code;
    const flip: Record<string, string> = { A: "P", P: "A", H: "C", C: "H" };
    assert.equal(t.bestMatch, `${flip[a ?? ""]}${flip[h ?? ""]}${d}${v}`, t.name);
  }
});

test("コードのキーと code が一致し、名前と色は重複しない", () => {
  for (const [key, t] of Object.entries(LOVE_TYPES)) assert.equal(key, t.code);
  assert.equal(new Set(ALL_TYPES.map((t) => t.name)).size, ALL_TYPES.length);
  assert.equal(new Set(ALL_TYPES.map((t) => t.color.toLowerCase())).size, ALL_TYPES.length);
});
