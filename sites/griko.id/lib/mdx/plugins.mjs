import { prettyCodeOptions } from "../rehype/pretty-code.mjs";
import remarkTwemoji from "../remark/twemoji.mjs";

import { nodeTypes } from "@mdx-js/mdx";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkToc from "remark-toc";

/** @type {import("unified").PluggableList} */
export const rehypePlugins = [
  [rehypeRaw, { passThrough: nodeTypes }],
  [rehypePrettyCode, prettyCodeOptions],
  rehypeSlug,
  //
];

/** @type {import("unified").PluggableList} */
export const remarkPlugins = [
  remarkFrontmatter,
  [remarkMdxFrontmatter, { name: "frontmatter" }],
  remarkGfm,
  remarkToc,
  remarkTwemoji,
  //
];
