/**
 * Tailwind CSS 1.1.4 on PostCSS 7, with tailwindcss-transitions and purgecss, as v4b and v5
 * built it (postcss.config.js). The originals wrapped the whole stylesheet in
 * `purgecss start ignore`, so they shipped every utility. This build purges for real, with
 * the original extractor and whitelist.
 */
const { createToolchain } = require("../shared.cjs")

const toolchain = createToolchain(require, [
  "postcss",
  "tailwindcss-transitions",
  "@fullhuman/postcss-purgecss",
])
const postcss = require("postcss")
const tailwindcss = require("tailwindcss")
const purgecss = require("@fullhuman/postcss-purgecss")

/** @type {import("../types").Compile} */
module.exports = async function compile({ css, from, config: file }) {
  const config = toolchain.loadConfig(file)
  const { purge, ...tailwindConfig } = config
  const result = await postcss([
    tailwindcss(tailwindConfig),
    purgecss({
      content: purge,
      defaultExtractor: (content) => content.match(/[A-Za-z0-9-_:/]+/g) || [],
      whitelist: ["html", "body"],
    }),
  ]).process(css, { from })
  return { css: result.css, watch: [file], content: purge }
}
