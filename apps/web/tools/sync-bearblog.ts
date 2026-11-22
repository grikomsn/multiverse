/*
 * Copies posts and pages from Sanity to the Bear Blog at nibras.co, so both have the same content.
 * Bear Blog API: https://docs.bearblog.dev/api/
 *
 *   BEARBLOG_API_KEY=… bun apps/web/tools/sync-bearblog.ts          # show what would change
 *   BEARBLOG_API_KEY=… bun apps/web/tools/sync-bearblog.ts --apply  # back up Bear, then write
 *
 * Matches by slug. Sends only fields that differ: title, content, meta description, social image
 * and language. Creates Sanity documents that Bear does not have. Never deletes.
 * Skips Bear drafts, cross-post stubs (a `canonical_url` is set) and the slugs in KEEP.
 * Both versions of each changed item go to tmp/bearblog/sync/ for review.
 */
import { mkdir, writeFile } from "node:fs/promises"
import { createSanityClient } from "@multiverse/content/client"
import { imageUrl } from "@multiverse/content/format"
import { toMarkdown } from "../src/lib/markdown"
import { ROUTES_QUERY } from "../src/lib/queries"

/** Bear pages that have no Sanity equivalent and stay as they are. */
const KEEP = new Set(["schedule", "resume"])

const BASE = "https://bearblog.dev/griko/api/v1"
const OUT = new URL("../../../tmp/bearblog/", import.meta.url)
const apply = process.argv.includes("--apply")
const key = process.env.BEARBLOG_API_KEY
if (!key) throw new Error("Set BEARBLOG_API_KEY (Bear dashboard → Settings → API).")

interface BearPost {
  uid: string
  title: string
  slug: string
  publish: boolean
  is_page: boolean
  canonical_url: string
  meta_description: string
  meta_image: string
  lang: string
  content?: string
}

type Fields = Partial<
  Pick<BearPost, "title" | "content" | "meta_description" | "meta_image" | "lang">
>

