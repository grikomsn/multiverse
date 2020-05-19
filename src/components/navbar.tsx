import { Link } from "@/components";
import { useColorMode, useSiteConfig } from "@/hooks";
import routes from "@/routes";
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
import * as React from "react";
import { FaBars, FaGithub, FaMoon, FaRss, FaTwitter } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { title, socials } = useSiteConfig();

  const { toggleColorMode } = useColorMode();

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
            aria-label="toggle dark mode"
            onClick={toggleColorMode}
            {...paddings}
          >
            <Box as={FaMoon} size="18px" />
          </Box>

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
          <Box
            as="button"
            aria-label="toggle dark mode"
            onClick={toggleColorMode}
            {...paddings}
          >
            <Box as={FaMoon} size="18px" />
          </Box>
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

                <Box
                  as="button"
                  aria-label="toggle dark mode"
                  onClick={toggleColorMode}
                >
                  <Box as={FaMoon} size="24px" />
                </Box>
              </Stack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;
