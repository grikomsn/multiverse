import * as React from "react";

import { loadPageFilenames } from "@/lib/custom-page.mjs";
import { getFrontmatter } from "@/lib/mdx/loader.mjs";
import { Frontmatter } from "@/lib/mdx/types";
import { createQueryParams } from "@/lib/opengraph";
import Prose from "@/ui/core/prose";
import { renderToString } from "@/ui/markdown/ssr";
import getAbsoluteUrl from "@/utils/api";

import { MDXContent } from "mdx/types";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { NextSeo } from "next-seo";

type PageProps = {
  frontmatter: Frontmatter;
  slug: string;
  __ssr: string;
  __opengraph?: string;
};

export default function CustomPage({ frontmatter, slug, __ssr, __opengraph }: PageProps) {
  const Content = dynamic(() => import(`@/content/pages/${slug}.mdx`), {
    loading: () => <div dangerouslySetInnerHTML={{ __html: __ssr }} suppressHydrationWarning />,
  });

  return (
    <>
      <Head>
        <link href={__opengraph} rel="preload" />
      </Head>

      <NextSeo
        description={frontmatter.description}
        openGraph={{
          images: __opengraph ? [{ url: __opengraph }] : [],
        }}
        title={frontmatter.title}
      />

      {(frontmatter.header == undefined || frontmatter.header) && (
        <Prose className="text-center">
          <h1>{frontmatter.title}</h1>
          <p className="lead">{frontmatter.description}</p>
          <hr />
        </Prose>
      )}

      <Prose>
        <article className="cursor-auto">
          <Content />
        </article>
      </Prose>
    </>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  const [Content, frontmatter] = await import(`@/content/pages/${slug}.mdx`).then(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (mod) => [mod.default as MDXContent, getFrontmatter(mod)] as const,
  );

  const imageQuery = createQueryParams({
    title: frontmatter.title,
    description: frontmatter.description,
    modifier: "normal",
    path: `/${slug}`,
  });

  return {
    props: {
      frontmatter,
      slug,
      __ssr: renderToString(<Content />),
      __opengraph: `${getAbsoluteUrl().origin}/api/opengraph/main?${imageQuery.toString()}`,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postPaths = await loadPageFilenames();
  return {
    paths: postPaths.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};
