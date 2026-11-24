/**
 * The mascot in a terminal. `faces.gen.ts` holds every mood as pixels; this file draws them
 * with half blocks: a cell shows two pixels, the upper one as the text color of "▀" and the
 * lower one as its ground. The picture sits in a circle, as the avatar does on the site.
 */
import { inflateSync } from "node:zlib"

import { GROUND, MOODS, type Mood } from "@multiverse/ui/gri"

import { FACE_SIZES, FACES } from "./faces.gen"
import { rgb, type Rgb } from "./theme"

export type FaceSize = (typeof FACE_SIZES)[number]
export { FACE_SIZES }

let pixels: Buffer | undefined

/** Where the pixels of one face start. */
function offset(mood: Mood, size: FaceSize) {
  let at = 0
  for (const other of FACE_SIZES) {
    if (other === size) break
    at += other * other * 3 * MOODS.length
  }
  return at + MOODS.indexOf(mood) * size * size * 3
}

/** 24 for colors as they are, 8 for the 256 colors that older terminals have. */
export type Depth = 8 | 24

/** The nearest of the 256 colors: the 6×6×6 cube, or the grey ramp for a grey. */
export function to256([red, green, blue]: Rgb) {
  if (Math.max(red, green, blue) - Math.min(red, green, blue) < 12) {
    const grey = Math.round((red + green + blue) / 3)
    if (grey < 4) return 16
    if (grey > 243) return 231
    return 232 + Math.min(23, Math.round((grey - 8) / 10))
  }
  const step = (value: number) =>
    value < 48 ? 0 : value < 115 ? 1 : Math.min(5, Math.floor((value - 35) / 40))
  return 16 + 36 * step(red) + 6 * step(green) + step(blue)
}

const paint = (layer: 38 | 48, color: Rgb, depth: Depth) =>
  depth === 24
    ? `\x1b[${layer};2;${color[0]};${color[1]};${color[2]}m`
    : `\x1b[${layer};5;${to256(color)}m`

interface FaceOptions {
  /** The color of the page, as hex: what shows outside the circle. */
  bg: string
  depth: Depth
  /** How far the head is from its place, in pixels: the moves of a mood. */
  shift?: readonly [x: number, y: number]
}

/**
 * One face as text: `size / 2` lines of `size` cells, with color codes. Each line ends in the
 * page's ground and the default text color, so text after it is not painted.
 */
export function faceRows(mood: Mood, size: FaceSize, { bg, depth, shift = [0, 0] }: FaceOptions) {
  pixels ??= inflateSync(Buffer.from(FACES, "base64"))
  const start = offset(mood, size)
  const page = rgb(bg)
  const ground = rgb(GROUND)
  const half = size / 2

  /** The color of one pixel of the picture, with the edge of the circle softened. */
  const pixel = (x: number, y: number): Rgb => {
    const distance = Math.hypot(x + 0.5 - half, y + 0.5 - half)
    const cover = Math.max(0, Math.min(1, half - distance + 0.5))
    if (cover === 0) return page
    const sx = x - shift[0]
    const sy = y - shift[1]
    const inside = sx >= 0 && sx < size && sy >= 0 && sy < size
    const at = start + (sy * size + sx) * 3
    const color: Rgb = inside ? [pixels![at]!, pixels![at + 1]!, pixels![at + 2]!] : ground
    if (cover === 1) return color
    return [
      Math.round(page[0] + (color[0] - page[0]) * cover),
      Math.round(page[1] + (color[1] - page[1]) * cover),
      Math.round(page[2] + (color[2] - page[2]) * cover),
    ]
  }

  const lines: string[] = []
  for (let row = 0; row < half; row++) {
    let line = ""
    let last = ""
    for (let x = 0; x < size; x++) {
      const codes = paint(38, pixel(x, row * 2), depth) + paint(48, pixel(x, row * 2 + 1), depth)
      if (codes !== last) line += codes
      last = codes
      line += "▀"
    }
    lines.push(line + paint(48, page, depth) + "\x1b[39m")
  }
  return lines
}

/**
 * The moves: where the head goes when a mood starts, one step for each frame. A move plays
 * once and ends at rest, as on the site. A mood that is not here hops.
 */
const HOP = [
  [0, -1],
  [0, -1],
  [0, 0],
] as const
const SINK = [
  [0, 1],
  [0, 1],
  [0, 1],
  [0, 0],
] as const
const MOVES: Partial<Record<Mood, readonly (readonly [number, number])[]>> = {
  laugh: [
    [0, -1],
    [0, 0],
    [0, -1],
    [0, 0],
    [0, -1],
    [0, 0],
  ],
  wow: [
    [0, -1],
    [0, -2],
    [0, -2],
    [0, -1],
    [0, 0],
  ],
  starstruck: [
    [0, -1],
    [0, -2],
    [0, -2],
    [0, -1],
    [0, 0],
  ],
  think: [
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 0],
  ],
  "side-eye": [
    [1, 0],
    [1, 0],
    [1, 0],
    [0, 0],
  ],
  sleepy: SINK,
  shy: SINK,
  sad: SINK,
  oops: [
    [-1, 0],
    [1, 0],
    [0, 0],
  ],
  grumpy: [
    [-1, 0],
    [1, 0],
    [-1, 0],
    [0, 0],
  ],
  dizzy: [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 0],
  ],
}
export const moveOf = (mood: Mood) => MOVES[mood] ?? HOP

/**
 * The face as letters, for a terminal with too few colors or too little space, and for the
 * header: glasses are the brackets.
 */
export const SMALL_FACES: Record<Mood, string> = {
  smile: "[◠‿◠]",
  laugh: "[◠▿◠]",
  wink: "[•‿◠]",
  cheeky: "[>‿<]",
  wow: "[◉o◉]",
  love: "[♥‿♥]",
  starstruck: "[★▿★]",
  cool: "[■‿■]",
  think: "[•_•]",
  "side-eye": "[¬‿¬]",
  sleepy: "[◡.◡]",
  shy: "[•‿•]",
  oops: "[•~•]",
  sad: "[╥_╥]",
  grumpy: "[¬_¬]",
  dizzy: "[×~×]",
}
