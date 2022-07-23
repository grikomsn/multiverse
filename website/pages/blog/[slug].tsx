import type { GetBlogPostQuery } from "__generated__/graphql";
import { useGetBlogPostQuery, useGetBlogPostSlugsQuery } from "__generated__/graphql";
import clsx from "clsx";
import metadataJson from "config/metadata";
import { getMdxOptions } from "lib/markdown";
import type { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import type { ParsedUrlQuery } from "querystring";
import type { SocialButtonsProps } from "ui/blog/social-buttons";
import { QueryImage } from "ui/core/query-image";
import { PageHeader } from "ui/page/header";
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
    };
  }
  const compiledContent = await serialize(query.post.content, {
    mdxOptions: getMdxOptions({ toc: true }),
  });
  return {
    props: {
      query,
      compiledContent,
    },
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
    <section className="space-y-16">
      {query.post.redirect && (
        <Head>
          <meta content={`0; url=${query.post.redirect}`} httpEquiv="refresh" />
        </Head>
      )}
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
      <div className="space-y-8">
        {query.post.cover && <QueryImage alt="cover" {...query.post.cover} />}
        <PageHeader
          className={clsx({ "pt-[10vh] md:pt-[20vh]": !query.post.cover })}
          description={query.post.description}
          title={query.post.title}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs">Posted on {parseIsoToMdy(query.post.createdAt)}</span>
          <SocialButtons className="animate-fade-in" post={query.post} />
        </div>
      </div>
      <hr className="flex-grow border-neutral-500/50" />
      <article className="prose prose-invert relative cursor-auto">
        <MDXRemote {...compiledContent} />
      </article>
    </section>
  );
}
