import { ReactNode, useMemo } from "react";
import { Coord } from "../lib/coord";
import { renderToSvg } from "../lib/renderToSvg";
import { SymmetryGroup } from "../lib/SymmetryGroup";

export interface ColorPageProps {
  polyomino: Coord[];
  canonical: Coord[];
  symmetryGroup: SymmetryGroup;
}

export function PolyominoPage({
  polyomino,
  canonical,
  symmetryGroup,
}: ColorPageProps): ReactNode {
  const svgString = useMemo(() => renderToSvg(polyomino), [polyomino]);

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: svgString }}></div>
      Hello world!
    </div>
  );
}
