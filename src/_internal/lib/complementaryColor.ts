function clamp(value: number, min: number = 0, max: number = 255) {
  return Math.min(Math.max(value, min), max);
}

function adjustBrightness(brightness: number, value: number) {
  if (brightness > 0.5) {
    return clamp(value * 0.2);
  } else {
    return clamp(value + (255 - value) * 0.8);
  }
}

function toHex(value: number): string {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

export function complementaryColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  const reverseR = 255 - r;
  const reverseG = 255 - g;
  const reverseB = 255 - b;

  const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

  const finalR = Math.round(adjustBrightness(brightness, reverseR));
  const finalG = Math.round(adjustBrightness(brightness, reverseG));
  const finalB = Math.round(adjustBrightness(brightness, reverseB));

  return `${toHex(finalR)}${toHex(finalG)}${toHex(finalB)}`;
}
