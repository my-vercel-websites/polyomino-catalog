import { PropsWithChildren } from "react";

import { ModeContextProvider } from "@-ft/mode-next";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
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
