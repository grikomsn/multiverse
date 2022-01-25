import theme from "../shiki-theme.cjs";

/** @type {import("rehype-pretty-code").Options} */
export const prettyCodeOptions = {
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlight-line");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = "highlight-word";
  },
  theme,
};
