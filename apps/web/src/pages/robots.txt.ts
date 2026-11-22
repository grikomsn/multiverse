import type { APIRoute } from "astro"

// Unlisted pages (cover letters, the ATS resume, unlisted posts and pages) are not blocked here.
// They carry `noindex`, and crawlers must be able to fetch a page to see that.
export const GET: APIRoute = ({ site }) =>
  new Response(
    ["User-agent: *", "Allow: /", "", `Sitemap: ${new URL("/sitemap-index.xml", site)}`, ""].join(
      "\n",
    ),
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  )
