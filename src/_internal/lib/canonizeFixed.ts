import { Coord, coordComparator } from "./coord";
import { normalize } from "./normalize";

export function canonizeFixed(fixed: Coord[]): Coord[] {
  return normalize(fixed).sort(coordComparator);
}
