// @ts-check

import { getFrontmatter, loadFilenames } from "./mdx/loader.mjs";

export function loadPageFilenames() {
  return loadFilenames("/content/pages");
}

export async function loadPageFrontmatterEntries() {
  const paths = await loadPageFilenames();

  const pageEntries = await Promise.all(
    paths.map((path) =>
      import(`../content/pages/${path}.mdx`).then(
        /** @returns {import("./remark/types").FrontmatterEntry} */
        function mapper(mod) {
          return [path, getFrontmatter(mod)];
        },
      ),
    ),
  );

  return pageEntries.sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());
}
