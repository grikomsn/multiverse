/**
 * The Tailwind 3 compile step, shared by the tailwind-3.x toolchains. Each passes its own
 * `require`, so PostCSS, Tailwind and the plugins come from that toolchain's versions.
 */
const { createToolchain } = require("./shared.cjs")

/**
 * @param {NodeJS.Require} localRequire
 * @param {string[]} plugins the plugin packages this toolchain installs
 * @returns {import("./types").Compile}
 */
module.exports = function tailwind3(localRequire, plugins) {
  const toolchain = createToolchain(localRequire, ["postcss", ...plugins])
  const postcss = localRequire("postcss")
  const tailwindcss = localRequire("tailwindcss")
  const nesting = localRequire("tailwindcss/nesting")

  return async function compile({ css, from, config: file }) {
    const config = toolchain.loadConfig(file)
    const result = await postcss([nesting, tailwindcss(config)]).process(css, { from })
    const content = (Array.isArray(config.content) ? config.content : config.content.files).filter(
      (entry) => typeof entry === "string",
    )
    return { css: result.css, watch: [file], content }
  }
}
