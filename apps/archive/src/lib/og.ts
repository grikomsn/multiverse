import { FALLBACK_NAME } from "@multiverse/sanity/constants"
import { OG_SIZE, ogKey, type OgCard } from "@multiverse/ui/og"

import { COLOPHON } from "../editions/_kit/colophon"
import { period } from "./editions"
import { ARCHIVE_SHELL_QUERY, EDITIONS_QUERY } from "./queries"
import { sanity } from "./sanity"

/*
 * The social cards of the archive: the picture that a chat or a feed shows with a link.
 *
 * The index has the site's card (`@multiverse/ui/og`), which `pages/og.png.ts` draws. A
 * version shows itself: its screenshot from the `edition` document, the same picture as on
 * the index. The rules are in `docs/social-cards.md`.
 */

let data: Promise<{ name: string; editions: Awaited<ReturnType<typeof editions>> }> | undefined
const editions = () => sanity.fetch(EDITIONS_QUERY)

/** One fetch for each build, shared by every page. */
const load = () =>
  (data ??= Promise.all([editions(), sanity.fetch(ARCHIVE_SHELL_QUERY)]).then(
    ([list, { profile }]) => ({ name: profile?.shortName ?? FALLBACK_NAME, editions: list }),
  ))

/** The card of the index. */
export async function indexCard(): Promise<OgCard> {
  const { name } = await load()
  return {
    name,
    label: `Since ${COLOPHON.since}`,
    title: "Older versions",
    face: { mood: "side-eye" },
  }
}

export interface SocialCard {
  title: string
  description: string
  image: string
  type: string
  width: number
  height: number
  alt: string
  name: string
}

/** The index's card, for its head. The key in the address changes with the card. */
export async function indexSocial(origin: string): Promise<SocialCard> {
  const card = await indexCard()
  return {
    title: card.title,
    description: `Every earlier version of ${card.name}'s personal site since ${COLOPHON.since}, rebuilt where possible.`,
    image: `${origin}/og.png?v=${ogKey(card)}`,
    type: "image/png",
    ...OG_SIZE,
    alt: `${card.label}. ${card.title}. ${card.name}`,
    name: card.name,
  }
}

/**
 * The card of every page of a version: the version's name and years, and its screenshot cut
 * to the size of a card. A version with no screenshot shows the index's card.
 */
export async function editionSocial(key: string, origin: string): Promise<SocialCard> {
  const { name, editions } = await load()
  const edition = editions.find((item) => item.key === key)
  const index = await indexSocial(origin)
  if (!edition) return index
  const years = period(edition.startDate, edition.endDate)
  const title = [edition.title ?? key, years].filter(Boolean).join(", ")
  const text = {
    title,
    description: `An older version of ${name}'s personal site, in its original design. It shows today's content.`,
    name,
  }
  const shot = edition.screenshot?.url
  if (!shot) return { ...index, ...text }
  return {
    ...text,
    // JPEG, because every app that shows cards reads it. The top of the page is the part to show.
    image: `${shot}?w=${OG_SIZE.width}&h=${OG_SIZE.height}&fit=crop&crop=top&fm=jpg&q=82`,
    type: "image/jpeg",
    ...OG_SIZE,
    alt: edition.screenshot?.alt ?? `The home page of ${title}`,
  }
}
