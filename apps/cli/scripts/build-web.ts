/**
 * Builds the page that runs `npx grikomsn` in a browser: grikomsn.github.io/grikomsn.
 *
 * The page is the card's own code with a terminal in front of it (`src/web/page.ts`). This
 * script writes it to `github-readme/docs/`, the folder that GitHub Pages serves from the
 * repository `grikomsn/grikomsn`. Then commit and push in that submodule, and commit the new
 * submodule pointer here. Do not edit the folder by hand.
 *
 *   bun scripts/build-web.ts             today's facts
 *   bun scripts/build-web.ts --fixture   made-up facts, for a test with no network
 *   bun scripts/build-web.ts --readable  names kept, to read an error
 *   bun scripts/build-web.ts --sizes     also lists what takes the most room in the code
 *
 * To look at it: `python3 -m http.server -d github-readme/docs 4324`, from the repository's root.
 */
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises"
import { join } from "node:path"
import { fileURLToPath } from "node:url"
import { gzipSync } from "node:zlib"

import { type Card, getCard } from "@multiverse/content/card"
import { createSanityClient } from "@multiverse/content/client"

import { FIXTURE } from "../src/fixture"
import { plainCard } from "../src/plain"
import { THEMES } from "../src/theme"
import { modules } from "../src/web/node"
import { COLUMNS, COMMAND, CORE, FONT, TYPING } from "../src/web/shell"
import { type Build, noDevtools, notices, root } from "./bundle"

const fixture = process.argv.includes("--fixture")
const repository = join(root, "../..")
const readme = join(repository, "github-readme")
const out = join(readme, "docs")
const web = join(root, "src/web")

if (!(await stat(join(readme, "README.md")).catch(() => undefined))) {
  console.error("github-readme/ is empty. Run `git submodule update --init` first.")
  process.exit(1)
}

/**
 * Node.js for a browser. Each built-in module that the card, Ink or a helper of Ink imports
 * becomes its stand-in from `src/web/node.ts`. Events are the bundler's.
 */
