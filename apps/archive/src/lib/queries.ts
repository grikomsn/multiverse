import { ICON, IMAGE, SHORT_NAME } from "@multiverse/content/fragments"
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
