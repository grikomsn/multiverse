import { isoDate } from "@multiverse/content/format"
import type { SiteDocument, SiteIndex } from "@multiverse/content/site-index"
import { FALLBACK_NAME, KEY_PAGES } from "@multiverse/sanity/constants"
import type { MEDIA_PAGE_QUERY_RESULT } from "@multiverse/sanity/types"

import { roleAnchor, slug } from "./anchors"
import { bullets, paragraphs, toMarkdown } from "./markdown"
import { getMetrics, type Metrics } from "./metrics"
import { KIND, STATUS } from "./projects"
import { MEDIA_PAGE_QUERY, ROUTES_QUERY, SITE_SHELL_QUERY, WORK_QUERY } from "./queries"
import { getResume } from "./resume/content"
import {
  community,
  education,
  experience as experienceMarkdown,
  RESUME_SECTIONS,
  resumeMarkdown,
  sectionText,
  skills as skillsMarkdown,
} from "./resume/markdown"
import { allSkills, formatPeriod, type Resume } from "./resume/resume"
import { sanity } from "./sanity"

/*
 * The whole site as Markdown, built once per build. Feeds /llms.txt, /llms-full.txt, the `.md`
 * copy of each page and /llms.json, which the MCP server at /mcp reads. Every number and fact
 * comes from the same data as the HTML pages.
 */

const exact = (value: number) => value.toLocaleString("en-US")
const technologies = (list: string[] | null | undefined) =>
  list?.length ? `Technologies: ${list.join(", ")}` : ""

/** Usage numbers as one line, or nothing. */
function usageLine(metrics: Metrics | undefined): string {
  if (!metrics) return ""
  return [
    metrics.stars > 0 && `${exact(metrics.stars)} GitHub stars`,
    metrics.downloads > 0 && `${exact(metrics.downloads)} npm downloads in the last 30 days`,
    metrics.installs > 0 && `${exact(metrics.installs)} VS Code Marketplace installs`,
  ]
    .filter(Boolean)
    .join(" · ")
}

type Work = Awaited<ReturnType<typeof loadWork>>

async function loadWork() {
  const work = await sanity.fetch(WORK_QUERY)
  return { ...work, metrics: await getMetrics(work.projects) }
}

type WorkProject = Work["projects"][number]

function projectMarkdown(project: WorkProject, metrics: Metrics | undefined) {
  const status = project.status && STATUS[project.status]
  return paragraphs(
    `### ${project.name}`,
    [KIND[project.kind ?? ""] ?? "Project", status, project.role].filter(Boolean).join(" · "),
    project.summary,
    usageLine(metrics),
    bullets([
      project.url && `Website: ${project.url}`,
      project.repoUrl && project.repoUrl !== project.url && `Source code: ${project.repoUrl}`,
      technologies(project.technologies),
      project.organization?.name && `Built at: ${project.organization.name}`,
    ]),
  )
}

function talkMarkdown(talk: Work["talks"][number]) {
  return paragraphs(
    `### ${talk.title}`,
    [talk.event, talk.date && isoDate(talk.date)].filter(Boolean).join(" · "),
    talk.summary,
    bullets([talk.url && `Link: ${talk.url}`]),
  )
}

