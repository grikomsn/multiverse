import * as React from "react";

import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import { NextSeo } from "next-seo";

const pageMeta = {
  title: `404`,
  description: `Uhhh there's nothing here...`,
};

const FourOhFourPage: NextPage = () => {
  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading>{pageMeta.title}</Heading>
          <Text>{pageMeta.description}</Text>
        </Stack>
      </Container>
    </>
  );
};

export default FourOhFourPage;
