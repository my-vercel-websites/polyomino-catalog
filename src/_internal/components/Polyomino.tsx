import Link from "next/link";
import { memo } from "react";
import { canonizeFree } from "../lib/canonizeFree";
import { Coord } from "../lib/coord";
import { hsvToRgb } from "../lib/hsvToRgb";
import { renderToSvg, RenderToSvgOptions } from "../lib/renderToSvg";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoProps extends RenderToSvgOptions {
  polyomino: Coord[];
  width: string | number;
  height: string | number;
}

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

function PolyominoInternal(props: PolyominoProps) {
  const { polyomino, width, height, fillColorHexCode, strokeColorHexCode } =
    props;
  const [hue, other] = simpleHash(toString(canonizeFree(polyomino)));
  const randomFillColor = hsvToRgbHexCode(
    hue,
    other / 2 + 0.5,
    other / 4 + 0.75
  );
  const randomStrokeColor = hsvToRgbHexCode(
    (hue + 0.5) % 1,
    other / 2,
    other / 4
  );
  const noColorProvided = !fillColorHexCode && !strokeColorHexCode;
  const svgString = renderToSvg(polyomino, {
    ...props,
    skipSize: true,
    fillColorHexCode: noColorProvided ? randomFillColor : fillColorHexCode,
    strokeColorHexCode: noColorProvided
      ? randomStrokeColor
      : strokeColorHexCode,
  });
  const href = `/${[toString(toBuffer(props.polyomino))]}`;

  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundImage: `url(data:image/svg+xml;base64,${btoa(svgString)})`,
        width,
        height,
      }}
    />
  );
}

export const Polyomino = memo(PolyominoInternal);
