import { DefaultTheme } from "@chakra-ui/core";

interface Config {
  color: string;
  bg: string;
  borderColor: string;
  placeholderColor: string;
}

type ConfigReturnType = {
  light: Config;
  dark: Config;
};

export const cssResetConfig: (
  theme: DefaultTheme,
  defaultConfig?: ConfigReturnType,
) => ConfigReturnType = (theme) => ({
  light: {
    color: theme.colors.gray[900],
    bg: theme.colors.gray[200],
    borderColor: theme.colors.gray[200],
    placeholderColor: theme.colors.gray[400],
  },
  dark: {
    color: theme.colors.white,
    bg: theme.colors.gray[900],
    borderColor: theme.colors.whiteAlpha[300],
    placeholderColor: theme.colors.whiteAlpha[400],
  },
});
