/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

import type { SerializeOptions } from "next-mdx-remote/dist/types";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { LinkIconHast } from "ui/icon/link";

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
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        content: (_node) => [
          { type: "element", tagName: "span", properties: { "data-heading-link": "" }, children: [LinkIconHast] },
        ],
      },
    ],
    [rehypePrettyCode, rehypePrettyCodeOptions],
  ],
  remarkPlugins: [remarkGfm],
};

/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
