/**
 * The site's wave in a terminal: the same field and the same 4×4 Bayer pattern as the hero and
 * the footer band (`@multiverse/ui/dither`), drawn with braille. A braille cell holds two dots
 * by four, so one row of cells is one row of the pattern.
 */
import { threshold, wave } from "@multiverse/ui/dither"

/** Which bit of a braille letter each dot of a cell sets: `BITS[y][x]`. */
const BITS = [
  [0x01, 0x08],
  [0x02, 0x10],
  [0x04, 0x20],
  [0x40, 0x80],
] as const

/** The width of a dot in the units of the field. 80 columns show about one and a half waves. */
const DOT = 5

export type Shape = "hero" | "band"

const smoothstep = (low: number, high: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)))
  return t * t * (3 - 2 * t)
}

/**
 * How strong a dot is, from 0 to 1. `x` and `y` run from 0 to 1 over the picture. `at` and
 * `level` are the same place in the wave's own field, which leans toward the pointer.
 *
 * The hero hangs from the top right corner and fades out to the left and to the bottom, as on
 * the home page. The band rises from the bottom edge, as in the site's footer.
 */
function strength(shape: Shape, x: number, y: number, at: number, level: number, time: number) {
  if (shape === "band") return Math.min(0.66, wave(at, level, time))
  const fade = smoothstep(0.3, 0.92, x) * (1 - smoothstep(0.55, 1, y))
  // Most of the hero is empty: no wave to work out there.
  return fade === 0 ? 0 : wave(at, 1 - level, time) * 0.6 * fade
}

/**
 * The wave as text: `rows` lines of `columns` letters. `time` is in seconds. `lean` moves the
 * field by a part of the picture's size, as the hero wave leans toward the pointer on the site.
 */
export function waveRows(
  shape: Shape,
  columns: number,
  rows: number,
  time: number,
  lean: readonly [x: number, y: number] = [0, 0],
): string[] {
  const width = columns * 2
  const height = rows * 4
  const lines: string[] = []
  for (let row = 0; row < rows; row++) {
    let line = ""
    for (let column = 0; column < columns; column++) {
      let bits = 0
      for (let dy = 0; dy < 4; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const x = column * 2 + dx
          const y = row * 4 + dy
          const value = strength(
            shape,
            x / width,
            y / height,
            (x + lean[0] * width) * DOT,
            y / height + lean[1],
            time,
          )
          if (value * 255 > threshold(x, y)) bits |= BITS[dy]![dx]!
        }
      }
      line += bits ? String.fromCharCode(0x2800 + bits) : " "
    }
    lines.push(line)
  }
  return lines
}
