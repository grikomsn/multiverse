/*
 * The address of one entry on /work. A role, a project and a talk each have an `id` on the
 * page, so a search result (the command bar, the MCP server) opens the entry and not only its
 * section. Projects and talks use their document `_id`: `/work#project-graz`.
 */

/** Readable ids for entries: `Wayfindr Engineering Manager` → `wayfindr-engineering-manager`. */
export const slug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/** A role has no slug of its own: `experience-wayfindr-engineering-manager`. */
export const roleAnchor = (organization: string | null | undefined, role: string | null) =>
  `experience-${slug(`${organization ?? ""} ${role ?? ""}`)}`
