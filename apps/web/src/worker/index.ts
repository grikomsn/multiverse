import { mcpHandler } from "./mcp"
import { handleResumePdf } from "./pdf"

/*
 * Static assets are served without the Worker, except the paths in `run_worker_first`
 * (wrangler.jsonc): `/`, `/resume`, `/mcp` and `/resume.pdf`.
 */
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)
    const path = url.pathname.replace(/\/$/, "") || "/"

    if (path === "/mcp" || path.startsWith("/mcp/")) return mcpHandler(request, env, ctx)
    if (path === "/resume.pdf") return handleResumePdf(request, env)

    // Clients that ask for Markdown get it, and so does curl. Link-preview bots send no
    // `text/html` either, so they are matched by name, not by what they leave out.
    const markdown = MARKDOWN[path]
    if (markdown && (request.method === "GET" || request.method === "HEAD")) {
      if (acceptsMarkdown(request) || (!acceptsHtml(request) && isCommandLine(request))) {
        const asset = await env.ASSETS.fetch(new URL(markdown.path, url))
        const headers = new Headers(asset.headers)
        headers.set("Content-Type", `${markdown.type}; charset=utf-8`)
        return withVaryAccept(new Response(asset.body, { status: asset.status, headers }))
      }
      return withVaryAccept(await env.ASSETS.fetch(request))
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>

/** Pages with a Markdown answer for `Accept: text/markdown` and non-browser clients. */
const MARKDOWN: Record<string, { path: string; type: string }> = {
  "/": { path: "/llms.txt", type: "text/plain" },
  "/resume": { path: "/resume.md", type: "text/markdown" },
}

const MARKDOWN_TYPES = ["text/markdown", "text/x-markdown", "application/markdown"]

const accept = (request: Request) => request.headers.get("accept")?.toLowerCase() ?? ""

function acceptsHtml(request: Request) {
  const value = accept(request)
  return value.includes("text/html") || value.includes("application/xhtml+xml")
}

function acceptsMarkdown(request: Request) {
  const value = accept(request)
  return MARKDOWN_TYPES.some((type) => value.includes(type))
}

function isCommandLine(request: Request) {
  return /^(curl|wget|httpie|xh)\//i.test(request.headers.get("user-agent") ?? "")
}

function withVaryAccept(response: Response): Response {
  const headers = new Headers(response.headers)
  const vary = headers.get("Vary")
  if (!vary) headers.set("Vary", "Accept")
  else if (!/(^|,)\s*accept\s*(,|$)/i.test(vary)) headers.set("Vary", `${vary}, Accept`)
  return new Response(response.body, { status: response.status, headers })
}
