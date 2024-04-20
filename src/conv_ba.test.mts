import { describe, expect, test } from "bun:test";
import { BAtohex, hextoBA } from "./conv_ba.mts";

test("BAtohex", () => {
  expect(BAtohex([97, 97, 97])).toBe("616161");
});

test("hextoBA", () => {
  expect(hextoBA("616161")).toEqual([97, 97, 97]);
});
