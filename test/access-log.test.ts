import assert from "node:assert/strict";
import { test } from "node:test";
import { deviceOf, isBot, referrerHostOf } from "../src/lib/access-log.ts";

const IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

test("端末の種類を UA から判定する", () => {
  assert.equal(deviceOf(IPHONE), "mobile");
  assert.equal(deviceOf("Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)"), "tablet");
  assert.equal(deviceOf("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"), "desktop");
});

test("OGP を取りに来るクローラーは bot として記録する", () => {
  assert.equal(isBot("Twitterbot/1.0"), true);
  assert.equal(isBot("facebookexternalhit/1.1"), true);
  assert.equal(isBot(IPHONE), false);
});

test("参照元は外部サイトのホストだけを残す", () => {
  assert.equal(referrerHostOf("https://t.co/abc", "koigata.example"), "t.co");
  assert.equal(referrerHostOf("https://koigata.example/quiz", "koigata.example"), null);
  assert.equal(referrerHostOf("not a url", "koigata.example"), null);
  assert.equal(referrerHostOf(null, "koigata.example"), null);
});
