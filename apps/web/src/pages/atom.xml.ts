import type { APIRoute } from "astro"

import { escapeXml, getFeed } from "../lib/feed"

export const GET: APIRoute = async ({ site }) => {
  const feed = await getFeed(site)
  const updated = feed.items[0]?.updated ?? new Date()
  const entries = feed.items
    .map(
      (item) =>
        `<entry><title>${escapeXml(item.title)}</title><link href="${item.url}"/><id>${item.url}</id>${
          item.published ? `<published>${item.published.toISOString()}</published>` : ""
        }<updated>${item.updated.toISOString()}</updated>${
          item.summary ? `<summary>${escapeXml(item.summary)}</summary>` : ""
        }</entry>`,
    )
    .join("")
  const xml = `<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><title>${escapeXml(
    feed.title,
  )}</title><subtitle>${escapeXml(feed.description)}</subtitle><link href="${feed.home}"/><link rel="self" href="${feed.url(
    "/atom.xml",
  )}"/><id>${feed.home}</id><updated>${updated.toISOString()}</updated><author><name>${escapeXml(
    feed.author,
  )}</name></author>${entries}</feed>`
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } })
}
