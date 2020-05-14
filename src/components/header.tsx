import { Link } from "@/components";
import { useColorMode, useSiteConfig } from "@/hooks";
import { Box, Flex, Heading, Icon, Stack } from "@chakra-ui/core";
import * as React from "react";

const Header: React.FC = () => {
  const { isDarkMode } = useColorMode();
  const { email, links, socials } = useSiteConfig();

  return (
    <Flex
      alignItems="end"
      flexDirection={{ default: "column-reverse", lg: "row" }}
      px={8}
    >
      <Stack py={8} spacing={4}>
        <Heading as="h1">Hi, I'm Griko Nibras.</Heading>

        <Box fontSize="xl">
          I do full-stack web development using Laravel, Node.js, and
          React-based frameworks. I also organize{" "}
          <Link href={links["SurabayaJS"]}>SurabayaJS</Link>, create and
          contribute <Link href={socials["GitHub"]}>open source stuff</Link>,
          and <Link href={links["Resume"]}>available for hire</Link>.
        </Box>

        <Box>
          For business inquiries, drop a mail at{" "}
          <Link href={`mailto:${email}`}>{email}</Link> and let’s talk.
        </Box>
      </Stack>

      <Icon
        backgroundColor={isDarkMode ? "gray.700" : "white"}
        borderRadius="full"
        color={isDarkMode ? "gray.700" : "white"}
        display={{ default: "block", lg: "none" }}
        maxWidth={64}
        mx="auto"
        name="doodleCentered"
        size="100%"
      />
      <Icon
        color={isDarkMode ? "gray.700" : "white"}
        display={{ default: "none", lg: "block" }}
        name="doodle"
        size="64"
      />
    </Flex>
  );
};

export default Header;
