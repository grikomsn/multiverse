/**
 * The prompt of the page: a shell with one command. It reads a line as a terminal driver
 * does, and says which arguments the card gets.
 */

import { MIN_SIZE } from "../terminal"

/** What the page types for the reader, and what Enter on an empty line runs. */
export const COMMAND = "npx grikomsn"

/** Where GitHub Pages serves the page: the site of the repository `grikomsn/grikomsn`. */
export const PAGE_URL = "https://grikomsn.github.io/grikomsn/"

/** The terminal's own code (WebAssembly), as a file next to the page. */
export const CORE = "wterm.wasm"

/** How the page types it, in milliseconds: a wait, each letter, and a wait before Enter. */
export const TYPING = { start: 350, letter: 55, end: 250 }

/** The largest and the smallest letters, in pixels. */
export const FONT = { max: 14, min: 11 }

/** The columns of a narrow window, when its letters can be that small: the card's least, and two. */
export const COLUMNS = MIN_SIZE.columns + 2

/**
 * The arguments of the card in `line`, or nothing when the line is another command.
 * An empty line runs the card again.
 */
export function argsOf(line: string): string[] | undefined {
  const words = line.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return []
  if (words[0] === "npx") words.shift()
  return words[0] === "grikomsn" ? words.slice(1) : undefined
}

/** What a line of input looks like after `data`: letters add, Backspace takes one away. */
export function typeInto(line: string, data: string) {
  let next = line
  let done = false
  // An escape code is a key that a line has no use for: an arrow, a function key.
  for (const letter of data.replace(/\x1b(\[[\d;?<>=]*[A-Za-z~]|O[A-Za-z]|.)?/g, "")) {
    if (letter === "\r" || letter === "\n") {
      done = true
      break
    }
    if (letter === "\x7f" || letter === "\b") next = [...next].slice(0, -1).join("")
    // Ctrl C and Ctrl U start the line again.
    else if (letter === "\x03" || letter === "\x15") next = ""
    else if (letter >= " ") next += letter
  }
  return { line: next, done }
}
