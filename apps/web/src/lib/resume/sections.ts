/* No imports: the Worker uses this file too. */

/** Section names are part of the MCP tool API; keep them stable. */
export const RESUME_SECTIONS = [
  "summary",
  "contact",
  "experience",
  "education",
  "skills",
  "projects",
  "community",
  "talks",
] as const

export type ResumeSection = (typeof RESUME_SECTIONS)[number]
