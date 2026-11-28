import { hostname } from "@multiverse/content/format"
import { PROJECT_KINDS, PROJECT_STATUSES } from "@multiverse/sanity/constants"

/** The name of a `project.kind`. */
export const kindTitle = (kind?: string | null) =>
  PROJECT_KINDS.find(({ value }) => value === kind)?.title ?? "Project"

/** Icons for `project.kind`, names from `@multiverse/ui/icon.astro`. */
export const KIND_ICON: Record<string, "package" | "puzzle" | "app-window" | "building"> = {
  library: "package",
  extension: "puzzle",
  app: "app-window",
  work: "building",
}

/** The statuses that the Work page and llms.txt name. Active projects need none. */
const NAMED_STATUSES = new Set<string>(["maintained", "archived"])

/** The name of a status worth showing, or nothing. */
export const statusTitle = (status?: string | null) =>
  status && NAMED_STATUSES.has(status)
    ? PROJECT_STATUSES.find(({ value }) => value === status)?.title
    : undefined

/** Sections of the Work page project list, after the featured cards. */
export const GROUPS = [
  { title: "Libraries and tools", kinds: ["library", "extension"] },
  { title: "Apps and things", kinds: ["app"] },
  { title: "Built at work", kinds: ["work"] },
]

const STORES: Record<string, string> = {
  "marketplace.visualstudio.com": "VS Code Marketplace",
  "chromewebstore.google.com": "Chrome Web Store",
  "npmjs.com": "npm",
}

/** Link text for a project URL: a store name, or the bare hostname. */
export function linkLabel(url: string) {
  const host = hostname(url)
  return STORES[host] ?? host
}
