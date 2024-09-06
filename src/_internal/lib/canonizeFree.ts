import { canonizeFixed } from "./canonizeFixed";
import { Coord } from "./coord";
import { rotate } from "./rotate";
import { toBuffer } from "./toBuffer";
import { transpose } from "./transpose";

function Uint8ArrayComparator(a: Uint8Array, b: Uint8Array): number {
  const minLength = Math.min(a.length, b.length);

  for (let i = 0; i < minLength; i++) {
    if (a[i] < b[i]) {
      return -1;
    } else if (a[i] > b[i]) {
      return 1;
    }
  }

  if (a.length < b.length) {
    return -1;
  } else if (a.length > b.length) {
    return 1;
  }

  return 0;
}

export function canonizeFree(fixed: Coord[]): Uint8Array {
  const canonizedFixed = canonizeFixed(fixed);
  const c90 = canonizeFixed(rotate(fixed));
  const c180 = canonizeFixed(rotate(c90));
  const c270 = canonizeFixed(rotate(c180));
  const transposed = canonizeFixed(transpose(fixed));
  const t90 = canonizeFixed(rotate(transposed));
  const t180 = canonizeFixed(rotate(t90));
  const t270 = canonizeFixed(rotate(t180));
  const canonizedFixedBuffer = toBuffer(canonizedFixed);
  const c90Buffer = toBuffer(c90);
  const c180Buffer = toBuffer(c180);
  const c270Buffer = toBuffer(c270);
  const transposedBuffer = toBuffer(transposed);
  const t90Buffer = toBuffer(t90);
  const t180Buffer = toBuffer(t180);
  const t270Buffer = toBuffer(t270);
  return [
    canonizedFixedBuffer,
    c90Buffer,
    c180Buffer,
    c270Buffer,
    transposedBuffer,
    t90Buffer,
    t180Buffer,
    t270Buffer,
  ].sort(Uint8ArrayComparator)[0];
}
