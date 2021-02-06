import * as React from "react";

import AppearanceList from "@/components/appearance-list";
import Doodle from "@/components/doodle";
import EmailInquiry from "@/components/email-inquiry";
import PostList from "@/components/post-list";
import ProjectList from "@/components/project-list";
import TitleSeparator from "@/components/title-separator";
import copywriting from "@/copywriting.json";
import type { Appearance, BlogPost, Showcase } from "@/generated/graphql";
import { cms } from "@/lib/cms";
import { baseRenderer } from "@/utils/renderers";

import { Box, Button, Flex, Heading, Stack } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import NextLink from "next/link";
import { NextSeo } from "next-seo";
import { FaArrowRight } from "react-icons/fa";
import Markdown from "react-markdown";
import siteConfig from "site-config";

interface HomePageProps {
  appearance: Appearance[];
  posts: BlogPost[];
  showcase: Showcase[];
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await cms().homePageStaticProps();

  return {
    props: {
      showcase: data.showcaseCollection.items,
      appearance: data.appearanceCollection.items,
      posts: data.blogPostCollection.items,
    },
  };
};

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
          description={copywriting.projects.description}
          title="Recent Projects"
        />
        <ProjectList showcase={showcase} />
        <ViewAllButton href="/projects" title="View all projects" />

        <Box h={4} />

        <TitleSeparator
          description={copywriting.appearances.description}
          title="Recent Appearances"
        />
        <AppearanceList appearance={appearance} />
        <ViewAllButton href="/appearances" title="View all appearances" />

        <Box h={4} />

        <TitleSeparator
          description={copywriting.posts.description}
          title="Recent Posts"
        />
        <PostList posts={posts} />
        <ViewAllButton href="/blog" title="View all posts" />
      </Stack>
    </Box>
  );
};

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

export default HomePage;
