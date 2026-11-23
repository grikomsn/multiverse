# Redesign: the lineage design

Plan dated 2026-11-16. It replaces the "bus seat" design (paper and ink palette, stickers, speech bubbles, tilted cards, serif headings). That design came from the game art in `references/`, not from the earlier versions of this site.

## What the earlier versions have in common

The source for this list is the 14 rebuilt editions in `apps/archive` and the live sites (nibras.co on Bear Blog, resume.nibras.co, media.nibras.co).

| Trait                     | Where it shows                                                                                   | Keep it as                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| Greeting headline         | "Hey there" (v3, v4b, v5), "Hi, I'm Griko Nibras." (v6), "Hey! I'm Griko Nibras." (v7)           | `Hey there, I'm Griko.` as the home `h1`                                   |
| Illustrated avatar        | Cartoon (v3), memoji (v4b, v5, v7), line art (v6, 2024), photo (v8, 2023b)                       | Gri, the cartoon face on amber, in a circle (see "Mascot and icons")       |
| Yellow or amber accent    | Yellow background (v2, v3), yellow links (v6, v7, v9), amber (2023c), underlined links (2024)    | Amber underlines on links; the only accent color                           |
| Highlighted stack words   | Red, green and blue marks on "Laravel, Node, and React" (v4, v4b, v5)                            | Soft marks on today's stack: "I make TypeScript, React, and Tauri things." |
| Grotesque sans type       | Inter (v4, v4b, v5, v7, 2023b), Figtree (2023c), system fonts (2024)                             | Timeless Sans for all text; a system monospace font for dates and labels   |
| Bio with inline org links | Every version since v4                                                                           | One short paragraph with links to the current and past organizations       |
| Email call to action      | "Drop a mail at…" (v4b, v5), "Reach me via email…" (v7), "email me at…" (2023b–2024)             | "Send an email to griko@nibras.co, or book a call."                        |
| Light and dark            | Light (v2–v4, 2023b, 2024); dark (v4b–v9, 2022b, 2023a); toggle (v8, v9, 2023b, 2023c)           | Follow the system setting, with a toggle                                   |
| Narrow single column      | About 40–45 rem from v4 to 2024                                                                  | `max-w-2xl` reading column; wider only for project grids                   |
| Plain post list           | Title, date and description (v8, v9, 2023c, 2024)                                                | The title, then the date in monospace on the right; no cards               |
| Colophon footer           | "Made with Next.js, Tailwind CSS… Hosted on…", "Contents licensed under CC BY-NC-SA 4.0" (v4–v7) | Colophon line, plus links to every older version                           |
| Top text navigation       | Top right (v2–v7), floating dock (v9, 2023b, 2023c), sidebar list (2024)                         | Top-right text links: Blog, Work, About, Now                               |

What to remove: the paper, ink and terracotta palette, stickers, speech bubbles, tilted cards, hard drop shadows, Timeless Serif headings, the "station" rail, and the spring entrance animations. Motion stays only for theme changes, hover states, and view transitions between pages. (Superseded on 2026-11-22: see "Motion and dither".)

A scratch mockup with current CMS data was reviewed on 2026-11-16 in light, dark and at 390 px. In the build, each experience row puts its dates on a new line at narrow widths.

## Design tokens

`packages/theme` becomes `packages/ui` (see "Code layout" below). The tokens:

| Token          | Light                         | Dark                          |
| -------------- | ----------------------------- | ----------------------------- |
| `bg`           | `#fbfaf7`                     | `#17181c`                     |
| `fg`           | `#18181b`                     | `#ececf1`                     |
| `soft`         | `#5b5b66`                     | `#a1a1ad`                     |
| `line`         | `#e7e5e0`                     | `#2b2d34`                     |
| `card`         | `#ffffff`                     | `#1e2025`                     |
| `accent`       | `#eab308` (underlines)        | `#facc15`                     |
| `accent-ink`   | `#8a5a00` (text, 4.5:1)       | `#facc15`                     |
| `mark-{r,g,b}` | `#fde2e1` `#dcf3e4` `#dde9fb` | `#5b2422` `#1f4a33` `#1f3a63` |

