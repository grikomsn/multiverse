# Legacy versions v7, v8, v8b: archive assessment

Scope: `multiverse-v7` (commit `d2f2d849`), `multiverse-v8` (commit `035089e1`), `multiverse-v8b` (commit `5398c0ac`), including `sites/griko.dev`.
This is a read-only analysis, written 2026-11-15. Nothing was installed, built, or executed.

Path shorthands used below:

- `V7/` = `…/archives/multiverse-v7/multiverse-d2f2d849931f5965c75b4f47571387a2b84900f2/`
- `V8/` = `…/archives/multiverse-v8/multiverse-035089e1e4ace77822db2a0233d85d05601eae6c/`
- `V8B/` = `…/archives/multiverse-v8b/multiverse-5398c0ac952c1ed9b8e21b6e2a1eed46aca5a24e/`
- `ID/` = `sites/griko.id/` inside V8 or V8B

## Summary table

| Entry                                    | Era           | Recommendation                                                                | Why                                                                                                                                     |
| ---------------------------------------- | ------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **v7** (griko.id, Chakra + DatoCMS)      | ~Apr–Dec 2021 | **B** if Wayback payloads can be recovered, otherwise **D**                   | DatoCMS is gone (asset CDN 404s), and the code cannot build without it. The content survives only in Wayback `__NEXT_DATA__`.           |
| **v8** (griko.id, Next + MDX + Tailwind) | ~Jan 2022     | **No separate entry.** Fold it into v8b as a footnote or variant (**D** link) | v8b is a superset with copy and polish changes. No v8-only Wayback snapshot is listed in the `nbr.st` redirects.                        |
| **v8b** (griko.id)                       | ~Mar–May 2022 | **B** (Astro port with frozen MDX content)                                    | All content is already local MDX, Astro supports MDX natively, and the interactive bits are small islands.                              |
| **griko.dev** (v8/v8b monorepo)          | Jan–May 2022  | **D** (document only)                                                         | Not a website. It was a Cloudflare Worker short-link redirector backed by Airtable, and nbr.st plus the new `redirect` type replace it. |

Wayback matching (from the `nbr.st` redirects, fetched with curl because WebFetch is blocked for archive.org):

- `2021` → `web.archive.org/web/20211128092119/https://griko.id/` = **v7**. It shows nav "Home Blog Appearances Projects About", the footer text "Made using Next.js, Chakra UI, and DatoCMS… Version 7.", and Archivo/Manrope Google Fonts. Its `__NEXT_DATA__` contains the full DatoCMS JSON payload.
- `2022` → `…/20220404093816/https://griko.id/` = **v8b**. It has the "Doing frontend development at Strangelove Ventures" copy, loads `berkeley-mono.griko.id/index.css`, and the footer says "Version 8."
- `2022a` → `…/20220606090450/https://griko.id/` = **not v7, v8, or v8b**. The home page lists projects, appearances, and posts up to "Hello, Junior." (2022-06-06), the nav is "About Work Talk Blog Contact", and there is no "Version" footer. It is most likely v9, so it belongs to whoever covers v9.
- No v8 (pre-b) snapshot is listed. By zip file dates, v7 was last touched 2021-12-08, v8 2022-01-26, and v8b 2022-03-25.

---

## v7: griko.id "Version 7" (Chakra UI + DatoCMS)

### 1. TL;DR

v7 was a dark, centered Chakra UI site whose content came entirely from DatoCMS through `graphql-request`. It had a blog, appearances (talks), a projects showcase, about, tag pages, and generic CMS pages. The DatoCMS project and its assets are gone (`datocms-assets.com/42475/*` returns 404), so the original code cannot build. **Recommend B.** Recover the content from Wayback `__NEXT_DATA__` and `_next/data/*.json` captures into static JSON, then rebuild about eight routes in Astro with the Chakra look. If the Wayback captures turn out too sparse, fall back to **D**.

### 2. Overview

- **Era:** about April 2021 (the DatoCMS asset timestamp `1619221164` is 2021-04-23) to December 2021 (zip date 2021-12-08). Live on griko.id until roughly January 2022.
- **Stack:**
  - Lerna 4 + Yarn 1 workspaces (`V7/lerna.json`, `V7/package.json`). Node `14.*` (`V7/.nvmrc`).
  - Next.js 12.0.2 (locked), React 17. Production client builds alias React to `preact/compat` (`V7/packages/v7/next.config.js`).
  - Chakra UI 1.6.10, Emotion 11 with an SSR cache, framer-motion 4.
  - `react-markdown` 6.0.2 + `react-syntax-highlighter` (Prism), `react-datocms` 1.6.6, `graphql-request` 3 + graphql-codegen.
  - tinykeys, zustand 3, nprogress, next-seo, next-sitemap, fathom-client, react-icons.
- **Packages:**
  - `packages/v7`: the site.
  - `packages/shared`: the DatoCMS client (`lib/datocms-client.js`), a `next-connect` API helper, and `trimHttps`.
- **Deploy target:** Vercel (`V7/packages/v7/vercel.json`, footer copy). A `build:static` script (`next export`) exists, but the site normally deployed as SSG on Vercel.
- **Domain:** `https://griko.id` (`V7/packages/v7/config/site.js`). The DatoCMS admin was `griko-id-v7.admin.datocms.com`.

### 3. Route inventory

| Path                        | File                                | Shows                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                         | `pages/index.tsx`                   | Round avatar from the DatoCMS `_site.favicon` (a memoji PNG) linking to /about, the "Hey! I'm Griko Nibras." heading, the global SEO description, and an email/Twitter line. The 2021 snapshot reads "Remote software developer doing web dev things. Currently based on Surabaya, Indonesia. Working for a startup based on Toronto, Canada." |
| `/blog`                     | `pages/blog/index.tsx`              | All posts (paged 100 at a time), each as a card with cover, date, title, subtitle, and tag chips                                                                                                                                                                                                                                               |
| `/blog/[slug]`              | `pages/blog/[slug].tsx`             | Cover hero, title, subtitle, publish date, tags, Markdown body (remark-slug, remark-toc, a11y-emoji), copy-to-clipboard code blocks, "Back to top", BlogJsonLd/BreadcrumbJsonLd                                                                                                                                                                |
| `/appearances`              | `pages/appearances.tsx`             | Talks/podcasts/workshops sorted by date desc. Each card has a category icon, date, title, subtitle, URL, and tags.                                                                                                                                                                                                                             |
| `/projects`                 | `pages/projects.tsx`                | `allShowcases` sorted by position, in a 2-column grid of 16:9 images with a hover overlay (title, subtitle, URL, tags)                                                                                                                                                                                                                         |
| `/about`                    | `pages/about.tsx`                   | Cover image, Markdown preface, a "knowledge bases" grid (title + comma-separated entries), and the email plus social links from `socialsJson`                                                                                                                                                                                                  |
| `/tag/[slug]`               | `pages/tag/[slug].tsx`              | Everything tagged: appearances, posts, and showcases                                                                                                                                                                                                                                                                                           |
| `/[slug]`                   | `pages/[slug].tsx`                  | Generic DatoCMS `page` (title, subtitle, "last updated", Markdown)                                                                                                                                                                                                                                                                             |
| `/404`, `_error`            | `pages/404.tsx`, `pages/_error.tsx` | Centered message                                                                                                                                                                                                                                                                                                                               |
| `/api/ping`                 | `pages/api/ping.ts`                 | Returns `200 OK` (server-only, so drop it)                                                                                                                                                                                                                                                                                                     |
| `sitemap.xml`, `robots.txt` | next-sitemap (`config/sitemap.js`)  | Generated at build time                                                                                                                                                                                                                                                                                                                        |

