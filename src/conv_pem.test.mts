import { describe, expect, test } from "bun:test";

import {
  hextopem,
  pemtob64,
} from "./index.mts";

const PEM_FOO = `-----BEGIN FOO-----
YWFh
-----END FOO-----
`;
const PEM_FOO2_JUNK = `
junk text
junk text
junk text
-----BEGIN FOO FOO FOO 123-----
YWFh
-----END FOO FOO FOO 123-----
junk-text
-----BEGIN FOO FOO FOO 234-----
enp6
-----END FOO FOO FOO 234-----
junk-text
junk-text
`;

test("hextopem", () => {
  expect(hextopem("616161", "FOO")).toBe(PEM_FOO.replace(/\n/g, "\r\n"));
});

test("pemtob64", () => {
  expect(pemtob64(PEM_FOO)).toBe("YWFh");
  expect(pemtob64(PEM_FOO2_JUNK)).toBe("YWFh");
  expect(pemtob64(PEM_FOO2_JUNK, "FOO FOO FOO 123")).toBe("YWFh");
});

