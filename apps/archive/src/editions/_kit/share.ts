import type { Edition } from "../../lib/editions"

/** Where a post lives today, for share links. */
export const postAddress = (slug: string) => `https://nibras.co/blog/${slug}`

/** Today's X handle without the "@", from the profile link. */
export const xHandle = (edition: Edition) => {
  const x = edition.links?.find((link) => link.platform === "x")
  return x ? (new URL(x.url).pathname.split("/").find(Boolean) ?? null) : null
}

/** An X "post" intent for a post, mentioning today's handle. */
export const shareOnX = (edition: Edition, title: string, url: string) => {
  const via = xHandle(edition)
  return `https://x.com/intent/post?${new URLSearchParams({ text: title, url, ...(via ? { via } : {}) })}`
}
