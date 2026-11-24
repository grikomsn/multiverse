import type { SanityClient } from "@sanity/client"
import { defineQuery } from "groq"

import {
  BODY_ABSOLUTE,
  EXPERIENCE,
  ICON,
  IMAGE,
  PORTRAIT_IMAGE,
  PROFILE,
  PROJECT,
  TALK,
} from "./fragments"

/**
 * Today's data in one read, for the archive: every older design shows it. Lists are in display
 * order. `avatar` is the mascot (the profile's icon); `portrait` is the resume photo.
 */
export const LIVE_SITE_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0] { ${PROFILE} },
  "avatar": ${ICON} ${PORTRAIT_IMAGE},
  "portrait": *[_id == "profile"][0].avatar-> ${PORTRAIT_IMAGE},
  "portraits": *[_type == "portrait"] | order(orderRank) {
    _id, title, kind, caption, credit, creditUrl, "image": @ ${PORTRAIT_IMAGE}
  },
  "experience": *[_type == "experience"] | order(orderRank) { ${EXPERIENCE} },
  "posts": *[_type == "post" && visibility == "listed"] | order(publishedAt desc) {
    _id, title, "slug": slug.current, publishedAt, excerpt, originalUrl, tags,
    "cover": cover ${IMAGE},
    ${BODY_ABSOLUTE}
  },
  "projects": *[_type == "project" && status != "discontinued"] | order(orderRank) {
    ${PROJECT}, "cover": cover ${IMAGE}
  },
  "talks": *[_type == "talk"] | order(date desc) { ${TALK}, "cover": cover ${IMAGE} },
  "skills": *[_type == "skillGroup"] | order(orderRank) { _id, name, skills },
  "pages": *[_type == "page" && visibility == "listed"] {
    _id, title, "slug": slug.current, updatedAt, ${BODY_ABSOLUTE}
  }
}`)

export type LiveSite = Awaited<ReturnType<typeof fetchLiveSite>>

const fetchLiveSite = (client: SanityClient) => client.fetch(LIVE_SITE_QUERY)

const cache = new WeakMap<SanityClient, ReturnType<typeof fetchLiveSite>>()

/** One read per build, shared by every page that asks. */
export function getLiveSite(client: SanityClient) {
  let site = cache.get(client)
  if (!site) {
    site = fetchLiveSite(client)
    cache.set(client, site)
  }
  return site
}
