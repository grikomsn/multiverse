import remarkPrettyCode from "./pretty-code.mjs";
import remarkTwemoji from "./twemoji.mjs";

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

export const WebpackMdxLoader = {
  loader: "@mdx-js/loader",
  /** @type {import('@mdx-js/loader').Options} */
  options: {
    jsx: true,
    providerImportSource: "@mdx-js/react",
    rehypePlugins,
    remarkPlugins,
    useDynamicImport: true,
  },
};
