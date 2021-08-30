import * as React from "react";

import { baseComponents } from "~components/markdown";
import { AboutStaticPropsQuery } from "~generated/graphql";
import meta from "~generated/meta.json";
import cms from "~lib/cms";

import { Box, Container, Heading, Link, List, ListItem, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import trimHttps from "@grikomsn/shared/utils/trim-https";
import { GetStaticProps } from "next";
import { NextSeo } from "next-seo";
import { Image, ResponsiveImageType } from "react-datocms";
import ReactMarkdown from "react-markdown";

interface AboutPageProps {
  data: AboutStaticPropsQuery;
}

export const getStaticProps: GetStaticProps<AboutPageProps> = async () => {
  const data = await cms().aboutStaticProps();
  return {
    props: {
      data,
    },
  };
};

const pageMeta = {
  title: `About me`,
  description: `Get to know more about myself`,
};

const AboutPage: NextPage<AboutPageProps> = (props) => {
  const { data } = props;

  return (
    <>
      <NextSeo {...pageMeta} />

      <Container maxW="4xl" p={[4, 8]}>
        <Box pb={8}>
          <Image data={data.about?.coverImage?.responsiveImage as ResponsiveImageType} />
        </Box>

        <Stack lineHeight="tall" pb={8} spacing={4}>
          <ReactMarkdown children={data.about?.preface as string} components={baseComponents} />
        </Stack>

        <SimpleGrid columns={[2, 3, 4]} gap={4}>
          {data.about?.knowledgeBases?.map(
            (kb) =>
              kb && (
                <Box key={kb.title}>
                  <Heading pb={4} size="md">
                    {kb.title}
                  </Heading>
                  <List fontSize="sm" spacing={1}>
                    {kb.entries?.split(", ").map((e, i) => (
                      <ListItem key={i}>{e.trim()}</ListItem>
                    ))}
                  </List>
                </Box>
              ),
          )}
        </SimpleGrid>

        <Box h={8} />

        <Text pb={2}>
          You can reach out via email at{" "}
          <Link href={`mailto:${meta.about.email}`} variant="link">
            {meta.about.email}
          </Link>
          , or via socials below:
        </Text>
        <List spacing={1}>
          {Object.entries(meta.about.socialsJson).map(([name, href]) => (
            <ListItem key={name}>
              {name} -{" "}
              <Link href={href} isExternal variant="link">
                {trimHttps(href)}
              </Link>
            </ListItem>
          ))}
        </List>
      </Container>
    </>
  );
};

export default AboutPage;
