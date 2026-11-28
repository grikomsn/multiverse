/**
 * A list as lines, and the part of it that fits the screen. No drawing here: `app.tsx` draws
 * the lines, and the pointer finds the line under it with the same numbers.
 */
import type { Row, Section } from "./content"

export type Line =
  | { kind: "gap" }
  | { kind: "heading"; text: string }
  /** The first line of a row. `detail` is the part of the row's detail that this line has. */
  | { kind: "row"; row: Row; index: number; detail?: string }
  /** A later line of a row: more of its detail. */
  | { kind: "rest"; row: Row; index: number; text: string }
  /** Stands in the first or the last place when the list goes on there. */
  | { kind: "more"; to: "up" | "down" }

/** The cursor before a row and the arrow after it: two letters each. */
const EDGES = 4
/** How far a later line of a row starts after its title. */
export const REST_INDENT = 2

/**
 * A row's detail in lines. The first goes after the title, and has less room. The others have
 * the width of the list. A detail that fits is one line, and no word is cut.
 */
function wrapDetail(row: Row, width: number): string[] {
  if (!row.detail) return []
  const room = width - EDGES
  const first =
    room - row.title.length - (row.light ? 2 : 0) - 2 - (row.date ? row.date.length + 2 : 0)
  const lines = [""]
  for (const word of row.detail.split(/\s+/)) {
    const line = lines.at(-1)!
    const limit = lines.length === 1 ? first : room - REST_INDENT
    if (line.length + (line ? 1 : 0) + word.length <= limit)
      lines[lines.length - 1] += (line ? " " : "") + word
    // A word wider than a whole line stays on the line: the screen cuts it.
    else if (line || lines.length === 1) lines.push(word)
    else lines[lines.length - 1] = word
  }
  // No word alone on the last line: the last word of the line before goes with it.
  const last = lines.at(-1)!
  const before = lines.at(-2)?.split(" ") ?? []
  if (!last.includes(" ") && before.length > 1) {
    const joined = `${before.pop()} ${last}`
    if (joined.length <= room - REST_INDENT) lines.splice(-2, 2, before.join(" "), joined)
  }
  return lines
}

/**
 * The sections as lines. `index` counts the rows, for the cursor. With a `width`, a detail
 * that does not fit goes on at the next lines. With none, each row is one line.
 */
export function toLines(sections: Section[], width?: number): Line[] {
  const lines: Line[] = []
  let index = 0
  for (const section of sections) {
    if (lines.length > 0) lines.push({ kind: "gap" })
    if (section.heading) lines.push({ kind: "heading", text: section.heading })
    for (const row of section.rows) {
      const [detail, ...rest] = width ? wrapDetail(row, width) : row.detail ? [row.detail] : []
      lines.push({ kind: "row", row, index, detail: detail || undefined })
      for (const text of rest) lines.push({ kind: "rest", row, index, text })
      index++
    }
  }
  return lines
}

/** The place of a row among the lines. */
export const lineOfRow = (lines: Line[], index: number) =>
  lines.findIndex((line) => line.kind === "row" && line.index === index)

/**
 * The first line to show, so the line `at` is on the screen and not under a "more" line.
 * `start` is the first line now: it changes only as much as it must, so the list does not jump
 * under the pointer.
 */
export function fitScroll(lines: Line[], start: number, at: number, height: number) {
  const last = Math.max(0, lines.length - height)
  let first = Math.max(0, Math.min(last, start))
  if (last === 0 || at < 0) return first
  // Above the window, or under "↑ more". Show the heading over the row too.
  if (at < first + 1) first = at - 1 - (lines[at - 1]?.kind === "heading" ? 1 : 0)
  // Below the window, or under "↓ more". The later lines of the row count too.
  let end = at
  while (lines[end + 1]?.kind === "rest") end++
  if (end > first + height - 2) first = end - height + 2
  // A row with more lines than the window has: its first line wins.
  if (end > at) first = Math.min(first, Math.max(0, at - 1))
  return Math.max(0, Math.min(last, first))
}

/** The lines on the screen: `height` of them from `start`, with "more" where the list goes on. */
export function windowOf(lines: Line[], start: number, height: number): Line[] {
  const shown = lines.slice(start, start + height)
  if (height >= 3 && start > 0) shown[0] = { kind: "more", to: "up" }
  if (height >= 3 && start + height < lines.length) {
    shown.pop()
    // A heading with none of its rows under it says nothing: "more" takes its place.
    while (shown.length > 1 && (shown.at(-1)!.kind === "heading" || shown.at(-1)!.kind === "gap"))
      shown.pop()
    shown.push({ kind: "more", to: "down" })
  }
  return shown
}

/** The row nearest to line `at` that the window shows as a row, or nothing. */
export function nearestRow(lines: Line[], start: number, height: number, at: number) {
  const shown = windowOf(lines, start, height)
  let best: number | undefined
  let distance = Infinity
  shown.forEach((line, offset) => {
    if (line.kind !== "row" && line.kind !== "rest") return
    const far = Math.abs(start + offset - at)
    if (far < distance) {
      distance = far
      best = line.index
    }
  })
  return best
}
