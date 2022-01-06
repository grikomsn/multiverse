// @ts-check
/// <reference types="@cloudflare/workers-types" />
/// <reference path="./env.d.ts" />

// @ts-ignore
/** @type {Cache} */ const cache = caches.default;

/* global AIRTABLE_BASE, AIRTABLE_KEY */

addEventListener("fetch", async (/** @type {FetchEvent} */ event) => {
  event.respondWith(tableflare(event));
});

async function tableflare(/** @type {FetchEvent} */ event) {
  const url = new URL(event.request.url);

  const cacheKey = new Request(url.toString(), event.request);
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  if (url.pathname == "/") {
    const response = Response.redirect("https://griko.id", 307);
    event.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  }

  const slug = url.pathname.split("/")[1];
  if (slug) {
    const query = new URLSearchParams({ filterByFormula: `AND(Slug="${slug}",Active)`, "fields[]": "URL" }).toString();
    const endpoint = `https://api.airtable.com/v0/${AIRTABLE_BASE}/Tableflare?${query}`;
    const result = await fetch(endpoint, { headers: { Authorization: `Bearer ${AIRTABLE_KEY}` } });

    const data = await result.json();
    const redirectUrl = data.records[0]?.fields.URL;

    if (redirectUrl) {
      const response = Response.redirect(redirectUrl, 307);
      if (url.searchParams.has("force")) {
        event.waitUntil(cache.delete(cacheKey));
      }
      event.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    }
  }

  return new Response(null, { status: 404 });
}
