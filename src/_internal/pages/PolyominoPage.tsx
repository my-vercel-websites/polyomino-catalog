import { ReactNode, useMemo } from "react";
import { Coord } from "../lib/coord";
import { renderToSvg } from "../lib/renderToSvg";

export interface ColorPageProps {
  polyomino: Coord[];
}

export function PolyominoPage({ polyomino }: ColorPageProps): ReactNode {
  const svgString = useMemo(() => renderToSvg(polyomino), [polyomino]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: svgString }}></div>
      Hello world!
    </div>
  );
}
