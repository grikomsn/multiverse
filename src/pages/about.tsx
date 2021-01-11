import * as React from "react";

import {
  Box,
  Flex,
  Heading,
  Img,
  Link,
  List,
  ListItem,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import { baseRenderer, kbRenderer } from "@/utils/renderers";

import EmailInquiry from "@/components/email-inquiry";
import Markdown from "react-markdown";
import { NextSeo } from "next-seo";
import TitleSeparator from "@/components/title-separator";
import { contentful } from "@/cms";
import siteConfig from "site-config";

interface AboutPageProps {
  preface: string;
  kb: string[];
}

const AboutPage: NextPage<AboutPageProps> = ({ preface, kb }) => {
  return (
    <>
      <NextSeo title="About Me" />
      <Stack
        bgColor="gray.700"
        borderRadius="md"
        fontSize={{ md: "md" }}
        lineHeight="tall"
        p={8}
        spacing={16}
      >
        <Flex flexDir={{ base: "column-reverse", lg: "row" }}>
          <Stack pr={{ lg: 8 }} pt={{ base: 8, lg: 0 }} spacing={4}>
            <Heading>Hi, I&apos;m {siteConfig.title}.</Heading>

            <Markdown renderers={baseRenderer} source={preface} />

            <Text>
              <EmailInquiry />
            </Text>
          </Stack>

          <Box maxW="xs" mx="auto" w="full">
            <Img alt={siteConfig.title} borderRadius="full" src="/me.jpg" />
          </Box>
        </Flex>

        <Stack>
          <TitleSeparator
            title="Knowledge Base"
            description="Here are the things I am proficient and/or currently use on a daily basis."
          />
          <SimpleGrid columns={[2, 3, 4, 5]} gap={8} pt={4}>
            {kb.map((k, i) => (
              <Box key={i}>
                <Markdown renderers={kbRenderer} source={k} />
              </Box>
            ))}
          </SimpleGrid>
        </Stack>

        <Stack>
          <TitleSeparator
            title="Social Presences"
            description="Get in touch with me on various platforms and social medias."
          />
          <List pt={4}>
            {Object.entries(siteConfig.socials).map(
              ([k, v]: [string, string]) => (
                <ListItem key={k}>
                  {k} &ndash;{" "}
                  <Link href={v} isExternal variant="link">
                    {v.replace(/^http(s?):\/\//, "")}
                  </Link>
                </ListItem>
              ),
            )}
          </List>
        </Stack>
      </Stack>
    </>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const data = await contentful().request(/* GraphQL */ `
    {
      aboutPage: aboutPageCollection(limit: 1) {
        items {
          preface
          knowledgeBase
        }
      }
    }
  `);

  const content = data.aboutPage.items[0];

  return {
    props: {
      preface: content.preface,
      kb: `${content.knowledgeBase}`.split("---").map((s) => s.trim()),
    },
  };
};

export default AboutPage;
