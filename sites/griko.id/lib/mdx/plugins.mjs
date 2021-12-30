import remarkPrettyCode from "../remark/pretty-code.mjs";
import remarkTwemoji from "../remark/twemoji.mjs";

import { nodeTypes } from "@mdx-js/mdx";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkToc from "remark-toc";

/** @type {import("unified").PluggableList} */
export const rehypePlugins = [
  [rehypeRaw, { passThrough: nodeTypes }],
  rehypeSlug,
  //
];

/** @type {import("unified").PluggableList} */
export const remarkPlugins = [
  remarkFrontmatter,
  [remarkMdxFrontmatter, { name: "frontmatter" }],
  remarkGfm,
  remarkToc,
  remarkPrettyCode,
  remarkTwemoji,
  //
];
