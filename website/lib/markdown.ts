import type { Element } from "hast";
import type { SerializeOptions } from "next-mdx-remote/dist/types";
import type { Options as RehypeAutolinkHeadingsOptions } from "rehype-autolink-headings";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Options } from "rehype-pretty-code";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { LinkIconHast } from "ui/icon/link";

export const rehypeAutolinkHeadingsOptions: RehypeAutolinkHeadingsOptions = {
  content: () => [
    {
      type: "element",
      tagName: "span",
      properties: { "data-heading-link": "" },
      children: [LinkIconHast],
    },
  ],
};

export const rehypePrettyCodeOptions: Partial<Options> = {
  onVisitHighlightedLine<T extends Element>(node: T) {
    if (node.properties && Array.isArray(node.properties.className)) {
      node.properties.className.push("highlighted");
    }
  },
  onVisitHighlightedWord<T extends Element>(node: T) {
    if (node.properties) {
      node.properties.className = ["word"];
    }
  },
  onVisitLine<T extends Element>(node: T) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
  theme: "github-dark",
};

export interface GetMdxOptionsArgs {
  toc?: boolean;
}

export const getMdxOptions = (args: GetMdxOptionsArgs = {}): SerializeOptions["mdxOptions"] => ({
  rehypePlugins: [
    rehypeSlug,
    args.toc ? {} : {}, // TODO
    [rehypeAutolinkHeadings, rehypeAutolinkHeadingsOptions],
    [rehypePrettyCode, rehypePrettyCodeOptions],
  ],
  remarkPlugins: [remarkGfm],
});
