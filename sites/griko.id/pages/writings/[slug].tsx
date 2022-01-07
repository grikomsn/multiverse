import * as React from "react";

import meta from "@/config/meta.json";
import { Frontmatter, FrontmatterEntry } from "@/lib/mdx/types";
import { RegisterMediumZoom } from "@/lib/medium-zoom";
import { createQueryParams } from "@/lib/opengraph";
import { createTwitterIntent } from "@/lib/twitter";
import { loadPostFilenames, loadPostFrontmatterEntries } from "@/lib/writing.mjs";
import Anchor, { A } from "@/ui/core/anchor";
import Prose from "@/ui/core/prose";
import { renderToString } from "@/ui/markdown/ssr";
import getAbsoluteUrl from "@/utils/api";
import { copy } from "@/utils/clipboard";
import { NavigatorWrap } from "@/utils/navigator";

import format from "date-fns/format";
import { ArrowLeft, ArrowRight, Link, Share, Twitter } from "lucide-react";
import { MDXContent } from "mdx/types";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { BlogJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";

type PostPageProps = {
  frontmatter: Frontmatter;
  slug: string;
  next: null | FrontmatterEntry;
  prev: null | FrontmatterEntry;
  __ssr: string;
  __opengraph?: string;
};

export default function PostPage({ frontmatter, slug, prev, next, __ssr, __opengraph }: PostPageProps) {
  const Content = dynamic(() => import(`@/content/posts/${slug}.mdx`), {
    loading: () => <div dangerouslySetInnerHTML={{ __html: __ssr }} suppressHydrationWarning />,
  });

  return (
    <>
      <RegisterMediumZoom />

      <Head>
        <link href={__opengraph} rel="preload" />
      </Head>

      <NextSeo
        description={frontmatter.description}
        openGraph={{
          type: "article",
          article: {
            publishedTime: frontmatter.date.toISOString(),
            authors: [meta.url],
          },
          images: __opengraph ? [{ url: __opengraph }] : [],
        }}
        title={frontmatter.title}
      />

      <BlogJsonLd
        authorName={meta.name}
        dateModified={frontmatter.date.toISOString()}
        datePublished={frontmatter.date.toISOString()}
        description={frontmatter.description}
        images={__opengraph ? [__opengraph] : []}
        title={frontmatter.title}
        url={`${meta.url}/writings/${slug}`}
      />

      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Writings",
            item: `${meta.url}/writings`,
          },
          {
            position: 2,
            name: frontmatter.title,
            item: `${meta.url}/writings/${slug}`,
          },
        ]}
      />

      <Prose className="text-center">
        <h1>{frontmatter.title}</h1>
        <p className="lead">{frontmatter.description}</p>
        <p className="text-sm text-neutral-500">
          Posted on {format(frontmatter.date, "PPP")}
          {frontmatter.lastUpdate ? <> / Last updated on {format(frontmatter.lastUpdate, "PPP")}</> : null}
        </p>
        <br />
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm not-prose">
          <A
            className="flex items-center space-x-2 hover:text-primary transition"
            href={createTwitterIntent({
              text: `${frontmatter.title}`,
              via: meta.twitter.username.replace("@", ""),
              url: `${meta.url}/writings/${slug}`,
            })}
          >
            <Twitter size={18} /> <span>Share on Twitter</span>
          </A>
          <button
            className="flex items-center space-x-2 transition hover:text-neutral-500"
            onClick={() => copy(document.URL)}
          >
            <Link size={18} /> <span>Copy link</span>
          </button>
          <NavigatorWrap has="share">
            {({ navigator }) => (
              <button
                className="flex items-center space-x-2 transition hover:text-teal-500"
                onClick={() => navigator.share({ title: frontmatter.title, url: document.URL }).catch(console.error)}
              >
                <Share size={18} /> <span>Share post</span>
              </button>
            )}
          </NavigatorWrap>
        </div>
        <hr />
      </Prose>

      <Prose>
        <article className="cursor-auto">
          <Content />
        </article>

        <div className="h-16" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start not-prose">
          {next && (
            <Anchor
              className="group flex flex-col items-center sm:items-start p-4 sm:-m-4 space-y-1 max-w-sm text-center sm:text-left bg-opacity-0 hover:bg-opacity-10 rounded hover:shadow-lg transition sm:hover:-translate-y-1 bg-neutral-500"
              href={`/writings/${next[0]}`}
            >
              <span className="flex justify-start items-center space-x-1 text-sm opacity-50">
                <ArrowLeft size={12} /> <span>Latest post</span>
              </span>
              <span className="font-bold tracking-tighter leading-normal line-clamp-2">{next[1].title}</span>
            </Anchor>
          )}
          <div className="flex-grow" />
          {prev && (
            <Anchor
              className="group flex flex-col items-center sm:items-end p-4 sm:-m-4 space-y-1 max-w-sm text-center sm:text-right bg-opacity-0 hover:bg-opacity-10 rounded hover:shadow-lg transition sm:hover:-translate-y-1 bg-neutral-500"
              href={`/writings/${prev[0]}`}
            >
              <span className="flex justify-end items-center space-x-1 text-sm opacity-50">
                <span>Previous post</span> <ArrowRight size={12} />
              </span>
              <span className="font-bold tracking-tighter leading-normal line-clamp-2">{prev[1].title}</span>
            </Anchor>
          )}
        </div>
      </Prose>
    </>
  );
}

export const getStaticProps: GetStaticProps<PostPageProps> = async ({ params }) => {
  const slug = params?.slug as string;

  const frontmatters = await loadPostFrontmatterEntries();
  const postIndex = frontmatters.findIndex(([path]) => path == slug);
  const [, frontmatter] = frontmatters[postIndex];

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const Content = await import(`@/content/posts/${slug}.mdx`).then((mod) => mod.default as MDXContent);

  const next = postIndex == 0 ? null : frontmatters[postIndex - 1];
  const prev = postIndex == frontmatters.length - 1 ? null : frontmatters[postIndex + 1];

  const imageQuery = createQueryParams({
    title: frontmatter.title,
    description: frontmatter.description,
    modifier: "normal",
    path: `/writings/${slug}`,
  });

  return {
    props: {
      frontmatter,
      slug,
      next,
      prev,
      __ssr: renderToString(<Content />),
      __opengraph: `${getAbsoluteUrl().origin}/api/opengraph/main?${imageQuery.toString()}`,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const postPaths = await loadPostFilenames();
  return {
    paths: postPaths.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};
