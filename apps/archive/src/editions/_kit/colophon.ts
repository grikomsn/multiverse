/**
 * How the archive is built and served today, for the "Made with …" and "Hosted on …" lines in
 * old footers. Each version is rebuilt in Astro with its own CSS framework and served from
 * Cloudflare, so those lines state that, not what the version ran on at the time.
 */
import { REPOSITORY_URL } from "@multiverse/sanity/constants"

export const COLOPHON = {
  framework: { name: "Astro", url: "https://astro.build" },
  host: { name: "Cloudflare", url: "https://workers.cloudflare.com" },
  /** The edition's own folder in the repository. */
  source: (key: string) => `${REPOSITORY_URL}/tree/main/apps/archive/src/editions/${key}`,
  repository: REPOSITORY_URL,
  /** First year of the personal site. */
  since: 2018,
}

/** "2018–2026": from the first version to the build year. */
export const copyright = () => `${COLOPHON.since}–${new Date().getFullYear()}`
