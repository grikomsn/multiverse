import * as React from "react";

import type { BlogPost, BlogPostCollection } from "@/generated/graphql";
import type { GetStaticProps, NextPage } from "next";

import { NextSeo } from "next-seo";
import PostList from "@/components/post-list";
import { Stack } from "@chakra-ui/react";
import TitleSeparator from "@/components/title-separator";
import { contentful } from "@/cms";
import copywriting from "@/copywriting.json";

interface BlogPostsPageProps {
  posts: BlogPost[];
}

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

type QueryResult = {
  blogPostCollection: BlogPostCollection;
};

export const getStaticProps: GetStaticProps<BlogPostsPageProps> = async () => {
  const data = await contentful().request<QueryResult>(/* GraphQL */ `
    {
      blogPostCollection(order: postedAt_DESC) {
        items {
          title
          slug
          subtitle
          postedAt
          tags
          sys {
            id
          }
        }
      }
    }
  `);

  return {
    props: {
      posts: data.blogPostCollection.items,
    },
  };
};

export default BlogPostsPage;
