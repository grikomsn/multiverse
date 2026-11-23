import {
  BODY,
  EDUCATION,
  EXPERIENCE,
  ICON,
  INVOLVEMENT,
  MARK_DEFS,
  PROFILE,
  PROJECT,
  TALK,
} from "@multiverse/content/fragments"
import { defineQuery } from "groq"

/** A project's mark: project cards draw its shape in dots (`project-mark.astro`). */
const PROJECT_ICON = `"icon": icon.asset-> { url, extension, "width": metadata.dimensions.width, "height": metadata.dimensions.height }`

export const SITE_SHELL_QUERY = defineQuery(`{
  "site": *[_id == "site"][0] { description },
  "profile": *[_id == "profile"][0] { ${PROFILE} },
  "avatar": ${ICON} { _id, alt, "url": image.asset->url },
  "versions": count(*[_type == "edition"])
}`)

/** Older versions for the command bar, newest first. The archive index has the details. */
export const VERSIONS_QUERY = defineQuery(`*[_type == "edition"] | order(startDate desc) {
  title, "key": key.current, startDate
}`)

export const HOME_QUERY = defineQuery(`{
  "site": *[_id == "site"][0] { tagline, "intro": intro[] { ..., ${MARK_DEFS} } },
  "timeZone": *[_id == "profile"][0].timeZone,
  "experience": *[_type == "experience"] | order(orderRank) { ${EXPERIENCE} },
  "posts": *[_type == "post" && visibility == "listed"] | order(publishedAt desc) [0...5] {
    _id, title, "slug": slug.current, publishedAt, excerpt
  },
  "projects": *[_type == "project" && featured == true && status != "discontinued"] | order(orderRank) [0...4] {
    ${PROJECT}, ${PROJECT_ICON}
  },
  "talks": *[_type == "talk"] | order(date desc) [0...4] { ${TALK} }
}`)

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && visibility == "listed"] | order(publishedAt desc) {
  _id, title, "slug": slug.current, publishedAt, excerpt
}`)

/** Every post and page; both live at /<slug> as they did on Bear Blog. */
export const ROUTES_QUERY = defineQuery(`*[_type in ["post", "page"] && defined(slug.current)] {
  _id,
  _type,
  title,
  "slug": slug.current,
  publishedAt,
  updatedAt,
  excerpt,
  visibility,
  lang,
  originalUrl,
  "image": cover.asset->url,
  "imageAlt": cover.alt,
  ${BODY}
}`)

export const FEED_QUERY =
  defineQuery(`*[_type == "post" && visibility == "listed"] | order(publishedAt desc) {
  title, "slug": slug.current, publishedAt, _updatedAt, excerpt, "image": cover.asset->url
}`)

/**
 * What `_redirects` is built from: the earlier addresses that posts and pages list, and the
 * calendar that /schedule opens.
 */
export const REDIRECTS_QUERY = defineQuery(`{
  "aliases": *[_type in ["post", "page"] && defined(slug.current) && count(aliases) > 0] {
    "slug": slug.current, aliases
  },
  "scheduleUrl": *[_id == "profile"][0].scheduleUrl
}`)

export const WORK_QUERY = defineQuery(`{
  "experience": *[_type == "experience"] | order(orderRank) { ${EXPERIENCE} },
  "projects": *[_type == "project" && status != "discontinued"] | order(orderRank) {
    ${PROJECT}, ${PROJECT_ICON}, "organization": organization-> { name, url }
  },
  "involvement": *[_type == "involvement"] | order(orderRank) { ${INVOLVEMENT} },
  "talks": *[_type == "talk"] | order(date desc) { ${TALK} },
  "education": *[_type == "education"] | order(orderRank) { ${EDUCATION} }
}`)

/** Portraits for /media, in Studio drag order. */
export const MEDIA_PAGE_QUERY = defineQuery(`{
  "profile": *[_id == "profile"][0]{ name, "shortName": coalesce(givenName + " " + familyName, name), headline },
  "portraits": *[_type == "portrait" && defined(image.asset)] | order(orderRank asc){
    _id,
    title,
    alt,
    caption,
    kind,
    credit,
    creditUrl,
    "image": image{
      crop,
      hotspot,
      asset->{
        _id,
        url,
        extension,
        "width": metadata.dimensions.width,
        "height": metadata.dimensions.height,
        "lqip": metadata.lqip,
        "opaque": metadata.isOpaque
      }
    }
  }
}`)

/** Everything the resume renders, in Studio drag order (`orderRank`). */
export const RESUME_QUERY = defineQuery(`{
  "updatedAt": *[
    _id == "profile" ||
    (_type in ["experience", "education", "skillGroup", "project", "involvement", "talk"] && onResume != false)
  ] | order(_updatedAt desc)[0]._updatedAt,
  "profile": *[_id == "profile"][0]{
    ${PROFILE},
    handle,
    countryCode,
    languages,
    "avatar": avatar->{ alt, "url": image.asset->url }
  },
  "experience": *[_type == "experience" && onResume != false] | order(orderRank) {
    ${EXPERIENCE}, links
  },
  "education": *[_type == "education" && onResume != false] | order(orderRank) { ${EDUCATION} },
  "skills": *[_type == "skillGroup" && onResume != false] | order(orderRank) {
    _id,
    name,
    skills
  },
  "projects": *[_type == "project" && onResume != false] | order(orderRank) {
    _id,
    name,
    role,
    status,
    url,
    "repoUrl": select(count(repositories) > 0 => "https://github.com/" + repositories[0]),
    technologies,
    summary,
    highlights,
    "vscode": packages[registry == "vscode"].name
  },
  "involvements": *[_type == "involvement" && onResume != false] | order(orderRank) {
    ${INVOLVEMENT}
  },
  "talks": *[_type == "talk" && onResume != false] | order(date desc) { ${TALK} }
}`)

/** Unlisted letters served at /cover-letters/<slug>. */
export const COVER_LETTERS_QUERY =
  defineQuery(`*[_type == "coverLetter" && defined(slug.current)] | order(_createdAt asc) {
  _id,
  _updatedAt,
  title,
  "slug": slug.current,
  "company": organization->name,
  jobPostUrl,
  ${BODY}
}`)

/** Posts and pages set to "Unlisted": noindex, and kept out of the sitemap. */
export const UNLISTED_SLUGS_QUERY = defineQuery(
  `*[_type in ["post", "page"] && visibility == "unlisted"].slug.current`,
)
