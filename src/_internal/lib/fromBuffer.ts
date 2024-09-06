import { Coord } from "./coord";

export function fromBuffer(buffer: Uint8Array): Coord[] {
  const result: Coord[] = [];

  if (buffer.length % 2 !== 0) {
    throw new Error("Malformed buffer");
  }

  for (let i = 0; i < buffer.length; i += 2) {
    const x = buffer[i];
    const y = buffer[i + 1];
    result.push([x, y]);
  }

  return result;
}
