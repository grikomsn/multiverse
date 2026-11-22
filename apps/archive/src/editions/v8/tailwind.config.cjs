/**
 * v8b's sites/griko.id/tailwind.config.js, for Tailwind 3.0.23. Changes: `content` points at
 * this edition, and the mono stack starts with JetBrains Mono (the first v8 cut's font)
 * because Berkeley Mono is a paid font.
 */
const { join } = require("node:path")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")
const plugin = require("tailwindcss/plugin")

const src = join(__dirname, "../..")

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
module.exports = {
  content: [`${src}/editions/v8/*.{astro,ts}`, `${src}/pages/v8/**/*.astro`],

  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".safari-transform-fix": {
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          MozBackfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          MozTransform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        },
      })
    }),
  ],

  theme: {
    extend: {
      colors: {
        body: colors.neutral[900],
        primary: colors.sky[500],
        text: colors.neutral[200],
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
        sans: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
      typography: {
        DEFAULT: {
          css: {
            "blockquote[data-reference]": {
              fontStyle: "normal",
            },
            "blockquote[data-reference] p:first-of-type::before": {
              content: "none",
            },
            "blockquote[data-reference] p:last-of-type::after": {
              content: "none",
            },
          },
        },
      },
    },
  },
}
