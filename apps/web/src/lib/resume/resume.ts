import type { COVER_LETTERS_QUERY_RESULT, RESUME_QUERY_RESULT } from "@multiverse/sanity/types"
import type { createSanityClient } from "@multiverse/content/client"

import { COVER_LETTERS_QUERY, RESUME_QUERY } from "../queries"
import { addUsage } from "./usage"

/** The site's address, from `site` in astro.config (Sanity no longer stores it). */
const SITE_ORIGIN = (import.meta.env.SITE ?? "https://nibras.co").replace(/\/$/, "")

type SanityClient = ReturnType<typeof createSanityClient>

/*
 * Maps Sanity documents to the flat shapes that the page, the Markdown exports and the MCP
 * server share. Entries carry plain strings (summary, bullets, a formatted period), so every
 * output says the same thing in the same words.
 */

export interface Profile {
  name: string
  givenName: string
  familyName: string
  handle?: string
  headline: string
  summary: string
  location: string
  email: string
  website?: string
  countryCode?: string
  country?: string
  languages: string[]
  linkedin?: string
  github?: string
  x?: string
  /** Every social profile, for JSON-LD `sameAs`. */
  profiles: string[]
  avatar?: { url: string; alt: string }
}

export interface Site {
  description: string
  /** The site root, `https://nibras.co`. `/resume.pdf` and `/resume.md` live here. */
  origin: string
  /** The resume page, `https://nibras.co/resume`. */
  url: string
  ogImage?: string
}

export interface ExperienceEntry {
  id: string
  role: string
  organization: string
  url?: string
  location: string
  /** `2024 – 2025`, `Jun 2024 – Present`. */
  period: string
  startDate: string
  current: boolean
  technologies: string[]
  links: { label: string; url: string }[]
  bullets: string[]
}

export interface EducationEntry {
  id: string
  school: string
  url?: string
  degree: string
  field?: string
  period: string
  bullets: string[]
}

export interface SkillEntry {
  id: string
  name: string
  skills: string[]
}

export interface ProjectEntry {
  id: string
  name: string
  role: string
  url?: string
  status: string
  /** `status: discontinued` (archived stays listed): hidden from Markdown and MCP unless asked for. */
  discontinued: boolean
  technologies: string[]
  summary: string
  bullets: string[]
  /** VS Code extension ids; `usage` is filled from them when the resume is built. */
  vscode: string[]
  /** `4,900+ installs on the VS Code Marketplace. Most used: …` */
  usage?: string
}

/** Community roles (`involvement` documents). */
export interface InvolvementEntry {
  id: string
  organization: string
  role: string
  /** Start year; the documents have no end dates yet. */
  year: string
  url?: string
  summary: string
  bullets: string[]
}

export interface TalkEntry {
  id: string
  title: string
  url?: string
  event?: string
  /** ISO date, for sorting and JSON-LD. */
  isoDate: string
  date: string
  summary: string
}

export interface Resume {
  site: Site
  profile: Profile
  experience: ExperienceEntry[]
  education: EducationEntry[]
  skills: SkillEntry[]
  projects: ProjectEntry[]
  involvements: InvolvementEntry[]
  talks: TalkEntry[]
  /** Latest `_updatedAt` across the resume documents (ISO). */
  updatedAt?: string
}

export interface CoverLetter {
  slug: string
  title: string
  company: string
  jobPostUrl?: string
  /** Portable Text, rendered with the site's RichText component. */
  body: NonNullable<COVER_LETTERS_QUERY_RESULT[number]["body"]>
  updatedAt?: string
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/** `2024` → `2024`, `2024-06` / `2024-06-03` → `Jun 2024`. */
export function formatPartialDate(value: string | null | undefined): string {
  if (!value) return ""
  const [year, month] = value.split("-")
  const name = month ? MONTHS[Number(month) - 1] : undefined
  return name ? `${name} ${year}` : (year ?? value)
}

/** One date format everywhere: `2020 – 2023`, `Jun 2024 – Present`, or one value when equal. */
export function formatPeriod(start: string | null | undefined, end: string | null | undefined) {
  const from = formatPartialDate(start)
  const to = formatPartialDate(end) || "Present"
  if (!from) return to
  return from === to ? from : `${from} – ${to}`
}

/** `Nov 2026`, for "Updated" lines. */
export function formatMonth(iso: string | undefined): string {
  return iso ? formatPartialDate(iso.slice(0, 7)) : ""
}

/**
 * `https://www.linkedin.com/in/griko/` → `linkedin.com/in/griko`: link text that still works on
 * paper. Wayback Machine links show the original host: `dilo.id (archived)`.
 */
export function displayUrl(url: string): string {
  const archived = url.match(/^https?:\/\/web\.archive\.org\/web\/\d+\/(?:https?:\/\/?)?([^/]+)/i)
  if (archived?.[1]) return `${archived[1].replace(/^www\./i, "")} (archived)`
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "")
}

const clean = (items: readonly (string | null | undefined)[] | null | undefined) =>
  (items ?? []).map((item) => item?.trim() ?? "").filter(Boolean)

const STATUS_ORDER = ["active", "maintained", "archived", "discontinued"]
const statusRank = (status: string) => {
  const index = STATUS_ORDER.indexOf(status)
  return index < 0 ? STATUS_ORDER.length : index
}

function countryName(code: string | null | undefined) {
  if (!code) return undefined
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code)
  } catch {
    return code
  }
}

