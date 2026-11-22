/**
 * How a path on nbr.st becomes a destination. No Workers APIs here, so tests run it as it is;
 * `index.ts` adds KV and the caches.
 *
 * A link is one KV entry: the key is the path without its first slash, the value is the
 * destination. Pattern rules are the lines of one entry, `_redirects`, in the syntax that
 * Cloudflare `_redirects` files use.
 */

/** The KV key that holds the pattern rules. It is never a link. */
export const RULES_KEY = "_redirects"

const STATUSES = [301, 302, 303, 307, 308]
const DEFAULT_STATUS = 302

/** A destination can point at another link this many times before the Worker gives up. */
const MAX_HOPS = 5

export interface Target {
  /** An absolute URL, or a path on this host such as `/cal`. */
  url: string
  status: number
}

export interface Rule {
  source: RegExp
  destination: string
  status: number
}

/** Reads keys together. A key without a value maps to null or is absent. */
export type Lookup = (keys: string[]) => Promise<Map<string, string | null>>

/** `/Cal/` → `Cal`: the path without the slashes around it. */
export function slugOf(pathname: string) {
  return pathname.replace(/^\/+|\/+$/g, "")
}

/**
 * The keys to try for a slug, most exact first: as requested, percent-decoded, and lowercase.
 * `nbr.st/OSS` and `nbr.st/oss/` open the same link, and an emoji works as typed or encoded.
 * The old Worker stored each `.` as `__DOT__`; those keys still work.
 */
export function candidateKeys(slug: string) {
  let decoded = slug
  try {
    decoded = decodeURIComponent(slug)
  } catch {
    // Not valid percent-encoding: only the raw form can match.
  }
  const forms = [slug, decoded, decoded.toLowerCase()]
  const keys = forms.flatMap((form) => [form, form.replaceAll(".", "__DOT__")])
  return [...new Set(keys)].filter((key) => key && key !== RULES_KEY)
}

/**
 * A KV value: a destination, then an optional status. `https://cal.com/griko/schedule`,
 * `https://example.com 301`, or `/cal` for another link on this host.
 */
export function parseTarget(value: string | null | undefined): Target | null {
  const [url, status] = (value ?? "").trim().split(/\s+/)
  if (!url || !isDestination(url)) return null
  const code = Number(status ?? DEFAULT_STATUS)
  return { url, status: STATUSES.includes(code) ? code : DEFAULT_STATUS }
}

function isDestination(url: string) {
  if (url.startsWith("/")) return !url.startsWith("//")
  return /^https?:\/\//i.test(url) && URL.canParse(url)
}

/**
 * Rules in `_redirects` syntax, one per line: `source destination [status]`.
 *
 *   /gh/:repo  https://github.com/grikomsn/:repo
 *   /npm/*     https://www.npmjs.com/package/:splat  301
 *
 * `:name` matches one path segment and `*` matches the rest of the path. Lines that are empty,
 * start with `#` or are not valid are skipped, so one bad line cannot stop the others.
 */
export function parseRules(text: string | null | undefined): Rule[] {
  return (text ?? "").split("\n").flatMap((line) => {
    const [source, destination, status] = line.trim().split(/\s+/)
    if (!source?.startsWith("/") || !destination) return []
    const target = parseTarget(`${destination} ${status ?? ""}`)
    return target
      ? [{ source: compile(source), destination: target.url, status: target.status }]
      : []
  })
}

function compile(source: string) {
  const pattern = source
    .replace(/\/+$/, "")
    .split(/(:[A-Za-z_]\w*|\*)/)
    .map((part) => {
      if (part === "*") return "(?<splat>.*)"
      if (/^:[A-Za-z_]\w*$/.test(part)) return `(?<${part.slice(1)}>[^/]+)`
      return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    })
    .join("")
  return new RegExp(`^${pattern}$`, "i")
}

/** The first rule that matches a slug, with its placeholders filled in. */
export function matchRules(rules: Rule[], slug: string): Target | null {
  for (const rule of rules) {
    const match = rule.source.exec(`/${slug}`)
    if (!match) continue
    const url = rule.destination.replace(
      /:([A-Za-z_]\w*)/g,
      (placeholder, name: string) => match.groups?.[name] ?? placeholder,
    )
    return { url, status: rule.status }
  }
  return null
}

/**
 * The destination of a path, or null. Exact links win over rules. A destination on this host
 * (`/cal`, or `https://nbr.st/cal`) is another link: it is followed here, so the browser makes
 * one redirect, not two. A loop, or a path with no link, gives null.
 */
export async function resolve(
  pathname: string,
  { lookup, rules, hosts = [] }: { lookup: Lookup; rules: () => Promise<Rule[]>; hosts?: string[] },
): Promise<Target | null> {
  const seen = new Set<string>()
  let slug = slugOf(pathname)
  // The status of the first hop is the one the visitor asked for.
  let status: number | undefined

  for (let hop = 0; hop < MAX_HOPS; hop++) {
    if (!slug || seen.has(slug.toLowerCase())) return null
    seen.add(slug.toLowerCase())

    const keys = candidateKeys(slug)
    const values = keys.length ? await lookup(keys) : new Map<string, string | null>()
    const exact = keys.map((key) => parseTarget(values.get(key))).find(Boolean)
    const target = exact ?? matchRules(await rules(), slug)
    if (!target) return null

    status ??= target.status
    const next = ownPath(target.url, hosts)
    if (next === null) return { url: target.url, status }
    slug = slugOf(next)
  }
  return null
}

/** The path of a destination that is on this host, or null for any other URL. */
function ownPath(url: string, hosts: string[]) {
  if (url.startsWith("/")) return url.split(/[?#]/)[0] ?? url
  const parsed = new URL(url)
  return hosts.includes(parsed.hostname.toLowerCase()) ? parsed.pathname : null
}

/**
 * Adds the query of the request to the destination: `nbr.st/cal?month=2026-12` keeps its
 * `month`. A parameter that the destination already sets stays as it is.
 */
export function withQuery(destination: string, search: string) {
  const incoming = new URLSearchParams(search)
  if (incoming.size === 0) return destination
  const url = new URL(destination)
  for (const [name, value] of incoming) {
    if (!url.searchParams.has(name)) url.searchParams.append(name, value)
  }
  return url.href
}
