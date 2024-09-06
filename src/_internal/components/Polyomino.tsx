import Link from "next/link";
import { memo } from "react";
import { Coord } from "../lib/coord";
import { defaultRenderOptions } from "../lib/defaultRenderOptions";
import { renderToSvg, RenderToSvgOptions } from "../lib/renderToSvg";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoProps extends RenderToSvgOptions {
  polyomino: Coord[];
  width: string | number;
  height: string | number;
}

function PolyominoInternal(props: PolyominoProps) {
  const { polyomino, width, height } = props;
  const svgString = renderToSvg(polyomino, {
    ...defaultRenderOptions(polyomino),
    ...props,
    skipSize: true,
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
