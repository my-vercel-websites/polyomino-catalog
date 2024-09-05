import { complementaryColor } from "./complementaryColor";
import { Coord } from "./coord";

export interface RenderToSvgOptions {
  cellSize?: number;
  backgroundColor?: string;
  fillColorHexCode?: string;
  strokeColorHexCode?: string;
  strokeWidth?: number;
  offset?: number;
}

export function renderToSvg(
  polyomino: Coord[],
  {
    cellSize = 100,
    backgroundColor,
    fillColorHexCode,
    strokeColorHexCode,
    strokeWidth = 20,
    offset = 50,
  }: RenderToSvgOptions = {}
): string {
  const minX = Math.min(...polyomino.map((c) => c[0]));
  const minY = Math.min(...polyomino.map((c) => c[1]));
  const maxX = Math.max(...polyomino.map((c) => c[0]));
  const maxY = Math.max(...polyomino.map((c) => c[1]));

  if (fillColorHexCode && !strokeColorHexCode) {
    strokeColorHexCode = complementaryColor(fillColorHexCode);
  } else if (strokeColorHexCode && !fillColorHexCode) {
    fillColorHexCode = complementaryColor(strokeColorHexCode);
  } else {
    fillColorHexCode = "ADD8E6";
    strokeColorHexCode = "000000";
  }

  const width = (maxX - minX + 1) * cellSize;
  const height = (maxY - minY + 1) * cellSize;

  const svgParts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
      width + offset * 2
    } ${height + offset * 2}" width="${width + offset * 2}" height="${
      height + offset * 2
    }">`,
  ];

  if (backgroundColor && backgroundColor !== "transparent") {
    svgParts.push(
      `<rect x="0" y="0" width="${width + offset * 2}" height="${
        height + offset * 2
      }" fill="${backgroundColor}" />`
    );
  }

  polyomino.forEach(([x, y]) => {
    const rectX = offset + (x - minX) * cellSize;
    const rectY = offset + (y - minY) * cellSize;
    svgParts.push(
      `<rect x="${rectX}" y="${rectY}" width="${cellSize}" height="${cellSize}" fill="#${fillColorHexCode}" stroke="#${strokeColorHexCode}" stroke-width="${strokeWidth}"/>`
    );
  });

  svgParts.push("</svg>");

  return svgParts.join("");
}
