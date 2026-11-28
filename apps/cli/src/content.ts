/**
 * What the card says. The facts come from the card (`@multiverse/content/card`); the sentences
 * and the lists are here, in the words of the home page of nibras.co.
 */
import type { Card } from "@multiverse/content/card"
import { formatRange, hostname, isoDate } from "@multiverse/content/format"
import { KEY_PAGES, PROJECT_STATUSES, REPOSITORY_URL } from "@multiverse/sanity/constants"
import type { Mood } from "@multiverse/ui/gri"

/**
 * The light after a project's name, as on the home page: a ring before people can get it, off
 * when it is archived, on in between.
 */
export type Light = "ring" | "on" | "off"

const LIGHTS: Record<string, Light> = { waitlist: "ring", archived: "off" }

/** The name of a project's status, and its light. */
export function statusOf(project: Card["projects"][number]) {
  const status = PROJECT_STATUSES.find(({ value }) => value === project.status)
  return status && { title: status.title, light: LIGHTS[status.value] ?? ("on" as const) }
}

/** One line of a list: a place to go. */
export interface Row {
  title: string
  /** A project's light, after the title. */
  light?: Light
  /** More about the row, after the title. */
  detail?: string
  /** A date or a period, at the right. */
  date?: string
  url: string
  /** What `c` copies when it is not the address: the email address of a `mailto:` row. */
  copy?: string
  /** The mood of the mascot while the cursor is on the row, as `data-gri` on the site. */
  mood?: Mood
  /** The name of the row's list, for search. */
  group: string
  /** Words that also find the row. */
  keywords?: string
}

export interface Section {
  heading?: string
  rows: Row[]
}

export interface View {
  key: "home" | "work" | "blog" | "links"
  label: string
  sections: Section[]
}

/** The line of the home page when the site has none. Words in [brackets] get a mark. */
const TAGLINE = "I make [useful], [fast], and [friendly] things."

/** The mood of the mascot for each marked word, as on the home page. */
export const WORD_MOODS: Record<string, Mood> = { useful: "think", fast: "wow", friendly: "love" }

export const headline = (card: Card) => `Hey there, I’m ${card.givenName}.`

/** The tagline in parts: the marked words are at the odd indexes. */
export const tagline = (card: Card) => (card.tagline || TAGLINE).split(/\[([^\]]+)\]/)

/** The intro in parts: the names at the odd indexes stand out, as the links do on the site. */
export function intro(card: Card): string[] {
  const current = card.experience[0]
  const side = card.experience.find(
    (stop) => !stop.end && stop.organization !== current?.organization,
  )
  const parts: string[] = []
  if (current) {
    parts.push("I lead engineering at ", current.organization)
    if (side) parts.push(" and teach new developers at ", side.organization)
    parts.push(". ")
  } else parts.push("")
  parts[parts.length - 1] +=
    card.projects.length > 0
      ? "I also make developer tools and small apps, for humans and lately for AI agents too."
      : "I also make developer tools for humans, and lately for AI agents too."
  if (card.location) {
    parts[parts.length - 1] += " I live in "
    parts.push(card.location, ".")
  }
  return parts
}

/**
 * Parts as lines of at most `width` letters, broken at the spaces. Each line is a list of
 * pieces; `strong` is true for a piece that came from an odd index.
 */
export function wrapParts(parts: string[], width: number) {
  // Words: runs of pieces with no space between them, such as a name and the period after it.
  const words: { text: string; strong: boolean }[][] = []
  let spaced = true
  parts.forEach((part, index) => {
    for (const token of part.split(/(\s+)/)) {
      if (!token) continue
      if (/^\s+$/.test(token)) spaced = true
      else {
        if (spaced) words.push([])
        words.at(-1)!.push({ text: token, strong: index % 2 === 1 })
        spaced = false
      }
    }
  })

  const lines: { text: string; strong: boolean }[][] = [[]]
  let used = 0
  for (const word of words) {
    const length = word.reduce((sum, piece) => sum + piece.text.length, 0)
    if (used > 0 && used + 1 + length > width) {
      lines.push([])
      used = 0
    }
    const line = lines.at(-1)!
    for (const piece of used > 0 ? [{ text: " ", strong: false }, ...word] : word) {
      const last = line.at(-1)
      if (last && last.strong === piece.strong) last.text += piece.text
      else line.push({ ...piece })
      used += piece.text.length
    }
  }
  return lines
}

/** "14:32", and whether the sun is up (06:00 to 18:00), in the card's time zone. */
export function cityTime(card: Card, now = new Date()) {
  if (!card.timeZone) return undefined
  try {
    const clock = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
      timeZone: card.timeZone,
    }).format(now)
    const hour = Number(clock.slice(0, 2))
    return {
      clock,
      city: card.location?.split(",")[0]?.trim(),
      day: hour >= 6 && hour < 18,
      // From midnight to 05:00 the mascot sleeps, as on the home page.
      asleep: hour < 5,
    }
  } catch {
    // An unknown time zone: no clock.
    return undefined
  }
}

