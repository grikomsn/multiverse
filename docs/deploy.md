# Deploys and the cutover

Three Workers in the Cloudflare account "Griko Nibras". GitHub Actions deploys them. Actions allows only GitHub's own actions and `oven-sh/setup-bun`, pinned to a commit SHA.

| App            | Worker               | Domain                   | workers.dev address                    |
| -------------- | -------------------- | ------------------------ | -------------------------------------- |
| `apps/web`     | `multiverse-web`     | nibras.co, www.nibras.co | `multiverse-web.griko.workers.dev`     |
| `apps/archive` | `multiverse-archive` | archive.nibras.co        | `multiverse-archive.griko.workers.dev` |
| `apps/links`   | `multiverse-links`   | nbr.st, www.nbr.st       | `multiverse-links.griko.workers.dev`   |

Studio is not a Worker. `bun run --filter studio deploy` puts it on https://nibras.sanity.studio, and studio.nibras.co redirects there.

Redirect rules in the nibras.co zone (Rules → Redirect Rules, 301, query kept) send other names to their place:

| Name             | Goes to                        | Path kept |
| ---------------- | ------------------------------ | --------- |
| www.nibras.co    | `https://nibras.co`            | Yes       |
| studio.nibras.co | `https://nibras.sanity.studio` | Yes       |
| resume.nibras.co | `https://nibras.co/resume`     | No        |
| media.nibras.co  | `https://nibras.co/media`      | No        |

A rule runs only for a proxied name. Names without a Worker have a placeholder record, `AAAA 100::`. Paths on nibras.co itself redirect in `apps/web/src/pages/[file].ts`, not here.

## How a deploy runs

`.github/workflows/deploy.yml` builds web and archive, then deploys all three Workers. It runs:

- after Check passes on `main`, for the commit that Check tested;
- when Sanity publishes, through a webhook (below), because the pages read Sanity at build time;
- by hand, from the Actions tab ("Run workflow").

The workflow does nothing until the repository variable `DEPLOY` is `true`. Set it to `false` to stop deploys without a commit.

### Fonts

The build needs `assets/fonts/web/timeless-sans.woff2`, which must not enter git. A copy is in the private R2 bucket `multiverse-build` (no public access). The workflow downloads it with `./scripts/r2-fonts.sh get`. After `./scripts/subset-fonts.sh` writes new files, upload them with `./scripts/r2-fonts.sh put`.

Do not put fonts in `blob1`. That bucket is public at blobs.nibras.co.

### Setup in GitHub

1. Make a Cloudflare API token from the "Edit Cloudflare Workers" template. Account: Griko Nibras. Zones: nibras.co and nbr.st. Add **Workers R2 Storage: Read** for the fonts.
2. In the repository settings, add the secret `CLOUDFLARE_API_TOKEN` with that token.
3. Add the repository variable `DEPLOY` with the value `true`.

### Deploy when Sanity publishes

The webhook "Deploy on publish" is in sanity.io/manage → project `lboasusv` → API → Webhooks:

| Setting    | Value                                                                  |
| ---------- | ---------------------------------------------------------------------- |
| URL        | `https://api.github.com/repos/grikomsn/multiverse/dispatches`          |
| Dataset    | `production`                                                           |
| Trigger on | Create, Update, Delete                                                 |
| Filter     | `!(_type match "sanity.*") && !(_type match "system.*")`               |
| Projection | `{"event_type": "sanity-publish"}`                                     |
| Method     | POST                                                                   |
| Headers    | `Authorization: Bearer <token>`, `Accept: application/vnd.github+json` |

Drafts do not trigger it. The token is a fine-grained GitHub token for this repository only, with **Contents: Read and write**. When it expires, deploys on publish stop: make a new one and replace it in the webhook's headers. Many quick edits start many runs. Only one deploys at a time, and GitHub keeps only the newest waiting run.

### By hand

