# Legacy versions v4b, v5, v6: re-hosting analysis

Research date: 2026-11-15. This was read-only: nothing was installed, built or run from the archives.

Archive roots used below (abbreviated as `$V4B`, `$V5`, `$V6`), each the top folder of an extracted zip:

- `$V4B` = `tmp/multiverse-v4b.zip` → `multiverse-1c43f7819656ac8a73259cc163b627af7dc1816f` (commit `1c43f78`, file mtimes 2020-01-18)
- `$V5` = `tmp/multiverse-v5.zip` → `multiverse-8bd406afadb20fec9bba8d8cdb8cafd1b65c30f2` (commit `8bd406a`, file mtimes 2020-01-27)
- `$V6` = `tmp/multiverse-v6.zip` → `multiverse-5b85058dea5ce4b8d73d6d3c95460e74dd6c039b` (commit `5b85058`, `package.json` version `6.2.1`, file mtimes 2020-11-30)

(The zips are in `tmp/`, which is gitignored. Extract them into a temporary folder outside the repo.)

## Summary

| Version | Era                                           | Stack                                                                 | Content source                              | Recoverable?                                                           | Recommendation                        |
| ------- | --------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------- |
| v4b     | Jan 2020                                      | Next 9.2, Tailwind 1, framer-motion 1, SCSS (node-sass)               | In-repo `data/*.js`                         | Yes, all of it is in the repo                                          | **B** (S)                             |
| v5      | late Jan 2020                                 | v4b + Contentful (REST), Spotify now-playing API, Disqus              | Contentful (space ID unknown; env only)     | Mostly no. Rebuild from v4b data + Sanity posts                        | **B** (S–M), shared with the v4b port |
| v6      | May 2020 – ~Apr 2021 (this commit = Nov 2020) | Next 10, Chakra UI 1, Contentful **GraphQL**, puppeteer social images | Contentful (space `kve0ex6jlycb`, now 404s) | **Yes**, from Wayback `__NEXT_DATA__` (text). Images partly via Sanity | **B** (M)                             |

> Correction to the brief: the v6 commit uses **Contentful GraphQL** (`$V6/src/cms.js`, `$V6/codegen.yml`), not DatoCMS. The DatoCMS footer appears on the **May 2020 Wayback capture** (an earlier v6.0 iteration) and on **v7** (Nov 2021). See the cross-version section.

---

## v4b

### 1. TL;DR

v4b is a small five-page Next.js 9 landing site. All of its content is hard-coded in `pages/*.tsx` and `data/*.js`, so it needs no CMS or API. Its look depends on the Tailwind 1 palette, Inter, and framer-motion page transitions plus a draggable Memoji. **Recommend B:** port it to Astro 7 with the data frozen as TS files. The port is small and gives exact content fidelity. C is possible, but it means a Node 12 toolchain with native modules for a tiny gain.

### 2. Overview

- **Era:** January 2020. `package.json` says `"version": "4.0.0"` (name `landing-page`).
- **Stack:** Next `^9.2.0` (`target: 'serverless'`, `$V4B/next.config.js`), React 16.12, TypeScript 3.7, Tailwind `^1.1.4` plus `tailwindcss-transitions`, SCSS via `@zeit/next-sass`/`node-sass ^4.13`, PurgeCSS, `next-optimized-images` (with `imagemin-*` and `responsive-loader`/`sharp ^0.23.4`), `framer-motion ^1.7`, `next-seo ^3`, `use-dark-mode`, `react-icons ^3.8` (Feather).
- **Deploy:** ZEIT Now v2 (`$V4B/now.json`: `alias: ["griko.id"]`, GitHub auto-alias). The footer says "Hosted on Zeit Now".
- **Domain:** `https://griko.id` (`$V4B/site-config.js`). Per earlier notes, griko.id has lapsed and now serves an unrelated site.
- **Build step:** `scripts/favicons.js` generates `/public/icons/*` and `manifest.json` from `images/me.png` with `favicons@5` (sharp). The generated files are gitignored.

### 3. Routes

| Path           | Shows                                                                                                                                                                                       | Source                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `/`            | Draggable Memoji plus a hero: "Hey there. I make [Laravel], [Node], and [React] things. Busy with college and open source stuff. Have a great {weekday}." and an email CTA `hello@griko.id` | `pages/index.tsx`                        |
| `/about`       | Bio (full name, Surabaya, ITATS degree, SurabayaJS organizer, React docs ID translation, hobbies), a "Knowledge Base" 2-column list, and a link to contact                                  | `pages/about.tsx`, `data/kb.js`          |
| `/works`       | "Creations and Projects": 6 cards (screenshot, title, description, tag pills)                                                                                                               | `pages/works.tsx`, `data/works.js`       |
| `/appearances` | "Appearances and Talks": 3 talks with a Feather icon, date, description and tags                                                                                                            | `pages/appearances.tsx`, `data/talks.js` |
| `/contact`     | Emails `hello@griko.id` and `griko@pm.me`, plus 3 link groups (Blog / Development / Social)                                                                                                 | `pages/contact.tsx`, `data/contact.js`   |
| `/_error`      | Generic "{code}: {status}" page                                                                                                                                                             | `pages/_error.tsx`                       |
| `/api/hello`   | Next boilerplate JSON. Drop it.                                                                                                                                                             | `pages/api/hello.tsx`                    |

### 4. Content and mapping to the new Sanity schema

