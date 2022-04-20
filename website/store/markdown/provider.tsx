import { MDXProvider } from "@mdx-js/react";
import type { ReactNode } from "react";
import { components } from "ui/markdown/components";

export interface MarkdownProviderProps {
  children: ReactNode;
}

export function MarkdownProvider({ children }: MarkdownProviderProps) {
  return (
    <MDXProvider components={components} disableParentContext>
      {children}
    </MDXProvider>
  );
}
