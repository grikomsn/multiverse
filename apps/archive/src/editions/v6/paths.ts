import type { Edition } from "../../lib/editions"

export { assetUrl } from "../_kit/assets"
export { ordinalDate as formatDate } from "../_kit/text"
export { trimProtocol } from "../_kit/text"
export { pageOf } from "../../lib/editions"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v6`

/** Site-relative links from the 2020 copy live under /v6 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

export const isExternal = (value: string) => /^https?:/.test(value)

export type PostEntry = {
  slug: string
  title: string
  subtitle: string
  date: string
  tags: string[]
  post?: NonNullable<Edition["posts"]>[number]
}

/** v6's post list: per-version metadata from `extras`, bodies from the referenced `post`. */
export function postEntries(edition: Edition): PostEntry[] {
  return (edition.extras ?? [])
    .filter((entry) => entry.category === "post")
    .map((entry) => ({
      slug: entry.url?.split("/").pop() ?? "",
      title: entry.title ?? "",
      subtitle: entry.subtitle ?? "",
      date: entry.date ?? "",
      tags: entry.tags ?? [],
      post: edition.posts?.find((post) => post._id === entry.ref),
    }))
}
