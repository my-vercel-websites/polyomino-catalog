import { coord, Coord, uncoord } from "./coord";
import { fromBuffer } from "./fromBuffer";

export function isValid(anyForm: string): Coord[] | undefined {
  try {
    const polyomino = fromBuffer(Buffer.from(anyForm, "base64"));

    const visited: Record<string, boolean | undefined> = Object.fromEntries(
      polyomino.map((tile) => [coord(tile), false])
    );
    function visit(str: string) {
      if (visited[str] !== false) {
        return;
      }
      visited[str] = true;
      const [x, y] = uncoord(str);
      visit(coord([x + 1, y]));
      visit(coord([x - 1, y]));
      visit(coord([x, y + 1]));
      visit(coord([x, y - 1]));
    }
    visit(coord(polyomino[0]));
    if (polyomino.some((tile) => !visited[coord(tile)])) {
      throw new Error("Invalid polyomino given");
    }

    return polyomino;
  } catch {
    return undefined;
  }
}
