import { Coord } from "./coord";
import { normalize } from "./normalize";

export function rotate(input: Coord[]): Coord[] {
  return normalize(input.map(([x, y]) => [-y, x]));
}
