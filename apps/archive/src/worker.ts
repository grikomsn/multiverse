import { withRange } from "@multiverse/content/range"

/*
 * The archive is static files. The Worker runs for one of them, the social card of the index
 * (`run_worker_first` in wrangler.jsonc): Signal reads a link's picture in parts, and the
 * assets answer with the whole file, so the Worker cuts the part.
 */
interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
  fetch: async (request: Request, env: Env) => withRange(request, await env.ASSETS.fetch(request)),
}
