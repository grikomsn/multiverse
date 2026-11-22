/**
 * A small copy of a Sanity image as a data URI, made when the site builds.
 *
 * The dither canvases must read pixels. A browser cannot read them from `cdn.sanity.io`: the CDN
 * answers 403 to cross-origin reads from an origin that is not on the project's allow-list. A
 * data URI is part of the page, so the canvas may read it. Keep the copies small: they go into
 * the HTML.
 */
const cache = new Map<string, Promise<string | undefined>>()

/**
 * `params` is a Sanity image query, e.g. `?w=96&fm=jpg`. An SVG takes none.
 * A failed request gives `undefined`, and the caller leaves the effect out.
 */
export function inlineImage(url: string, params = "") {
  const key = url + params
  let pending = cache.get(key)
  if (!pending) {
    pending = load(key)
    cache.set(key, pending)
  }
  return pending
}

async function load(url: string) {
  try {
    const response = await fetch(url)
    if (!response.ok) return undefined
    const type = response.headers.get("content-type")?.split(";")[0] ?? "image/png"
    const body = Buffer.from(await response.arrayBuffer()).toString("base64")
    return `data:${type};base64,${body}`
  } catch {
    return undefined
  }
}

/** A project's icon for the dither canvas: an SVG as it is, a raster image small. */
export const markSource = (icon?: { url: string | null; extension?: string | null } | null) =>
  icon?.url
    ? inlineImage(icon.url, icon.extension === "svg" ? "" : "?h=96&fm=webp&q=75")
    : Promise.resolve(undefined)

/** The tiny picture a figure develops from: opaque, so transparent art has a ground. */
export const DEVELOP_PARAMS = "?w=96&fm=jpg&bg=ffffff&q=50"
