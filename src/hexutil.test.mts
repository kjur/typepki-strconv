import { describe, expect, test } from "bun:test";
import { hexpad } from "./index.mts";

test("hexpad", () => {
  expect(hexpad("1234")).toBe("1234");
  expect(hexpad("234")).toBe("0234");
});
