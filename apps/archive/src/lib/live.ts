/**
 * Today's content for older designs. `toEdition` builds the `Edition` shape that every edition
 * reads, from today's documents (`LIVE_SITE_QUERY`), so edition code stays as it was. Each
 * edition's `live.ts` holds what belongs to the design: its interface copy (page headings, nav
 * labels), how it names and groups things, and its intro in its own sentence pattern. No fact
 * comes from the period: names, roles, links, projects and pages are all current.
 */
import type { LiveSite } from "@multiverse/content/live"
import { groupByOrganization } from "@multiverse/content/format"
import type { EDITION_QUERY_RESULT, PartialDate, RichText } from "@multiverse/sanity/types"

import { FALLBACK_NAME, platformLabel } from "@multiverse/sanity/constants"

export type Block = RichText[number]
type TextBlock = Extract<Block, { _type: "block" }>

export interface Image {
  alt: string | null
  url: string | null
  width: number | null
  height: number | null
  lqip: string | null
}

export interface Link {
  _key: string
  label: string
  url: string
  description: string | null
  group: string | null
  /** `socialLink.platform` for profiles; null for navigation and other links. */
  platform: string | null
  /** A featured profile: the ones headers and footers show. */
  featured: boolean
}

export interface Entry {
  _key: string
  title: string
  subtitle: string | null
  description: string | null
  category: string | null
  date: PartialDate | null
  url: string | null
  tags: string[] | null
  image: Image | null
  ref?: string | null
  body?: RichText | null
  /** Repository, for designs that link code and site separately. */
  repoUrl?: string | null
}

export interface Page {
  _key: string
  title: string
  slug: string
  description: string | null
  body: RichText | null
  updatedAt: string | null
}

export type Post = Omit<LiveSite["posts"][number], "cover" | "tags" | "body"> & {
  body: RichText | null
}

type Meta = NonNullable<EDITION_QUERY_RESULT>

export interface Edition extends Omit<Meta, "assets"> {
  name: string
  headline: string | null
  description: string | null
  email: string | null
  avatar: Image | null
  intro: RichText | null
  bio: RichText | null
  links: Link[] | null
  skills: { _key: string; title: string; items: string[] | null }[] | null
  projects: Entry[] | null
  talks: Entry[] | null
  posts: Post[] | null
  pages: Page[] | null
  /** Post rows for designs that list posts as entries, and the design assets by name. */
  extras: Entry[] | null
  /** Today's portraits, for designs with a photo or a media page. */
  portraits: LiveSite["portraits"]
}

/** A page of the edition: its heading in the version's words, its body from today's data. */
export interface PageCopy {
  /** Path within the edition, e.g. "about" or "playground/time". */
  slug: string
  /** The version's heading; a function where the heading states a fact (a role, a city). */
  title: string | ((facts: Facts) => string)
  description?: string
  /** Current page whose body the page shows. */
  from?: string
  /** Body built from current facts, for pages that have no current page (contact, schedule). */
  body?: (facts: Facts, live: LiveSite) => Block[]
}

export interface LiveSettings {
  /** Every page the design has, with its heading copy. */
  pages?: PageCopy[]
  /** Links the design shows that are not profiles (navigation, footer), in its own words. */
  links?: (
    facts: Facts,
    live: LiveSite,
  ) => Omit<Link, "_key" | "description" | "platform" | "featured">[]
  /** Profile group heading, for designs that sort profiles under headings. */
  group?: (platform: string, featured: boolean) => string | null
  /** Show only the featured profiles. Default: all of them. */
  featuredOnly?: boolean
  /** How the edition labels a platform. Default: the profile's label. */
  labels?: Record<string, string>
  /** For designs that show a project only with an image: drop projects without one. */
  requireProjectImages?: boolean
  /** The URL the edition used for a post, for example `/blog/<slug>`. */
  postUrl?: (slug: string) => string
  /** The edition's intro, in its own sentence pattern, with current facts. */
  intro?: (facts: Facts, live: LiveSite) => Block[]
  /** Default: the profile headline. */
  headline?: (facts: Facts, live: LiveSite) => string | null | undefined
  /** Default: `profile.summary`. */
  description?: (facts: Facts, live: LiveSite) => string | null | undefined
  /** Default: the text of the current about page, without its figures. */
  bio?: (facts: Facts, live: LiveSite) => Block[] | null
  /** Last step, for edition-specific rows (role cards, article pages, post metadata). */
  transform?: (edition: Edition, live: LiveSite, facts: Facts) => Edition
  /** Category for a current project. Default: "featured" for featured projects. */
  projectCategory?: (project: LiveSite["projects"][number], index: number) => string | null
  /** How many projects count as featured when none is marked. Default 4. */
  featured?: number
  /** Category for a talk kind (the edition's icon names). */
  talkCategory?: (kind: string | null) => string | null
}

