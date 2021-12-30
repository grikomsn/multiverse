// @ts-check

import cwd from "@packages/utils/cwd.cjs";
import fs from "fs/promises";

/**
 * @param {any} obj
 * @returns {import("./remark/types").Frontmatter}
 */
export function getFrontmatter(obj) {
  return obj.frontmatter;
}

export async function loadPostFilenames() {
  const filenames = await fs.readdir(cwd("/content/posts"));

  const paths = filenames.reduce((/** @type {string[]} */ acc, val) => {
    if (val.endsWith(".mdx")) {
      acc.push(val.split(".mdx")[0]);
    }
    return acc;
  }, []);

  return paths;
}

export async function loadPostFrontmatterEntries() {
  const paths = await loadPostFilenames();

  const postEntries = await Promise.all(
    paths.map((path) =>
      import(`@/content/posts/${path}.mdx`).then(
        /** @returns {import("./remark/types").FrontmatterEntry} */
        function mapper(mod) {
          return [path, getFrontmatter(mod)];
        },
      ),
    ),
  );

  return postEntries.sort(sortPostFrontmatterFn);
}

export async function loadPostFrontmatterRecord() {
  const postEntries = await loadPostFrontmatterEntries();
  return Object.fromEntries(postEntries);
}

/**
 * @param {import("./remark/types").FrontmatterEntry} a
 * @param {import("./remark/types").FrontmatterEntry} b
 */
export function sortPostFrontmatterFn([, a], [, b]) {
  return b.date.getTime() - a.date.getTime();
}
