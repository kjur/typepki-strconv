import { describe, expect, test } from "bun:test";

import {
  Dictionary,
  VERSION,
  aryval,
  b64tob64u,
  b64tohex,
  b64utob64,
  b64utohex,
  binstrtobitstr,
  hextob64,
  hextob64u,
  hextorstr,
  hextoutf8,
  inttobitstr,
  namearraytobinstr,
  rstrtob64,
  rstrtohex,
  strpad,
} from "./index.mts";

// ==== VERSION ===========================================
test("VERSION", () => {
  expect(VERSION.substr(0, 16)).toBe("typepki-strconv ");
});

// ==== hex / base64 ======================================
test("b64tohex", () => {
  expect(b64tohex("YWFh")).toBe("616161");
});

test("hextob64", () => {
  expect(hextob64("616161")).toBe("YWFh");
});

// ==== hex / base64u =====================================
test("b64utohex", () => {
  expect(b64utohex("YWFh")).toBe("616161");
});

test("hextob64u", () => {
  expect(hextob64u("616161")).toBe("YWFh");
});

// ==== base64 / base64u ==================================

test("b64tob64u", () => {
  expect(b64tob64u("ab+c3f/==")).toBe("ab-c3f_");
  expect(b64utob64("ab-c3f_")).toBe("ab+c3f/="); // ?? いいの？
});

test("binstrtobitstr", () => {
  expect(binstrtobitstr("101")).toBe("05a0");
});

test("inttobitstr", () => {
  expect(inttobitstr(0b11001)).toBe("03c8");
  expect(inttobitstr(0b101)).toBe("05a0");
  expect(inttobitstr(0b101000001)).toBe("07a080");
});

test("strpad", () => {
  expect(strpad("1234", 10, "0")).toBe("0000001234");
  expect(strpad("1234", 10, " ")).toBe("      1234");
  expect(strpad("1234", 10)).toBe("0000001234");
});

test("namearraytobinstr", () => {
  const db: Dictionary<number> = { a: 0, b: 3, c: 8, d: 9, e: 17, f: 19 };
  expect(namearraytobinstr(["a", "c", "d"], db)).toBe("1000000011");
  expect(namearraytobinstr(["c", "b"], db)).toBe("000100001");
});

test("aryval", () => {
  const p = {
    fruit: "apple",
    info: [{ toy: 4 }, { pen: 6 }],
  };
  expect(aryval(p, "fruit")).toBe("apple");
  expect(aryval(p, "info")).toEqual([{ toy: 4 }, { pen: 6 }]);
  expect(aryval(p, "info.1")).toEqual({ pen: 6 });
  expect(aryval(p, "info.1.pen")).toBe(6);
  expect(aryval(p, "money.amount")).toBe(undefined);
  expect(aryval(p, "money.amount", null)).toBe(null);
});

test("hextorstr", () => {
  expect(hextorstr("616161")).toBe("aaa");
  expect(hextorstr("000000")).toBe("\x00\x00\x00");
});

test("rstrtohex", () => {
  expect(rstrtohex("aaa")).toBe("616161");
  expect(rstrtohex("\x00\x00\x00")).toBe("000000");
});

test("rstrtob64", () => {
  expect(rstrtob64("aaa")).toBe("YWFh");
});

// ==== hex / utf8 =====================================
test("hextoutf8", () => {
  expect(hextoutf8("616161")).toBe("aaa");
  expect(hextoutf8("616161e38182e38184e38186")).toBe("aaaあいう");
  expect(hextoutf8("e381bbe38192")).toBe("ほげ");
  expect(() => {
    hextoutf8("6161ff");
  }).toThrow(/malformed hexadecimal UTF-8/);
});