const browser = {
  name: "browser",
  setup(build: Build) {
    const names = ["process", ...Object.keys(modules)].join("|")
    build.onResolve({ filter: new RegExp(`^(node:)?(${names})$`) }, ({ path }) => ({
      path: path.replace("node:", ""),
      namespace: "stand-in",
    }))
    const standIns = JSON.stringify(join(web, "node.ts"))
    build.onLoad({ filter: /.*/, namespace: "stand-in" }, ({ path }) => ({
      loader: "js",
      contents:
        path === "process"
          ? `module.exports = require(${standIns}).process`
          : `module.exports = require(${standIns}).modules[${JSON.stringify(path)}]`,
    }))
    // A browser opens addresses and copies text in its own way.
    build.onResolve({ filter: /^\.\/open$/ }, ({ importer }) =>
      importer.startsWith(join(root, "src")) ? { path: join(web, "open.ts") } : undefined,
    )
    // Ink's color library asks which browser this is. The page's terminal has every color.
    build.onResolve({ filter: /^#supports-color$/ }, () => ({ path: join(web, "colors.ts") }))
  },
}

const card: Card = fixture ? FIXTURE : await getCard(createSanityClient())

await rm(out, { recursive: true, force: true })
const result = await Bun.build({
  entrypoints: [join(web, "page.ts")],
  outdir: out,
  target: "browser",
  format: "esm",
  // The prompt shows before the card's code is there: Ink and React load while it types.
  splitting: true,
  naming: { entry: "[name].[ext]", chunk: "code/[name]-[hash].[ext]" },
  minify: !process.argv.includes("--readable"),
  metafile: true,
  define: {
    __CARD__: JSON.stringify(card),
    "process.env.NODE_ENV": JSON.stringify("production"),
    // Some packages name Node's global object.
    global: "globalThis",
  },
  plugins: [noDevtools, browser],
})
if (!result.success) {
  console.error(result.logs)
  process.exit(1)
}

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

/** The card as text, with its addresses as links: for a browser with no script, and a crawler. */
const plain = escape(plainCard(card))
  .replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}">${url}</a>`)
  .replace(/[^\s<>@]+@[^\s<>@]+\.[a-z]+/g, (mail) => `<a href="mailto:${mail}">${mail}</a>`)

const { light, dark } = THEMES
const site = new URL(card.website).hostname
const description = `${COMMAND} in a browser: the terminal card of ${card.name}, from ${site}.`
// The terminal's own styles, made small: they go in the page, so it needs no second request.
const styles = await Bun.build({
  entrypoints: [fileURLToPath(import.meta.resolve("@wterm/dom/src/terminal.css", import.meta.url))],
  minify: true,
})
const terminalCss = (await styles.outputs[0]!.text()).trim()
/**
 * The code in two halves. The terminal's half is what `page.js` imports with no condition:
 * the page gets it at once. The card's half is the rest, and `page.ts` gets it after the
 * terminal shows its prompt. On a slow network, the prompt then does not wait for the card.
 */
const graph = result.metafile?.outputs ?? {}
const terminalHalf = new Set<string>()
const follow = (path: string) => {
  if (terminalHalf.has(path)) return
  terminalHalf.add(path)
  for (const { path: next, kind } of graph[path]?.imports ?? []) {
    if (kind === "import-statement") follow(next)
  }
}
follow("./page.js")
const cardHalf = Object.keys(graph).filter(
  // The copy of wterm's code that is text has no reader: see the end of this file.
  (path) => !terminalHalf.has(path) && !path.includes("wasm-inline"),
)

// The site's own stack for code (`--font-mono` in `packages/ui/src/styles.css`).
const mono = `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace`

/**
 * The page types the command while its code comes, so a slow network costs the reader no time.
 * `page.ts` takes over at the letter that this script reached. With reduced motion, the
 * command is there at once.
 */
const typing = `{const t=document.getElementById("typed"),c=${JSON.stringify(COMMAND)};if(matchMedia("(prefers-reduced-motion: reduce)").matches)t.textContent=c;else{let i=0;const s=()=>{t.textContent=c.slice(0,++i);if(i<c.length)window.typing=setTimeout(s,${TYPING.letter})};window.typing=setTimeout(s,${TYPING.start})}}`

/**
 * The code starts in the frame after the one that shows the prompt, so the first paint waits
 * for no code. The browser then gets every part of the terminal's half at once, and not one after
 * another. `later` is the card's half, for `page.ts`.
 */
const start = `later=${JSON.stringify(cardHalf)};requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(()=>{const a=(r,h,f)=>{const l=document.createElement("link");l.rel=r;l.href=h;if(f){l.as="fetch";l.type="application/wasm";l.crossOrigin=""}document.head.append(l)};a("preload",${JSON.stringify(CORE)},1);for(const h of ${JSON.stringify([...terminalHalf])})a("modulepreload",h);import("./page.js")})))`

const html = `<!doctype html>
<!-- Written by apps/cli/scripts/build-web.ts in grikomsn/multiverse. Change it there. -->
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${COMMAND}</title>
<meta name="description" content="${escape(description)}">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="${light.bg}">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="${dark.bg}">
<meta property="og:title" content="${COMMAND}">
<meta property="og:description" content="${escape(description)}">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="icon" href="favicon.ico" sizes="32x32">
<style>
${terminalCss}
:root { --ground: ${light.bg}; --ink: ${light.fg}; --soft: ${light.soft}; --accent: ${light.accent}; }
@media (prefers-color-scheme: dark) {
  :root { --ground: ${dark.bg}; --ink: ${dark.fg}; --soft: ${dark.soft}; --accent: ${dark.accent}; }
}
html, body { height: 100%; margin: 0; background: var(--ground); color: var(--ink); }
body { overflow: hidden; }
#first, #plain { box-sizing: border-box; margin: 0; font: 14px/17px ${mono}; }
/* The first line of the terminal, before the terminal is there: the same place, size and colors. */
#first { font-size: clamp(${FONT.min}px, calc(100vw / ${COLUMNS} / 0.62), ${FONT.max}px); line-height: 1.22; }
#first span:first-child { opacity: 0.5; }
#terminal {
  box-sizing: border-box; width: 100vw; height: 100dvh; border-radius: 0; box-shadow: none;
  padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);
  --term-bg: var(--ground); --term-fg: var(--ink); --term-cursor: var(--soft);
  --term-font-family: ${mono};
}
#first { position: fixed; top: env(safe-area-inset-top); left: env(safe-area-inset-left); }
#plain { height: 100dvh; overflow: auto; padding: 16px; white-space: pre-wrap; overflow-wrap: anywhere; }
#plain a { color: inherit; text-decoration-color: var(--accent); text-underline-offset: 3px; }
h1 { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); }
</style>
<noscript><style>#plain { display: block; } #terminal, #first { display: none; }</style></noscript>
</head>
<body>
<main>
<h1>${COMMAND}</h1>
<div id="terminal"></div>
<pre id="first" aria-hidden="true"><span>$</span> <span id="typed"></span></pre>
<script>${typing};${start}</script>
<pre id="plain" hidden>$ ${COMMAND} --plain
${plain}</pre>
</main>
</body>
</html>
`

await mkdir(out, { recursive: true })
await writeFile(join(out, "index.html"), html)
// GitHub Pages runs Jekyll on a folder unless this file is there.
await writeFile(join(out, ".nojekyll"), "")
await copyFile(
  fileURLToPath(import.meta.resolve("@wterm/core/wasm", import.meta.url)),
  join(out, CORE),
)
// The mascot's icons, as `scripts/make-icons.sh` writes them for nibras.co.
for (const icon of ["favicon.svg", "favicon.ico"]) {
  await copyFile(join(repository, "apps/web/public", icon), join(out, icon))
}
const licenses = await notices(result, "This page")
await writeFile(join(out, "THIRD-PARTY-LICENSES.txt"), licenses.text)

if (process.argv.includes("--sizes")) {
  // What takes the room: the bytes of each package in the code, largest first.
  const room = new Map<string, number>()
  for (const output of Object.values(result.metafile?.outputs ?? {})) {
    for (const [input, { bytesInOutput }] of Object.entries(output.inputs)) {
      const at = input.lastIndexOf("node_modules/")
      const [scope, name] = input.slice(at + "node_modules/".length).split("/")
      const from = at < 0 ? input : scope!.startsWith("@") ? `${scope}/${name}` : scope!
      room.set(from, (room.get(from) ?? 0) + bytesInOutput)
    }
  }
  for (const [from, bytes] of [...room].sort((a, b) => b[1] - a[1]).slice(0, 20)) {
    console.log(`${(bytes / 1024).toFixed(0).padStart(5)} KB  ${from}`)
  }
}

// wterm loads the copy of its code that is text only when it gets no file. The page gives it
// the file, so the copy has no reader.
const unused = result.outputs.filter((output) => output.path.includes("wasm-inline"))
for (const output of unused) await rm(output.path)
const files = result.outputs.filter((output) => !unused.includes(output)).map(({ path }) => path)

const sizes = await Promise.all(
  [join(out, "index.html"), join(out, CORE), ...files].map(async (path) => {
    const bytes = await readFile(path)
    return { name: path.slice(out.length + 1), raw: bytes.length, sent: gzipSync(bytes).length }
  }),
)
const kb = (bytes: number) => `${(bytes / 1024).toFixed(0)} KB`
for (const { name, raw, sent } of sizes) console.log(`${name}: ${kb(raw)}, ${kb(sent)} sent`)
console.log(
  `github-readme/docs: ${kb(sizes.reduce((sum, file) => sum + file.sent, 0))} sent, ` +
    `${licenses.count} packages inside` +
    (fixture ? ". Made-up facts: do not publish." : ""),
)
