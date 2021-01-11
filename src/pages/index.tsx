import * as React from "react";

import type {
  Appearance,
  AppearanceCollection,
  BlogPost,
  BlogPostCollection,
  Showcase,
  ShowcaseCollection,
} from "@/generated/graphql";
import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";

import AppearanceList from "@/components/appearance-list";
import Doodle from "@/components/doodle";
import EmailInquiry from "@/components/email-inquiry";
import { FaArrowRight } from "react-icons/fa";
import Markdown from "react-markdown";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import PostList from "@/components/post-list";
import ProjectList from "@/components/project-list";
import TitleSeparator from "@/components/title-separator";
import { baseRenderer } from "@/utils/renderers";
import { contentful } from "@/cms";
import copywriting from "@/copywriting.json";
import siteConfig from "site-config";

interface HomePageProps {
  showcase: Showcase[];
  appearance: Appearance[];
  posts: BlogPost[];
}

function ViewAllButton({ title, href }) {
  return (
    <Box>
      <NextLink href={href} passHref>
        <Button as="a" float="right" rightIcon={<FaArrowRight />}>
          {title}
        </Button>
      </NextLink>
    </Box>
  );
}

const HomePage: NextPage<HomePageProps> = ({ showcase, appearance, posts }) => {
  return (
    <Box>
      <NextSeo title={siteConfig.title} titleTemplate="%s" />
      <Flex
        alignItems="center"
        direction={{ base: "column-reverse", lg: "row" }}
        justifyContent="space-between"
        pt={{ base: 8, lg: 0 }}
        px={8}
      >
        <Stack
          lineHeight="tall"
          maxW={{ lg: "2xl" }}
          py={{ base: 8, lg: 4 }}
          spacing={4}
        >
          <Heading>Hi, I&apos;m {siteConfig.title}.</Heading>
          <Box fontSize="lg">
            <Markdown
              renderers={baseRenderer}
              source={siteConfig.descriptionMd}
            />
          </Box>
          <Box fontSize="lg">
            <EmailInquiry />
          </Box>
        </Stack>

        <Box boxSize={4} />

        <Doodle boxSize="full" maxW="xs" />
      </Flex>

      <Stack bgColor="gray.700" borderRadius={{ lg: "md" }} p={8} spacing={4}>
        <TitleSeparator
          title="Recent Projects"
          description={copywriting.projects.description}
        />
        <ProjectList showcase={showcase} />
        <ViewAllButton title="View all projects" href="/projects" />

        <Box h={4} />

        <TitleSeparator
          title="Recent Appearances"
          description={copywriting.appearances.description}
        />
        <AppearanceList appearance={appearance} />
        <ViewAllButton title="View all appearances" href="/appearances" />

        <Box h={4} />

        <TitleSeparator
          title="Recent Posts"
          description={copywriting.posts.description}
        />
        <PostList posts={posts} />
        <ViewAllButton title="View all posts" href="/blog" />
      </Stack>
    </Box>
  );
};

type QueryResult = {
  showcaseCollection: ShowcaseCollection;
  appearanceCollection: AppearanceCollection;
  blogPostCollection: BlogPostCollection;
};

export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
  const data = await contentful().request<QueryResult>(/* GraphQL */ `
    {
      showcaseCollection(
        limit: 10
        order: featuredOrder_ASC
        where: { featuredOrder_exists: true }
      ) {
        items {
          title
          tech
          image {
            url(transform: { width: 1280 })
          }
          url
          sys {
            id
          }
        }
      }
      appearanceCollection(limit: 10, order: date_DESC) {
        items {
          title
          date
          subtitle
          url
          tags
          category
          sys {
            id
          }
        }
      }
      blogPostCollection(limit: 10, order: postedAt_DESC) {
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
      showcase: data.showcaseCollection.items,
      appearance: data.appearanceCollection.items,
      posts: data.blogPostCollection.items,
    },
  };
};

export default HomePage;
