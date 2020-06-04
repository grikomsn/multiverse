import * as React from "react";

import { Box, Code, Heading, Image, Stack, Text } from "@chakra-ui/core";

import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

const NotFoundPage: React.FC = () => {
  const { asPath } = useRouter();

  return (
    <Box px={8}>
      <NextSeo title="404" />

      <Stack spacing={4} textAlign="center">
        <Heading as="h1">404 Not Found</Heading>
        <Text>
          The route <Code>{asPath}</Code> does not exist.
        </Text>
        <Box maxW="2xl" mx="auto" w="full">
          <Image
            src="https://media.giphy.com/media/QIKy1Gs9r88iQ/giphy.gif"
            w="full"
          />
        </Box>
      </Stack>
    </Box>
  );
};

export default NotFoundPage;