Each app still deploys from this machine with `bun run --filter <app> deploy`. It needs a Wrangler login and the fonts in `assets/fonts/web`.

### No Git connection in Cloudflare

The dashboard shows the Workers as not connected to a repository. Keep it so. Cloudflare's own builds would deploy each push a second time, without the Check gate, the fonts or the Sanity trigger.

## Observability

Each `wrangler.jsonc` sets what Cloudflare records for its Worker. The Worker's **Observability** tab in the dashboard shows it.

| Worker               | Logs | Issues | Traces |
| -------------------- | ---- | ------ | ------ |
| `multiverse-web`     | Yes  | Yes    | Yes    |
| `multiverse-links`   | Yes  | Yes    | No     |
| `multiverse-archive` | Yes  | Yes    | No     |

- **Issues** groups failures: uncaught exceptions, 5xx answers and `console.error` calls. Report a handled failure with `console.error(error)`. `upload_source_maps` makes each stack point to the TypeScript source.
- **Traces** record each call to a binding or a `fetch`, with no code. Only web has them: its Worker starts Browser Rendering, reads R2 and fetches from Sanity. The links Worker does one KV read, and the archive Worker runs for one file.
- **Cost**: from December 1, 2026, logs, traces and Issues share one allowance per account. On the Free plan, it is 0.5 GB a day. After that, Cloudflare records nothing until 00:00 UTC, logs included. If a flood of requests uses the allowance, add `head_sampling_rate` to the Worker that gets them.

## Cutover

Done on 2026-11-22. What changed, and what to know from it:

- **nbr.st and www.nbr.st** moved from `r7s-worker` to `multiverse-links` with one `wrangler deploy`. For five minutes every link answered 503: the edge cache still held `r7s-worker`'s entries at the same keys. The Worker now caches under `/_answer/v1/`.
- **archive.nibras.co** is a custom domain of `multiverse-archive`. It takes precedence over the wildcard record `*.nibras.co`, which points to Vercel.
- **nibras.co and www** are custom domains of `multiverse-web`. Their CNAME records to `domain-proxy.bearblog.dev` are gone. The mail records (MX, SPF, DKIM) and the verification TXT records stay.
- **Bulk Redirects:** the account had a list, "personal_website_hotfix", with ten nibras.co rules. It ran before the Worker, so `/resume` and `/work` went to the old places. The list and its rule are deleted. The rules that still matter are in `apps/web/src/pages/[file].ts`. Keep nibras.co rules there, not in the dashboard.
- **resume, media and studio.nibras.co** became redirects (table above), and **www.nibras.co** redirects to nibras.co. Deleting a Worker also deletes the DNS record of its custom domain, so add the placeholder again if a name loses it.
- **DMARC:** two `_dmarc` records made DMARC void. The one that sent reports to iCloud is deleted; the one that sends reports to Cloudflare stays.

Deleted: the Workers `web`, `archive`, `r7s-worker`, `resume` and `amhere-server-development`, the KV namespace `resume-session`, the D1 database `amhere-control-plane-development` and the Pages projects `media` and `studio` (an older Studio, built from `grikomsn/multiverse-private`). The KV namespace `r7s` stays: `multiverse-links` reads it.

Still to drop: the Bear Blog (keep its export first), then `tools/sync-bearblog.ts` and its docs.

Not touched: the Pages projects `stickers` and `react-state-mgmt-examples`, the wildcard `*.nibras.co` to Vercel, and `blob1` with blobs.nibras.co.

Removed on 2026-11-24: the Pages project `multiverse-v2` and its record v2.nibras.co (archive.nibras.co/v2/ replaces it), the old Sanity project `zp0drmxt`, the records of curhat.space, and the empty zone copymarky.site. The zone amhere.fyi has no records but stays, because Cloudflare cannot delete a zone that its Registrar holds. Also removed: bear-assets.nibras.co (two records and the redirect rule "bear assets" to Bear's image bucket). Every Bear image is a Sanity asset now, and no page links to that name.
