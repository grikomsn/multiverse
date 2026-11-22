import type { SiteIndex } from "../lib/site-index"

/*
 * /llms.json, read from the static assets of this deploy. The MCP server and the PDF metadata
 * use it, so they say what the pages say. Cached per isolate; a new deploy is a new isolate.
 */
let cached: Promise<SiteIndex> | undefined

export function loadIndex(env: Env, request: Request): Promise<SiteIndex> {
  cached ??= env.ASSETS.fetch(new URL("/llms.json", request.url)).then((response) => {
    if (!response.ok) throw new Error(`/llms.json returned ${response.status}`)
    return response.json<SiteIndex>()
  })
  cached.catch(() => (cached = undefined))
  return cached
}
