/**
 * Ordered dithering on a 2D canvas: the site's one visual motif outside the hero shader.
 *
 * Every function draws dots of `px` CSS pixels in one color with a 4×4 Bayer matrix, the same
 * pattern as the hero wave (`dither-wave.ts`). The canvas holds one pixel for each dot and CSS
 * scales it up (`image-rendering: pixelated`), so a full frame costs a few thousand pixels.
 */

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5]

/** The value, from 0 to 255, that a dot at (x, y) must pass to be drawn. */
export const threshold = (x: number, y: number) =>
  ((BAYER[(y & 3) * 4 + (x & 3)]! + 0.5) / 16) * 255

export type Rgba = [red: number, green: number, blue: number, alpha: number]

const smoothstep = (low: number, high: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - low) / (high - low)))
  return t * t * (3 - 2 * t)
}

let scratch: CanvasRenderingContext2D | undefined
const pad = () =>
  (scratch ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true })!)

/** Any CSS color as numbers. `light-dark()` and `color-mix()` must be computed values. */
export function toRgba(color: string): Rgba {
  // Computed colors are nearly always `rgb()` or `rgba()`: read those without a canvas.
  const plain = color.match(
    /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)$/,
  )
  if (plain) {
    const alpha = plain[4] === undefined ? 255 : Math.round(Number(plain[4]) * 255)
    return [Number(plain[1]), Number(plain[2]), Number(plain[3]), alpha]
  }
  const context = pad()
  context.canvas.width = context.canvas.height = 1
  context.clearRect(0, 0, 1, 1)
  context.fillStyle = color
  context.fillRect(0, 0, 1, 1)
  const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data
  return [red!, green!, blue!, alpha!]
}

/** The color an element paints text with: set `color` in CSS, then read it here. */
export const inkOf = (element: Element) => toRgba(getComputedStyle(element).color)

/**
 * Size `canvas` to whole dots that cover its parent, and return the grid. The parent needs
 * `overflow: hidden`, because the canvas may be up to one dot larger. The layout size is used,
 * so a parent that is scaled or rotated still gets square dots.
 */
export function fit(canvas: HTMLCanvasElement, px: number) {
  const parent = canvas.parentElement!
  const columns = Math.max(1, Math.ceil(parent.clientWidth / px))
  const rows = Math.max(1, Math.ceil(parent.clientHeight / px))
  if (canvas.width !== columns) canvas.width = columns
  if (canvas.height !== rows) canvas.height = rows
  canvas.style.width = `${columns * px}px`
  canvas.style.height = `${rows * px}px`
  return { columns, rows }
}

type Tone = "auto" | "light"

interface CoverageOptions {
  /**
   * Which part of a picture with two tones to keep. `auto` keeps the smaller part, so a logo on
   * a flat ground reads as line work. `light` keeps the light part, for photos on a dark plate.
   */
  tone?: Tone
  fit?: "cover" | "contain"
  /** Free space on each side, as a part of the grid. */
  inset?: number
  /** Push every dot to full or empty, for marks. Photos keep their middle tones. */
  crisp?: boolean
}

/**
 * How much of each dot a picture covers, from 0 to 1.
 *
 * Transparent dots are empty. A picture in one flat color is a shape: its alpha is the answer.
 * A picture with two tones is split by lightness, after a contrast stretch that keeps a flat
 * ground clean.
 */
