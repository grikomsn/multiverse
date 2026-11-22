/**
 * v4b and v5's tailwind.config.js (identical in both), for Tailwind 1.1.4. `purge` is read by
 * the tailwind-1.1 toolchain: the originals passed these globs to purgecss in
 * postcss.config.js.
 */
const { join } = require("node:path")
const defaultTheme = require("tailwindcss/defaultTheme")

const src = join(__dirname, "../..")

module.exports = {
  purge: [`${src}/editions/v5/*.{astro,ts}`, `${src}/pages/v5/**/*.astro`],
  theme: {
    extend: {
      colors: {
        "dodger-blue": {
          100: "#0096FF",
          200: "#0078CC",
          300: "#0060A3",
          400: "#004D82",
          500: "#003E68",
          600: "#003253",
          700: "#002842",
          800: "#002035",
          900: "#001A2A",
        },
      },
      textColor: (theme) => theme("colors"),
    },
    fontFamily: {
      ...defaultTheme.fontFamily,
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
    },
  },
  variants: {},
  plugins: [require("tailwindcss-transitions")()],
}
