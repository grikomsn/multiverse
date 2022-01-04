// @ts-check

import cwd from "@packages/utils/cwd.cjs";
import fs from "fs/promises";

/**
 * @param {any} obj
 * @returns {import("../remark/types").Frontmatter}
 */
export function getFrontmatter(obj) {
  return obj.frontmatter;
}

/**
 * @param {string} cwdPath
 */
export async function loadFilenames(cwdPath) {
  const filenames = await fs.readdir(cwd(cwdPath));

  const paths = filenames.reduce((/** @type {string[]} */ acc, val) => {
    if (val.endsWith(".mdx") && !val.startsWith("DRAFT-")) {
      acc.push(val.replace(/(^DRAFT)|(\.mdx$)/, ""));
    }
    return acc;
  }, []);

  return paths;
}
