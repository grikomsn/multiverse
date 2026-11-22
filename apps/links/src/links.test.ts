import assert from "node:assert/strict"
import { describe, it } from "node:test"

import {
  candidateKeys,
  matchRules,
  parseRules,
  parseTarget,
  resolve,
  RULES_KEY,
  slugOf,
  withQuery,
  type Lookup,
} from "./links"

/** A KV namespace as a plain object. `reads` counts the bulk reads. */
function store(entries: Record<string, string>) {
  const reads: string[][] = []
  const lookup: Lookup = async (keys) => {
    reads.push(keys)
    return new Map(keys.map((key) => [key, entries[key] ?? null]))
  }
  const rules = async () => parseRules(entries[RULES_KEY])
  const open = (path: string) => resolve(path, { lookup, rules, hosts: ["nbr.st"] })
  return { open, reads }
}

describe("slugOf", () => {
  it("drops the slashes around a path", () => {
    assert.equal(slugOf("/cal"), "cal")
    assert.equal(slugOf("/cal/"), "cal")
    assert.equal(slugOf("//a/b//"), "a/b")
    assert.equal(slugOf("/"), "")
  })
})

describe("candidateKeys", () => {
  it("asks for one key when the slug is plain", () => {
    assert.deepEqual(candidateKeys("cal"), ["cal"])
  })

  it("adds the lowercase form", () => {
    assert.deepEqual(candidateKeys("OSS"), ["OSS", "oss"])
  })

  it("tries an emoji as encoded and as typed", () => {
    assert.deepEqual(candidateKeys("%F0%9F%A6%8B"), ["%F0%9F%A6%8B", "🦋"])
  })

  it("tries the old __DOT__ keys", () => {
    assert.deepEqual(candidateKeys("lnk.sh"), ["lnk.sh", "lnk__DOT__sh"])
  })

  it("keeps a slug with broken percent-encoding", () => {
    assert.deepEqual(candidateKeys("100%"), ["100%"])
  })

  it("never asks for the rules key as a link", () => {
    assert.deepEqual(candidateKeys(RULES_KEY), [])
  })
})

describe("parseTarget", () => {
  it("reads a URL, with 302 unless a status follows", () => {
    assert.deepEqual(parseTarget("https://example.com/a"), {
      url: "https://example.com/a",
      status: 302,
    })
    assert.deepEqual(parseTarget(" https://example.com/a 301 "), {
      url: "https://example.com/a",
      status: 301,
    })
    assert.equal(parseTarget("https://example.com 200")?.status, 302)
  })

  it("accepts a path on this host", () => {
    assert.deepEqual(parseTarget("/cal"), { url: "/cal", status: 302 })
  })

  it("rejects what is not a destination", () => {
    for (const value of [null, "", "javascript:alert(1)", "//evil.example", "ftp://x", "cal"]) {
      assert.equal(parseTarget(value), null)
    }
  })
})

describe("rules", () => {
  const rules = parseRules(`
    # Repositories and packages
    /gh/:repo        https://github.com/grikomsn/:repo
    /gh/:owner/:repo https://github.com/:owner/:repo
    /npm/*           https://www.npmjs.com/package/:splat 301
    /docs.v2         https://example.com/docs
    not-a-rule
    /bad             nowhere
  `)

  it("skips comments and lines that are not valid", () => {
    assert.equal(rules.length, 4)
  })

  it("fills a placeholder from one path segment", () => {
    assert.deepEqual(matchRules(rules, "gh/oc3"), {
      url: "https://github.com/grikomsn/oc3",
      status: 302,
    })
    assert.equal(
      matchRules(rules, "gh/sanity-io/sanity")?.url,
      "https://github.com/sanity-io/sanity",
    )
    assert.equal(matchRules(rules, "gh"), null)
  })

  it("fills the splat from the rest of the path", () => {
    assert.deepEqual(matchRules(rules, "npm/@scope/name"), {
      url: "https://www.npmjs.com/package/@scope/name",
      status: 301,
    })
  })

  it("matches without regard to case, and a dot is only a dot", () => {
    assert.equal(matchRules(rules, "GH/oc3")?.url, "https://github.com/grikomsn/oc3")
    assert.equal(matchRules(rules, "docs.v2")?.url, "https://example.com/docs")
    assert.equal(matchRules(rules, "docsxv2"), null)
  })
})

describe("resolve", () => {
  const links = store({
    cal: "https://cal.com/griko/schedule",
    schedule: "/cal",
    meet: "https://nbr.st/schedule 301",
    "%F0%9F%A6%8B": "https://bsky.app/profile/example",
    "tamper-github__DOT__js": "https://example.com/script.js",
    loop: "/loop2",
    loop2: "/loop",
    dangling: "/nothing-here",
    broken: "not a url",
    gh: "https://github.com/grikomsn",
    [RULES_KEY]: "/gh/:repo https://github.com/grikomsn/:repo\n/s/* /:splat",
  })

  it("reads nothing for the rules key", async () => {
    const { open, reads } = store({ [RULES_KEY]: "/a https://example.com" })
    assert.equal(await open(`/${RULES_KEY}`), null)
    assert.deepEqual(reads, [])
  })

  it("opens an exact link in one read", async () => {
    const { open, reads } = store({ cal: "https://cal.com/griko/schedule" })
    assert.deepEqual(await open("/cal"), { url: "https://cal.com/griko/schedule", status: 302 })
    assert.deepEqual(reads, [["cal"]])
  })

  it("ignores case and a trailing slash", async () => {
    assert.equal((await links.open("/CAL/"))?.url, "https://cal.com/griko/schedule")
  })

  it("opens an emoji as typed or encoded, and old dotted keys", async () => {
    assert.equal((await links.open("/%F0%9F%A6%8B"))?.url, "https://bsky.app/profile/example")
    assert.equal((await links.open("/tamper-github.js"))?.url, "https://example.com/script.js")
  })

  it("follows a link to another link, and keeps the first status", async () => {
    assert.deepEqual(await links.open("/schedule"), {
      url: "https://cal.com/griko/schedule",
      status: 302,
    })
    assert.deepEqual(await links.open("/meet"), {
      url: "https://cal.com/griko/schedule",
      status: 301,
    })
  })

  it("prefers an exact link to a rule", async () => {
    assert.equal((await links.open("/gh"))?.url, "https://github.com/grikomsn")
    assert.equal((await links.open("/gh/oc3"))?.url, "https://github.com/grikomsn/oc3")
  })

  it("follows a rule that points at another link", async () => {
    assert.equal((await links.open("/s/cal"))?.url, "https://cal.com/griko/schedule")
  })

  it("gives nothing for a loop, a dead end, a bad value or an unknown path", async () => {
    for (const path of ["/loop", "/dangling", "/broken", "/wp-login.php", "/", `/${RULES_KEY}`]) {
      assert.equal(await links.open(path), null, path)
    }
  })
})

describe("withQuery", () => {
  it("leaves the destination as stored when the request has no query", () => {
    assert.equal(withQuery("https://example.com", ""), "https://example.com")
  })

  it("adds the request's parameters, and the destination's own win", () => {
    assert.equal(
      withQuery("https://cal.com/griko/schedule?duration=30", "?month=2026-12&duration=60"),
      "https://cal.com/griko/schedule?duration=30&month=2026-12",
    )
  })
})
