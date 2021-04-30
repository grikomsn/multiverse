import * as React from "react";

import routes from "~routes";

import { Button, HStack, useTheme } from "@chakra-ui/react";
import { transparentize } from "@chakra-ui/theme-tools";
import Link from "next/link";
import { useRouter } from "next/router";

const routeArray = Object.entries(routes as Record<string, string>);

const Navbar: React.FC = () => {
  const router = useRouter();

  const isRoute = React.useCallback(
    (route: string) => {
      return router.route == route;
    },
    [router.route],
  );

  const theme = useTheme();
  const [bgColor, lighterBgColor] = React.useMemo(
    () => [
      transparentize("gray.900", 0.9)(theme),
      transparentize("gray.900", 0.6)(theme),
    ],
    [],
  );

  return (
    <HStack
      bgColor={bgColor}
      borderBottomColor="whiteAlpha.50"
      borderBottomWidth="2px"
      d={["none", "flex"]}
      insetX={0}
      justify="center"
      p={[2, 4]}
      pos="sticky"
      sx={{
        "@supports (backdrop-filter: blur(12px))": {
          "backdrop-filter": "blur(12px)",
          bgColor: lighterBgColor,
        },
        "@supports (-webkit-backdrop-filter: blur(12px))": {
          "-webkit-backdrop-filter": "blur(12px)",
          bgColor: lighterBgColor,
        },
      }}
      top={0}
      zIndex="modal"
    >
      {routeArray.map(([route, name]) => (
        <Link key={name} href={route} passHref>
          <Button
            as="a"
            colorScheme={isRoute(route) ? "yellow" : null}
            fontWeight={isRoute(route) ? "bold" : "normal"}
            variant="ghost"
          >
            {name}
          </Button>
        </Link>
      ))}
    </HStack>
  );
};

export default Navbar;
