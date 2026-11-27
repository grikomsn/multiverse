# Edition data map

Mapped 2026-11-16 to plan the archive's switch to current data (see [../redesign.md](../redesign.md#archive-on-current-data)). All edition routes read one document through `getEdition(key)` (`apps/archive/src/lib/editions.ts`). Only the archive index reads the meta fields (`domain`, `stack`, `summary`, `sourceUrl`, `waybackUrl`, `screenshots`, `notes`).

## Edition field → current field

| Edition field                         | Current field                         | Notes                                                                                                                                              |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                                | `profile.name`                        |                                                                                                                                                    |
| `headline`                            | `profile.headline`                    | v7 uses it as a hero sentence                                                                                                                      |
| `description`                         | `profile.summary`, `site.description` |                                                                                                                                                    |
| `email`                               | `profile.email`                       |                                                                                                                                                    |
| `avatar`                              | `profile.avatar` → `portrait.image`   | v4b and v5 need a transparent PNG                                                                                                                  |
| `intro`                               | `home.intro`                          | Shape rules per edition, see below                                                                                                                 |
| `bio`                                 | `profile.bio`                         | v2, v3, v4b and v5 use `bio[0]` as the heading                                                                                                     |
| `links` (social)                      | `profile.socialLinks[]`               | Current links use `platform` (for example `x`); editions look links up by `label` ("Twitter")                                                      |
| `links` (nav, footer)                 | `site.navigation`                     |                                                                                                                                                    |
| `links` "Schedule"                    | `profile.scheduleUrl`                 |                                                                                                                                                    |
| `skills[]{title, items}`              | `skillGroup{name, skills}`            | 1:1                                                                                                                                                |
| `projects[]`                          | `project`                             | `title`→`name`, `subtitle`→`role`, `description`→`summary`, `tags`→`technologies`, `image`→`cover`, category "featured"→`featured`                 |
| `talks[]`                             | `talk`                                | `subtitle`→`event`, `description`→`summary`, `category`→`kind`, `url`→`url`                                                                        |
| `posts` refs and `extras` "post" rows | `post`                                | `subtitle`→`excerpt`, `date`→`publishedAt`, `image`→`cover`, redirect→`originalUrl`. No current field for tags, featured or reading time           |
| `pages[]`                             | `page` by slug                        | List-header pages (works, blog, appearances, articles) have no current equivalent and stay period copy                                             |
| No current equivalent                 | none                                  | v2 wordmark, specialty and plug; v3 404 gif; signatures; 2023c polaroid; 2023a textures; v5 now playing; 2022b author card; v8/v9 playground pages |

## Shape rules that break layouts

- **Intro and bio:**
  - v4b and v5 need exactly two intro blocks, with framework links colored by hostname (laravel.com, nodejs.org, reactjs.org only).
  - v8 splits the last intro block at "based on ".
  - v9 uses an h2 and the `!@…@!` lead syntax.
  - v2 uses `:emoji:` codes and flattens the intro to plain text.
- **Counts:**
  - v6 home shows up to 10 posts and 10 talks.
  - v9 home shows 4 of each.
  - v2 contact buttons expect exactly 2 Email links.
- **Images:**
  - v7 loads covers at 64 px and blurs them; v9 blurs the about cover.
  - v4, v4b, v5 and 2023a hide projects that have no image.
- **Talks:**
  - v4b needs Feather icon names in `category`.
  - In v6 and v7, the `kind` values panel, interview and livestream show the default icon.
- **Posts:**
  - 2022b, 2023a and 2023c use the first figure in a body as its cover.
  - `embed` blocks with only a `url` render nothing in 2022b, 2023c and 2024.

## Verdict

| Group                                   | Editions                   |
| --------------------------------------- | -------------------------- |
| Works with the adapter                  | 2024, 2023c, v6, v9        |
| Works with the adapter and small fixes  | v7, v8, 2022b              |
| Needs data the schema does not have yet | v2, v3, v4, v4b, v5, 2023a |

## Duplicated archive code

- PortableText wrapper: 8 copies.
- `assetUrl` and `assetSize`: 10 copies.
- `postEntries`: 7 copies.
- `pageOf`: 5 copies.
- `embed`: identical in v6–v9 and in 2022b and 2024.
- `link-mark`: identical in v8 and v9, and in 2023a and 2024.
- Near-copies: `figure`, `code-block`, `icon`, ordinal date format, `trimProtocol`.
- The time and seat-selector pages in v8 and v9.
