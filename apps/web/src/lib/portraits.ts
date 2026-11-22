import { SANITY_DATASET, SANITY_PROJECT_ID } from "@multiverse/sanity/constants"
import type { MEDIA_PAGE_QUERY_RESULT } from "@multiverse/sanity/types"
import { createImageUrlBuilder } from "@sanity/image-url"

type PortraitRow = MEDIA_PAGE_QUERY_RESULT["portraits"][number]

const builder = createImageUrlBuilder({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET ?? SANITY_DATASET,
})

/** Square grid tiles; the grid tops out around 300px a tile, so 2× that covers retina. */
const THUMB_WIDTHS = [240, 360, 480, 640]
/** Lightbox views, capped at the original's width. */
const FULL_WIDTHS = [640, 960, 1280, 1600, 2048]

export const THUMB_SIZES =
  "(min-width: 80rem) 14rem, (min-width: 64rem) 22vw, (min-width: 48rem) 30vw, 46vw"
export const FULL_SIZES = "min(92vw, calc(100vh - 18rem), 56rem)"

export interface GalleryPortrait {
  /** URL fragment, e.g. `formal` for `portrait-formal`. */
  slug: string
  title: string
  alt: string
  caption: string | null
  kind: "photo" | "illustration"
  credit: string | null
  creditUrl: string | null
  width: number
  height: number
  /** e.g. `2048 × 2048 · JPG`. */
  meta: string
  /** Blurred placeholder; omitted for images with transparency, where it would show through. */
  lqip: string | null
  thumb: { src: string; srcset: string }
  /** A very small, opaque copy of the thumbnail, for the picture to develop from. */
  tiny: string
  full: { src: string; srcset: string }
  /** The untouched upload, served with `?dl=` so browsers save it instead of opening it. */
  original: string
  download: string
}

function srcset(row: PortraitRow, widths: number[], square: boolean): string {
  return widths
    .map((w) => {
      const url = builder
        .image(row.image)
        .width(w)
        .auto("format")
        .quality(square ? 80 : 85)
      return `${(square ? url.height(w).fit("crop") : url.fit("max")).url()} ${w}w`
    })
    .join(", ")
}

export function toGalleryPortrait(row: PortraitRow): GalleryPortrait {
  const { asset } = row.image
  const width = asset.width ?? 2048
  const height = asset.height ?? width
  const slug = row._id.replace(/^portrait-/, "")
  const ext = asset.extension.toLowerCase()
  const fullWidths = FULL_WIDTHS.filter((w) => w < width).concat(Math.min(width, 2400))
  const filename = `griko-nibras-${slug}.${ext}`

  return {
    slug,
    title: row.title,
    alt: row.alt,
    caption: row.caption,
    kind: row.kind ?? "photo",
    credit: row.credit,
    creditUrl: row.creditUrl,
    width,
    height,
    meta: `${width} × ${height} · ${ext.toUpperCase()}`,
    lqip: asset.opaque === false ? null : asset.lqip,
    thumb: {
      src: builder
        .image(row.image)
        .width(480)
        .height(480)
        .fit("crop")
        .auto("format")
        .quality(80)
        .url(),
      srcset: srcset(row, THUMB_WIDTHS, true),
    },
    tiny: builder
      .image(row.image)
      .width(72)
      .height(72)
      .fit("crop")
      .format("jpg")
      .bg("ffffff")
      .quality(50)
      .url(),
    full: {
      src: builder.image(row.image).width(1280).fit("max").auto("format").quality(85).url(),
      srcset: srcset(row, fullWidths, false),
    },
    original: asset.url,
    download: `${asset.url}?dl=${encodeURIComponent(filename)}`,
  }
}
