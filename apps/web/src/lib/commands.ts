import { KEY_PAGES, platformLabel, REPOSITORY_URL } from "@multiverse/sanity/constants"
import type { CommandIndex, CommandItem, CommandKind } from "@multiverse/ui/command-index"

import { ARCHIVE_ORIGIN } from "./archive"
import { getSiteIndex } from "./llms"
import { SITE_SHELL_QUERY, VERSIONS_QUERY } from "./queries"
import { sanity } from "./sanity"

/*
 * /commands.json: what the command bar lists (`@multiverse/ui/command-bar.astro`). Titles and
 * paths only, so the file is small. It comes from the same index as /llms.json, so the bar,
 * the Markdown pages and the MCP server name the same things.
 */

/** Pages that are not documents in Sanity, with words that also find them. */
const FIRST: CommandItem[] = [
  { kind: "page", title: "Home", path: "/" },
  { kind: "page", title: "Blog", path: "/blog", keywords: "posts" },
  { kind: "page", title: "Work", path: "/work", keywords: "experience projects talks" },
]
const LAST: CommandItem[] = [
  { kind: "page", title: "Resume", path: "/resume", keywords: "cv" },
  { kind: "page", title: "Media", path: "/media", keywords: "photos avatars pictures" },
  { kind: "page", title: "For AI tools", path: "/ai", keywords: "mcp llms markdown" },
]
/** The key pages come first, in their order: the header links the first of them. */
const ORDER: string[] = KEY_PAGES.map((page) => `/${page.slug}`)

const KINDS: Record<string, CommandKind> = {
  post: "post",
  experience: "role",
  project: "project",
  talk: "talk",
}

export async function getCommandIndex(): Promise<CommandIndex> {
  const [site, shell, versions] = await Promise.all([
    getSiteIndex(),
    sanity.fetch(SITE_SHELL_QUERY),
    sanity.fetch(VERSIONS_QUERY),
  ])
  const path = (url: string) => url.replace(site.origin, "") || "/"

  const pages: CommandItem[] = site.documents
    .filter((doc) => doc.id.startsWith("page/"))
    .map((doc) => ({ kind: "page", title: doc.title, path: path(doc.url) }))
  const rank = (item: CommandItem) => {
    const at = ORDER.indexOf(item.path)
    return at < 0 ? ORDER.length : at
  }
  const main = pages.filter((item) => rank(item) < ORDER.length).sort((a, b) => rank(a) - rank(b))
  const other = pages.filter((item) => rank(item) === ORDER.length)

  const entries = site.documents.flatMap((doc): CommandItem[] => {
    const kind = KINDS[doc.kind]
    if (!kind) return []
    return [
      {
        kind,
        title: doc.title,
        path: path(doc.url),
        date: kind === "post" ? doc.date : undefined,
      },
    ]
  })

  return {
    name: site.name,
    items: [...FIRST, ...main, ...LAST, ...other, ...entries],
    versions: versions.flatMap((version) =>
      version.key
        ? [
            {
              title: version.title ?? version.key,
              url: `${ARCHIVE_ORIGIN}/${version.key}/`,
              year: version.startDate?.slice(0, 4),
            },
          ]
        : [],
    ),
    profiles: (shell.profile?.socialLinks ?? []).flatMap((link) =>
      link.featured && link.url
        ? [{ label: platformLabel(link.platform, link.label), url: link.url }]
        : [],
    ),
    email: shell.profile?.email ?? undefined,
    scheduleUrl: shell.profile?.scheduleUrl ?? undefined,
    repository: REPOSITORY_URL,
  }
}
