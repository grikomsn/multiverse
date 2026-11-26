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
import { join } from "node:path"

import { getCard } from "@multiverse/content/card"
import { createSanityClient } from "@multiverse/content/client"

import { FIXTURE } from "../src/fixture"
import { noDevtools, notices, root } from "./bundle"

// `--fixture` puts made-up facts in the file: a build to test, with no network. Never publish it.
const fixture = process.argv.includes("--fixture")

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
  plugins: [noDevtools],
})
if (!result.success) {
  console.error(result.logs)
  process.exit(1)
}
await chmod(join(out, "cli.js"), 0o755)

const licenses = await notices(result, "dist/cli.js")
await writeFile(join(out, "THIRD-PARTY-LICENSES.txt"), licenses.text)

// npm puts the package's own LICENSE in the package, and only that. Copy the repository's.
await copyFile(join(root, "../../LICENSE"), join(root, "LICENSE"))

const size = (await readFile(join(out, "cli.js"))).length
console.log(
  `dist/cli.js: ${(size / 1024).toFixed(0)} KB, ${licenses.count} packages inside` +
    (fixture ? ". Made-up facts: do not publish." : ""),
)
