import * as React from "react";

import { useSocials } from "@/hooks/app";
import routes from "@/routes";

import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
  Link,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import siteConfig from "site-config";

const MobileDrawer: React.FC = () => {
  const { isOpen, onClose, onToggle } = useDisclosure();
  const btnRef = React.useRef();

  const socials = useSocials();

  return (
    <>
      <Box bottom={0} d={{ md: "none" }} p={5} pos="fixed" right={0} zIndex={1}>
        <IconButton
          aria-label="Open menu"
          icon={<Icon as={isOpen ? FaTimes : FaBars} />}
          isRound
          onClick={onToggle}
          ref={btnRef}
          size="lg"
        />
      </Box>

      <Drawer
        finalFocusRef={btnRef}
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader p={8}>
              <NextLink href="/">
                <Link href="/" onClick={onClose} variant="link">
                  {siteConfig.title}
                </Link>
              </NextLink>
            </DrawerHeader>

            <DrawerBody
              as={Stack}
              fontSize="lg"
              justify="center"
              p={8}
              spacing={4}
            >
              {[["Home", "/"], ...routes].map(([title, href]) => (
                <NextLink key={href} href={href}>
                  <Link href={href} onClick={onClose}>
                    {title}
                  </Link>
                </NextLink>
              ))}
            </DrawerBody>

            <DrawerFooter justifyContent="flex-start" px={4} py={8}>
              {socials.map(([href, SocialIcon]) => (
                <IconButton
                  key={href}
                  aria-label={href}
                  as={Link}
                  href={href}
                  icon={<Icon as={SocialIcon} boxSize={6} />}
                  isExternal
                  size="lg"
                  variant="link"
                />
              ))}
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
};

export default MobileDrawer;
