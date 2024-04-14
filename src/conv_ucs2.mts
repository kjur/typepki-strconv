import { hextoutf8 } from "./conv.mts";

/**
 * convert UCS-2 hexadecimal stirng to UTF-8 string
 * @param s - hexadecimal string of UCS-2 string (ex. "0066")
 * @return UTF-8 string
 *
 * @description
 * This function converts hexadecimal value of UCS-2 string to
 * UTF-8 string.
 *
 * @example
 * ucs2hextoutf8("006600fc0072") -> "für"
 */
/*
See: http://nomenclator.la.coocan.jp/unicode/ucs_utf.htm
UCS-2 to UTF-8
UCS-2 code point | UCS-2 bytes       | UTF-8 bytes
U+0000 .. U+007F | 00000000-0xxxxxxx | 0xxxxxxx (1 byte)
U+0080 .. U+07FF | 00000xxx-xxyyyyyy | 110xxxxx 10yyyyyy (2 byte)
U+0800 .. U+FFFF | xxxxyyyy-yyzzzzzz | 1110xxxx 10yyyyyy 10zzzzzz (3 byte)
 */
export function ucs2hextoutf8(s: string): string {
  function _conv(s: string): string {
    const i1: number = parseInt(s.substr(0, 2), 16);
    const i2: number = parseInt(s.substr(2), 16);
    if (i1 === 0 && i2 < 0x80) {
      // 1 byte
      return String.fromCharCode(i2);
    }
    if (i1 < 8) {
      // 2 bytes
      const u1 = 0xc0 | ((i1 & 0x07) << 3) | ((i2 & 0xc0) >> 6);
      const u2 = 0x80 | (i2 & 0x3f);
      return hextoutf8(u1.toString(16) + u2.toString(16));
    }
    // 3 bytes
    const u1 = 0xe0 | ((i1 & 0xf0) >> 4);
    const u2 = 0x80 | ((i1 & 0x0f) << 2) | ((i2 & 0xc0) >> 6);
    const u3 = 0x80 | (i2 & 0x3f);
    return hextoutf8(u1.toString(16) + u2.toString(16) + u3.toString(16));
  }
  const a: string[] | null = s.match(/.{4}/g);
  if (a == null) return "";
  const a2: string[] | null = a.map(_conv);
  return a2.join("");
}
