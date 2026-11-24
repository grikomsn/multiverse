/** Opens addresses and copies text: what Enter and `c` do on a row. */
import { spawn } from "node:child_process"

/** Runs a command with no terminal. True when it started and ended well. */
export const run = (command: string, args: string[], input?: string) =>
  new Promise<boolean>((resolve) => {
    try {
      const child = spawn(command, args, {
        stdio: [input === undefined ? "ignore" : "pipe", "ignore", "ignore"],
        detached: input === undefined,
      })
      child.once("error", () => resolve(false))
      if (input === undefined) {
        // A browser stays open: do not wait for it.
        child.once("spawn", () => resolve(true))
        child.unref()
      } else {
        child.once("close", (code) => resolve(code === 0))
        // A program that ends before it reads (no display, no clipboard) breaks the pipe. With
        // no listener, that error stops the whole card.
        child.stdin?.on("error", () => resolve(false))
        child.stdin?.end(input)
      }
    } catch {
      resolve(false)
    }
  })

/** Opens `url` in the browser or the mail program. False when no opener is there. */
export function openUrl(url: string) {
  if (process.platform === "darwin") return run("open", [url])
  if (process.platform === "win32") return run("cmd", ["/c", "start", "", url])
  return run("xdg-open", [url])
}

const COPIERS: [command: string, args: string[]][] =
  process.platform === "darwin"
    ? [["pbcopy", []]]
    : process.platform === "win32"
      ? [["clip", []]]
      : [
          ["wl-copy", []],
          ["xclip", ["-selection", "clipboard"]],
          ["xsel", ["--clipboard", "--input"]],
        ]

/**
 * Copies `text`. The terminal always gets the text (OSC 52): over SSH, the reader's clipboard
 * is on the machine with the terminal, not on the machine that runs the card. Some terminals
 * copy it and some do not, and none says which. So the answer is "copied" only when a clipboard
 * program on this machine took the text too, and "asked" when the terminal is the only hope.
 */
export async function copyText(
  text: string,
  write: (code: string) => unknown = (code) => process.stdout.write(code),
): Promise<"copied" | "asked"> {
  write(`\x1b]52;c;${Buffer.from(text).toString("base64")}\x07`)
  for (const [command, args] of COPIERS) {
    if (await run(command, args, text)) return "copied"
  }
  return "asked"
}
