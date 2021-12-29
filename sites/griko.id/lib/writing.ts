import { Frontmatter, FrontmatterEntry } from "@/lib/remark/types";

import cwd from "@packages/utils/cwd.cjs";
import fs from "fs/promises";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getFrontmatter(obj: any) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return obj.frontmatter as Frontmatter;
}

export async function loadPostFilenames() {
  const filenames = await fs.readdir(cwd("/content/posts"));
  const paths = filenames.reduce<string[]>((acc, val) => {
    if (val.endsWith(".mdx")) {
      acc.push(val.split(".mdx")[0]);
    }
    return acc;
  }, []);
  return paths;
}

export async function loadPostFrontmatterEntries() {
  const paths = await loadPostFilenames();
  const postEntries = await Promise.all<FrontmatterEntry>(
    paths.map((path) => import(`@/content/posts/${path}.mdx`).then((mod) => [path, getFrontmatter(mod)] as const)),
  );
  return postEntries.sort(sortPostFrontmatterFn);
}

export async function loadPostFrontmatterRecord() {
  const postEntries = await loadPostFrontmatterEntries();
  return Object.fromEntries(postEntries);
}

export function sortPostFrontmatterFn([, a]: FrontmatterEntry, [, b]: FrontmatterEntry) {
  return b.date.getTime() - a.date.getTime();
}
