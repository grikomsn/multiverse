import * as React from "react";

import { Appearance, BlogPost, Showcase, SiteConfig } from "@/types";
import {
  Appearances,
  BlogPosts,
  Card,
  Header,
  IndexSection,
  Showcases,
} from "@/components";

import { Box } from "@chakra-ui/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { gql } from "@/cms";

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
    revalidate: 86400,
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

    <Card shouldWrapChildren>
      <IndexSection
        title="Recent Projects"
        subtitle="Here are some of my past works from personal projects and open source ones."
        route="/projects"
        routeText="View all projects"
      >
        <Showcases showcases={showcases} />
      </IndexSection>

      <IndexSection
        title="Recent Appearances"
        subtitle="Talks, meetups, and other appearances from various events."
        route="/appearances"
        routeText="View all appearances"
      >
        <Appearances appearances={appearances} />
      </IndexSection>

      <IndexSection
        title="Recent Posts"
        subtitle="Sometimes I write about web development, other times about random interesting stuff."
        route="/blog"
        routeText="View all posts"
      >
        <BlogPosts blogPosts={blogPosts} />
      </IndexSection>
    </Card>
  </Box>
);

export default HomePage;
