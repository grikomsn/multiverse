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
    plugin(({ addUtilities, matchUtilities, theme }) => {
      addUtilities({
        ".safari-transform-fix": {
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          MozBackfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          MozTransform: "translate3d(0, 0, 0)",
          WebkitTransform: "translate3d(0, 0, 0)",
        },
      });

      matchUtilities(
        {
          "p-inline-start": (value) => ({ paddingInlineStart: value }),
          "p-inline-end": (value) => ({ paddingInlineEnd: value }),
        },
        {
          values: theme("spacing"),
        },
      );
    }),
  ],

  theme: {
    extend: {
      animation: {
        "rotate-colors": "rotate-colors-keyframes 60s infinite",
      },
      colors: {
        body: colors.neutral[900],
        primary: colors.sky[500],
        text: colors.neutral[200],
      },
      fontFamily: {
        mono: ['"Berkeley Mono"', ...defaultTheme.fontFamily.mono],
        sans: ["Lexend", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "rotate-colors-keyframes": {
          "0%, 100%": {
            filter: "hue-rotate(0deg)",
          },
          "50%": {
            filter: "hue-rotate(360deg)",
          },
        },
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
