import * as React from "react";

import { BlogPosts, Card } from "@/components";
import { Box, Heading, Stack } from "@chakra-ui/core";

import { BlogPost } from "@/types";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { ResponsiveImageType } from "react-datocms";
import { gql } from "@/cms";

type BlogPageProps = {
  blogPosts: BlogPost[];
  header: {
    responsiveImage: ResponsiveImageType;
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const { blogPosts, header } = await gql`
    {
      blogPosts: allBlogPosts(orderBy: postedAt_DESC) {
        title
        slug
        subtitle
        postedAt
      }
      header: upload(
        filter: { notes: { matches: { pattern: "blog-header" } } }
      ) {
        responsiveImage {
          alt
          aspectRatio
          base64
          bgColor
          height
          sizes
          src
          srcSet
          title
          webpSrcSet
          width
        }
      }
    }
  `;

  return {
    props: {
      blogPosts,
      header,
    },
    revalidate: 86400,
  };
};

const BlogPage: React.FC<BlogPageProps> = ({ blogPosts, header }) => (
  <Box>
    <NextSeo title="Latest Blog Posts" />

    <Card headerResponsiveImage={header.responsiveImage}>
      <Stack pb={4}>
        <Heading as="h1">Latest Blog Posts</Heading>
        <Box>
          Sometimes I write about web development, other times about random
          interesting stuff.
        </Box>
      </Stack>

      <BlogPosts blogPosts={blogPosts} />
    </Card>
  </Box>
);

export default BlogPage;
