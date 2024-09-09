import { getSymmetryGroup } from "@/_internal/lib/getSymmetryGroup";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { defaultRenderOptions } from "../../../../_internal/lib/defaultRenderOptions";
import { isValid } from "../../../../_internal/lib/isValid";
import { renderToSvg } from "../../../../_internal/lib/renderToSvg";

export async function GET(
  _request: NextRequest,
  { params }: { params: { anyForm: string } }
) {
  const { anyForm } = params;
  const polyomino = isValid(anyForm);
  if (!polyomino) {
    return new Response("Not Found", { status: 404 });
  }
  const [symmetryGroup] = getSymmetryGroup(polyomino);

  const { backgroundColor, fillColorHexCode, strokeColorHexCode } =
    defaultRenderOptions(polyomino);

  const svg = renderToSvg(polyomino, {
    fillColorHexCode,
    strokeColorHexCode,
    contain: [630, 630],
    backgroundColor: "transparent",
  });

  const badgeStyle = {
    padding: 8,
    borderRadius: 12,
    background: `#${fillColorHexCode}`,
    color: "white",
  };

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          alignItems: "center",
          backgroundColor,
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${btoa(svg)}`}
          width={630}
          height={630}
        />
        <div
          style={{
            height: "100%",
            flex: 1,
            background: `linear-gradient(to right, #FFF0, white 50%, white)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 48,
            wordBreak: "break-all",
          }}
        >
          Polyomino
          <div style={{ padding: 24 }}>{anyForm}</div>
          <div
            style={{
              display: "flex",
              gap: 12,
              fontSize: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <span style={badgeStyle}>Symmetry group: {symmetryGroup}</span>
            <span style={badgeStyle}>Tile count: {polyomino.length}</span>
            {[
              "All",
              "Rotation2FoldMirror90",
              "Rotation2FoldMirror45",
              "Rotation2Fold",
            ].includes(symmetryGroup) && (
              <span style={badgeStyle}>Rotation 2 Fold</span>
            )}
            {["All", "Rotation4Fold"].includes(symmetryGroup) && (
              <span style={badgeStyle}>Rotation 4 Fold</span>
            )}
            {["All", "Rotation2FoldMirror90", "Mirror90"].includes(
              symmetryGroup
            ) && <span style={badgeStyle}>Mirror 90°</span>}
            {["All", "Rotation2FoldMirror45", "Mirror45"].includes(
              symmetryGroup
            ) && <span style={badgeStyle}>Mirror 45°</span>}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
