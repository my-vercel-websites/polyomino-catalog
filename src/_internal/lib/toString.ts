export function toString(buffer: Buffer): string {
  let result = buffer.toString("base64");
  while (result.endsWith("=")) {
    result = result.slice(0, -1);
  }
  return result;
}
