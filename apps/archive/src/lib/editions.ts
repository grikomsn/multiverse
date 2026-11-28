import { type Edition, type LiveSettings, toEdition } from "./live"
import { EDITION_QUERY, LIVE_SITE_QUERY } from "./queries"
import { webLinks } from "./web"
import { sanity } from "./sanity"

export type { Edition }

const SETTINGS = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ live: LiveSettings }>("../editions/*/live.ts", { eager: true }),
  ).map(([path, module]) => [path.split("/").at(-2)!, module.live]),
)

const cache = new Map<string, Promise<Edition>>()

let live: ReturnType<typeof readLive> | undefined
const readLive = () => sanity.fetch(LIVE_SITE_QUERY)

/** Today's content, in one read per build, shared by every edition. */
const liveSite = () => (live ??= readLive())

/** One fetch per edition per build, shared by all of its pages. */
export function getEdition(key: string): Promise<Edition> {
  let edition = cache.get(key)
  if (!edition) {
    edition = sanity.fetch(EDITION_QUERY, { key }).then(async (result) => {
      if (!result) throw new Error(`Edition "${key}" not found in Sanity`)
      const settings = SETTINGS[key]
      if (!settings) throw new Error(`Edition "${key}" has no src/editions/${key}/live.ts`)
      // In dev, links into nibras.co inside today's data point at the local site (lib/web.ts).
      return toEdition(result, webLinks(await liveSite()), settings)
    })
    cache.set(key, edition)
  }
  return edition
}

export const pageOf = (edition: Edition, slug: string) =>
  edition.pages?.find((page) => page.slug === slug)

export { imageUrl } from "@multiverse/content/format"

/** Present-day years for labels: "2019–2020", "2023", "2024–2026". */
export function period(start?: string | null, end?: string | null) {
  const from = start?.slice(0, 4)
  const to = end?.slice(0, 4)
  return from && to && to !== from ? `${from}–${to}` : (from ?? "")
}
