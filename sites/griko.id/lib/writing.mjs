// @ts-check

import { getFrontmatter, loadFilenames } from "./mdx/loader.mjs";

export function loadPostFilenames() {
  return loadFilenames("/content/posts");
}

export async function loadPostFrontmatterEntries() {
  const paths = await loadPostFilenames();

  const postEntries = await Promise.all(
    paths.map((path) =>
      import(`../content/posts/${path}.mdx`).then(
        /** @returns {import("./mdx/types").FrontmatterEntry} */
        function mapper(mod) {
          return [path, getFrontmatter(mod)];
        },
      ),
    ),
  );

  return postEntries.sort(([, a], [, b]) => b.date.getTime() - a.date.getTime());
}
