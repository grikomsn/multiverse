import doodle from "@/assets/doodle";
import doodleCentered from "@/assets/doodle-centered";
import { theme } from "@chakra-ui/core";

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
];

export default {
  ...theme,

  fonts: {
    ...theme.fonts,
    heading: `${sans}`,
    body: `${sans}`,
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

  icons: {
    ...theme.icons,
    doodle,
    doodleCentered,
  },
};