Type: Timeless Sans 400–700 (already subset by `scripts/subset-fonts.sh`). Remove Timeless Serif and Neue Regrade from the build.

## Scope per app

| App                | Change                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `web`              | Full redesign: home, blog, post, work, pages (about, now, uses), 404                      |
| `media`            | Same shell as `web`; the portrait grid keeps square tiles; lightbox in the new tokens     |
| `resume`           | Keep its layout (it is already plain and print-first); swap in the shared tokens and font |
| `archive` index    | Same shell as `web`; one row per version with a screenshot; no tilts                      |
| `archive` editions | No change to their design                                                                 |

## Code layout (breaking changes, no backward compatibility)

Today each app has its own copy of the Sanity client, date and image helpers, the rich-text renderer, and the header and footer. The redesign moves the shared parts into two packages:

| Package            | Holds                                                                                                                                                                                                                                         | Replaces                                                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `packages/ui`      | `tokens.css` (Tailwind `@theme`), base and prose CSS, the Astro Fonts config helper, and the shell components: `SiteHeader`, `SiteFooter`, `ThemeToggle`, `RichText` with figure, code and embed blocks                                       | `packages/theme`, `apps/web/src/components/*`, the media header and footer                                  |
| `packages/content` | `createSanityClient()`, shared GROQ fragments, view models (`Person`, `Stop`, `PostSummary`, `ProjectCard`, `Talk`, `SiteLinks`), format helpers (`formatDate`, `formatRange`, `imageUrl`, `srcset`, `groupByOrganization`, `readingMinutes`) | the four `src/lib/sanity.ts` files, `apps/web/src/lib/format.ts`, `apps/media/src/lib/portraits.ts` helpers |

Rules:

- An app keeps only its routes, the queries for those routes, and components that no other app uses.
- Queries stay next to their consumer: one `queries.ts` per app, plus `packages/content/src/fragments.ts`. Typegen also scans `packages/content/src`.
- Components live next to the feature that uses them (`src/components/<feature>/`), not in one flat folder.
- Each archive edition stays self-contained in `src/editions/<key>/`. It gets its data through the adapter described below, not through its own GROQ.

## Archive on current data

Goal: each older version keeps its design but shows today's profile, posts, projects, talks and links.

### Finding

Changing the query is not enough. Every edition reads one `edition` document through `getEdition(key)`, and many layouts depend on the shape of that document's period content. For example:

- v4b and v5 need an intro of exactly two blocks, with framework names as colored links.
- v8 splits the intro at "based on ".
- v9 needs the `!@…@!` lead syntax.
- Most editions list posts from `extras` rows, not from `posts`.

The full field map is in [legacy/data-map.md](legacy/data-map.md).

### Design: one current-data layer, one adapter, per-edition settings

```
packages/content  getLiveSite()      profile, home, posts, projects, talks, experience, skills, pages
                        │                (also used by apps/web, so both sites read the same data)
apps/archive      toEdition(live, edition, settings)  →  the existing `Edition` shape
                        │
src/editions/<key>/settings.ts       label for each platform, talk icon for each kind, intro template,
                                     list limits, which period-only items to keep
```

- `getEdition(key)` returns `toEdition(…)`. Edition code does not change, except where noted below. (Superseded: see "How the archive shows current content".)
- The adapter builds the rows that editions expect from current documents:
  - `extras` "post" rows and `posts` references come from `post`;
  - `projects` come from `project`, and `featured` sets the "featured" category;
  - `talks` come from `talk`;
  - `links` come from `profile.socialLinks`, `site.navigation`, `email` and `scheduleUrl`;
  - `skills` come from `skillGroup`;