export function mapResume(raw: RESUME_QUERY_RESULT): Resume {
  const { profile: p } = raw
  if (!p?.name) throw new Error("Sanity `profile` has no name.")
  const origin = SITE_ORIGIN

  const social = (platform: string) =>
    p.socialLinks?.find((link) => link.platform === platform)?.url ?? undefined
  const [first = p.name, ...rest] = p.name.split(" ")
  const summary = p.summary?.trim() ?? ""
  const website = social("website") ?? origin

  const profile: Profile = {
    name: p.name,
    givenName: p.givenName ?? first,
    familyName: p.familyName ?? rest.at(-1) ?? "",
    handle: p.handle ?? undefined,
    headline: p.headline ?? "",
    summary,
    location: p.location ?? "",
    email: p.email ?? "",
    website,
    countryCode: p.countryCode ?? undefined,
    country: countryName(p.countryCode),
    languages: p.languages ?? [],
    linkedin: social("linkedin"),
    github: social("github"),
    x: social("x"),
    profiles: [
      ...new Set(
        [website, ...(p.socialLinks ?? []).map((link) => link.url)].filter((url): url is string =>
          Boolean(url),
        ),
      ),
    ],
    avatar: p.avatar?.url ? { url: p.avatar.url, alt: p.avatar.alt ?? p.name } : undefined,
  }

  const site: Site = {
    description: summary,
    origin,
    url: `${origin}/resume`,
  }

  const experience = raw.experience.map((entry): ExperienceEntry => ({
    id: entry._id,
    role: entry.role,
    organization: entry.organization.name,
    url: entry.organization.url ?? undefined,
    location: entry.location ?? "",
    period: formatPeriod(entry.startDate, entry.endDate),
    startDate: entry.startDate,
    current: !entry.endDate,
    technologies: entry.technologies ?? [],
    links: (entry.links ?? []).map((url) => ({ label: displayUrl(url), url })),
    bullets: clean(entry.highlights),
  }))

  const education = raw.education.map((entry): EducationEntry => ({
    id: entry._id,
    school: entry.organization.name,
    url: entry.organization.url ?? undefined,
    degree: entry.degree,
    field: entry.field ?? undefined,
    period: formatPeriod(entry.startDate, entry.endDate),
    bullets: clean(entry.highlights),
  }))

  const skills = raw.skills.map((entry): SkillEntry => ({
    id: entry._id,
    name: entry.name,
    skills: entry.skills,
  }))

  // Current work first: active, then maintained, then archived; Studio order within each.
  const projects = raw.projects.map((entry): ProjectEntry => ({
    id: entry._id,
    name: entry.name,
    role: entry.role ?? "",
    url: entry.url ?? entry.repoUrl ?? undefined,
    status: entry.status,
    discontinued: entry.status === "discontinued",
    technologies: entry.technologies ?? [],
    summary: entry.summary?.trim() ?? "",
    bullets: clean(entry.highlights),
    vscode: entry.vscode ?? [],
  }))
  projects.sort((a, b) => statusRank(a.status) - statusRank(b.status))

  const involvements = raw.involvements.map((entry): InvolvementEntry => ({
    id: entry._id,
    organization: entry.organization.name,
    role: entry.role,
    year: entry.startDate.slice(0, 4),
    url: entry.url ?? undefined,
    summary: entry.summary?.trim() ?? "",
    bullets: clean(entry.highlights),
  }))

  // Newest first, like every other section.
  const talks = raw.talks
    .map((entry): TalkEntry => ({
      id: entry._id,
      title: entry.title,
      url: entry.recordingUrl ?? entry.slidesUrl ?? undefined,
      event: entry.event ?? undefined,
      isoDate: entry.date,
      date: formatPartialDate(entry.date),
      summary: entry.summary?.trim() ?? "",
    }))
    .sort((a, b) => b.isoDate.localeCompare(a.isoDate))

  return {
    site,
    profile,
    experience,
    education,
    skills,
    projects,
    involvements,
    talks,
    updatedAt: raw.updatedAt ?? undefined,
  }
}

export async function fetchResume(client: SanityClient): Promise<Resume> {
  return addUsage(mapResume(await client.fetch(RESUME_QUERY)))
}

export function mapCoverLetters(raw: COVER_LETTERS_QUERY_RESULT): CoverLetter[] {
  return raw.flatMap((entry) =>
    entry.slug
      ? [
          {
            slug: entry.slug,
            title: entry.title,
            company: entry.company,
            jobPostUrl: entry.jobPostUrl ?? undefined,
            body: entry.body ?? [],
            updatedAt: entry._updatedAt,
          },
        ]
      : [],
  )
}

export async function fetchCoverLetters(client: SanityClient): Promise<CoverLetter[]> {
  return mapCoverLetters(await client.fetch(COVER_LETTERS_QUERY))
}

/** Unique skills across groups, for JSON-LD `knowsAbout`. */
export function allSkills(skills: SkillEntry[]): string[] {
  return [...new Set(skills.flatMap((group) => group.skills))]
}

/** Contact links shown on the page, PDF and Markdown, in one order. */
export function contactLinks(profile: Profile): { label: string; url: string }[] {
  return [
    profile.website && { label: "Website", url: profile.website },
    profile.linkedin && { label: "LinkedIn", url: profile.linkedin },
    profile.github && { label: "GitHub", url: profile.github },
    profile.x && { label: "X", url: profile.x },
  ].filter((link): link is { label: string; url: string } => Boolean(link))
}