/** Current facts that intros are written from. */
export interface Facts {
  name: string
  fullName: string
  role: string | null
  organization: { name: string; url: string | null } | null
  previous: { name: string; url: string | null }[]
  email: string | null
  scheduleUrl: string | null
  location: string | null
  headline: string | null
  /** The headline already names the current employer ("… leading engineering at Wayfindr"). */
  headlineNamesEmployer: boolean
  /** Up to three tools for "I make … things": the current role's first three. */
  stack: { name: string; url: string | null }[]
}

/** Homepages for stack words, so older designs can color them by hostname as they did. */
const STACK_URLS: Record<string, string> = {
  "Vue.js": "https://vuejs.org",
  Vue: "https://vuejs.org",
  TypeScript: "https://typescriptlang.org",
  "Nest.js": "https://nestjs.com",
  NestJS: "https://nestjs.com",
  React: "https://react.dev",
  "Next.js": "https://nextjs.org",
  Tauri: "https://tauri.app",
  Electron: "https://electronjs.org",
  "Node.js": "https://nodejs.org",
  Deno: "https://deno.com",
  GraphQL: "https://graphql.org",
}

export function facts(live: LiveSite): Facts {
  const stops = groupByOrganization(live.experience)
  const org = (stop?: (typeof stops)[number]) =>
    stop?.organization?.name
      ? { name: stop.organization.name, url: stop.organization.url ?? null }
      : null
  const previous = stops
    .slice(1)
    .map(org)
    .filter((item): item is NonNullable<typeof item> => !!item)
  const name =
    [live.profile?.givenName, live.profile?.familyName].filter(Boolean).join(" ") || FALLBACK_NAME
  return {
    name,
    fullName: live.profile?.name ?? name,
    role: stops[0]?.roles[0]?.role ?? null,
    organization: org(stops[0]),
    previous: previous.filter(
      (item, index) => previous.findIndex((o) => o.name === item.name) === index,
    ),
    email: live.profile?.email ?? null,
    scheduleUrl: live.profile?.scheduleUrl ?? null,
    location: live.profile?.location ?? null,
    headline: live.profile?.headline ?? null,
    headlineNamesEmployer: Boolean(
      stops[0]?.organization?.name && live.profile?.headline?.includes(stops[0].organization.name),
    ),
    stack: (live.experience[0]?.technologies ?? [])
      .slice(0, 3)
      .map((name) => ({ name, url: STACK_URLS[name] ?? null })),
  }
}

// Portable Text builders for intros and generated pages --------------------------------------

export type Part = string | { text: string; href?: string | null; bold?: boolean }

let counter = 0
const key = () => `live${(counter++).toString(36)}`

/** One block from text parts; parts with `href` become links. */
export function block(
  parts: Part[],
  style: TextBlock["style"] = "normal",
  listItem?: TextBlock["listItem"],
): Block {
  const markDefs: { _key: string; _type: "link"; href: string }[] = []
  const children = parts.map((part) => {
    if (typeof part === "string")
      return { _key: key(), _type: "span" as const, text: part, marks: [] }
    const marks: string[] = part.bold ? ["strong"] : []
    if (part.href) {
      const mark = key()
      markDefs.push({ _key: mark, _type: "link", href: part.href })
      marks.push(mark)
    }
    return { _key: key(), _type: "span" as const, text: part.text, marks }
  })
  return {
    _key: key(),
    _type: "block",
    style,
    children,
    markDefs,
    ...(listItem ? { listItem, level: 1 } : {}),
  } as unknown as Block
}

/** "A, B and C" as parts, each linked when it has a URL. */
export function list(items: { name: string; url: string | null }[], and = "and"): Part[] {
  return items.flatMap((item, index) => [
    item.url ? { text: item.name, href: item.url } : item.name,
    index < items.length - 2 ? ", " : index === items.length - 2 ? ` ${and} ` : "",
  ])
}

export const link = (item: { name: string; url: string | null } | null): Part =>
  item ? (item.url ? { text: item.name, href: item.url } : item.name) : ""

export const article = (word?: string | null) => (/^[aeiou]/i.test(word ?? "") ? "an" : "a")

export const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

export const email = (f: Facts): Part => ({ text: f.email ?? "", href: `mailto:${f.email}` })

/** Every profile as a "Label - URL" bullet, the way contact pages listed them. */
export const profileBullets = (live: LiveSite): Block[] =>
  profiles(live).map((social) =>
    block([`${social.label} - `, { text: social.url, href: social.url }], "normal", "bullet"),
  )

/** Profiles to show, in profile order. Email lives in its own field. */
export function profiles(live: LiveSite, featuredOnly = false) {
  return (live.profile?.socialLinks ?? [])
    .filter((social) => social.url && social.platform !== "email")
    .filter((social) => !featuredOnly || social.featured)
    .map((social) => ({
      key: social._key,
      platform: social.platform ?? "other",
      label: platformLabel(social.platform, social.label),
      url: social.url!,
      featured: !!social.featured,
    }))
}

// The adapter ---------------------------------------------------------------------------------

