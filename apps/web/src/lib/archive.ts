/**
 * The archive of older versions. `bun run dev` serves it on :4322 next to this site, so its links
 * stay local in dev. Set `PUBLIC_ARCHIVE_URL` to point them somewhere else.
 */
export const ARCHIVE_ORIGIN = (
  import.meta.env.PUBLIC_ARCHIVE_URL ??
  (import.meta.env.DEV ? "http://localhost:4322" : "https://archive.nibras.co")
).replace(/\/$/, "")
