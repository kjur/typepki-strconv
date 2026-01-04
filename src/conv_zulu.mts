/**
 * GeneralizedTime or UTCTime string to milliseconds from Unix origin
 * @param sZulu - GeneralizedTime or UTCTime string (ex. 20170412235959.384Z)
 * @return milliseconds from Unix origin time (i.e. Jan 1, 1970 0:00:00 UTC)
 *
 * @description
 * This function converts from GeneralizedTime string (i.e. YYYYMMDDHHmmSSZ) or
 * UTCTime string (i.e. YYMMDDHHmmSSZ) to milliseconds from Unix origin time
 * (i.e. Jan 1 1970 0:00:00 UTC).
 * Argument string may have fraction of seconds and
 * its length is one or more digits such as "20170410235959.1234567Z".
 * As for UTCTime, if year "YY" is equal or less than 49 then it is 20YY.
 * If year "YY" is equal or greater than 50 then it is 19YY.
 *
 * @example
 * zulutomsec(  "071231235959Z")       -> 1199145599000 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutomsec(  "071231235959.1Z")     -> 1199145599100 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutomsec(  "071231235959.12345Z") -> 1199145599123 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutomsec("20071231235959Z")       -> 1199145599000 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutomsec(  "931231235959Z")       -> -410227201000 #Mon, 31 Dec 1956 23:59:59 GMT
 */
