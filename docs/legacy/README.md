# Legacy versions: decisions

Synthesis of the four research reports in this folder (2026-11-15). The `nbr.st` short links (`nbr.st/v2`, `nbr.st/2018`, and so on) point to the source of each old version: a commit in this repository's earlier history, or a Wayback capture. Each of those commits has a `legacy/<version>` tag (2026-11-22), so GitHub keeps it. v3 is the `legacy/v3` folder of `legacy/v4`, and `legacy/v8a` is the earlier cut of v8. Options:
**A** port to the current stack fed by current CMS data · **B** port to the current stack with content frozen as data files · **C** rebuild the original code with its original toolchain · **D** archive only (GitHub commit + Wayback link + screenshots).

## Verdict: rebuild every design, show today's content

Decided 2026-11-15 (supersedes the first draft's "frozen in code"):

- **Rebuild every version where possible** (v3 and the v5 reconstruction included; v7 too, since Wayback has its pages).
- **Every version shows today's content** (decided 2026-11-21; supersedes "period copy in one `edition` document per version"). Facts come from current documents, and each version phrases them in its own sentence pattern. The `edition` document keeps only what the index lists and the design assets. The version's interface copy (page headings, nav labels) lives in its code. The 2026-11-15 plan kept the period copy to avoid present-day text in 2019 layouts. Now that is the goal: the designs are the archive, and the Wayback links and screenshots show the old content.
- **C stays ruled out** (Node 10–14, node-sass 4, dead CMSes); the original look is rebuilt in Astro with each version's own CSS framework.
- **2023b is dropped** (2026-11-21). It ported the paid Tailwind UI Spotlight template, so it was never rebuilt in this public repo, and its edition is deleted. **v4b is folded into v5** (2026-11-21): they share one design, and `/v4b/*` redirects to `/v5/`.

| Entry     | Era / domain                      | Stack (original)                                              | Pick                                          | Effort | Content source for the port                                                                                                 | Report                |
| --------- | --------------------------------- | ------------------------------------------------------------- | --------------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| v2        | Nov 2018 · griko.id (v2.griko.id) | Next 7, Bulma, EmojiOne                                       | **Rebuild**                                   | S–M    | Archive source; ~60% of multiverse-2026 `web-v2` reusable                                                                   | [v2-v4](v2-v4.md)     |
| v3        | May–Aug 2019 · griko.id           | Gatsby, Bulma (first blog)                                    | **Rebuild**                                   | M      | `legacy/v3` in the v4 archive                                                                                               | [v2-v4](v2-v4.md)     |
| v4        | Aug 2019–May 2020 · griko.id      | Gatsby, Tachyons, Inter                                       | **Rebuild**                                   | S      | Archive JSON; ~70% of multiverse-2026 `web-v4` reusable (restore the colored framework links)                               | [v2-v4](v2-v4.md)     |
| v4b+v5    | 2020 · griko.id                   | Next, Tailwind 1, framer-motion (+ Contentful, Spotify in v5) | **Rebuild** as v5 (v4b folded in, 2026-11-21) | S      | v4b `data/*.js`; v5 reconstructed from v4b data and 3 posts in Sanity (labelled as reconstruction)                          | [v4b-v6](v4b-v6.md)   |
| v6        | Late 2020–2021 · griko.id         | Next, Chakra, Contentful GraphQL                              | **Rebuild**                                   | M      | Recovered from Wayback → [`data/v6.json`](data/v6.json) (4 posts, about, 10 projects, 7 talks); project screenshots missing | [v4b-v6](v4b-v6.md)   |
| v7        | 2021 · griko.id                   | Next, Chakra, DatoCMS (lerna)                                 | **Rebuild**                                   | M      | Wayback 2021-11-28 has the full DatoCMS data for the page; 70 Wayback captures incl. `/about`, `/appearances`, `/uses`      | [v7-v8b](v7-v8b.md)   |
| v8        | Mar–May 2022 · griko.id           | Next, MDX, Tailwind, kbar                                     | **Rebuild**, one entry built from v8b         | M      | Local MDX (v8b supersedes v8; v8's gradient glow is an optional toggle)                                                     | [v7-v8b](v7-v8b.md)   |
| griko.dev | 2022                              | Cloudflare Worker + Airtable                                  | **D**                                         | —      | It was a short-link redirector; nbr.st replaced it                                                                          | [v7-v8b](v7-v8b.md)   |
| v9        | Jan–Nov 2022 · griko.id           | Next, Tailwind, DatoCMS, MDX remote                           | **Rebuild**                                   | M      | Wayback `__NEXT_DATA__` (bio, 6 projects, 7 talks, 11 posts recovered; about/contact pending)                               | [v9-2023](v9-2023.md) |
| 2023a     | Apr–Aug 2023 · nibras.co          | Next app router, Chakra, Lenis                                | **Rebuild**                                   | S–M    | Local checkout of the 2023a.nibras.co repo (hardcoded)                                                                      | [v9-2023](v9-2023.md) |
| 2023b     | Aug–~Nov 2023 · nibras.co         | Tailwind UI “Spotlight” template                              | **Dropped** (2026-11-21)                      | —      | Local checkout of the 2023b.nibras.co repo; paid template, so its code stays out of this repo                               | [v9-2023](v9-2023.md) |

Not yet covered (newly discovered):

- **Ghost blog** on nibras.co (Nov 2022; the `nbr.st/2022b` redirect, previously mislabelled as v9).
- **Keystatic-era Next site** on nibras.co (around Dec 2023, per the “Keystatic: The Last Framework Hop” post).
- **Bear Blog** (2024–2026, current content). Optionally archive its look once the new site replaces it.

## Archive architecture

- **One Astro app, `apps/archive`, served at `archive.nibras.co`.** Each version lives in `src/editions/<key>/` (layout, components, CSS) with routes in `src/pages/<key>/`. Astro bundles CSS per page, so Tachyons, Bulma 0.7, Tailwind 1 and Chakra-era styles never meet.
- **Each edition keeps the CSS framework version it shipped with.** Bulma, Tachyons, Casper and Bear editions use the original stylesheet. The others compile with the original packages, which live in `apps/archive/toolchains/<name>/` (one workspace package per version, pinned in a named root `catalogs` entry). An edition stylesheet opts in with `@toolchain "<name>";`, and the `toolchains()` Astro integration compiles it before Vite sees it:

  | Toolchain      | Editions | Packages                                                             | Config                      |
  | -------------- | -------- | -------------------------------------------------------------------- | --------------------------- |
  | `tailwind-1.1` | v5       | Tailwind 1.1.4 on PostCSS 7, tailwindcss-transitions, purgecss 1.3   | `v5/tailwind.config.cjs`    |
  | `tailwind-3.0` | v8       | Tailwind 3.0.23, forms, line-clamp, typography 0.5.2                 | `v8/tailwind.config.cjs`    |
  | `tailwind-3.2` | v9       | Tailwind 3.2.2, forms, line-clamp, typography 0.5.7                  | `v9/tailwind.config.cjs`    |
  | `tailwind-3.4` | 2023c    | Tailwind 3.4.3, typography 0.5.13 (config rebuilt from the 2024 CSS) | `2023c/tailwind.config.cjs` |
  | `chakra-1.0`   | v6       | Chakra UI 1.0.1: theme 1.1.0, styled-system, css-reset, Emotion      | `v6/chakra.config.cjs`      |
  | `chakra-1.6`   | v7       | Chakra UI 1.6.10: theme 1.10.4 (with `--chakra-*` variables)         | `v7/chakra.config.cjs`      |
  | `chakra-2.8`   | 2023a    | Chakra UI 2.8.0: theme 3.2.0 (with `--chakra-*` variables)           | `2023a/chakra.config.cjs`   |

  Tailwind configs are the originals with `content` pointed at the edition. Write class names in that version's syntax (`!mb-24`, `aspect-[9/10]`, `bg-gradient-to-r`), not Tailwind 4's. Chakra has no stylesheet, so `toolchains/chakra.cjs` resolves the edition's `extendTheme` overrides with the version's own packages and writes static CSS. No React ships. In the stylesheet, `@chakra reset;`, `@chakra vars;` and `@chakra global;` emit the reset, theme variables and global styles. `@chakra Button { variant: ghost; }` inside a rule emits a component recipe, and `@chakra sx { … }` emits style props. `token(colors.gray.300)` gives a theme value. The comment at the top of `toolchains/chakra.cjs` describes each directive.

- The root `package.json` lists `tailwindcss` and `postcss` so Bun hoists Tailwind 4 and PostCSS 8. Without them, a toolchain's Tailwind 1 or PostCSS 7 could take the root slot.
- The index (`src/pages/index.astro`) uses the new design and lists every `edition` with status, period, stack and screenshot.
- Content comes from today's documents (`LIVE_SITE_QUERY` in `src/lib/queries.ts`) through `src/lib/live.ts` and each edition's `live.ts`. The `edition` document (`EDITION_QUERY`) gives dates and design assets. See [redesign.md](../redesign.md#how-the-archive-shows-current-content).
- `build.format: "preserve"` emits `<key>/404.html`, which the Worker's `404-page` handling serves for missing paths inside each version.
- Old CSS carries IE hacks (`*zoom`), so Lightning CSS runs with `errorRecovery`.
- Every archived page gets `noindex`, a canonical URL pointing at the archive URL (all versions hard-code the lapsed griko.id), and a small “archived version” banner, as the 2019 v2.griko.id copy had. The banner is one line in the lower right corner. An edition keeps the 48 px above the lower edge free for it; `apps/archive/src/shell/archive-banner.astro` says how.
- Drop dead third parties (Fathom, Sentry, Disqus, Spotify, puppeteer OG). Generate OG images at build. Paid fonts (Berkeley Mono) are swapped for free equivalents.

## Fix during the CMS migration (found in `zp0drmxt`)

- Wrong post dates:
  - `new-place-new-chapter` should be 2022-03-21.
  - The Deno registry post should be 2020-06-04.
  - Two 2019 posts are off by 11 days.
  - Several dates are shifted by one day from a timezone conversion.
- Slug changes that need redirects:
  - `adaptive-link-element-for-nextjs`
  - `exploring-undocumented-getinitialprops-…`
  - one v6 slug and two v9 slugs (see the reports).
  - Done for nibras.co on 2026-11-21. The old slugs are `aliases` on their posts (first added as redirect documents by `apps/studio/scripts/seed-legacy-redirects.ts`). `apps/web/src/pages/[file].ts` sends Ghost and 2023a paths to the archive. The v6 and v9 slugs were only on griko.id. Someone else owns that domain now, so they stay unfixed.
- Missing content:
  - **Talks:** DILo x Cilsy, DSC PENS Campus Roadshow.
  - **Projects:** Medan Agung, patterns-run, Tableflare, Recompose, Hyperspace, Grayed Hacker News, Style Guide, and more from v6.
  - **Experience:** D4Pros, and MetaRouter (to confirm).
  - **Pages:** 2022 `/uses` and `/thanks`.
  - **Posts:** “hello-world” (v3) and “[WIP] Generate Favicons…”.
- Reusable assets:
  - **2023b:** 10 org logos, 1920px project screenshots and portraits.
  - **2023a:** the hand-drawn signature SVG and a Composer screenshot.

## Security follow-ups

- [ ] Revoke the GitHub token v2's 2018 build inlined into public JS (`next.config.js`), if it still exists.
- [ ] Revoke the Contentful management key referenced in v6's `.env.example`, if that account still exists.
- [ ] Rotate the Kagi session token exposed at `nbr.st/kagi-session` and remove the entry.
- [x] multiverse-2026 `.env` files with Sanity tokens were never committed (checked).

## Decisions (2026-11-15)

1. Archive host: **`archive.nibras.co/<entry>`**.
2. Content goes into the CMS. 2023b was rebuilt while the repo was private. On 2026-11-18, before the repo became public, that rebuild was removed (see above).
3. v3 and v5: **attempt rebuilds** (v5 labelled as a reconstruction).
4. v6: **last state only**, like the others.
5. v7: **rebuild**. The Wayback CDX listing came through: 70 captures in 2021–2022, including `/`, `/about`, `/appearances`, `/blog/*`, `/projects` and `/uses`.

## Progress (2026-11-16)

The 12 editions are rebuilt in `apps/archive` with tracking screenshots (`[rebuild, original]`) on the archive index; screenshots: `apps/studio/scripts/editions/screenshots.ts`. Since 2026-11-21 every version shows today's content (229 pages), v4b lives on as v5, and 2023b is dropped.

| Edition                    | Notes                                                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| v2, v3, v4, v6, v7, v8, v9 | Rebuilt from the original source and/or Wayback `__NEXT_DATA__`. v6 project screenshots were never recovered (empty frames).                                      |
| v5                         | Honest reconstruction (no Wayback capture). The Spotify "now playing" page and ticker are removed.                                                                |
| 2022b                      | Ghost (Casper 5) as of the last capture, March 2023.                                                                                                              |
| 2023a                      | No usable original screenshot (content animates in and doesn't replay from Wayback).                                                                              |
| 2023b                      | Dropped on 2026-11-21: never rebuilt (paid template), and its edition is deleted.                                                                                 |
| 2023c                      | Keystatic-era site. Its stylesheet and most images weren't archived: Figtree + amber accent from the June 2024 build, stand-in portraits, CSS-approximated beams. |
| 2024                       | Bear Blog, frozen from the export's custom CSS and the live site.                                                                                                 |

## Rebuild notes

Notes written while each version was rebuilt (2026-11-15 to 2026-11-21). They lived in the `notes` field of each `edition` document until 2026-11-22. Some name structures that later cleanups removed (`links` groups, extras).

- **2022b**: Ghost (Pro, griko.ghost.io) with Casper 5 (screen.css v=247fc45cf9), forced `dark-mode`, `--ghost-accent-color: #3a4865`, JetBrains Mono for code and highlight.js github-dark. Transcribed from Wayback (home 2023-03-28; pages and posts Nov 2022 – Mar 2023). Covers re-uploaded (Ghost images via Wayback, Unsplash originals); `links` with group `credit:<slug>` hold the Unsplash credits. Dropped: Portal sign-in/subscribe (inert), sodo search, comments, Splitbee analytics, webmentions. Post bodies are the shared posts, which lost their inline images in the migration.
- **2023a**: Source: a local checkout of the 2023a.nibras.co repo at HEAD 93a6838 (GitHub remote gone; the working tree has uncommitted dep bumps, ignored). Live at nibras.co from 2023-04-15 until 2023b replaced it on 2023-08-16. The signature SVG path lives in apps/archive/src/editions/2023a. Basement gradient fallback and noise overlay are stored as extras (category “design”).
- **2023c**: Wayback kept the HTML but not the December 2023 stylesheet or most images. The Figtree font and amber accent come from the site's June 2024 build (same markup); the avatar and about-page polaroid are stand-ins from current portraits; the beams background is approximated in CSS.
- **2024**: Frozen 2026-11-15 from the Bear Blog export (tmp/bearblog) and the live site. Custom CSS copied verbatim from bearblog-settings; Satoshi still loads from api.fontshare.com as on the live site. Dropped: Fathom analytics, the upvote (“toast”) form, email subscribe, the cal.com embed on /schedule (now a plain link), Cloudflare email obfuscation. Unlisted pages (resume, links, dijual/*) and unpublished drafts are left out.
- **v2**: Rebuilt from the 2018 source (106baef) and the Wayback capture of 2018-11-23, with the original compiled stylesheet (Bulma 0.7.2, purged) as captured by Wayback. /open-source listed live GitHub repos at build time and was never archived; the rebuild shows the two repos the site itself linked to, without star counts. The avatar is the Gravatar image as Wayback captured it on 2018-12-10. EmojiOne 4 images are hotlinked from jsDelivr, as the original did.
- **v3**: Rebuilt from legacy/v3 in the v4 commit (e4c856f), with the original compiled stylesheet (Bulma 0.7.5 with the site's overrides, the Ainami Dark Prism theme and EmojiOne classes) as inlined in the Wayback captures of 2019-07-20. Wayback never captured the v3 home page; /about, /blog, /open-source and /socials match the source word for word. Post bodies are the shared post documents, which were edited after 2019; "Hello, world!" exists only here, as an edition page. Disqus comments, the offline service worker and the Bulma Expo redirect are dropped. Inter is self-hosted (3.9 instead of rsms.me's 3.5); EmojiOne images and the 404 GIF stay hotlinked as in 2019.
- **v5**: Reconstruction, not a recovery: no Wayback capture of v5 exists and its Contentful space is gone. Layout, styles and v5's own copy (navbar, footer, about resources, blog and now-playing pages) come from the source at 8bd406a. Works, appearances and contact reuse v4b's data/*.js, which v5's Contentful was seeded from. The blog lists the three posts that predate v5, with titles, subtitles, tags and dates from v6's Contentful; bodies are the shared post documents and hero images are their social images. The Spotify now-playing widget shows a frozen, clearly labelled sample track, not real listening history. Disqus is dropped.
- **v8**: Built from v8b; v8 (https://github.com/grikomsn/multiverse/tree/035089e1e4ace77822db2a0233d85d05601eae6c) is an earlier cut of the same site.
