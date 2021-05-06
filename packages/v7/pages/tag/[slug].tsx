import * as React from "react";

import AppearanceItem from "~components/appearance-item";
import ShowcaseItem from "~components/showcase-item";
import { TagRelationsQuery, TagSlugLookupQuery } from "~generated/graphql";
import cms from "~lib/cms";

import { Container, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { NextSeo } from "next-seo";

interface TagPageProps {
  tag: TagSlugLookupQuery["tag"];
  relations: TagRelationsQuery;
}

export const getStaticProps: GetStaticProps<TagPageProps> = async (ctx) => {
  const slug = ctx.params.slug as string;

  const { tag } = await cms().tagSlugLookup({ slug });

  if (!tag) {
    return {
      notFound: true,
    };
  }

  const relations = await cms().tagRelations({ id: tag.id });

  return {
    props: {
      tag,
      relations,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const { allTags } = await cms().tagsStaticPaths();
  return {
    paths: allTags.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

const TagPage: NextPage<TagPageProps> = (props) => {
  const { tag, relations } = props;

  const isEmpty =
    relations.allAppearances.length < 1 && relations.allShowcases.length < 1;

  const pageMeta = {
    title: `${tag.title} related`,
    description: `Showing all things related to the ${tag.title} tag`,
  };

  return (
    <>
      <NextSeo {...pageMeta} />

      <Stack align="center" p={[4, 8]} spacing={4} textAlign="center">
        <Heading>{tag.title}</Heading>
        <Text pb={8}>{pageMeta.description}</Text>

        {isEmpty && (
          <Text color="whiteAlpha.400" fontStyle="italic">
            ...there&apos;s nothing related to this tag.
          </Text>
        )}

        {relations.allAppearances.length > 0 && (
          <Container maxW="6xl" pb={4}>
            <Heading pb={4} size="md">
              Appearances
            </Heading>
            <Stack align="stretch" spacing={4}>
              {relations.allAppearances.map((a) => (
                <AppearanceItem key={a.id as string} data={a} />
              ))}
            </Stack>
          </Container>
        )}

        {relations.allShowcases.length > 0 && (
          <Container maxW="4xl">
            <Heading pb={4} size="md">
              Projects
            </Heading>
            <SimpleGrid columns={[1, 1, 2]} gap={4} justifyContent="center">
              {relations.allShowcases.map((s) => (
                <ShowcaseItem key={s.id as string} data={s} />
              ))}
            </SimpleGrid>
          </Container>
        )}
      </Stack>
    </>
  );
};

export default TagPage;
