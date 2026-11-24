import { McpServer } from "@modelcontextprotocol/server"
import { FALLBACK_NAME } from "@multiverse/sanity/constants"
import { DOCUMENT_KINDS, searchDocuments, type SiteDocument } from "@multiverse/content/site-index"
import { createMcpHandler } from "agents/mcp/server"
import { z } from "zod"

import { RESUME_SECTIONS } from "../lib/resume/sections"
import { loadIndex } from "./data"

/*
 * MCP server for the whole site at /mcp: Streamable HTTP, stateless, no sign-in. It reads
 * /llms.json from this deploy, so its answers match the pages word for word.
 */

const text = (value: string) => ({ content: [{ type: "text" as const, text: value }] })

/** `name` is Profile's, read from /llms.json, so a new name needs no change here. */
const instructions = (
  name: string,
) => `Facts about ${name} from nibras.co: resume, work and projects (with usage numbers), blog posts, talks and photos.
- Start with \`search\` for a topic, or \`get_resume\` for career questions.
- \`get_document\` returns the full Markdown of one result. \`list_documents\` lists posts, projects, talks and more.
- Quote facts as written. Do not add numbers, titles or dates. Link to the page URL you used.`

function line(doc: SiteDocument) {
  return [
    `- \`${doc.id}\` ${doc.title}`,
    doc.date && ` (${doc.date.slice(0, 10)})`,
    ` — ${doc.url}`,
    doc.summary && `\n  ${doc.summary}`,
  ]
    .filter(Boolean)
    .join("")
}

function createServer(env: Env, request: Request, name: string) {
  const index = () => loadIndex(env, request)
  const server = new McpServer(
    { name: "nibras.co", version: "3.0.0" },
    { instructions: instructions(name) },
  )

  server.registerResource(
    "llms",
    "nibras://llms.txt",
    { title: "Site overview", mimeType: "text/plain" },
    async (uri) => {
      const response = await env.ASSETS.fetch(new URL("/llms.txt", request.url))
      return { contents: [{ uri: uri.href, text: await response.text() }] }
    },
  )

  server.registerResource(
    "resume",
    "nibras://resume.md",
    { title: "Resume", mimeType: "text/markdown" },
    async (uri) => {
      const doc = (await index()).documents.find((item) => item.id === "resume")
      return { contents: [{ uri: uri.href, text: doc?.markdown ?? "" }] }
    },
  )

  server.registerTool(
    "search",
    {
      title: "Search the site",
      description:
        "Keyword search across the resume, roles, projects, talks, posts and pages. Every word must match. Returns ids for get_document, with a snippet and the page URL.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Words to find, such as `react native` or `graz`."),
        kinds: z.array(z.enum(DOCUMENT_KINDS)).optional().describe("Only these kinds of document."),
        limit: z.number().int().min(1).max(25).default(8),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ query, kinds, limit }) => {
      const hits = searchDocuments((await index()).documents, query, { kinds, limit })
      if (hits.length === 0) return text(`No results for "${query}". Try fewer or other words.`)
      return text(
        hits
          .map(
            (hit, n) =>
              `${n + 1}. \`${hit.id}\` [${hit.kind}] ${hit.title}${hit.date ? ` (${hit.date.slice(0, 10)})` : ""}\n   ${hit.url}\n   ${hit.snippet}`,
          )
          .join("\n\n"),
      )
    },
  )

  server.registerTool(
    "get_document",
    {
      title: "Get a document",
      description:
        "Full Markdown of one document, by id from search or list_documents (`resume`, `work`, `post/<slug>`, `project/<name>`…). A page URL also works.",
      inputSchema: z.object({ id: z.string().min(1) }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ id }) => {
      const { documents, origin } = await index()
      const key = id.trim().replace(/\.md$/, "").replace(/\/$/, "")
      const doc =
        documents.find((item) => item.id === key) ??
        documents.find(
          (item) => item.url === key || item.url === `${origin}/${key.replace(/^\//, "")}`,
        ) ??
        documents.find((item) => item.id.endsWith(`/${key}`))
      return text(doc ? doc.markdown : `No document "${id}". Use search or list_documents for ids.`)
    },
  )

  server.registerTool(
    "list_documents",
    {
      title: "List documents",
      description:
        "Lists documents with id, title, date, URL and summary. Posts are newest first. Use `kind` to list one kind, such as `post` or `project`.",
      inputSchema: z.object({
        kind: z.enum(DOCUMENT_KINDS).optional(),
        limit: z.number().int().min(1).max(200).default(50),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ kind, limit }) => {
      const { documents } = await index()
      const list = documents.filter((doc) => !kind || doc.kind === kind).slice(0, limit)
      return text(list.length > 0 ? list.map(line).join("\n") : "No documents of that kind.")
    },
  )

  server.registerTool(
    "get_resume",
    {
      title: "Get the resume",
      description:
        "The resume as Markdown: the whole document, or one section. Same text as nibras.co/resume and the PDF.",
      inputSchema: z.object({ section: z.enum(RESUME_SECTIONS).optional() }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ section }) => {
      const { documents, resumeSections } = await index()
      if (section) return text(resumeSections[section] ?? "No content for this section.")
      return text(documents.find((doc) => doc.id === "resume")?.markdown ?? "No resume.")
    },
  )

  server.registerPrompt(
    "assess_fit",
    {
      title: "Assess fit for a role",
      description: "Compare the resume with a job description and list matches and gaps.",
      argsSchema: z.object({ job: z.string().min(1).describe("The job description.") }),
    },
    ({ job }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `Use get_resume and search on the nibras.co server to compare ${name} with this role. List the requirements he meets, with the resume line that shows each one, and the requirements the resume does not show. Do not guess.\n\nRole:\n${job}`,
          },
        },
      ],
    }),
  )

  return server
}

/** Stateless Streamable HTTP at /mcp; every request gets a fresh server. */
export async function mcpHandler(request: Request, env: Env, ctx: ExecutionContext) {
  // The index is cached per isolate. If it cannot be read, the tools fail on their own, and
  // the server still starts.
  const name = await loadIndex(env, request).then(
    (site) => site.name,
    () => FALLBACK_NAME,
  )
  return createMcpHandler(() => createServer(env, request, name), { route: "/mcp" })(
    request,
    env,
    ctx,
  )
}
