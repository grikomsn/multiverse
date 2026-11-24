# AGENTS.md — multiverse

Monorepo for Griko Nibras's sites and the Sanity CMS that feeds them. Becomes the new nibras.co.

## Layout

| Path                           | What                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------- |
| `apps/web`                     | nibras.co — Astro 7, static; Worker for `/mcp`, `/resume.pdf`, Markdown answers |
| `apps/archive`                 | archive.nibras.co — every past version, rebuilt, under `/<edition>/`            |
| `apps/links`                   | nbr.st — short links; one Worker that reads KV, with caching and pattern rules  |
| `apps/studio`                  | Sanity Studio (project `lboasusv`, dataset `production`); one-off `scripts/`    |
| `apps/cli`                     | `npx grikomsn` — the home page as a terminal card (Ink), one file with no deps  |
| `packages/sanity`              | Schema, Studio structure, singletons, constants, generated `sanity.types.ts`    |
| `packages/content`             | Shared Sanity client factory and format helpers (dates, image URLs, grouping)   |
| `packages/config`              | Shared tsconfig and ESLint flat configs                                         |
| `packages/ui`                  | Shared design: tokens and prose CSS, font config, header, footer, command bar   |
| `docs/`                        | Content model and legacy-site research (`docs/legacy/`)                         |
| `assets/` `references/` `tmp/` | Local-only working material, gitignored (licensed fonts, resumes, exports)      |

## Commands

Bun 1.4.4, Node ≥ 22.23.4. Run from the root unless noted.

```bash
bun install
./scripts/subset-fonts.sh         # once: licensed fonts → assets/fonts/web (gitignored)
./scripts/r2-fonts.sh put         # after subset-fonts.sh: copy the fonts to R2 for deploys
./scripts/make-icons.sh           # after packages/ui/src/gri.ts changes: mascot.svg, favicons for every app, the CLI's pixels
bun run dev                      # all apps via Turbo
bun run --filter web dev         # http://localhost:4321
GITHUB_TOKEN=$(gh auth token) bun run --filter web dev  # project stars without GitHub's 60/hour limit
./scripts/fetch-allo.sh && SITE_FONT=allo bun run --filter web dev  # Allo (OFL) instead of Timeless Sans, for checkouts without the licensed fonts
bun run --filter archive dev     # http://localhost:4322 (Astro 7 daemonizes; `astro dev stop`)
bun run --filter studio dev      # http://localhost:3333
# In dev, web and archive link to each other on :4321 and :4322; PUBLIC_WEB_URL / PUBLIC_ARCHIVE_URL override
bun run --filter links dev       # http://localhost:4323 (needs a Cloudflare login; reads the real KV)
bun apps/cli/scripts/dev.ts      # the terminal card (`npx grikomsn`), from the source, with today's facts
bun run check                    # lint, typecheck and tests everywhere
bun run build
bun run format
bun run --filter studio typegen  # after schema or GROQ changes
```

## Conventions

