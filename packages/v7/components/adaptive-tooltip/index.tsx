import * as React from "react";

import {
  ThemeTypings,
  Tooltip,
  TooltipProps,
  useMediaQuery,
  useTheme,
} from "@chakra-ui/react";

interface AdaptiveTooltipProps extends TooltipProps {
  breakpoint?: ThemeTypings["breakpoints"];
}

export default function AdaptiveTooltip(props: AdaptiveTooltipProps) {
  const { breakpoint = "md", ...rest } = props;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const minWidth = useTheme().breakpoints[breakpoint] as string;
  const [shouldShow] = useMediaQuery([`(min-width: ${minWidth})`]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return shouldShow ? <Tooltip {...rest} /> : <>{rest.children}</>;
}