- Intro and bio: each edition's `settings.ts` has an `intro(live)` function. It writes the edition's own sentence pattern with current facts. For example, v4b gives "Hey there. I make TypeScript, React, and Tauri things." with marks colored from a shared map of framework colors. If an edition has no template, it keeps its period intro.
- Period-only items stay in the `edition` document and are merged in: v2 wordmark, signatures, the 2023c polaroid, 2023a textures, v5 now playing, and the v8/v9 playground pages.
- The archive banner says the page shows today's content.

### Rollout

| Phase | Editions                   | Work                                                                                                                                    |
| ----- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | 2024, 2023c, v6, v9        | Adapter and settings; post `cover` in the query; embeds with only a `url`                                                               |
| 2     | v7, v8, 2022b              | Stop blurring real covers (v7, v9); label lookups by platform                                                                           |
| 3     | v4, v4b, v5, v2, v3, 2023a | Intro templates, talk-kind icon maps, project covers in the CMS (v4/v4b/v5 hide projects without one), 2023a media page from `portrait` |

Schema additions in current documents, and only where an edition needs them:

- `post.tags`: needed by 2022b tag pages and v6/v7 tags.
- Covers on `project`: content work, not schema.
- `talk.kind` already exists; each edition maps it to its own icons.

### Archive code cleanup

The editions repeat the same helpers. The duplicates move to `apps/archive/src/editions/_kit/`:

- the PortableText wrapper (8 copies);
- `embed` (2 sets of identical copies);
- `link-mark`;
- `assetUrl` and `assetSize` (10 copies);
- `postEntries` (7 copies);
- the ordinal date format;
- `trimProtocol`;
- `pageOf`.

Each edition keeps its own visual components.

### Decided: today's content only (2026-11-21)

`/original/<key>/` served each version's period copy from 2026-11-17 to 2026-11-21. It is gone: every version shows today's content, and `/original/*` redirects to the same page. The period copy is deleted from Sanity; the dataset export in `tmp/` and the git history keep it. The Wayback links and screenshots on the index show each version as it was.

## Order of work

All steps done on 2026-11-16, one commit each:

1. `packages/content`: shared client and format helpers.
2. `packages/ui` and the new tokens; redesign of `web` (home, blog, post, work, pages, 404).
3. `media` and the archive index on the shared shell. `resume` gets the tokens and font, and stays light because it is a printed document.
4. `getLiveSite()` and `LIVE_SITE_QUERY` in `packages/content`. `web` keeps its own per-page queries. They fetch only what each page shows; the live query loads every post body for the archive.
5. Archive adapter (`apps/archive/src/lib/live.ts`), with a `live.ts` for all 14 editions.
6. `src/editions/_kit`: shared asset helpers, dates and the embed component.

## How the archive shows current content

- `bun run --filter archive build` builds every version with today's content at `/<key>/`. Then `scripts/check-period-facts.ts` fails the build if a page states a period fact: an old host, a dead profile or a period address.
- `getEdition(key)` (`src/lib/editions.ts`) returns `toEdition(meta, live, settings)` from `src/lib/live.ts`. `meta` is the `edition` document: dates, status and design `assets` (the v2 wordmark and plug images, the v3 signature and 404 GIF, the 2023a textures, favicons, the v3 mascot and v5/v7 animojis, the v7/v8 about cover).
- `src/editions/<key>/live.ts` holds what belongs to the design:
  - `pages`: every page the design has, with its heading and description in the version's own words. A page shows a current page (`from`) or a body built from current facts (`body`), such as a contact list.
  - `links`: navigation and footer links that are not profiles, in the version's labels.
  - `group`: the heading each profile goes under, from the shared kind of each platform (`SOCIAL_PLATFORMS` in `@multiverse/sanity/constants`).
  - the intro, headline and description in the version's own sentence pattern, with current facts;
  - post URLs, project and talk categories, and a final `transform` for edition-only rows.
