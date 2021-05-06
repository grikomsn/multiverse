import * as React from "react";

import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";

interface ErrorPageProps {
  statusCode: number;
}

const ErrorPage: NextPage<ErrorPageProps> = (props) => {
  const { statusCode } = props;

  const pageMeta = {
    title: `${statusCode}`,
    description: `Something went wrong :(`,
  };

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

ErrorPage.getInitialProps = ({ err, res }) => {
  console.error(err);
  return {
    statusCode: res ? res.statusCode : err ? err.statusCode : 404,
  };
};

export default ErrorPage;
