import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { createSanityClient } from "@multiverse/content/client"
import { REPOSITORY_URL } from "@multiverse/sanity/constants"
import { siteFont } from "@multiverse/ui/fonts"
import { griFile } from "@multiverse/ui/gri"
import { defineConfig } from "astro/config"

import { UNLISTED_SLUGS_QUERY } from "./src/lib/queries"

// Unlisted pages: noindex, and kept out of the sitemap.
const UNLISTED = ["/404/", "/resume/ats/", "/resume/og/"]

// Posts and pages set to "Unlisted" in Studio carry noindex too.
const unlistedSlugs = await createSanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
}).fetch(UNLISTED_SLUGS_QUERY)
for (const slug of unlistedSlugs) if (slug) UNLISTED.push(`/${slug}/`)

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://nibras.co",
  output: "static",
  devToolbar: { enabled: false },
  session: false,
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      filter: (page) =>
        !UNLISTED.some((path) => page.endsWith(path)) && !page.includes("/resume/cover-letters/"),
    }),
  ],
  fonts: [siteFont()],
  // The CSS goes inside each page. A page is about 9 KB larger (Brotli), and the first paint does
  // not wait for a style sheet: 0.78 s where it was 0.96 to 1.11 s (mobile Lighthouse, slow 4G).
  build: { inlineStylesheets: "always" },
  vite: {
    plugins: [tailwindcss()],
    define: {
      // The greeting in the browser console (`layouts/base.astro`): the mascot's wink as a data
      // URL, because the console draws a picture only from one. It is a constant in the script
      // that every page shares, so a page's HTML does not carry it.
      __CONSOLE_HELLO__: JSON.stringify({
        face: `data:image/svg+xml,${encodeURIComponent(griFile("wink", { marks: false }))}`,
        text: `Hi. You opened the console.\nThe code of this site is public: ${REPOSITORY_URL}`,
      }),
    },
  },
})
