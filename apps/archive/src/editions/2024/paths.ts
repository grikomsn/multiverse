export { assetUrl, assetSize } from "../_kit/assets"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/2024`

/** Site-relative links from the Bear copy live under /2024 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

/** Bear's `d M, Y` date format, in UTC like the live blog: "05 Jun, 2022". */
export function formatDate(date: string) {
  const value = new Date(date)
  const day = String(value.getUTCDate()).padStart(2, "0")
  const month = value.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
  return `${day} ${month}, ${value.getUTCFullYear()}`
}

/** `datetime` attribute as Bear wrote it: "2022-06-05T17:00Z". */
export const dateTime = (date: string) => new Date(date).toISOString().slice(0, 16) + "Z"
