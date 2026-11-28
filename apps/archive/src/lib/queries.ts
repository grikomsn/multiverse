import {
  BODY_ABSOLUTE,
  EXPERIENCE,
  ICON,
  IMAGE,
  PORTRAIT_IMAGE,
  PROFILE,
  PROJECT,
  SHORT_NAME,
  TALK,
} from "@multiverse/content/fragments"
import { defineQuery } from "groq"

export const EDITIONS_QUERY = defineQuery(`*[_type == "edition"] | order(startDate asc) {
  _id,
  title,
  "key": key.current,
  status,
  domain,
  startDate,
  endDate,
  stack,
  summary,
  sourceUrl,
  waybackUrl,
  "screenshot": screenshots[0] ${IMAGE}
}`)

/** What an edition's code needs besides today's content: its dates and design assets. */
export const EDITION_QUERY = defineQuery(`*[_type == "edition" && key.current == $key][0] {
  title,
  "key": key.current,
  status,
  domain,
  startDate,
  endDate,
  sourceUrl,
  assets[] { _key, name, url, "image": image ${IMAGE} }
}`)

/** Header and footer of the archive index (the editions themselves never read this). */
export const ARCHIVE_SHELL_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0] {
    name, ${SHORT_NAME}, email, scheduleUrl, socialLinks[] { platform, label, url, featured }
  },
  "avatar": ${ICON} { _id, "url": image.asset->url }
}`)

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
