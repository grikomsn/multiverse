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

  icons: {
    ...theme.icons,
    doodle,
    doodleCentered,
  },
};