const page = (card: Card, title: string, path: string, more: Partial<Row> = {}): Row => ({
  title,
  detail: hostname(card.website) + path,
  url: card.website + path,
  group: "Pages",
  ...more,
})

/** The four views, in the order of the header. */
export function views(card: Card): View[] {
  const shortcuts: Row[] = [
    page(card, "Resume", "/resume", { mood: "cool", keywords: "cv" }),
    ...(card.scheduleUrl
      ? [
          {
            title: "Book a call",
            detail: hostname(card.scheduleUrl),
            url: card.scheduleUrl,
            mood: "laugh" as const,
            group: "Actions",
            keywords: "schedule meet calendar",
          },
        ]
      : []),
    ...(card.email
      ? [
          {
            title: "Send an email",
            detail: card.email,
            url: `mailto:${card.email}`,
            copy: card.email,
            mood: "love" as const,
            group: "Actions",
            keywords: "contact mail",
          },
        ]
      : []),
    page(card, "Open the website", "", { mood: "starstruck", keywords: "home nibras" }),
  ]

  const full = (sections: Section[]) => sections.filter((section) => section.rows.length > 0)

  /** The projects, under the name that the page gives the list. */
  const projects = (heading: string): Section => ({
    heading,
    rows: card.projects.map((project) => {
      const status = statusOf(project)
      return {
        title: project.name,
        light: status?.light,
        detail: project.tagline ?? project.summary,
        url: project.url ?? `${card.website}/work#projects`,
        group: "Projects",
        keywords: [status?.title, ...project.technologies].filter(Boolean).join(" "),
      }
    }),
  })

  const work: Section[] = [
    {
      heading: "Experience",
      rows: card.experience.map((stop) => ({
        title: stop.organization,
        detail: stop.roles.join(", "),
        date: formatRange(stop.start, stop.end),
        url: stop.url ?? `${card.website}/work`,
        group: "Experience",
      })),
    },
    projects("Projects"),
    {
      heading: "Talks",
      rows: card.talks.map((talk) => ({
        title: talk.title,
        detail: talk.event,
        date: isoDate(talk.date),
        url: talk.url ?? `${card.website}/work#talks`,
        group: "Talks",
      })),
    },
    { rows: [page(card, "Full work history", "/work", { keywords: "experience projects talks" })] },
  ]

  const blog: Section[] = [
    {
      heading: "Latest posts",
      rows: card.posts.map((post) => ({
        title: post.title,
        date: isoDate(post.date),
        url: post.url,
        group: "Posts",
        keywords: post.summary,
      })),
    },
    { rows: [page(card, "All posts", "/blog", { keywords: "blog" })] },
  ]

  const links: Section[] = [
    {
      heading: "Profiles",
      rows: card.profiles
        .filter((profile) => profile.featured)
        .map((profile) => ({
          title: profile.label,
          detail: profile.url.replace(/^https?:\/\/(www\.)?/, ""),
          url: profile.url,
          group: "Profiles",
        })),
    },
    {
      heading: "Pages",
      rows: [
        ...KEY_PAGES.map((item) => page(card, item.label, `/${item.slug}`)),
        page(card, "Media", "/media", { keywords: "photos avatars pictures" }),
        page(card, "For AI tools", "/ai", { keywords: "mcp llms markdown" }),
      ],
    },
    {
      heading: "More",
      rows: [
        {
          title: "Older versions",
          detail: card.versions ? `${card.versions} versions of this site` : undefined,
          url: `https://archive.${hostname(card.website)}`,
          group: "More",
          keywords: "archive",
        },
        {
          title: "Source",
          detail: REPOSITORY_URL.replace("https://", ""),
          url: REPOSITORY_URL,
          group: "More",
          keywords: "github repository code",
        },
      ],
    },
  ]

  return [
    // The home page: the shortcuts, then the lists of the site's home page, in its order.
    {
      key: "home",
      label: "Home",
      sections: full([
        { rows: shortcuts },
        projects("Apps and things"),
        work[0]!,
        work[2]!,
        blog[0]!,
      ]),
    },
    { key: "work", label: "Work", sections: full(work) },
    { key: "blog", label: "Blog", sections: full(blog) },
    { key: "links", label: "Links", sections: full(links) },
  ]
}

/**
 * Every row once, for search. The home page repeats rows of the other pages. Two roles at one
 * organization share an address and a title, and both stay.
 */
export function allRows(list: View[]): Row[] {
  const seen = new Set<string>()
  return list
    .flatMap((view) => view.sections.flatMap((section) => section.rows))
    .filter((row) => {
      const id = [row.url, row.title, row.detail].join("\n")
      return !seen.has(id) && seen.add(id)
    })
}

/** Whether the address is a page of the site: → on the site, ↗ for other places. */
export const isOnSite = (card: Card, url: string) => url.startsWith(card.website)
