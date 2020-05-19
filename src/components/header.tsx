import { Link } from "@/components";
import { useColorMode, useSiteConfig } from "@/hooks";
import { headerRenderer } from "@/utils/renderers";
import { Box, Flex, Heading, Icon, Stack } from "@chakra-ui/core";
import * as React from "react";
import Markdown from "react-markdown";

const Header: React.FC = () => {
  const { isDarkMode } = useColorMode();
  const { descriptionMarkdown, email } = useSiteConfig();

  return (
    <Flex
      alignItems="end"
      flexDirection={{ default: "column-reverse", lg: "row" }}
      px={8}
    >
      <Stack py={8} spacing={4}>
        <Heading as="h1">Hi, I'm Griko Nibras.</Heading>

        <Markdown source={descriptionMarkdown} renderers={headerRenderer} />

        <Box>
          For business inquiries, drop a mail at{" "}
          <Link href={`mailto:${email}`}>{email}</Link> and let’s talk.
        </Box>
      </Stack>

      <Box
        borderRadius="full"
        display={{ default: "block", lg: "none" }}
        maxW="64"
        mx="auto"
        w="full"
      >
        <Icon
          backgroundColor={isDarkMode ? "gray.700" : "white"}
          borderRadius="full"
          color={isDarkMode ? "gray.700" : "white"}
          name="doodleCentered"
          size="full"
        />
      </Box>
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
