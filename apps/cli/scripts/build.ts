/**
 * Builds `dist/cli.js`: one file with Ink, React and the card's facts inside, so `npx grikomsn`
 * downloads one small package and installs nothing else.
 *
 * The facts are today's, from Sanity. A running card replaces them with the site's copy
 * (nibras.co/card.json), so the package needs a new release only when its code changes.
 *
 *   bun scripts/build.ts             today's facts
 *   bun scripts/build.ts --fixture   made-up facts, for a test with no network
 *   bun scripts/build.ts --readable  names kept, for a profile: `node --cpu-prof dist/cli.js`
 */
import { chmod, copyFile, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

import { getCard } from "@multiverse/content/card"
import { createSanityClient } from "@multiverse/content/client"

import { FIXTURE } from "../src/fixture"

/** The part of Bun's bundler that this file uses. The repository has no types for Bun. */
declare const Bun: {
  build(options: Record<string, unknown>): Promise<{
    success: boolean
    logs: unknown[]
    metafile?: { inputs: Record<string, unknown> }
  }>
}

// `--fixture` puts made-up facts in the file: a build to test, with no network. Never publish it.
const fixture = process.argv.includes("--fixture")

const root = fileURLToPath(new URL("..", import.meta.url))
const out = join(root, "dist")
await rm(out, { recursive: true, force: true })

const result = await Bun.build({
  entrypoints: [join(root, "src/cli.tsx")],
  outdir: out,
  target: "node",
  format: "esm",
  minify: !process.argv.includes("--readable"),
  metafile: true,
  banner: "#!/usr/bin/env node",
  define: {
    __CARD__: JSON.stringify(fixture ? FIXTURE : await getCard(createSanityClient())),
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  plugins: [
    {
      // Ink loads React DevTools only when DEV is set, but a bundler moves that import to the
      // top of the file, where it fails: nobody who runs the card has the package.
      name: "no-devtools",
      setup(build: {
        onResolve(match: { filter: RegExp }, resolve: () => { path: string }): void
      }) {
        const empty = () => ({ path: join(root, "scripts/empty.ts") })
        build.onResolve({ filter: /^react-devtools-core$/ }, empty)
        build.onResolve({ filter: /^\.\/devtools\.js$/ }, empty)
      },
    },
  ],
})
if (!result.success) {
  console.error(result.logs)
  process.exit(1)
}
await chmod(join(out, "cli.js"), 0o755)

// The file holds other people's code. Their licenses ask that the notice travels with it.
const packages = new Set<string>()
for (const input of Object.keys(result.metafile?.inputs ?? {})) {
  const at = input.lastIndexOf("node_modules/")
  if (at < 0) continue
  const [scope, name] = input.slice(at + "node_modules/".length).split("/")
  packages.add(scope!.startsWith("@") ? `${scope}/${name}` : scope!)
}
const notices: string[] = []
for (const name of [...packages].sort()) {
  const manifest = fileURLToPath(import.meta.resolve(`${name}/package.json`, import.meta.url))
  const { version, license } = JSON.parse(await readFile(manifest, "utf8"))
  let text = ""
  for (const file of ["LICENSE", "license", "LICENSE.md", "license.md", "LICENSE.txt"]) {
    text = await readFile(join(dirname(manifest), file), "utf8").catch(() => "")
    if (text) break
  }
  notices.push(`${name} ${version} (${license})\n\n${text.trim() || `License: ${license}`}`)
}
await writeFile(
  join(out, "THIRD-PARTY-LICENSES.txt"),
  `dist/cli.js includes these packages.\n\n${notices.join(`\n\n${"-".repeat(72)}\n\n`)}\n`,
)

// npm puts the package's own LICENSE in the package, and only that. Copy the repository's.
await copyFile(join(root, "../../LICENSE"), join(root, "LICENSE"))

const size = (await readFile(join(out, "cli.js"))).length
console.log(
  `dist/cli.js: ${(size / 1024).toFixed(0)} KB, ${packages.size} packages inside` +
    (fixture ? ". Made-up facts: do not publish." : ""),
)
