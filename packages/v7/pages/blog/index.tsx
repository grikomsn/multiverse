import * as React from "react";

import PostItem from "~components/post-item";
import { PostMetaFieldsFragment } from "~generated/graphql";
import cms from "~lib/cms";

import { Container, Heading, Stack, Text } from "@chakra-ui/react";
import { GetStaticProps, NextPage } from "next";
import NextLink from "next/link";
import { NextSeo } from "next-seo";

interface BlogPostsPageProps {
  posts: PostMetaFieldsFragment[];
}

export const getStaticProps: GetStaticProps<BlogPostsPageProps> = async () => {
  const posts: PostMetaFieldsFragment[] = [];

  function* fetchPosts() {
    let step = 0;
    while (true) yield cms().getPosts({ skip: step++ * 100 });
  }

  for await (const { allPosts } of fetchPosts()) {
    if (allPosts.length < 1) break;
    posts.push(...allPosts);
  }

  return {
    props: {
      posts,
    },
  };
};

const BlogPostsPage: NextPage<BlogPostsPageProps> = (props) => {
  const { posts } = props;

  const pageMeta = {
    title: `Blog posts`,
    description: `Sometimes I write about web development, other times about random interesting stuff.`,
  };

  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading>{pageMeta.title}</Heading>
          <Text pb={8}>{pageMeta.description}</Text>

          {posts.map((post) => (
            <NextLink key={post.slug} href={`/blog/${post.slug}`}>
              <PostItem post={post} />
            </NextLink>
          ))}
        </Stack>
      </Container>
    </>
  );
};

export default BlogPostsPage;
