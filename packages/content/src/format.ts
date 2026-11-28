/**
 * The time zone the dates were entered in (UTC+7). In UTC, a post from midnight shows the day
 * before. This is not `profile.timeZone`: that one says where Griko lives now, and a move must
 * not change the day of an old post.
 */
const TIME_ZONE = "Asia/Jakarta"
const DATE = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: TIME_ZONE,
})
const ISO = new Intl.DateTimeFormat("en-CA", { dateStyle: "short", timeZone: TIME_ZONE })

/** "Jul 21, 2025". Date-only values ("2025-07-21") are read as that day. */
export const formatDate = (value: string | null | undefined) =>
  value ? DATE.format(parseDate(value)) : ""

/** "2025-07-21", in the site's time zone. */
export const isoDate = (value: string | null | undefined) =>
  value ? ISO.format(parseDate(value)) : ""

const parseDate = (value: string) =>
  new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00+07:00` : value)

/** "2020 – 2023", "2026 – now". One year when it starts and ends in the same year: "2019". */
export function formatRange(start?: string | null, end?: string | null) {
  const from = start?.slice(0, 4) ?? "?"
  const to = end ? end.slice(0, 4) : "now"
  return from === to ? from : `${from} – ${to}`
}

/** A tagline in parts: the words in [brackets] are at the odd indexes. */
export const taglineParts = (tagline: string) => tagline.split(/\[([^\]]+)\]/)

/** Sanity image CDN URL, resized and format-negotiated. */
export const imageUrl = (url: string | null | undefined, width: number, height?: number) =>
  url ? `${url}?w=${width}${height ? `&h=${height}&fit=crop` : "&fit=max"}&auto=format` : undefined

export const srcset = (url: string | null | undefined, widths: number[]) =>
  url ? widths.map((width) => `${imageUrl(url, width)} ${width}w`).join(", ") : undefined

export const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, "")

type Job = {
  startDate?: string | null
  endDate?: string | null
  organization?: { name?: string | null; url?: string | null } | null
}

/** Consecutive roles at the same organization, newest first, as one stop on the route. */
export function groupByOrganization<T extends Job>(jobs: T[]) {
  const groups: {
    organization: T["organization"]
    startDate?: string | null
    endDate?: string | null
    roles: T[]
  }[] = []
  for (const job of jobs) {
    const last = groups.at(-1)
    if (last && last.organization?.name === job.organization?.name) {
      last.roles.push(job)
      if ((job.startDate ?? "") < (last.startDate ?? "")) last.startDate = job.startDate
      if (last.endDate && (!job.endDate || job.endDate > last.endDate)) last.endDate = job.endDate
    } else {
      groups.push({
        organization: job.organization,
        startDate: job.startDate,
        endDate: job.endDate,
        roles: [job],
      })
    }
  }
  return groups
}

/** About 230 words a minute, rounded up. */
export function readingMinutes(blocks: unknown[] | null | undefined) {
  const text = (blocks ?? [])
    .flatMap((block) =>
      typeof block === "object" && block && "children" in block && Array.isArray(block.children)
        ? block.children.map((child: { text?: string }) => child.text ?? "")
        : [],
    )
    .join(" ")
  return Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 230))
}