- What each part shows:
  - Profiles: every `profile.socialLinks` entry, with today's name for each network. Featured ones fill headers and footers. Each design uses its own icon set and falls back to a Simple Icons mark (`@multiverse/ui/brand-marks`), because Font Awesome 5.5 has no X, Bluesky or Matrix.
  - Projects: every current project; all have a `cover`. v2 shows featured projects as "Recent works" and projects with a repository as "Open Source".
  - Avatar: a version drawn around a mascot keeps it (an edition asset named `mascot`); the rest show the site's mascot (the profile's `icon`), rounded where the design is round.
  - Photos: v7 and v8 keep their about-page cover as a design asset. The 2023c polaroid is gone, and that about page shows only text.
  - Covers: every project and post cover sits in a fixed frame, because today's covers come in a few ratios.
  - Footers: "Made with" names Astro and the version's own CSS framework, "Hosted on" names Cloudflare, and copyright years run from 2018 to the build year (`_kit/colophon.ts`).
  - Post pages share `nibras.co/blog/<slug>` on X with today's handle (`_kit/share.ts`).
- Kept as 2018 copy because it is still true: v2's specialty cards and "Shameless plug" cards, which link to today's DEV, Medium and DeviantArt profiles. v9 keeps its tagline as its headline.
- Removed because no current fact stands behind them: v5's now-playing page and ticker, v8's thanks page, v9's sponsors page and its unfinished post, v3's hello-world post and `griko.dev` links, 2022b's Unsplash credits.
- Removed editions (2026-11-21): v4b, folded into v5 because they share one design (`/v4b/*` redirects to `/v5/`), and 2023b, which was never rebuilt.
- Edition base paths read `import.meta.env.BASE_URL`. Never hard-code `/<key>/` in edition code.

## Motion and dither

