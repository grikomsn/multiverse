import * as React from "react";

import { defaultComponents } from "@/ui/markdown/components";

import { MDXProvider } from "@mdx-js/react";

export default function MarkdownProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <MDXProvider components={defaultComponents}>
      {children}
      {/*  */}
    </MDXProvider>
  );
}
