import { formatDate } from "@multiverse/content/format"
import { FALLBACK_GIVEN_NAME } from "@multiverse/sanity/constants"
import type { Mood } from "@multiverse/ui/face"
import type { Who } from "@multiverse/ui/family"
import { OG_SIZE, ogFormat, ogKey, ogType, type OgCard } from "@multiverse/ui/og"

import { STATIC_PAGES } from "./commands"
import { HOME_QUERY, ROUTES_QUERY, SITE_SHELL_QUERY } from "./queries"
import { sanity } from "./sanity"
import { homeTagline, siteTitle } from "./site"

/*
 * The social cards of nibras.co: the picture that a chat or a feed shows with a link.
 * `pages/og/[...path].png.ts` draws one for each page here, and `layouts/base.astro` names it
 * in the page's head. The design is `@multiverse/ui/og`; the rules are in
 * `docs/social-cards.md`.
 *
 * A post or a page with a cover shows it on its card, behind the text. The resume keeps a
 * picture of its own.
 */

/** The face on the card of a page that is not a document, and its mood. */
const FACES: Record<string, { who?: Who; mood: Mood }> = {
  "/blog": { mood: "think" },
  "/work": { mood: "cool" },
  "/media": { mood: "starstruck" },
  "/ai": { mood: "wow" },
  "/gri": { who: "gri", mood: "wink" },
  "/nia": { who: "nia", mood: "smile" },
  "/ash": { who: "ash", mood: "smile" },
}

let cards: Promise<Map<string, OgCard>> | undefined
/** What each cover shows, in words, by the path of its page. */
const covers = new Map<string, string>()

/** The card of every page, by its path: "/", "/blog", "/a-post". */
export function getOgCards() {
  return (cards ??= (async () => {
    const [shell, home, routes] = await Promise.all([
      sanity.fetch(SITE_SHELL_QUERY),
      sanity.fetch(HOME_QUERY),
      sanity.fetch(ROUTES_QUERY),
    ])
    const name = siteTitle(shell.profile)
    const given = shell.profile?.givenName ?? FALLBACK_GIVEN_NAME
    const map = new Map<string, OgCard>()

    // The home page's own words: its headline, and the line with the marked words.
    map.set("/", {
      name,
      title: `Hey there, I’m ${given}.\n${homeTagline(home.site)}`,
      face: { mood: "smile" },
    })
    for (const page of STATIC_PAGES) {
      if (page.path !== "/") map.set(page.path, { name, title: page.title, face: FACES[page.path] })
    }
    for (const route of routes) {
      if (!route.slug || !route.title) continue
      map.set(`/${route.slug}`, {
        name,
        // A post shows its date, as the page does. A page has no line over its title.
        label: route._type === "post" ? formatDate(route.publishedAt) || undefined : undefined,
        title: route.title,
        // Sanity cuts the cover to the card's size, around the middle of the picture.
        cover: route.image
          ? `${route.image}?w=${OG_SIZE.width}&h=${OG_SIZE.height}&fit=crop&fm=jpg&q=90`
          : undefined,
      })
      if (route.image && route.imageAlt) covers.set(`/${route.slug}`, route.imageAlt)
    }
    return map
  })())
}

/** "/blog/" and "/blog" are the same page. */
const pathOf = (pathname: string) => pathname.replace(/\/+$/, "") || "/"

/** The path of a page's card under `/og`: "/og/index.png", "/og/blog.png", "/og/a-post.jpg". */
export const ogFile = (path: string, card: OgCard) =>
  `/og${path === "/" ? "/index" : path}.${ogFormat(card)}`

/** The card as text, for a reader who cannot see it. */
const altOf = (card: OgCard) =>
  [card.label, card.title.replace(/[[\]]/g, "").replace(/\n/g, " "), card.name]
    .filter(Boolean)
    .map((part) => part!.replace(/\.$/, ""))
    .join(". ")

/**
 * The card of the page at `pathname`, for its head. A page with no card of its own, such as
 * the 404 page, shows the home page's. The address ends in a short key that changes with the
 * card, so an app that keeps pictures for days takes the new one.
 */
export async function ogOf(pathname: string, origin: string) {
  const all = await getOgCards()
  const path = all.has(pathOf(pathname)) ? pathOf(pathname) : "/"
  const card = all.get(path)!
  return {
    url: `${origin}${ogFile(path, card)}?v=${ogKey(card)}`,
    // A card with a cover also says what the cover shows.
    alt: [altOf(card), covers.get(path)?.replace(/\.$/, "")].filter(Boolean).join(". "),
    type: ogType(card),
    ...OG_SIZE,
  }
}
