/**
 * GROQ projections that more than one query uses. Plain string constants, so Sanity typegen can
 * follow them into every app's queries.
 */

/** An image field with its URL, size and blur placeholder. */
export const IMAGE = `{ alt, "url": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "lqip": asset->metadata.lqip }`

/** Links to a post or page store a reference; resolve it to the page's address on this site. */
export const MARK_DEFS = `markDefs[] { ..., _type == "link" && defined(internal) => { "href": "/" + internal->slug.current } }`

/**
 * The same, for sites on another host (the archive): links point at nibras.co. That includes a
 * path such as "/resume", which on the archive would stay inside the edition.
 */
export const MARK_DEFS_ABSOLUTE = `markDefs[] { ..., _type == "link" && string::startsWith(href, "/") => { "href": "https://nibras.co" + href }, _type == "link" && defined(internal) => { "href": "https://nibras.co/" + internal->slug.current } }`

/** Figure images expanded and `profileLinks` filled from Profile, for any body projection. */
const BODY_NODES = `_type == "figure" => { ..., "image": ${IMAGE} }, _type == "profileLinks" => { "email": *[_id == "profile"][0].email, "links": *[_id == "profile"][0].socialLinks[defined(url)] { platform, label, url, featured } }`

/** Portable Text ready for rendering on nibras.co: internal links are site paths. */
export const BODY = `body[] { ..., ${BODY_NODES}, ${MARK_DEFS} }`

/** The same for the archive: internal links point at nibras.co, where posts and pages live. */
export const BODY_ABSOLUTE = `body[] { ..., ${BODY_NODES}, ${MARK_DEFS_ABSOLUTE} }`

/** Where a role was done: its work mode in words. */
export const WORK_LOCATION = `"location": select(workMode == "remote" => "Remote", workMode == "hybrid" => "Hybrid", workMode == "onsite" => "On-site")`

/** The organization a career entry points at. */
export const ORGANIZATION = `"organization": organization-> { name, url }`

/** Who, what and where from Profile, with the profile links. Each query adds what only it needs. */
export const PROFILE = `name, givenName, familyName, headline, location, summary, email, scheduleUrl, socialLinks[] { _key, platform, label, url, featured }`

/** A portrait document as an image: the same shape as `IMAGE` gives a figure. */
export const PORTRAIT_IMAGE = `{ alt, "url": image.asset->url, "width": image.asset->metadata.dimensions.width, "height": image.asset->metadata.dimensions.height, "lqip": image.asset->metadata.lqip }`

/** One role, for the home page, Work and the resume. */
export const EXPERIENCE = `_id, role, startDate, endDate, ${WORK_LOCATION}, technologies, highlights, ${ORGANIZATION}`

/** One community role. The link is its own URL, else the organization's. */
export const INVOLVEMENT = `_id, role, startDate, endDate, summary, highlights, "url": coalesce(url, organization->url), ${ORGANIZATION}`

export const EDUCATION = `_id, degree, field, startDate, endDate, highlights, ${ORGANIZATION}`

export const TALK = `_id, title, kind, event, date, summary, url`

/** The small avatar from the profile. */
export const ICON = `*[_id == "profile"][0].icon->`

/**
 * A project's source link and usage sources, from its `repositories` and `packages` lists: the
 * main repository's page, and the GitHub, npm and VS Code ids that usage numbers add up.
 */
export const PROJECT_SOURCES = `"repoUrl": select(count(repositories) > 0 => "https://github.com/" + repositories[0]), "metrics": { "github": repositories, "npm": packages[registry == "npm"].name, "vscode": packages[registry == "vscode"].name }`

/** One project as the cards and lists show it. */
export const PROJECT = `_id, name, "slug": slug.current, role, status, kind, featured, url, summary, technologies, startDate, ${PROJECT_SOURCES}`
