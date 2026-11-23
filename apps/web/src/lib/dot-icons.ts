/**
 * Small pictures made of square dots: decoration for the home page (`dot-icon.astro`).
 * A picture is a list of rows, and an "X" in a row is a dot.
 */
const disc = (size: number, on: (x: number, y: number) => boolean) =>
  Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => (on(x, y) ? "X" : ".")).join(""),
  )

export const DOT_ICONS = {
  heart: [
    ".XX...XX.",
    "XXXX.XXXX",
    "XXXXXXXXX",
    "XXXXXXXXX",
    ".XXXXXXX.",
    "..XXXXX..",
    "...XXX...",
    "....X....",
  ],
  wrench: [
    "......XX.",
    ".....X...",
    ".....X..X",
    ".....XXXX",
    "....XXX..",
    "...XXX...",
    "..XXX....",
    ".XXX.....",
    ".XX......",
  ],
  terminal: ["X........", ".X.......", "..X......", ".X.......", "X...XXXX."],
  box: [
    "XXXXXXXXX",
    "X...X...X",
    "X...X...X",
    "XXXXXXXXX",
    "X.......X",
    "X.......X",
    "X.......X",
    "XXXXXXXXX",
  ],
  /** A disc with eight rays. */
  sun: disc(11, (x, y) => {
    const radius = Math.hypot(x - 5, y - 5)
    const ray = x === 5 || y === 5 || Math.abs(x - 5) === Math.abs(y - 5)
    return radius < 3.1 || (ray && radius > 4.1 && radius < 5.6)
  }),
  /** A disc with a smaller disc cut from its top right. */
  moon: disc(11, (x, y) => Math.hypot(x - 5, y - 5) < 4.6 && Math.hypot(x - 7.2, y - 3.4) > 3.9),
} as const satisfies Record<string, readonly string[]>

export type DotIconName = keyof typeof DOT_ICONS

/** The SVG path of a picture: one square for each dot, on a grid of 1. */
export const dotPath = (rows: readonly string[]) =>
  rows
    .flatMap((row, y) =>
      [...row].flatMap((cell, x) => (cell === "X" ? [`M${x} ${y}h1v1h-1z`] : [])),
    )
    .join("")
