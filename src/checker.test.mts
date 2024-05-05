import { describe, expect, test } from "bun:test";

import { ishex } from "./index.mts";

test("ishex", () => {
  expect(ishex("0123af")).toBe(true);
  expect(ishex("123af")).toBe(false);
  expect(ishex("0123az")).toBe(false);
});
