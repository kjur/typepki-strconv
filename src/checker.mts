import { b64utob64 } from "./conv.mts";

/**
 * function to check if a string is a hexadecimal string
 * @param h hexadecimal string
 * @return checking result
 * @example
 * ishex("12ab") -> true
 * ishex( "2ab") -> false
 * ishex("12zz") -> false
 */
export function ishex(h: string): boolean {
  if (h.length % 2 === 1) return false;
  if (h.match(/^[0-9a-f]+$/) == null) return false;
  return true;
}

/**
 * check whether a string is a base64 encoded string or not
 * @param s - string to be checked
 * @return true if the string is a Base64 encoded string
 * @see {@link isBase64URL}
 * @example
 * isBase64("YWE=") -> true
 * isBase64("YW_=") -> false
 * isBase64("YWE") -> false // length shall be multiples of 4
 */
export function isBase64(s: string): boolean {
  const s2 = s.replace(/\s+/g, "");
  if (s2.match(/^[0-9A-Za-z+\/]+={0,3}$/) && s2.length % 4 === 0) {
    return true;
  }
  return false;
}

/**
 * check whether a string is a base64url encoded string or not
 * @param s - string to be checked
 * @return true if the string is a Base64URL encoded string
 * @see {@link isBase64}
 * @example
 * isBase64URL("YWE") -> true
 * isBase64URL("YW-") -> true
 * isBase64URL("YW+") -> false
 */
export function isBase64URL(s: string): boolean {
  if (s.match(/[+/=]/)) return false;
  const s64 = b64utob64(s);
  return isBase64(s64);
}
