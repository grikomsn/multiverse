/**
 * The page: `npx grikomsn` in a browser. A terminal (wterm) fills the window, a prompt types
 * the command, and the card runs as it does in Node.js. `main()` reads and writes through
 * `process`; this file gives it the terminal as its streams.
 *
 * The page runs the card's own code, built for a browser (`scripts/build-web.ts`). It does not
 * download the package from npm.
 */
import "./globals"

import { Buffer } from "node:buffer"
import { EventEmitter } from "node:events"
import { PassThrough } from "node:stream"

import { WTerm } from "@wterm/dom"

import { process as host } from "./node"
import { argsOf, COLUMNS, COMMAND, CORE, FONT, TYPING, typeInto } from "./shell"

const element = document.getElementById("terminal")!
const still = matchMedia("(prefers-reduced-motion: reduce)")
const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

/** How wide a letter of the terminal's font is, as a part of its size. */
function advance() {
  const probe = document.createElement("span")
  probe.textContent = "0".repeat(20)
  probe.style.cssText =
    "position:absolute;visibility:hidden;white-space:pre;font:100px var(--term-font-family)"
  element.append(probe)
  const width = probe.getBoundingClientRect().width / 20 / 100
  element.removeChild(probe)
  return width || 0.6
}

/** Sets the size of the letters: smaller in a narrow window, so the live card still has room. */
function fitFont() {
  const most = element.clientWidth / COLUMNS / advance()
  // Half pixels are the smallest step that all browsers draw the same.
  const size = Math.max(FONT.min, Math.min(FONT.max, Math.floor(most * 2) / 2))
  element.style.setProperty("--term-font-size", `${size}px`)
  // A whole number of pixels: the halves of the mascot's cells then meet with no line between.
  element.style.setProperty("--term-row-height", `${Math.round(size * 1.22)}px`)
}

/** The keyboard, as Node gives it: a stream that Ink can put in raw mode. */
const stdin = Object.assign(new PassThrough(), {
  isTTY: true,
  setRawMode: () => stdin,
  ref: () => stdin,
  unref: () => stdin,
})

const themeColors = [...document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')]
const pageGrounds = themeColors.map((meta) => meta.content)

/** The screen, as Node gives it. */
const stdout = Object.assign(new EventEmitter(), {
  isTTY: true,
  columns: 80,
  rows: 24,
  getColorDepth: () => 24,
  write(data: string | Uint8Array) {
    // As a terminal's driver does: a line feed also goes back to the first column.
    terminal.write(typeof data === "string" ? data.replace(/\r?\n/g, "\r\n") : data)
    return true
  },
  /** The card's ground goes around the cells too, and into the browser's own bars. */
  setGround(color: string | undefined) {
    if (color) element.style.setProperty("--term-bg", color)
    else element.style.removeProperty("--term-bg")
    document.documentElement.style.background = color ?? ""
    themeColors.forEach((meta, index) => (meta.content = color ?? pageGrounds[index]!))
  },
})

fitFont()
const terminal = new WTerm(element, {
  autoResize: true,
  // As a file, the browser compiles it while it comes. wterm's own copy is text inside its code.
  wasmUrl: CORE,
  onData: (data) => stdin.write(Buffer.from(data, "utf8")),
  onResize(columns, rows) {
    stdout.columns = columns
    stdout.rows = rows
    stdout.emit("resize")
  },
})
await terminal.init()
stdout.columns = terminal.cols
stdout.rows = terminal.rows
Object.assign(host, { stdin, stdout, stderr: stdout })
addEventListener("resize", fitFont)

// A phone shows its keyboard when a text field gets the focus, and it would cover half of the
// card after each tap. The card works with taps alone, so the field asks for no keyboard.
const field = element.querySelector("textarea")
if (field && matchMedia("(pointer: coarse)").matches) field.inputMode = "none"
terminal.focus()

/** What `index.html` leaves for this file: its timer, and the parts of the card's code. */
const page = window as { typing?: number; later?: string[] }

/** The faces are packed. A browser unpacks them with a stream, so do it before the card draws. */
async function unpackFaces() {
  const { PACKED_FACES, setFacePixels } = await import("../face")
  const packed = Uint8Array.from(atob(PACKED_FACES), (letter) => letter.charCodeAt(0))
  const stream = new Blob([packed]).stream().pipeThrough(new DecompressionStream("deflate"))
  setFacePixels(new Uint8Array(await new Response(stream).arrayBuffer()))
}

/**
 * Gets the card's code: the larger half of the page. It comes after the terminal shows its
 * prompt, so the two do not share a slow network. The browser gets every part at once.
 */
async function loadCard() {
  for (const part of page.later ?? []) {
    const link = document.createElement("link")
    link.rel = "modulepreload"
    link.href = part
    document.head.append(link)
  }
  const [{ main }] = await Promise.all([
    import("../main"),
    import("ink"),
    import("../app"),
    import("../screen"),
    import("../pointer"),
    unpackFaces(),
  ])
  return main
}

const DIM = "\x1b[2m"
const RESET = "\x1b[0m"
const PROMPT = `${DIM}$${RESET} `

/** Reads one line at the prompt, and shows it as the reader types. */
function readLine() {
  return new Promise<string>((resolve) => {
    let line = ""
    const read = (chunk: Buffer) => {
      const next = typeInto(line, chunk.toString("utf8"))
      line = next.line
      terminal.write(`\r${PROMPT}${line}\x1b[K`)
      if (!next.done) return
      stdin.off("data", read)
      terminal.write("\r\n")
      resolve(line)
    }
    stdin.on("data", read)
    // The card pauses the keyboard when it ends.
    stdin.resume()
  })
}

/** Runs the card with these arguments, and shows an error that nothing caught. */
async function run(args: string[]) {
  host.env.NO_MOTION = still.matches ? "1" : undefined
  try {
    const main = await card
    host.exitCode = await main(args)
  } catch (error) {
    stdout.setGround(undefined)
    stdout.write(`\x1b[?1049l\x1b[?25h${RESET}${error instanceof Error ? error.message : error}\n`)
    host.exitCode = 1
  }
}

// The page types the command once, as a person would. It began while this code came (the
// script in `index.html`): take over at the letter it reached. With reduced motion, the
// command is there at once.
clearTimeout(page.typing)
const typed = document.getElementById("typed")?.textContent ?? ""
terminal.write(PROMPT + typed)
document.getElementById("first")?.setAttribute("hidden", "")
// Get the card after the prompt is on the screen. The second frame starts when the first one,
// with the prompt in it, is shown.
const card = new Promise((resolve) =>
  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve))),
).then(loadCard)
for (const letter of COMMAND.slice(typed.length)) {
  if (!still.matches) await sleep(TYPING.letter)
  terminal.write(letter)
}
// A command that was there before this code came has had its wait.
if (!still.matches && typed !== COMMAND) await sleep(TYPING.end)
terminal.write("\r\n")

for (let args: string[] | undefined = []; ;) {
  if (args) await run(args)
  else stdout.write(`This page has one command: ${COMMAND}\n`)
  stdout.write(`${DIM}Press Enter to run it again. Add --help for its options.${RESET}\n${PROMPT}`)
  args = argsOf(await readLine())
}
