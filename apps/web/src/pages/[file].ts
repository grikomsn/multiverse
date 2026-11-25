import type { APIRoute, GetStaticPaths } from "astro"

import { REDIRECTS_QUERY } from "../lib/queries"
import { sanity } from "../lib/sanity"

/** Emits Workers static-assets `_redirects` (Astro skips `_`-prefixed page files). */
export const getStaticPaths = (() => [{ params: { file: "_redirects" } }]) satisfies GetStaticPaths

const ARCHIVE = "https://archive.nibras.co"

// Old paths that no post or page owns: the Bear Blog and Ghost feeds, the old blog and work
// indexes, the Bear Blog /projects alias, and pages from earlier versions that now live only in
// the archive. The rules here replace the Cloudflare Bulk Redirect list "personal_website_hotfix".
const STATIC_RULES = [
  "/projects /resume 301",
  "/feed /feed.xml 301",
  "/rss /feed.xml 301",
  "/atom /atom.xml 301",
  "/sitemap.xml /sitemap-index.xml 301",
  "/articles /blog 301",
  "/posts /blog 301",
  "/writings /blog 301",
  "/works /work 301",
  // The mascot's page has the mascot's name.
  "/mascot /gri 301",
  // The CMS of the day: Keystatic, then the Bear Blog dashboard, now Sanity Studio.
  "/keystatic https://nibras.sanity.studio 302",
  `/author/griko ${ARCHIVE}/2022b/author/griko 301`,
  `/talk ${ARCHIVE}/2022b/talk 301`,
  `/empty ${ARCHIVE}/2023a/empty 301`,
]

// Cloudflare wants dynamic rules after static ones. Posts from the sites that kept them
// under /articles, and the Ghost tag pages.
const DYNAMIC_RULES = [
  "/articles/* /:splat 301",
  `/tag/:tag/ ${ARCHIVE}/2022b/tag/:tag 301`,
  `/tag/:tag ${ARCHIVE}/2022b/tag/:tag 301`,
]

/** `/x` and `/x/` are separate rules, and old sites linked both forms. */
const withSlashForm = (rule: string) => {
  const [source, ...rest] = rule.split(" ")
  return source && source !== "/" && !source.endsWith("/")
    ? [rule, [`${source}/`, ...rest].join(" ")]
    : [rule]
}

export const GET: APIRoute = async () => {
  const { aliases, scheduleUrl } = await sanity.fetch(REDIRECTS_QUERY)
  // Each post and page lists its earlier addresses, so an alias follows a later slug change.
  const moved = aliases.flatMap((route) =>
    (route.aliases ?? []).map((alias) => `/${alias} /${route.slug} 301`),
  )
  // Bear Blog had a /schedule page. The calendar's address lives on Profile and can change.
  const schedule = scheduleUrl ? [`/schedule ${scheduleUrl} 302`] : []
  const lines = [...STATIC_RULES, ...moved, ...schedule]
    .flatMap(withSlashForm)
    .concat(DYNAMIC_RULES)
  return new Response(lines.join("\n") + "\n")
}
