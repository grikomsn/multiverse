import * as React from "react";

import { createQueryParams, MainOpengraphQuery, Type } from "@/lib/opengraph";
import getAbsoluteUrl from "@/utils/api";

import Head from "next/head";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

export type OpenGraphProps = {
  type?: Type;
  query?: MainOpengraphQuery;
};

export default function OpenGraph({ type = "main", query = {} }: OpenGraphProps) {
  const router = useRouter();

  const { origin } = getAbsoluteUrl();
  const params = createQueryParams({
    path: router.asPath,
    ...query,
  });
  const url = `${origin}/api/opengraph/${type}?${params.toString()}`;

  return (
    <>
      <Head>
        <link as="image" href={url} rel="preload" />
      </Head>
      <NextSeo openGraph={{ images: [{ url }] }} />
    </>
  );
}
