import * as React from "react";

import MarkdownProvider from "@/ui/markdown/provider";

import * as ReactDOMServer from "react-dom/server";

export function renderToString(el: React.ReactElement) {
  return ReactDOMServer.renderToString(<MarkdownProvider>{el}</MarkdownProvider>);
}
