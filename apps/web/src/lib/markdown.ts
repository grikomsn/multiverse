import { platformLabel } from "@multiverse/sanity/constants"

type Part = string | false | null | undefined

/** The parts that have text, as paragraphs. */
export const paragraphs = (...blocks: Part[]) => blocks.filter(Boolean).join("\n\n")

/** The items that have text, as a bullet list. */
export const bullets = (items: Part[]) =>
  items
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n")

/*
 * Portable Text to Markdown, for the `.md` copies of posts and pages, llms-full.txt and the MCP
 * server. Covers what `richText` allows: h2–h4, quotes, bullet and numbered lists, strong, em,
 * code, strike-through, links, figures, code blocks, embeds and the profile-links list.
 */

interface Span {
  _type: string
  text?: string
  marks?: string[] | null
}

interface MarkDef {
  _key: string
  _type: string
  href?: string | null
}

interface Block {
  _type: string
  _key?: string
  style?: string | null
  listItem?: string | null
  level?: number | null
  children?: Span[] | null
  markDefs?: MarkDef[] | null
  // figure
  image?: { url?: string | null; alt?: string | null } | null
  alt?: string | null
  caption?: string | null
  // codeBlock
  code?: string | null
  language?: string | null
  filename?: string | null
  // embed
  url?: string | null
  label?: string | null
  html?: string | null
  // profileLinks
  featuredOnly?: boolean | null
  email?: string | null
  links?:
    | {
        platform?: string | null
        label?: string | null
        url?: string | null
        featured?: boolean | null
      }[]
    | null
}

const DECORATORS: Record<string, [string, string]> = {
  strong: ["**", "**"],
  em: ["_", "_"],
  "strike-through": ["~~", "~~"],
}

function inline(block: Block, origin: string): string {
  const defs = new Map((block.markDefs ?? []).map((def) => [def._key, def]))
  const parts: { text: string; link?: string }[] = []

  for (const span of block.children ?? []) {
    const raw = span.text ?? ""
    if (!raw) continue
    const marks = span.marks ?? []
    // Keep outer spaces outside the markers: `**bold **` is not bold in Markdown.
    const [, lead = "", core = "", trail = ""] = raw.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? []
    let text = core
    if (text) {
      if (marks.includes("code")) text = `\`${text}\``
      for (const mark of marks) {
        const decorator = DECORATORS[mark]
        if (decorator) text = `${decorator[0]}${text}${decorator[1]}`
      }
    }
    const link = marks.map((mark) => defs.get(mark)).find((def) => def?._type === "link")?.href
    const href = link ? absolute(link, origin) : undefined
    const last = parts.at(-1)
    // Neighbouring spans with the same link become one link.
    if (last && last.link === href) last.text += `${lead}${text}${trail}`
    else parts.push({ text: `${lead}${text}${trail}`, link: href })
  }

  return parts
    .map((part) => {
      if (!part.link) return part.text
      const [, lead = "", core = "", trail = ""] = part.text.match(/^(\s*)([\s\S]*?)(\s*)$/) ?? []
      return `${lead}[${core}](${part.link})${trail}`
    })
    .join("")
}

/** Site-relative links become absolute, so the Markdown works away from the site. */
function absolute(href: string, origin: string): string {
  return href.startsWith("/") ? `${origin}${href}` : href
}

/** Every `richText` value as Markdown. Unknown block types are skipped. */
export function toMarkdown(blocks: Block[] | null | undefined, origin: string): string {
  const out: string[] = []
  let counters: number[] = []

  for (const block of blocks ?? []) {
    if (block._type === "block") {
      const text = inline(block, origin).trim()
      if (block.listItem) {
        const level = Math.max(1, block.level ?? 1)
        const indent = "  ".repeat(level - 1)
        counters = counters.slice(0, level)
        const marker =
          block.listItem === "number"
            ? `${(counters[level - 1] = (counters[level - 1] ?? 0) + 1)}.`
            : "-"
        // List items join into one list; the blank line comes before the next non-list block.
        out.push(`${indent}${marker} ${text}`)
        continue
      }
      counters = []
      if (!text) continue
      if (block.style === "h2") out.push(`\n## ${text}\n`)
      else if (block.style === "h3") out.push(`\n### ${text}\n`)
      else if (block.style === "h4") out.push(`\n#### ${text}\n`)
      else if (block.style === "blockquote") out.push(`\n${text.replace(/^/gm, "> ")}\n`)
      else out.push(`\n${text}\n`)
      continue
    }

    counters = []
    if (block._type === "figure" && block.image?.url) {
      const alt = block.image.alt ?? block.alt ?? ""
      out.push(`\n![${alt}](${block.image.url})${block.caption ? `\n\n_${block.caption}_` : ""}\n`)
    } else if (block._type === "codeBlock" && block.code) {
      const language = block.language && block.language !== "text" ? block.language : ""
      const fence = block.code.includes("```") ? "````" : "```"
      const title = block.filename ? `\`${block.filename}\`\n\n` : ""
      out.push(`\n${title}${fence}${language}\n${block.code.replace(/\n$/, "")}\n${fence}\n`)
    } else if (block._type === "embed") {
      if (block.url) out.push(`\n[${block.label ?? block.url}](${block.url})\n`)
      else if (block.label) out.push(`\n(Embedded content: ${block.label})\n`)
    } else if (block._type === "profileLinks") {
      const links = (block.links ?? []).filter(
        (link) => link.url && (!block.featuredOnly || link.featured),
      )
      const lines = [
        ...(!block.featuredOnly && block.email ? [`- Email: <${block.email}>`] : []),
        ...links.map((link) => `- [${platformLabel(link.platform, link.label)}](${link.url})`),
      ]
      if (lines.length) out.push(`\n${lines.join("\n")}\n`)
    }
  }

  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
