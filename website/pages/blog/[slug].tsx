import type { GetBlogPostQuery } from "__generated__/graphql";
import { useGetBlogPostQuery, useGetBlogPostSlugsQuery } from "__generated__/graphql";
import clsx from "clsx";
import metadataJson from "config/metadata";
import { defaultMdxOptions } from "lib/markdown";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import type { ParsedUrlQuery } from "querystring";
import type { SocialButtonsProps } from "ui/blog/social-buttons";
import { CoverImage } from "ui/page/cover-image";
import { PageHeader } from "ui/page/header";
import { DURATION_FIVE_MINUTES } from "utils/constants";
import { parseIsoToMdy } from "utils/date";

const SocialButtons = dynamic<SocialButtonsProps>(
  () => import("ui/blog/social-buttons").then((mod) => mod.SocialButtons),
  { ssr: false },
);

export interface BlogPostPageProps {
  query: GetBlogPostQuery;
  compiledContent: MDXRemoteSerializeResult;
}

export interface BlogPostPageParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<BlogPostPageProps, BlogPostPageParams> = async (ctx) => {
  const query = await useGetBlogPostQuery.fetcher({ slug: ctx.params!.slug })();
  if (!query.post) {
    return {
      notFound: true,
      revalidate: DURATION_FIVE_MINUTES,
    };
  }
  const compiledContent = await serialize(query.post.content, {
    mdxOptions: defaultMdxOptions,
  });
  return {
    props: {
      query,
      compiledContent,
    },
    revalidate: DURATION_FIVE_MINUTES,
  };
};

export const getStaticPaths: GetStaticPaths<BlogPostPageParams> = async () => {
  const query = await useGetBlogPostSlugsQuery.fetcher()();
  return {
    paths: query.allPosts.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export default function BlogPostPage({ query, compiledContent }: BlogPostPageProps) {
  return (
    <section className="space-y-8">
      <NextSeo
        description={query.post.description}
        openGraph={{
          type: "article",
          article: {
            publishedTime: query.post.createdAt,
            authors: [metadataJson.url],
          },
          images: query.post.cover ? [{ url: query.post.cover.url }] : [],
        }}
        title={query.post.title}
      />
      <ArticleJsonLd
        authorName={metadataJson.name}
        dateModified={query.post.createdAt}
        datePublished={query.post.createdAt}
        description={query.post.description}
        images={query.post.cover ? [query.post.cover.url] : []}
        title={query.post.title}
        url={`${metadataJson.url}/blog/${query.post.slug}`}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          { position: 1, name: "Writings", item: `${metadataJson.url}/blog` },
          { position: 2, name: query.post.title, item: `${metadataJson.url}/blog/${query.post.slug}` },
        ]}
      />
      {query.post.cover && <CoverImage src={query.post.cover.url} />}
      <PageHeader
        className={clsx({ "pt-[5rem] md:pt-[10rem]": !query.post.cover })}
        description={query.post.description}
        title={query.post.title}
      />
      <div className="flex justify-between items-center">
        <span className="text-xs">Posted on {parseIsoToMdy(query.post.createdAt)}</span>
        <SocialButtons className="animate-fade-in" post={query.post} />
      </div>
      <article className="cursor-auto prose prose-invert">
        <hr />
        <MDXRemote {...compiledContent} />
      </article>
    </section>
  );
}
