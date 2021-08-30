import * as React from "react";

import DatoImage from "~components/dato-image";
import { postComponents } from "~components/markdown";
import { postPlugins } from "~components/markdown/plugins";
import siteConfig from "~config/site";
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
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import { ResponsiveImageType } from "react-datocms";
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
    while (true) yield cms().postStaticPaths({ skip: step++ * 100 });
  }

  for await (const { allPosts } of fetchPostSlugs()) {
    if (allPosts.length < 1) break;
    paths.push(...allPosts.map(({ slug }: { slug: string }) => ({ params: { slug } })));
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
      <Head>{post._seoMetaTags.map((t, key) => React.createElement(t.tag, { key, ...t.attributes }, null))}</Head>

      <NextSeo
        description={post.subtitle as string}
        openGraph={{
          type: "article",
          article: {
            publishedTime: post._publishedAt as string,
            modifiedTime: post._updatedAt as string,
            authors: [siteConfig.siteUrl],
            tags: post.tags.map((t) => t.title as string),
          },
          images: post.cover
            ? [
                {
                  url: post.cover?.responsiveImage?.src as string,
                  width: post.cover?.responsiveImage?.width as number,
                  height: post.cover?.responsiveImage?.height as number,
                  alt: post.cover?.responsiveImage?.alt as string,
                },
              ]
            : undefined,
        }}
        title={post.title as string}
      />

      <BlogJsonLd
        authorName="Griko Nibras"
        dateModified={post._updatedAt as string}
        datePublished={post._publishedAt as string}
        description={post.subtitle as string}
        images={post.cover ? [post.cover?.responsiveImage?.src as string] : []}
        title={post.title as string}
        url={`${siteConfig.siteUrl}/blog/${post.slug as string}`}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Blog Posts",
            item: `${siteConfig.siteUrl}/blog`,
          },
          {
            position: 2,
            name: post.title as string,
            item: `${siteConfig.siteUrl}/blog/${post.slug as string}`,
          },
        ]}
      />

      {post.cover && (
        <Box bgColor="whiteAlpha.800" maxH="50vh" overflow="hidden">
          <DatoImage data={post.cover.responsiveImage as ResponsiveImageType} />
        </Box>
      )}

      <Container maxW="6xl" p={[4, 8]}>
        <Stack align="center" spacing={4} textAlign="center">
          <Heading size="2xl">{post.title}</Heading>
          <Text color="whiteAlpha.600" fontSize="lg" fontStyle="italic" maxW="2xl">
            {post.subtitle}
          </Text>
          <Text>
            Published on {post._publishedAt ? format(new Date(post._publishedAt as string), "PPPP") : "UNPUBLISHED"}
          </Text>
          <Wrap justify="center" pt={4}>
            {post.tags.map((t) => (
              <WrapItem key={t.slug}>
                <NextLink href={`/tag/${t.slug as string}`} passHref>
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
          <ReactMarkdown children={post.content as string} components={postComponents} remarkPlugins={postPlugins} />
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
