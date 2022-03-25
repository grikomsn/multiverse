const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/**
 * @type {import("tailwindcss/tailwind-config").TailwindConfig}
 * @see https://tailwindcss.com/docs/configuration
 */
const tailwindConfig = {
  content: [
    "./content/**/*.mdx",
    "./layouts/**/*.tsx",
    "./lib/**/*.{js,cjs,mjs,ts,tsx}",
    "./pages/**/*.{mdx,tsx}",
    "./ui/**/*.{ts,tsx}",
  ],

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
      });
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
        mono: ['"Berkeley Mono"', ...defaultTheme.fontFamily.mono],
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
};

module.exports = tailwindConfig;