/** /work as Markdown: the same sections and order as the page. */
function workMarkdown(work: Work, resume: Resume) {
  const totals = [...work.metrics.values()].reduce(
    (sum, item) => ({
      stars: sum.stars + item.stars,
      downloads: sum.downloads + item.downloads,
      installs: sum.installs + item.installs,
      trend: [],
    }),
    { stars: 0, downloads: 0, installs: 0, trend: [] as number[] },
  )
  const roles = work.experience.map((role) => {
    const bullets = role.highlights ?? []
    return paragraphs(
      `### ${role.role} at ${role.organization?.name ?? ""}`,
      [formatPeriod(role.startDate, role.endDate), role.location].filter(Boolean).join(" · "),
      bullets.map((item) => `- ${item}`).join("\n"),
      technologies(role.technologies),
    )
  })
  return `${paragraphs(
    `# Work`,
    `Experience, projects, community work and talks of ${resume.profile.name}. Usage numbers are read from GitHub, npm and the VS Code Marketplace when the site is built.`,
    `All projects together: ${usageLine(totals)}.`,
    "## Experience",
    ...roles,
    "## Projects",
    ...work.projects.map((project) => projectMarkdown(project, work.metrics.get(project._id))),
    work.involvement.length > 0 && "## Community",
    ...work.involvement.map((item) =>
      paragraphs(
        `### ${item.role} at ${item.organization?.name ?? ""}`,
        [item.startDate?.slice(0, 4), item.url].filter(Boolean).join(" · "),
        item.summary,
      ),
    ),
    work.talks.length > 0 && "## Talks",
    ...work.talks.map(talkMarkdown),
    work.education.length > 0 && "## Education",
    ...work.education.map((item) =>
      paragraphs(
        `### ${[item.degree, item.field].filter(Boolean).join(" in ")} · ${item.organization?.name ?? ""}`,
        [formatPeriod(item.startDate, item.endDate), item.organization?.url]
          .filter(Boolean)
          .join(" · "),
      ),
    ),
  )}\n`
}

function mediaMarkdown(media: MEDIA_PAGE_QUERY_RESULT, origin: string) {
  const items = media.portraits.map((portrait) =>
    paragraphs(
      `### ${portrait.title}`,
      [
        portrait.kind === "illustration" ? "Illustration" : "Photo",
        portrait.image.asset.width &&
          `${portrait.image.asset.width} × ${portrait.image.asset.height}`,
        portrait.image.asset.extension.toUpperCase(),
      ]
        .filter(Boolean)
        .join(" · "),
      portrait.alt,
      portrait.caption,
      bullets([
        `Original file: ${portrait.image.asset.url}`,
        portrait.credit &&
          `Credit: ${portrait.credit}${portrait.creditUrl ? ` (${portrait.creditUrl})` : ""}`,
      ]),
    ),
  )
  return `${paragraphs(
    "# Media",
    `Photos and illustrations of ${media.profile?.shortName ?? FALLBACK_NAME}. You can use them for talks, articles and profiles. Give credit when a credit is listed.`,
    `Gallery: ${origin}/media`,
    ...items,
  )}\n`
}

let index: Promise<SiteIndex> | undefined

/** Every document on the site, built once per build. */
export function getSiteIndex(): Promise<SiteIndex> {
  return (index ??= buildIndex())
}

