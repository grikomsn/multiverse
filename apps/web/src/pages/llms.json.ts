import type { APIRoute } from "astro"

import { getSiteIndex } from "../lib/llms"

/**
 * Every document as JSON, for the MCP server in src/worker/mcp.ts and for the text search of
 * the command bar. Public, like the pages. The archive's bar reads it from a different
 * address: the header here is for `astro dev`, and `public/_headers` sets it on the live site.
 */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getSiteIndex()), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  })
