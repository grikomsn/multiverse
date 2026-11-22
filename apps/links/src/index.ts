import {
  parseRules,
  resolve,
  RULES_KEY,
  slugOf,
  withQuery,
  type Lookup,
  type Rule,
  type Target,
} from "./links"

/*
 * nbr.st: short links. `links.ts` says how a path becomes a destination; this file reads KV and
 * keeps answers close, so most requests need no KV read:
 *
 *   1. Memory of this isolate: no I/O at all.
 *   2. The edge cache of this data center: shared by every isolate there. It also holds
 *      "not found", so a scanner that repeats a path costs no KV read.
 *   3. KV: every form of the path is read at the same time, with the pattern rules when they
 *      are due. A plain lowercase path is one read.
 *
 * A changed link shows everywhere after about 7 minutes at most (the three lifetimes below plus
 * KV's own 60 seconds), and in a browser that already followed it after 5 more.
 */

/** Seconds an answer stays in this isolate's memory. */
const MEMORY_TTL = 60
/** Seconds a found link stays in the edge cache. */
const EDGE_TTL = 300
/** Seconds "not found" stays in the edge cache: a new link starts to work within a minute. */
const EDGE_MISS_TTL = 60
/** Seconds the parsed pattern rules stay in memory. */
const RULES_TTL = 60
/** Seconds a browser keeps a redirect: temporary (302, 303, 307) and permanent (301, 308). */
const BROWSER_TTL = { temporary: 300, permanent: 86_400 }
/** Entries in memory before it is emptied. Scanners ask for many paths that do not exist. */
const MEMORY_LIMIT = 2000

const ROBOTS = "User-agent: *\nDisallow: /\n"
/** Icons a browser asks for by itself. They are the main site's files, so there is one copy. */
const ICONS = new Set(["favicon.ico", "favicon.svg"])

const memory = new Map<string, { target: Target | null; expires: number }>()
let rules: { list: Rule[]; expires: number } = { list: [], expires: 0 }

export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return text("Method not allowed\n", 405, { Allow: "GET, HEAD" })
    }
    const url = new URL(request.url)
    const slug = slugOf(url.pathname)
    if (!slug) return redirect({ url: env.HOME_URL, status: 302 }, url)
    if (slug === "robots.txt") return text(ROBOTS, 200, cacheFor(BROWSER_TTL.permanent))
    if (ICONS.has(slug)) return redirect({ url: `${env.HOME_URL}/${slug}`, status: 302 }, url)

    try {
      const target = await find(slug, url, env, ctx)
      return target ? redirect(target, url) : text("Not found\n", 404, cacheFor(EDGE_MISS_TTL))
    } catch (error) {
      console.error("Lookup failed", { slug, error })
      return text("Try again in a moment\n", 503, {
        "Cache-Control": "no-store",
        "Retry-After": "5",
      })
    }
  },
} satisfies ExportedHandler<Env>

/** The destination of a slug, from the closest place that has it. */
async function find(slug: string, url: URL, env: Env, ctx: ExecutionContext) {
  const now = Date.now()
  const remembered = memory.get(slug)
  if (remembered && remembered.expires > now) return remembered.target

  // The answer is cached, not the response: the query of each request is added afterwards.
  // The key has its own path, because `r7s-worker` cached whole responses at `/<slug>` on the
  // same host. An entry that is not an answer counts as a miss.
  const cache = caches.default
  const cacheKey = new Request(`${url.origin}/_answer/v1/${encodeURIComponent(slug)}`)
  const cached = await cache.match(cacheKey)
  let target: Target | null | undefined
  if (cached) target = await cached.json<Target | null>().catch(() => undefined)
  if (target === undefined) {
    target = await resolve(url.pathname, {
      lookup: lookupIn(env),
      rules: () => currentRules(env),
      hosts: [url.hostname],
    })
    const answer = Response.json(target, { headers: cacheFor(target ? EDGE_TTL : EDGE_MISS_TTL) })
    ctx.waitUntil(cache.put(cacheKey, answer))
  }

  if (memory.size >= MEMORY_LIMIT) memory.clear()
  memory.set(slug, { target, expires: now + MEMORY_TTL * 1000 })
  return target
}

/**
 * Reads every key at the same time, and the pattern rules with them when they are due. One read
 * for each key, not KV's bulk read: on 2026-11-22 the bulk read gave nothing for keys that are
 * all digits, such as `2017`.
 */
function lookupIn(env: Env): Lookup {
  return async (keys) => {
    const due = rules.expires <= Date.now()
    const names = due ? [...keys, RULES_KEY] : keys
    const found = await Promise.all(names.map((name) => env.LINKS.get(name)))
    const values = new Map(names.map((name, index) => [name, found[index] ?? null]))
    if (due) remember(values.get(RULES_KEY))
    return values
  }
}

async function currentRules(env: Env) {
  if (rules.expires <= Date.now()) remember(await env.LINKS.get(RULES_KEY))
  return rules.list
}

function remember(text: string | null | undefined) {
  rules = { list: parseRules(text), expires: Date.now() + RULES_TTL * 1000 }
}

function redirect(target: Target, url: URL) {
  const permanent = target.status === 301 || target.status === 308
  return new Response(null, {
    status: target.status,
    headers: {
      Location: withQuery(target.url, url.search),
      ...cacheFor(permanent ? BROWSER_TTL.permanent : BROWSER_TTL.temporary),
      ...secure(url),
    },
  })
}

function text(body: string, status: number, headers: Record<string, string>) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Robots-Tag": "noindex",
      ...headers,
    },
  })
}

const cacheFor = (seconds: number) => ({ "Cache-Control": `public, max-age=${seconds}` })

/**
 * After one visit over HTTPS, a browser stops trying plain HTTP for a year. A typed
 * `nbr.st/cal` then skips the HTTP-to-HTTPS redirect, which is a whole extra round trip.
 * This host only: subdomains such as oc3.nbr.st are separate sites.
 */
const secure = (url: URL): Record<string, string> =>
  url.protocol === "https:" ? { "Strict-Transport-Security": "max-age=31536000" } : {}
