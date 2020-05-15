import { gql } from "@/cms";
import { Card, Link } from "@/components";
import { useColorMode, useSiteConfig } from "@/hooks";
import { BlogPost } from "@/types";
import { formatDate } from "@/utils";
import { blogPostRenderer } from "@/utils/renderers";
import { Box, Divider, Heading, Stack, Text } from "@chakra-ui/core";
import { GetStaticPaths, GetStaticProps } from "next";
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import { stringify } from "querystring";
import * as React from "react";
import Markdown from "react-markdown";

type BlogPostPageProps = {
  blogPost: BlogPost;
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { blogPost } = await gql`
    {
      blogPost(filter: { slug: { eq: "${`${params.slug}`}" } }) {
        cover {
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
        slug
        subtitle
        postedAt
        tags
        markdown
      }
    }
  `;

  return {
    props: {
      blogPost,
    },
    unstable_revalidate: 86400,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { blogPosts }: { blogPosts: BlogPost[] } = await gql`
    {
      blogPosts: allBlogPosts(orderBy: postedAt_DESC) {
        slug
      }
    }
  `;

  return {
    paths: blogPosts.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  };
};

const BlogPostPage: React.FC<BlogPostPageProps> = ({ blogPost }) => {
  const siteConfig = useSiteConfig();
  const { isDarkMode } = useColorMode();

  const discussUrl = `https://twitter.com/search?${stringify({
    q: `${siteConfig.url}/blog/${blogPost.slug}`,
  })}`;

  const shareUrl = `https://twitter.com/share?${stringify({
    url: `${siteConfig.url}/blog/${blogPost.slug}`,
    text: `${blogPost.title}`,
    via: siteConfig.twitterUsername.split("@").pop(),
  })}`;

  const postedAtIso = new Date(blogPost.postedAt).toISOString();

  return (
    <Box>
      <NextSeo
        title={blogPost.title}
        description={blogPost.subtitle}
        openGraph={{
          title: blogPost.title,
          description: blogPost.subtitle,
          type: "article",
          article: {
            publishedTime: postedAtIso,
            modifiedTime: postedAtIso,
            authors: [siteConfig.url],
            tags: blogPost.tags.split(",").map((t) => t.trim()),
          },
          images: blogPost.cover
            ? [
                {
                  url: blogPost.cover.url,
                  width: blogPost.cover.width,
                  height: blogPost.cover.height,
                  alt: blogPost.cover.alt,
                },
              ]
            : [],
        }}
      />

      <BlogJsonLd
        url={`${siteConfig.url}/blog/${blogPost.slug}`}
        title={blogPost.title}
        images={blogPost.cover ? [blogPost.cover.url] : []}
        datePublished={postedAtIso}
        dateModified={postedAtIso}
        authorName={siteConfig.title}
        description={blogPost.subtitle}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Latest Blog Posts",
            item: `${siteConfig.url}/blog`,
          },
          {
            position: 2,
            name: blogPost.title,
            item: `${siteConfig.url}/blog/${blogPost.slug}`,
          },
        ]}
      />

      <Card headerResponsiveImage={blogPost.cover?.responsiveImage}>
        <Stack spacing={4} textAlign="center">
          <Heading as="h1">{blogPost.title}</Heading>

          <Text fontSize="lg">{blogPost.subtitle}</Text>

          <Text color={isDarkMode ? "gray.400" : "gray.500"}>
            Posted at {formatDate(blogPost.postedAt)}
          </Text>
        </Stack>

        <Divider />

        <Box pb={16}>
          <Markdown
            source={blogPost.markdown}
            escapeHtml={false}
            renderers={blogPostRenderer(isDarkMode)}
          />
        </Box>

        <Stack alignItems="center" isInline>
          <Divider flexGrow={1} />
          <Stack fontSize="sm" isInline>
            <Link href={discussUrl}>Discuss on Twitter</Link>
            <Text>·</Text>
            <Link href={shareUrl}>Share on Twitter</Link>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default BlogPostPage;
