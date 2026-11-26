# Social cards

A social card is the picture and the text that a chat or a feed shows with a link (Open Graph). Every app has them, and they look like one site.

Decided on 2026-11-26, after research on what the apps that show cards do.

## What each app shows

| App                         | Text                                                | Picture                                                        |
| --------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| nibras.co                   | The page's title and description                    | A card drawn in the build for each page: `/og/<page>.png`      |
| nibras.co, with a cover     | The same                                            | The same card with the cover behind the text: `/og/<page>.jpg` |
| nibras.co, the resume       | The same                                            | A picture of its own: `/resume.png`                            |
| archive.nibras.co, index    | "Older versions"                                    | A card drawn in the build: `/og.png`                           |
| archive.nibras.co, versions | The version's name and years                        | The version's screenshot from its `edition` document           |
| grikomsn.github.io/grikomsn | `npx grikomsn`                                      | A dark card with the mascot in pixels: `og.png`                |
| nbr.st                      | None: it only redirects, so the target's card shows | None                                                           |
| Studio                      | None: it is a tool behind a login                   | None                                                           |

## The design

`@multiverse/ui/og` draws every card (`packages/ui/src/og.ts`): the site's name, one title, and the wave in dots.

| Part       | What it is                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Size       | 1200 × 630 pixels: the one size that every app accepts                                                                                |
| Name       | Top left, with a small Gri. A card with a large face shows the name alone                                                             |
| Label      | A short line over the title, in the accent color: a post's date, "Since 2018"                                                         |
| Title      | Bold, from 112 pixels down to 56. The card draws the title at each size and takes the largest that fits                               |
| Marks      | Words in [brackets] get a mark, as the home page's tagline                                                                            |
| Large face | On the right, for the home page and the pages that are not documents. Each page has its mood                                          |
| Wave       | The footer band of the site, in dots of 6 pixels. Its shape comes from the title, so cards differ                                     |
| Theme      | Light, as the site. The terminal card's page has the dark one                                                                         |
| Cover      | A post or a page with a cover shows it across the whole card. The text is on a paper label, and the cover is a little darker under it |

A card for a new page of nibras.co needs no work: a document gets one, and so does a page in `apps/web/src/lib/commands.ts`. Give a page a face in `FACES` (`apps/web/src/lib/og.ts`).

## The rules, and where they come from

| Rule                                                     | Why                                                                                                   |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 1200 × 630, PNG or JPEG                                  | LinkedIn asks for 1200 × 627 at least. Meta lists only JPEG, PNG and GIF                              |
| Less than 600 KB                                         | WhatsApp shows no picture above that. A card here is 10 to 25 KB                                      |
| A cover card's label is in the top left corner           | X puts the link's domain over the bottom left corner. The bottom of the card shows only the cover     |
| A title of 56 pixels or more, in three lines at most     | Slack shows a card about 360 pixels wide. Smaller text is decoration there                            |
| Nothing to read near the edges or at the bottom left     | Some apps cut the card to a square from its center. X puts the domain over the bottom left            |
| No description and no address in the picture             | The app prints the title, the description and the domain under the picture                            |
| `og:image:width`, `og:image:height` and `og:image:alt`   | With the size, an app shows the card on the first share. X reads the alt text                         |
| `twitter:card` is `summary_large_image`                  | X, Discord and Telegram show the large picture only with it. It has no Open Graph name                |
| `og:title` has no site name                              | Meta asks for that. The name is in `og:site_name`, which Slack and Discord show                       |
| A key at the end of the picture's address (`?v=…`)       | X keeps a picture for 7 days and Mastodon for about 14. A changed card has a new address              |
| A request for a part of a picture gets that part (206)   | Signal reads a picture in parts. Cloudflare's assets send the whole file, so the Workers cut the part |
| A post has `article:published_time`; a page has `author` | LinkedIn's inspector asks for the author and the date                                                 |
| `twitter:creator` and `fediverse:creator`                | They credit the author's account. They come from the profile's X and Mastodon links                   |

For Mastodon to show the author, add `nibras.co` in Mastodon: Preferences, Public profile, Verification, "Websites allowed to credit you".

## How a card is made

- Takumi (`takumi-js`) lays out the card and draws the text. It reads the site's font file as it is: one variable file, with the weights from 400 to 700.
- sharp draws the wave from the same formula as the site (`wave()` in `@multiverse/ui/dither`), and writes the PNG with a palette.
- A card with a cover holds a photo, so it is a JPEG of 30 to 150 KB. The build gets the cover from Sanity, cut to the card's size around its middle.
- The font is licensed and not in the repository. A build reads it from `assets/fonts/web`, as the pages do, so `bun run check` draws no card on a machine without it.
- The colors are the site's, as plain values: `@multiverse/ui/theme`, which the terminal card also uses.

Raise `OG_VERSION` in `og.ts` when the look of the cards changes. It is part of each key, so no app shows an old design.

## After a change

An app keeps a card for some time. To see a new one:

| App                | How                                                     |
| ------------------ | ------------------------------------------------------- |
| Facebook, Threads  | Sharing Debugger, "Scrape Again"                        |
| LinkedIn           | Post Inspector. Old posts keep their card               |
| X                  | No tool. The new key in the picture's address is enough |
| Slack, Discord     | They keep a card for about 30 minutes                   |
| Telegram           | Send the link to @WebpageBot                            |
| WhatsApp, iMessage | No tool. A message that was sent keeps its card         |