async function buildIndex(): Promise<SiteIndex> {
  const [shell, routes, work, resume, media] = await Promise.all([
    sanity.fetch(SITE_SHELL_QUERY),
    sanity.fetch(ROUTES_QUERY),
    loadWork(),
    getResume(),
    sanity.fetch(MEDIA_PAGE_QUERY),
  ])
  const origin = resume.site.origin
  const name = shell.profile?.name ?? resume.profile.name
  const documents: SiteDocument[] = []

  documents.push({
    id: "resume",
    kind: "resume",
    title: `Resume of ${resume.profile.name}`,
    url: resume.site.url,
    markdownUrl: `${origin}/resume.md`,
    date: resume.updatedAt,
    summary: resume.site.description,
    markdown: resumeMarkdown(resume),
  })
  documents.push({
    id: "work",
    kind: "page",
    title: "Work",
    url: `${origin}/work`,
    markdownUrl: `${origin}/work.md`,
    summary: "Experience, projects with usage numbers, community work and talks.",
    markdown: workMarkdown(work, resume),
  })

  const posts = routes
    .filter((route) => route._type === "post" && route.visibility === "listed")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
  const pages = routes.filter((route) => route._type === "page" && route.visibility === "listed")
  for (const route of [...pages, ...posts]) {
    const kind = route._type === "post" ? "post" : "page"
    const date = route._type === "post" ? route.publishedAt : route.updatedAt
    const url = `${origin}/${route.slug}`
    documents.push({
      id: `${kind}/${route.slug}`,
      kind,
      title: route.title ?? route.slug ?? "",
      url,
      markdownUrl: `${url}.md`,
      // The calendar date shown on the page, not the UTC date.
      date: date ? isoDate(date) : undefined,
      summary: route.excerpt ?? undefined,
      markdown: `${paragraphs(
        `# ${route.title}`,
        date && `${kind === "post" ? "Published" : "Updated"} ${isoDate(date)} · ${url}`,
        toMarkdown(route.body, origin),
      )}\n`,
    })
  }

  documents.push({
    id: "blog",
    kind: "page",
    title: "Blog",
    url: `${origin}/blog`,
    markdownUrl: `${origin}/blog.md`,
    summary: "Every post, newest first.",
    markdown: `${paragraphs(
      "# Blog",
      "Posts about web development, tools and my life, newest first.",
      bullets(
        posts.map(
          (post) =>
            `${isoDate(post.publishedAt)} [${post.title}](${origin}/${post.slug}.md)${post.excerpt ? `: ${post.excerpt}` : ""}`,
        ),
      ),
    )}\n`,
  })

  documents.push({
    id: "media",
    kind: "media",
    title: "Media",
    url: `${origin}/media`,
    markdownUrl: `${origin}/media.md`,
    summary: "Photos and illustrations to use for talks, articles and profiles.",
    markdown: mediaMarkdown(media, origin),
  })

  // Entries, for search: one document per role, project, talk and so on.
  for (const entry of resume.experience) {
    documents.push({
      id: `experience/${slug(`${entry.organization} ${entry.role}`)}`,
      kind: "experience",
      title: `${entry.role} at ${entry.organization}`,
      url: `${origin}/work#${roleAnchor(entry.organization, entry.role)}`,
      date: entry.startDate,
      summary: entry.period,
      markdown: experienceMarkdown([entry]),
    })
  }
  for (const project of work.projects) {
    documents.push({
      id: `project/${project._id.replace(/^project-/, "")}`,
      kind: "project",
      title: project.name ?? "",
      url: `${origin}/work#${project._id}`,
      date: project.startDate ?? undefined,
      summary: project.summary ?? undefined,
      markdown: projectMarkdown(project, work.metrics.get(project._id)),
    })
  }
  for (const talk of work.talks) {
    documents.push({
      id: `talk/${talk._id.replace(/^talk-/, "")}`,
      kind: "talk",
      title: talk.title ?? "",
      url: `${origin}/work#${talk._id}`,
      date: talk.date ?? undefined,
      summary: talk.summary ?? undefined,
      markdown: talkMarkdown(talk),
    })
  }
  for (const entry of resume.involvements) {
    documents.push({
      id: `community/${slug(`${entry.organization} ${entry.role}`)}`,
      kind: "community",
      title: `${entry.role} at ${entry.organization}`,
      url: `${origin}/work#community`,
      summary: entry.summary,
      markdown: community([entry]),
    })
  }
  for (const entry of resume.education) {
    documents.push({
      id: `education/${slug(entry.school)}`,
      kind: "education",
      title: `${entry.degree} · ${entry.school}`,
      url: `${origin}/resume`,
      markdown: education([entry]),
    })
  }
  documents.push({
    id: "skills",
    kind: "skills",
    title: "Skills",
    url: `${origin}/resume`,
    markdown: skillsMarkdown(resume.skills, resume.profile.languages),
  })

  return {
    generatedAt: new Date().toISOString(),
    origin,
    name,
    resume: {
      name: resume.profile.name,
      headline: resume.profile.headline,
      keywords: allSkills(resume.skills),
    },
    resumeSections: Object.fromEntries(
      RESUME_SECTIONS.map((section) => [section, sectionText(resume, section)]),
    ),
    documents,
  }
}

