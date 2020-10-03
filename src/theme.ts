import { extendTheme } from "@chakra-ui/core";

const sans = [
  "Jost",
  "-apple-system",
  "BlinkMacSystemFont",
  "'Segoe UI'",
  "Roboto",
  "Oxygen",
  "Ubuntu",
  "Cantarell",
  "'Open Sans'",
  "'Helvetica Neue'",
  "sans-serif",
].join(",");

const mono = [
  "Cousine",
  "Consolas",
  "'Courier New'",
  "Courier",
  "monospace",
].join(",");

export default extendTheme({
  components: {
    Heading: {
      variants: {
        link: {
          color: "yellow.300",
          _groupHover: {
            textDecor: "underline",
          },
        },
      },
    },
    Link: {
      variants: {
        link: {
          color: "yellow.300",
        },
      },
    },
  },
  fonts: {
    body: sans,
    heading: sans,
    mono,
  },
  fontSizes: {
    xs: "14px",
    sm: "16px",
    md: "18px",
    lg: "20px",
    xl: "24px",
    "2xl": "28px",
    "3xl": "36px",
    "4xl": "48px",
    "5xl": "64px",
    "6xl": "72px",
  },
  sizes: {
    "4xs": "12rem",
    "5xs": "10rem",
    "6xs": "8rem",
    "7xs": "6rem",
    "8xs": "4rem",
  },
});
