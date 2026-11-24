import { getCard } from "@multiverse/content/card"
import type { APIRoute } from "astro"

import { sanity } from "../lib/sanity"

/**
 * The facts that `npx grikomsn` shows (`apps/cli`). A running CLI reads this file, so its card
 * has today's roles and posts. Public, like the pages.
 */
export const GET: APIRoute = async ({ site }) =>
  new Response(JSON.stringify(await getCard(sanity, site?.origin)), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
