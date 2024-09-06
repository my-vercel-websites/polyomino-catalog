export function toString(buffer: Uint8Array): string {
  let binaryString = "";
  for (const element of buffer) {
    binaryString += String.fromCharCode(element);
  }

  let result = btoa(binaryString);
  while (result.endsWith("=")) {
    result = result.slice(0, -1);
  }

  return result;
}
