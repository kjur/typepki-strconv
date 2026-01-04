import { describe, expect, test } from "bun:test";

import {
  datetozulu,
  msectozulu,
  zulutodate,
  zulutoiso8601,
  zulutomsec,
  zulutosec,
} from "./index.mts";

test("zulutomsec", () => {
  expect(zulutomsec("071231235959Z")).toBe(1199145599000); // Mon, 31 Dec 2007 23:59:59 GMT
  expect(zulutomsec("071231235959.1Z")).toBe(1199145599100); // Mon, 31 Dec 2007 23:59:59 GMT
  expect(zulutomsec("071231235959.12345Z")).toBe(1199145599123); // Mon, 31 Dec 2007 23:59:59 GMT
  expect(zulutomsec("20071231235959Z")).toBe(1199145599000); // Mon, 31 Dec 2007 23:59:59 GMT
  //expect(zulutomsec(  "931231235959Z"      )).toBe(-410227201000); // Mon, 31 Dec 1956 23:59:59 GMT
});

test("msectozulu", () => {
  expect(msectozulu(1199145599000)).toBe("20071231235959Z"); // Mon, 31 Dec 2007 23:59:59     GMT
  expect(msectozulu(1199145599100)).toBe("20071231235959.1Z"); // Mon, 31 Dec 2007 23:59:59.1   GMT
  expect(msectozulu(1199145599123)).toBe("20071231235959.123Z"); // Mon, 31 Dec 2007 23:59:59.123 GMT
});

test("zulutosec", () => {
  expect(zulutosec("071231235959Z")).toBe(1199145599); // Mon, 31 Dec 2007 23:59:59 GMT
  expect(zulutosec("071231235959.1Z")).toBe(1199145599); // Mon, 31 Dec 2007 23:59:59 GMT
  expect(zulutosec("20071231235959Z")).toBe(1199145599); // Mon, 31 Dec 2007 23:59:59 GMT
});

test("zulutodate", () => {
  expect(zulutodate("071231235959Z").toUTCString()).toBe(
    "Mon, 31 Dec 2007 23:59:59 GMT",
  );
  expect(zulutodate("071231235959.1Z").toUTCString()).toBe(
    "Mon, 31 Dec 2007 23:59:59 GMT",
  );
  expect(zulutodate("20071231235959Z").toUTCString()).toBe(
    "Mon, 31 Dec 2007 23:59:59 GMT",
  );
  expect(zulutodate("071231235959.34Z").getMilliseconds()).toBe(340);
});

test("datetozulu", () => {
  const d = new Date(Date.UTC(2017, 4, 20, 23, 59, 59, 670));
  expect(datetozulu(d)).toBe("20170520235959Z");
  expect(datetozulu(d, true)).toBe("170520235959Z");
  expect(datetozulu(d, false, true)).toBe("20170520235959.67Z");
});

test("zulutoiso8601", () => {
  expect(zulutoiso8601("071231235959Z")).toBe("2007-12-31T23:59:59Z");
  expect(zulutoiso8601("471231235959Z")).toBe("2047-12-31T23:59:59Z");
  expect(zulutoiso8601("501231235959Z")).toBe("1950-12-31T23:59:59Z");
  expect(zulutoiso8601("971231235959Z")).toBe("1997-12-31T23:59:59Z");
  expect(zulutoiso8601("20071231235959Z")).toBe("2007-12-31T23:59:59Z");
  expect(() => {
    zulutoiso8601(" 0071231235959Z");
  }).toThrow(/Invalid format/);
  expect(() => {
    zulutoiso8601("aaaaaaa");
  }).toThrow(/Invalid format/);
});
