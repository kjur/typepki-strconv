import { hextouricmp } from "./conv_uricmp.mts";

// ==== hex / base64 ======================================
export function b64tohex(b64: string): string {
  return Buffer.from(b64, "base64").toString("hex");
}

export function hextob64(hex: string): string {
  return Buffer.from(hex, "hex").toString("base64");
}

// ==== hex / utf8 ========================================
/**
 * convert hexadecimal string to UTF-8 string
 * @param h - hexadecimal string
 * @return UTF-8 string
 * @throws Error if hexadecimal can't decoded as UTF-8 string
 * @example
 * hextoutf8("616263") -> "abc"
 * hextoutf8("616161e38182e38184e38186") -> "aaaあいう"
 * hextoutf8("6161ff") -> throws malformed error
 */
export function hextoutf8(h: string): string {
  try {
    return decodeURIComponent(hextouricmp(h));
  } catch (ex) {
    throw new Error("malformed hexadecimal UTF-8 string");
  }
}

export function utf8tohex(u8: string): string {
  return Buffer.from(u8, "utf8").toString("hex");
}

// ==== utf8 / base64 =====================================
export function b64toutf8(b64: string): string {
  return Buffer.from(b64, "base64").toString("utf8");
}

export function utf8tob64(u8: string): string {
  return Buffer.from(u8, "utf8").toString("base64");
}

// ==== utf8 / base64u ====================================
export function b64utoutf8(b64u: string): string {
  return Buffer.from(b64utob64(b64u), "base64").toString("utf8");
}

export function utf8tob64u(u8: string): string {
  return b64tob64u(Buffer.from(u8, "utf8").toString("base64"));
}
// ==== hex / base64u =====================================
export function b64utohex(b64u: string): string {
  return b64tohex(b64utob64(b64u));
}

export function hextob64u(hex: string): string {
  return b64tob64u(hextob64(hex));
}

// ==== hex / rstr ========================================
/**
 * convert a hexadecimal string to raw string
 * @param hex hexadecimal string
 * @return rawstring
 * @see {@link rstrtohex}
 * @example
 * hextorstr("616161") -> "aaa"
 * hextorstr("610061") -> "a\x00a"
 */
export function hextorstr(hex: string): string {
  let result = "";
  for (let i = 0; i < hex.length; i += 2) {
    const sByte = parseInt(hex.substr(i, 2), 16);
    result += String.fromCharCode(sByte);
  }
  return result;
}

/**
 * convert a raw string to a hexadecimal string
 * @param s raw string
 * @return hexadecimal string
 * @see {@link hextorstr}
 * @example
 * rstrtohex("aaa") -> "616161"
 * rstrtohex("a\x00a") -> "610061"
 */
export function rstrtohex(s: string): string {
  let result = "";
  for (let i = 0; i < s.length; i++) {
    result += `0${s.charCodeAt(i).toString(16)}`.slice(-2);
  }
  return result;
}

// ==== rstr / base64 =====================================
/**
 * convert a raw string to a Base64 encoded string.
 * @param s raw string
 * @return Base64URL encoded string
 * @example
 * rstrtob64("aaa") -> "YWFh"
 */
export function rstrtob64(s: string): string {
  return Buffer.from(s).toString("base64");
}

// ==== base64 / base64url ================================
/**
 * convert a Base64 encoded string to a Base64URL encoded string.
 * @param sIn - Base64 encoded string
 * @return Base64URL encoded string
 * @see {@link b64utob64}
 * @example
 * b64tob64u("ab+c3f/==") &rarr; "ab-c3f_"
 */
/*
 * @name b64tob64u
 * @function
 */
