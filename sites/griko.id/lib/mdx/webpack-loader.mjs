import { rehypePlugins, remarkPlugins } from "./plugins.mjs";

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
