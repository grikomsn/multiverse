/**
 * The pointer and the window's focus, from the terminal.
 *
 * A terminal reports the mouse as text on the keyboard's stream (SGR mode 1006), and Ink
 * drops such reports. So this file reads the stream first: it takes the reports out and gives
 * Ink the rest through a stream of its own.
 */
import { PassThrough } from "node:stream"
import { StringDecoder } from "node:string_decoder"

export type TerminalEvent =
  /** `x` and `y` count cells from 0, from the top left corner. */
  | { kind: "move" | "down" | "up"; x: number; y: number }
  /** `by` is -1 for a turn of the wheel up, 1 for down. */
  | { kind: "wheel"; x: number; y: number; by: -1 | 1 }
  | { kind: "focus"; on: boolean }

/** Clicks and wheel, every move, positions as numbers, and focus reports. */
export const POINTER_ON = "\x1b[?1000h\x1b[?1003h\x1b[?1006h"
export const POINTER_OFF = "\x1b[?1006l\x1b[?1003l\x1b[?1000l"
export const FOCUS_ON = "\x1b[?1004h"
export const FOCUS_OFF = "\x1b[?1004l"

const REPORT = /\x1b\[<(\d+);(\d+);(\d+)([Mm])|\x1b\[([IO])/g
/** The start of a mouse report whose end is in the next piece of input. */
const OPEN = /\x1b\[<[\d;]*$/

/**
 * Takes the reports out of `text`. `rest` is what a person typed. `open` is a report that is
 * not complete: put it before the next piece of input.
 */
export function readReports(text: string) {
  const events: TerminalEvent[] = []
  let open = ""
  const cut = OPEN.exec(text)
  if (cut) {
    open = cut[0]
    text = text.slice(0, cut.index)
  }
  const rest = text.replace(REPORT, (_, code, column, row, end, focus) => {
    if (focus) {
      events.push({ kind: "focus", on: focus === "I" })
      return ""
    }
    const button = Number(code)
    const at = { x: Number(column) - 1, y: Number(row) - 1 }
    // 64 marks the wheel and 32 a move. The two low bits name the button: 0 is the main one.
    if (button & 64) events.push({ kind: "wheel", ...at, by: button & 1 ? 1 : -1 })
    else if (button & 32) events.push({ kind: "move", ...at })
    else if ((button & 3) === 0) events.push({ kind: end === "M" ? "down" : "up", ...at })
    return ""
  })
  return { events, rest, open }
}

type Listener = (event: TerminalEvent) => void

/** The keyboard for Ink, and the pointer for the card. */
export interface Input {
  /** What Ink reads: the terminal's input without the reports. */
  stream: NodeJS.ReadStream
  /** Calls `listener` for each report. Returns a function that stops it. */
  subscribe(listener: Listener): () => void
  close(): void
}

/** Reads `source` (the terminal's input). `onAny` runs for every piece of input. */
export function tapInput(source: NodeJS.ReadStream, onAny: () => void): Input {
  const listeners = new Set<Listener>()
  const decoder = new StringDecoder("utf8")
  let open = ""
  const through = new PassThrough()
  // Ink asks its input for raw mode and holds the process open through it.
  const stream = Object.assign(through, {
    isTTY: true,
    setRawMode(mode: boolean) {
      source.setRawMode(mode)
      return stream
    },
    ref() {
      source.ref()
      return stream
    },
    unref() {
      source.unref()
      return stream
    },
  }) as unknown as NodeJS.ReadStream

  const read = (chunk: Buffer) => {
    onAny()
    const result = readReports(open + decoder.write(chunk))
    open = result.open
    for (const event of result.events) for (const listener of listeners) listener(event)
    if (result.rest) through.write(result.rest)
  }
  source.on("data", read)
  // The question about the terminal's ground paused the stream, and a paused stream stays so.
  source.resume()

  return {
    stream,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    close() {
      source.off("data", read)
      source.pause()
      through.end()
    },
  }
}
