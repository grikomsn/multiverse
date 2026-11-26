/**
 * The card as a program: it reads its options, then prints text or opens the live screen.
 *
 * In a terminal it is a live screen (`app.tsx`). In a pipe, a script, a build log or a small
 * terminal it is plain text, so an AI agent that runs the command gets the facts too.
 *
 * Two hosts run it: Node.js (`cli.tsx`) and a page with a terminal in it (`web/page.ts`). It
 * reads and writes through `process`, which the page supplies.
 */
import { parseArgs } from "node:util"

import pkg from "../package.json" with { type: "json" }
import { builtCard, liveCard } from "./load"
import { plainCard } from "./plain"
import {
  colorDepth,
  detectDark,
  hasBraille,
  isInteractive,
  reducedMotion,
  waveFps,
} from "./terminal"

const HELP = `${pkg.name} ${pkg.version}
${pkg.description}

Usage
  npx ${pkg.name} [options]

Options
  --plain        Print the card as text. This is the default in a pipe.
  --json         Print the card's facts as JSON.
  --theme <name> Start in the "light" or the "dark" theme. The default is the terminal's.
  --no-motion    Show still pictures. NO_MOTION=1 does the same.
  --no-mouse     Do not read the mouse. The m key turns it on and off.
  --offline      Do not read today's facts from nibras.co. Use the copy in the package.
  -v, --version  Print the version.
  -h, --help     Print this text.

Keys and mouse
  ↑ ↓      Move the cursor            ⏎      Open the row in the browser
  ← →      Change the page            c      Copy the row's address
  /        Search                     t      Change the theme
  space    Press the face             q esc  Quit
  m        Turn the mouse off, to select text. Shift and a drag also selects.
  A click opens a row or a page, the wheel moves a list, and the face likes a click.
`

function options(args: string[]) {
  try {
    return parseArgs({
      args,
      options: {
        plain: { type: "boolean" },
        json: { type: "boolean" },
        theme: { type: "string" },
        "no-motion": { type: "boolean" },
        "no-mouse": { type: "boolean" },
        offline: { type: "boolean" },
        version: { type: "boolean", short: "v" },
        help: { type: "boolean", short: "h" },
      },
    }).values
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n\n${HELP}`)
    return undefined
  }
}

/** Runs the card with these arguments. Returns the exit code: 0, 1 for no facts, 2 for misuse. */
export async function main(args: string[]): Promise<number> {
  const flags = options(args)
  if (!flags) return 2
  if (flags.help) {
    process.stdout.write(HELP)
    return 0
  }
  if (flags.version) {
    process.stdout.write(`${pkg.version}\n`)
    return 0
  }
  if (flags.theme !== undefined && flags.theme !== "light" && flags.theme !== "dark") {
    process.stderr.write(`--theme takes "light" or "dark", not "${flags.theme}".\n`)
    return 2
  }

  const built = builtCard()
  const live = flags.plain || flags.json || !isInteractive() || !built
  // Text has one chance to be right, so it waits for today's facts. The live screen does not:
  // it shows the copy and takes today's facts when they come.
  const card = (live && !flags.offline ? await liveCard(built ? 2000 : 8000) : undefined) ?? built
  if (!card) {
    process.stderr.write("The card has no facts: nibras.co did not answer. Try again later.\n")
    return 1
  }

  if (flags.json) {
    process.stdout.write(JSON.stringify(card, null, 2) + "\n")
    return 0
  }
  if (flags.plain || !isInteractive()) {
    process.stdout.write(plainCard(card, { color: colorDepth() > 0 }))
    return 0
  }

  const depth = colorDepth()
  // Ink's color library does not know NO_COLOR. Node does, so tell the library before it loads.
  if (depth === 0) process.env.FORCE_COLOR = "0"
  // Ask the terminal for its ground while the code of the live screen loads.
  const [dark, { render }, { App }, { Screen }, { tapInput }] = await Promise.all([
    flags.theme ? flags.theme === "dark" : detectDark().then((answer) => answer ?? true),
    import("ink"),
    import("./app"),
    import("./screen"),
    import("./pointer"),
  ])
  const motion = !flags["no-motion"] && !reducedMotion()
  const screen = new Screen({ terminal: process.stdout, depth, fps: waveFps(), motion })
  const input = tapInput(process.stdin, () => screen.touch())
  input.subscribe((event) => {
    if (event.kind === "focus") screen.focus(event.on)
  })
  screen.start({ pointer: !flags["no-mouse"] })
  // An error that nothing caught: give the terminal back first, so the error is readable and
  // the shell is not left on the second screen with the mouse on.
  const onError = (error: unknown) => {
    input.close()
    screen.close()
    console.error(error)
    process.exit(1)
  }
  // A closed window or a kill: give the terminal back first.
  const onSignal = () => {
    screen.close()
    process.exit(1)
  }
  const signals = ["SIGTERM", "SIGHUP"] as const
  process.once("uncaughtException", onError)
  for (const signal of signals) process.once(signal, onSignal)
  try {
    // Ink gives each frame to the screen as text ("debug"), and the screen writes what changed.
    const app = render(
      <App
        card={card}
        dark={dark}
        depth={depth}
        motion={motion}
        braille={hasBraille()}
        offline={flags.offline === true}
        pointer={!flags["no-mouse"]}
        stage={screen}
        input={input}
      />,
      {
        stdout: screen as unknown as NodeJS.WriteStream,
        stdin: input.stream,
        debug: true,
        patchConsole: false,
        kittyKeyboard: { mode: "disabled" },
      },
    )
    await app.waitUntilExit()
  } finally {
    input.close()
    screen.close()
    // A page runs the card many times: leave nothing that listens.
    process.off("uncaughtException", onError)
    for (const signal of signals) process.off(signal, onSignal)
  }
  // The live screen leaves nothing behind, so the links stay as text.
  process.stdout.write(plainCard(card, { color: depth > 0, short: true }))
  return 0
}
