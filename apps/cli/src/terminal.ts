/**
 * What the terminal can do: its colors, whether its ground is dark, and whether to move.
 * Node has no library call for the last two, so this file asks the terminal and reads the
 * environment.
 */

/** How many colors: none, 16, 256 or all of them. */
export type ColorDepth = 0 | 4 | 8 | 24

/** Node's own answer. It follows NO_COLOR, FORCE_COLOR and TERM=dumb. */
export function colorDepth(stream: NodeJS.WriteStream = process.stdout): ColorDepth {
  if (!stream.isTTY) return 0
  const depth = stream.getColorDepth()
  return depth >= 24 ? 24 : depth >= 8 ? 8 : depth >= 4 ? 4 : 0
}

type Env = Record<string, string | undefined>

const isSet = (value: string | undefined) => value !== undefined && value !== "" && value !== "0"

/**
 * Whether to show still pictures. A terminal has no `prefers-reduced-motion`, so the card
 * reads the names that other tools use.
 */
export const reducedMotion = (env: Env = process.env) =>
  ["NO_MOTION", "REDUCE_MOTION", "REDUCED_MOTION", "NO_ANIMATION"].some((name) => isSet(env[name]))

/** The smallest window for the live screen. A smaller one gets text, or a note to grow it. */
export const MIN_SIZE = { columns: 44, rows: 16 }

/**
 * Whether the card can be a live screen: a terminal on both ends, large enough, and not a
 * build log. If not, the card is plain text.
 */
export function isInteractive(env: Env = process.env) {
  const { stdin, stdout } = process
  if (!stdin.isTTY || !stdout.isTTY) return false
  if (env.TERM === "dumb" || isSet(env.CI)) return false
  return stdout.columns >= MIN_SIZE.columns && stdout.rows >= MIN_SIZE.rows
}

/** Frames of the wave in a second: 12 as on the site, and half of that over SSH. */
export const waveFps = (env: Env = process.env) => (env.SSH_CONNECTION || env.SSH_TTY ? 6 : 12)

/** The Linux console has no font for braille or half blocks beyond a few letters. */
export const hasBraille = (env: Env = process.env) => env.TERM !== "linux"

/** `COLORFGBG` is "text;ground" in the 16 colors. Grounds 7 and 15 are light. */
function darkFromEnv(env: Env) {
  const ground = env.COLORFGBG?.split(";").at(-1)
  if (!ground || !/^\d+$/.test(ground)) return undefined
  return ground !== "7" && ground !== "15"
}

/**
 * Whether the terminal's ground is dark, so the card starts in the theme of the terminal, as
 * the site follows the system. It asks for the ground color (OSC 11) and then for the device
 * attributes, which every terminal answers: when that answer comes, no color is on its way.
 * Call it before Ink reads the keyboard.
 */
export function detectDark(env: Env = process.env, wait = 300): Promise<boolean | undefined> {
  const { stdin, stdout } = process
  if (!stdin.isTTY || !stdout.isTTY) return Promise.resolve(darkFromEnv(env))
  return new Promise((resolve) => {
    let answer = ""
    let dark: boolean | undefined
    const done = () => {
      clearTimeout(timer)
      stdin.off("data", read)
      stdin.setRawMode(false)
      stdin.pause()
      resolve(dark ?? darkFromEnv(env))
    }
    const read = (chunk: Buffer) => {
      answer += chunk.toString("latin1")
      const color = answer.match(/\]11;rgb:([0-9a-f]+)\/([0-9a-f]+)\/([0-9a-f]+)/i)
      if (color) {
        // Each part has one to four hex digits: read it as a part of its largest value.
        const [red, green, blue] = color
          .slice(1)
          .map((part) => parseInt(part, 16) / (16 ** part.length - 1))
        dark = 0.2126 * red! + 0.7152 * green! + 0.0722 * blue! < 0.5
      }
      if (/\x1b\[\?[\d;]*c/.test(answer)) done()
    }
    const timer = setTimeout(done, wait)
    stdin.setRawMode(true)
    stdin.resume()
    stdin.on("data", read)
    stdout.write("\x1b]11;?\x1b\\\x1b[c")
  })
}
