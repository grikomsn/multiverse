/**
 * The screen: what stands between Ink and the terminal.
 *
 * Ink draws the card again only when something changes: a key, a new mood. It gives each frame
 * to this file as text, and this file writes the lines that changed. The wave is not Ink's: it
 * is drawn here, straight to the terminal, 12 times a second, and only the dots that changed
 * are written. A frame of the wave then costs a few hundred bytes and no work in Ink. With the
 * wave inside Ink, every frame made Ink read the color codes of the whole screen again, and
 * that took about a tenth of a processor.
 *
 * The wave is behind the text, as on the site: a dot goes only where Ink left an empty cell
 * with the page's ground, two cells or more away from any letter.
 */
import { EventEmitter } from "node:events"

import { to256 } from "./face"
import { FOCUS_OFF, FOCUS_ON, POINTER_OFF, POINTER_ON } from "./pointer"
import type { ColorDepth } from "./terminal"
import { rgb } from "./theme"
import { waveRows } from "./wave"

const ENTER = "\x1b[?1049h\x1b[?25l"
const LEAVE = "\x1b[?25h\x1b[?1049l"
/** Synchronized output: the terminal shows a frame at once, not in parts. */
const HOLD = "\x1b[?2026h"
const SHOW = "\x1b[?2026l"
const RESET = "\x1b[0m"
const SPACE = 32

/** The wave runs slower than on the site: a terminal draws larger dots. */
const SPEED = 0.45
/** The frame that shows when the wave stands still. */
const STILL = 24
/** How far the wave leans toward the pointer, as a part of its size: the site's number. */
const LEAN = 0.12
/** The wave stops after this time with no key and no pointer, in milliseconds. */
const IDLE = 120_000
/** How near a letter a dot may come, in cells. */
const CLEAR = 2

/** What the screen needs from the terminal's output stream. */
export interface Terminal {
  columns: number
  rows: number
  write(text: string): unknown
  on(event: "resize", listener: () => void): unknown
  off(event: "resize", listener: () => void): unknown
  /**
   * The ground of the card, as hex, or nothing when the card ends. A terminal in a page
   * paints the space around its cells with it (`web/page.ts`). Node's stream has no such call.
   */
  setGround?(color: string | undefined): void
}

export interface WaveSpec {
  /** Rows of the hero wave, from the top. 0 for none. */
  hero: number
  /** Rows of the band, from the bottom. 0 for none. */
  band: number
  /** The color of the dots, as hex. */
  color: string
}

export interface ScreenOptions {
  terminal: Terminal
  depth: ColorDepth
  /** Frames of the wave in a second. */
  fps: number
  /** False for a wave that stands still. */
  motion: boolean
}

/** One line of Ink's frame: where its letters are, and the ground of each cell. */
interface Scan {
  /** 1 where a cell holds a letter. */
  ink: Uint8Array
  /** The ground of each cell, as the parameters of its color code. "" is the terminal's own. */
  grounds: string[]
  /** How many cells the line fills. */
  width: number
}

