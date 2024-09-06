import { canonizeFree } from "./canonizeFree";
import { Coord } from "./coord";
import { hsvToRgb } from "./hsvToRgb";
import { RenderToSvgOptions } from "./renderToSvg";
import { toString } from "./toString";

function simpleHash(str: string): [hue: number, other: number] {
  let hash = 42;

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 3) - hash + str.charCodeAt(i) * 0x42042042;
    hash = hash & hash;
  }

  const hue = (hash & 0xffff) / 0x10000;
  const other = (hash & 0xff0000) / 0x1000000;

  return [hue, other];
}

function toHex(value: number): string {
  const hex = value.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

function hsvToRgbHexCode(h: number, s: number, v: number): string {
  const [r, g, b] = hsvToRgb(h, s, v);
  return `${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function defaultRenderOptions(polyomino: Coord[]): RenderToSvgOptions {
  const [hue, other] = simpleHash(toString(canonizeFree(polyomino)));
  const fillColorHexCode = hsvToRgbHexCode(
    hue,
    other / 2 + 0.5,
    other / 4 + 0.75
  );
  const strokeColorHexCode = hsvToRgbHexCode(
    (hue + 0.5) % 1,
    other / 2,
    other / 4
  );
  return {
    fillColorHexCode,
    strokeColorHexCode,
  };
}
