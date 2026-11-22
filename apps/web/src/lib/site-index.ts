/*
 * The shape of /llms.json and search over it. No Astro or Sanity imports: the Worker
 * (src/worker/mcp.ts) uses this file too.
 */

export const DOCUMENT_KINDS = [
  "page",
  "post",
  "resume",
  "experience",
  "project",
  "talk",
  "community",
  "education",
  "skills",
  "media",
] as const

export type DocumentKind = (typeof DOCUMENT_KINDS)[number]

export interface SiteDocument {
  /** Stable id for `get_document`: `post/<slug>`, `page/<slug>`, `resume`, `project/<id>`… */
  id: string
  kind: DocumentKind
  title: string
  /** The HTML page (or the part of it) that shows this document. */
  url: string
  /** A `.md` copy at its own URL, for top-level documents. */
  markdownUrl?: string
  /** ISO date: publish date for posts, start date for roles, event date for talks. */
  date?: string
  summary?: string
  markdown: string
}

export interface SiteIndex {
  generatedAt: string
  origin: string
  name: string
  /** For the PDF metadata the Worker adds to /resume.pdf. */
  resume: { name: string; headline: string; keywords: string[] }
  /** Resume sections as Markdown, by MCP section name. */
  resumeSections: Record<string, string>
  documents: SiteDocument[]
}

export interface SearchHit {
  id: string
  kind: DocumentKind
  title: string
  url: string
  date?: string
  snippet: string
  score: number
}

const SNIPPET = 240
const AGGREGATES = new Set(["resume", "work", "blog"])
const ENTRIES = new Set<DocumentKind>(["experience", "project", "talk", "community", "education"])

function snippet(text: string, terms: string[]): string {
  const flat = text
    .replace(/[#>*_`|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const lower = flat.toLowerCase()
  const at = terms.map((term) => lower.indexOf(term)).find((index) => index >= 0) ?? 0
  const start = Math.max(0, at - Math.floor(SNIPPET / 3))
  const end = Math.min(flat.length, start + SNIPPET)
  return `${start > 0 ? "…" : ""}${flat.slice(start, end)}${end < flat.length ? "…" : ""}`
}

/**
 * Keyword search. Every term must match; a match in the title counts more than one in the
 * text, and entries (roles, projects, talks) rank above long posts that only mention a term.
 */
export function searchDocuments(
  documents: SiteDocument[],
  query: string,
  { kinds, limit = 8 }: { kinds?: DocumentKind[]; limit?: number } = {},
): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  const hits: SearchHit[] = []
  for (const doc of documents) {
    if (kinds?.length && !kinds.includes(doc.kind)) continue
    const title = doc.title.toLowerCase()
    const text = `${doc.summary ?? ""}\n${doc.markdown}`.toLowerCase()
    let score = 0
    for (const term of terms) {
      const inTitle = title.includes(term)
      const count = text.split(term).length - 1
      if (!inTitle && count === 0) {
        score = 0
        break
      }
      score += (inTitle ? 10 : 0) + Math.min(count, 5)
    }
    if (score === 0) continue
    // Short documents are about the term; long ones may only mention it. The resume and the
    // Work page hold every entry, so the entry itself ranks first.
    score += Math.max(0, 3 - Math.floor(doc.markdown.length / 4000))
    if (AGGREGATES.has(doc.id)) score = Math.ceil(score / 2)
    // Roles, projects and talks are facts; posts are stories that mention them.
    if (ENTRIES.has(doc.kind)) score += 4
    hits.push({
      id: doc.id,
      kind: doc.kind,
      title: doc.title,
      url: doc.url,
      date: doc.date,
      snippet: snippet(doc.markdown, terms),
      score,
    })
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(limit, 25)))
}