export function b64tob64u(sIn: string): string {
  let s: string = sIn;
  s = s.replace(/\=/g, "");
  s = s.replace(/\+/g, "-");
  s = s.replace(/\//g, "_");
  return s;
}

/**
 * convert a Base64URL encoded string to a Base64 encoded string.
 * @param sIn - Base64URL encoded string
 * @return Base64 encoded string
 * @see {@link b64tob64u}
 * @example
 * b64utob64("ab-c3f_") -> "ab+c3f/=="
 */
export function b64utob64(sIn: string): string {
  let s: string = sIn;
  if (s.length % 4 === 2) s = `${s}==`;
  else if (s.length % 4 === 3) s = `${s}=`;
  s = s.replace(/-/g, "+");
  s = s.replace(/_/g, "/");
  return s;
}

// ==== binstr / bitstr ===================================
/**
 * convert from binary string to hexadecimal string of ASN.1 BitString value with unused bit<br/>
 * @param s binary string (ex. "101")
 * @return hexadecimal string of ASN.1 BitString value with unused bit
 * @see {@link bitstrtobinstr}
 *
 * @description
 * This function converts from an binary string (ex. "101") to
 * hexadecimal string of ASN.1 BitString value
 * with unused bit (ex. "05a0"). <br/>
 * When "s" is not binary string, this returns null.
 *
 * @example
 * binstrtobitstr("101") -> "05a0"
 * binstrtobitstr("001") -> "0520"
 * binstrtobitstr("11001") -> "03c8"
 * binstrtobitstr("101000001") -> "07a080"
 * binstrtobitstr(101) -> null // not number
 * binstrtobitstr("xyz") -> null // not binary string
 */
export const binstrtobitstr = (s: string): string | null => {
  if (s.match(/^[01]+$/) == null) return null;
  try {
    const n = parseInt(s, 2);
    return inttobitstr(n);
  } catch (ex) {
    return null;
  }
};

/**
 * convert from hexadecimal string of ASN.1 BitString value with unused bit to binary string
 * @param h - hexadecimal string of ASN.1 BitString value with unused bit
 * @return binary string
 * @see {@link binstrtobitstr}
 * @see {@link inttobitstr}
 *
 * @description
 * This function converts from hexadecimal string of ASN.1 BitString
 * value with unused bit to its integer value. <br/>
 * When an improper hexadecimal string of BitString value
 * is applied, this returns null.
 *
 * @example
 * bitstrtobinstr("05a0") -> "101"
 * bitstrtobinstr("0520") -> "001"
 * bitstrtobinstr("07a080") -> "101000001"
 * bitstrtobinstr(502) -> null // non ASN.1 BitString value
 * bitstrtobinstr("ff00") -> null // for improper BitString value
 */
export function bitstrtobinstr(h: string): string | null {
  if (typeof h !== "string") return null;
  if (h.length % 2 !== 0) return null;
  if (!h.match(/^[0-9a-f]+$/)) return null;
  try {
    const unusedBits = parseInt(h.substr(0, 2), 16);
    if (unusedBits < 0 || 7 < unusedBits) return null;

    const value = h.substr(2);
    let bin = "";
    for (let i = 0; i < value.length; i += 2) {
      const hi = value.substr(i, 2);
      let bi = parseInt(hi, 16).toString(2);
      bi = `0000000${bi}`.slice(-8);
      bin += bi;
    }
    return bin.substr(0, bin.length - unusedBits);
  } catch (ex) {
    return null;
  }
}

/**
 * convert from integer value to hexadecimal string of ASN.1 BitString value with unused bit
 * @param n integer value of ASN.1 BitString
 * @return hexadecimal string of ASN.1 BitString value with unused bit
 * @see bitstrtoint
 *
 * @description
 * This function converts from an integer value to
 * hexadecimal string of ASN.1 BitString value
 * with unused bit. <br/>
 * When "n" is not non-negative number, this returns null
 *
 * @example
 * // 25 -> 11001b -> 11001000b unusedbit=03 -> 0xc8 unusedbit=03 -> "03c8"
 * inttobitstr(25) -> "03c8"
 * inttobitstr(-3) -> null
 * inttobitstr("abc") -> null
 * inttobitstr(parseInt("11001", 2)) -> "03c8"
 * inttobitstr(parseInt("101", 2)) -> "05a0"
 * inttobitstr(parseInt("101000001", 2)) -> "07a080"
 */
/*
 * @name inttobitstr
 * @function
 * @since jsrsasign 10.1.3 base64x 1.1.19
 * @see KJUR.asn1.DERBitString
 * @see ASN1HEX.getInt
 */
export function inttobitstr(n: number): string | null {
  if (typeof n !== "number") return null;
  if (n < 0) return null;
  let bValue = Number(n).toString(2);
  let iUnusedbit = 8 - (bValue.length % 8);
  if (iUnusedbit === 8) iUnusedbit = 0;
  bValue = bValue + strpad("", iUnusedbit, "0");
  let hValue = parseInt(bValue, 2).toString(16);
  if (hValue.length % 2 === 1) hValue = `0${hValue}`;
  const hUnusedbit = `0${iUnusedbit}`;
  return hUnusedbit + hValue;
}

/*
 * @name strpad
 * @function
 * @since jsrsasign 10.1.0 base64x 1.1.18
 */
/**
 * create padded string with specified length and padding string
 * @param s input string
 * @param len output string length
 * @param defpadchar padding character (default is "0")
 * @return padded string
 * @example
 * strpad("1234", 10, "0") -> "0000001234"
 * strpad("1234", 10, " ") -> "      1234"
 * strpad("1234", 10)      -> "0000001234"
 */
export const strpad = (s: string, len: number, defpadchar?: string): string => {
  const padchar: string = defpadchar === undefined ? "0" : defpadchar;
  if (s.length >= len) return s;
  return new Array(len - s.length + 1).join(padchar) + s;
};

// =======================================================
/**
 * represents JSON data structure
 * @example
 * let db: Dictionary<number> = { apple: 10, orange: 20 }
 */
export interface Dictionary<Type> {
  /**
   * key string
   */
  [key: string]: Type;
}

// ==== namearray / binstr ================================

/**
 * convert array of names to bit string
 * @param namearray array of name string
 * @param namedb associative array of name and value
 * @return binary string (ex. "110001")
 * @see {@link binstrtonamearray}
 *
 * @description
 * This function converts from an array of names to
 * a binary string. DB value bit will be set.
 * Note that ordering of namearray items
 * will be ignored.
 * This function may be useful to implement ASN.1 BitString such as KeyUsage.
 *
 * @example
 * const db: Record<string, number> = { a: 0, b: 3, c: 8, d: 9, e: 17, f: 19 };
 * namearraytobinstr(['a', 'c', 'd'], db) -> '1000000011'
 * namearraytobinstr(['c', 'b'], db) -> '000100001'
 */
/*
 * @name namearraytobinstr
 * @function
 * @since jsrsasign 10.5.21 base64x 1.1.27
 * @see KJUR.asn1.x509.KeyUsage
 * @see KJUR.asn1.tsp.PKIFailureInfo
 */
export function namearraytobinstr(
  namearray: Array<string>,
  namedb: Record<string, number>,
): string {
  let d = 0;
  for (let i = 0; i < namearray.length; i++) {
    d |= 1 << namedb[namearray[i]];
  }

  const s = d.toString(2);
  let r = "";
  for (let i = s.length - 1; i >= 0; i--) {
    r += s[i];
  }
  return r;
}

/**
 * convert bit string to array of names to
 * @param binstr - binary string (ex. "1001")
 * @param namedb associative array of name and index
 * @return array of names
 * @see {@link namearraytobinstr}
 *
 * @description
 * This function converts from binary string to
 * an array of names defined in namedb.
 *
 * @example
 * const db: Record<string, number> = { a: 0, b: 3, c: 8, d: 9, e: 17, f: 19 };
 * binstrtonamearray('1000000011', db) -> ['a', 'c', 'd']
 * binstrtonamearray(''000100001', db) -> ['b', 'c']
 *
 * const db2: Record<string, number> = { "apple": 0, "orange": 1, "grape": 2, "mango", 3 };
 * binstrtonamearray('0101', db2) -> ['orange', 'mango']
 * binstrtonamearray('101', db2) -> ['apple', 'grape']
 */
export function binstrtonamearray(
  binstr: string,
  namedb: Record<string, number>,
): string[] {
  const aKey: string[] = Object.keys(namedb);
  //console.log("aKey=", aKey);
  const aVal = aKey.map((k) => namedb[k]);
  //console.log("aVal=", aVal);

  const namedbrev: Record<string, string> = {};
  Object.keys(namedb).map((k) => {
    namedbrev[namedb[k]] = k;
  });
  //console.log("namedbrev=", JSON.stringify(namedbrev, null, 2));

  const aResult: string[] = [];
  binstr.split("").map((k, idx) => {
    if (k === "1") aResult.push(namedbrev[idx.toString()]);
  });

  return aResult;
}

/**
 * get value of array by key name list<br/>
 * @param valIn - array of associative array
 * @param sKey - concatinated key list with dot (ex. 'type.name.0.info')
 * @param defIn - default value if value is not found (OPTIONAL)
 * @return value if found otherwise returns def
 *
 * @description
 * This function returns the value of an array or associative array
 * which referred by a concatinated key list string.
 * If a value for key is not defined, it returns 'undefined' by default.
 * When an optional argument 'def' is specified and a value for key is
 * not defined, it returns a value of 'def'.
 *
 * @example
 * let p = {
 *   fruit: apple,
 *   info: [
 *     { toy: 4 },
 *     { pen: 6 }
 *   ]
 * };
 * aryval(p, 'fruit') -> "apple"
 * aryval(p, 'info') -> [{toy: 4},{pen: 6}]
 * aryval(p, 'info.1') -> {pen: 6}
 * aryval(p, 'info.1.pen') -> 6
 * aryval(p, 'money.amount') -> undefined
 * aryval(p, 'money.amount', null) -> null
 */
export function aryval(valIn: any, sKey: string, defIn?: any): any {
  let val: any = valIn;
  const keys: string[] = sKey.split(".");
  for (let i = 0; i < keys.length && val; i++) {
    const key: string = keys[i];

    if (typeof val === "object" && "length" in val && key.match(/^[0-9]+$/)) {
      val = val[parseInt(key)];
    } else if (typeof val === "object" && key in val) {
      val = val[key];
    } else {
      return defIn;
    }
  }
  return val || val === false ? val : defIn;
}
