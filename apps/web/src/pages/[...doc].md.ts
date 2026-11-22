import type { APIRoute, GetStaticPaths } from "astro"

import { getSiteIndex } from "../lib/llms"
import type { SiteDocument } from "../lib/site-index"

/** A Markdown copy of each top-level page: `/resume.md`, `/work.md`, `/<post>.md`… */
export const getStaticPaths = (async () => {
  const { origin, documents } = await getSiteIndex()
  return documents
    .filter((doc) => doc.markdownUrl?.startsWith(`${origin}/`))
    .map((doc) => ({
      params: { doc: doc.markdownUrl!.slice(origin.length + 1).replace(/\.md$/, "") },
      props: { doc },
    }))
}) satisfies GetStaticPaths

export const GET: APIRoute<{ doc: SiteDocument }> = ({ props }) =>
  new Response(props.doc.markdown, { headers: { "Content-Type": "text/markdown; charset=utf-8" } })
