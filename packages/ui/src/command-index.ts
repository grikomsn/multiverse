/*
 * The list that the command bar reads (nibras.co/commands.json), and how the bar ranks rows
 * by their titles. No DOM here, so `apps/web` builds the list with these types and the tests
 * run this file as it is. The bar itself is `command-bar.ts`.
 */

export type CommandKind = "page" | "post" | "role" | "project" | "talk"

/** One place to go on nibras.co. */
export interface CommandItem {
  kind: CommandKind
  title: string
  /** A path on nibras.co: `/work#project-graz`. The bar adds the origin on other sites. */
  path: string
  /** ISO date of a post. */
  date?: string
  /** Words that also find the item: "cv" for the resume. */
  keywords?: string
}

export interface CommandIndex {
  /** The owner's name, for the question that "Ask AI" sends. */
  name: string
  /** Pages first, then posts (newest first), roles, projects and talks. */
  items: CommandItem[]
  /** Older versions on archive.nibras.co, newest first. Absolute URLs. */
  versions: { title: string; url: string; year?: string }[]
  /** Outside profiles: GitHub, LinkedIn… */
  profiles: { label: string; url: string }[]
  email?: string
  scheduleUrl?: string
  repository: string
}

/** What ranking needs from a row. */
export interface Rankable {
  title: string
  /** Rows of one group stay together in the results. */
  group: string
  keywords?: string
}

/** `"Graz  hooks"` → `["graz", "hooks"]`. */
export const termsOf = (query: string) => query.toLowerCase().split(/\s+/).filter(Boolean)

const isWordStart = (text: string, index: number) =>
  index === 0 || !/[\p{L}\p{N}]/u.test(text[index - 1] ?? "")

/** Whether `term` starts a word of `text`: "prov" in "Coding agent providers". */
function startsWord(text: string, term: string) {
  for (let at = text.indexOf(term); at >= 0; at = text.indexOf(term, at + 1)) {
    if (isWordStart(text, at)) return true
  }
  return false
}

/**
 * How well a row matches. Every term must be in the title, or start a keyword or a word of the
 * group name; zero means no match. The start of the title counts most, then the start of a
 * word, then any place in the title. A term that only starts a keyword counts least.
 */
export function scoreRow(row: Rankable, terms: string[]): number {
  const title = row.title.toLowerCase()
  const rest = `${row.keywords ?? ""} ${row.group}`.toLowerCase()
  let score = 0
  for (const term of terms) {
    if (title.startsWith(term)) score += 6
    else if (startsWord(title, term)) score += 4
    else if (title.includes(term)) score += 2
    else if (startsWord(rest, term)) score += 1
    else return 0
  }
  return score
}

/**
 * The rows that match `query`, best first inside each group. The group with the best row
 * comes first, and groups with equal rows keep the order of `rows`. A group shows at most
 * `perGroup` rows, so 17 projects do not hide the one page that matches.
 */
export function rankRows<Row extends Rankable>(rows: Row[], query: string, perGroup = 5): Row[] {
  const terms = termsOf(query)
  if (terms.length === 0) return []
  const groups = new Map<string, { row: Row; score: number }[]>()
  for (const row of rows) {
    const score = scoreRow(row, terms)
    if (score === 0) continue
    const group = groups.get(row.group)
    if (group) group.push({ row, score })
    else groups.set(row.group, [{ row, score }])
  }
  return [...groups.values()]
    .map((group) => group.sort((a, b) => b.score - a.score).slice(0, perGroup))
    .sort((a, b) => (b[0]?.score ?? 0) - (a[0]?.score ?? 0))
    .flatMap((group) => group.map((item) => item.row))
}

/**
 * The parts of `text` that match a term, for the underline in a row. Each term marks its
 * first match, and marks that touch become one.
 */
export function matchRanges(text: string, terms: string[]): [start: number, end: number][] {
  const lower = text.toLowerCase()
  const found: [number, number][] = []
  for (const term of terms) {
    const at = lower.indexOf(term)
    if (at >= 0) found.push([at, at + term.length])
  }
  found.sort((a, b) => a[0] - b[0])
  const merged: [number, number][] = []
  for (const range of found) {
    const last = merged[merged.length - 1]
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1])
    else merged.push(range)
  }
  return merged
}
