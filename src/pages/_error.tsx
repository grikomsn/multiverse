import { Box, Code, Heading } from "@chakra-ui/core";
import { STATUS_CODES } from "http";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";

type ErrorPageProps = {
  statusCode: number;
  title: string;
};

const ErrorPage: NextPage<ErrorPageProps> = ({ children, ...props }) => (
  <Box px={8}>
    <NextSeo title={`${props.statusCode}`} />

    <Heading as="h1">
      {props.statusCode} {props.title}
    </Heading>
    <Code>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </Code>
  </Box>
);

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;

  return {
    statusCode,
    title: STATUS_CODES[statusCode],
  };
};

export default ErrorPage;
