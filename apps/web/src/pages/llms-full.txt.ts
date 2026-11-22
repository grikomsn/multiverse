import type { APIRoute } from "astro"

import { llmsFullText } from "../lib/llms"

export const GET: APIRoute = async () =>
  new Response(await llmsFullText(), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
