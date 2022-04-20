import type { MDXComponents } from "mdx/types";
import { AnchorCompat } from "ui/core/anchor";
import { PolyglotParagraph } from "ui/core/polyglot-paragaph";

export const components: MDXComponents = {
  a: AnchorCompat,
  p: PolyglotParagraph,
  strong: (props) => <b {...props} />,
};
