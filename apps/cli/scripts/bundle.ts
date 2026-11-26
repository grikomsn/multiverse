/**
 * What the two builds share: the one for Node.js (`build.ts`) and the one for a browser
 * (`build-web.ts`).
 */
import { readFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

export const root = fileURLToPath(new URL("..", import.meta.url))

/** The part of Bun's bundler that the builds use. The repository has no types for Bun. */
export interface Resolve {
  path: string
  importer: string
}
export interface Build {
  onResolve(
    match: { filter: RegExp; namespace?: string },
    resolve: (args: Resolve) => { path: string; namespace?: string } | undefined,
  ): void
  onLoad(
    match: { filter: RegExp; namespace?: string },
    load: (args: { path: string }) => { contents: string; loader: string; resolveDir?: string },
  ): void
}
export interface Output {
  path: string
  size: number
  text(): Promise<string>
}
export interface Result {
  success: boolean
  logs: unknown[]
  outputs: Output[]
  metafile?: {
    inputs: Record<string, unknown>
    outputs: Record<
      string,
      {
        inputs: Record<string, { bytesInOutput: number }>
        imports: { path: string; kind: "import-statement" | "dynamic-import" }[]
      }
    >
  }
}
declare global {
  var Bun: { build(options: Record<string, unknown>): Promise<Result> }
}

/**
 * Ink loads React DevTools only when DEV is set, but a bundler moves that import to the top
 * of the file, where it fails: nobody who runs the card has the package.
 */
export const noDevtools = {
  name: "no-devtools",
  setup(build: Build) {
    const empty = () => ({ path: join(root, "scripts/empty.ts") })
    build.onResolve({ filter: /^react-devtools-core$/ }, empty)
    build.onResolve({ filter: /^\.\/devtools\.js$/ }, empty)
  },
}

/**
 * The license of each package in a build. The file holds other people's code, and their
 * licenses ask that the notice travels with it.
 */
export async function notices(result: Result, what: string) {
  const packages = new Set<string>()
  for (const input of Object.keys(result.metafile?.inputs ?? {})) {
    const at = input.lastIndexOf("node_modules/")
    if (at < 0) continue
    const [scope, name] = input.slice(at + "node_modules/".length).split("/")
    packages.add(scope!.startsWith("@") ? `${scope}/${name}` : scope!)
  }
  const texts: string[] = []
  for (const name of [...packages].sort()) {
    const manifest = fileURLToPath(import.meta.resolve(`${name}/package.json`, import.meta.url))
    const { version, license } = JSON.parse(await readFile(manifest, "utf8"))
    let text = ""
    for (const file of ["LICENSE", "license", "LICENSE.md", "license.md", "LICENSE.txt"]) {
      text = await readFile(join(dirname(manifest), file), "utf8").catch(() => "")
      if (text) break
    }
    texts.push(`${name} ${version} (${license})\n\n${text.trim() || `License: ${license}`}`)
  }
  return {
    count: packages.size,
    text: `${what} includes these packages.\n\n${texts.join(`\n\n${"-".repeat(72)}\n\n`)}\n`,
  }
}
