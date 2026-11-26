import { ogImage, ogType, type OgCard } from "@multiverse/ui/og"
import type { APIRoute, GetStaticPaths } from "astro"

import { getOgCards, ogFile } from "../../lib/og"

/*
 * /og/<page>.png and /og/<page>.jpg: the social card of each page, drawn in the build.
 * `layouts/base.astro` names it in the page's head. See `lib/og.ts`.
 */
export const getStaticPaths = (async () =>
  [...(await getOgCards())].map(([path, card]) => ({
    // "/og/blog.png" is the file; the route's parameter is "blog.png".
    params: { path: ogFile(path, card).slice("/og/".length) },
    props: { card },
  }))) satisfies GetStaticPaths

export const GET: APIRoute<{ card: OgCard }> = async ({ props }) =>
  new Response(new Uint8Array(await ogImage(props.card)), {
    headers: { "Content-Type": ogType(props.card) },
  })
