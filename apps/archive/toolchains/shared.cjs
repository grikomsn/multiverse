/**
 * Shared by the toolchain packages. Each package (tailwind-1.1, tailwind-3.2, …) installs one
 * edition's original PostCSS, Tailwind and plugin versions, and compiles that edition's
 * stylesheet with them.
 *
 * The workspace hoists the site's Tailwind 4 to the root. An edition's `tailwind.config.cjs`,
 * and any plugin hoisted beside Tailwind 4, would then load Tailwind 4's `colors`,
 * `defaultTheme` and `plugin`. So inside an edition folder and inside the toolchain's own
 * plugins, `tailwindcss`, `@tailwindcss/*` and the listed packages resolve to the toolchain's
 * copies.
 */
const Module = require("node:module")
const path = require("node:path")

/**
 * @param {NodeJS.Require} localRequire the toolchain package's `require`
 * @param {string[]} packages packages to pin besides `tailwindcss`
 */
function createToolchain(localRequire, packages) {
  const pinned = (request) =>
    request === "tailwindcss" ||
    request.startsWith("tailwindcss/") ||
    request.startsWith("@tailwindcss/") ||
    packages.some((name) => request === name || request.startsWith(`${name}/`))

  /** Folders whose files get the pinned packages: the plugins, plus each edition folder. */
  const owners = new Set(
    packages
      .filter((name) => !name.startsWith("postcss"))
      .map((name) => path.dirname(localRequire.resolve(`${name}/package.json`)) + path.sep),
  )

  const resolve = Module._resolveFilename
  Module._resolveFilename = function (request, parent, ...rest) {
    const from = parent?.filename
    if (from && pinned(request) && [...owners].some((dir) => from.startsWith(dir))) {
      return localRequire.resolve(request)
    }
    return resolve.call(this, request, parent, ...rest)
  }

  /** Loads an edition's config fresh, so dev picks up edits. */
  function loadConfig(file) {
    owners.add(path.dirname(file) + path.sep)
    for (const id of Object.keys(require.cache)) {
      if (id.startsWith(path.dirname(file) + path.sep)) delete require.cache[id]
    }
    return localRequire(file)
  }

  return { loadConfig, require: localRequire }
}

module.exports = { createToolchain }