| v4b content                                                                                                                                 | Where             | New type                                                       | Notes / gaps                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Title, description "Software Engineer from Surabaya, ID", twitter, theme `#0096FF`, url                                                     | `site-config.js`  | `site` (per-property)                                          | Fits as is.                                                                                                                                                                                                                                                                                                                                          |
| Hero copy and day greeting                                                                                                                  | `pages/index.tsx` | (none)                                                         | Specific to this version. Freeze it in code (B). For A it would need a legacy-home singleton or `page` blocks.                                                                                                                                                                                                                                       |
| Bio paragraphs                                                                                                                              | `pages/about.tsx` | `profile.bio`                                                  | This is the **2020** bio. The current `profile` says something else, so A would rewrite history.                                                                                                                                                                                                                                                     |
| ITATS degree                                                                                                                                | about             | `education` + `organization` (school)                          | Exists in current Sanity (`education`).                                                                                                                                                                                                                                                                                                              |
| SurabayaJS organizer                                                                                                                        | about             | `involvement` + `organization`                                 |                                                                                                                                                                                                                                                                                                                                                      |
| React docs Indonesian translation                                                                                                           | about             | `contribution`                                                 |                                                                                                                                                                                                                                                                                                                                                      |
| Knowledge Base (6 groups × 4–5 items)                                                                                                       | `data/kb.js`      | `skillGroup`                                                   | This is a 2020 snapshot. The current `skillCategory` docs differ.                                                                                                                                                                                                                                                                                    |
| 6 works: SurabayaJS, localtodo-react, Amazon Cell Phones Reviews, Lazada Indonesian Reviews, prism-theme-ainami-dark, vscode-extension-pack | `data/works.js`   | `project` (name, summary, url, technologies←tags, cover←image) | Current Sanity has **only SurabayaJS** of these 6 (8 projects, mostly later). The rest would need new `project` docs (status: archived).                                                                                                                                                                                                             |
| 3 talks: Slick and Clean JavaScript (2019-10-27), Hooks In A Nutshell (2019-09-22), Landing Page in 5 Minutes (2019-06-20)                  | `data/talks.js`   | `talk` (title, date, summary, slides url, tags)                | **Gap:** a per-talk icon (`FiFeather`/`FiCode`/`FiBookmark`), and v5/v6 used a `category` instead. Add an optional `kind`/`category` enum to `talk`. Current Sanity `appearance` dates are **one day earlier** (2019-10-26, 2019-09-21, 2019-06-19), which looks like a UTC+7→UTC shift. URLs were moved from `*.now.sh` (dead) to `*.onrender.com`. |
| Contact links grouped (DEV, Medium / Docker Hub, GitHub, GitLab, NPM / LINE, Steam, Telegram, Twitter)                                      | `data/contact.js` | `profile` social links (`link` objects)                        | **Gap:** no grouping field. Add optional `group`/`category` on `link`, or freeze it (B).                                                                                                                                                                                                                                                             |
| Emails `hello@griko.id`, `griko@pm.me`                                                                                                      | contact           | `profile`                                                      | Both are on a lapsed domain or a personal mailbox. Decide whether to show them in the archive.                                                                                                                                                                                                                                                       |

**Recoverability:** 100%, since everything is in the repo. No secrets were found. `.gitignore` excludes `.env*`, and none are present.

### 5. Assets

- `images/me.png`: 255×321 Apple **Memoji** (93 KB). It is used for the hero and as the favicon source. Apple artwork is fine for a personal avatar, but note it is Apple-styled.
- `images/works-*.png`: six 2784×1670 screenshots, **≈5.9 MB total**. Re-encode them through `astro:assets` (WebP/AVIF at 800/1280w, matching the original `?resize&sizes[]=800&sizes[]=1280`).
- `public/social.png`: 1024×512 OG image (Memoji plus "Griko Nibras" on `#0096FF`).
- **Fonts:** Inter, loaded from `https://rsms.me/inter/inter.css` (`styles/index.scss`). It is OFL-1.1, so it is fine to self-host. In early 2020 rsms.me served **Inter 3.x**, and it now serves Inter 4 (different metrics and default features). Pin `inter-ui@3.19.x` or `@fontsource/inter@4.x` for fidelity. multiverse-2026 `apps/web-v4` used `inter-ui@4.1.1`.
- **Icons:** `react-icons/fi` (Feather, MIT): FiMoon, FiSun, FiFeather, FiCode, FiBookmark. Inline them as SVG.
- **Favicons:** generated, not committed. Regenerate at build or commit a small set.

### 6. Interactive features and runtime deps

| Feature                                                                                | Implementation                                                               | 2026 status     | Static replacement                                                                                                   |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- |
| Page enter/exit transition (opacity 0→1, y −80→0, exit y +80)                          | `components/main.tsx` + `AnimatePresence exitBeforeEnter` (`pages/_app.tsx`) | OK, client-only | Astro View Transitions with a custom `transition:animate` (slide/fade keyframes), or a CSS `@starting-style` fade-in |
| Draggable Memoji (drag, elastic 0.2, snaps back; hover rotate 2°/scale 1.05; tap)      | `pages/index.tsx` `motion.img`                                               | OK              | A tiny React island with `motion/react`, or ~40 lines of pointer-event JS with a spring back to origin               |
| "Mark" pills lift on hover (y −4)                                                      | `pages/index.tsx`                                                            | OK              | CSS `transform` transition                                                                                           |
| Works cards lift on hover (y −6)                                                       | `pages/works.tsx`                                                            | OK              | CSS                                                                                                                  |
| Dark / "light" toggle with no-flash script; `localStorage.darkMode`; system preference | `use-dark-mode` + inline `noflash` script in `pages/_document.tsx`           | OK              | A small inline script plus a button. Keep the same storage key semantics.                                            |
| Weekday greeting                                                                       | `useEffect` → `new Date().getDay()`                                          | OK              | 5-line inline script (SSR fallback "day")                                                                            |
| Analytics                                                                              | none                                                                         | (none)          | (none)                                                                                                               |

No external APIs, credentials or serverless functions are needed (apart from `/api/hello`).

### 7. Visual identity

