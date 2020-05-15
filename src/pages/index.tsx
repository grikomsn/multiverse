import { gql } from "@/cms";
import {
  Appearances,
  BlogPosts,
  Card,
  Header,
  Link,
  Showcases,
} from "@/components";
import { Appearance, BlogPost, Showcase, SiteConfig } from "@/types";
import { Box, Heading, Stack } from "@chakra-ui/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";

type HomePageProps = {
  showcases: Showcase[];
  appearances: Appearance[];
  blogPosts: BlogPost[];
  siteConfig: SiteConfig;
};

export const getStaticProps: GetStaticProps = async () => {
  const { showcases, appearances, blogPosts, siteConfig } = await gql`
    {
      showcases: allShowcases(first: 4) {
        title
        tech
        image {
          url
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
        url
      }
      appearances: allAppearances(orderBy: date_DESC, first: 10) {
        title
        date
        subtitle
        url
        tags
        category
      }
      blogPosts: allBlogPosts(orderBy: postedAt_DESC, first: 10) {
        title
        slug
        subtitle
        postedAt
      }
      siteConfig {
        title
      }
    }
  `;

  return {
    props: {
      showcases,
      appearances,
      blogPosts,
      siteConfig,
    },
  };
};

const HomePage: React.FC<HomePageProps> = ({
  showcases,
  appearances,
  blogPosts,
  siteConfig,
}) => (
  <Box>
    <NextSeo title={siteConfig.title} titleTemplate="%s" />

    <Header />

    <Card>
      <Stack>
        <Heading as="h2" size="lg">
          Recent Projects
        </Heading>
        <Box>
          Here are some of my past works from personal projects and open source
          ones.
        </Box>
      </Stack>

      <Showcases showcases={showcases} />

      <Box py={4} textAlign="right">
        <Link isNextLink href="/projects">
          View all projects
        </Link>
      </Box>

      <Stack>
        <Heading as="h2" size="lg">
          Recent Appearances
        </Heading>
        <Box>Talks, meetups, and other appearances from various events.</Box>
      </Stack>

      <Appearances appearances={appearances} />

      <Box py={4} textAlign="right">
        <Link isNextLink href="/appearances">
          View all appearances
        </Link>
      </Box>

      <Stack>
        <Heading as="h2" size="lg">
          Recent Posts
        </Heading>
        <Box>
          Sometimes I write about web development, other times about random
          interesting stuff.
        </Box>
      </Stack>

      <BlogPosts blogPosts={blogPosts} />

      <Box py={4} textAlign="right">
        <Link isNextLink href="/blog">
          View all posts
        </Link>
      </Box>
    </Card>
  </Box>
);

export default HomePage;
