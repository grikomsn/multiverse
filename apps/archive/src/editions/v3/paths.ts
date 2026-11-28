export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v3`

/** Site-relative links from the 2019 copy live under /v3 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

export { trimProtocol } from "../_kit/text"

/** helpers/parsePostDate.js */
export const postDate = (date: string | null | undefined) =>
  date
    ? new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
