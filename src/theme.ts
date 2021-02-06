import { extendTheme, theme as dt } from "@chakra-ui/react";

const body = `Jost,${dt.fonts.body}`;
const heading = `Jost,${dt.fonts.heading}`;
const mono = `Cousine,${dt.fonts.mono}`;

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
    body,
    heading,
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
  styles: {
    global: {
      body: {
        bg: "gray.800",
        color: "whiteAlpha.900",
        fontFamily: "body",
        lineHeight: "base",
        transition: "background-color 0.2s",
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
});