The navigation list lives in `V7/packages/v7/routes.js`: Home, Blog, Appearances, Projects, About.

### 4. Content and data sources

All content came from DatoCMS through the GraphQL documents in `V7/packages/v7/graphql/client/**`. Generated types are in `generated/graphql.ts`, and the schema snapshot is in `schema.graphql` (3,544 lines). At build time `scripts/prefetch-meta.js` wrote `generated/meta.json` (gitignored, so it is not in the archive).

| DatoCMS model (fields queried)                                                                                                                                        | Query file                                     | New Sanity mapping                                                                                                                                             | Notes / gaps                                                                                                                                                                                                                                      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `about` singleton: `coverImage`, `preface` (markdown), `knowledgeBases[] → EntryRecord{title, entries}`, `email`, `socialsJson` (JSON map name→URL), `updatedAt`      | `about/queries.graphql`, `seo/queries.graphql` | `profile` (bio ← preface, email, social links ← socialsJson), `skillGroup` (title ← kb.title, items ← `entries.split(", ")`), `portrait` (cover)               | `entries` is one comma-separated string, so split it. Preface is Markdown and needs converting to Portable Text.                                                                                                                                  |
| `appearance`: `title, subtitle, date, url, category, tags[]`                                                                                                          | `appearances/*.graphql`                        | `talk` (event/title, date, slides/recording ← url). `category` is one of `lightning-talk`/`podcast`/`talk`/`workshop` (`components/appearance-item/icons.ts`). | **Gap:** the new `talk` type needs a `format` or `kind` enum with these values. Podcasts arguably fit `talk` with `format: podcast`. Current Sanity `appearance` has 5 docs (title, date, event, url, description, body) and no category or tags. |
| `showcase`: `title, subtitle, url, image (16:9 crop), position, tags[]`                                                                                               | `projects/*.graphql`                           | `project` (name, summary ← subtitle, url, cover ← image, order ← position)                                                                                     | The images were on the DatoCMS CDN, which is now dead.                                                                                                                                                                                            |
| `post`: `title, subtitle, slug, cover, content (markdown), tags[], _publishedAt, _updatedAt, _seoMetaTags`                                                            | `posts/*.graphql`                              | `post` (excerpt/description ← subtitle, body ← Markdown→PT, cover, publishedAt)                                                                                | **Gap:** the new schema has no tags. v7 has `/tag/*` pages.                                                                                                                                                                                       |
| `page`: `title, subtitle, slug, content (markdown), _seoMetaTags`                                                                                                     | `page/*.graphql`                               | `page`                                                                                                                                                         | We don't know which pages existed. Likely `uses` and similar.                                                                                                                                                                                     |
| `tag`: `title, slug`                                                                                                                                                  | `tags/queries.graphql`                         | **None in the new schema**                                                                                                                                     | For option A, add a `tag` type or a `tags: string[]` field on post/project/talk. For option B, freeze the tags as static JSON.                                                                                                                    |
| `_site`: `favicon` (also the home avatar), `faviconMetaTags`, `globalSeo{siteName, titleSuffix, twitterAccount, fallbackSeo{title, description, image, twitterCard}}` | `home/queries.graphql`, `seo/queries.graphql`  | `site` (title, SEO, twitter handle) + `portrait` (memoji)                                                                                                      |                                                                                                                                                                                                                                                   |

**Is the content recoverable?**

- **DatoCMS:** effectively no. The asset URLs from the README and the snapshot (`https://www.datocms-assets.com/42475/1619221164-memoji.png`, `…/1619221965-social.png`) return 404, so the project is most likely deleted or expired. Whether the API key still works is unknown, and none is stored in the repo.
- **Wayback:** yes, partly. The 2021-11-28 home snapshot embeds `__NEXT_DATA__` with the complete `pageProps` JSON (including `responsiveImage` with a base64 LQIP and srcsets). Every SSG page in v7 works the same way, and Next also emits `/_next/data/<buildId>/<route>.json`.

  I could not enumerate archived subpages because archive.org rate-limited and then refused connections from this machine. **Follow-up:** run `https://web.archive.org/cdx/search/cdx?url=griko.id/*&from=2021&to=2022&fl=timestamp,original,statuscode&filter=statuscode:200&collapse=urlkey` from a browser and pull `/blog`, `/blog/*`, `/about`, `/appearances`, `/projects`, `/tag/*`, plus any `_next/data` JSON. Image binaries are recoverable only where Wayback captured the `datocms-assets.com` URLs, which carry imgix params.

- **Posts:** the v7 posts were very likely the same set that v8 later moved to MDX (the FOUC post is about this exact v7 Chakra setup). Their bodies therefore exist in v8b MDX and in current Sanity, so only v7-specific post metadata (covers, tags, subtitles) depends on Wayback.
- **Appearances:** current Sanity has 5 (Automate Social Images, Deno In A Nutshell, Hooks In A Nutshell, Landing Page in 5 Minutes, Slick and Clean JavaScript). The June 2022 snapshot also lists mentoring entries such as "DILo x Cilsy: #DILoDevelopersClass", which map to `involvement`. The v7 list probably held both kinds and needs splitting into `talk` and `involvement`.
- **About, knowledge bases, socials:** Wayback only.

### 5. Assets

- **Images:** all were on DatoCMS (memoji avatar/favicon, about cover, post covers, showcase images, social OG `social.png`), and all are dead now. There is no `public/` folder in the repo.
- **Fonts:**
  - Google Fonts **Archivo** (400–700 plus italics) for body text and **Manrope** (700/800) for headings (`pages/_document.tsx`, `theme/index.ts`). Both are OFL, so self-host them via Fontsource.
- **Icons:** `react-icons`. Fa: GitHub, Twitter, Bars, ChevronUp, Copy, Check, Bolt, Microphone, RegCommentAlt, Chalkboard, GlobeAsia. Bi: BiCommand. Any equivalent icon set (Font Awesome SVGs) works.
- **Code theme:** a custom Prism theme close to Atom Dark (`components/markdown/prism-theme.ts`, base color `#c5c8c6`).
- **OG:** the DatoCMS `globalSeo.fallbackSeo.image` and per-post covers. There was no OG generation.
- **Favicons:** from DatoCMS `faviconMetaTags`.

### 6. Interactive features and runtime dependencies

