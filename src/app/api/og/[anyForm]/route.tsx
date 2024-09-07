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

  const svg = renderToSvg(polyomino, {
    ...defaultRenderOptions(polyomino),
    contain: [1200, 630],
    backgroundColor: "white",
  });

  return new ImageResponse(
    (
      <img
        src={`data:image/svg+xml;base64,${btoa(svg)}`}
        width={1200}
        height={630}
      />
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
