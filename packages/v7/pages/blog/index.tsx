import * as React from "react";

import {
  Alert,
  AlertIcon,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BlogPostsPageProps {
  //
}

export const getStaticProps: GetStaticProps<BlogPostsPageProps> = async () => {
  return {
    props: {
      //
    },
    revalidate: 86400,
  };
};

const pageMeta = {
  title: `Blog posts`,
  description: `Sometimes I write about web development, other times about random interesting stuff.`,
};

const BlogPostsPage: NextPage = () => {
  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading>{pageMeta.title}</Heading>
          <Text pb={8}>{pageMeta.description}</Text>

          <Alert textAlign="initial">
            <AlertIcon />
            Currently migrating my posts from previous CMS, sorry about that.
          </Alert>
        </Stack>
      </Container>
    </>
  );
};

export default BlogPostsPage;