| Feature                                                                  | Implementation                                                                     | 2026 status / static replacement                                                                                      |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Keybinds (`g h`, `g b`, `g a`, `g p`, `g m`, `g d`, `Shift+?`, `Meta+K`) | tinykeys + Chakra toasts (`hooks/use-keybinds.ts`, `lib/keybinds.ts`)              | Port as a small vanilla script, since tinykeys has no deps. Drop `g d` because the DatoCMS dashboard is dead.         |
| Keybinds cheatsheet modal, synced across tabs via `BroadcastChannel`     | zustand store (`store/global.ts`), `components/keybinds-cheatsheet`                | Use a `<dialog>` element. The BroadcastChannel sync is a fun detail worth keeping.                                    |
| Mobile drawer and a floating "Open menu" pill                            | Chakra Modal + SlideFade                                                           | `<dialog>` + CSS                                                                                                      |
| nprogress bar (gradient whiteAlpha → yellow.200)                         | `hooks/use-nprogress.ts`                                                           | Not needed for an MPA, or use Astro view transitions                                                                  |
| Copy-snippet button on code blocks                                       | Chakra `useClipboard`                                                              | Small script                                                                                                          |
| Fathom analytics, site `LXIEGXNR`, event `U0UHJABQ`                      | `config/analytics.js`, `hooks/use-fathom*.ts`                                      | **Drop** (legacy site ID)                                                                                             |
| DatoCMS client                                                           | `packages/shared/lib/datocms-client.js` (env `NEXT_PUBLIC_DATOCMS_PUBLIC_API_KEY`) | **Dead.** No key is committed. If the old read-only key is still active anywhere (for example Vercel env), revoke it. |
| CSP and security headers                                                 | `next.config.js`                                                                   | Move to Workers `_headers` if wanted                                                                                  |

### 7. Visual identity

