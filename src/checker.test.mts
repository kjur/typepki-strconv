import { describe, expect, test } from "bun:test";

import { isBase64, isBase64URL, ishex } from "./index.mts";

test("ishex", () => {
  expect(ishex("0123af")).toBe(true);
  expect(ishex("123af")).toBe(false);
  expect(ishex("0123az")).toBe(false);
});

test("isBase64", () => {
  expect(isBase64("YWE=")).toBe(true);
  expect(isBase64("YW_=")).toBe(false);
  expect(isBase64("YWE")).toBe(false);
});

test("isBase64URL", () => {
  expect(isBase64URL("YWE")).toBe(true);
  expect(isBase64URL("YW-")).toBe(true);
  expect(isBase64URL("YW+")).toBe(false);
});
