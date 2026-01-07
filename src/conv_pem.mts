import { b64tohex, hextob64 } from "./conv.mts";

// === pem / hex ======================
/**
 * get PEM string from hexadecimal data and header string
 * @param dataHex - hexadecimal string of PEM body
 * @param pemHeader - PEM header string (ex. 'RSA PRIVATE KEY')
 * @param separator - new line string
 * @return PEM formatted string of input data
 *
 * @description
 * This function converts a hexadecimal string to a PEM string with
 * a specified header. Its line break will be CRLF("\r\n").
 *
 * @example
 * hextopem('616161', 'RSA PRIVATE KEY') ->
 * -----BEGIN PRIVATE KEY-----
 * YWFh
 * -----END PRIVATE KEY-----
 */
export function hextopem(
  dataHex: string,
  pemHeader: string,
  separator = "\r\n",
): string {
  return `-----BEGIN ${pemHeader}-----${separator}${foldnl(
    hextob64(dataHex),
    64,
    separator
  )}${separator}-----END ${pemHeader}-----${separator}`;
}

/**
 * get hexacedimal string from PEM format data
 * @param s - PEM formatted string
 * @param sHead - PEM header string without BEGIN/END
 * @return hexadecimal string data of PEM contents
 *
 * @description
 * This static method gets a hexacedimal string of contents
 * from PEM format data. You can explicitly specify PEM header
 * by sHead argument.
 * Any space characters such as white space or new line
 * will be omitted.
 *
 * @example
 * pemtohex("-----BEGIN PUBLIC KEY...") -> "3082..."
 * pemtohex("-----BEGIN CERTIFICATE...", "CERTIFICATE") -> "3082..."
 * pemtohex(" \r\n-----BEGIN DSA PRIVATE KEY...") -> "3082..."
 * pemtohex("-----BEGIN EC PARAMETERS...----BEGIN EC PRIVATE KEY...." -> "3082..."
 */
export function pemtohex(s: string, sHead?: string): string {
  return b64tohex(pemtob64(s, sHead));
}

/**
 * get Base64 string from PEM format data
 * @param pem - PEM formatted string
 * @param sHead - PEM header string without BEGIN/END
 * @return base64 string in the first PEM
 *
 * @description
 * This static method gets a Base64 string of contents
 * from PEM format data. As for the "pem", some garbled text
 * before and after the PEM header also be acceptable.
 * When two or more PEMs are included, the first one will be
 * returned.
 *
 * @example
 * pemtob64("-----BEGIN CERTIFICATE...", "CERTIFICATE") -> "MIIBvTCC..."
 * pemtob64("-----BEGIN CERTIFICATE...", "CERTIFICATE") -> "MIIBvTCC..."
 * pemtob64("-----BEGIN CERTIFICATE...") -> "MIIBvTCC..."
 * pem2 = `
 * junk-text
 * -----BEGIN FOO----
 * YWFh
 * -----BEGIN FOO----
 * junk-text
 * -----BEGIN BOO BOO----
 * enp6
 * -----BEGIN BOO BOO----
 * junk-text
 * `
 * pemtob64(pem2) -> "YWFh"
 */
export function pemtob64(pem: string, sHead?: string): string {
  let s: string = pem;

  if (sHead !== undefined) {
    const sBegin = `-----BEGIN ${sHead}-----`;
    const sEnd = `-----END ${sHead}-----`;
    let idx = s.indexOf(sBegin);
    if (idx == -1) throw new Error("can't find PEM header");
    s = s.slice(idx + sBegin.length);
    idx = s.indexOf(sEnd);
    s = s.slice(0, idx);
    return s.replace(/\s+/g, "");
  } else {
    const sBegin = `-----BEGIN `;
    const sEnd = `-----END `;
    let idx = s.indexOf(sBegin);
    if (idx == -1) throw new Error("can't find PEM header");
    s = s.slice(idx + sBegin.length);
    s = s.replace(/^[0-9A-Za-z ]+-----/s, "");
    idx = s.indexOf(sEnd);
    s = s.slice(0, idx);
    return s.replace(/\s+/g, "");
  }
}

// === others =========================

/**
 * get PEM string from Base64 string
 * @param b64 - Base64 string of PEM body
 * @param pemHeader - PEM header string (ex. 'RSA PRIVATE KEY')
 * @param separator - new line string
 * @return PEM formatted string of input data
 *
 * @description
 * This function converts a Base64 string to a PEM string with
 * a specified header. Its line break will be CRLF("\r\n").
 *
 * @example
 * b64topem('YWFh', 'RSA PRIVATE KEY') ->
 * -----BEGIN PRIVATE KEY-----
 * YWFh
 * -----END PRIVATE KEY-----
 */
export function b64topem(
  b64: string,
  pemHeader: string,
  separator = "\r\n",
): string {
  return `-----BEGIN ${pemHeader}-----${separator}${foldnl(
    b64,
    64,
    separator,
  )}${separator}-----END ${pemHeader}-----${separator}`;
}

/**
 * convert a Base64 encoded string with new lines to a hexadecimal string
 * @param s - Base64 encoded string with new lines
 * @return hexadecimal string
 *
 * @description
 * This function converts from a Base64 encoded
 * string with new lines to a hexadecimal string.
 * This is useful to handle PEM encoded file.
 * This function removes any non-Base64 characters (i.e. not 0-9,A-Z,a-z,\,+,=)
 * including new line.
 *
 * @example
 * hextob64nl(
 * "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4\r\n" +
 * "OTAxMjM0NTY3ODkwCg==\r\n")
 * ->
 * "123456789012345678901234567890123456789012345678901234567890"
 */
export function b64nltohex(s: string): string {
  const b64 = s.replace(/[^0-9A-Za-z\/+=]*/g, "");
  const hex = b64tohex(b64);
  return hex;
}

/**
 * wrap string with new lines to fit in specified width
 * @param sIn - string
 * @param n - width
 * @param separator - line separator
 * @return wrapped string with new lines
 *
 * @description
 * This function wrap a string with new lines to fit in specified width.
 *
 * @example
 * foldnl("1234567890", 6)
 * ->
 * 123456
 * 7890
 */
export function foldnl(sIn: string, n: number, separator = "\r\n"): string {
  let s: string = sIn;
  s = s.replace(new RegExp(`(.{${n}})`, "g"), `$1${separator}`);
  s = s.replace(/\s+$/, "");
  return s;
}
