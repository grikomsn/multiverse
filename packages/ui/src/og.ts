/**
 * The social card of a page: the picture that a chat or a feed shows with its link (Open
 * Graph). Every app draws its cards here, so a link to any of them looks like the same site:
 * its name and mascot, one title, and the wave in dots.
 *
 * The rules come from what the apps that show cards do (see `docs/social-cards.md`): one
 * size for all of them, large type, and a file small enough for each.
 *
 * It runs in a build, not in a page: Takumi lays out the card and draws the text from the
 * site's font file, and sharp writes the PNG.
 */
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import sharp from "sharp"
import { render } from "takumi-js"

import { threshold, wave } from "./dither"
import { faceFile, type Mood } from "./face"
import { FAMILY, type Who } from "./family"
import { mix, THEMES } from "./theme"

/** The size that every app accepts: 1.91 to 1, and wide enough for the largest layouts. */
export const OG_SIZE = { width: 1200, height: 630 }

/**
 * The number of the design. An app puts it in the address of each card, so a cache that
 * holds an older design does not show it. Raise it when the look of the cards changes.
 */
export const OG_VERSION = 1

export interface OgCard {
  /** The name at the top: the site's. */
  name: string
  /** A short line over the title: the kind of page, or a date. */
  label?: string
  /** The headline. A line break starts a new line. Words in [brackets] get a mark. */
  title: string
  /** A large face on the right. Without it, a small Gri sits by the name. */
  face?: { who?: Who; mood?: Mood }
  /** A picture in place of the large face, as a data URL: the card in a terminal has its own. */
  art?: string
  /**
   * The address of the page's cover, cut to `OG_SIZE` or larger. The cover then fills the
   * card, and the name, the label and the title are on a paper label over it.
   */
  cover?: string
  /** The light theme is the site's own. The dark one is for a terminal. */
  theme?: "light" | "dark"
}

const EDGE = 72
const ART = 280
/** The bottom of the card belongs to the wave. Text stays above it. */
const BAND = 176
const DOT = 6
/** Title sizes, largest first. Below 56 pixels, a card shown small is hard to read. */
const SIZES = [112, 100, 88, 78, 70, 62, 56]
/** The most lines a title takes. A longer one is cut at the smallest size. */
const LINES = 3
const LEADING = 1.08
/** The label's size, and the space between it and the title. */
const LABEL = 28
const GAP = 20
/** The height for the label and the title: from under the name to the dense part of the wave. */
const TEXT_ROOM = 316
const FAMILY_NAME = "Site"
/**
 * The paper label of a card with a cover. It is in the top left corner: X puts the link's
 * domain over the bottom left corner, so the bottom of the card shows only the cover.
 */
const PLATE = { width: 720, edge: 44, pad: 40, sizes: [72, 64, 56] }
/**
 * How dark the cover is under the label, as a part of 1. The dark falls away toward the
 * opposite corner, so the label stands out on a light cover and on a busy one, and the cover
 * stays itself.
 */
const SHADE = 0.36
/** Room for four lines at the smallest size: a title with long words needs them on the label. */
const PLATE_ROOM = Math.ceil(56 * LEADING * 4)

const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

const dataUrl = (type: string, data: Buffer) => `data:${type};base64,${data.toString("base64")}`

const rgb = (hex: string) => [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16))

/** A number from 0 to 1 that is always the same for the same text. */
function seed(text: string) {
  let value = 2166136261
  for (let at = 0; at < text.length; at++) value = Math.imul(value ^ text.charCodeAt(at), 16777619)
  return (value >>> 0) / 2 ** 32
}

/** The wave as a picture: the footer band of the site, in dots of one color. */
async function band(color: string, time: number) {
  const columns = Math.ceil(OG_SIZE.width / DOT)
  const rows = Math.ceil(BAND / DOT)
  const dots = Buffer.alloc(columns * rows * 4)
  const ink = [...rgb(color), 255]
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const value = Math.min(0.66, wave(x * DOT, y / rows, time))
      if (value * 255 > threshold(x, y)) dots.set(ink, (y * columns + x) * 4)
    }
  }
  const picture = await sharp(dots, { raw: { width: columns, height: rows, channels: 4 } })
    .resize(columns * DOT, rows * DOT, { kernel: "nearest" })
    .png()
    .toBuffer()
  return { src: dataUrl("image/png", picture), width: columns * DOT, height: rows * DOT }
}

const faceUrl = (who: Who = "gri", mood: Mood = "smile") =>
  dataUrl("image/svg+xml", Buffer.from(faceFile(FAMILY[who].face, mood)))

