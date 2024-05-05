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
