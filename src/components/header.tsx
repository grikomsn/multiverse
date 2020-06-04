import * as React from "react";

import { Box, Flex, Heading, Icon } from "@chakra-ui/core";
import { useColorMode, useSiteConfig } from "@/hooks";

import { Link } from "@/components";
import Markdown from "react-markdown";
import { headerRenderer } from "@/utils/renderers";

const Header: React.FC = () => {
  const { isDarkMode } = useColorMode();
  const { descriptionMarkdown, email } = useSiteConfig();

  return (
    <Flex
      alignItems="end"
      flexDirection={{ default: "column-reverse", lg: "row" }}
      justifyContent="space-between"
      px={8}
    >
      <Box maxW={{ lg: "xl" }} py={8}>
        <Heading as="h1" size="xl" pb={4}>
          Hi, I'm Griko Nibras.
        </Heading>

        <Markdown source={descriptionMarkdown} renderers={headerRenderer} />

        <Box pb={4}>
          For business inquiries, drop a mail at{" "}
          <Link href={`mailto:${email}`}>{email}</Link> and let’s talk.
        </Box>
      </Box>

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
        size="18em"
      />
    </Flex>
  );
};

export default Header;
