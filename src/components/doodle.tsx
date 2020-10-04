import * as React from "react";

import DoodleDesktop from "@/components/doodle-desktop";
import DoodleMobile from "@/components/doodle-mobile";
import type { IconProps } from "@chakra-ui/core";

const Doodle: React.FC<IconProps> = (props) => {
  return (
    <>
      <DoodleMobile d={{ base: "block", lg: "none" }} {...props} />
      <DoodleDesktop d={{ base: "none", lg: "block" }} {...props} />
    </>
  );
};

export default Doodle;
