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

| Part on the site      | In the terminal                                                                                                                                                                                                                                                                                    |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero wave             | `src/wave.ts`: `wave()` and `threshold()` from `@multiverse/ui/dither`, drawn in braille. A braille letter is two dots by four, so one row of letters is one row of the 4×4 Bayer pattern. It leans toward the pointer                                                                             |
| Footer band           | The same wave on the last rows of the screen                                                                                                                                                                                                                                                       |
| Mascot                | `src/face.ts`: the pixels of each mood, drawn with half blocks, two pixels a cell. 28 or 20 pixels wide. The header shows a face of five letters when there is no room or too few colors                                                                                                           |
| Mascot moods          | The row under the cursor sets the mood, as a link does under the pointer: cool for Resume, laugh for a call. Space or a click on the face shows the next mood, and five quick ones make it dizzy                                                                                                   |
| Hero entrance         | The words of the headline come one after another, then the marks swipe in. Once                                                                                                                                                                                                                    |
| Row under the pointer | The row under the cursor has the amber tint, and an arrow: → for nibras.co, ↗ for other sites                                                                                                                                                                                                      |
| Command bar           | `/` or Ctrl K. The ranking is `rankRows()` from `@multiverse/ui/command-index`. The mascot thinks, is sad when nothing matches, and winks on Enter                                                                                                                                                 |
| Theme                 | The card starts in the theme of the terminal: it asks for the ground color (OSC 11). `t` changes it; the mascot puts on sunglasses for dark                                                                                                                                                        |
| Apps and things       | The first list of the Home page. A row has the name of the project, a light for its status and its short line. The light is a ring before people can get it, green when they can, and grey when it is archived. With no color, the grey light is a smaller dot. Plain text has the status in words |
| A long line           | A row is one line when it fits. If not, the rest of its detail goes on at the next lines, a little to the right. No word is cut, and no word stands alone on the last line. The search results stay one line each                                                                                  |
| City time             | A line under the intro, with a sun or a moon. From midnight to 05:00 the mascot sleeps                                                                                                                                                                                                             |

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

## In a browser

Decided on 2026-11-26, after a comparison of terminals for the web.

