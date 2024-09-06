import { bufferEqual } from "./bufferEqual";
import { canonizeFixed } from "./canonizeFixed";
import { Coord } from "./coord";
import { rotate } from "./rotate";
import { SymmetryGroup } from "./SymmetryGroup";
import { toBuffer } from "./toBuffer";
import { transpose } from "./transpose";

export function getSymmetryGroup(
  fixed: Coord[]
): [
  symmetryGroup: SymmetryGroup,
  c0: Coord[],
  c90: Coord[],
  c180: Coord[],
  c270: Coord[],
  t0: Coord[],
  t90: Coord[],
  t180: Coord[],
  t270: Coord[]
] {
  const canonized = canonizeFixed(fixed);
  const c90 = canonizeFixed(rotate(fixed));
  const c180 = canonizeFixed(rotate(c90));
  const c270 = canonizeFixed(rotate(c180));
  const transposed = canonizeFixed(transpose(fixed));
  const t90 = canonizeFixed(rotate(transposed));
  const t180 = canonizeFixed(rotate(t90));
  const t270 = canonizeFixed(rotate(t180));
  const canonizedFixedBuffer = toBuffer(canonized);
  const c90Buffer = toBuffer(c90);
  const c180Buffer = toBuffer(c180);
  const transposedBuffer = toBuffer(transposed);
  const t90Buffer = toBuffer(t90);
  const t180Buffer = toBuffer(t180);
  const t270Buffer = toBuffer(t270);
  const part = [
    canonized,
    c90,
    c180,
    c270,
    transposed,
    t90,
    t180,
    t270,
  ] as const;

  if (bufferEqual(canonizedFixedBuffer, c90Buffer)) {
    if (bufferEqual(canonizedFixedBuffer, transposedBuffer)) {
      return ["All", ...part];
    }
    return ["Rotation4Fold", ...part];
  } else if (
    bufferEqual(canonizedFixedBuffer, transposedBuffer) ||
    bufferEqual(canonizedFixedBuffer, t180Buffer)
  ) {
    if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
      return ["Rotation2FoldMirror45", ...part];
    }
    return ["Mirror45", ...part];
  } else if (
    bufferEqual(canonizedFixedBuffer, t90Buffer) ||
    bufferEqual(canonizedFixedBuffer, t270Buffer)
  ) {
    if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
      return ["Rotation2FoldMirror90", ...part];
    }
    return ["Mirror90", ...part];
  } else if (bufferEqual(canonizedFixedBuffer, c180Buffer)) {
    return ["Rotation2Fold", ...part];
  }
  return ["None", ...part];
}
