/**
 * The main site. `bun run dev` serves it on :4321 next to the archive, so links to nibras.co stay
 * local in dev. Set `PUBLIC_WEB_URL` to point them somewhere else.
 */
export const WEB_ORIGIN = (
  import.meta.env.PUBLIC_WEB_URL ??
  (import.meta.env.DEV ? "http://localhost:4321" : "https://nibras.co")
).replace(/\/$/, "")

/** `https://nibras.co/resume` → the same path on `WEB_ORIGIN`. Other URLs stay as they are. */
export const web = (url: string) => url.replace(/^https:\/\/nibras\.co(?=\/|$)/, WEB_ORIGIN)

/** Every nibras.co link inside a value (a Portable Text body) moved onto `WEB_ORIGIN`. */
export function webLinks<T>(value: T): T {
  if (WEB_ORIGIN === "https://nibras.co" || value == null) return value
  return JSON.parse(JSON.stringify(value).replace(/https:\/\/nibras\.co(?=[/"])/g, WEB_ORIGIN)) as T
}