- **Versions** live once in the root `package.json` `catalog`; workspaces use `"catalog:"`. Pin exact versions released at least two weeks ago.
- **Updates**: Renovate (`renovate.json`) updates GitHub Actions, Bun and `.node-version` after 14 days. It cannot read Bun catalogs yet, so catalog versions change by hand. Never update the named `catalogs` or the archive-only packages that `renovate.json` disables: they are the versions each legacy edition shipped with.
- **CI** (`.github/workflows/check.yml`) runs `format:check` and `check` (lint, typecheck, tests) on pushes to `main` and on pull requests. It has no secrets and no fonts, so it does not build. Deploy builds; see below.
- **TypeScript 6.0.x**, not 7: `astro check` (Volar) needs the programmatic compiler API that TS 7 does not ship yet.
- **Schema** (`packages/sanity/src/schema`): kebab-case files, named exports, `defineType`/`defineField`/`defineArrayMember`, icons from `@sanity/icons/<Name>` subpaths. Model meaning, not presentation. Never delete a field that holds data: deprecate → migrate → remove.
- **Singletons** use Studio's `document.singletons` API (`packages/sanity/src/singletons.ts`): `profile` and `site`. Each document's `_id` is its type name.
- **One place for each fact.** A role, city, link or address is stored once. Descriptions, pages and old designs build text from it (`siteDescription`, the `profileLinks` block, `PROJECT_SOURCES`). Platform names live in `SOCIAL_PLATFORMS` (`@multiverse/sanity/constants`), brand marks in `@multiverse/ui/brand-marks`. Code that needs the name when Profile is missing uses `FALLBACK_NAME`, and the header, command bar and llms.txt take the main pages from `KEY_PAGES` (both in `@multiverse/sanity/constants`).
- **Dataset is public** (private datasets are not available on the plan): every published document is world-readable. Dot-free `_id`s everywhere (`project-graz`, `edition-v4`); an `_id` containing a `.` is hidden from unauthenticated reads, so use one only to deliberately hide a document.
- **Content edits** happen in Studio, which keeps each document's history. Write a script only for a migration: a schema change that moves data, or a change across many documents. Run it from `apps/studio` with `bunx sanity exec <file> --with-user-token`, use deterministic `_id`s, export a backup first, and delete the script once it has run. Git history keeps it, and `docs/content-model.md` records what it did. The only script that stays is `apps/studio/scripts/editions/screenshots.ts`, a tool for the archive index.
- **Paths** in docs, comments and Sanity text are repo-relative (`tmp/multiverse-v4.zip`) or described in words, never absolute machine paths. The repo and the dataset are public.
- **Redirects** are not documents. A post or page lists its old addresses in `aliases`; other nibras.co rules live in `apps/web/src/pages/[file].ts`. nbr.st short links live only in the KV namespace that `apps/links` reads, and must not be copied into the dataset or the repository.
- **Queries**: `defineQuery` from `groq`, unique `SCREAMING_CASE` names, one `queries.ts` per app. Projections that two queries share are fragments in `packages/content/src/fragments.ts`. Typegen scans `apps/*/src` and writes `packages/sanity/src/sanity.types.ts` (committed).
- **Deploys**: Workers with static assets (`wrangler.jsonc`), not Pages, named `multiverse-<app>`. Fully static apps have no `main`. `.github/workflows/deploy.yml` deploys after Check passes on `main` and when Sanity publishes. The build gets the fonts from the private R2 bucket `multiverse-build` (`./scripts/r2-fonts.sh`). Setup and the cutover: [docs/deploy.md](docs/deploy.md).
- **Fonts** are licensed for embedding only and must not enter git. `./scripts/subset-fonts.sh` (needs uv) instances and Latin-subsets them into `assets/fonts/web/*.woff2`, with only the common OpenType features, which every app loads through `siteFont()` from `@multiverse/ui/fonts` (Astro Fonts API; `SITE_FONT=allo` swaps in Allo); run it once on a fresh checkout before building, and run `./scripts/r2-fonts.sh put` after it changes a file. Keep its weight ranges in sync with that helper.
- **Interface copy** (labels, headings, buttons, descriptions, docs) follows ASD-STE100 Simplified Technical English: sentences of 20 words or fewer, one idea per sentence, active voice, common words, one term per thing ("Blog" and "posts", not also "Writing" and "articles"). Text says what things are. Posts and legacy editions keep their original wording.
- **Quality bar** for new pages: no horizontal overflow at 320 px, tap targets at least 24 px, mobile Lighthouse 95+ in every category, motion that follows the rules in [docs/redesign.md](docs/redesign.md#motion-and-dither) and stops for `prefers-reduced-motion`.
- **Design** follows what the earlier versions share (see [docs/redesign.md](docs/redesign.md)): Timeless Sans, a narrow column, amber link underlines, light and dark through `light-dark()` tokens. Shared parts live in `packages/ui`; an app keeps only components that no other app uses. Dither is the one visual motif: the hero wave is a shader (`@multiverse/ui/dither-wave.astro`), and everything else draws through `@multiverse/ui/dither`.
- **Mascot**: Gri, a cartoon face of Griko on the site's amber. `packages/ui/src/gri.ts` is the one drawing, with 16 moods. `@multiverse/ui/gri.astro` draws it in a page, and `showMood()` from `@multiverse/ui/gri-moods` changes its mood; a mood's move plays once and nothing loops (see [docs/redesign.md](docs/redesign.md#mascot-and-icons)). `./scripts/make-icons.sh` (needs rsvg-convert and ImageMagick) writes `mascot.svg`, every app's favicons and the CLI's pixels (`apps/cli/src/faces.gen.ts`) from the drawing; commit what it writes. The smile is also the `portrait-gri` document, which the profile's `icon` points at. Legacy editions keep their own icons.
- **Command bar** (⌘K, Ctrl K or `/`): `@multiverse/ui/command-bar.astro`, in the shared header. It lists what `apps/web/src/lib/commands.ts` puts in `/commands.json`, so a new page that is not a Sanity document needs a line there. A new action is a row in `packages/ui/src/command-bar.ts`. See [docs/redesign.md](docs/redesign.md#command-bar).
- **Canvases cannot read Sanity images.** `cdn.sanity.io` answers 403 to a cross-origin read from an origin that is not on the project's allow-list. A page that draws a picture on a canvas inlines a small copy at build time (`apps/web/src/lib/inline-image.ts`).
- **Legacy editions** keep their original look; the shared design applies to web and the archive index. Every edition shows today's content, and no fact comes from the period. `src/lib/live.ts` builds each edition from current documents. `src/editions/<key>/live.ts` holds the design's interface copy (page headings, nav labels) and how it phrases facts. The `edition` document holds only what the index lists and the design assets (`assets`). Footers state today's stack and host through `src/editions/_kit/colophon.ts`. The archive build fails if a page states a period fact (`scripts/check-period-facts.ts`). Edition code builds paths from `import.meta.env.BASE_URL`, and helpers shared by editions live in `src/editions/_kit/`. See [docs/legacy/README.md](docs/legacy/README.md) and [docs/redesign.md](docs/redesign.md).

## Apps

The resume (`/resume`), the gallery (`/media`), `llms.txt` and the MCP server all live in `apps/web`. See [docs/apps/web.md](docs/apps/web.md).

The terminal card (`npx grikomsn`) is `apps/cli`. It reads its facts from `/card.json` on nibras.co (`getCard()` in `@multiverse/content/card`), and holds no fact of its own. How it maps the site's design and motion to a terminal, the build and the release are in [docs/apps/cli.md](docs/apps/cli.md). Publish to npm only when the user asks.

Short links (nbr.st) are `apps/links`: how to add a link or a pattern rule, the caches and the cutover are in [docs/apps/links.md](docs/apps/links.md).

Outside profiles (LinkedIn, GitHub, Bluesky and others) copy their facts from Sanity. Sync them only when the user asks, and follow [.claude/skills/sync-profiles/SKILL.md](.claude/skills/sync-profiles/SKILL.md).

## Content model

See [docs/content-model.md](docs/content-model.md).
