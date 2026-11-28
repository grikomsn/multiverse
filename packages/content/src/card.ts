import { FALLBACK_GIVEN_NAME, FALLBACK_NAME, platformLabel } from "@multiverse/sanity/constants"
import type { CARD_QUERY_RESULT } from "@multiverse/sanity/types"
import type { SanityClient } from "@sanity/client"
import { defineQuery } from "groq"

import { groupByOrganization } from "./format"
import { ORGANIZATION, PROFILE, PROJECT, TALK } from "./fragments"

/*
 * The card: the facts that `npx grikomsn` shows (`apps/cli`), as one small JSON file.
 * nibras.co serves it at /card.json, and the CLI holds a copy from its own build. It has facts
 * only. The CLI has the sentences, as each older version of the site has its own.
 */

/** Where a running CLI reads today's card. */
export const CARD_URL = "https://nibras.co/card.json"

/**
 * The shape that published CLIs read. A CLI ignores a card with a different number, so raise
 * it only when a field changes its meaning. A new optional field needs no new number.
 */
export const CARD_VERSION = 1

export interface Card {
  version: typeof CARD_VERSION
  /** The address of the site, with no slash at the end: `https://nibras.co`. */
  website: string
  /** The short name: "Griko Nibras". */
  name: string
  givenName: string
  headline?: string
  location?: string
  /** An IANA time zone, such as "Asia/Jakarta": where the owner lives now. */
  timeZone?: string
  /** The home page's line. Words in [brackets] get a mark. */
  tagline?: string
  email?: string
  scheduleUrl?: string
  /** Outside profiles, in the profile's order. */
  profiles: { platform: string; label: string; url: string; featured: boolean }[]
  /** One entry for each organization, newest first, as on the home page. */
  experience: {
    organization: string
    url?: string
    roles: string[]
    start?: string
    end?: string
  }[]
  /** Featured projects, as the home page lists them. */
  projects: {
    name: string
    /** What it is, in one short line. */
    tagline?: string
    summary?: string
    /** One of `PROJECT_STATUSES`: "beta", "active". */
    status?: string
    url?: string
    technologies: string[]
  }[]
  /** The latest posts. */
  posts: { title: string; url: string; date?: string; summary?: string }[]
  talks: { title: string; event?: string; date?: string; url?: string }[]
  /** How many older versions the archive has. */
  versions: number
}

export const CARD_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0] { ${PROFILE}, timeZone },
  "site": *[_id == "site"][0] { tagline },
  "experience": *[_type == "experience"] | order(orderRank) {
    role, startDate, endDate, ${ORGANIZATION}
  },
  "projects": *[_type == "project" && featured == true && status != "discontinued"] | order(orderRank) {
    ${PROJECT}
  },
  "posts": *[_type == "post" && visibility == "listed"] | order(publishedAt desc) [0...5] {
    title, "slug": slug.current, publishedAt, excerpt
  },
  "talks": *[_type == "talk"] | order(date desc) [0...4] { ${TALK} },
  "versions": count(*[_type == "edition"])
}`)

/** Today's card. `website` is the origin that post links start with. */
export async function getCard(client: SanityClient, website = "https://nibras.co"): Promise<Card> {
  const { profile, site, experience, projects, posts, talks, versions } =
    await client.fetch<CARD_QUERY_RESULT>(CARD_QUERY)
  const origin = website.replace(/\/$/, "")
  return {
    version: CARD_VERSION,
    website: origin,
    name:
      [profile?.givenName, profile?.familyName].filter(Boolean).join(" ") ||
      profile?.name ||
      FALLBACK_NAME,
    givenName: profile?.givenName ?? FALLBACK_GIVEN_NAME,
    headline: profile?.headline ?? undefined,
    location: profile?.location ?? undefined,
    timeZone: profile?.timeZone ?? undefined,
    tagline: site?.tagline ?? undefined,
    email: profile?.email ?? undefined,
    scheduleUrl: profile?.scheduleUrl ?? undefined,
    profiles: (profile?.socialLinks ?? []).flatMap((link) =>
      link.url
        ? [
            {
              platform: link.platform ?? "other",
              label: platformLabel(link.platform, link.label),
              url: link.url,
              featured: link.featured === true,
            },
          ]
        : [],
    ),
    experience: groupByOrganization(experience).flatMap((stop) =>
      stop.organization?.name
        ? [
            {
              organization: stop.organization.name,
              url: stop.organization.url ?? undefined,
              roles: stop.roles.flatMap((job) => (job.role ? [job.role] : [])),
              start: stop.startDate ?? undefined,
              end: stop.endDate ?? undefined,
            },
          ]
        : [],
    ),
    projects: projects.flatMap((project) =>
      project.name
        ? [
            {
              name: project.name,
              tagline: project.tagline ?? undefined,
              summary: project.summary ?? undefined,
              status: project.status ?? undefined,
              url: project.url ?? project.repoUrl ?? undefined,
              technologies: project.technologies ?? [],
            },
          ]
        : [],
    ),
    posts: posts.flatMap((post) =>
      post.title && post.slug
        ? [
            {
              title: post.title,
              url: `${origin}/${post.slug}`,
              date: post.publishedAt ?? undefined,
              summary: post.excerpt ?? undefined,
            },
          ]
        : [],
    ),
    talks: talks.flatMap((talk) =>
      talk.title
        ? [
            {
              title: talk.title,
              event: talk.event ?? undefined,
              date: talk.date ?? undefined,
              url: talk.url ?? undefined,
            },
          ]
        : [],
    ),
    versions,
  }
}

/** Whether `value` is a card that this code can read: JSON from the network is not trusted. */
export function isCard(value: unknown): value is Card {
  if (typeof value !== "object" || value === null) return false
  const card = value as Partial<Record<keyof Card, unknown>>
  const lists = [card.profiles, card.experience, card.projects, card.posts, card.talks]
  return (
    card.version === CARD_VERSION &&
    typeof card.website === "string" &&
    typeof card.name === "string" &&
    typeof card.givenName === "string" &&
    lists.every(Array.isArray)
  )
}
