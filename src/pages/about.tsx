import { gql } from "@/cms";
import { Card, Link } from "@/components";
import { AboutPageContent, SiteConfig } from "@/types";
import { aboutPageRenderer } from "@/utils/renderers";
import {
  Box,
  Flex,
  Grid,
  Heading,
  List,
  ListItem,
  Stack,
  Text,
} from "@chakra-ui/core";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import * as React from "react";
import { Image as DatoImage } from "react-datocms";
import Markdown from "react-markdown";

type AboutPageProps = {
  content: AboutPageContent;
  siteConfig: SiteConfig;
};

export const getStaticProps: GetStaticProps = async () => {
  const { content, siteConfig } = await gql`
    {
      content: aboutPage {
        portrait {
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
        title
        excerpt
        knowledgeBase
      }
      siteConfig {
        title
        socials
      }
    }
  `;

  return { props: { content, siteConfig } };
};

const AboutPage: React.FC<AboutPageProps> = ({ content, siteConfig }) => (
  <Box>
    <NextSeo title="About" />

    <Card>
      <Stack spacing={16}>
        <Flex flexDirection={{ default: "column-reverse", lg: "row" }}>
          <Stack spacing={4} pr={{ default: 0, lg: 4 }}>
            <Heading as="h1">{content.title}</Heading>
            <Markdown source={content.excerpt} renderers={aboutPageRenderer} />
          </Stack>

          <Box maxW="256px" mx="auto" pb={8}>
            <Box borderRadius="full" maxH="256px" overflow="hidden">
              <DatoImage data={content.portrait.responsiveImage} />
            </Box>
          </Box>
        </Flex>

        <Stack spacing={4}>
          <Stack>
            <Heading as="h2" size="lg">
              Knowledge Base
            </Heading>

            <Text>
              Here are the things I am proficient and/or currently use on a
              daily basis.
            </Text>
          </Stack>

          <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
              "repeat(4, 1fr)",
            ]}
            gap={8}
          >
            {content.knowledgeBase.map(({ key, value }) => (
              <Stack key={key}>
                <Text fontWeight="semibold">{key}</Text>
                <List styleType="none">
                  {value.map((v) => (
                    <ListItem key={v}>{v}</ListItem>
                  ))}
                </List>
              </Stack>
            ))}
          </Grid>
        </Stack>

        <Stack spacing={4}>
          <Stack>
            <Heading as="h2" size="lg">
              Socials
            </Heading>

            <Text>
              Get in touch with me on various platforms and social medias.
            </Text>
          </Stack>

          <Box>
            {Object.entries(siteConfig.socials).map(([key, value]) => (
              <Text key={key}>
                {key} - <Link href={value} />
              </Text>
            ))}
          </Box>
        </Stack>
      </Stack>
    </Card>
  </Box>
);

export default AboutPage;
