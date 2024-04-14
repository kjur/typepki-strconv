import { describe, expect, test } from "bun:test";

import { ArrayBuffertohex, hextoArrayBuffer } from "./index.mts";

const buf = new ArrayBuffer(3);
const ui8a = new Uint8Array(buf);
ui8a[0] = 1;
ui8a[2] = 1;

test("hextoArrayBuffer", () => {
  expect(hextoArrayBuffer("010001")).toStrictEqual(buf);
});

test("ArrayBuffertohex", () => {
  expect(ArrayBuffertohex(buf)).toBe("010001");
});
