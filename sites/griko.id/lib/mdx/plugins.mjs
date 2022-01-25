import remarkPrettyCode from "../remark/pretty-code.mjs";
import remarkTwemoji from "../remark/twemoji.mjs";

import { nodeTypes } from "@mdx-js/mdx";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import { remarkMdxFrontmatter } from "remark-mdx-frontmatter";
import remarkToc from "remark-toc";

// import rehypePrettyCode from "rehype-pretty-code";
// import remarkPrettyCode from "../remark/pretty-code.mjs";

/** @type {import("unified").PluggableList} */
export const rehypePlugins = [
  [rehypeRaw, { passThrough: nodeTypes }],
  // [rehypePrettyCode, prettyCodeOptions],
  rehypeSlug,
  //
];

/** @type {import("unified").PluggableList} */
export const remarkPlugins = [
  remarkFrontmatter,
  [remarkMdxFrontmatter, { name: "frontmatter" }],
  remarkGfm,
  remarkPrettyCode,
  remarkToc,
  remarkTwemoji,
  //
];