export function zulutomsec(sZulu: string): number {
  let s: string = sZulu;
  let year: number;
  let month: number;
  let day: number;
  let hour: number;
  let min: number;
  let sec: number;
  let msec: number;
  let sFrac: string;
  let sMsec: string;

  s = timetogen(s);
  const matchResult = s.match(
    /^(\d{4})(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(|\.\d+)Z$/,
  );

  if (matchResult) {
    year = parseInt(matchResult[1]);
    month = parseInt(matchResult[2]) - 1;
    day = parseInt(matchResult[3]);
    hour = parseInt(matchResult[4]);
    min = parseInt(matchResult[5]);
    sec = parseInt(matchResult[6]);
    msec = 0;

    sFrac = matchResult[7];
    if (sFrac !== "") {
      sMsec = `${sFrac.substr(1)}00`.substr(0, 3); // .12 -> 012
      msec = parseInt(sMsec);
    }
    return Date.UTC(year, month, day, hour, min, sec, msec);
  }
  throw new Error(`unsupported zulu format: ${s}`);
}

/**
 * Unix origin milliseconds GeneralizedTime string
 * @param n - milliseconds from Unix origin time (i.e. Jan 1, 1970 0:00:00 UTC)
 * @return GeneralizedTime string (ex. 20170412235959.384Z)
 *
 * @description
 * This function converts from milliseconds of Unix origin time (ex. 1199145599000
 * for 31 Dec 2007 23:59:59 GMT) to GeneralizedTime string (i.e. YYYYMMDDHHmmSSZ).
 * The result string may have a fraction of second.
 *
 * @example
 * msectozulu(1199145599000) -> "20071231235959Z"       #Mon, 31 Dec 2007 23:59:59     GMT
 * msectozulu(1199145599100) -> "20071231235959.1Z"     #Mon, 31 Dec 2007 23:59:59.1   GMT
 * msectozulu(1199145599123) -> "20071231235959.123Z"   #Mon, 31 Dec 2007 23:59:59.123 GMT
 */
export function msectozulu(n: number): string {
  const d = new Date(n);
  const year = `0000${d.getUTCFullYear()}`.slice(-4);
  const mon = `00${d.getUTCMonth() + 1}`.slice(-2);
  const day = `00${d.getUTCDate()}`.slice(-2);
  const hour = `00${d.getUTCHours()}`.slice(-2);
  const min = `00${d.getUTCMinutes()}`.slice(-2);
  const sec = `00${d.getUTCSeconds()}`.slice(-2);
  let msec = `000${d.getUTCMilliseconds()}`.slice(-3);
  msec = msec.replace(/0+$/, "");
  msec = msec !== "" ? `.${msec}` : msec;
  return `${year + mon + day + hour + min + sec + msec}Z`;
}

/**
 * GeneralizedTime or UTCTime string to seconds from Unix origin
 * @param s - GeneralizedTime or UTCTime string (ex. 20170412235959.384Z)
 * @return seconds from Unix origin time (i.e. Jan 1, 1970 0:00:00 UTC)
 *
 * @description
 * This function converts from GeneralizedTime string (i.e. YYYYMMDDHHmmSSZ) or
 * UTCTime string (i.e. YYMMDDHHmmSSZ) to seconds from Unix origin time
 * (i.e. Jan 1 1970 0:00:00 UTC). Argument string may have fraction of seconds
 * however result value will be omitted.
 * As for UTCTime, if year "YY" is equal or less than 49 then it is 20YY.
 * If year "YY" is equal or greater than 50 then it is 19YY.
 *
 * @example
 * zulutosec(  "071231235959Z")       -> 1199145599 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutosec(  "071231235959.1Z")     -> 1199145599 #Mon, 31 Dec 2007 23:59:59 GMT
 * zulutosec("20071231235959Z")       -> 1199145599 #Mon, 31 Dec 2007 23:59:59 GMT
 */
export function zulutosec(s: string): number {
  return Math.round(zulutomsec(s) / 1000.0);
}

/**
 * GeneralizedTime or UTCTime string to Date object
 * @param s - GeneralizedTime or UTCTime string (ex. 20170412235959.384Z)
 * @return Date object for specified time
 *
 * @description
 * This function converts from GeneralizedTime string (i.e. YYYYMMDDHHmmSSZ) or
 * UTCTime string (i.e. YYMMDDHHmmSSZ) to Date object.
 * Argument string may have fraction of seconds and
 * its length is one or more digits such as "20170410235959.1234567Z".
 * As for UTCTime, if year "YY" is equal or less than 49 then it is 20YY.
 * If year "YY" is equal or greater than 50 then it is 19YY.
 *
 * @example
 * zulutodate(  "071231235959Z").toUTCString()   -> "Mon, 31 Dec 2007 23:59:59 GMT"
 * zulutodate(  "071231235959.1Z").toUTCString() -> "Mon, 31 Dec 2007 23:59:59 GMT"
 * zulutodate("20071231235959Z").toUTCString()   -> "Mon, 31 Dec 2007 23:59:59 GMT"
 * zulutodate(  "071231235959.34Z").getMilliseconds() -> 340
 */
export function zulutodate(s: string): Date {
  return new Date(zulutomsec(s));
}

/**
 * Date object to zulu time string
 * @param d - Date object for specified time
 * @param flagUTCTime - if this is true year will be YY otherwise YYYY
 * @param flagMilli - if this is true result concludes milliseconds
 * @return GeneralizedTime or UTCTime string (ex. 20170412235959.384Z)
 *
 * @description
 * This function converts from Date object to GeneralizedTime string (i.e. YYYYMMDDHHmmSSZ) or
 * UTCTime string (i.e. YYMMDDHHmmSSZ).
 * As for UTCTime, if year "YY" is equal or less than 49 then it is 20YY.
 * If year "YY" is equal or greater than 50 then it is 19YY.
 * If flagMilli is true its result concludes milliseconds such like
 * "20170520235959.42Z".
 *
 * @example
 * d = new Date(Date.UTC(2017,4,20,23,59,59,670));
 * datetozulu(d) -> "20170520235959Z"
 * datetozulu(d, true) -> "170520235959Z"
 * datetozulu(d, false, true) -> "20170520235959.67Z"
 */
export function datetozulu(
  d: Date,
  flagUTCTime = false,
  flagMilli = false,
): string {
  let s: string;
  const year = d.getUTCFullYear();
  if (flagUTCTime) {
    if (year < 1950 || 2049 < year)
      throw new Error(`not proper year for UTCTime: ${year}`);
    s = `${year}`.slice(-2);
  } else {
    s = `000${year}`.slice(-4);
  }
  s += `0${d.getUTCMonth() + 1}`.slice(-2);
  s += `0${d.getUTCDate()}`.slice(-2);
  s += `0${d.getUTCHours()}`.slice(-2);
  s += `0${d.getUTCMinutes()}`.slice(-2);
  s += `0${d.getUTCSeconds()}`.slice(-2);
  if (flagMilli) {
    const milli = d.getUTCMilliseconds();
    if (milli !== 0) {
      let sMilli = `00${milli}`.slice(-3);
      sMilli = sMilli.replace(/0+$/g, "");
      s += `.${sMilli}`;
    }
  }
  s += "Z";
  return s;
}

/**
 * GeneralizedTime or UTCTime string to GeneralizedTime
 * @param s - GeneralizedTime or UTCTime string (ex. 20170412235959.384Z)
 * @return GeneralizedTime
 *
 * @description
 * This function converts UTCTime string (i.e. YYMMDDHHmmSSZ ) to
 * GeneralizedTime (YYYYMMDDHHmmSSZ) when the argument 's' is UTCTime.
 * Argument string may have fraction of seconds and
 * its length is one or more digits such as "170410235959.1234567Z".
 * As for UTCTime, if year "YY" is equal or less than 49 then it is 20YY.
 * If year "YY" is equal or greater than 50 then it is 19YY.
 *
 * @example
 * timetogen(  "071231235959Z") -> "20071231235959Z"
 * timetogen(  "971231235959Z") -> "19971231235959Z"
 * timetogen("20071231235959Z") -> "20071231235959Z"
 * timetogen(  "971231235959.123Z") -> "19971231235959.123Z"
 */
export function timetogen(s: string): string {
  if (s.match(/^[0-9]{12}Z$/) || s.match(/^[0-9]{12}[.][0-9]*Z$/)) {
    return s.match(/^[0-4]/) ? `20${s}` : `19${s}`;
  }
  return s;
}

/**
 * convert GeneralizedTime or UTCTime string to ISO8601 time string
 * @param s - GeneralizedTime or UTCTime string (ex. 20170412235959Z)
 * @return ISO8601 time string (ex. 2020-07-14T13:03:42Z)
 * @since 0.8.0
 *
 * @example
 * zulutoiso8601(  "071231235959Z") -> "2007-12-31T23:59:59Z"
 * zulutoiso8601(  "971231235959Z") -> "1997-12-31T23:59:59Z"
 * zulutoiso8601("20071231235959Z") -> "2007-12-31T23:59:59Z"
 * zulutoiso8601( "0071231235959Z") -> raise error
 * zulutoiso8601(     "aaaaaaaaaa") -> raise error
 */
export function zulutoiso8601(s: string): string {
  const m = s.match(/^(\d{2,4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) {
    throw new Error(
      "Invalid format: expected YYYYMMDDHHmmssZ or YYYYMMDDHHmmssZ",
    );
  }

  const [, y, mm, dd, hh, min, ss] = m;
  let y2: string = y;
  if (y2.length === 2) {
    if (parseInt(y2.slice(0, 1)) < 5) {
      y2 = `20${y2}`;
    } else {
      y2 = `19${y2}`;
    }
  }

  return `${y2}-${mm}-${dd}T${hh}:${min}:${ss}Z`;
}
