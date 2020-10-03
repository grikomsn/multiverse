import * as React from "react";

import { Box, Divider, Flex, HStack, Icon, Link, Stack } from "@chakra-ui/core";
import { useSocials } from "@/hooks/app";

import Markdown from "react-markdown";
import NextLink from "next/link";
import { baseRenderer } from "@/utils/renderers";
import routes from "@/routes";
import siteConfig from "~/site-config";

const Footer: React.FC = () => {
  const socials = useSocials();

  const content = `
Contents licensed under [CC BY-NC-SA 4.0](https://griko.dev/cc-by-nc-sa).<br />
Made using [Next.js](https://nextjs.org), [Chakra UI](https://next.chakra-ui.com),
and [Contentful](https://www.contentful.com). Hosted on [Vercel](https://vercel.com).
<br /><br /> MIT License &copy; ${new Date().getFullYear()}&ndash;present
[${siteConfig.title}](.).`;

  return (
    <Stack as="footer" pb={16} pt={8} spacing={8}>
      <Divider />
      <Flex
        alignItems="flex-start"
        flexDir="row"
        justifyContent="space-between"
        px={8}
      >
        <Stack spacing={8}>
          <Box>
            <Markdown
              escapeHtml={false}
              renderers={baseRenderer}
              source={content.trim()}
            />
          </Box>
          <HStack spacing={6}>
            {socials.map(([href, SocialIcon]) => (
              <Link href={href} isExternal key={href}>
                <Icon as={SocialIcon} boxSize={5} />
              </Link>
            ))}
          </HStack>
        </Stack>

        <Stack
          d={{ base: "none", sm: "flex" }}
          pl={8}
          spacing={1}
          textAlign="right"
        >
          {routes.map(([text, href]) => (
            <NextLink href={href} key={href}>
              <Link href={href}>{text}</Link>
            </NextLink>
          ))}
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Footer;