const titleStyle = (size: number) =>
  `font-family:${FAMILY_NAME};font-size:${size}px;font-weight:700;line-height:${LEADING};letter-spacing:-0.025em;text-wrap:balance`

/** The size of a PNG, from its first chunk. */
const sizeOf = (png: Uint8Array) => {
  const view = new DataView(png.buffer, png.byteOffset)
  return { width: view.getUint32(16), height: view.getUint32(20) }
}

/** The title as markup: one block for each line, and a mark behind each word in brackets. */
function titleMarkup(lines: string[], size: number, marks: readonly string[]) {
  let mark = 0
  const pad = Math.round(size * 0.1)
  return lines
    .map((line) => {
      const parts = line
        .split(/\[([^\]]+)\]/)
        .map((part, index) =>
          index % 2
            ? `<span style="background:${marks[mark++ % marks.length]};border-radius:${Math.round(size * 0.14)}px;padding:0 ${pad}px;margin:0 -${pad}px">${escape(part)}</span>`
            : escape(part),
        )
      return `<div style="display:block">${parts.join("")}</div>`
    })
    .join("")
}

/**
 * The largest size at which the title takes `LINES` lines or fewer in `width` pixels and is
 * `room` pixels high or less, with no word cut in two. It draws the title at each size and counts: letters differ too much in
 * width for an estimate.
 */
async function sizeFor(
  lines: string[],
  width: number,
  room: number,
  font: Uint8Array,
  sizes = SIZES,
) {
  const fonts = [{ name: FAMILY_NAME, data: font }]
  const longest = lines
    .flatMap((line) => line.replace(/[[\]]/g, "").split(/\s+/))
    .reduce((a, b) => (b.length > a.length ? b : a), "")
  for (const size of sizes) {
    const block = await render(
      `<div style="display:flex;flex-direction:column;width:${width}px;${titleStyle(size)}">${titleMarkup(lines, size, ["#000"])}</div>`,
      { width, fonts },
    )
    const { height } = sizeOf(block)
    if (height > room || Math.round(height / (size * LEADING)) > LINES) continue
    const word = await render(
      `<div style="display:flex;white-space:nowrap;${titleStyle(size)}">${escape(longest)}</div>`,
      { fonts },
    )
    if (sizeOf(word).width <= width) return size
  }
  return sizes.at(-1)!
}

/** The picture at an address, cut to the size of a card. */
async function coverOf(address: string) {
  const response = await fetch(address)
  if (!response.ok) throw new Error(`The cover ${address} did not come: ${response.status}.`)
  const picture = await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(OG_SIZE.width, OG_SIZE.height, { fit: "cover" })
    .flatten({ background: THEMES.light.bg })
    .png()
    .toBuffer()
  return dataUrl("image/png", picture)
}

/** A card has few colors and is a PNG. With a cover it holds a photo, so it is a JPEG. */
export const ogFormat = (card: OgCard) => (card.cover ? "jpg" : "png")
export const ogType = (card: OgCard) => (card.cover ? "image/jpeg" : "image/png")

const nameRow = (name: string, face: number, size: number) =>
  `<div style="display:flex;align-items:center;gap:${Math.round(face * 0.27)}px;height:${face}px"><img src="${faceUrl()}" style="width:${face}px;height:${face}px;border-radius:${face / 2}px" /><div style="font-size:${size}px;font-weight:600;letter-spacing:-0.01em">${escape(name)}</div></div>`

const labelRow = (label: string, size: number, color: string) =>
  `<div style="font-size:${size}px;line-height:1;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:${color}">${escape(label)}</div>`

/** The card of a page with a cover: the cover fills it, and the text is on a paper label. */
async function coverCard(card: OgCard, font: Uint8Array) {
  const theme = THEMES.light
  const lines = card.title.split("\n")
  const width = PLATE.width - PLATE.pad * 2
  const size = await sizeFor(lines, width, PLATE_ROOM, font, PLATE.sizes)
  const full = `position:absolute;left:0;top:0;width:${OG_SIZE.width}px;height:${OG_SIZE.height}px`
  const ink = rgb(theme.fg).join(",")
  const shade = `background:linear-gradient(to bottom right, rgba(${ink},${SHADE}) 0%, rgba(${ink},${SHADE / 2}) 40%, rgba(${ink},0) 75%)`
  const html = `
<div style="display:flex;position:relative;width:${OG_SIZE.width}px;height:${OG_SIZE.height}px;background:${theme.bg};color:${theme.fg};font-family:${FAMILY_NAME}">
  <img src="${await coverOf(card.cover!)}" style="${full}" />
  <div style="${full};${shade}"></div>
  <div style="${full};display:flex;align-items:flex-start;padding:${PLATE.edge}px 0 0 ${PLATE.edge}px">
    <div style="display:flex;flex-direction:column;gap:18px;width:${PLATE.width}px;padding:34px ${PLATE.pad}px 38px;background:${theme.bg};border-radius:28px">
      ${nameRow(card.name, 44, 28)}
      ${card.label ? labelRow(card.label, 24, theme.accentInk) : ""}
      <div style="display:flex;flex-direction:column;max-height:${PLATE_ROOM}px;overflow:hidden;${titleStyle(size)}">${titleMarkup(lines, size, theme.marks)}</div>
    </div>
  </div>
</div>`
  const drawn = await render(html, { ...OG_SIZE, fonts: [{ name: FAMILY_NAME, data: font }] })
  return sharp(drawn).jpeg({ quality: 86, mozjpeg: true }).toBuffer()
}

