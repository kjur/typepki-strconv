/**
 * zero padding for hexadecimal string
 * @param s - odd or even length hexadecimal string
 * @return even length zero padded hexadecimal string
 * @example
 * hexpad("1") -> "01"
 * hexpad("ab3c") -> "ab3c"
 */
export function hexpad(s: string): string {
  return (s.length % 2 === 1) ? `0${s}` : s;
}
