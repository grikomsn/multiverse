import theme from "./shiki-theme.cjs";

import { createRemarkPlugin } from "@atomiks/mdx-pretty-code";

const remarkPrettyCode = createRemarkPlugin({
  onVisitLine(_node) {
    //
  },
  onVisitHighlightedLine(node) {
    node.classList.add("highlight-line");
  },
  onVisitHighlightedWord(node) {
    node.classList.add("highlight-word");
  },
  shikiOptions: {
    theme,
  },
});

export default remarkPrettyCode;
