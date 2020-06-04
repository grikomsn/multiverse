import * as React from "react";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  useDisclosure,
} from "@chakra-ui/core";
import { FaBars, FaGithub, FaRss, FaTwitter } from "react-icons/fa";

import { Link } from "@/components";
import routes from "@/routes";
import { useSiteConfig } from "@/hooks";

const Navbar: React.FC = () => {
  const { title, socials } = useSiteConfig();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const paddings = { px: 2, py: 4 };

  const externals: [any, string][] = [
    [FaGithub, socials["GitHub"]],
    [FaTwitter, socials["Twitter"]],
    [FaRss, `/rss.xml`],
  ];

  return (
    <Box fontSize={{ default: "sm", lg: "md" }}>
      <Box
        display={{ default: "flex", md: "none" }}
        justifyContent="space-between"
        px={6}
        py={4}
      >
        <Link href="/" isNextLink fontWeight="bold" {...paddings}>
          {title}
        </Link>

        <Stack isInline spacing={4}>
          <Box
            as="button"
            aria-label="open sidebar menu"
            onClick={onOpen}
            ref={btnRef}
          >
            <Box as={FaBars} size="18px" />
          </Box>
        </Stack>
      </Box>

      <Box
        display={{ default: "none", md: "flex" }}
        alignItems="center"
        justifyContent="space-between"
        px={6}
        py={4}
      >
        <Stack alignItems="flex-start" isInline>
          <Link href="/" isNextLink fontWeight="bold" {...paddings}>
            {title}
          </Link>

          {routes.map(([children, route]) => (
            <Link
              color="currentColor"
              href={route}
              isNextLink
              key={route}
              {...paddings}
            >
              {children}
            </Link>
          ))}
        </Stack>

        <Stack alignItems="flex-start" isInline>
          {externals.map(([icon, route]) => (
            <Link
              color="currentColor"
              href={route}
              isExternal
              key={route}
              {...paddings}
            >
              <Box as={icon} size="18px" />
            </Link>
          ))}
        </Stack>
      </Box>

      <Drawer
        finalFocusRef={btnRef}
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />
          <DrawerBody>
            <Stack spacing={8}>
              <Stack spacing={4}>
                {routes.map(([children, route]) => (
                  <Link
                    color="currentColor"
                    fontSize="xl"
                    href={route}
                    isNextLink
                    key={route}
                  >
                    {children}
                  </Link>
                ))}
              </Stack>

              <Stack isInline spacing={8}>
                {externals.map(([icon, route]) => (
                  <Link
                    color="currentColor"
                    href={route}
                    isExternal
                    key={route}
                  >
                    <Box as={icon} size="24px" />
                  </Link>
                ))}
              </Stack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
