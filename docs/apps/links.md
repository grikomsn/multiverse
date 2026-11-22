# nbr.st (`apps/links`)

Short links. One Worker, no static assets: `src/index.ts` is the entrypoint and `src/links.ts` holds the matching rules. The Worker is `multiverse-links`. It replaced `r7s-worker` on 2026-11-22 and reads the same KV namespace (`r7s`).

The links are not in this repository or in Sanity. Some of them are private, and KV cannot be listed without Cloudflare access.

## Links

A link is one KV entry in the `r7s` namespace (binding `LINKS`).

| Part  | What it is                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------- |
| Key   | The path without its first slash: `cal` for `nbr.st/cal`. Use lowercase                           |
| Value | The destination. Add a status to change it from 302: `https://example.com 301`                    |
| Value | Or a path on nbr.st: `/cal`. The link then opens what `cal` opens, so the URL is stored only once |

```bash
cd apps/links
bunx wrangler kv key put --binding LINKS --remote cal "https://cal.com/griko/schedule"
bunx wrangler kv key put --binding LINKS --remote schedule "/cal"
bunx wrangler kv key delete --binding LINKS --remote schedule
```

A request finds its link in more ways than the old Worker allowed:

- **Case and slashes:** `nbr.st/OSS` and `nbr.st/oss/` open `oss`.
- **Encoding:** an emoji opens the same link as typed or as percent-encoded.
- **Dots:** the old Worker stored `.` as `__DOT__`, and then stopped translating it. Keys of both forms work, so `nbr.st/tamper-github.js` works again.
- **Query:** `nbr.st/cal?month=2026-12` keeps `month`. A parameter that the destination already sets stays as it is.
- **Chains:** a destination on nbr.st is followed in the Worker, so the browser makes one redirect. A loop gives 404.

## Pattern rules

One KV entry, `_redirects`, holds the rules. It uses the syntax of Cloudflare `_redirects` files: `source destination [status]`, one rule per line.

```text
# Repositories and packages
/gh/:repo  https://github.com/grikomsn/:repo
/npm/*     https://www.npmjs.com/package/:splat  301
```

- `:name` matches one path segment. `*` matches the rest of the path and fills `:splat`.
- An exact link wins over a rule. The first rule that matches wins over later ones.
- Lines that are empty, start with `#` or are not valid are skipped.

```bash
bunx wrangler kv key put --binding LINKS --remote _redirects --path rules.txt
```

## Other paths

| Path               | Answer                                                       |
| ------------------ | ------------------------------------------------------------ |
| `/`                | 302 to `HOME_URL` in `wrangler.jsonc` (the old Worker: 500)  |
| `/robots.txt`      | Disallows everything. Short links are not for search engines |
| Unknown path       | 404, plain text                                              |
| Not GET or HEAD    | 405                                                          |
| KV does not answer | 503 with `Retry-After`, never cached                         |

## Caching

Most requests need no KV read. The Worker looks in three places, closest first.

| Place                         | Holds                        | Lifetime                        |
| ----------------------------- | ---------------------------- | ------------------------------- |
| Memory of the isolate         | Destinations and "not found" | 60 s                            |
| Edge cache of the data center | Destinations and "not found" | 300 s found, 60 s not found     |
| KV                            | The links and the rules      | KV keeps a read for 60 s itself |

The caches hold the destination, not the response, so one entry serves every query string. The pattern rules stay parsed in memory for 60 s.

A changed link shows everywhere after 7 minutes at most. A new link works within 3 minutes. Browsers keep a 302 for 5 minutes and a 301 for a day, so use 301 only for a link that will not change.

## Speed before the Worker runs

A cached answer needs no I/O in the Worker. The rest of the time is DNS and connection setup, and three things keep that short.

- **HTTPS record:** Cloudflare already publishes an HTTPS DNS record for nbr.st. Browsers that read it connect over HTTPS and HTTP/3 at once.
- **HSTS:** `http://nbr.st/…` costs an extra round trip, because the edge first redirects to HTTPS. The Worker sends `Strict-Transport-Security` for one year, so a browser that came once never tries HTTP again. It covers nbr.st only, not subdomains such as oc3.nbr.st. For first visits too, add `includeSubDomains; preload` and submit the domain at hstspreload.org; that needs every subdomain on HTTPS for good.
- **Custom domain:** nbr.st is a custom domain of the Worker (`routes` in `wrangler.jsonc`). Cloudflare then makes the proxied DNS record and the certificate itself, and no request waits for an origin.

## Development and tests

```bash
bun run --filter links dev    # http://localhost:4323, reads the real KV namespace (read only)
bun run --filter links test   # the matching rules, with a fake KV
```

`wrangler dev` needs a Cloudflare login, because the KV binding is `remote`.

KV's bulk read (`get([...])`) gave no value for keys that are all digits (`2017`) on 2026-11-22. The Worker reads each key with its own `get`, at the same time.

## Cutover

nbr.st moved from `r7s-worker` to this Worker on 2026-11-22. [docs/deploy.md](../deploy.md#cutover) has what changed.

Not carried over from `r7s-worker`: it answered every `.php` path with a file from R2 (`secret-stash.gz`), as a trap for scanners. Here those paths get the cached 404.
