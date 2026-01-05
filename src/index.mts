const VERSION: string = "typepki-strconv 0.10.0 kjur.github.io/typepki-strconv";
export { VERSION };

import { isBase64, isBase64URL, ishex } from "./checker.mts";
export { isBase64, isBase64URL, ishex };

import { BAtohex, BAtos, hextoBA, stoBA, stohex } from "./conv_ba.mts";
export { stohex, BAtohex, hextoBA, stoBA, BAtos };

import {
  Dictionary,
  aryval,
  b64tob64u,
  b64tohex,
  b64toutf8,
  b64utob64,
  b64utohex,
  b64utoutf8,
  binstrtobitstr,
  binstrtonamearray,
  bitstrtobinstr,
  hextob64,
  hextob64u,
  hextorstr,
  hextoutf8,
  inttobitstr,
  namearraytobinstr,
  rstrtob64,
  rstrtohex,
  strpad,
  utf8tob64,
  utf8tob64u,
  utf8tohex,
} from "./conv.mts";
export {
  b64tohex,
  hextob64,
  b64toutf8,
  utf8tob64,
  b64utoutf8,
  utf8tob64u,
  hextoutf8,
  utf8tohex,
  b64utohex,
  hextob64u,
  b64tob64u,
  b64utob64,
  hextorstr,
  rstrtohex,
  binstrtobitstr,
  binstrtonamearray,
  bitstrtobinstr,
  inttobitstr,
  strpad,
  namearraytobinstr,
  aryval,
  rstrtob64,
};
export type { Dictionary };

import { iso88591hextoutf8, utf8toiso88591hex } from "./conv_iso88591.mts";
export { iso88591hextoutf8, utf8toiso88591hex };

import {
  b64nltohex,
  b64topem,
  foldnl,
  hextopem,
  pemtob64,
  pemtohex,
} from "./conv_pem.mts";
export { pemtohex, hextopem, pemtob64, b64topem, b64nltohex, foldnl };

import { ArrayBuffertohex, hextoArrayBuffer } from "./conv_arybuf.mts";
export { hextoArrayBuffer, ArrayBuffertohex };

import {
  datetozulu,
  iso8601tozulu,
  msectozulu,
  timetogen,
  zulutodate,
  zulutoiso8601,
  zulutomsec,
  zulutosec,
} from "./conv_zulu.mts";
export {
  datetozulu,
  iso8601tozulu,
  msectozulu,
  timetogen,
  zulutodate,
  zulutoiso8601,
  zulutomsec,
  zulutosec,
};

import {
  encodeURIComponentAll,
  hextouricmp,
  uricmptohex,
} from "./conv_uricmp.mts";
export { encodeURIComponentAll, hextouricmp, uricmptohex };

import {
  hextoip,
  hextoipv6,
  ipnetmask,
  ipprefixlen,
  iptohex,
  ipv6tohex,
} from "./conv_ip.mts";
export { ipv6tohex, hextoipv6, hextoip, iptohex, ipprefixlen, ipnetmask };

import { ucs2hextoutf8 } from "./conv_ucs2.mts";
export { ucs2hextoutf8 };

import { hexpad } from "./hexutil.mts";
export { hexpad };
