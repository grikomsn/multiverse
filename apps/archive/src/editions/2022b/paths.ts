export { assetUrl, assetSize } from "../_kit/assets"

import { web } from "../../lib/web"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/2022b`

/** Links to nibras.co pages this edition rebuilt stay inside /2022b. */
const PAGES = ["about", "contact", "now", "talk", "uses", "work"]

export function href(value: string) {
  const path = value.replace(/^https:\/\/nibras\.co(?=\/|$)/, "") || "/"
  if (!path.startsWith("/")) return value
  const first = path.split("/")[1] ?? ""
  // nibras.co/resume and /schedule were redirects (and live on as Bear pages); keep those external.
  if (value.startsWith("https://") && first && !PAGES.includes(first)) return web(value)
  return `${BASE}${path}`
}

/** Ghost's `{{date format="MMM D, YYYY"}}`: "Dec 4, 2022". */
export const formatDate = (date: string) =>
  new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })

/** Ghost tag slugs: "Gatsby.js" → "gatsby-js". */
export const tagSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
