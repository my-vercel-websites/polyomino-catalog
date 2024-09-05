import { Metadata } from "next";

import { notFound } from "next/navigation";
import { fromBuffer } from "../../_internal/lib/fromBuffer";
import { isValid } from "../../_internal/lib/isValid";
import { renderToSvg } from "../../_internal/lib/renderToSvg";
import { PolyominoPage } from "../../_internal/pages/PolyominoPage";

interface Params {
  params: Record<"anyForm", string>;
}

export default async function Page({ params }: Params) {
  const anyForm = params.anyForm;
  const polyomino = isValid(anyForm);
  if (!polyomino) throw notFound();

  return <PolyominoPage polyomino={polyomino} />;
}

export function generateMetadata({ params }: Params): Metadata {
  const anyForm = params.anyForm;
  const title = `Polyomino ${anyForm}`;
  const polyominoCoords = fromBuffer(Buffer.from(anyForm, "base64"));
  const svgString = renderToSvg(polyominoCoords, { backgroundColor: "white" });
  const base64Svg = Buffer.from(svgString).toString("base64");
  const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

  return {
    title,
    openGraph: {
      title,
      images: imageUrl,
    },
  };
}
