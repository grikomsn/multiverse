import {
  contactLinks,
  formatMonth,
  type EducationEntry,
  type ExperienceEntry,
  type InvolvementEntry,
  type Profile,
  type ProjectEntry,
  type Resume,
  type SkillEntry,
  type TalkEntry,
} from "./resume"
import { RESUME_SECTIONS, type ResumeSection } from "./sections"

export { RESUME_SECTIONS, type ResumeSection }

/*
 * Markdown views of the resume: `/resume.md` (the whole resume, same text and order as the page
 * and PDF) and one document per section and entry for llms-full.txt and the MCP server.
 *
 * Entry layout, parsed by tools/generate-ats-backup.py:
 *   ### Title
 *   (blank) meta line, parts joined by " · "
 *   (blank) paragraphs, "- " bullets, "Technologies: …", "Links: …"
 */

/** Headings, the same on the page, in the PDF and in Markdown. */
export const SECTION_TITLES: Record<ResumeSection, string> = {
  summary: "Summary",
  contact: "Contact",
  experience: "Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  community: "Community",
  talks: "Talks",
}

const join = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(" · ")

const paragraphs = (...blocks: (string | false | null | undefined)[]) =>
  blocks.filter(Boolean).join("\n\n")

const bullets = (items: string[]) => items.map((item) => `- ${item}`).join("\n")

const degreeLine = (entry: EducationEntry) =>
  entry.field ? `${entry.degree} in ${entry.field}` : entry.degree

const activeProjects = (projects: ProjectEntry[], includeDiscontinued = false) =>
  includeDiscontinued ? projects : projects.filter((project) => !project.discontinued)

function contact(profile: Profile): string {
  return bullets(
    [
      profile.location && `Location: ${profile.location}`,
      profile.email && `Email: ${profile.email}`,
      ...contactLinks(profile).map((link) => `${link.label}: ${link.url}`),
    ].filter((line): line is string => Boolean(line)),
  )
}

export function experience(entries: ExperienceEntry[]): string {
  return entries
    .map((entry) =>
      paragraphs(
        `### ${entry.role} at ${entry.organization}`,
        join(entry.period, entry.location),
        entry.bullets.length > 0 && bullets(entry.bullets),
        entry.technologies.length > 0 && `Technologies: ${entry.technologies.join(", ")}`,
        entry.links.length > 0 && `Links: ${entry.links.map((link) => link.url).join(", ")}`,
      ),
    )
    .join("\n\n")
}

function projects(entries: ProjectEntry[]): string {
  return entries
    .map((entry) =>
      paragraphs(
        `### ${entry.name}${entry.discontinued ? " (discontinued)" : ""}`,
        join(entry.role, entry.url),
        entry.summary,
        entry.usage,
        entry.bullets.length > 0 && bullets(entry.bullets),
        entry.technologies.length > 0 && `Technologies: ${entry.technologies.join(", ")}`,
      ),
    )
    .join("\n\n")
}

export function skills(groups: SkillEntry[], languages: string[]): string {
  return bullets([
    ...groups.map((group) => `${group.name}: ${group.skills.join(", ")}`),
    ...(languages.length > 0 ? [`Spoken languages: ${languages.join(", ")}`] : []),
  ])
}

export function education(entries: EducationEntry[]): string {
  return entries
    .map((entry) =>
      paragraphs(
        `### ${degreeLine(entry)} · ${entry.school}`,
        entry.period,
        entry.bullets.length > 0 && bullets(entry.bullets),
      ),
    )
    .join("\n\n")
}

export function community(entries: InvolvementEntry[]): string {
  return entries
    .map((entry) =>
      paragraphs(
        `### ${entry.role} at ${entry.organization}`,
        join(entry.year, entry.url),
        entry.summary,
        entry.bullets.length > 0 && bullets(entry.bullets),
      ),
    )
    .join("\n\n")
}

function talks(entries: TalkEntry[]): string {
  return entries
    .map((entry) =>
      paragraphs(
        `### ${join(entry.title, entry.event)}`,
        join(entry.date, entry.url),
        entry.summary,
      ),
    )
    .join("\n\n")
}

export function sectionText(
  resume: Resume,
  section: ResumeSection,
  { includeDiscontinued = false } = {},
): string {
  const text = {
    summary: () => resume.profile.summary,
    contact: () => contact(resume.profile),
    experience: () => experience(resume.experience),
    education: () => education(resume.education),
    skills: () => skills(resume.skills, resume.profile.languages),
    projects: () => projects(activeProjects(resume.projects, includeDiscontinued)),
    community: () => community(resume.involvements),
    talks: () => talks(resume.talks),
  }[section]()
  return text.trim() || "No content available for this section."
}

/** Page order, which is also the PDF order. */
const DOCUMENT_ORDER: ResumeSection[] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "community",
  "talks",
]

/** The whole resume as Markdown: `/resume.md` and `/llms-full.txt`. */
export function resumeMarkdown(resume: Resume): string {
  const { profile, site } = resume
  const updated = formatMonth(resume.updatedAt)
  const sections = DOCUMENT_ORDER.map((section) => {
    const body = sectionText(resume, section)
    return body.startsWith("No content") ? "" : `## ${SECTION_TITLES[section]}\n\n${body}`
  })

  return `${paragraphs(
    `# ${profile.name}`,
    profile.headline,
    contact(profile),
    ...sections,
    "---",
    paragraphs(
      updated && `Updated ${updated}.`,
      bullets([
        `Web: ${site.url}`,
        `PDF: ${site.origin}/resume.pdf`,
        `Markdown: ${site.origin}/resume.md`,
      ]),
    ),
  )}\n`
}
