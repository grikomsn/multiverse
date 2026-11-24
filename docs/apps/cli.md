# `npx grikomsn` (`apps/cli`)

The card: the home page of nibras.co in a terminal. The npm package is `grikomsn`. Its one file, `dist/cli.js`, holds Ink, React and the card's facts, so `npx grikomsn` downloads about 180 KB and installs nothing else. It needs Node.js 22 or later.

Decided on 2026-11-24, after a comparison of Ink and OpenTUI.

| Question     | Ink 8                                | OpenTUI 0.9                                                         |
| ------------ | ------------------------------------ | ------------------------------------------------------------------- |
| Runtime      | Node.js 22 or later                  | Bun, or Node.js 26.4 with the `--experimental-ffi` flag             |
| Install      | JavaScript only: it goes in one file | A native library for each platform, about 10 MB when compiled       |
| Animation    | One shared timer, 30 frames a second | A timeline with easing and loops                                    |
| Release pace | Steady: 7.0 in April, 8.0 in October | From 0.5 in September to 0.9 in November; two releases on some days |

The runtime decided it. A person who types `npx grikomsn` has Node.js, with no flags. OpenTUI draws faster. Ink was too slow for the wave, so the wave is drawn outside Ink (see [Speed](#speed)), and the idle card now takes less than 1% of a processor.

## What it shows

| Where                 | What                                                                                                       |
| --------------------- | ---------------------------------------------------------------------------------------------------------- |
| A terminal            | The live screen (`src/app.tsx`): four pages, a search bar and the mascot, for keys and for the pointer     |
| A pipe, a script, CI  | Plain text (`src/plain.ts`): the name, the links, the roles, projects and posts                            |
| A small terminal      | Plain text too: less than 44 columns or 16 rows. A live screen made smaller shows a note to make it larger |
| After the live screen | The name and the links, as text. The live screen leaves nothing in the scrollback                          |
| `--json`              | The facts as JSON                                                                                          |

An AI agent that runs the command gets the plain text, which ends with the addresses of `/llms.txt` and `/mcp`.

## Facts

The card stores no fact in this repository. `getCard()` in `packages/content/src/card.ts` reads Sanity and gives a `Card`: facts only, with full addresses.

- nibras.co serves today's card at `/card.json` (`apps/web/src/pages/card.json.ts`).
- `scripts/build.ts` puts a copy in `dist/cli.js`. The card shows the copy at once, and works with no network.
- A running card reads `/card.json` and shows it when it comes. `--offline` stops that. The request sends nothing about the reader.
- So a new role or post needs no new release. Release again when the code changes.

`Card` has a `version`. A published card ignores a file with a different number and keeps its copy. Add optional fields freely. Raise the number only when a field changes its meaning.

The sentences are in `src/content.ts`, in the words of the home page: the card is one more design on today's content, like an older version in the archive.

## Design

The same parts as the home page, in the same order. The colors are the site's tokens (`src/theme.ts`). The card paints its own ground, so each theme looks the same in every terminal.

| Part on the site      | In the terminal                                                                                                                                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero wave             | `src/wave.ts`: `wave()` and `threshold()` from `@multiverse/ui/dither`, drawn in braille. A braille letter is two dots by four, so one row of letters is one row of the 4×4 Bayer pattern. It leans toward the pointer |
| Footer band           | The same wave on the last rows of the screen                                                                                                                                                                           |
| Mascot                | `src/face.ts`: the pixels of each mood, drawn with half blocks, two pixels a cell. 28 or 20 pixels wide. The header shows a face of five letters when there is no room or too few colors                               |
| Mascot moods          | The row under the cursor sets the mood, as a link does under the pointer: cool for Resume, laugh for a call. Space or a click on the face shows the next mood, and five quick ones make it dizzy                       |
| Hero entrance         | The words of the headline come one after another, then the marks swipe in. Once                                                                                                                                        |
| Row under the pointer | The row under the cursor has the amber tint, and an arrow: → for nibras.co, ↗ for other sites                                                                                                                          |
| Command bar           | `/` or Ctrl K. The ranking is `rankRows()` from `@multiverse/ui/command-index`. The mascot thinks, is sad when nothing matches, and winks on Enter                                                                     |
| Theme                 | The card starts in the theme of the terminal: it asks for the ground color (OSC 11). `t` changes it; the mascot puts on sunglasses for dark                                                                            |
| City time             | A line under the intro, with a sun or a moon. From midnight to 05:00 the mascot sleeps                                                                                                                                 |

Motion follows [the rules of the site](../redesign.md#motion-and-dither). The entrance and each move play once. Only the wave keeps moving, at 12 frames a second, and at 6 over SSH. It stops when the window loses the focus. `--no-motion`, `NO_MOTION=1` or `REDUCE_MOTION=1` gives still pictures: a terminal has no setting for reduced motion, so the card reads the names that other tools use. `NO_COLOR` gives a card with no color.

The circle of the theme change is left out: a terminal cannot clip a page to a shape.

## The pointer

Decided on 2026-11-24. The first version read no pointer, because a terminal that reports the mouse does not let the reader select text with a plain drag. Now the card reads it, and `m` or `--no-mouse` turns the reports off. Shift and a drag also selects.

| What the pointer does | What happens                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| Moves over a row      | The cursor goes to that row, as `:hover` on the site. The list does not move under the pointer         |
| Clicks a row          | Opens it. A click counts when the button goes down and comes up on the same thing                      |
| Clicks a page name    | Opens that page of the card                                                                            |
| Turns the wheel       | Moves the list by two lines. A click on "↑ more" or "↓ more" moves it by a screen                      |
| Is over the face      | The face winks. A click is a press: the next mood, and dizzy after five quick ones                     |
| Is over a marked word | The mood of the word, as on the home page: think, wow, love                                            |
| Is over the hero      | The head leans one pixel toward the pointer, and the wave leans by 12% of its size (the site's number) |
| Clicks a key hint     | Does what the key does: "t theme", "/ search", "q quit"                                                |

How it works:

- A terminal sends mouse reports as text on the keyboard's stream (SGR mode 1006), and Ink 8 drops them. `src/pointer.ts` reads the stream first, takes the reports out, and gives Ink the rest.
- Nothing stores where things are. The card asks Ink for the place of a box (`measureElement`) when a report comes.
- The terminal also reports the focus of its window (mode 1004). The click that gives the window its focus is not a click on the card: a press in the first 250 ms is ignored.
- On exit, on Ctrl C and on SIGTERM the card turns the reports off. A terminal left in mouse mode prints codes at every click.

## Speed

Measured on 2026-11-24 with Node.js 26 in tmux, on a made-up card (`--fixture`): the processor time of the idle card over 8 seconds, and the bytes it wrote.

| Screen   | Processor, before | After | Output, before | After    |
| -------- | ----------------- | ----- | -------------- | -------- |
| 80 × 24  | 8.2% of one core  | 0.3%  | 11.6 KB/s      | 1.6 KB/s |
| 120 × 40 | 13.1%             | 0.6%  | 33.2 KB/s      | 3.2 KB/s |
| 200 × 60 | 13.7%             | 0.7%  | 45.7 KB/s      | 5.4 KB/s |

The first frame shows about 200 ms after the command starts, before and after.

What made the difference: the wave is not in Ink (`src/screen.ts`).

- Before, the wave was React state. Each of its 12 frames a second made Ink draw the whole screen again, and a profile showed that nine tenths of that time went to reading the color codes of every line, the mascot's most of all. The wave's own arithmetic was 2% of it.
- Now Ink draws only when the card changes. Ink runs with `debug: true`, which makes it write each frame as plain text to the stream it is given. That stream is the screen. It writes the lines that changed, and it knows which cells are empty.
- The screen draws the wave itself, straight to the terminal, and writes only the dots that changed. A dot goes only into an empty cell on the page's ground, two cells or more from a letter, so the wave stays behind the text.
- The wave stops while the terminal's window has no focus, and after two minutes with no key and no pointer. The site's wave also stops when it is off the screen.

What was tried and left out:

- Node's compile cache (`NODE_COMPILE_CACHE`): no change in the time to the first frame.
- The start is spread thin: a profile shows no step above 21 ms. The question about the ground color now runs while the code loads.

Not done: memory. The card holds 120 to 140 MB, of which Node.js, React and Ink are about 95.

## The mascot's pixels

`scripts/make-faces.ts` draws every mood of `packages/ui/src/gri.ts` at 28 and 20 pixels and writes `src/faces.gen.ts` (25 KB). `./scripts/make-icons.sh` runs it, so run that script after the drawing changes and commit the file. The picture is cropped closer to the head than the drawing's own frame, because 20 pixels cannot spare the space.

## Build

`bun build` makes one ESM file. Three things are not obvious:

- Ink imports React DevTools only when `DEV` is set, but a bundler moves that import to the top of the file, where it fails. The build replaces it with an empty module (`scripts/empty.ts`).
- Every dependency is a `devDependency`. The file holds them all, so `npx` installs none.
- `dist/THIRD-PARTY-LICENSES.txt` has the license of each package in the file. The build copies the repository's `LICENSE` next to `package.json` (git ignores the copy), as npm puts only the package's own folder in the package.

## Commands

```bash
bun apps/cli/scripts/dev.ts             # the card from the source, with today's facts from Sanity
bun apps/cli/scripts/dev.ts --plain     # the plain text
bun run --filter grikomsn build         # dist/cli.js with today's facts
bun apps/cli/scripts/build.ts --fixture # dist/cli.js with made-up facts: a test with no network
bun apps/cli/scripts/build.ts --readable # names kept, for `node --cpu-prof apps/cli/dist/cli.js`
node apps/cli/dist/cli.js               # the built card
```

Run the card itself, not through `bun run --filter` or Turbo: they give it a pipe, and a card in a pipe is plain text.

## Release

The name `grikomsn` on npm is free: the package from 2020 was unpublished. Its versions (1.0.0, 1.0.1 and 1.1.0) stay taken, so the card starts at 2.0.0. Publish by hand, from `apps/cli`:

```bash
cd apps/cli
# 1. Set the new "version" in package.json.
bunx npm login     # once
bun publish        # builds first (prepublishOnly), then sends five files: package.json, README.md, LICENSE and dist/
```

Deploy `apps/web` before the first release, so `/card.json` is there.
