export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/2023c`

/** Site-relative links from the 2023 copy live under /2023c now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

/** "June 6, 2022", in the author's time zone (posts were published from Indonesia). */
export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  })

export { assetSize, assetUrl } from "../_kit/assets"