let last = 0
/** Bear allows 60 requests a minute; keep one per second and honour Retry-After. */
async function bear<T>(path: string, init: RequestInit = {}): Promise<T> {
  const wait = last + 1000 - Date.now()
  if (wait > 0) await sleep(wait)
  last = Date.now()
  const response = await fetch(`${BASE}/${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
  })
  if (response.status === 429) {
    await sleep(Number(response.headers.get("Retry-After") ?? 60) * 1000)
    return bear(path, init)
  }
  if (!response.ok)
    throw new Error(`${init.method ?? "GET"} ${path}: ${response.status} ${await response.text()}`)
  return (await response.json()) as T
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const normalize = (text: string | null | undefined) => (text ?? "").replace(/\r\n/g, "\n").trim()

/** Markdown for Bear. Embeds with HTML stay HTML, which Bear renders as is. Links stay relative. */
function bearMarkdown(body: Parameters<typeof toMarkdown>[0]): string {
  const parts: string[] = []
  let run: NonNullable<typeof body> = []
  for (const block of body ?? []) {
    if (block._type === "embed" && block.html) {
      parts.push(toMarkdown(run, ""), block.html.trim())
      run = []
    } else run.push(block)
  }
  parts.push(toMarkdown(run, ""))
  // Full-size originals can be several MB; the site resizes them, so Bear should too.
  return parts
    .filter(Boolean)
    .join("\n\n")
    .replace(/https:\/\/cdn\.sanity\.io\/images\/[^\s)"'?]+/g, (url) => imageUrl(url, 1600) ?? url)
}

async function listBear(): Promise<BearPost[]> {
  const all: BearPost[] = []
  for (let page: number | null = 1; page;) {
    const result: { posts: BearPost[]; next_page: number | null } = await bear(`post/?page=${page}`)
    all.push(...result.posts)
    page = result.next_page
  }
  return all
}

const sanity = createSanityClient({ useCdn: false })
const [routes, listed] = await Promise.all([sanity.fetch(ROUTES_QUERY), listBear()])
const bearBySlug = new Map(listed.map((post) => [post.slug, post]))
const sanitySlugs = new Set(routes.map((route) => route.slug))

const updates: { post: BearPost; fields: Fields }[] = []
const creates: { slug: string; fields: Record<string, unknown> }[] = []
const skipped: string[] = []
const backup: BearPost[] = []
await mkdir(new URL("sync/", OUT), { recursive: true })

for (const route of routes) {
  if (!route.slug) continue
  const desired: Fields = { title: route.title ?? route.slug, content: bearMarkdown(route.body) }
  const description = route.excerpt
  if (description) desired.meta_description = description
  const image = imageUrl(route.image, 1200, 630)
  if (image) desired.meta_image = image
  if (route.lang) desired.lang = route.lang

  const current = bearBySlug.get(route.slug)
  if (!current) {
    creates.push({
      slug: route.slug,
      fields: {
        ...desired,
        slug: route.slug,
        is_page: route._type === "page",
        publish: true,
        published_date: route._type === "post" ? route.publishedAt : undefined,
        discoverable: route.visibility === "listed",
      },
    })
    continue
  }
  if (!current.publish) skipped.push(`${route.slug} (draft on Bear)`)
  else if (current.canonical_url) skipped.push(`${route.slug} (cross-post stub)`)
  else if (KEEP.has(route.slug)) skipped.push(`${route.slug} (kept as is)`)
  if (!current.publish || current.canonical_url || KEEP.has(route.slug)) continue

  const full = await bear<BearPost>(`post/${current.uid}/`)
  backup.push(full)
  const fields: Fields = {}
  for (const [name, value] of Object.entries(desired) as [keyof Fields, string][]) {
    if (normalize(full[name]) !== normalize(value)) fields[name] = value
  }
  if (Object.keys(fields).length === 0) continue
  updates.push({ post: full, fields })
  if (fields.content) {
    const file = route.slug.replaceAll("/", "__")
    await writeFile(new URL(`sync/${file}.bear.md`, OUT), `${normalize(full.content)}\n`)
    await writeFile(new URL(`sync/${file}.sanity.md`, OUT), `${desired.content}\n`)
  }
}

for (const post of listed) {
  if (!sanitySlugs.has(post.slug)) skipped.push(`${post.slug} (only on Bear)`)
}

console.log(`Bear: ${listed.length} items. Sanity: ${routes.length} posts and pages.\n`)
for (const { post, fields } of updates) {
  console.log(`update  ${post.slug}: ${Object.keys(fields).join(", ")}`)
  for (const name of ["title", "meta_description", "meta_image", "lang"] as const) {
    if (fields[name] !== undefined)
      console.log(
        `          ${name}: ${JSON.stringify(post[name])} → ${JSON.stringify(fields[name])}`,
      )
  }
}
for (const { slug } of creates) console.log(`create  ${slug}`)
for (const line of skipped) console.log(`skip    ${line}`)
console.log(
  `\n${updates.length} to update, ${creates.length} to create. Content diffs: tmp/bearblog/sync/`,
)

if (!apply) {
  console.log("Dry run. Add --apply to write to Bear.")
} else if (updates.length || creates.length) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  await writeFile(new URL(`backup-${stamp}.json`, OUT), JSON.stringify(backup, null, 2))
  console.log(`Backed up ${backup.length} Bear items to tmp/bearblog/backup-${stamp}.json`)
  for (const { post, fields } of updates) {
    await bear(`post/${post.uid}/`, { method: "PATCH", body: JSON.stringify(fields) })
    console.log(`updated ${post.slug}`)
  }
  for (const { slug, fields } of creates) {
    const created = await bear<BearPost>("post/", { method: "POST", body: JSON.stringify(fields) })
    console.log(`created ${slug} → ${created.slug}`)
  }
}
