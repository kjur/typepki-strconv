/**
 * convert any IPv6 address to a 16 byte hexadecimal string
 * @param sIn - ipv6 address string
 * @return 16 byte hexadecimal string of IPv6 address
 *
 * @description
 * This function converts any IPv6 address representation string
 * to a 16 byte hexadecimal string of address.
 *
 * @example
 */
export function ipv6tohex(sIn: string): string {
  let s: string = sIn;
  const msgMalformedAddress = "malformed IPv6 address";
  if (!s.match(/^[0-9A-Fa-f:]+$/)) throw msgMalformedAddress;

  // 1. downcase
  s = s.toLowerCase();

  // 2. expand ::
  const num_colon = s.split(":").length - 1;
  if (num_colon < 2) throw msgMalformedAddress;
  const colon_replacer = ":".repeat(7 - num_colon + 2);
  s = s.replace("::", colon_replacer);

  // 3. fill zero
  const a = s.split(":");
  if (a.length !== 8) throw msgMalformedAddress;
  for (let i = 0; i < 8; i++) {
    a[i] = `0000${a[i]}`.slice(-4);
  }
  return a.join("");
}

/**
 * convert a 16 byte hexadecimal string to RFC 5952 canonicalized IPv6 address
 * @param hex - hexadecimal string of 16 byte IPv6 address
 * @return IPv6 address string canonicalized by RFC 5952
 *
 * @description
 * This function converts a 16 byte hexadecimal string to
 * <a href="https://tools.ietf.org/html/rfc5952">RFC 5952</a>
 * canonicalized IPv6 address string.
 *
 * @example
 * hextoipv6("871020010db8000000000000000000000004") -> "2001:db8::4"
 * hextoipv6("871020010db8000000000000000000") -> raise exception
 * hextoipv6("xyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyzxyz") -> raise exception
 */
export function hextoipv6(hex: string): string {
  let s: string = hex;
  if (!s.match(/^[0-9A-Fa-f]{32}$/))
    throw new Error(`malformed IPv6 address: ${s}`);

  // 1. downcase
  s = s.toLowerCase();

  // 2. split 4 > ["0123", "00a4", "0000", ..., "ffff"]
  let a: string[] = s.match(/.{1,4}/g) || [];

  // 3. trim leading 0 for items and join > "123:a4:0:...:ffff"
  a = a.map((s) => s.replace(/^0+/, ""));
  a = a.map((s) => (s === "" ? "0" : s));
  s = `:${a.join(":")}:`;

  // 4. find shrinkable candidates :0:0:..:0:
  const aZero = s.match(/:(0:){2,}/g);

  // 5. no shrinkable
  if (aZero == null) return s.slice(1, -1);

  // 6. fix max length zero(:0:...:0:)
  const sMaxZero = aZero.sort().slice(-1)[0];

  // 7. replace shrinked
  s = s.replace(sMaxZero.substr(0, sMaxZero.length - 1), ":");

  // 8. trim leading ':' if not '::'
  if (s.substr(0, 2) !== "::") s = s.substr(1);

  // 9. trim tail ':' if not '::'
  if (s.substr(-2, 2) !== "::") s = s.substr(0, s.length - 1);

  return s;
}

/*
 * @see hextoipv6
 * @see iptohex
 */
/**
 * convert a hexadecimal string to IP addresss
 * @param s - hexadecimal string of IP address
 * @return IP address string
 *
 * @description
 * This function converts a hexadecimal string of IPv4 or
 * IPv6 address to IPv4 or IPv6 address string.
 * If byte length is not 4 nor 16, this returns a
 * hexadecimal string without conversion.
 *
 * @example
 * hextoip("c0a80101") -> "192.168.1.1"
 * hextoip("871020010db8000000000000000000000004") -> "2001:db8::4"
 * hextoip("c0a80100ffffff00") -> "192.168.1.0/24"
 * hextoip("c0a801010203") -> "c0a801010203" // wrong 6 bytes
 * hextoip("zzz")) -> raise exception because of not hexadecimal
 */
