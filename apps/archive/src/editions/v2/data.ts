import type { Edition } from "../../lib/editions"

export const projectsOf = (edition: Edition, category: string) =>
  (edition.projects ?? []).filter((project) => project.category === category)

export const extrasOf = (edition: Edition, category: string) =>
  (edition.extras ?? []).filter((entry) => entry.category === category)

export const linksOf = (edition: Edition, ...groups: string[]) =>
  (edition.links ?? []).filter((link) => groups.includes(link.group ?? ""))

/** Card footer links the way the 2018 cards labeled them: the host, and owner/repo. */
export const projectLinks = (project: NonNullable<Edition["projects"]>[number]) =>
  [
    project.url && project.url !== project.repoUrl
      ? { label: new URL(project.url).hostname.replace(/^www\./, ""), url: project.url }
      : null,
    project.repoUrl
      ? { label: new URL(project.repoUrl).pathname.slice(1), url: project.repoUrl }
      : null,
  ].filter((item) => !!item)