- **Type:** Inter (`fontFamily.sans`), headings `font-bold leading-tight tracking-tight`, hero `tracking-tighter`, `antialiased`.
- **Colors** (`tailwind.config.js`): a custom `dodger-blue` scale `100 #0096FF … 900 #001A2A`. Dark mode is `.dark-mode { bg-gray-900 text-gray-300 }` (Tailwind 1 gray-900 = `#1A202C`). "Light" mode is actually a **blue mode**: `.light-mode { bg-dodger-blue-400 (#004D82) text-gray-100 }`. Selection is `bg-dodger-blue-100`. The hero pills are `bg-red-600`/`bg-green-600`/`bg-blue-600`, and the email pill is `bg-yellow-800`. Theme color is `#0096FF`.
- **Layout:** full-height flex column, navbar (name + sun/moon toggle on the left, links on the right, stacked on mobile), `container mx-auto p-4`, `article` max-w-3xl, centered footer in `text-xs text-gray-400`.
- **Port caveat:** Tailwind 4's default palette is OKLCH and differs from Tailwind 1 hex values (TW1 `gray-900 #1A202C` vs TW4 `#101828`-ish). Define the TW1 colors as `@theme` tokens. Hero pill classes are built dynamically (`` `bg-${color}-600` ``), so write them out literally.

### 8. Effort per option

| Option                                | Effort | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Astro + current CMS                | M      | Needs a version-specific singleton (like 2026 `webV4Site`) for the hero, bio and KB. Current data would change what the page says (bio, KB, works list). Weak fit.                                                                                                                                                                                                                                                                                                    |
| **B: Astro + frozen data**            | **S**  | Copy `data/*.js` to TS, convert 5 pages to `.astro`, port about 60 lines of SCSS to TW4 `@apply`/CSS, add 2–3 tiny scripts. 1–2 days.                                                                                                                                                                                                                                                                                                                                 |
| C: original toolchain → static export | M      | Needs Node 12/13 (node-sass 4.13 has no bindings past Node 13), Python 2 + node-gyp if no prebuilt binary, `sharp@0.23` prebuilt, and `imagemin-mozjpeg/optipng` binaries that download from GitHub at install (some mirrors are dead). It needs `next build && next export` (`next export` is not in scripts; `/api/hello` must be removed). Doable in a `node:12` Docker image with the committed `yarn.lock`, but fragile, and the output can't share layout code. |
| D: archive only                       | S      | GitHub tree link plus screenshots. **No Wayback capture of v4b exists** (griko.id CDX: 200 on 2019-10-23, then a 308 to GitHub from 2020-05-10). Screenshots would have to come from a B/C build anyway.                                                                                                                                                                                                                                                              |

**Recommendation: B.** It is the cheapest faithful result, and it is the base the v5 port reuses.

### 9. Risks / open questions

