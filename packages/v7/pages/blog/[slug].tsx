import * as React from "react";

import DatoImage from "~components/dato-image";
import { postComponents } from "~components/markdown";
import { postPlugins } from "~components/markdown/plugins";
import { PostFieldsFragment } from "~generated/graphql";
import cms from "~lib/cms";

import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Heading,
  Icon,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { NextPage } from "@grikomsn/shared/types/next";
import format from "date-fns/format";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import NextLink from "next/link";
import {
  renderMetaTags,
  ResponsiveImageType,
  SeoMetaTagType,
} from "react-datocms";
import { FaChevronUp } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

interface PostPageProps {
  post: PostFieldsFragment;
}

export const getStaticProps: GetStaticProps<PostPageProps> = async (ctx) => {
  const slug = ctx.params?.slug as string;

  const { post } = await cms().getPost({ slug });

  if (!post) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      post,
    },
  };
};

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const paths: { params: { slug: string } }[] = [];

  function* fetchPostSlugs() {
    let step = 0;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) yield cms().postStaticPaths({ skip: step++ * 100 });
  }

  for await (const { allPosts } of fetchPostSlugs()) {
    if (allPosts.length < 1) break;
    paths.push(
      ...allPosts.map(({ slug }: { slug: string }) => ({ params: { slug } })),
    );
  }

  return {
    paths,
    fallback: false,
  };
};

const PostPage: NextPage<PostPageProps> = (props) => {
  const { post } = props;

  return (
    <>
      <Head>{renderMetaTags(post._seoMetaTags as SeoMetaTagType[])}</Head>

      {post.cover && (
        <Box bgColor="whiteAlpha.800">
          <DatoImage data={post.cover.responsiveImage as ResponsiveImageType} />
        </Box>
      )}

      <Container maxW="6xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading size="2xl">{post.title}</Heading>
          <Text
            color="whiteAlpha.600"
            fontSize="lg"
            fontStyle="italic"
            maxW="2xl"
          >
            {post.subtitle}
          </Text>
          <Text>
            Published on{" "}
            {post._firstPublishedAt
              ? format(new Date(post._firstPublishedAt as string), "PPPP")
              : "UNPUBLISHED"}
          </Text>
          <Wrap pt={4}>
            {post.tags.map((t) => (
              <WrapItem key={t.slug}>
                <NextLink href={`/tag/${t.slug}`} passHref>
                  <Tag as="a" size="sm" variant="subtle">
                    {t.title}
                  </Tag>
                </NextLink>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>
      </Container>

      <Divider maxW="4xl" mx="auto" />

      <Container maxW="4xl" p={[4, 8]}>
        <Stack lineHeight="tall" spacing={4}>
          <ReactMarkdown
            children={post.content as string}
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

export default PostPage;
