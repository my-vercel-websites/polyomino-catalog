import { memo, ReactNode } from "react";
import { Polyomino } from "../components/Polyomino";
import { canonizeFixed } from "../lib/canonizeFixed";
import { coord, Coord } from "../lib/coord";
import { getSymmetryGroup } from "../lib/getSymmetryGroup";
import { isValid } from "../lib/isValid";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoPageProps {
  getSymmetryGroupResult: ReturnType<typeof getSymmetryGroup>;
}

const directions: Coord[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

function RelatedInternal({ getSymmetryGroupResult }: PolyominoPageProps) {
  const [_, polyomino] = getSymmetryGroupResult;

  const others = getSymmetryGroupResult.slice(2) as Coord[][];
  const symmetryPolyominoes: Coord[][] = [];
  const symmetryPolyominoSet = new Set<string>([polyomino.map(coord).join()]);
  for (const other of others) {
    const key = other.map(coord).join();
    if (symmetryPolyominoSet.has(key)) {
      continue;
    } else {
      symmetryPolyominoSet.add(key);
      symmetryPolyominoes.push(other);
    }
  }

  const subtract: Coord[][] = [];
  const subtractSet = new Set<string>();
  for (const coord of polyomino) {
    const subtracted = canonizeFixed(polyomino.filter((arr) => arr !== coord));
    const string = toString(toBuffer(subtracted));
    if (isValid(string) && !subtractSet.has(string)) {
      subtractSet.add(string);
      subtract.push(subtracted);
    }
  }

  const add: Coord[][] = [];
  const addSet = new Set<string>();
  for (const [x, y] of polyomino) {
    for (const [dirX, dirY] of directions) {
      const added = canonizeFixed([...polyomino, [x + dirX, y + dirY]]);
      const string = toString(toBuffer(added));
      if (
        new Set(added.map(coord)).size === added.length &&
        isValid(string) &&
        !addSet.has(string)
      ) {
        addSet.add(string);
        add.push(added);
      }
    }
  }

  const similarPolyominoes = [...subtract, ...add];

  return (
    <>
      {!symmetryPolyominoes.length ? (
        <div>No symmetry polyominoes.</div>
      ) : (
        <div>
          Related symmetry polyominoes:{" "}
          {symmetryPolyominoes.map((symmetryPolyomino, i) => (
            <Polyomino
              key={i}
              polyomino={symmetryPolyomino}
              width={100}
              height={100}
            />
          ))}
        </div>
      )}
      <div>
        Other similar polyominoes:{" "}
        {similarPolyominoes.map((symmetryPolyomino, i) => (
          <Polyomino
            key={i}
            polyomino={symmetryPolyomino}
            width={100}
            height={100}
          />
        ))}
      </div>
    </>
  );
}

const Related = memo(RelatedInternal);

export function PolyominoPage({
  getSymmetryGroupResult,
}: PolyominoPageProps): ReactNode {
  const [symmetryGroup, polyomino] = getSymmetryGroupResult;

  return (
    <div>
      <Polyomino polyomino={polyomino} width="100%" height="40vw" />
      <div>Symmetry Group: {symmetryGroup}</div>
      <Related getSymmetryGroupResult={getSymmetryGroupResult} />
    </div>
  );
}
