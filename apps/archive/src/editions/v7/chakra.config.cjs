/**
 * v7's packages/v7/theme/index.ts: the `extendTheme` overrides on Chakra UI 1.6.10 (theme
 * 1.10.4). Dark only. The nprogress bar rules are left out: the rebuild has no route progress.
 */
module.exports = {
  colorMode: "dark",
  theme: (defaultTheme) => ({
    components: {
      Heading: {
        baseStyle: {
          fontWeight: 800,
          letterSpacing: "tighter",
        },
      },
      Link: {
        variants: {
          link: {
            color: "yellow.200",
          },
        },
      },
      Modal: {
        baseStyle: {
          dialog: {
            bgColor: "gray.900",
          },
          overlay: {
            "@supports (backdrop-filter: blur(4px))": {
              backdropFilter: "blur(4px)",
            },
            "@supports (-webkit-backdrop-filter: blur(4px))": {
              WebkitBackdropFilter: "blur(4px)",
            },
          },
        },
      },
    },

    config: {
      initialColorMode: "dark",
    },

    fonts: {
      body: `'Archivo',${defaultTheme.fonts.body}`,
      heading: `'Manrope',${defaultTheme.fonts.heading}`,
    },

    styles: {
      global: {
        ":root": {
          colorScheme: "dark",
        },
        "::selection, ::-moz-selection": {
          bgColor: "whiteAlpha.400",
        },

        html: {
          scrollBehavior: "smooth",
        },
        body: {
          bg: "gray.900",
          color: "whiteAlpha.900",
          cursor: "default",
          fontFamily: "body",
          lineHeight: "base",
          minH: "100vh",

          MozOsxFontSmoothing: "grayscale",
          WebkitFontSmoothing: "antialiased",
          textRendering: "optimizeLegibility",
        },
        "*::placeholder": {
          color: "whiteAlpha.400",
        },
        "*, *::before, &::after": {
          borderColor: "whiteAlpha.300",
          wordWrap: "break-word",
        },
      },
    },
  }),
}
