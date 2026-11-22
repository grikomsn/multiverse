/** Labels for `project.kind`. */
export const KIND: Record<string, string> = {
  library: "Library",
  extension: "Editor extensions",
  app: "App",
  work: "Built at work",
}

/** Icons for `project.kind`, names from `@multiverse/ui/icon.astro`. */
export const KIND_ICON: Record<string, "package" | "puzzle" | "app-window" | "building"> = {
  library: "package",
  extension: "puzzle",
  app: "app-window",
  work: "building",
}

/** Status labels worth showing; active projects need none. */
export const STATUS: Record<string, string> = {
  maintained: "Maintained",
  archived: "Archived",
}

/** Sections of the Work page project list, after the featured cards. */
export const GROUPS = [
  { title: "Libraries and tools", kinds: ["library", "extension"] },
  { title: "Apps and small things", kinds: ["app"] },
  { title: "Built at work", kinds: ["work"] },
]

const STORES: Record<string, string> = {
  "marketplace.visualstudio.com": "VS Code Marketplace",
  "chromewebstore.google.com": "Chrome Web Store",
  "npmjs.com": "npm",
}

/** Link text for a project URL: a store name, or the bare hostname. */
export function linkLabel(url: string) {
  const host = new URL(url).hostname.replace(/^www\./, "")
  return STORES[host] ?? host
}
