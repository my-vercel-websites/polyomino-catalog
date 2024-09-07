import { PropsWithChildren } from "react";

import { ModeContextProvider } from "@-ft/mode-next";
import { cookies } from "next/headers";

import "./index.css";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      className={cookies().get("THEME")?.value === "dark" ? "dark" : undefined}
      suppressHydrationWarning
    >
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <script src="/mode.js" />
      </head>
      <body>
        <ModeContextProvider
          variableName="npm:@-ft/mode-codegen"
          ssrInitialMode={"system"}
        >
          {children}
        </ModeContextProvider>
      </body>
    </html>
  );
}
