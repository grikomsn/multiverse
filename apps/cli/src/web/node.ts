/**
 * Node.js in a browser: the few parts that the card, Ink and Ink's helpers ask for.
 *
 * `scripts/build-web.ts` gives `process` in place of `node:process`, and each entry of
 * `modules` in place of the module of that name. Events come from the bundler. A call that
 * is not here is not there: add it when a new version of Ink asks for it.
 */

import { Buffer, PassThrough, Stream, StringDecoder } from "./streams"

type Listener = (...values: unknown[]) => void

const listeners = new Map<string, Set<Listener>>()

function on(name: string, listener: Listener) {
  let set = listeners.get(name)
  if (!set) listeners.set(name, (set = new Set()))
  set.add(listener)
  return process
}

function off(name: string, listener: Listener) {
  listeners.get(name)?.delete(listener)
  return process
}

function emit(name: string, ...values: unknown[]) {
  for (const listener of [...(listeners.get(name) ?? [])]) listener(...values)
  return true
}

/** The streams of the page's terminal. `page.ts` sets them before the card runs. */
export interface Streams {
  stdin: unknown
  stdout: unknown
}

export const process = {
  // The page's terminal has all the colors, and nothing here is a build log.
  env: { TERM: "xterm-256color", COLORTERM: "truecolor" } as Record<string, string | undefined>,
  argv: [] as string[],
  execArgv: [] as string[],
  versions: {},
  platform: "browser",
  pid: 1,
  exitCode: undefined as number | undefined,
  cwd: () => "/",
  on,
  addListener: on,
  off,
  removeListener: off,
  once(name: string, listener: Listener) {
    const once: Listener = (...values) => {
      off(name, once)
      listener(...values)
    }
    return on(name, once)
  },
  emit,
  listeners: (name: string) => [...(listeners.get(name) ?? [])],
  nextTick: (run: Listener, ...values: unknown[]) => queueMicrotask(() => run(...values)),
  /** A page does not end. The card's own screen listens for "exit" and gives the terminal back. */
  exit(code = 0) {
    process.exitCode = code
    emit("exit", code)
  },
  stdin: undefined as unknown,
  stdout: undefined as unknown,
  stderr: { isTTY: false, write: (text: string) => console.error(text) } as unknown,
}

/** The escape codes that Node's own `stripVTControlCharacters` takes out. */
const CODES = new RegExp(
  "[\\u001B\\u009B][[\\]()#;?]*" +
    "(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?" +
    "(?:\\u0007|\\u001B\\u005C|\\u009C))" +
    "|(?:(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  "g",
)

interface Option {
  type: "boolean" | "string"
  short?: string
}

/**
 * `parseArgs` of `node:util`, as far as the card uses it: long options, short ones, and a
 * value after a space or "=". An argument that is not an option is an error, as in Node.
 */
export function parseArgs({ args, options }: { args: string[]; options: Record<string, Option> }) {
  const values: Record<string, string | boolean> = {}
  const shorts = new Map(
    Object.entries(options).flatMap(([name, option]) =>
      option.short ? [[option.short, name] as const] : [],
    ),
  )
  for (let at = 0; at < args.length; at++) {
    const arg = args[at]!
    const long = /^--([^=]+)(?:=(.*))?$/.exec(arg)
    const short = /^-([^-])$/.exec(arg)
    const name = long ? long[1]! : short ? shorts.get(short[1]!) : undefined
    const option = name === undefined ? undefined : options[name]
    if (name === undefined || !option) {
      throw new TypeError(
        long || short ? `Unknown option '${arg}'` : `Unexpected argument '${arg}'`,
      )
    }
    if (option.type === "boolean") {
      if (long?.[2] !== undefined) {
        throw new TypeError(`Option '--${name}' does not take an argument`)
      }
      values[name] = true
      continue
    }
    const value = long?.[2] ?? args[++at]
    if (value === undefined) throw new TypeError(`Option '--${name} <value>' argument missing`)
    values[name] = value
  }
  return { values, positionals: [] as string[] }
}

const missing = (name: string) => () => {
  throw new Error(`A browser has no ${name}.`)
}

export const modules: Record<string, object> = {
  util: {
    parseArgs,
    stripVTControlCharacters: (text: string) => text.replace(CODES, ""),
    types: { isNativeError: (value: unknown) => value instanceof Error },
  },
  // The page unpacks the faces before the card draws them (`page.ts`).
  zlib: { inflateSync: missing("inflateSync") },
  // `web/open.ts` opens addresses and copies text. Ink's helpers ask a program for the size
  // of the terminal only when the stream has none.
  child_process: { spawn: missing("programs"), execFileSync: missing("programs") },
  // Ink reads files to show the code around an error.
  fs: { existsSync: () => false, readFileSync: missing("files") },
  path: { relative: (_from: string, to: string) => to },
  url: { fileURLToPath: (url: string | URL) => String(url) },
  os: { release: () => "" },
  module: { builtinModules: [] },
  tty: {},
  assert: {},
  stream: { Stream, PassThrough },
  buffer: { Buffer },
  string_decoder: { StringDecoder },
}
