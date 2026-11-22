/** "June 4th, 2020", date-fns `MMMM do, Y`, as v6–v8 showed dates. */
export function ordinalDate(value: string | null | undefined) {
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
  const month = date.toLocaleString("en-US", { month: "long", timeZone: "UTC" })
  return `${month} ${day}${suffix}, ${date.getUTCFullYear()}`
}

/** "griko.id/blog" from "https://griko.id/blog". */
export const trimProtocol = (url: string) => url.replace(/^https?:\/\//i, "")