- **Theme:** dark-only Chakra. Body `gray.900` (#171923), text `whiteAlpha.900`, borders `whiteAlpha.300`, selection `whiteAlpha.400`.
- **Accent:** Chakra `yellow.200` (#FAF089) for links, the active nav item (`colorScheme="yellow"`), and the nprogress end color.
- **Type:** Manrope 800 headings with `letterSpacing: tighter`, Archivo body.
- **Layout:** everything is centered. Containers are `maxW 4xl`/`6xl` with `p={[4,8]}`. The sticky top nav is a centered row of ghost buttons, `backdrop-filter: blur(12px)` on 60% gray.900, with a 2px bottom border at `whiteAlpha.50`.
- **Signature effects:**
  - `whiteAlpha.50` cards that lift `-4px` with a bigger shadow on hover.
  - Showcase images blur 2px on hover while a `blackAlpha.700` overlay fades in.
  - The round avatar on the home page uses a Safari mask fix.
  - Modal overlays use a 4px backdrop blur.
  - On mobile, a floating blurred "Open menu" pill sits at the bottom.

### 8. Effort and recommendation

| Option                           | Effort                                                                     | Notes                                                                                                                                                                                                                                                                                           |
| -------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Astro port fed by current CMS | **L**                                                                      | Needs tags, talk category, and knowledge-base fields added to the new schema. The result would be the 2021 look with 2026 content, which misrepresents what v7 said, and all project images would need replacing.                                                                               |
| B: Astro port with frozen JSON   | **M** (S–M for rebuilding about eight routes, plus M for Wayback recovery) | Recover `__NEXT_DATA__` per route into `legacy/v7/data/*.json`, download whatever images Wayback captured into the app, and convert the Markdown bodies at build time (the Markdown can stay Markdown, no PT needed). Rebuild the Chakra look with Tailwind 4 tokens.                           |
| C: original toolchain build      | **L / effectively infeasible**                                             | Needs Node 14 (no official darwin-arm64 build, so Docker `node:14`), Yarn 1, Lerna, and Next 12.0.2. It also needs a live DatoCMS API and project, which is gone. Making it work would mean stubbing `getSdk` with recovered JSON, and that is the B work anyway, kept inside a dead framework. |
| D: archive only                  | **S**                                                                      | Link to commit `d2f2d849`, the 2021-11-28 Wayback snapshot, and screenshots                                                                                                                                                                                                                     |

**Recommendation: B, with D as the fallback.** Start with D, which costs almost nothing. Upgrade to B once the CDX enumeration shows that `/blog`, `/about`, `/appearances`, and `/projects` payloads were archived.

### 9. Risks and open questions

- Wayback coverage of v7 subpages and DatoCMS images is unknown, because enumeration was blocked.
- `generated/meta.json` (socials, global SEO) is not in git. It is only recoverable from snapshot HTML.
- Which DatoCMS `page` slugs existed? If unrecoverable, B ships without `/[slug]` pages.
- Tag pages: decide whether to rebuild `/tag/*` in B (static JSON makes this cheap) or skip them.
- Licensing: Archivo and Manrope are OFL, so that is fine. The copy says "Contents licensed under CC BY-NC-SA 4.0" and links to `griko.dev/cc-by-nc-sa`, which is now dead. Point it to the creativecommons.org URL instead.

---

## v8: griko.id "Version 8" (personal-websites Turborepo, January 2022)

### 1. TL;DR

v8 is the first cut of the Next.js + MDX + Tailwind rewrite. It shares about 95% of its code and content with v8b (see the diff below). **Recommend no separate archive entry.** Build the "v8" archive from v8b, and record v8 as a footnote with the commit link (**D**, S effort). Two v8-only details are worth keeping: the animated gradient glow and the lockfile-trace playground.

### 2. Overview

- **Era:** January 2022 (zip date 2022-01-26, latest post dated 2022-01-22).
- **Stack:**
  - Yarn 1 workspaces + Turborepo 1.0.28 (the turbo config sits inside the root `package.json`). Node `14.*`.
  - Next 12.0.8, React 17, `@mdx-js/*` **2.0.0-rc.2** (patched: `V8/patches/@mdx-js+mdx+2.0.0-rc.2.patch`, `V8/patches/vfile+5.3.0.patch`).
  - Tailwind 3.0.16, kbar 0.1.0-beta.27, shiki 0.10.0, Sentry 6.17, `classnames`.
- **Deploy target:** Vercel (`ID/vercel.json`, `vercel-build` script).
- **Domain:** griko.id.

### 3. What v8 has that v8b doesn't

- **Animated gradient glows** (`V8/ID/layouts/default.tsx`):
  - `HeaderGradient`: sky-500 → green-500 → fuchsia-500 at opacity 30, blur-2xl, 128px tall, offset -64px.
  - `FooterGradient`: amber → indigo → emerald, rounded-t-full, at opacity 20.
  - Both use `motion-safe:animate-rotate-colors`, a 60s `hue-rotate(0→360deg)` keyframe from `V8/ID/tailwind.config.js`.
  - The OG frame (`pages/_/opengraph/main.tsx`) uses the same gradients.
- **JetBrains Mono** through `@fontsource/jetbrains-mono` (`pages/_app.tsx`). v8b switches to Berkeley Mono.
- **`/playground/lockfile-trace`** (`V8/ID/pages/playground/lockfile-trace.tsx`, `V8/ID/pages/api/data/lockfile-trace.ts`, `V8/ID/lib/lockfile-trace.ts`, `V8/packages/lockfile-trace/`):
  - A full-screen React Flow (`react-flow-renderer` 9) graph of the monorepo's `yarn.lock` dependency tree, laid out with dagre.
  - The data is pre-built by `packages/lockfile-trace/build.mjs` and served by an API route.
  - It could be ported to a static JSON file plus an `@xyflow/react` island, but it is a novelty.
- Custom `p-inline-start`/`p-inline-end` utilities.
- The home copy says "Doing open source projects at Koding Ninja", with no Strangelove mention.
- The about page lists "Software Developer at Undisclosed Company (May 2020 - present)".
- There is no `new-place-new-chapter` post.
- The multiverse links point at `/commits/<sha>` rather than `/tree/<sha>`.
- `sites/opengraph.griko.id/README.md` points to the separate repo `grikomsn/opengraph.griko.id`.

Everything else is identical to v8b apart from class-order lint fixes and `classnames`→`clsx`. Sections 3–7 of v8b apply.

### 8. Effort

| Option             | Effort              | Notes                                                                                                                        |
| ------------------ | ------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| A                  | L                   | Same as v8b                                                                                                                  |
| B (separate entry) | **S on top of v8b** | Add a `variant: "v8"` flag that turns on the gradients and JetBrains Mono, swaps the home and about copy, and hides one post |
| C                  | M                   | Same caveats as v8b, plus MDX rc.2 patches                                                                                   |
| D                  | **S**               | Link to commit `035089e1`. No Wayback snapshot is known.                                                                     |

**Recommendation:** D for v8 as such. Bring the gradient glow into the v8b port as an optional flag if the owner likes it.

---

## v8: griko.dev (short-link redirector)

### 1. TL;DR

griko.dev was **not a website**. It was a roughly 40-line Cloudflare Worker named "tableflare" (`V8/sites/griko.dev/index.mjs`):

- `/` redirected 307 to `https://griko.id`.
- `/<slug>` looked up an Airtable table named `Tableflare` (`filterByFormula: AND(Slug="<slug>",Active)`) and redirected 307 to its `URL` field.
- Responses were cached in `caches.default`, and `?force` purged the cache entry.

It was published by GitHub Actions through `cloudflare/wrangler-action` (`V8/.github/workflows/publish.yml`). The README also mentions `https://status.griko.dev`. **Recommend D.** Document it in the archive index; its function now lives in nbr.st and the new `redirect` Sanity type.

### 2–9. Details

- **Config:** `V8/sites/griko.dev/wrangler.toml` holds the Cloudflare `account_id` and `zone_id`. These are identifiers, not secrets, but they are public in the repo. The Airtable base ID and key were Wrangler secrets (`AIRTABLE_BASE`, `AIRTABLE_KEY`) and are not in the repo. Airtable retired legacy API keys in early 2024, so the Worker would fail even if deployed.
- **Known slugs:** only `griko.dev/cc-by-nc-sa`, used by the v7/v8 footers. The redirect table itself lived in Airtable and is not recoverable from the repo. If the owner still has that Airtable base, export it into the new `redirect` type or nbr.st's `redirects.jsonl`.
- **Effort:** A, B, and C are not applicable. A rebuild as a Worker plus `redirect` docs would be S, but nbr.st already covers it. **D: S.**
- **Status:** `griko.dev` and every `*.griko.id` helper subdomain fail to connect today. The helper subdomains are `opengraph.`, `berkeley-mono.`, `twemoji-cdn.`, and `eyeballs.` (Fathom custom domain).

---

## v8b: griko.id "Version 8" final (personal-websites, March–May 2022)

### 1. TL;DR

v8b is the version that was actually live: it matches the 2022-04-04 Wayback snapshot. It is a dark, single-column Next.js 12 site with Lexend, Tailwind typography, a kbar command palette, rough-notation underlines, and medium-zoom. All content is local MDX: 8 posts and 4 content pages, plus MDX home, about, and error pages. **Recommend B.** Port it to Astro with the MDX files copied verbatim as frozen content, and use small React islands (kbar) or vanilla scripts (rough-notation, medium-zoom). The OG service, Fathom, Sentry, and the Berkeley Mono CDN are all dead and should be dropped or replaced.

### 2. Overview

- **Era:** February 2022 (Strangelove start) to about May 2022. The zip date is 2022-03-25, and Wayback captured it on 2022-04-04. By 2022-06-06 a different design (v9?) was live.
- **Stack:**
  - Yarn 1.22.17 + Turborepo 1.1.10 (`V8B/turbo.json`). Node `14.*`.
  - Next 12.1.0, React 17, MDX 2.1.0 (with the `V8B/patches/@mdx-js+mdx+2.0.0.patch` and `vfile+5.3.0.patch` patch-package patches, which strip `process` imports and alias `path` to `path-browserify` for client MDX).
  - Tailwind 3.0.23 + `@tailwindcss/forms`, `line-clamp`, `typography`.
  - kbar 0.1.0-beta.27, `@atomiks/mdx-pretty-code` + shiki 0.10.1, `twemoji`, `medium-zoom`, `react-hot-toast`, `@mantine/hooks`, `lucide-react` 0.x.
  - `next-seo`, `next-sitemap`, `next-superjson`, `next-transpile-modules`, `@sentry/nextjs` 6.19, `fathom-client`, `date-fns-tz`, `zustand`, `react-hook-form`.
- **Monorepo packages:**
  - `@packages/assets` (5 portrait JPGs)
  - `@packages/hooks` (`toggle`)
  - `@packages/rough-notation` (a vendored fork of `react-rough-notation` @ `f22a17b`)
  - `@packages/tsconfig`, `@packages/types`
  - `@packages/utils` (`absolute-url`, `cwd`, an emoji `regex`, `trim-http`)
- **Deploy target:** Vercel (`ID/vercel.json`). `next export` is wired as a turbo task, but the site relies on `getServerSideProps`, rewrites, and redirects, so it ran as Vercel SSG+SSR.
- **Domain:** `https://griko.id` (`ID/config/meta.json`).

### 3. Route inventory

| Path                             | Source                                           | Shows                                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                              | `ID/pages/index.mdx` + `ui/core/home-frame.tsx`  | Round 256px portrait (`me-alt-1.jpg`, blur placeholder) next to the name H1. The intro mentions Jamstack, Strangelove Ventures, Koding Ninja, SurabayaJS, Deno Land Indonesia, and Frontend Indonesia, and ends with "Currently based on 🇮🇩 Cikarang, Indonesia." under an animated rough-notation underline. There are two pill buttons: email, which copies to the clipboard unless Shift is held, and Twitter.          |
| `/about`                         | `ID/pages/about.mdx`                             | Cover image (`cover.jpg`), the full name, an About Me narrative (Surabaya, ITATS Informatics 2021, Laravel/Voyager origins, Jamstack), resume links (`/resume.pdf` and resume.io), the work experience list (Strangelove Feb 2022–, Undisclosed Company May 2020–), and the community experience list (DILo mentor Nov 2019, DSC PENS Mar 2019, SurabayaJS core organizer Dec 2018–2020). It links to Timeline (Polywork). |
| `/blog`                          | `ID/pages/blog/index.tsx`                        | "Writings": posts sorted by date, with title, description, date, and the link or external-redirect URL. A "Search posts" button opens kbar scoped to posts.                                                                                                                                                                                                                                                                |
| `/blog/[slug]`                   | `ID/pages/blog/[slug].tsx`                       | Title, lead, posted and last-updated dates, Share on Twitter (intent), Copy link, Web Share. The MDX body uses medium-zoom images. Bottom links go to the latest and previous posts. Posts with `redirect:` frontmatter render a 3s meta-refresh page.                                                                                                                                                                     |
| `/[slug]`                        | `ID/pages/[slug].tsx` + `ID/content/pages/*.mdx` | `/uses`, `/thanks`, `/kitchen-sink`, `/test-import-from-mdx`                                                                                                                                                                                                                                                                                                                                                               |
| `/projects`                      | `ID/pages/projects.tsx`                          | A **WIP stub**: an amber "work in progress" banner, title, and description. It is not linked from the nav.                                                                                                                                                                                                                                                                                                                 |
| `/time`                          | `ID/pages/time.tsx`                              | Live clocks ticking every animation frame for Asia/Jakarta, CET, EST, CST6CDT, and PST8PDT. Each zone is deep-linkable via `#slug`, and the other zones dim.                                                                                                                                                                                                                                                               |
| `/playground/seat-selector`      | `ID/pages/playground/seat-selector.tsx`          | See the dedicated section below                                                                                                                                                                                                                                                                                                                                                                                            |
| `/_/opengraph`                   | `ID/pages/_/opengraph/index.tsx` (GSSP)          | OG playground: a form (title, description, path, modifier) with a live preview from `/api/opengraph/main`                                                                                                                                                                                                                                                                                                                  |
| `/_/opengraph/main`              | `ID/pages/_/opengraph/main.tsx` (GSSP)           | A 1024×512 OG layout page (portrait + title + description + URL) that the external screenshot service captured                                                                                                                                                                                                                                                                                                             |
| `/timeline`                      | `ID/pages/timeline.tsx` + redirect               | Meta-refresh and 307 to `polywork.com/griko`                                                                                                                                                                                                                                                                                                                                                                               |
| `/empty`                         | `ID/pages/empty.tsx`                             | Layout test                                                                                                                                                                                                                                                                                                                                                                                                                |
| `/404`, `/500`                   | `ID/pages/404.mdx`, `ID/pages/500.mdx`           | Short MDX error pages                                                                                                                                                                                                                                                                                                                                                                                                      |
| Redirects (`ID/next.config.mjs`) |                                                  | `/writings/*`→`/blog/*` (permanent), `/commit/:sha`→GitHub commit, `/github`, `/linkedin`, `/polywork`, `/resume` (resume.io), `/twitter`, `/timeline`                                                                                                                                                                                                                                                                     |
| Rewrites                         |                                                  | `/social.png` → `opengraph.griko.id/main`, `/api/opengraph/*` → `opengraph.griko.id/*`                                                                                                                                                                                                                                                                                                                                     |
| Static                           | `ID/public/`                                     | `resume.pdf` (1 page, 206 KB, March 2022), `images/*`, `assets/*` favicons, `noise.svg` (unused), `robots.txt`; the sitemap is generated                                                                                                                                                                                                                                                                                   |

Navigation:

- **Header** (`ID/ui/header/index.tsx`): name (off the home page), About, Writings, and Timeline (external). Projects is commented out.
- **Mobile:** a bottom tab bar (`ID/ui/mobile-menu-bar`).
- **kbar actions** (`ID/lib/kbar.tsx`):
  - Navigation: Home `g h`, About `g m`, Writings `g w`, Timeline `g t`.
  - Socials: Email, GitHub, Twitter.
  - Extras: Kitchen Sink, Multiverse (v2…v8 GitHub tree links), OpenGraph Playground, Thanks, Time, /uses.
  - Seat-selector is **not** listed anywhere. It is a hidden page.

### 4. Content and data sources

All content is local: MDX under `ID/content/**`, MDX pages, and `ID/config/meta.json`. MDX is compiled by a custom webpack loader (`ID/lib/mdx/*.mjs`). The plugins are:

- remark: frontmatter, `remark-mdx-frontmatter`, gfm, `@atomiks/mdx-pretty-code` (shiki **github-dark**, `ID/lib/shiki-theme.cjs`), toc, and a custom twemoji plugin (`ID/lib/remark/twemoji.mjs`, served from the dead `twemoji-cdn.griko.id`)
- rehype: raw, slug

Frontmatter fields are `title, description, date, lastUpdate?, redirect?, header?` (`ID/lib/mdx/types.ts`). Files prefixed `DRAFT-` are skipped.

**Posts** (`V8B/ID/content/posts/`) compared with current Sanity `zp0drmxt`:

| MDX file (= v8 URL `/blog/<file>`)                              | MDX date                        | Current Sanity slug                                              | Sanity `publishedAt`  | Notes                                                                                                                                                                  |
| --------------------------------------------------------------- | ------------------------------- | ---------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adaptive-link-element-for-nextjs`                              | 2022-01-22                      | `adaptive-link-element-for-next-js`                              | 2022-01-21T17:00Z     | **Slug differs, so it needs a redirect.** The title also differs: MDX says "Adaptive Link **Component** for Next.js", Sanity says "…**Element**…".                     |
| `exploring-undocumented-getinitialprops-properties-on-next-js`  | 2018-11-26                      | `exploring-undocumented-get-initial-props-properties-on-next-js` | 2018-11-25T17:00Z     | **Slug differs, so it needs a redirect.** It uses `<Reference>`.                                                                                                       |
| `gatsby-js-plugin-priority-vs-ocd`                              | 2019-05-04                      | same                                                             | 2019-05-03T17:00Z     | OK (UTC+7 offset)                                                                                                                                                      |
| `i-made-a-deno-module-registry-using-next-js-vercel-and-github` | 2019-06-14                      | same                                                             | **2019-06-03**T17:00Z | **Date mismatch** (11 days). Images are hot-linked to `dev-to-uploads.s3.amazonaws.com` (still 200 today, but fragile).                                                |
| `new-place-new-chapter` (v8b only)                              | **2022-03-21**                  | same                                                             | **2019-06-03**T17:00Z | **Sanity date is wrong.** The June 2022 Wayback snapshot also shows "March 20, 2022". Fix it in the CMS.                                                               |
| `prevent-fouc-on-next-js-chakra-ui`                             | 2021-08-13 (updated 2022-01-04) | same                                                             | 2021-08-12T17:00Z     | OK. `lastUpdate` is not in Sanity.                                                                                                                                     |
| `view-deleted-git-histories-on-github`                          | 2022-01-19                      | same                                                             | 2022-01-18T17:00Z     | In v8/v8b this was **only a redirect** to Typefully (the URL changed between v8 and v8b). Sanity holds the full thread text, with `seo.canonicalUrl` set to Typefully. |
| `windows-is-now-great-for-development`                          | 2019-06-14                      | same                                                             | **2019-06-03**T17:00Z | **Date mismatch**                                                                                                                                                      |

Every v8b post already exists in current Sanity (imported from Bear Blog). No MDX post is missing from the CMS.

**Pages and other content → new types:**

| Item                                     | Source                                                                                                                            | New Sanity mapping                                                                                                                                                                                        | Notes                                                                                                                                                                                                |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identity                                 | `ID/config/meta.json` (name, fullName, description, email, links: Email, GitHub, LinkedIn, Polywork, Resume (resume.io), Twitter) | `profile`                                                                                                                                                                                                 | Polywork has shut down, so drop or redirect that link. Twitter is now X.                                                                                                                             |
| Site settings                            | `meta.json` (domain, url, Fathom id/scriptUrl, multiverse map)                                                                    | `site` (per-property)                                                                                                                                                                                     | The multiverse map is archive-index data, not CMS data.                                                                                                                                              |
| Home copy                                | `ID/pages/index.mdx`                                                                                                              | `home`, but it is **v8b-specific**                                                                                                                                                                        | It's era copy, so freeze it (B)                                                                                                                                                                      |
| About                                    | `ID/pages/about.mdx`                                                                                                              | `profile.bio` + `experience` ×2 + `organization` (Strangelove Ventures, Koding Ninja, SurabayaJS, ITATS, DILo, DSC PENS) + `involvement` ×3 + `education` (ITATS, Informatics, 2021) + `portrait` (cover) | Era snapshot. The current CMS has richer data.                                                                                                                                                       |
| `/uses`                                  | `ID/content/pages/uses.mdx`                                                                                                       | `page`, but **historical**. Current Sanity `uses` lists a 2024 MacBook Pro M4 / iPhone 14 Pro, while v8 lists a 2020 13" MBP / iPhone 12 mini.                                                            | **Not in the CMS.** Freeze it in B, or import it as `page` slug `uses-2022`. Several URLs are malformed (`https://https://…`, `https://http://…`), and some are referral links (NextDNS, GitKraken). |
| `/thanks`                                | `ID/content/pages/thanks.mdx`                                                                                                     | `page`                                                                                                                                                                                                    | Not in the CMS: a list of six personal-site credits                                                                                                                                                  |
| `/kitchen-sink`, `/test-import-from-mdx` | `ID/content/pages/*.mdx`                                                                                                          | none                                                                                                                                                                                                      | Dev or test pages. Freeze kitchen-sink in B as an MDX regression page.                                                                                                                               |
| Timeline                                 | `ID/pages/timeline.tsx` → Polywork                                                                                                | `experience`/`involvement`                                                                                                                                                                                | **No timeline data in the repo.** It lived on Polywork, which no longer exists.                                                                                                                      |
| Resume                                   | `ID/public/resume.pdf` (v8 and v8b versions differ)                                                                               | asset on `profile` or `page`                                                                                                                                                                              | Era resume. Keep it in the archive app.                                                                                                                                                              |
| `/time` zones                            | hard-coded in `ID/pages/time.tsx`                                                                                                 | none                                                                                                                                                                                                      | Code only                                                                                                                                                                                            |

**MDX features that don't map cleanly to Portable Text** (relevant to option A, or to importing these posts into the new CMS):

- JSX components via `MDXProvider` (`ID/ui/markdown/components.tsx`):
  - `<Underline show>`, `<Stabilo>` (highlighter), and `<Strike>` (rough-notation wrappers, `ID/ui/core/{underline,stabilo,strike}.tsx`). In PT these would need custom decorator or annotation types.
  - `<Reference>`: a `blockquote[data-reference]` with no quote marks, used 3× in the getInitialProps post. In PT this would be a block style or custom block.
  - `<Seo>`, `<Prose>`, `<A>` (adaptive anchor).
- ESM `import` statements and JS expressions in content: `{meta.name}`, `{meta.links.Email}`, and `next/image` with a static import plus blur placeholder in `about.mdx`.
- Code fences with **line highlight meta** (` ```js {7,12} `) and **word highlight** (` ```md {1} /code blocks/2 `). Also **inline code with a language hint** (`` `<Link />{:jsx}` ``, a mdx-pretty-code/rehype-pretty-code syntax used throughout the adaptive-link and FOUC posts). PT code blocks (`@sanity/code-input`) support `highlightedLines` but not word highlights or inline language hints.
- Images whose `alt` text is rendered as a `<figcaption>` (`ID/ui/core/img-figure.tsx`), which would need a separate caption field in PT. Plus medium-zoom on all images.
- remark-twemoji replaces emoji with `<img>`. remark-toc builds a table of contents.
- `redirect:` frontmatter, which produces an external-redirect post. That is a `redirect` doc in the new schema.

For **option B** none of this matters: Astro's `@astrojs/mdx` compiles these files almost verbatim. The changes needed are:

- Replace `@/ui/...` imports with Astro or React components.
- Use `rehype-pretty-code` with Shiki `github-dark` for the line, word, and inline highlight syntax.
- Swap `next/image` for `astro:assets` `<Image>`.

**Slugs and redirects** for the archive host, relative to whatever prefix it uses:

- From the current-site side, add 301s for `/blog/adaptive-link-element-for-nextjs` → `/blog/adaptive-link-element-for-next-js` and `/blog/exploring-undocumented-getinitialprops-properties-on-next-js` → `/blog/exploring-undocumented-get-initial-props-properties-on-next-js`. Old griko.id inbound links use the MDX slugs, but griko.id has lapsed, so this matters only for links pointing at the new domain or the archive.
- Inside the archive keep the original slugs. `/writings/*` → `/blog/*` can be reproduced with an Astro redirect.
- `/github`, `/linkedin`, `/twitter`, `/resume`, `/polywork`, `/timeline`, `/commit/:sha`: keep them as static Astro redirects, or drop them. Polywork is dead, and resume.io `TAzO1zFvr` is probably stale.

### 5. Assets

- **Portraits** (`V8B/packages/assets/`):
  - `me-alt-1.jpg` (2837², v8b home)
  - `me-casual.jpg` (1139², v8 home + OG)
  - `me-alt-2.jpg`, `me-formal.jpg`
  - `cover.jpg` (2560×1440, about cover)

  These are candidates for `portrait` docs if they aren't already in Sanity.

- **Post images** (`ID/public/images/`): `app-context-object-properties.png`, `page-context-object-properties.png`, `control-click.gif`, `build-log.png`, `denoland-id-cli.jpg`, `denoland-id-comparison.jpg`, `fouc-before.gif`, `fouc-after.gif`, `workstation.jpg` (4032×3024, iPhone 12 mini, Oct 2021; used by uses). The Deno post also hot-links 12 images on `dev-to-uploads.s3.amazonaws.com`, so mirror them into the archive.
- **Favicons:** a full `favicons-compiled` set generated from `ID/public/icon.png` (`ID/scripts/favicons.mjs` → `ID/public/assets/*`, `ID/__generated__/favicon-meta-tags.jsx`), with background `#171717`. v8b adds iPhone 12/13 startup images. Only a handful are needed in 2026.
- **Fonts:**
  - **Lexend** (sans) via `@fontsource/lexend` (OFL).
  - Mono is **JetBrains Mono** in v8 (OFL) and **Berkeley Mono** in v8b, loaded from `https://berkeley-mono.griko.id/index.css`, which is dead.

  Berkeley Mono is a **commercial font** (US Graphics). Do not commit its files to a public repo. Substitute JetBrains Mono, or self-host under the owner's license in a private asset store, consistent with the font-licensing constraints already noted for this project.

- **Icons:** `lucide-react` 0.x. Some brand icons it used (Twitter, Github) are deprecated or removed in current Lucide, so use Simple Icons or inline SVG.
- **Emoji:** Twemoji from the dead self-hosted CDN. Use native emoji, or the jdecked/twemoji fork on jsDelivr.
- **OG images:** generated by the external service `opengraph.griko.id` (separate repo `grikomsn/opengraph.griko.id`). It screenshotted `/_/opengraph/main?title&description&path&modifier`, a 1024×512 frame with the 192px round portrait, a 5xl or 7xl title, a description, and the URL. The service is dead. Replace it with build-time OG generation (satori or `@vercel/og`-style in Astro) that recreates the same layout, or with pre-rendered PNGs.

### 6. Interactive features and runtime dependencies

| Feature                                                                                                                                                      | Implementation                                                                                | 2026 status → replacement                                                                                                       |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **kbar command palette** (⌘K plus `g x` sequences; sections; nested "Extras → Multiverse"; scoped "Search posts"; macOS-style traffic-light window controls) | kbar 0.1.0-beta.27, `ID/lib/kbar.tsx`, `ID/ui/kbar/*`                                         | Works as a React island with current kbar (0.1.x is still the line) or `cmdk`. The posts list comes from the static collection. |
| **Rough-notation** underline, highlight, strike (animated after 1000ms)                                                                                      | vendored `V8B/packages/rough-notation` around `rough-notation`                                | `rough-notation` is vanilla and still on npm, so use a tiny Astro component plus a script or an IntersectionObserver            |
| **medium-zoom** on post and OG images                                                                                                                        | `ID/lib/medium-zoom.tsx`                                                                      | Vanilla `medium-zoom` script                                                                                                    |
| **Copy email to clipboard** with a toast; Web Share; Twitter intent                                                                                          | `ID/utils/clipboard.ts`, `ID/utils/navigator.tsx`, `ID/lib/twitter.ts`, react-hot-toast       | Small vanilla scripts. The Twitter intent still works on x.com.                                                                 |
| Route-change "Loading page…" toast                                                                                                                           | `ID/ui/page-progress`                                                                         | Drop it (MPA)                                                                                                                   |
| "Coming from Bulma?" toast when `document.referrer` includes bulma.io                                                                                        | `ID/lib/referrer.tsx`, `ID/ui/toast/bulma.tsx`                                                | A cute easter egg (the site was in the Bulma expo). It can stay as vanilla, and could link to the v2 archive entry.             |
| **/time** live world clocks                                                                                                                                  | `ID/utils/time.ts` (zustand + rAF + `date-fns-tz`)                                            | Vanilla `Intl.DateTimeFormat` with `setInterval`                                                                                |
| OG playground `/_/opengraph`                                                                                                                                 | GSSP + external service                                                                       | Drop it, or keep it as a client-only page that renders the layout without the screenshot                                        |
| Sentry (`@sentry/nextjs` 6)                                                                                                                                  | `ID/sentry.*.config.js`, enabled only if `NEXT_PUBLIC_SENTRY_DSN` contains `ingest.sentry.io` | **Drop.** No DSN is committed (env var only).                                                                                   |
| Fathom analytics (site `HKQBXHGN`, custom domain `eyeballs.griko.id`)                                                                                        | `ID/lib/fathom.tsx`                                                                           | **Drop** (dead domain and legacy site). If wanted, use the current Fathom site from the new project.                            |
| Twemoji CDN, Berkeley Mono CDN, OG service                                                                                                                   | `*.griko.id`                                                                                  | **All dead.** griko.id has lapsed.                                                                                              |
| Security headers and CSP                                                                                                                                     | `ID/next.config.mjs`                                                                          | Workers `_headers`                                                                                                              |

**Secrets check:** no API keys, tokens, or DSNs are committed in v7, v8, or v8b; they are only referenced through env vars and GitHub secrets (`WRANGLER_TOKEN`, `SEMGREP_APP_TOKEN`). `V8*/sites/griko.dev/wrangler.toml` exposes the Cloudflare account and zone IDs. Those are not credentials, but the owner should know they're public. The Fathom site ID and share-dashboard URL in `meta.json` are public by design.

### 7. Visual identity

- **Theme:** dark only. `body` is neutral-900 `#171717`, `text` neutral-200, `primary` **sky-500 `#0ea5e9`** (`ID/tailwind.config.js`). Selection is sky at 50%. Links are underlined with offset 2.
- **Type:**
  - **Lexend** for everything. Headings use `tracking-tighter` and bold.
  - Mono is Berkeley Mono in v8b and JetBrains Mono in v8.
  - Prose is `prose prose-invert prose-sky`, `md:prose-lg` on the home page.
- **Layout:**
  - `container max-w-4xl`, single column.
  - The desktop header is right-aligned text and icon links (Lucide, 16px), with the name at the left except on the home page.
  - Mobile gets a fixed bottom tab bar (64px, `bg-body/80`, `backdrop-blur-sm`, top border neutral-700).
  - The footer holds a small-print MDX excerpt plus icon buttons (⌘ for kbar, Mail, GitHub, Twitter), each with a different hover color (orange, lime, neutral, sky).
- **Home:** a split hero. A round portrait sits left and the intro right, at a minimum of 80vh height. Pill buttons use a `ring-offset-4` hover ring: the email pill is light on dark, the Twitter pill sky-600.
- **Signature effects:**
  - The hand-drawn **rough-notation underline** on "Cikarang, Indonesia" draws itself after one second.
  - **kbar** opens with macOS traffic-light dots.
  - Blog cards lift with `-translate-y-1` and a shadow on hover.
  - medium-zoom images open over a blurred black overlay.
  - Code is Shiki github-dark with highlighted lines (sky left border and a 20% sky background), `shadow-2xl` on `pre`.
  - v8 only: the slowly hue-rotating gradient glow behind the header and footer.

### 8. Effort and recommendation

| Option                            | Effort              | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Astro port fed by current CMS  | **L**               | The posts exist in Sanity, but home, about, uses, thanks, time, and the playgrounds are era-specific or code-only. Current data (2024 uses, 2026 experience) inside the 2022 look would misrepresent it. MDX-only features (rough-notation spans, inline code language, word highlights) are lost in PT, and the new schema would need v8-specific singletons.                                                                                                                                                                                                                                                                                  |
| **B: Astro port with frozen MDX** | **M**               | Copy `content/**` and the page MDX as-is into an Astro content collection. Then: <ul><li>reimplement about 10 small components (Prose, HomeFrame, Underline/Stabilo/Strike, Reference, ImgFigure, Anchor, header and footer, mobile bar)</li><li>mount kbar as a React island</li><li>port /time and seat-selector as tiny islands</li><li>set up `rehype-pretty-code` with github-dark, Fontsource Lexend and JetBrains Mono, static OG PNGs, and redirects</li></ul>Tailwind 4 can reproduce the v3 classes nearly verbatim (watch `bg-opacity-*` → `/opacity` and the `line-clamp` plugin, now built in).                                    |
| C: original toolchain build       | **M** (and fragile) | Needs Docker `node:14` or `node:16` (Node 14 has no official darwin-arm64 build), Yarn 1.22.17 frozen lockfile, and patch-package. Then for `next export`: <ul><li>delete the GSSP pages (`/_/opengraph/*`), `api/`, rewrites, and redirects</li><li>set `images.unoptimized`, or Next 12.1 export fails on `next/image`</li><li>strip Fathom and the Berkeley Mono `<link>`</li></ul>The result is frozen Next 12/React 17 output with dead-network calls removed, and it is not maintainable. The yarn.lock pins Jan–Mar 2022 packages, so registry availability is probably fine, but native deps (`sharp` via next, `shiki` WASM) add risk. |
| D: archive only                   | **S**               | Link to commit `5398c0ac`, the 2022-04-04 Wayback snapshot, and screenshots                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

**Recommendation: B.** The content is already in a portable format, the look depends only on Tailwind classes, and every runtime feature has a static or island replacement. Use v8b as the canonical "v8" entry, and optionally add the v8 gradient as a toggle.

### 9. Risks and open questions

- **Berkeley Mono:** does the owner's license allow webfont self-hosting? If not, use JetBrains Mono (which v8 used anyway).
- The OG layout must be recreated. The `opengraph.griko.id` repo might contain the screenshot service's exact CSS, so check `github.com/grikomsn/opengraph.griko.id`.
- Fix the Sanity date errors (`new-place-new-chapter`, `windows-is-now-great-for-development`, deno registry) and the title drift (adaptive link "Component" vs "Element"). This is independent of the archive decision.
- Should the archive's copy of `resume.pdf` (personal data from 2022) be published? It was public then, so the owner should decide.
- `uses.mdx` contains referral links and malformed URLs. Freeze them as-is (authentic), or clean them up?
- Should the hidden or dev pages (`/empty`, `/test-import-from-mdx`, `/kitchen-sink`, `/_/opengraph`) be included in the archive?
- kbar "Multiverse" actions link to `github.com/grikomsn/personal-websites/tree/<sha>`. That repo was renamed to `grikomsn/multiverse` (per the `nbr.st` redirects), so point the actions at the new archive entries instead.

---

## The `playground/seat-selector` page (detail)

**Files:** `V8/ID/pages/playground/seat-selector.tsx` and `V8B/ID/pages/playground/seat-selector.tsx`. They are identical except for `classnames`→`clsx`. 73 lines. The page is not linked from the nav or kbar.

**Purpose (from the page copy):** "Seat Selector — A friend asked how to make a seat selector UI, soooo yeah". It is a quick demo, not a feature.

**How it works:**

- A hard-coded 4×8 matrix:

  ```ts
  const EXAMPLE_SEATS = [
    [-1, 0, 0, 2, 2, 2, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, -1],
    [0, 0, -1, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 2, 2, 2, 2],
  ]
  ```

- Cell states:
  - `-1`: no seat (gap or aisle). It is rendered as a `hidden` button, so the grid cell stays empty and the layout holds.
  - `0`: available, with an outlined border neutral-500 and a hover fill of neutral-500 at 50%.
  - `1`: taken, filled neutral-500, borderless, `disabled`.
  - `2`: a second taken or reserved category (premium, booked by others?), filled **yellow-700**, borderless, `disabled`.
- Layout: a CSS grid with `grid-template-columns: repeat(COLUMNS, minmax(0,1fr))`, where `COLUMNS = max(row.length)`, `gap-4 p-4`. Each seat is a 32×32 `rounded` `<button>` labeled with `${rowIndex}${seatIndex}` (for example `"03"`). Disabled seats get `opacity-50 cursor-not-allowed`.
- **There is no selection state.** Buttons have no `onClick`, there is no `aria-pressed`, and nothing is submitted. Clicking an available seat does nothing beyond the hover style. Labels are ambiguous past 10 columns, since "1"+"12" and "11"+"2" both give "112".
- Dependencies: only React and clsx. No data fetching.

**Reusability for the new "Is This Seat Taken?"-inspired design:**

- The code itself is trivial and dark-themed. Only the concept is worth carrying over: a data-driven seat grid where a matrix value maps to a state and `-1` creates gaps or aisles.
- Rebuild it fresh as an Astro island or plain web component styled in the new palette. The project reference notes cream paper, navy outlines, terracotta/teal/mustard, and halftone. The rebuild should have:
  - typed seat states (`empty | available | selected | taken | reserved`, plus an optional occupant or character)
  - row/column labels (`A1`…)
  - roving-tabindex keyboard navigation and `aria-pressed` or `aria-disabled`
  - a selection handler
  - optionally, per-seat "occupant" data (an avatar or portrait, plus a speech bubble) to echo the game's seating-passengers vibe
- Possible uses in the new site:
  - as a navigation or section metaphor (each section is a seat, and "taken" seats are past roles, projects, or talks)
  - as a visualization of experience over time, or of `involvement` docs
  - as an interactive 404 page ("this seat is taken")
- Nothing from v8 constrains this. If the old version is kept, it should be in the v8 archive as-is.

---

## Reusable pieces worth lifting into the new site (independent of archive decisions)

1. **CMS data fixes** found during this review (zp0drmxt, and the migration into the new `lboasusv`):
   - `new-place-new-chapter` publishedAt is 2019-06-03 but should be 2022-03-21 (MDX and Wayback agree).
   - `windows-is-now-great-for-development` and `i-made-a-deno-module-registry-…` are dated 2019-06-03, but the MDX says 2019-06-14.
   - The adaptive-link title differs between MDX and Sanity.
   - `prevent-fouc…` has `lastUpdate: 2022-01-04`, which isn't in the CMS.
2. **Redirects for the `redirect` type:**
   - `/blog/adaptive-link-element-for-nextjs` → `/blog/adaptive-link-element-for-next-js`
   - `/blog/exploring-undocumented-getinitialprops-properties-on-next-js` → `/blog/exploring-undocumented-get-initial-props-properties-on-next-js`
   - `/writings/*` → `/blog/*`
   - Vanity redirects `/github`, `/linkedin`, `/twitter`, `/resume` (point it to resume.nibras.co instead of resume.io)
3. **Historical content not in the CMS:**
   - `/uses` (2021–22 setup, plus `workstation.jpg`), which could become a `page` like `uses-2022` alongside the existing `uses-2024`.
   - `/thanks` (inspiration credits).
   - The about-page **community entries** for `involvement`: DILo x Cilsy #DILoDevelopersClass mentor (Nov 2019), DSC PENS Campus Roadshow mentor (Mar 2019), SurabayaJS core organizer (Dec 2018–2020).
   - The v7 appearance categories (`lightning-talk`, `podcast`, `talk`, `workshop`), which argue for a `format` field on `talk`.
4. **Images to rescue into Sanity or the archive app:**
   - The `V8B/packages/assets/*` portraits and cover → `portrait`.
   - The post images in `ID/public/images/`. Current Sanity posts may already carry copies imported from Bear Blog, so verify against them.
   - The 12 dev.to S3 images hot-linked by the Deno post.
5. **Interaction patterns:**
   - **kbar/⌘K command palette** with `g`-prefixed sequences and a nested "Multiverse" menu. That menu is a natural UI for the new site's past-versions archive index.
   - v7's **keybinds cheatsheet** (`Shift+?`), synced across tabs with BroadcastChannel.
   - The **rough-notation underline** as a hand-drawn accent, which fits a paper or illustrated aesthetic.
   - **medium-zoom** image zoom.
   - Copy-email-on-click with Shift to follow the mailto link.
6. **Small playgrounds:**
   - `/time` (world clocks with hash-linking, about 60 lines; could become a "my timezone" widget on the new contact page).
   - The seat-selector concept (see above).
   - The OG frame layout as a reference for new build-time OG images.
7. **Code-block conventions** worth keeping in the new MDX or PT pipeline: Shiki line highlights with `{n,m}`, word highlights, and inline `{:lang}` code. They are used heavily in the older posts, so a PT code block with `highlightedLines` plus a decision on inline code language is needed for fidelity.
8. **No timeline data exists** in these versions. `/timeline` always pointed to Polywork, which has shut down, so the new site must rebuild any timeline from `experience`/`involvement`/`talk`/`post` docs.

### Follow-ups

- [ ] Enumerate Wayback captures for `griko.id/*` (2021–2022) via CDX from a browser. Pull the v7 `__NEXT_DATA__` and `_next/data` JSON for `/blog*`, `/about`, `/appearances`, `/projects`, and `/tag/*`, plus any `datocms-assets.com` image captures. This decides whether v7 gets B or D.
- [ ] Take screenshots of 20211128 (v7) and 20220404 (v8b) at desktop and mobile widths for the D-level archive cards.
- [ ] Hand the 2022-06-06 snapshot to whoever covers v9.
- [ ] Ask the owner about Berkeley Mono licensing, and whether the Airtable "Tableflare" base still exists.
