/**
 * 2023c's tailwind.config, reconstructed for Tailwind 3.4.3 from the site's June 2024 build
 * (site.css, which shares the markup): shadcn's centered container, Figtree, amber as
 * `primary`, the `prose-primary` typography theme, and class-based dark mode.
 */
const { join } = require("node:path")
const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

const src = join(__dirname, "../..")

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [`${src}/editions/2023c/*.{astro,ts}`, `${src}/pages/2023c/**/*.astro`],
  darkMode: "class",
  plugins: [require("@tailwindcss/typography")],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        primary: colors.amber,
      },
      fontFamily: {
        sans: ['"Figtree Variable"', "Figtree", ...defaultTheme.fontFamily.sans],
      },
      typography: {
        primary: {
          css: {
            "--tw-prose-links": colors.amber[600],
            "--tw-prose-invert-links": colors.amber[500],
          },
        },
      },
    },
  },
}
