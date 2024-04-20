/**
 * convert a ASCII string to a hexadecimal string of ASCII codes.
 * @description
 * NOTE: This can't be used for non ASCII characters.
 * @param s - ASCII string
 * @return hexadecimal string
 */
export function stohex(s: string): string {
  return BAtohex(stoBA(s));
}

/**
 * convert an array of bytes(Number) to hexadecimal string.
 * @param a - an array of byte
 * @return hexadecimal string
 * @see {@link hextoBA}
 * @example
 * hextoBA([97, 97, 97]) -> "616161"
 */
export function BAtohex(a: Array<number>): string {
  let s = "";
  for (let i = 0; i < a.length; i++) {
    let hex1 = a[i].toString(16);
    if (hex1.length === 1) hex1 = `0${hex1}`;
    s = s + hex1;
  }
  return s;
}

/**
 * convert an hexadecimal string to array of numbers.
 * @param h - a hexadecimal string
 * @return array of numbers
 * @see {@link BAtohex}
 * @example
 * hextoBA("616161") -> [97, 97, 97]
 */
export function hextoBA(h: string): Array<number> {
  const a: Array<number> = [];
  for (let i = 0; i < h.length; i += 2) {
    a.push(parseInt(h.slice(i, i + 2), 16));
  }
  return a;
}

// ==== string / byte array ================================
/**
 * convert a string to an array of character codes
 * @param s - string
 * @return array of character code value
 */
export function stoBA(s: string): Array<number> {
  const a = new Array();
  for (let i = 0; i < s.length; i++) {
    a[i] = s.charCodeAt(i);
  }
  return a;
}

/**
 * convert an array of character codes to a string
 * @param a - a array of character codes
 * @return string
 */
export function BAtos(a: Array<number>): string {
  let s = "";
  for (let i = 0; i < a.length; i++) {
    s = s + String.fromCharCode(a[i]);
  }
  return s;
}
