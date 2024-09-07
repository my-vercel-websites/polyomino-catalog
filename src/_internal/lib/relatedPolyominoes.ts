import { canonizeFixed } from "./canonizeFixed";
import { Coord, coord } from "./coord";
import { getSymmetryGroup } from "./getSymmetryGroup";
import { isValid } from "./isValid";
import { toBuffer } from "./toBuffer";
import { toString } from "./toString";

const directions: Coord[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

export function relatedPolyominoes(
  getSymmetryGroupResult: ReturnType<typeof getSymmetryGroup>
): {
  symmetry: Coord[][];
  subtractive: Coord[][];
  additive: Coord[][];
} {
  const [_, polyomino] = getSymmetryGroupResult;

  const others = getSymmetryGroupResult.slice(2) as Coord[][];
  const symmetry: Coord[][] = [];
  const symmetrySet = new Set<string>([polyomino.map(coord).join()]);
  for (const other of others) {
    const key = other.map(coord).join();
    if (symmetrySet.has(key)) {
      continue;
    } else {
      symmetrySet.add(key);
      symmetry.push(other);
    }
  }

  const subtractive: Coord[][] = [];
  const subtractiveSet = new Set<string>();
  for (const coord of polyomino) {
    const subtracted = canonizeFixed(polyomino.filter((arr) => arr !== coord));
    const string = toString(toBuffer(subtracted));
    if (isValid(string) && !subtractiveSet.has(string)) {
      subtractiveSet.add(string);
      subtractive.push(subtracted);
    }
  }

  const additive: Coord[][] = [];
  const additiveSet = new Set<string>();
  for (const [x, y] of polyomino) {
    for (const [dirX, dirY] of directions) {
      const added = canonizeFixed([...polyomino, [x + dirX, y + dirY]]);
      const string = toString(toBuffer(added));
      if (
        new Set(added.map(coord)).size === added.length &&
        isValid(string) &&
        !additiveSet.has(string)
      ) {
        additiveSet.add(string);
        additive.push(added);
      }
    }
  }

  return { symmetry, subtractive, additive };
}
