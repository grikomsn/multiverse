import type { AstroIntegration } from "astro"
import { globSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import type { Plugin } from "vite"

import type { Compile } from "./types"

/**
 * `@toolchain "tailwind-1.1";` (optionally followed by a config path, default
 * `./tailwind.config.cjs`) on its own line in an edition stylesheet.
 */
const DIRECTIVE = /^@toolchain\s+"([\w.-]+)"(?:\s+"([^"]+)")?\s*;[^\S\n]*\n?/m

/**
 * Compiles edition stylesheets with the CSS framework version the edition originally shipped
 * (`toolchains/<name>`), before Vite's own CSS pipeline sees them. Stylesheets without the
 * directive are left alone.
 */
export function toolchains(): AstroIntegration {
  return {
    name: "archive:toolchains",
    hooks: {
      "astro:config:setup": ({ config, updateConfig }) => {
        const require = createRequire(new URL("package.json", config.root))
        updateConfig({ vite: { plugins: [plugin(require)] } })
      },
    },
  }
}

function plugin(require: NodeJS.Require): Plugin {
  return {
    name: "archive:toolchains",
    enforce: "pre",
    async load(id) {
      const [file = "", query = ""] = id.split("?")
      if (!file.endsWith(".css") || /\b(raw|url)\b/.test(query)) return
      const source = await readFile(file, "utf8").catch(() => undefined)
      const match = source?.match(DIRECTIVE)
      if (!source || !match) return

      const compile = require(`@archive/${match[1]}`) as Compile
      const result = await compile({
        css: source.replace(DIRECTIVE, ""),
        from: file,
        config: resolve(dirname(file), match[2] ?? "tailwind.config.cjs"),
      })
      for (const watched of [
        ...result.watch,
        ...result.content.flatMap((glob) => globSync(glob)),
      ]) {
        this.addWatchFile(watched)
      }
      return result.css
    },
  }
}