Decided on 2026-11-22, after a look at Framer portfolio sites and [Paper Shaders](https://shaders.paper.design/). It replaces the rule that motion stays only for theme changes, hover states and view transitions.

### Rules

- Dither is the one visual motif: dots in a 4×4 Bayer pattern, in the accent color or the text color. Use it for decoration, never for text.
- The page keeps the browser's own scrolling. No smooth-scroll library, custom cursor, loading screen, ticker or horizontal scroll.
- Motion that follows the scroll position uses CSS scroll timelines. It needs no script, and nothing plays by itself.
- Motion that plays by itself runs once (the hero entrance, a chart that draws) or stays in a decorative canvas (the wave).
- Text moves with `transform` only and is never transparent. Canvases, a stroke that draws and a number that counts up are allowed.
- `prefers-reduced-motion` stops all of it: waves become still pictures, and pictures load as usual.
- Every effect is optional. Without JavaScript, WebGL or scroll timelines the page shows the same content.

### Parts

| Part                | Where                                | How                                                                                                                                                                                                                                                                                                                                                 |
| ------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero wave           | Home                                 | `@multiverse/ui/dither-wave.astro`: the "wave" shape of the Paper dithering shader (`@paper-design/shaders`, WebGL 2). Dots of 3 px, 60% strength. It sits in the top right corner and fades out in every direction; its band runs the full width of the window, so it has no edge. It loads when the browser is idle, and leans toward the pointer |
| Hero entrance       | Home                                 | CSS in `apps/web/src/styles/global.css`: words rise from a clip line, then the marks swipe in. Once in a browser session                                                                                                                                                                                                                            |
| Footer band         | Every page                           | `dither-band.astro`: the same wave on a 2D canvas, about 12 frames a second, only while it is on screen                                                                                                                                                                                                                                             |
| Project marks       | Home and Work cards, Work rows       | `project-mark.astro`: the shape of `project.icon`, filled with the wave. Still in the text color; amber and moving under the pointer                                                                                                                                                                                                                |
| Developing pictures | `/media`, figures in posts and pages | `src/scripts/develop.ts`: coarse dots, finer dots, then the picture                                                                                                                                                                                                                                                                                 |
| 404 number          | `/404`                               | The fours as a shape, filled with the wave. The zero is the mascot, dizzy: its wobble plays once when the page opens, and again under the pointer                                                                                                                                                                                                   |
| Reading progress    | Posts                                | `.read-progress` in the header: a scroll timeline on the page                                                                                                                                                                                                                                                                                       |
| Settle on scroll    | Sections marked `data-reveal`        | A view timeline. This replaced the script that revealed sections                                                                                                                                                                                                                                                                                    |
| Header brand        | Home                                 | Slides up from a clip line as the hero avatar leaves. A script in `site-header.astro` states the two ends (hidden, shown), so the brand never shows over the avatar where the scroll timeline does not run, as in Safari 26                                                                                                                         |
| Theme change        | The toggle                           | The new theme opens as a circle from the button (view transition). The mascot puts on sunglasses for the dark theme, and squints at the light one                                                                                                                                                                                                   |
| Mascot moods        | Home, every header, `/404`           | `gri.astro` and `gri.css`: a mood has a resting pose and one short move, which plays once when the mood starts. See "Mascot and icons"                                                                                                                                                                                                              |
| Marked words        | Home                                 | CSS in `global.css`, with `:hover` and no script. Small pictures made of dots (`dot-icon.astro`) pop up over a marked word: tools for "useful", hearts for "friendly". "fast" leans forward with dotted lines behind it. `REACTIONS` in the home page names the effect and the mood of each word                                                    |
| City time           | Home                                 | The city in the intro is a button. Under the pointer or the focus, a label shows the time there, with a sun from 06:00 to 18:00 and a moon at night. The time zone is the profile's `timeZone`; without it the city is plain text                                                                                                                   |
| Progressive blur    | The lower edge of the window         | `progressive-blur.astro`: five backdrop blurs, each masked to its own band, so no line shows where the blur starts. It is off while the footer band is in view                                                                                                                                                                                      |
| Header ground       | Every page                           | The page color at 85% over a 12 px blur. It is off at the top of the page and comes in over the first 1.5rem of scroll, so the hero wave is sharp under the links                                                                                                                                                                                   |
| Cards               | `.card-spot`                         | An accent light on the border follows the pointer                                                                                                                                                                                                                                                                                                   |
| Numbers and charts  | `data-count`, sparklines             | Count up and draw once, when they enter the view                                                                                                                                                                                                                                                                                                    |

### Costs

- The shader is one lazy chunk of about 8 KB (gzip), loaded only on the home page. `@paper-design/shaders` is version 0.0.x and its README warns of breaking changes, so the catalog pins it.
- All other dither is one module, `@multiverse/ui/dither`. A canvas holds one pixel for each dot, so a frame is a few thousand pixels.
- Browsers limit WebGL contexts. Use the shader for one large surface on a page, and the 2D canvas for everything else.

### Pictures for a canvas

A canvas must read pixels, and a browser cannot read them from `cdn.sanity.io` (see AGENTS.md). The build inlines a small copy as a data URI (`apps/web/src/lib/inline-image.ts`): a project icon as it is (SVG) or 192 px high, and a 96 to 128 px JPEG for a picture that develops.

### Project icons

`project.icon` is the project's own mark, or the mark of what it is built for. A one-off script set the first ones on 2026-11-22: brand marks from Simple Icons, Lucide icons for projects with no brand, and the project's own image where it has one. Replace any of them in Studio. A flat shape on a transparent ground works best; a picture with two tones is split by lightness, and the smaller part becomes the mark.

### Mascot and icons

Decided on 2026-11-22. The mascot is Gri: a cartoon face of Griko with a tuft of black hair, thick glasses, smiling eyes and a blush, on the accent amber (`#eab308`). It is new vector work, drawn from what the owner's avatars share (glasses, a side-swept quiff, an amber ground), not traced from them. For a few hours on the same day the mascot was the Tinypfp drawing on amber; that drawing stays in the gallery as `portrait-tinypfp`.

- `packages/ui/src/gri.ts` is the one drawing. It holds every mood as separate parts. Its frame leaves space around the head: the head reaches 72% of the way from the centre to the edge of a circle cut from the square. So a round frame, a rounded square and a maskable icon all show the whole head. The first frame (93%) was too tight in a circle. `./scripts/make-icons.sh` writes `packages/ui/src/mascot.svg` (the smile, as a file) and the favicons for `web`, `archive` and Studio from it: a circle for browser tabs, the full square for home screens.
- `theme-head.astro` names the icons, so every page with the shared design has them. An archived version that names no icon of its own gets the same favicon, because it is the default file at the root.
- nbr.st has no icon files. Its Worker sends `/favicon.ico` and `/favicon.svg` to nibras.co.
- In Sanity the drawing is `portrait-gri`, and the profile's `icon` points at it: the home page, site headers and footers show it. An archived version without its own mascot shows it too.
- The resume shows a photo: the profile's `avatar` is the "Formal" portrait. `apps/web/public/resume.png`, the resume's social card, is a screenshot of `/resume/og` and was taken again with that photo.
- Gri has 16 moods: smile (the mascot), laugh, wink, cheeky, wow, love, starstruck, cool, think, side-eye, sleepy, shy, oops, sad, grumpy and dizzy. The sketches and the boards that led to them are local working files in `tmp/branding`.

#### Moods

Decided on 2026-11-22, from a board of 13 places. The owner chose six. On 2026-11-23 the owner chose five more from a board of 14: a reaction for each marked word, the look, the dizzy face, the sleep at night and the city time.

- While the profile's `icon` is the mascot document (`MASCOT_ID`), `apps/web` draws the mascot in the page with `@multiverse/ui/gri.astro`, and does not load the picture. A different icon shows as a picture, with no moods.
- A drawing holds only the moods its place needs: all 16 in the home hero, three in the header, one on `/404`.
- A mood has a resting pose (a turn of the head from -14 to 9 degrees) and one short move. The move plays once, when the mood starts. Nothing moves when a page opens, and nothing loops. The one exception is the look on the home page: it follows the pointer, as the wave does. `prefers-reduced-motion` keeps the change of mood and stops the moves.
- `showMood()` from `@multiverse/ui/gri-moods` changes the mood. A mood hides its parts, not its groups: Chromium does not start an animation again for a part inside a hidden group.

| Place           | What the mascot does                                                                                                                                                                                                                         |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home face       | It winks under the pointer. A click shows the next mood, in the order of `MOODS`, and that mood stays. Five quick clicks (less than 0.6 seconds apart) make it dizzy, then grumpy, and it ignores clicks for 4 seconds                       |
| Home links      | A link marked `data-gri` names a mood for the time the pointer or the focus is on it: think, wow and love for the marked words "useful", "fast" and "friendly" (stars for any other marked word), cool for Resume, laugh for Book a call     |
| Home look       | While the pointer is over the hero, the head and the eyes lean toward it (`--gri-look-x` and `--gri-look-y` in `gri.css`). This is for a mouse, like the lean of the wave. Reduced motion stops it, and a sleepy or dizzy face does not look |
| Home at night   | From midnight to 05:00 in the profile's `timeZone`, the face sleeps and the note beside it says "asleep now". A script in the page sets this before the first paint, so no move plays. A click wakes the face                                |
| Theme change    | Every drawing that holds the two moods: cool for 2 seconds in the dark theme, cheeky (a squint) for 1.2 seconds in the light theme                                                                                                           |
| Tab icon        | While the tab is in the background, the icon is `favicon-asleep`: the sleepy face on a grey ground. An icon is a file, so it has no move                                                                                                     |
| `/404`          | The dizzy face is the zero between the dotted fours                                                                                                                                                                                          |
| Browser console | A wink and the address of the repository (`REPOSITORY_URL`)                                                                                                                                                                                  |

### Home page order

Decided on 2026-11-22: Experience, Projects, Talks, then Latest posts.

### List rows and title links

Decided on 2026-11-22, after a look at every list on Home, Blog and Work. It replaces the rule that Blog and Work keep the date on the left.

- A dated row is `apps/web/src/components/entry-row.astro`: posts, talks, home experience, community roles and schools. The title and the summary are on the left. The date is on the right, in monospace. On narrow screens the date goes under the title.
- A row starts with the name that its link opens. Experience, community roles and schools start with the organization; the role or the degree comes second.
- A link in a sentence (the `quiet-link` utility, and every link in `.prose`) has a thin grey underline that turns amber and thicker on hover. The line always shows, because it is the only sign of a link. On 2026-11-23 the About page had 14 amber links in four paragraphs, which was too loud.
- A link that stands alone, such as "All posts" or "Older versions", keeps the amber underline all the time (the `link` utility).
- The title of a row or a card shows the underline on hover (the `title-link` utility): a post, a talk, a project, an organization or a school in a list, and the organization headings in Experience on Work. A Work heading also shows ↗ on hover. An underline on each title, and on the small links of each project card, was tried on 2026-11-22 and was too much.
- A row with a link opens it from any point in the row (the `row-link` utility): every dated row, and the project lists on Work. Under the pointer the row gets an amber tint and an arrow: → for a page on the site, ↗ for another site. Where the date is a column on the right, it moves left to make room for the arrow, so at rest it lines up with the column. On narrow screens the date is under the title and does not move; the row keeps room for the arrow. Without hover (phones), the arrow always shows. Decided on 2026-11-23; before that, only post rows did this.
- Buttons, cards that are one link, icons and the header navigation have their own shapes and take no underline.
- A range that starts and ends in the same year shows one year: `2019`, not `2019 – 2019`.
- The resume keeps its own styles, because it is also the printed document.

## Command bar

Decided on 2026-11-23, from a board with five choices. The owner chose a dialog in the centre, an icon in the header, the dither veil, the mascot in the field and the full depth.

- ⌘K, Ctrl K or `/` opens the bar, and so does the search button in the header. The bar is in the shared header, so nibras.co and the archive index have it. The older versions keep their original look and have no bar.
- `packages/ui/src/command-bar.astro` is the dialog: a native `<dialog>`, so the browser keeps the focus inside and Escape closes it. `command-bar.ts` loads the first time someone asks for the bar. A page carries about 1.5 KB for it (gzip); the script is 8 KB (Brotli) and most readers never load it.
- No library. `cmdk` needs React, and these sites send none.
- The bar reads two files from nibras.co. `/commands.json` (2 KB) has the title and the address of every page, post, role, project and talk, the older versions and the profile links. `/llms.json` (42 KB) has the text of every page; it loads at the second letter of a search.
- Titles are ranked in `command-index.ts`: the start of the title counts most, then the start of a word, then any place in the title, then a keyword. A group shows five rows at most. The text search is `searchDocuments()` from `@multiverse/content/site-index`, which the MCP server uses too, so both give the same results.
- With no search, the bar shows four suggestions (the latest post, "Book a call", "Copy the email address", the theme), then the pages, the actions and the links to other places. "Older versions", "Ask AI" and "Change theme" open a second list; Escape, Backspace or the label in the field goes back.
- "Change theme" has three choices: light, dark and system. The button in the header only switches between light and dark, so the bar is the way back to the system setting. The bar sends a `theme:set` event, and `theme-toggle.astro` does the change: one place for the circle and for the saved choice.
- A search with no result offers to ask Claude about the site.
- A row that opens an address is a link, so a click with ⌘ opens a new tab as on any link.
- The veil behind the bar is dither: two CSS gradients of dots in the page color, no canvas. The panel moves in with `translate` only.
- The mascot sits in the field where its site shows it. It thinks while the reader types, is sad when nothing matches, and winks when a row runs. A move plays once, as in every other place.
- On a screen narrower than 30rem the header has no room for two buttons. The search button stays, the theme button goes, and the bar has the theme as an action.
- Each role, project and talk on `/work` has its own address, such as `/work#project-graz` (`apps/web/src/lib/anchors.ts`). An entry that a link opened shows an amber frame for two seconds.
- nbr.st links are not in the bar: they live only in KV.
