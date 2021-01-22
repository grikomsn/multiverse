import * as React from "react";

import type { GetStaticProps, NextPage } from "next";

import type { BlogPost } from "@/generated/graphql";
import { NextSeo } from "next-seo";
import PostList from "@/components/post-list";
import { Stack } from "@chakra-ui/react";
import TitleSeparator from "@/components/title-separator";
import { cms } from "@/lib/cms";
import copywriting from "@/copywriting.json";

interface BlogPostsPageProps {
  posts: BlogPost[];
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await cms().blogStaticProps();

  return {
    props: {
      posts: data.blogPostCollection.items,
    },
  };
};

const meta = {
  title: "Blog Posts",
  description: copywriting.posts.description,
};

const BlogPostsPage: NextPage<BlogPostsPageProps> = ({ posts }) => {
  return (
    <Stack bgColor="gray.700" borderRadius="md" p={8} spacing={4}>
      <NextSeo {...meta} />
      <TitleSeparator {...meta} />
      <PostList posts={posts} />
    </Stack>
  );
};

export default BlogPostsPage;