export function toEdition(meta: Meta, live: LiveSite, settings: LiveSettings): Edition {
  const f = facts(live)

  const socials: Link[] = profiles(live, settings.featuredOnly).map((social) => ({
    _key: `live-${social.key}`,
    label: settings.labels?.[social.platform] ?? social.label,
    url: social.url,
    description: null,
    group: settings.group?.(social.platform, social.featured) ?? null,
    platform: social.platform,
    featured: social.featured,
  }))
  const links: Link[] = [
    ...socials,
    ...(settings.links?.(f, live) ?? []).map((item, index) => ({
      ...item,
      _key: `link-${index}`,
      description: null,
      platform: null,
      featured: false,
    })),
  ]

  const postUrl = settings.postUrl ?? ((slug: string) => `/blog/${slug}`)
  const posts: Post[] = live.posts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    publishedAt: post.publishedAt,
    excerpt: post.excerpt,
    body: post.body as RichText,
    originalUrl: post.originalUrl,
  }))
  const postRows: Entry[] = live.posts.map((post) => ({
    _key: `live-${post._id}`,
    title: post.title,
    subtitle: post.excerpt,
    description: null,
    category: "post",
    date: post.publishedAt?.slice(0, 10) ?? null,
    url: post.originalUrl ?? postUrl(post.slug ?? ""),
    tags: post.tags ?? [],
    image: post.cover,
    ref: post._id,
  }))
  const assets: Entry[] = (meta.assets ?? []).map((asset) => ({
    _key: asset._key,
    title: asset.name,
    subtitle: null,
    description: null,
    category: asset.name,
    date: null,
    url: asset.url,
    tags: null,
    image: asset.image,
  }))

  const featured = settings.featured ?? 4
  const anyFeatured = live.projects.some((project) => project.featured)
  const projects: Entry[] = live.projects.map((project, index) => ({
    _key: `live-${project._id}`,
    title: project.name,
    subtitle: project.role ?? project.technologies?.join(", ") ?? null,
    description: project.summary,
    category: settings.projectCategory
      ? settings.projectCategory(project, index)
      : (anyFeatured ? project.featured : index < featured)
        ? "featured"
        : null,
    date: project.startDate,
    url: project.url ?? project.repoUrl,
    repoUrl: project.repoUrl,
    tags: project.technologies,
    image: project.cover,
    body: null,
    ref: project._id,
  }))
  const talks: Entry[] = live.talks.map((talk) => ({
    _key: `live-${talk._id}`,
    title: talk.title,
    subtitle: talk.event,
    description: talk.summary,
    category: settings.talkCategory ? settings.talkCategory(talk.kind) : talk.kind,
    date: talk.date,
    url: talk.recordingUrl ?? talk.slidesUrl,
    tags: null,
    image: talk.cover,
  }))

  const current = (slug?: string) => (slug ? live.pages.find((page) => page.slug === slug) : null)
  const pages: Page[] = (settings.pages ?? []).map((copy) => {
    const page = current(copy.from)
    if (copy.from && !page) throw new Error(`${meta.key}: no current page "${copy.from}"`)
    return {
      _key: `page-${copy.slug}`,
      title: typeof copy.title === "function" ? copy.title(f) : copy.title,
      slug: copy.slug,
      description: copy.description ?? null,
      body: (copy.body?.(f, live) ?? page?.body ?? null) as RichText | null,
      updatedAt: page?.updatedAt ?? null,
    }
  })
  const about = current("about")

  const edition: Edition = {
    title: meta.title,
    key: meta.key,
    status: meta.status,
    domain: meta.domain,
    startDate: meta.startDate,
    endDate: meta.endDate,
    sourceUrl: meta.sourceUrl,
    name: f.name,
    headline: settings.headline ? (settings.headline(f, live) ?? null) : f.headline,
    description: settings.description
      ? (settings.description(f, live) ?? null)
      : (live.profile?.summary ?? null),
    email: f.email,
    // A design drawn around a mascot (v3's anime girl, the animojis) keeps it.
    avatar:
      meta.assets?.find((asset) => asset.name === "mascot")?.image ?? live.avatar ?? live.portrait,
    intro: (settings.intro?.(f, live) ?? null) as RichText | null,
    bio: (settings.bio
      ? settings.bio(f, live)
      : textOf(about?.body as Block[] | undefined)) as RichText | null,
    links,
    skills: live.skills.map((group) => ({
      _key: group._id,
      title: group.name,
      items: group.skills,
    })),
    projects: settings.requireProjectImages
      ? projects.filter((project) => project.image?.url)
      : projects,
    talks,
    posts,
    pages,
    extras: [...assets, ...postRows],
    portraits: live.portraits,
  }
  return settings.transform ? settings.transform(edition, live, f) : edition
}

/** Text blocks only: designs that show a bio as paragraphs have no room for figures. */
export const textOf = (body?: Block[] | null) =>
  body ? body.filter((item) => item._type === "block") : null

/** The text paragraphs of today's about page, for designs with room for only a few. */
export const aboutText = (live: LiveSite) =>
  textOf(live.pages.find((page) => page.slug === "about")?.body as Block[] | undefined) ?? []

/** A design asset by the name the edition looks it up by. */
export const assetOf = (edition: Edition, name: string) =>
  edition.extras?.find((entry) => entry.category === name)
