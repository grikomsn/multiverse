import type { GetCustomPageQuery } from "__generated__/graphql";
import { useGetCustomPageQuery, useGetCustomPageSlugsQuery } from "__generated__/graphql";
import clsx from "clsx";
import { getMdxOptions } from "lib/markdown";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { NextSeo } from "next-seo";
import type { ParsedUrlQuery } from "querystring";
import { QueryImage } from "ui/core/query-image";
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
    mdxOptions: getMdxOptions(),
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
    <section className="space-y-16">
      <NextSeo description={query.page.description} title={query.page.title} />
      {query.page.cover && <QueryImage {...query.page.cover} alt="cover" />}
      {query.page.showHeader && (
        <>
          <PageHeader
            className={clsx({ "pt-[10vh] md:pt-[20vh]": !query.page.cover })}
            description={query.page.description}
            title={query.page.title}
          />
          <hr className="flex-grow border-neutral-500/50" />
        </>
      )}
      <article className="prose prose-invert">
        <MDXRemote {...compiledContent} />
      </article>
    </section>
  );
}
