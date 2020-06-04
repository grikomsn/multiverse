import * as React from "react";

import { Box, Divider, Flex, Stack, Text } from "@chakra-ui/core";

import { Link } from "@/components";
import routes from "@/routes";

const Footer: React.FC = () => (
  <Stack fontSize="sm" py={16} spacing={8}>
    <Divider />
    <Flex
      flexDirection={{ default: "column-reverse", md: "row" }}
      justifyContent={{ md: "space-between" }}
      px={8}
    >
      <Stack spacing={12} textAlign={{ default: "center", md: "left" }}>
        <Box>
          <Text>
            Contents licensed under{" "}
            <Link href="https://griko.dev/cc-by-nc-sa">CC BY-NC-SA 4.0</Link>.
          </Text>
          <Text>
            Made using <Link href="https://nextjs.org">Next.js</Link>,{" "}
            <Link href="https://chakra-ui.com">Chakra UI</Link>, and{" "}
            <Link href="https://www.datocms.com">DatoCMS</Link>. Hosted on{" "}
            <Link href="https://vercel.com/home">Vercel</Link>.
          </Text>
        </Box>

        <Box>
          MIT License &copy; {new Date().getFullYear()}&mdash;present{" "}
          <Link isNextLink href="/">
            Griko Nibras
          </Link>
          .
        </Box>
      </Stack>

      <Stack
        flexDirection={{ default: "row", md: "column" }}
        flexWrap="wrap"
        justifyContent={{ default: "center", md: null }}
        pb={{ default: 8, md: 0 }}
        spacing={1}
        textAlign={{ md: "right" }}
      >
        {routes.map(([children, route]) => (
          <Link
            color="currentColor"
            href={route}
            isNextLink
            key={route}
            px={{ default: 2, md: 0 }}
          >
            {children}
          </Link>
        ))}
      </Stack>
    </Flex>
  </Stack>
);

export default Footer;