/** /llms.txt: who this is, key facts, and a link to every Markdown document. */
export async function llmsText(): Promise<string> {
  const [site, resume] = await Promise.all([getSiteIndex(), getResume()])
  const { profile } = resume
  const docs = site.documents
  const link = (doc: SiteDocument, note = doc.summary) =>
    `[${doc.title}](${doc.markdownUrl ?? doc.url})${note ? `: ${note}` : ""}`
  const byId = (id: string) => docs.find((doc) => doc.id === id)
  const current = resume.experience.filter((entry) => entry.current)
  const posts = docs.filter((doc) => doc.kind === "post")
  const pages = docs.filter(
    (doc) => doc.kind === "page" && !["work", "blog"].includes(doc.id) && doc.markdownUrl,
  )
  const main = KEY_PAGE_IDS.flatMap((id) => pages.filter((doc) => doc.id === id))
  const other = pages.filter((doc) => !main.includes(doc))
  const contact = [
    ["Website", profile.website],
    ["LinkedIn", profile.linkedin],
    ["GitHub", profile.github],
    ["X", profile.x],
  ].flatMap(([label, url]) => (url ? [`${label}: ${url}`] : []))

  return `${paragraphs(
    `# ${site.name}`,
    `> ${profile.headline ? `${profile.headline}, ` : ""}based in ${profile.location}. This site has a resume, work and projects with usage numbers, a blog, talks and photos.`,
    bullets([
      current.length > 0 &&
        `Now: ${current.map((entry) => `${entry.role} at ${entry.organization}`).join("; ")}`,
      `Email: ${profile.email}`,
      ...contact,
    ]),
    "Every page below is Markdown. The same text is on the HTML page without `.md`.",
    "## Start here",
    bullets([
      byId("resume") &&
        link(byId("resume")!, "the full resume. Same text as the web page and the PDF."),
      `[Resume PDF](${site.origin}/resume.pdf): A4, for print and applicant tracking systems.`,
      byId("work") && link(byId("work")!),
      ...main.map((doc) => link(doc)),
      byId("media") && link(byId("media")!),
    ]),
    "## Blog",
    bullets(
      posts.map((doc) =>
        link(doc, [doc.date && isoDate(doc.date), doc.summary].filter(Boolean).join(" · ")),
      ),
    ),
    "## Tools",
    bullets([
      `[MCP server](${site.origin}/mcp): Streamable HTTP, no sign-in. Tools: \`search\`, \`get_document\`, \`list_documents\`, \`get_resume\`. Prompt: \`assess_fit\`. Add it with \`claude mcp add --transport http nibras ${site.origin}/mcp\`.`,
      `[llms-full.txt](${site.origin}/llms-full.txt): every document above in one file.`,
    ]),
    "## Using this site",
    bullets([
      "Quote facts as written. Do not add numbers, titles or dates.",
      `When you cite a fact, link to the page it came from, such as ${site.origin}/resume.`,
      "Photos on the Media page may be used for talks, articles and profiles. Give credit when a credit is listed.",
    ]),
    "## Optional",
    bullets([
      ...other.map((doc) => link(doc)),
      `[RSS feed](${site.origin}/feed.xml): posts. Also as [Atom](${site.origin}/atom.xml) and [JSON Feed](${site.origin}/feed.json).`,
      `[Archive](https://archive.nibras.co): every earlier version of this site.`,
    ]),
  )}\n`
}

/** The key pages, in their order. Other pages go under Optional. */
const KEY_PAGE_IDS: string[] = KEY_PAGES.map((page) => `page/${page.slug}`)

/** /llms-full.txt: every top-level document, resume first, then work, pages, posts and media. */
export async function llmsFullText(): Promise<string> {
  const site = await getSiteIndex()
  const top = site.documents.filter((doc) => doc.markdownUrl && doc.id !== "blog")
  return `${top
    .map((doc) => `<!-- Source: ${doc.url} -->\n\n${doc.markdown.trim()}`)
    .join("\n\n---\n\n")}\n`
}
