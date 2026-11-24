/**
 * A list as lines, and the part of it that fits the screen. No drawing here: `app.tsx` draws
 * the lines, and the pointer finds the line under it with the same numbers.
 */
import type { Row, Section } from "./content"

export type Line =
  | { kind: "gap" }
  | { kind: "heading"; text: string }
  | { kind: "row"; row: Row; index: number }
  /** Stands in the first or the last place when the list goes on there. */
  | { kind: "more"; to: "up" | "down" }

/** The sections as lines. `index` counts the rows, for the cursor. */
export function toLines(sections: Section[]): Line[] {
  const lines: Line[] = []
  let index = 0
  for (const section of sections) {
    if (lines.length > 0) lines.push({ kind: "gap" })
    if (section.heading) lines.push({ kind: "heading", text: section.heading })
    for (const row of section.rows) lines.push({ kind: "row", row, index: index++ })
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
  // Below the window, or under "↓ more".
  if (at > first + height - 2) first = at - height + 2
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
    if (line.kind !== "row") return
    const far = Math.abs(start + offset - at)
    if (far < distance) {
      distance = far
      best = line.index
    }
  })
  return best
}
