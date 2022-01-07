import * as React from "react";

import { createQueryParams, MainOpengraphQuery, Type } from "@/lib/opengraph";
import getAbsoluteUrl from "@/utils/api";

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

  return <NextSeo openGraph={{ images: [{ url }] }} />;
}
