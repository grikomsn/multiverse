import type { APIRoute } from "astro"

import { getSiteIndex } from "../lib/llms"

/** Every document as JSON, for the MCP server in src/worker/mcp.ts. Public, like the pages. */
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(await getSiteIndex()), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  })
