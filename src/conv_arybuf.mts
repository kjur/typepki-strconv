/**
 * convert a hexadecimal string to an ArrayBuffer
 * @param hex - hexadecimal string
 * @return ArrayBuffer
 *
 * @description
 * This function converts from a hexadecimal string to an ArrayBuffer.
 *
 * @example
 * hextoArrayBuffer("fffa01") -> ArrayBuffer of [255, 250, 1]
 */
export function hextoArrayBuffer(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) throw "input is not even length";
  if (hex.match(/^[0-9A-Fa-f]+$/) == null) throw "input is not hexadecimal";

  const buffer = new ArrayBuffer(hex.length / 2);
  const view = new DataView(buffer);

  for (let i = 0; i < hex.length / 2; i++) {
    view.setUint8(i, parseInt(hex.substr(i * 2, 2), 16));
  }

  return buffer;
}

// ==== ArrayBuffer / hex =================================

/**
 * convert an ArrayBuffer to a hexadecimal string
 * @param buffer - ArrayBuffer
 * @return hexadecimal string
 *
 * @description
 * This function converts from an ArrayBuffer to a hexadecimal string.
 *
 * @example
 * var buffer = new ArrayBuffer(3);
 * var view = new DataView(buffer);
 * view.setUint8(0, 0xfa);
 * view.setUint8(1, 0xfb);
 * view.setUint8(2, 0x01);
 * ArrayBuffertohex(buffer) -> "fafb01"
 */
export function ArrayBuffertohex(buffer: ArrayBuffer): string {
  let hex = "";
  const view = new DataView(buffer);

  for (let i = 0; i < buffer.byteLength; i++) {
    hex += `00${view.getUint8(i).toString(16)}`.slice(-2);
  }

  return hex;
}
