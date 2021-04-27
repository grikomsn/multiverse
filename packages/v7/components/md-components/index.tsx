import * as React from "react";

import { Link, Text } from "@chakra-ui/react";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";

export const baseComponents: Partial<NormalComponents & SpecialComponents> = {
  a(props) {
    return <Link {...props} isExternal variant="link" />;
  },
  p: Text,
};
