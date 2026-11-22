import type { APIRoute } from "astro"

import { getFeed } from "../lib/feed"

/** JSON Feed 1.1 (jsonfeed.org). */
export const GET: APIRoute = async ({ site }) => {
  const feed = await getFeed(site)
  const json = {
    version: "https://jsonfeed.org/version/1.1",
    title: feed.title,
    description: feed.description,
    home_page_url: feed.home,
    feed_url: feed.url("/feed.json"),
    authors: [{ name: feed.author, url: feed.home }],
    language: "en",
    items: feed.items.map((item) => ({
      id: item.url,
      url: item.url,
      title: item.title,
      ...(item.summary
        ? { summary: item.summary, content_text: item.summary }
        : { content_text: "" }),
      ...(item.image ? { image: item.image } : {}),
      ...(item.published ? { date_published: item.published.toISOString() } : {}),
      date_modified: item.updated.toISOString(),
    })),
  }
  return new Response(JSON.stringify(json), {
    headers: { "Content-Type": "application/feed+json; charset=utf-8" },
  })
}