let fonts: Promise<Buffer> | undefined

/**
 * The site's font, from where `scripts/subset-fonts.sh` writes it. A build starts in its
 * app's folder, two levels below the root. `SITE_FONT=allo` gives Allo, as for the pages.
 */
export function siteFontFile(dir = "../../assets/fonts/web") {
  const file = process.env.SITE_FONT === "allo" ? "allo-sans.woff2" : "timeless-sans.woff2"
  return (fonts ??= readFile(resolve(dir, file)))
}

/** Draws a card of `OG_SIZE`. Returns a PNG, or a JPEG for a card with a cover (`ogType`). */
export async function ogImage(
  card: OgCard,
  font: Uint8Array | Promise<Uint8Array> = siteFontFile(),
) {
  if (card.cover) return coverCard(card, await font)
  const theme = THEMES[card.theme ?? "light"]
  const large = card.art ?? (card.face ? faceUrl(card.face.who, card.face.mood) : undefined)
  const lines = card.title.split("\n")
  const width = OG_SIZE.width - EDGE * 2 - (large ? ART + 56 : 0)
  const data = await font
  // What is left for the title between the name and the wave.
  const room = TEXT_ROOM - (card.label ? LABEL + GAP : 0)
  const size = await sizeFor(lines, width, room, data)
  // On the dark ground the dots need more of the accent than on a page, or they look like mud.
  const dots = theme.name === "dark" ? mix(theme.bg, theme.accent, 0.5) : theme.dither
  const wavy = await band(dots, 0.4 + seed(card.title) * 5)
  const title = titleMarkup(lines, size, theme.marks)

  const html = `
<div style="display:flex;position:relative;width:${OG_SIZE.width}px;height:${OG_SIZE.height}px;background:${theme.bg};color:${theme.fg};font-family:${FAMILY_NAME}">
  <img src="${wavy.src}" style="position:absolute;left:0;bottom:0;width:${wavy.width}px;height:${wavy.height}px" />
  <div style="display:flex;flex-direction:column;width:100%;height:${OG_SIZE.height - BAND + 56}px;padding:${EDGE - 12}px ${EDGE}px 0">
    <div style="display:flex;align-items:center;gap:16px;height:60px">
      ${large ? "" : `<img src="${faceUrl()}" style="width:60px;height:60px;border-radius:30px" />`}
      <div style="font-size:32px;font-weight:600;letter-spacing:-0.01em">${escape(card.name)}</div>
    </div>
    <div style="display:flex;flex:1;align-items:center;gap:56px;padding-top:12px">
      <div style="display:flex;flex-direction:column;flex:1;gap:${GAP}px">
        ${card.label ? labelRow(card.label, LABEL, theme.accentInk) : ""}
        <div style="display:flex;flex-direction:column;max-height:${room}px;overflow:hidden;${titleStyle(size)}">${title}</div>
      </div>
      ${large ? `<img src="${large}" style="width:${ART}px;height:${ART}px;${card.art ? "" : `border-radius:${ART / 2}px`}" />` : ""}
    </div>
  </div>
</div>`

  const drawn = await render(html, {
    ...OG_SIZE,
    fonts: [{ name: FAMILY_NAME, data }],
  })
  // The card has few colors, so a palette keeps every one and makes the file small.
  return sharp(drawn).png({ palette: true, colours: 256, dither: 0, effort: 10 }).toBuffer()
}

/** A short text that changes when the card does: for the address of the picture. */
export const ogKey = (card: OgCard) =>
  Math.floor(seed(JSON.stringify([OG_VERSION, card])) * 36 ** 6)
    .toString(36)
    .padStart(6, "0")
