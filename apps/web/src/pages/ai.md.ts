import type { APIRoute } from "astro"

import { aiMarkdown, getAiPage } from "../lib/ai"

/** /ai.md: the AI tools page as Markdown, as every other top-level page has. */
export const GET: APIRoute = async () =>
  new Response(aiMarkdown(await getAiPage()) + "\n", {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
