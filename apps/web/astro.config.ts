import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { createSanityClient } from "@multiverse/content/client"
import { siteFont } from "@multiverse/ui/fonts"
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
  vite: {
    plugins: [tailwindcss()],
  },
})
