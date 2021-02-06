import * as React from "react";

import type { TooltipProps } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";

const EmailTooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
  return (
    <Tooltip
      aria-label="Email address"
      hasArrow
      label="Click to copy email address 📮"
      placement="left"
      {...props}
    >
      {children}
    </Tooltip>
  );
};

export default EmailTooltip;
