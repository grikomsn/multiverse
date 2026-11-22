import { extensions, type Extension } from "../metrics"
import type { Resume } from "./resume"

/*
 * Adds a usage line to projects that list VS Code extension ids in `metrics.vscode`, from the
 * same Marketplace numbers as the Work page (lib/metrics.ts). A failed request adds no line.
 */

/** `4949` → `4,900+`; small numbers stay exact. */
function roundDown(value: number): string {
  if (value < 100) return value.toLocaleString("en-US")
  const step = value < 1000 ? 10 : 100
  return `${(Math.floor(value / step) * step).toLocaleString("en-US")}+`
}

/** `Grok for GitHub Copilot Chat` → `Grok`; `Codex Bridge for Copilot Chat` → `Codex Bridge`. */
const shortName = (name: string) => name.replace(/\s+for\s+(GitHub\s+)?Copilot Chat$/i, "").trim()

export async function addUsage(resume: Resume): Promise<Resume> {
  const ids = resume.projects.flatMap((project) => project.vscode)
  const byId = await extensions(ids).catch(() => new Map<string, Extension>())
  if (byId.size === 0) return resume

  const projects = resume.projects.map((project) => {
    const own = project.vscode
      .map((id) => byId.get(id.toLowerCase()))
      .filter((extension): extension is Extension => Boolean(extension?.installs))
      .sort((a, b) => b.installs - a.installs)
    if (own.length === 0) return project

    const total = own.reduce((sum, extension) => sum + extension.installs, 0)
    const top = own
      .slice(0, 2)
      .map((extension) => `${shortName(extension.name)} (${roundDown(extension.installs)})`)
    const usage =
      own.length > 1
        ? `${roundDown(total)} installs on the VS Code Marketplace. Most used: ${top.join(" and ")}.`
        : `${roundDown(total)} installs on the VS Code Marketplace.`
    return { ...project, usage }
  })
  return { ...resume, projects }
}
