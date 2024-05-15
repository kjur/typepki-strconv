import { describe, expect, test } from "bun:test";

import { encodeURIComponentAll, hextouricmp, uricmptohex, hextoutf8 } from "./index.mts";

test("uricmptohex", () => {
  expect(uricmptohex("%67%68")).toBe("6768");
});

test("hextouricmp", () => {
  expect(hextouricmp("6768")).toBe("%67%68");
});

test("encodeURIComponentAll", () => {
  expect(encodeURIComponentAll("test")).toBe("%74%65%73%74");
  expect(encodeURIComponentAll("aあa")).toBe("%61%E3%81%82%61");
});
