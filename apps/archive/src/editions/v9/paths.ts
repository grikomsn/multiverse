import type { Edition } from "../../lib/editions"

export { assetUrl } from "../_kit/assets"
export { pageOf } from "../../lib/editions"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v9`

/** Site-relative links from the 2022 copy live under /v9 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

export const isExternal = (value: string) => /^(https?:|mailto:)/.test(value)

/** "June 06, 2022", date-fns `MMMM dd, yyyy`. */
export function formatDate(value: string | null | undefined) {
  if (!value) return ""
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  return `${month} ${String(date.getUTCDate()).padStart(2, "0")}, ${date.getUTCFullYear()}`
}

export type PostEntry = {
  slug: string
  title: string
  description: string
  date: string
  redirect?: string
  cover?: {
    url?: string | null
    alt?: string | null
    width?: number | null
    height?: number | null
  } | null
  post?: NonNullable<Edition["posts"]>[number]
}

/** Writings, newest first: v9 metadata from `extras`, bodies from the referenced `post`. */
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
        redirect: own ? undefined : url,
        cover: entry.image,
        post: edition.posts?.find((post) => post._id === entry.ref),
      }
    })
}

/** Blur-up thumbnails stand in for lost DatoCMS images. */
export const isPlaceholder = (alt: string | null | undefined) =>
  Boolean(alt?.includes("blur-up placeholder"))