export function coverage(
  image: CanvasImageSource & { naturalWidth?: number; naturalHeight?: number },
  columns: number,
  rows: number,
  { tone = "auto", fit: mode = "cover", inset = 0, crisp = false }: CoverageOptions = {},
) {
  const context = pad()
  context.canvas.width = columns
  context.canvas.height = rows
  context.clearRect(0, 0, columns, rows)
  const width = image.naturalWidth || columns
  const height = image.naturalHeight || rows
  const boxWidth = columns * (1 - inset * 2)
  const boxHeight = rows * (1 - inset * 2)
  const ratio =
    mode === "cover"
      ? Math.max(boxWidth / width, boxHeight / height)
      : Math.min(boxWidth / width, boxHeight / height)
  context.drawImage(
    image,
    (columns - width * ratio) / 2,
    (rows - height * ratio) / 2,
    width * ratio,
    height * ratio,
  )
  const data = context.getImageData(0, 0, columns, rows).data
  const result = new Float32Array(columns * rows)
  // Lightness of the opaque dots, as a histogram: the 4th and 96th percentiles without a sort.
  const bins = new Uint32Array(256)
  let count = 0
  let total = 0
  for (let index = 0; index < result.length; index++) {
    const at = index * 4
    if (data[at + 3]! < 128) continue
    const lightness = Math.round(0.299 * data[at]! + 0.587 * data[at + 1]! + 0.114 * data[at + 2]!)
    bins[lightness]!++
    count++
    total += lightness
  }
  if (count === 0) return result
  const percentile = (part: number) => {
    let seen = 0
    for (let level = 0; level < 256; level++) {
      seen += bins[level]!
      if (seen >= count * part) return level / 255
    }
    return 1
  }
  const low = percentile(0.04)
  const high = percentile(0.96)
  const span = high - low
  // One flat color: the shape is the picture.
  if (span < 0.15) {
    for (let index = 0; index < result.length; index++) result[index] = data[index * 4 + 3]! / 255
    return result
  }
  const mean = total / count / 255
  const keepLight = tone === "light" || (mean - low) / span < 0.5
  for (let index = 0; index < result.length; index++) {
    const at = index * 4
    const alpha = data[at + 3]! / 255
    if (alpha < 0.5) continue
    const lightness = (0.299 * data[at]! + 0.587 * data[at + 1]! + 0.114 * data[at + 2]!) / 255
    let value = Math.max(0, Math.min(1, (lightness - low) / span))
    if (!keepLight) value = 1 - value
    result[index] = alpha * (crisp ? smoothstep(0.35, 0.65, value) : value)
  }
  return result
}

/**
 * A mark for a grid: the picture's shape, trimmed to what it covers and centered, with `inset`
 * free on each side. Marks then have the same visual size, whatever space their files leave.
 */
export function markShape(
  image: CanvasImageSource & { naturalWidth?: number; naturalHeight?: number },
  columns: number,
  rows: number,
  inset = 0,
) {
  // Marks show at 60 dots or fewer, so a 96 dot source is enough.
  const SIZE = 96
  const source = coverage(image, SIZE, SIZE, { fit: "contain", crisp: true })
  let left = SIZE
  let top = SIZE
  let right = -1
  let bottom = -1
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (source[y * SIZE + x]! < 0.5) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  const result = new Float32Array(columns * rows)
  if (right < left) return result
  const width = right - left + 1
  const height = bottom - top + 1
  const scale = Math.min((columns * (1 - inset * 2)) / width, (rows * (1 - inset * 2)) / height)
  const offsetX = (columns - width * scale) / 2
  const offsetY = (rows - height * scale) / 2
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      // The middle of this dot, in the source grid.
      const sx = left + (x + 0.5 - offsetX) / scale - 0.5
      const sy = top + (y + 0.5 - offsetY) / scale - 0.5
      if (sx < left - 0.5 || sx > right + 0.5 || sy < top - 0.5 || sy > bottom + 0.5) continue
      const x0 = Math.max(0, Math.min(SIZE - 1, Math.floor(sx)))
      const y0 = Math.max(0, Math.min(SIZE - 1, Math.floor(sy)))
      const x1 = Math.min(SIZE - 1, x0 + 1)
      const y1 = Math.min(SIZE - 1, y0 + 1)
      const fx = Math.max(0, Math.min(1, sx - x0))
      const fy = Math.max(0, Math.min(1, sy - y0))
      const above = source[y0 * SIZE + x0]! * (1 - fx) + source[y0 * SIZE + x1]! * fx
      const below = source[y1 * SIZE + x0]! * (1 - fx) + source[y1 * SIZE + x1]! * fx
      result[y * columns + x] = above * (1 - fy) + below * fy
    }
  }
  return result
}

