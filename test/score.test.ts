import assert from "node:assert/strict";
import { test } from "node:test";
import { QUESTIONS } from "../src/content/questions.ts";
import { ALL_TYPES, LOVE_TYPES, type TypeCode } from "../src/content/types.ts";
import { scoreAnswers } from "../src/lib/score.ts";

test("すべて 1 つ目の選択肢なら AHD", () => {
  assert.equal(scoreAnswers(QUESTIONS.map(() => 0)), "AHD");
});

test("すべて 2 つ目の選択肢なら PCI", () => {
  assert.equal(scoreAnswers(QUESTIONS.map(() => 1)), "PCI");
});

test("回答の数が質問の数と違えばエラー", () => {
  assert.throws(() => scoreAnswers([0, 1]));
});

test("全パターンの回答で 8 タイプすべてに到達できる", () => {
  const reached = new Set<TypeCode>();
  for (let bits = 0; bits < 2 ** QUESTIONS.length; bits++) {
    reached.add(scoreAnswers(QUESTIONS.map((_, i) => (bits >> i) & 1)));
  }
  assert.equal(reached.size, 8);
});

test("各軸の質問は奇数個（同点にならない）", () => {
  for (const axis of ["approach", "temperature", "distance"]) {
    assert.equal(QUESTIONS.filter((q) => q.axis === axis).length % 2, 1);
  }
});

test("slug は重複せず、相性の相手はお互いを指す", () => {
  assert.equal(new Set(ALL_TYPES.map((t) => t.slug)).size, ALL_TYPES.length);
  for (const t of ALL_TYPES) assert.equal(LOVE_TYPES[t.bestMatch].bestMatch, t.code);
});
