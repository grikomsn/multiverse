import type { APIRoute } from "astro"

import { llmsText } from "../lib/llms"

export const GET: APIRoute = async () =>
  new Response(await llmsText(), { headers: { "Content-Type": "text/plain; charset=utf-8" } })
