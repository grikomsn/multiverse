import type { GetCustomPageQuery } from "__generated__/graphql";
import { useGetCustomPageQuery, useGetCustomPageSlugsQuery } from "__generated__/graphql";
import clsx from "clsx";
import { defaultMdxOptions } from "lib/markdown";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import type { ParsedUrlQuery } from "querystring";
import { CoverImage } from "ui/page/cover-image";
import { PageHeader } from "ui/page/header";

export interface CustomPageProps {
  query: GetCustomPageQuery;
  compiledContent: MDXRemoteSerializeResult;
}

export interface CustomPageParams extends ParsedUrlQuery {
  slug: string;
}

export const getStaticProps: GetStaticProps<CustomPageProps, CustomPageParams> = async (ctx) => {
  const query = await useGetCustomPageQuery.fetcher({ slug: ctx.params!.slug })();
  if (!query.page) {
    return {
      notFound: true,
    };
  }
  const compiledContent = await serialize(query.page.content, {
    mdxOptions: defaultMdxOptions,
  });
  return {
    props: {
      query,
      compiledContent,
    },
  };
};

export const getStaticPaths: GetStaticPaths<CustomPageParams> = async () => {
  const query = await useGetCustomPageSlugsQuery.fetcher()();
  return {
    paths: query.allPages.map(({ slug }) => ({ params: { slug } })),
    fallback: "blocking",
  };
};

export default function CustomPage({ query, compiledContent }: CustomPageProps) {
  return (
    <section className="space-y-8">
      <NextSeo description={query.page.description} title={query.page.title} />
      {query.page.cover && <CoverImage src={query.page.cover.url} />}
      {query.page.showHeader && (
        <PageHeader
          className={clsx({ "pt-[5rem] md:pt-[10rem]": !query.page.cover })}
          description={query.page.description}
          title={query.page.title}
        />
      )}
      <article className="prose prose-invert">
        <MDXRemote {...compiledContent} />
      </article>
    </section>
  );
}
