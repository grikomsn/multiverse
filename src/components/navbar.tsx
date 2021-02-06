import * as React from "react";

import { useSocials } from "@/hooks/app";
import routes from "@/routes";

import { HStack, Icon, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import siteConfig from "site-config";

const Navbar: React.FC = () => {
  const socials = useSocials();

  return (
    <HStack as="nav" fontSize="md" p={4} spacing={0}>
      <NextLink href="/">
        <Link fontWeight="bold" href="/" p={4} variant="link">
          {siteConfig.title}
        </Link>
      </NextLink>

      <HStack d={{ base: "none", md: "flex" }} spacing={0}>
        {routes.map(([text, href]) => (
          <NextLink key={href} href={href}>
            <Link href={href} p={4}>
              {text}
            </Link>
          </NextLink>
        ))}
      </HStack>

      <HStack
        flexGrow={1}
        justify="flex-end"
        p={4}
        spacing={{ base: 0, sm: 2 }}
      >
        {socials.map(([href, SocialIcon]) => (
          <IconButton
            key={href}
            aria-label={href}
            as={Link}
            href={href}
            icon={<Icon as={SocialIcon} boxSize={5} />}
            isExternal
            variant="link"
          />
        ))}
      </HStack>
    </HStack>
  );
};

export default Navbar;
