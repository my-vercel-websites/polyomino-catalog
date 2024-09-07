import Link from "next/link";
import { memo, MouseEvent } from "react";
import { Coord } from "../lib/coord";
import { defaultRenderOptions } from "../lib/defaultRenderOptions";
import { renderToSvg, RenderToSvgOptions } from "../lib/renderToSvg";
import { toBuffer } from "../lib/toBuffer";
import { toString } from "../lib/toString";

export interface PolyominoProps extends RenderToSvgOptions {
  polyomino: Coord[];
  width: string | number;
  height: string | number;
  onClick?: (e: MouseEvent) => void;
}

function PolyominoInternal(props: PolyominoProps) {
  const { polyomino, width, height, onClick } = props;
  const svgString = renderToSvg(polyomino, {
    ...defaultRenderOptions(polyomino),
    ...props,
    skipSize: true,
  });
  const href = `/${[toString(toBuffer(props.polyomino))]}`;
  const name = toString(toBuffer(polyomino));

  return (
    <Link
      href={href}
      onClick={onClick}
      className="focus:outline-none focus:ring-2 focus:ring-primary"
    >
      <img
        className="w-full h-full"
        style={{ width, height }}
        src={`data:image/svg+xml;base64,${btoa(svgString)}`}
        alt={`Polyomino ${name}`}
      />
    </Link>
  );
}

export const Polyomino = memo(PolyominoInternal);
