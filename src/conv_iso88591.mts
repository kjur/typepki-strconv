import { hextoutf8, utf8tohex } from "./conv.mts";

/**
 * convert a hexadecimal ISO 8859-1 latin string to UTF-8 string
 * @param h hexadecimal ISO 8859-1 latin string
 * @return UTF-8 string
 * @see {@link utf8toiso88591hex}
 * @example
 * iso88591hextoutf8("41a9fa") -> "A©ú"
 */
export function iso88591hextoutf8(h: string): string {
  return hextoutf8(iso88591hextoutf8hex(h));
}

/**
 * convert UTF-8 string to a hexadecimal ISO 8859-1 latin string
 * @param s hexadecimal ISO 8859-1 latin string
 * @return UTF-8 string
 * @see {@link iso88591hextoutf8}
 * @example
 * utf8toiso88591hex("A©ú") -> "41a9fa"
 */
export function utf8toiso88591hex(s: string): string {
  return utf8hextoiso88591hex(utf8tohex(s));
}

function iso88591hextoutf8hex(h: string): string {
  const a = h.match(/.{1,2}/g);
  if (a == null) return "";
  const a2 = [];
  for (let i = 0; i < a.length; i++) {
    const di = parseInt(a[i], 16);
    if (0xa1 <= di && di <= 0xbf) {
      a2.push("c2");
      a2.push(a[i]);
    } else if (0xc0 <= di && di <= 0xff) {
      a2.push("c3");
      a2.push((di - 64).toString(16));
    } else {
      a2.push(a[i]);
    }
  }
  return a2.join("");
}

function utf8hextoiso88591hex(h: string): string {
  const a = h.match(/.{1,2}/g);
  if (a == null) return "";
  const a2 = [];
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "c2") {
      i++;
      a2.push(a[i]);
    } else if (a[i] === "c3") {
      i++;
      const di = parseInt(a[i], 16) + 64;
      a2.push(di.toString(16));
    } else {
      a2.push(a[i]);
    }
  }
  return a2.join("");
}