/** Draw `values` (0 to 1 for each dot) as dots in `color`. */
export function paint(
  canvas: HTMLCanvasElement,
  values: Float32Array,
  columns: number,
  rows: number,
  [red, green, blue, alpha]: Rgba,
) {
  const context = canvas.getContext("2d")!
  const output = context.createImageData(columns, rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const index = y * columns + x
      if (values[index]! * 255 <= threshold(x, y)) continue
      const at = index * 4
      output.data[at] = red
      output.data[at + 1] = green
      output.data[at + 2] = blue
      output.data[at + 3] = alpha
    }
  }
  context.putImageData(output, 0, 0)
}

/**
 * The hero wave, as a field: 0 above the wave line, rising to 1 below it. The formula is the
 * "wave" shape of the Paper dithering shader, so the footer band and the hero match.
 * `x` is in CSS pixels, `y` runs from 0 (top) to 1 (bottom), `time` is in seconds.
 */
export function wave(x: number, y: number, time: number) {
  const u = x / 180
  const line =
    Math.cos(0.5 * u - 2 * time) * Math.sin(1.5 * u + time) * (0.75 + 0.25 * Math.cos(3 * time))
  return smoothstep(-1, 1, (y - 0.5) * 3.2 - line)
}

/** A band of the wave that rises from the bottom edge. `cap` keeps it from turning solid. */
export function paintWave(
  canvas: HTMLCanvasElement,
  { px, color, time, cap = 0.66 }: { px: number; color: Rgba; time: number; cap?: number },
) {
  const { columns, rows } = fit(canvas, px)
  const values = new Float32Array(columns * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      values[y * columns + x] = Math.min(cap, wave(x * px, y / rows, time))
    }
  }
  paint(canvas, values, columns, rows, color)
}

/**
 * A shape filled with the wave: thin at the top, dense at the bottom, with the wave line moving
 * through it. For project marks and the 404 number.
 */
export function paintShape(
  canvas: HTMLCanvasElement,
  shape: Float32Array,
  columns: number,
  rows: number,
  { px, color, time }: { px: number; color: Rgba; time: number },
) {
  const values = new Float32Array(columns * rows)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const index = y * columns + x
      if (shape[index]! <= 0) continue
      const along = (x * px) / 120
      const lift = Math.sin(along - time * 0.9) * Math.sin(along * 0.44 + time * 0.5) * 0.22
      values[index] = shape[index]! * Math.max(0.14, Math.min(1, y / rows + lift + 0.12))
    }
  }
  paint(canvas, values, columns, rows, color)
}

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches

/**
 * Call `draw` about 12 times a second while `element` is on screen and the tab is visible.
 * Dots this size do not need more. Returns a function that stops the loop.
 */
export function animate(element: Element, draw: (seconds: number) => void, fps = 12) {
  let frame = 0
  let last = 0
  let visible = false
  const loop = (now: number) => {
    frame = requestAnimationFrame(loop)
    if (now - last < 1000 / fps) return
    last = now
    draw(now / 1000)
  }
  const sync = () => {
    const run = visible && !document.hidden
    if (run && !frame) frame = requestAnimationFrame(loop)
    if (!run && frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry!.isIntersecting
    sync()
  })
  observer.observe(element)
  document.addEventListener("visibilitychange", sync)
  return () => {
    observer.disconnect()
    document.removeEventListener("visibilitychange", sync)
    visible = false
    sync()
  }
}

/** Call `listener` when the theme changes: the toggle, or the system setting. */
export function onThemeChange(listener: () => void) {
  new MutationObserver(listener).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", listener)
}
