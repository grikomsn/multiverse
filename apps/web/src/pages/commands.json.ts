import type { APIRoute } from "astro"

import { getCommandIndex } from "../lib/commands"

/**
 * What the command bar lists. The archive reads it from a different address, so any site may
 * read it: the header here is for `astro dev`, and `public/_headers` sets it on the live site.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getCommandIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
