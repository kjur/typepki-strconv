import { stohex } from "./conv_ba.mts";

/**
 * convert a URLComponent string such like "%67%68" to a hexadecimal string.
 * @param s - URIComponent string such like "%67%68"
 * @return hexadecimal string
 * @example
 * uricmptohex("%67%68") -> "6768"
 */
export function uricmptohex(s: string): string {
  return s.replace(/%/g, "");
}

/**
 * convert a hexadecimal string to a URLComponent string such like "%67%68".
 * @param s - hexadecimal string
 * @return URIComponent string such like "%67%68"
 * @example
 * hextouricmp("6768") -> "%67%68"
 */
export function hextouricmp(s: string): string {
  return s.replace(/(..)/g, "%$1");
}

/**
 * convert UTF8 hexadecimal string to a URLComponent string such like "%67%68".
 * @param u8 - UTF8 hexadecimal string
 * @return URIComponent string such like "%67%68"
 *
 * @description
 * Note that these "<code>0-9A-Za-z!'()*-._~</code>" characters will not
 * converted to "%xx" format by builtin 'encodeURIComponent()' function.
 * However this 'encodeURIComponentAll()' function will convert
 * all of characters into "%xx" format.
 */
export function encodeURIComponentAll(u8: string): string {
  const s = encodeURIComponent(u8);
  let s2 = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "%") {
      s2 = s2 + s.substr(i, 3);
      i = i + 2;
    } else {
      s2 = `${s2}%${stohex(s[i])}`;
    }
  }
  return s2;
}
