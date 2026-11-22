import { SANITY_DATASET, SANITY_PROJECT_ID } from "@multiverse/sanity/constants"

/**
 * Shared by the editions: helpers that every version needs the same way. Each edition keeps
 * its own components and CSS; only behavior that does not shape the design lives here.
 */

const REF = /^image-([a-f\d]+)-(\d+)x(\d+)-(\w+)$/

/** CDN URL for an image asset reference inside a Portable Text body (`image-<id>-<w>x<h>-<ext>`). */
export function assetUrl(ref: string | null | undefined, width?: number) {
  const match = ref ? REF.exec(ref) : null
  if (!match) return undefined
  const [, id, w, h, ext] = match
  const url = `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${w}x${h}.${ext}`
  return width ? `${url}?w=${width}&fit=max&auto=format` : url
}

/** Intrinsic size from the same reference. */
export function assetSize(ref: string | null | undefined) {
  const match = ref ? REF.exec(ref) : null
  return {
    width: match ? Number(match[2]) : undefined,
    height: match ? Number(match[3]) : undefined,
  }
}