const CODE = /\x1b\[([\d;]*)([A-Za-z])/y
const ZERO_WIDTH = /^[\p{Mn}\p{Me}\p{Cf}]$/u
const isWide = (point: number) =>
  (point >= 0x1100 && point <= 0x115f) ||
  (point >= 0x2e80 && point <= 0xa4cf) ||
  (point >= 0xac00 && point <= 0xd7a3) ||
  (point >= 0xf900 && point <= 0xfaff) ||
  (point >= 0xfe30 && point <= 0xfe4f) ||
  (point >= 0xff00 && point <= 0xff60) ||
  (point >= 0xffe0 && point <= 0xffe6) ||
  (point >= 0x1f300 && point <= 0x1faff)

/** The ground after a color code with these parameters. */
function groundAfter(ground: string, parameters: string) {
  const parts = parameters === "" ? ["0"] : parameters.split(";")
  for (let index = 0; index < parts.length; index++) {
    const part = Number(parts[index])
    if (part === 0 || part === 49) ground = ""
    else if ((part >= 40 && part <= 47) || (part >= 100 && part <= 107)) ground = String(part)
    else if (part === 38 || part === 48) {
      // "2;r;g;b" or "5;n" follows.
      const length = parts[index + 1] === "2" ? 4 : 2
      if (part === 48) ground = parts.slice(index, index + length + 1).join(";")
      index += length
    }
  }
  return ground
}

/** A ground with all the colors ("48;2;r;g;b") as hex. Nothing for any other ground. */
export function hexOf(ground: string) {
  const parts = /^48;2;(\d+);(\d+);(\d+)$/.exec(ground)
  if (!parts) return undefined
  return (
    "#" +
    parts
      .slice(1)
      .map((part) => Number(part).toString(16).padStart(2, "0"))
      .join("")
  )
}

/** Reads one line of a frame. */
export function scanLine(line: string, columns: number): Scan {
  const ink = new Uint8Array(columns)
  const grounds = new Array<string>(columns).fill("")
  let ground = ""
  let column = 0
  for (let at = 0; at < line.length;) {
    if (line.charCodeAt(at) === 0x1b) {
      CODE.lastIndex = at
      const code = CODE.exec(line)
      if (code?.[2] === "m") ground = groundAfter(ground, code[1]!)
      at += code ? code[0].length : 2
      continue
    }
    const point = line.codePointAt(at)!
    const letter = String.fromCodePoint(point)
    at += letter.length
    if (ZERO_WIDTH.test(letter)) continue
    const cells = isWide(point) ? 2 : 1
    for (let cell = 0; cell < cells && column < columns; cell++, column++) {
      ink[column] = letter === " " ? 0 : 1
      grounds[column] = ground
    }
  }
  return { ink, grounds, width: column }
}

export class Screen extends EventEmitter {
  // Ink asks its output for these.
  readonly isTTY = true
  readonly writable = true
  readonly writableEnded = false
  readonly destroyed = false

  private readonly terminal: Terminal
  private readonly depth: ColorDepth
  private readonly interval: number
  private readonly motion: boolean

  private open = false
  /** Ink's frame, line by line, as it is on the terminal. */
  private lines: string[] = []
  private scans: Scan[] = []
  /** The letter in each cell that the wave has drawn, row after row. A space where none. */
  private dots = new Uint16Array(0)
  /** How many dots each row holds. */
  private counts = new Uint16Array(0)
  /** The ground of the page: the most common ground of the empty cells. */
  private page = ""
  private wave: WaveSpec = { hero: 0, band: 0, color: "#000000" }
  private timer: NodeJS.Timeout | undefined
  /** How long the wave has run, in seconds. It stands still while the timer is off. */
  private elapsed = 0
  private focused = true
  private touched = Date.now()
  private pointerOn = false
  private lean: [number, number] = [0, 0]
  private target: [number, number] = [0, 0]

  constructor({ terminal, depth, fps, motion }: ScreenOptions) {
    super()
    this.terminal = terminal
    this.depth = depth
    this.interval = 1000 / fps
    this.motion = motion
  }

  get columns() {
    return this.terminal.columns
  }

  get rows() {
    return this.terminal.rows
  }

  /** Takes the terminal: its second screen, with no cursor, and reports of focus. */
  start({ pointer }: { pointer: boolean }) {
    this.open = true
    this.terminal.write(ENTER + FOCUS_ON)
    this.setPointer(pointer)
    this.terminal.on("resize", this.resize)
    process.once("exit", this.close)
    this.sync()
  }

  /** Gives the terminal back as it was. Safe to call twice. */
  close = () => {
    if (!this.open) return
    this.open = false
    clearInterval(this.timer)
    this.timer = undefined
    this.terminal.off("resize", this.resize)
    this.terminal.write((this.pointerOn ? POINTER_OFF : "") + FOCUS_OFF + RESET + LEAVE)
    this.terminal.setGround?.(undefined)
  }

  /** Turns the reports of the pointer on or off. With them off, the reader can select text. */
  setPointer(on: boolean) {
    if (!this.open || on === this.pointerOn) return
    this.pointerOn = on
    this.terminal.write(on ? POINTER_ON : POINTER_OFF)
    if (!on) this.target = [0, 0]
  }

  /**
   * Ink writes a frame here: the whole screen as text. Other writes are control codes. Ink
   * waits for the callback of an empty write before it ends, as a stream would call it.
   */
  write(data: string | Uint8Array, ...rest: unknown[]) {
    const done = rest.find((value) => typeof value === "function") as (() => void) | undefined
    if (done) process.nextTick(done)
    if (!this.open) return true
    const text = typeof data === "string" ? data : Buffer.from(data).toString("utf8")
    // Ink ends its last frame with a line feed of its own.
    if (text === "" || text === "\n") return true
    if (text.replace(/\x1b\[[?<>=\d;]*[A-Za-z]/g, "") === "") {
      this.terminal.write(text)
      return true
    }
    this.terminal.write(HOLD + this.frame(text) + this.paint() + SHOW)
    return true
  }

  /** Where the wave is and its color. The card calls this when its layout or theme changes. */
  setWave(wave: WaveSpec) {
    // Dots in the old color stay on the terminal until they are written again.
    const recolor = wave.color !== this.wave.color
    this.wave = wave
    if (!this.open) return
    const out = this.paint(recolor)
    if (out) this.terminal.write(HOLD + out + SHOW)
  }

  /** The pointer's place, from 0 to 1 over the screen: the wave leans toward it. */
  point(x: number, y: number) {
    this.target = [(x - 0.5) * -LEAN, (y - 0.5) * LEAN]
  }

  /** The window has the focus, or lost it. The wave moves only in a window that has it. */
  focus(on: boolean) {
    this.focused = on
    this.sync()
  }

  /** A key or the pointer: the reader is here. */
  touch() {
    this.touched = Date.now()
    if (!this.timer) this.sync()
  }

  /** Starts or stops the wave's timer, as the state asks. */
  private sync() {
    const run = this.open && this.motion && this.focused && Date.now() - this.touched < IDLE
    if (run && !this.timer) this.timer = setInterval(this.tick, this.interval)
    if (!run && this.timer) {
      clearInterval(this.timer)
      this.timer = undefined
    }
  }

  private tick = () => {
    if (Date.now() - this.touched >= IDLE) return this.sync()
    this.elapsed += (this.interval / 1000) * SPEED
    this.lean[0] += (this.target[0] - this.lean[0]) * 0.3
    this.lean[1] += (this.target[1] - this.lean[1]) * 0.3
    const out = this.paint()
    if (out) this.terminal.write(HOLD + out + SHOW)
  }

  private resize = () => {
    // The terminal moved everything: start from an empty screen.
    this.lines = []
    this.scans = []
    this.dots = new Uint16Array(0)
    this.terminal.write(RESET + "\x1b[2J")
    this.emit("resize")
  }

  /** Writes the lines of Ink's frame that changed. Returns the text for the terminal. */
  private frame(text: string) {
    const { columns, rows } = this
    if (this.dots.length !== columns * rows) {
      this.dots = new Uint16Array(columns * rows).fill(SPACE)
      this.counts = new Uint16Array(rows)
      this.lines = []
    }
    const next = text.split("\n")
    let out = ""
    for (let row = 0; row < rows; row++) {
      const line = next[row] ?? ""
      if (line === this.lines[row]) continue
      const scan = scanLine(line, columns)
      this.lines[row] = line
      this.scans[row] = scan
      // A full line leaves the cursor on the last cell: erasing from there would take that cell.
      out += `\x1b[${row + 1};1H${line}${RESET}${scan.width < columns ? "\x1b[K" : ""}`
      // The line went over the wave's dots.
      this.dots.fill(SPACE, row * columns, (row + 1) * columns)
      this.counts[row] = 0
    }
    if (out) {
      const page = this.pageGround()
      if (page !== this.page) this.terminal.setGround?.(hexOf(page))
      this.page = page
    }
    return out
  }

  /** The most common ground of the empty cells in the first rows. */
  private pageGround() {
    const seen = new Map<string, number>()
    for (const scan of this.scans.slice(0, 8)) {
      scan?.grounds.forEach((ground, column) => {
        if (!scan.ink[column]) seen.set(ground, (seen.get(ground) ?? 0) + 1)
      })
    }
    let page = ""
    let most = 0
    for (const [ground, count] of seen) {
      if (count > most) {
        most = count
        page = ground
      }
    }
    return page
  }

  /** Whether the wave may put a dot in a cell: empty, on the page's ground, clear of letters. */
  private free(scan: Scan, column: number) {
    if (scan.grounds[column] !== this.page) return false
    const from = Math.max(0, column - CLEAR)
    const to = Math.min(scan.ink.length - 1, column + CLEAR)
    for (let at = from; at <= to; at++) if (scan.ink[at]) return false
    return true
  }

  /** The color codes for a dot: its own color on the page's ground. */
  private ink() {
    const color = rgb(this.wave.color)
    const front =
      this.depth >= 24
        ? `38;2;${color[0]};${color[1]};${color[2]}`
        : this.depth >= 8
          ? `38;5;${to256(color)}`
          : this.depth >= 4
            ? "33"
            : ""
    return `\x1b[0${front && `;${front}`}${this.page && `;${this.page}`}m`
  }

  /**
   * Draws the wave over the frame. Returns the text for the terminal: only what changed, or
   * every dot with `all`.
   */
  private paint(all = false) {
    const { columns, rows } = this
    if (this.dots.length !== columns * rows || this.scans.length === 0) return ""
    const hero = Math.min(this.wave.hero, rows)
    const band = Math.min(this.wave.band, rows - hero)
    const time = STILL + this.elapsed
    const top = hero > 0 ? waveRows("hero", columns, hero, time, this.lean) : []
    const bottom = band > 0 ? waveRows("band", columns, band, time) : []
    let out = ""
    for (let row = 0; row < rows; row++) {
      const want =
        row < hero ? top[row] : row >= rows - band ? bottom[row - (rows - band)] : undefined
      // A row outside the wave needs work only while it holds old dots.
      if (want === undefined && this.counts[row] === 0) continue
      const scan = this.scans[row]
      if (!scan) continue
      const base = row * columns
      let run = ""
      let runAt = -1
      for (let column = 0; column <= columns; column++) {
        let letter = -1
        if (column < columns && this.free(scan, column)) {
          const wanted = want ? want.charCodeAt(column) : SPACE
          if (wanted !== this.dots[base + column] || (all && wanted !== SPACE)) letter = wanted
        }
        if (letter < 0) {
          if (run) out += `\x1b[${row + 1};${runAt + 1}H${run}`
          run = ""
          continue
        }
        if (!run) runAt = column
        run += String.fromCharCode(letter)
        const before = this.dots[base + column]
        this.counts[row]! += (letter === SPACE ? 0 : 1) - (before === SPACE ? 0 : 1)
        this.dots[base + column] = letter
      }
    }
    return out && this.ink() + out + RESET
  }
}
