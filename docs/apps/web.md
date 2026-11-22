# nibras.co (`apps/web`)

The whole site: blog, pages, Work, the resume, the media gallery, and the Markdown and MCP views for AI tools. Static Astro output served as Workers static assets. A small Worker (`src/worker/index.ts`) runs only for the paths in `run_worker_first` (`wrangler.jsonc`). Every other path is a static file.

The resume and the gallery were separate sites (resume.nibras.co, media.nibras.co) until November 2026.

## Routes

| Route                                              | Served by      | Notes                                                                                                                      |
| -------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `/`                                                | Worker → asset | Browsers get the page. `Accept: text/markdown` and curl get `/llms.txt`                                                    |
| `/<slug>`                                          | asset          | Posts and pages, at their Bear Blog URLs                                                                                   |
| `/work`, `/blog`                                   | asset          | Usage numbers on Work come from GitHub, npm and the Marketplace at build (`lib/metrics`)                                   |
| `/resume`                                          | Worker → asset | Same negotiation as `/`, with `/resume.md`                                                                                 |
| `/resume/ats`                                      | asset          | The resume alone, light, `noindex`. The source of `/resume.pdf`                                                            |
| `/resume/cover-letters/<slug>`                     | asset          | `coverLetter` documents. `noindex`, not in the sitemap, disallowed in robots.txt                                           |
| `/resume/og`                                       | asset          | Source of `public/resume.png` (the Open Graph card). Screenshot command in the file                                        |
| `/resume.pdf`                                      | Worker         | Browser Run renders `/resume/ats` once per Worker version, kept in R2 (`blob1`) and cache                                  |
| `/media`                                           | asset          | Portrait gallery with a lightbox and download links. Pictures develop from dots (`src/scripts/develop.ts`)                 |
| `/ai`                                              | asset          | How to use the site with AI tools: MCP setup and Markdown files                                                            |
| `/llms.txt`, `/llms-full.txt`                      | asset          | An index of every Markdown page, and all of them in one file                                                               |
| `/<page>.md`                                       | asset          | Markdown copy of each post, page, `/resume`, `/work`, `/blog` and `/media`                                                 |
| `/llms.json`                                       | asset          | Every document as JSON. The MCP server reads it                                                                            |
| `/feed.xml`, `/rss.xml`, `/atom.xml`, `/feed.json` | asset          | Listed posts as RSS 2.0, Atom and JSON Feed (`src/lib/feed.ts`). Version 9 served `/rss.xml`, `/atom.xml` and `/feed.json` |
| `/mcp`                                             | Worker         | Stateless Streamable HTTP (`agents/mcp/server`, MCP SDK v2). No sign-in                                                    |

## Markdown and MCP

`src/lib/llms.ts` builds one index of the site at build time: top-level documents (resume, Work, blog, media, each page and post) and one entry per role, project, talk, community role and school. Posts and pages go through `src/lib/markdown.ts` (Portable Text to Markdown). The resume text comes from `src/lib/resume/markdown.ts`, the same text as the page and the PDF.

The MCP server (`src/worker/mcp.ts`) reads `/llms.json` from the deployed assets, so its answers match the pages. Tools: `search`, `get_document`, `list_documents`, `get_resume`. Prompt: `assess_fit`. Resources: `nibras://llms.txt`, `nibras://resume.md`. Search lives in `src/lib/site-index.ts`, which has no Astro or Sanity imports so the Worker can use it.

## Resume data

`RESUME_QUERY` reads everything with `onResume != false`, in `orderRank` order. `src/lib/resume/resume.ts` maps it to flat entries that the page, the PDF, Markdown and MCP share. Experience uses `highlights`, or the `body` text when there are none. Projects with VS Code extensions get a usage line from the Marketplace (`src/lib/resume/usage.ts`).

`tools/generate-ats-backup.py` builds DOCX and PDF backups from `https://nibras.co/resume.md` (see `--help`; needs `python-docx` from `tools/requirements-ats-backup.txt`, and LibreOffice for PDF).

`tools/sync-bearblog.ts` copies posts and pages from Sanity to the Bear Blog that serves nibras.co until the cutover. It uses the [Bear Blog API](https://docs.bearblog.dev/api/). It sends only fields that differ and never deletes. It skips Bear drafts, cross-post stubs (Bear posts with a `canonical_url`), and `schedule` and `resume`. Without `--apply` it only shows the changes. With `--apply` it backs up every Bear item it changes to `tmp/bearblog/` first. Set `BEARBLOG_API_KEY` (Bear dashboard → Settings → API).

## Commands

```bash
bun run --filter web dev          # http://localhost:4321 (Astro only; no Worker routes)
bun run --filter web build
bun run --filter web preview      # wrangler dev on the build; Browser Run and R2 need Cloudflare auth
bun run --filter web deploy
bun run --filter web cf-typegen   # after changing wrangler.jsonc bindings
```