export function hextoip(s: string): string {
  const malformedErr = new Error("malformed hex value");
  if (!s.match(/^([0-9A-Fa-f][0-9A-Fa-f]){1,}$/)) throw malformedErr;
  if (s.length === 8) {
    // ipv4
    let ip: string;
    try {
      ip = `${parseInt(s.substr(0, 2), 16)}.${parseInt(
        s.substr(2, 2),
        16,
      )}.${parseInt(s.substr(4, 2), 16)}.${parseInt(s.substr(6, 2), 16)}`;
      return ip;
    } catch (ex) {
      throw malformedErr;
    }
  } else if (s.length === 16) {
    try {
      return `${hextoip(s.substr(0, 8))}/${ipprefixlen(s.substr(8))}`;
    } catch (ex) {
      throw malformedErr;
    }
  } else if (s.length === 32) {
    return hextoipv6(s);
  } else if (s.length === 64) {
    try {
      return `${hextoipv6(s.substr(0, 32))}/${ipprefixlen(s.substr(32))}`;
    } catch (ex) {
      throw malformedErr;
    }
  } else {
    return s;
  }
}

/**
 * convert IPv4/v6 addresss to a hexadecimal string
 * @param sIn - IPv4/v6 address string
 * @return hexadecimal string of IP address
 * @see hextoip
 * @see ipv6tohex
 *
 * @description
 * This function converts IPv4 or IPv6 address string to
 * a hexadecimal string of IPv4 or IPv6 address.
 *
 * @example
 * iptohex("192.168.1.1") -> "c0a80101"
 * iptohex("2001:db8::4") -> "871020010db8000000000000000000000004"
 * iptohex("192.168.1.1/24") -> "c0a80101ffffff00"
 * iptohex("2001:db8::/120") -> "871020010db8000000000000000000000000ffffffffffffffffffffffffffffffffff00"
 * iptohex("zzz")) -> raise exception
 */
export function iptohex(sIn: string): string {
  let s: string = sIn;
  const malformedErr = new Error("malformed IP address");
  s = s.toLowerCase();

  if (!s.match(/^[0-9a-f.:/]+$/)) throw malformedErr;

  if (s.match(/^[0-9.]+$/)) {
    const a = s.split(".");
    if (a.length !== 4) throw malformedErr;
    let hex = "";
    try {
      for (let i = 0; i < 4; i++) {
        const d = parseInt(a[i]);
        hex += `0${d.toString(16)}`.slice(-2);
      }
      return hex;
    } catch (ex) {
      throw malformedErr;
    }
  } else if (s.match(/^[0-9.]+\/[0-9]+$/)) {
    const aItem = s.split("/");
    return iptohex(aItem[0]) + ipnetmask(parseInt(aItem[1]), 32);
  } else if (s.match(/^[0-9a-f:]+$/) && s.indexOf(":") !== -1) {
    return ipv6tohex(s);
  } else if (s.match(/^[0-9a-f:]+\/[0-9]+$/) && s.indexOf(":") !== -1) {
    const aItem = s.split("/");
    return ipv6tohex(aItem[0]) + ipnetmask(parseInt(aItem[1]), 128);
  } else {
    throw malformedErr;
  }
}

/*
 * convert subnet mask hex to ip address prefix length<br/>
 * @param hMask - hexadecimal string of ipv4/6 subnet mask (ex. "ffffff00" for v4 class C)
 * @return ip address prefix length (ex. 24 for IPv4 class C)
 */
export function ipprefixlen(hMask: string): number {
  const malformedErr = new Error("malformed mask");
  let bMask: string;
  try {
    bMask = parseInt(hMask, 16).toString(2);
  } catch (ex) {
    throw malformedErr;
  }
  if (!bMask.match(/^1*0*$/)) throw malformedErr;
  return bMask.replace(/0+$/, "").length;
}

/*
 * convert ip prefix length to net mask octets<br/>
 * @param prefixlen - ip prefix length value (ex. 24 for IPv4 class C)
 * @param len - ip address length (ex. 32 for IPv4 and 128 for IPv6)
 * @return hexadecimal string of net mask octets
 * @example
 * ipnetmask(24, 32) -> "ffffff00"
 * ipnetmask(120, 128) -> "ffffffffffffffffffffffffffffff00"
 */
export function ipnetmask(prefixlen: number, len: number): string {
  if (len === 32 && prefixlen === 0) return "00000000"; // v4
  if (len === 128 && prefixlen === 0) return "00000000000000000000000000000000"; // v6
  const b =
    Array(prefixlen + 1).join("1") + Array(len - prefixlen + 1).join("0");
  return parseInt(b, 2).toString(16);
}
