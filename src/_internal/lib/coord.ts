export type Coord = [x: number, y: number];

export function coord([x, y]: Coord): string {
  return `${x},${y}`;
}

export function uncoord(str: string): Coord {
  return str.split(",").map((n) => parseInt(n)) as Coord;
}

export function coordComparator(a: Coord, b: Coord): number {
  return a[0] === b[0] ? Math.sign(a[1] - b[1]) : Math.sign(a[0] - b[0]);
}
