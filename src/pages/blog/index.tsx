import { gql } from "@/cms";
import { BlogPosts, Card } from "@/components";
import { BlogPost } from "@/types";
import { Box, Heading, Stack } from "@chakra-ui/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";
import { ResponsiveImageType } from "react-datocms";

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
    unstable_revalidate: 86400,
  };
};

const BlogPage: React.FC<BlogPageProps> = ({ blogPosts, header }) => (
  <Box>
    <NextSeo title="Latest Blog Posts" />

    <Card headerResponsiveImage={header.responsiveImage}>
      <Stack>
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
