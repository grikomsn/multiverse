import * as React from "react";

import EmailInquiry from "@/components/email-inquiry";
import TitleSeparator from "@/components/title-separator";
import { cms } from "@/lib/cms";
import { baseRenderer, kbRenderer } from "@/utils/renderers";

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
import { NextSeo } from "next-seo";
import Markdown from "react-markdown";
import siteConfig from "site-config";

interface AboutPageProps {
  preface: string;
  kb: string[];
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const data = await cms().aboutPageStaticProps();
  const content = data.aboutPageCollection.items[0];

  return {
    props: {
      preface: content.preface,
      kb: `${content.knowledgeBase}`.split("---").map((s) => s.trim()),
    },
  };
};

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
            description="Here are the things I am proficient and/or currently use on a daily basis."
            title="Knowledge Base"
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
            description="Get in touch with me on various platforms and social medias."
            title="Social Presences"
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

export default AboutPage;
