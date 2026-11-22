import type { Edition } from "../../lib/editions"

export { assetUrl } from "../_kit/assets"
export { ordinalDate as formatDate } from "../_kit/text"
export { pageOf } from "../../lib/editions"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v8`

/** Site-relative links from the 2022 copy live under /v8 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

export const isExternal = (value: string) => /^(https?:|mailto:)/.test(value)

export type PostEntry = {
  slug: string
  title: string
  description: string
  date: string
  lastUpdate?: string
  /** Set for posts that only redirected elsewhere (`redirect:` frontmatter). */
  redirect?: string
  post?: NonNullable<Edition["posts"]>[number]
}

/** Writings, newest first: v8 metadata from `extras`, bodies from the referenced `post`. */
export function postEntries(edition: Edition): PostEntry[] {
  return (edition.extras ?? [])
    .filter((entry) => entry.category === "post")
    .map((entry) => {
      const url = entry.url ?? ""
      const own = url.startsWith("https://griko.id/blog/")
      return {
        slug: own ? url.split("/").pop()! : (entry.ref?.replace(/^post-/, "") ?? ""),
        title: entry.title ?? "",
        description: entry.subtitle ?? "",
        date: entry.date ?? "",
        lastUpdate: entry.description ?? undefined,
        redirect: own ? undefined : url,
        post: edition.posts?.find((post) => post._id === entry.ref),
      }
    })
}
