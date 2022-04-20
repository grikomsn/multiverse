/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

import type { SerializeOptions } from "next-mdx-remote/dist/types";
import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";

export const rehypePrettyCodeOptions: Partial<Options> = {
  onVisitHighlightedLine(node) {
    node.properties.className.push("highlighted");
  },
  onVisitHighlightedWord(node) {
    node.properties.className = ["word"];
  },
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  theme: "github-dark",
};

export const defaultMdxOptions: SerializeOptions["mdxOptions"] = {
  rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
  remarkPlugins: [remarkGfm],
};

/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
