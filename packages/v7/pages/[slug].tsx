import * as React from "react";

import { postComponents } from "~components/markdown";
import { postPlugins } from "~components/markdown/plugins";
import { PageFieldsFragment } from "~generated/graphql";
import cms from "~lib/cms";

import {
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import format from "date-fns/format";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { FaChevronUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface CustomPageProps {
  page: PageFieldsFragment;
}

export const getStaticProps: GetStaticProps<CustomPageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const { page } = await cms().getPage({ slug });

  if (!page) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const paths: { params: { slug: string } }[] = [];

  function* fetchPageSlugs() {
    let step = 0;
    while (true) yield cms().pageStaticPaths({ skip: step++ * 100 });
  }

  for await (const { allPages } of fetchPageSlugs()) {
    if (allPages.length < 1) break;
    paths.push(
      ...allPages.map(({ slug }: { slug: string }) => ({ params: { slug } })),
    );
  }

  return {
    paths,
    fallback: false,
  };
};

const CustomPage: NextPage<CustomPageProps> = (props) => {
  const { page } = props;
  return (
    <>
      <Head>
        {page._seoMetaTags.map((t, key) =>
          React.createElement(t.tag, { key, ...t.attributes }, null),
        )}
      </Head>

      <Container maxW="6xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading size="2xl">{page.title}</Heading>
          <Text
            color="whiteAlpha.600"
            fontSize="lg"
            fontStyle="italic"
            maxW="2xl"
          >
            {page.subtitle}
          </Text>
          <Text>
            Last updated on{" "}
            {page._updatedAt
              ? format(new Date(page._updatedAt as string), "PPPP")
              : "UNPUBLISHED"}
          </Text>
        </Stack>
      </Container>

      <Divider />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack lineHeight="tall" spacing={4}>
          <ReactMarkdown
            children={page.content as string}
            components={postComponents}
            remarkPlugins={postPlugins}
          />
          <Center pt={8}>
            <Button
              color="whiteAlpha.700"
              leftIcon={<Icon as={FaChevronUp} />}
              onClick={() => window.scrollTo({ behavior: "smooth", top: 0 })}
              size="sm"
            >
              Back to top
            </Button>
          </Center>
        </Stack>
      </Container>
    </>
  );
};

export default CustomPage;
