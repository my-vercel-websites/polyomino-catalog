import { Metadata } from "next";

import MainPage, {
  generateMetadata as mainGenerateMetaData,
} from "./[anyForm]/page";

const DEFAULT = "AAA";

export default async function Page() {
  return MainPage({ params: { anyForm: DEFAULT } });
}

export function generateMetadata(): Metadata {
  return mainGenerateMetaData({ params: { anyForm: DEFAULT } });
}
