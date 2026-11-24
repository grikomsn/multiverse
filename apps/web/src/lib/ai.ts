import { searchDocuments } from "@multiverse/content/site-index"

import { getSiteIndex } from "./llms"

/*
 * What the /ai page says, for the page and for /ai.md. The samples are real answers from this
 * build, so they show what the tools return.
 */

export interface SetupStep {
  title: string
  note: string
  label: string
  copy: string
}

export async function getAiPage() {
  const { origin, name, documents } = await getSiteIndex()
  const mcpUrl = `${origin}/mcp`
  const prompt = `Read ${origin}/llms.txt and the pages it links to. Then answer my questions about ${name}. Use only facts from the site.`
  const counts = {
    posts: documents.filter((doc) => doc.kind === "post").length,
    projects: documents.filter((doc) => doc.kind === "project").length,
    talks: documents.filter((doc) => doc.kind === "talk").length,
  }
  const intro = `Ask an AI assistant about my work. It can read this site as Markdown or connect to its MCP server. Both have the same text as the pages: ${counts.posts} posts, ${counts.projects} projects, ${counts.talks} talks and the resume.`

  const vscode = JSON.stringify({ servers: { nibras: { type: "http", url: mcpUrl } } }, null, 2)
  const cursor = JSON.stringify({ mcpServers: { nibras: { url: mcpUrl } } }, null, 2)
  const setup: SetupStep[] = [
    {
      title: "Claude Code",
      note: "Copy the command, then run it in a terminal.",
      label: "Copy",
      copy: `claude mcp add --transport http nibras ${mcpUrl}`,
    },
    {
      title: "Claude",
      note: "Settings → Connectors → Add custom connector. Paste the URL.",
      label: "Copy URL",
      copy: mcpUrl,
    },
    { title: "VS Code", note: "Paste into .vscode/mcp.json.", label: "Copy", copy: vscode },
    { title: "Cursor", note: "Paste into ~/.cursor/mcp.json.", label: "Copy", copy: cursor },
  ]

  const hits = searchDocuments(documents, "cosmos", { limit: 2 })
  const talks = documents.filter((doc) => doc.kind === "talk")
  const roles = documents.filter((doc) => doc.kind === "experience")
  const tools = [
    {
      tool: "search",
      text: "Finds roles, projects, talks, posts and pages by keyword.",
      call: `search("cosmos")`,
      result: hits.map((hit) => hit.title).join(", "),
    },
    {
      tool: "get_document",
      text: "Gives the full Markdown of one result.",
      call: `get_document("work")`,
      result: "# Work, with every role, project and talk",
    },
    {
      tool: "list_documents",
      text: "Lists posts, projects, talks and more, with dates and links.",
      call: `list_documents("talk")`,
      result: `${talks.length} talks, newest: ${talks[0]?.title ?? ""}`,
    },
    {
      tool: "get_resume",
      text: "Gives the resume, or one section of it.",
      call: `get_resume("experience")`,
      result: roles[0]?.title ?? "",
    },
    {
      tool: "assess_fit",
      text: "A prompt. Paste a job description to get matches and gaps.",
      call: `assess_fit(job)`,
      result: "Requirements met, with proof, and what the resume does not show",
    },
  ]

  const files = [
    {
      href: "/llms.txt",
      label: "llms.txt",
      text: "What is on this site, with a link to each page.",
    },
    { href: "/llms-full.txt", label: "llms-full.txt", text: "All pages and posts in one file." },
    { href: "/resume.md", label: "resume.md", text: "The resume. Same text as the PDF." },
    {
      href: "/work.md",
      label: "work.md",
      text: "Experience, projects with usage numbers and talks.",
    },
    { href: "/blog.md", label: "blog.md", text: "A list of every post." },
  ]

  return { origin, name, mcpUrl, prompt, intro, vscode, cursor, setup, tools, files }
}

type AiPage = Awaited<ReturnType<typeof getAiPage>>

/** /ai.md: the same page as Markdown, with full addresses so it works outside the site. Each list is one block, so its items stay together. */
export function aiMarkdown(page: AiPage): string {
  const fence = (lang: string, code: string) => `\`\`\`${lang}\n${code}\n\`\`\``
  return [
    "# AI tools",
    page.intro,
    [
      `- [Ask Claude](https://claude.ai/new?q=${encodeURIComponent(page.prompt)})`,
      `- [Ask ChatGPT](https://chatgpt.com/?q=${encodeURIComponent(page.prompt)})`,
    ].join("\n"),
    "## MCP server",
    `Connect an assistant to \`${page.mcpUrl}\`. It uses Streamable HTTP and needs no sign-in.`,
    ...page.setup.flatMap((step) => [
      `### ${step.title}`,
      step.note,
      fence(step.copy.startsWith("{") ? "json" : "", step.copy),
    ]),
    "## Tools",
    page.tools
      .map((item) => `- \`${item.tool}\`: ${item.text} \`${item.call}\` → ${item.result}`)
      .join("\n"),
    "## Markdown files",
    "Add `.md` to the address of a page or post to get it as Markdown. Start with these:",
    page.files
      .map((file) => `- [${file.label}](${page.origin}${file.href}): ${file.text}`)
      .join("\n"),
  ].join("\n\n")
}