- Should the dark/blue toggle default follow the system setting, as the original did?
- Many outbound links are dead (`*.now.sh` → Vercel retired `now.sh`; `zeit.co/now`). Keep them as historical, or rewrite them to the current URLs (e.g. Sanity's `onrender.com` talk URLs)?
- Show `griko@pm.me` and `hello@griko.id` (lapsed domain)?
- Canonical URLs pointed to `griko.id`. Use the archive host instead and consider `noindex` for archive pages.

---

## v5

### 1. TL;DR

v5 is v4b plus a blog, Contentful-backed works, appearances and contact, a Spotify "now playing" API, and Disqus comments. It is dark-only, and the theme toggle was removed. The Contentful space is gone and **no Wayback capture of v5 exists**, so its exact content cannot be recovered. **Recommend B**, built on the v4b port. Freeze works, appearances and contact from v4b's `data/*.js` (v5 is 9 days newer and almost certainly seeded from it), freeze blog posts from Sanity, render Spotify's "not playing" state statically, and drop Disqus.

### 2. Overview

- **Era:** late January 2020 (still `"version": "4.0.0"`, name `landing-page`). Same layout and components as v4b, with a `LICENSE` (MIT, UTF-16 encoded).
- **Stack:** v4b deps minus `use-dark-mode`/`imagemin-mozjpeg`/`imagemin-svgo`/`sharp`, plus `contentful ^7.13`, `@contentful/rich-text-react-renderer ^13.4`, `spotify-web-api-node ^4`, `react-disqus-comments`, `dotenv`, and `@now/node`. Yarn 1.21.1 is vendored (`.yarn/releases/yarn-1.21.1.js`, 5 MB). It still uses `node-sass ^4.13`.
- **Data fetching:** `getInitialProps` on every CMS page (`pages/works.tsx`, `appearances.tsx`, `contact.tsx`, `blog/*.tsx`). These are **server-rendered per request**, not static.
- **Deploy:** ZEIT Now v2 (`$V5/now.json`: alias `griko.id`, `public: false`, env from Now secrets `@landing-page-contentful-*` and `@personal-api-spotify-*`, cache headers for `/api/now-playing` at 120 s).
- **Domain:** `https://griko.id`. The footer links `griko.dev/cc-by-nc-sa` and `griko.dev/landing-page` (short links).

### 3. Routes

| Path                    | Shows                                                                                                                                 | Data                                                  |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `/`                     | Same hero as v4b (no theme toggle)                                                                                                    | static                                                |
| `/about`                | v4b bio + KB, plus a "Resources" link to `/now-playing`                                                                               | static `data/kb.js` (identical to v4b)                |
| `/works`                | Same card grid as v4b, images from Contentful (`?w=1280&h=768`), newest first                                                         | Contentful `showcase`                                 |
| `/appearances`          | Same list as v4b. The icon is a **Feather icon name string** resolved at runtime (`lib/import-icon.ts`)                               | Contentful `appearances`, `order: -fields.date`       |
| `/contact`              | Same as v4b. Links are stored as `"Description ## URL"` strings                                                                       | Contentful `contactGroupLinks`, `order: fields.title` |
| `/blog`                 | "Blog Posts": up to 10 cards (hero 1280×640, date, title, description, "Read post →")                                                 | Contentful `blogPosts`                                |
| `/blog/[slug]`          | Hero 1600×900, title, description, "Published on {date} / {tags}", rich-text body (embedded image assets with captions), Disqus       | Contentful `blogPosts` by slug                        |
| `/now-playing`          | Album art, track, artist, and "View song on Spotify", or "Currently I am not playing anything… why not head over to my Spotify page?" | client fetch of `/api/now-playing`                    |
| `/api/now-playing`      | Spotify currently-playing proxy with an OAuth code flow                                                                               | Spotify Web API                                       |
| `/api/hello`, `/_error` | boilerplate                                                                                                                           |                                                       |

The navbar order changed to Blog · Appearances · Works · About · Contact (`components/navbar.tsx`).

### 4. Content and mapping

Contentful content types queried (REST, `services/contentful.ts`, `preview.contentful.com` in dev):

| Contentful type     | Fields used                                                                                           | New type                                                                           | Gaps                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `showcase`          | `title, description, url, tags[], image(Asset)`                                                       | `project`                                                                          | same as v4b                                                                                                                                                                    |
| `appearances`       | `title, date, description, url, tags[], icon (Feather name)`                                          | `talk`                                                                             | **icon/kind** field                                                                                                                                                            |
| `contactGroupLinks` | `title, links: string[] ("Desc ## URL")`                                                              | `profile` links                                                                    | **group** on `link`                                                                                                                                                            |
| `blogPosts`         | `heroImage(Asset), title, slug, description, postDate, tags, content (Rich Text with EMBEDDED_ASSET)` | `post` (title, slug, excerpt/seo.description, publishedAt, cover, body `richText`) | **tags** (current Sanity `post` has none). `{post.tags}` is rendered raw (`pages/blog/[slug].tsx`), so an array would print run together. That is a quirk to reproduce or fix. |

**Recoverability:**

- **Contentful space:** the ID is only in env (`CONTENTFUL_SPACE`, Now secret `@landing-page-contentful-space`), so it is unknown. v6's space `kve0ex6jlycb` now returns 404 for assets, and v5's space is presumably gone too. Not recoverable from the CMS.
- **Wayback:** no captures of griko.id between 2019-10-23 and 2020-05-10 (then a 308 to `github.com/grikomsn`). `/works`, `/appearances` and `/now-playing` have no captures at all. Not recoverable.
- **Best reconstruction:** works, talks and contact from `$V4B/data/*.js`, which are field-for-field compatible apart from icon names (`FiFeather`, `FiCode`, `FiBookmark`). Blog posts from current Sanity (`zp0drmxt`): the pre-2020 posts are `exploring-undocumented-get-initial-props-properties-on-next-js` (2018-11-26), `gatsby-js-plugin-priority-vs-ocd` (2019-05-04) and `windows-is-now-great-for-development` (2019-06-14). Sanity also has `new-place-new-chapter` dated 2019-06-03 (it came from Bear Blog, so it was probably not on v5). Hero images: Sanity `seo.image` (1600×900) exists for all of them. Label the v5 archive as "reconstructed" in its footer or README.
- **Secrets:** none committed. `now.json` holds only `@secret` references, and `.env.example` is empty. The Spotify profile link in `pages/now-playing.tsx` has a public `?si=` share param, which is not a secret.

### 5. Assets

- `images/me.png` is the same file as v4b (byte-identical). `public/social.png` is 1024×512 Memoji on dark `#1A202C`.
- Fonts are Inter via rsms.me, the same as v4b. Icons are Feather (any icon by name, via `lib/import-icon.ts`; freeze to the 3 used).
- Works and blog images lived on Contentful (`images.ctfassets.net`) and are gone. Use v4b screenshots and Sanity post images instead.

### 6. Interactive features and runtime deps

| Feature                                                                                      | Status in 2026                                                                                                                                                    | Static replacement                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page transitions, draggable Memoji, hover lifts                                              | same as v4b                                                                                                                                                       | same as v4b                                                                                                                                                                                                                                             |
| **Spotify now-playing** (footer ticker with album-art popover on hover; `/now-playing` page) | **Dead.** It needs a Spotify app client ID/secret and a refresh token held in Now secrets that no longer exist. The API still exists but needs a server (Worker). | Render the existing "not playing" branch: the footer ticker hides itself when nothing is playing, and `/now-playing` shows the fallback copy plus the Spotify profile link. Optionally freeze one representative track as a static "last played" state. |
| **Disqus** (`shortname="griko-nibras"`)                                                      | The account may still exist, but the embed loads third-party ads/trackers                                                                                         | Drop it. Optionally export old comments from the Disqus admin and render them statically, or add a note that comments were on Disqus.                                                                                                                   |
| Analytics                                                                                    | none                                                                                                                                                              | (none)                                                                                                                                                                                                                                                  |

### 7. Visual identity

Same as v4b with these differences (`styles/index.scss` diff): **dark-only**. `html, body` is `bg-gray-900 text-gray-300` and the toggle and `.light-mode` are gone. Article links are `text-dodger-blue-100` (`#0096FF`) with hover `text-blue-300` instead of underline. `p` is `leading-relaxed`, blog paragraphs get `mb-6`, and selection is `bg-gray-700`. Theme color is `#1A202C`. Blog cards are `bg-gray-800 rounded shadow-lg` and lift on hover/tap (y −6/−4). The appearance rows highlight `hover:bg-dodger-blue-500 hover:shadow-lg`.

### 8. Effort per option

| Option                     | Effort                                          | Notes                                                                                                                                                                                                                                         |
| -------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Astro + current CMS     | M                                               | Posts map well. Works and talks lack the v5-era items and the icon field. It would show today's data in a 2020 shell.                                                                                                                         |
| **B: Astro + frozen data** | **S** on top of the v4b port (**M** standalone) | Reuse the v4b components. Add `/blog`, `/blog/[slug]` (Portable Text or Markdown from a frozen Sanity export) and a static `/now-playing`.                                                                                                    |
| C: original toolchain      | L / not viable                                  | Same Node 12 + node-sass issues as v4b, **plus** the Contentful data is gone, so the build/SSR returns nothing. Every page uses `getInitialProps`, which needs a server, or `next export` with mocked data. The Spotify credentials are gone. |
| D: archive only            | S                                               | No Wayback captures exist, so it would be screenshots of a B build plus the GitHub link.                                                                                                                                                      |

**Recommendation: B**, implemented as a sibling variant of the v4b port, labeled as a reconstruction.

### 9. Risks / open questions

- Content is **reconstructed, not recovered**. Is that acceptable for the archive, or should v5 be D (code link plus a note) and point visitors to v4b?
- Which posts were actually live on v5 in Jan–May 2020? Probably the 3 above. The "updated March 2020" note on the getInitialProps post is newer than v5.
- Keep or drop the `/now-playing` page entirely?
- Do you want to recover Disqus comments?

---

## v6

### 1. TL;DR

v6 is a dark, Chakra UI 1 site (Jost font, yellow links, hand-drawn doodle avatar) with home, blog, projects, appearances and about. It used Contentful GraphQL with SSG plus puppeteer-rendered OG images. The Contentful space is dead, but **Wayback captures embed the full page props (`__NEXT_DATA__`)**, including all four posts' Markdown bodies, the about-page preface and KB, all 10 projects and all 7 appearances. **Recommend B:** port it to Astro 7 + Tailwind 4 using Chakra v1 tokens, with content frozen from Wayback. Post images can come from Sanity and dev.to; project screenshots are the one real gap.

### 2. Overview

- **Era:** v6.0 launched about May 2020 (Wayback 2020-05-29, then on DatoCMS). This commit is **v6.2.1, 2020-11-30**, on **Contentful**. It was live until about April 2021. By 2021-05-15 `/about` is DatoCMS-backed (v7 transition).
- **Stack:** Next `^10.0.3`, React 17, TS 4.1, `@chakra-ui/react ^1.0.1` + Emotion 11, `framer-motion ^2.9`, `graphql-request ^3.3` (Contentful GraphQL, `src/cms.js`), `@graphql-codegen` (`codegen.yml` → `src/generated/graphql.ts`), `react-markdown ^5` + `prism-react-renderer` (oceanicNext), `date-fns`, `nprogress`, `next-seo ^4.17`, `next-sitemap`, `rss`, `favicons ^6`, **`puppeteer ^5.5` + `chrome-aws-lambda ^5.5`**. It has ESLint (airbnb-typescript), Prettier and Husky.
- **Data fetching:** `getStaticProps` / `getStaticPaths` (`fallback: false`), so it is effectively static apart from `/social-image` (`getServerSideProps`), the API routes and the build-time rewrite in `next.config.js`.
- **Deploy:** Vercel (`$V6/vercel.json`: env from Vercel secrets `@griko-id-contentful-*`, CORS headers on `/api/*`; `now-build` script).
- **Domain:** `https://griko.id` (`$V6/site-config.js`). The package repo field is `github.com/grikomsn/griko.id`.

### 3. Routes

| Path                                                      | Shows                                                                                                                                                                                                                                                   | Data                                                  |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `/`                                                       | Hero "Hi, I'm Griko Nibras." + `descriptionMd` + email CTA + doodle; then a gray.700 panel with **Recent Projects** (showcase where `featuredOrder` exists, ordered), **Recent Appearances** (10), **Recent Posts** (10), each with a "View all" button | `src/pages/index.tsx`                                 |
| `/blog`                                                   | "Blog Posts": a row list (title / subtitle + tags / date)                                                                                                                                                                                               | `blogPostCollection(order: postedAt_DESC)`            |
| `/blog/[slug]`                                            | Optional cover image, title, subtitle, "Posted at …", Markdown body (headings with slug ids, Prism code, captioned images, raw HTML/iframes, tables), "Discuss on Twitter · Share on Twitter"; BlogJsonLd and BreadcrumbJsonLd                          | `blogPostCollection(where: {slug})`                   |
| `/projects`                                               | All showcases A–Z in a 2-column card grid (title, tech, screenshot that slides up on hover)                                                                                                                                                             | `showcaseCollection(order: title_ASC)`                |
| `/appearances`                                            | All appearances: category icon (lightning-talk ⚡, podcast 🎙, talk 💬, workshop 🧑‍🏫), title, date – subtitle, tags                                                                                                                                       | `appearanceCollection(order: date_DESC)`              |
| `/about`                                                  | "Hi, I'm Griko Nibras." + preface (Markdown) + email CTA + round avatar `/me.jpg`; **Knowledge Base** (Markdown chunks split on `---`, 2–5 column grid); **Social Presences** (9 links from `site-config.js`)                                           | `aboutPageCollection(limit:1){preface knowledgeBase}` |
| `/social-image?title&description&path`                    | Layout-less 1024×512 card (doodle + title + description + URL), the puppeteer target                                                                                                                                                                    | SSR                                                   |
| `/api/social-image`, `/social-alt.png` (rewrite)          | Puppeteer screenshot of `/social-image` (site default)                                                                                                                                                                                                  | chrome-aws-lambda                                     |
| `/blog/:slug/social.png` → `/api/social-image/blog/:slug` | Per-post OG image (title + subtitle)                                                                                                                                                                                                                    | Contentful + puppeteer                                |
| `/me.jpg`                                                 | Rewrite to the Contentful avatar asset (1280² JPG), resolved at build in `next.config.js`                                                                                                                                                               | Contentful                                            |
| `/rss.xml`                                                | RSS from `scripts/generate-rss.js` (title, subtitle, url, tags, date)                                                                                                                                                                                   | Contentful at build                                   |
| `/sitemap.xml`, `/robots.txt`                             | `next-sitemap`                                                                                                                                                                                                                                          |                                                       |
| `/manifest.json`, icons, `/favicon.ico`                   | `favicons` from `src/public/favicon.png`                                                                                                                                                                                                                |                                                       |
| `/google41e31c2ed30c708d.html`                            | Search Console verification                                                                                                                                                                                                                             | drop                                                  |

The navbar and footer use `src/routes.js` (Blog · Appearances · Projects · About). The mobile drawer adds Home.

### 4. Content and mapping

Contentful GraphQL types (`src/generated/graphql.ts`, `Query` lines 31–43):

| Contentful type               | Fields                                                                      | New type                                         | Gaps                                                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `AboutPage` (singleton)       | `title, avatar(Asset), preface (md), knowledgeBase (md, `---`-separated)`   | `profile.bio` + `portrait` + `skillGroup`        | The KB is 7 groups (Languages, Frontend, Backend, Headless CMS, Tools of the trade, Infrastructure, Currently learning). This late-2020 snapshot differs from the current `skillCategory`. |
| `Showcase`                    | `title, tech[], image(Asset), url, featuredOrder`                           | `project` (name, technologies, cover, url)       | **`featuredOrder`** → need `featured`/order on `project` or on the home doc. There is no description in v6.                                                                                |
| `Appearance`                  | `title, date, subtitle, url, tags[], category`                              | `talk` (+ `involvement` for mentoring workshops) | **`category`** enum (`talk`/`lightning-talk`/`workshop`/`podcast`). Mentoring workshops (DILo, DSC PENS) may belong in `involvement`.                                                      |
| `BlogPost`                    | `image(Asset), title, slug, subtitle, postedAt, tags[], content (Markdown)` | `post`                                           | **`tags`** and a **subtitle** field (Sanity currently uses `seo.description`). The body is Markdown and Sanity has Portable Text.                                                          |
| `site-config.js` (code)       | `descriptionMd`, email, 9 socials, theme `#1A202C`                          | `site` + `profile`                               |                                                                                                                                                                                            |
| `src/copywriting.json` (code) | section titles/descriptions                                                 | `site` / freeze                                  |                                                                                                                                                                                            |
| `.github/FUNDING.yml`         | IssueHunt, Ko-fi, Liberapay, KaryaKarsa, Saweria, Trakteer                  | `profile` links (optional)                       |                                                                                                                                                                                            |

**Recoverability, verified against Wayback `id_` captures with `__NEXT_DATA__` parsed:**

| Content                                                                                                                                                                                                 | Capture                                                | Result                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------- |
| Home (6 featured projects, **7 appearances**, 4 posts)                                                                                                                                                  | `web.archive.org/web/20201101032914/https://griko.id/` | full                                                       |
| About (avatar URL, **full preface Markdown, 7 KB chunks**)                                                                                                                                              | `…/web/20201119010410/https://griko.id/about`          | full text                                                  |
| Projects (**10**: airtable-deno, airtable-dnd, Amazon Cell Phones Reviews, Console Patterns, Deno Land Indonesia, localtodo-react, MDX Logos, Nextplate, puppet-scraper, SurabayaJS, with tech and url) | `…/web/20210303025509/https://griko.id/projects`       | full text. The screenshots are Contentful URLs (404).      |
| Blog index (4 posts)                                                                                                                                                                                    | `…/web/20210411180734/https://griko.id/blog`           | full                                                       |
| `i-made-a-deno-module-registry-using-next-js-vercel-and-github` (19.9 k chars md)                                                                                                                       | `…/web/20201220145621/…`                               | full                                                       |
| `windows-is-now-great-for-development` (5.4 k)                                                                                                                                                          | `…/web/20201205184231/…`                               | full                                                       |
| `gatsby-js-plugin-priority-vs-ocd` (6.0 k)                                                                                                                                                              | `…/web/20201205170508/…`                               | full                                                       |
| `exploring-undocumented-getinitialprops-properties-on-next-js` (10.0 k)                                                                                                                                 | `…/web/20210117164647/…`                               | full                                                       |
| `/appearances` page                                                                                                                                                                                     | only a DatoCMS-era capture (2021-07-23) exists         | Use the home capture instead. Home shows all 7 (limit 10). |

The extracted JSON was saved to a temporary folder outside the repo during this research. It was not kept. To use option B, extract it again from the captures above.

**Images:**

- Contentful (`images.ctfassets.net/kve0ex6jlycb/…`) returns **HTTP 404**. A Wayback lookup of two screenshot URLs (with `?w=1280`) also returned 404. A broader CDX prefix search failed because the Internet Archive was rate-limiting or offline during research, so this is **not fully ruled out**.
- Post inline images: the Deno post's 14 images are on `dev-to-uploads.s3.amazonaws.com` (still **200**). The getInitialProps (3) and Gatsby (1) post images exist in Sanity as `externalImage` blocks on `cdn.sanity.io` with matching alt text.
- Post covers: Sanity `seo.image` (1600×900) exists for all 4 posts.
- Avatar `/me.jpg`: use a Sanity `portrait`, since the original asset is gone.
- **Project screenshots: the real gap.** Options: retry the Wayback CDX for `images.ctfassets.net/kve0ex6jlycb/*`; reuse the v4b `works-*.png` for localtodo-react, Amazon Cell Phones Reviews and SurabayaJS (different, older screenshots); re-shoot sites that are still live; or render title-only cards.

**Differences vs current Sanity (`zp0drmxt`)**, which matter for A and for redirects:

- Slug mismatch: v6 `exploring-undocumented-getinitialprops-properties-on-next-js` vs Sanity `exploring-undocumented-get-initial-props-properties-on-next-js`. Add a `redirect`.
- Sanity dates look wrong or shifted. `i-made-a-deno-module-registry…` is **2019-06-03** in Sanity vs **2020-06-04** in v6. `windows-is-now-great…` is 2019-06-03 vs 2019-06-14. Others are T17:00Z of the previous day (UTC+7 shift). "Deno In A Nutshell" is 2020-11-06 in Sanity vs **2020-07-11** in v6. Fix these during migration.
- Sanity has 5 appearances. **Missing:** "DILo x Cilsy: #DILoDevelopersClass" (2019-11-25, workshop) and "DSC PENS Campus Roadshow" (2019-03-09, workshop).
- Sanity has 8 projects. Of v6's 10, only airtable-deno, Deno Land Indonesia and SurabayaJS exist.
- Sanity `post` has no `tags` or `subtitle`.

**Secrets:** none committed. `vercel.json` holds only `@secret` references, and `.env.example` is empty (it lists `CONTENTFUL_MGMT_KEY`, which suggests a management token existed. Rotate or revoke it in Contentful if the account still exists). The Contentful space ID `kve0ex6jlycb` is public in asset URLs and is not a secret.

### 5. Assets

- `src/public/favicon.png` 1024×1024 and `src/public/social.png` 1024×512 (doodle avatar in a white circle + "Griko Nibras" in Jost on `#1A202C`).
- **Doodle avatar:** inline SVG in `src/components/doodle-desktop.tsx` (with shoulders/body) and `doodle-mobile.tsx` (circular crop), 340×340 viewBox, fills `#1A202C/#2D3748/#CBD5E0/#FDDEC2/#CAB29B/#8E959D`. Port it directly to an `.astro`/`.svg` component. **Provenance is unknown** (it looks like a commissioned or avatar-maker illustration), so confirm you have the rights.
- **Fonts:** **Jost** (OFL-1.1) and **Cousine** (Apache-2.0) from Google Fonts (`src/pages/_document.tsx`). Self-host via `@fontsource/jost` / `@fontsource/cousine`. No licensing issues.
- **Icons:** `react-icons/fa` (Font Awesome 5 Free: icons CC BY 4.0, brand marks are trademarks): FaDiscord, FaGithub, FaTwitter, FaBars, FaTimes, FaArrowRight, FaBolt, FaChalkboard, FaMicrophone, FaRegCommentAlt.
- **Code theme:** prism-react-renderer `oceanicNext` (MIT). Shiki has no exact equivalent, so copy the theme tokens.

### 6. Interactive features and runtime deps

| Feature                                                               | Implementation                                           | 2026 status                                                                     | Static replacement                                                                                                                                                                                                     |
| --------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Puppeteer OG images** (`/social-alt.png`, `/blog/:slug/social.png`) | `chrome-aws-lambda` + `puppeteer@5` on Vercel functions  | Dead for a static target. Chromium-on-Lambda doesn't fit Workers static assets. | Prerender PNGs at build: an Astro endpoint with `getStaticPaths` using **satori + @resvg/resvg-js** (or `astro-og-canvas`) and the same 1024×512 layout (doodle, title, description, URL), or just reuse `social.png`. |
| `/me.jpg` rewrite                                                     | build-time GraphQL query in `next.config.js`             | dead (Contentful)                                                               | static file                                                                                                                                                                                                            |
| Page transitions (identical variants to v4b/v5)                       | framer-motion 2 + `AnimatePresence`                      | OK                                                                              | Astro View Transitions custom animation                                                                                                                                                                                |
| NProgress top bar (`#29d`)                                            | Router events                                            | OK                                                                              | Optional with View Transitions (`astro:before-preparation` / `astro:after-swap`), or drop                                                                                                                              |
| Mobile FAB → right drawer                                             | Chakra `Drawer`                                          | OK                                                                              | `<dialog>` + CSS slide-in, about 30 lines of JS                                                                                                                                                                        |
| Click-to-copy email with tooltip and toast                            | Chakra `useClipboard`/`Tooltip`/`useToast`               | OK                                                                              | Small script + CSS tooltip/toast                                                                                                                                                                                       |
| Forced dark mode                                                      | `<DarkMode>` + `ColorModeScript initialColorMode="dark"` | OK                                                                              | Static dark CSS only                                                                                                                                                                                                   |
| RSS, sitemap, robots                                                  | build scripts                                            | OK                                                                              | `@astrojs/rss`, `@astrojs/sitemap`, `astro-robots-txt` (as in 2026 web-v4)                                                                                                                                             |
| "Discuss/Share on Twitter"                                            | links                                                    | Twitter→X. Search links still resolve.                                          | Keep as historical links                                                                                                                                                                                               |
| Analytics                                                             | none in code                                             | (none)                                                                          | (none)                                                                                                                                                                                                                 |

### 7. Visual identity

- **Type:** Jost for body and headings. Cousine for mono. A custom Chakra scale (`src/theme.ts`): xs 14 / sm 16 / md 18 / lg 20 / xl 24 / 2xl 28 / 3xl 36 / 4xl 48 / 5xl 64 / 6xl 72 px.
- **Colors (Chakra v1 defaults):** body `gray.800 #1A202C`, panels `gray.700 #2D3748` `rounded-md`, project cards `gray.600 #4A5568` (hover `whiteAlpha.400`), text `whiteAlpha.900`, muted `gray.400 #A0AEC0`, borders `whiteAlpha.300`, row hover `whiteAlpha.100`, **links and link-headings `yellow.300 #F6E05E`** (underline on group hover), nprogress `#29d`. Theme color `#1A202C`.
- **Layout:** `maxW 6xl` (72rem) centered stack. The navbar has the name, inline links and social icons on the right. The hero is a flex row with the doodle on the right (column-reverse on mobile). A single gray.700 panel holds the sections, separated by TitleSeparator (lg heading + sm regular subheading). The footer has license/credits Markdown, social icons, and right-aligned route links. A round FAB sits bottom-right on mobile.
- **Signature effects:** the hover-lift on project screenshots (−12px), the slide-in page transition, the hand-drawn doodle, and the yellow-on-slate palette.
- **Known bug to decide on:** the post header prints `Posted at {format(new Date(), …)}` (`src/pages/blog/[slug].tsx`), so it showed the **build date**, not `postedAt`. The list pages use `postedAt` correctly.

### 8. Effort per option

| Option                     | Effort               | Notes                                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A: Astro + current CMS     | L                    | Needs tags/subtitle on `post`, category on `talk`, featured order on `project`, 7 more projects, 2 more talks, a v6-era about/KB (version singleton), and date fixes. The result would still drift from what v6 said.                                                                                                                                                                             |
| **B: Astro + frozen data** | **M**                | Content is ready (Wayback JSON). Work: Chakra-v1 token theme in TW4, ~8 components, Markdown rendering with the same renderer behaviors (heading ids, captioned images, Prism oceanicNext, raw HTML), prerendered OG images, RSS, and the image backfill. About 3–5 days.                                                                                                                         |
| C: original toolchain      | L / not viable as-is | Node 14, `puppeteer@5` downloads its own Chromium at install, and `chrome-aws-lambda`. Every page needs Contentful at build (dead). `next export` is blocked by `getServerSideProps` (`/social-image`), API routes and async rewrites, so it needs code surgery (a mock `cms.js` that serves the Wayback JSON) plus pinning the 2020 lint/codegen toolchain. That is a fork, not "original code". |
| D: archive only            | S                    | Wayback captures are good (2020-11-01 home, posts, about, projects). GitHub tree plus screenshots taken from Wayback.                                                                                                                                                                                                                                                                             |

**Recommendation: B.** The content is fully recoverable as text, the site is static by nature, and the only dynamic feature (OG images) has a clean build-time replacement.

### 9. Risks / open questions

- **Which v6?** The commit is v6.2.1 (Contentful, Nov 2020). The May 2020 v6.0 (DatoCMS, different hero copy: "I do full-stack web development using Laravel, Node.js, and React-based frameworks…", 4 projects incl. "deno-create-now-fn" and "Shrtn") is a separate state. Archive only the commit's state (recommended), or both?
- The project screenshot backfill (see §4). Retry the Wayback CDX when IA is reachable.
- Replicate the "Posted at {build date}" bug, or show `postedAt`?
- Doodle illustration rights (§5).
- `/blog/:slug` slugs in v6 vs Sanity differ for one post. If old griko.id links get redirected anywhere, include a `redirect`.

---

## Cross-version notes

### Shared code worth sharing between ports

- **v4b ↔ v5 are essentially one codebase.** These are identical or near-identical: `components/{a,content,kb,layout,main}.tsx`, `pages/{index,about}.tsx` (v5 adds a Resources section), `pages/_document.tsx` (v5 drops the no-flash script), `tailwind.config.js` (identical), `data/kb.js` (identical), and `images/me.png` (byte-identical). They differ in `styles/index.scss` (dark-only, link color, blog styles) and `navbar.tsx`/`footer.tsx`. **Build one Astro app (or one shared package) with a `variant: "v4b" | "v5"` switch** controlling: the theme toggle vs dark-only, the nav items, the footer credits, the blog and now-playing routes, and the selection/link colors. Two base paths, one component set.
- **The page transition is shared by all three:** `initial {opacity:0,y:-80}`, `enter {opacity:1,y:0}`, `exit {opacity:0,y:80}` (`$V4B/components/main.tsx`, `$V5/components/main.tsx`, `$V6/src/pages/_app.tsx`). Write one Astro View Transitions animation helper and reuse it.
- **Shared Tailwind-1-era palette:** v4b/v5 TW1 grays and v6 Chakra v1 grays are the **same hex values** (`#1A202C`, `#2D3748`, `#4A5568`, `#A0AEC0`, `#CBD5E0`, `#F6E05E`, …). One `legacy-2020-palette.css` `@theme` block can serve all three.
- **Shared content snapshots:** the talks (Slick and Clean JS, Hooks In A Nutshell, Landing Page in 5 Minutes) appear in v4b, v5 and v6, and the projects (localtodo-react, Amazon Cell Phones Reviews, SurabayaJS) in v4b and v6. Keep the frozen data per version, since the wording differs, but one TS type for `LegacyTalk` / `LegacyProject` is enough.
- **Favicon/manifest generation** (`favicons` npm in all three) → commit static icon sets per version instead.
- **Prior art:** multiverse-2026 `apps/web-v4` (Astro, static, `@astrojs/sitemap`, `astro-robots-txt`, sharp, Lightning CSS, Sanity `webV4Site` singleton). Reuse its `astro.config.mjs` shape. These three versions don't need a Sanity singleton if they go with B.

### Wayback snapshot ↔ version matches (`nbr.st` redirects + extra captures)

| `nbr.st` redirect | Capture                            | What it is                                                                                                                  | Version                                           |
| ----------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 2017              | 20171202233622 griko.id            | (not inspected, pre-scope)                                                                                                  | v2-era (other report)                             |
| 2018              | 20181123052514 griko.id            | (not inspected, pre-scope)                                                                                                  | v4-era (other report)                             |
| (not listed)      | 20191023195705 griko.id, 200       | last capture before v4b                                                                                                     | probably v4 (Gatsby)                              |
| 2020              | 20200615055757 github.com/grikomsn | griko.id 308→GitHub (also captured 2020-05-10 and 2020-07-28; Zeit Now headers)                                             | **none.** v4b/v5 were never captured              |
| 2020a             | 20200529121219 griko.id            | Next + Chakra UI + **DatoCMS** (`datocms-assets.com/28129`), Jost, "Hi, I'm Griko Nibras. I do full-stack web development…" | **v6.0** (early iteration of v6, not this commit) |
| 2020b             | 20201101032914 griko.id            | Next + Chakra UI + **Contentful**, copy matches `$V6/site-config.js` `descriptionMd` and `src/copywriting.json` verbatim    | **v6 (this commit's line, v6.2.x)**               |
| 2021              | 20211128092119 griko.id            | "Hey! I'm Griko Nibras…", footer "Made using Next.js, Chakra UI, and DatoCMS… Version 7."                                   | v7                                                |
| 2022              | 20220404093816 griko.id            | Tailwind, "About · Writings · Timeline", "Version 8."                                                                       | v8                                                |

Extra v6 captures used: `/about` 20201119010410, `/projects` 20210303025509, `/blog` 20210411180734, posts 20201205170508 / 20201205184231 / 20201220145621 / 20210117164647. The v6→v7 cutover falls between 2021-04-11 (`/blog`, still Contentful) and 2021-05-15 (`/about`, DatoCMS).

### Cross-cutting decisions for the owner

1. **Hosting path vs subdomain:** all three use root-absolute links (`/about`, `/blog/[slug]`, `/social.png`, `/icons/*`). With a path prefix, set Astro `base` and route every link and asset through it.
2. **Canonical/indexing:** every version hard-codes `https://griko.id` in canonicals, OG and JSON-LD, and that domain has lapsed. Rewrite these to the archive URL and consider `noindex` so the archive doesn't compete with the new site's posts (same post slugs).
3. **Dead outbound links** (`*.now.sh`, `zeit.co`, `griko.dev/*` short links, Twitter→X): keep them verbatim as history, or rewrite them?
4. **Data fixes for the new CMS** (found while cross-checking): post date shifts and errors, one slug mismatch, 2 missing talks, 7+ missing historical projects, and no `tags`/`subtitle` on `post`, `category` on `talk` or `featured` on `project`.