[grikomsn.github.io/grikomsn](https://grikomsn.github.io/grikomsn/) runs the card in a page. A terminal fills the window, a prompt types `npx grikomsn`, and the card starts. The page runs the card's own code, built for a browser. It does not download the package from npm.

| Terminal                  | Why, or why not                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| wterm 0.5.10 (the choice) | About 70 KB sent. Its text is real text in the page. It answers the color question and reports the pointer           |
| xterm.js 6.0              | The safe choice, at twice the size. Its text renderer leaves lines between half blocks. Use it if wterm fails        |
| ghostty-web 0.4           | Its stable release is a year old and reports no pointer                                                              |
| libghostty-vt 1.0         | The state of a terminal, with no renderer. wterm can use it as its core (`@wterm/ghostty`), for 580 KB more          |
| restty 0.3                | libghostty with WebGPU. About 800 KB sent                                                                            |
| WebContainers, BrowserPod | A real Node.js, so a real `npx`. They need cross-origin isolation, megabytes of runtime, and they have license terms |

How it works:

- `src/main.tsx` is the card as a program. It has two hosts: Node.js (`src/cli.tsx`) and the page (`src/web/page.ts`). It reads and writes through `process`, and the page gives it the terminal as its streams.
- `src/web/node.ts` stands in for Node.js: `process`, and the built-in modules that Ink and its helpers import. `src/web/streams.ts` has small streams and buffers. The bundler's complete ones took a third of the page's code.
- The build gives `src/web/open.ts` in place of `src/open.ts`: a new tab, and the browser's clipboard.
- Ink's color library gives colors only to Chromium. The build gives it `src/web/colors.ts`: all the colors, in every browser.
- A browser has no `inflateSync`. The page unpacks the mascot's pixels with a stream before the card draws.
- wterm answers the color question (OSC 11) from the page's CSS, so the card starts in the theme of the system. The screen tells the terminal the card's ground (`setGround`), and the page paints the space around the cells with it.
- The prompt is a shell with one command (`src/web/shell.ts`). It takes the card's options: `npx grikomsn --theme light`. Enter on an empty line runs the card again.
- The letters are 14 px, and smaller in a narrow window, down to 11 px. A window of 320 px then has 46 columns. A smaller window gets plain text, as a small terminal does.
- On a phone, the terminal's text field asks for no keyboard: the keyboard would cover the card after each tap. So a phone cannot type in the search bar.
- `index.html` holds the prompt and types the command while the code comes. It also holds the plain card, for a browser with no script and for a crawler.
- The code comes in two halves, each after a paint. The terminal's half comes after the first paint. The card's half (React, Ink, Yoga) comes after the terminal shows its prompt. On a slow network, the prompt does not wait for the card.
- wterm's own code (WebAssembly) is a file next to the page, so the browser compiles it while it comes.
- The page reads `/card.json`, so `apps/web` sends that file with `Access-Control-Allow-Origin: *`.
- Its social card is `og.png`: the site's card in the dark theme, with the mascot as the terminal draws it. See [social-cards.md](../social-cards.md).

Build and release:

```bash
bun apps/cli/scripts/build-web.ts                  # writes github-readme/docs/ with today's facts
bun apps/cli/scripts/build-web.ts --sizes          # also lists what takes the most room
python3 -m http.server -d github-readme/docs 4324  # look at it: http://localhost:4324
```

Commit and push in `github-readme`, then commit the new pointer here. GitHub Pages serves the folder: Settings, Pages, "Deploy from a branch", `main` and `/docs`. Build again when the card's code changes. New facts need no build.

Measured on 2026-11-26, on this machine:

| What               | Result                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Size               | 257 KB sent: 85 KB for the terminal's half, 172 KB for the card's half                                       |
| Browsers           | Chromium and WebKit, with Playwright, at 1280, 393 and 320 px. Not Firefox, and not a real phone             |
| Lighthouse, mobile | Performance 99, accessibility 100, SEO 100, best practices 96                                                |
| On a slow phone    | The prompt shows after 1.5 to 1.8 seconds, and the card about a second later (Lighthouse's network and chip) |
| The wave           | 7% to 9% of a processor in headless Chromium. A terminal takes less than 1%                                  |

Three changes took the performance score from 89 to 99:

| Change                                                    | What it did                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| The code starts after the first paint                     | The first paint went from 2.9 to 0.6 seconds                |
| Small streams and buffers, and wterm's code as a file     | 300 KB became 257 KB                                        |
| The card's half comes after the terminal shows its prompt | The largest paint (the prompt) went from 3.0 to 1.5 seconds |

The score counts the prompt as the largest paint, not the card. The card shows as soon as before, and not sooner.

Open points:

- Best practices loses its points to one error: `/card.json` without the header. A deploy of `apps/web` fixes it.
- The wave costs more than in a terminal, because each frame changes the page's text.
- The largest parts of the card's half are React's reconciler and Yoga. Ink needs both.

## The mascot's pixels

`scripts/make-faces.ts` draws every mood of `packages/ui/src/gri.ts` at 28 and 20 pixels and writes `src/faces.gen.ts` (25 KB). `./scripts/make-icons.sh` runs it, so run that script after the drawing changes and commit the file. The picture is cropped closer to the head than the drawing's own frame, because 20 pixels cannot spare the space.

## Build

`bun build` makes one ESM file. `scripts/bundle.ts` holds what this build shares with the one for a browser. Three things are not obvious:

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

The name `grikomsn` on npm is free: the package from 2020 was unpublished. Its versions (1.0.0, 1.0.1 and 1.1.0) stay taken, so the card started at 2.0.0.

[Changesets](https://changesets.dev) keeps the version and `apps/cli/CHANGELOG.md`. GitHub Actions sends each version to npm, with provenance: npm shows the commit and the workflow that built it. The version is staged: it waits on npmjs.com until a maintainer approves it. No token publishes, and no version goes out without that approval.

1. With a change to the card, add a changeset: `bunx changeset`. It asks how large the change is (patch, minor or major) and for one line for the changelog. It writes a file in `.changeset/`. Commit the file with the change.
2. To release, run `bunx changeset version`. It sets the new `"version"` in `apps/cli/package.json`, writes the changelog and deletes the changesets. Commit and push to `main`.
3. `.github/workflows/publish.yml` stages the version. It runs when `.changeset/` or the card's `package.json` changes on `main`, and by hand.
4. Approve the version: on npmjs.com, in Staged Packages, or with `npm stage approve <stage-id>`. npm asks for two-factor authentication. Then `npx grikomsn` gets the new version.

| The state of `main`                         | What the workflow does                                                                       |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| It has changesets                           | Nothing. They wait for step 2                                                                |
| No changeset, and the version is not on npm | Checks and builds the card, packs it, stages it on npm, and makes a tag and a GitHub release |
| The version has its tag                     | Nothing. The version waits for approval on npm                                               |
| No changeset, and the version is on npm     | Nothing                                                                                      |

The four jobs have different rights. The first two can only read the repository. Only the third can talk to npm as the publisher. It installs nothing and runs no script of a package: it sends the file that the job before it packed. Only the last can write to the repository, for the tag and the release.

- **No `changesets/action`.** The repository allows only the actions of GitHub and setup-bun. The jobs call the Changesets commands `publish-plan` and `pack`, and then `npm stage publish`.
- **No pull request.** The usual Changesets workflow opens a "Version Packages" pull request. This repository commits to `main`, so step 2 is by hand.
- **The manifest in the package has no `devDependencies`.** Changesets packs with npm, and npm cannot read the `workspace:` and `catalog:` versions of Bun. The card is one file with every package inside, so the workflow removes the field before it packs.
- **npm trusts the workflow by its name.** The package's settings on npmjs.com have a trusted publisher: GitHub Actions, `grikomsn/multiverse`, `publish.yml`, no environment. If the file gets a new name, change it there too.
- **The trusted publisher can stage, and not publish.** That is npm's default for a new one. `npm publish` from the workflow gets "OIDC permission denied for this action".
- **To send a version again** after a rejection, delete its tag and its GitHub release, and start the workflow by hand.
- **The first version from the workflow is 2.1.0.** Version 2.0.0 came from a laptop.
