import type { Edition } from "../../lib/editions"

export { assetUrl } from "../_kit/assets"
export { trimProtocol } from "../_kit/text"
export { pageOf } from "../../lib/editions"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v7`

/** Site-relative links from the 2021 copy live under /v7 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

export const isExternal = (value: string) => /^https?:/.test(value)

/** "Saturday, October 24th, 2020", date-fns `PPPP`. */
export function formatDate(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  const day = date.getUTCDate()
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th"
  const weekday = date.toLocaleString("en-US", { weekday: "long", timeZone: "UTC" })
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  return `${weekday}, ${month} ${day}${suffix}, ${date.getUTCFullYear()}`
}

export type PostEntry = {
  slug: string
  cover?: { url?: string | null; alt?: string | null } | null
  title: string
  subtitle: string
  date: string
  tags: string[]
  post?: NonNullable<Edition["posts"]>[number]
}

/** v7's post list: per-version metadata from `extras`, bodies from the referenced `post`. */
export function postEntries(edition: Edition): PostEntry[] {
  return (edition.extras ?? [])
    .filter((entry) => entry.category === "post")
    .map((entry) => ({
      slug: entry.url?.split("/").pop() ?? "",
      title: entry.title ?? "",
      subtitle: entry.subtitle ?? "",
      date: entry.date ?? "",
      tags: entry.tags ?? [],
      cover: entry.image,
      post: edition.posts?.find((post) => post._id === entry.ref),
    }))
}
