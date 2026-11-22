import type { Edition } from "../../lib/editions"
import { tagSlug } from "./paths"

/** The post cards as Ghost listed them (extras, category "post"), joined with the shared posts. */
export function postsOf(edition: Edition) {
  return (edition.extras ?? [])
    .filter((extra) => extra.category?.startsWith("post"))
    .map((extra) => ({
      ...extra,
      slug: (extra.url ?? "").replace(/\//g, ""),
      featured: extra.category === "post featured",
      tags: (extra.tags ?? []).map((name) => ({ name, slug: tagSlug(name) })),
      post: edition.posts?.find((post) => post._id === extra.ref),
    }))
}

export type GhostPost = ReturnType<typeof postsOf>[number]
