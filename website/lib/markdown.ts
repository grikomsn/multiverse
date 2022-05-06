/* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */

import type { SerializeOptions } from "next-mdx-remote/dist/types";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
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
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        content: (_node) => [
          { type: "element", tagName: "span", properties: { "data-heading-link": "" }, children: [linkSvgHast] },
        ],
      },
    ],
    [rehypePrettyCode, rehypePrettyCodeOptions],
  ],
  remarkPlugins: [remarkGfm],
};

const linkSvgHast = {
  type: "element",
  tagName: "svg",
  properties: {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
  },
  children: [
    {
      type: "element",
      tagName: "path",
      properties: { d: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" },
    },
    {
      type: "element",
      tagName: "path",
      properties: { d: "M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" },
    },
  ],
};

/* eslint-enable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
