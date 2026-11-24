import { FALLBACK_NAME } from "@multiverse/sanity/constants"

import { FEED_QUERY, SITE_SHELL_QUERY } from "./queries"
import { sanity } from "./sanity"
import { siteDescription, siteTitle } from "./site"

/**
 * One list of posts for every feed format: RSS 2.0 (/feed.xml, and /rss.xml as v9 served it),
 * Atom (/atom.xml) and JSON Feed (/feed.json). Version 9 published all three, so readers that
 * subscribed to any of them keep working.
 */
export async function getFeed(site?: URL) {
  const [{ site: settings, profile }, posts] = await Promise.all([
    sanity.fetch(SITE_SHELL_QUERY),
    sanity.fetch(FEED_QUERY),
  ])
  const base = site ?? new URL("https://nibras.co")
  return {
    title: siteTitle(profile),
    description: siteDescription({ site: settings, profile }),
    home: base.href,
    author: profile?.name ?? FALLBACK_NAME,
    url: (path: string) => new URL(path, base).href,
    items: posts.map((post) => ({
      title: post.title ?? "",
      url: new URL(`/${post.slug}`, base).href,
      published: post.publishedAt ? new Date(post.publishedAt) : null,
      updated: new Date(post._updatedAt ?? post.publishedAt ?? Date.now()),
      summary: post.excerpt,
      image: post.image,
    })),
  }
}

export const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (char) => `&#${char.charCodeAt(0)};`)

export async function rss(site?: URL) {
  const feed = await getFeed(site)
  const items = feed.items
    .map(
      (item) =>
        `<item><title>${escapeXml(item.title)}</title><link>${item.url}</link><guid>${item.url}</guid>${
          item.published ? `<pubDate>${item.published.toUTCString()}</pubDate>` : ""
        }${item.summary ? `<description>${escapeXml(item.summary)}</description>` : ""}</item>`,
    )
    .join("")
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(
    feed.title,
  )}</title><link>${feed.home}</link><description>${escapeXml(feed.description)}</description>${items}</channel></rss>`
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } })
}
