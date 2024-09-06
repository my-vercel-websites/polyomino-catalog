import { Coord } from "./coord";

export function toBuffer(input: Coord[]): Uint8Array {
  const buffer = new Uint8Array(input.length * 2);

  input.forEach((coord, index) => {
    const [x, y] = coord;

    if (
      x < 0 ||
      x > 255 ||
      y < 0 ||
      y > 255 ||
      x !== Math.floor(x) ||
      y !== Math.floor(y)
    ) {
      throw new Error(
        `x and y values must be 8-bit unsigned integers (0-255). Got x: ${x}, y: ${y}`
      );
    }

    buffer[index * 2] = x;
    buffer[index * 2 + 1] = y;
  });

  return buffer;
}
