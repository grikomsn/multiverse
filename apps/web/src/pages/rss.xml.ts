import type { APIRoute } from "astro"

import { rss } from "../lib/feed"

/** Version 9's RSS address; the same feed as /feed.xml. */
export const GET: APIRoute = ({ site }) => rss(site)
