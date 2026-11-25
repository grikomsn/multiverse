/**
 * The GitHub profile readme (github.com/grikomsn), from today's facts in Sanity.
 *
 * `github-readme/` is a submodule: the repository `grikomsn/grikomsn`. This script writes its
 * `README.md` and the pictures in `assets/`. Then commit and push in the submodule, and commit
 * the new submodule pointer here:
 *
 *   bun scripts/make-readme.ts
 *
 * The facts come from `getCard()`, the same as `npx grikomsn`. The sentences come from the
 * card's `content.ts`, in the words of the home page. Gri comes from `packages/ui/src/gri.ts`
 * and the signature from the home page's trace. So the readme holds no fact of its own.
 */
import { mkdir, writeFile } from "node:fs/promises"

import { type Card, getCard } from "@multiverse/content/card"
import { createSanityClient } from "@multiverse/content/client"
import { griSvg, type Mood } from "@multiverse/ui/gri"

import { headline, intro, tagline } from "../apps/cli/src/content"
import signature from "../apps/web/src/data/signature.json"

const OUT = new URL("../github-readme/", import.meta.url)

/** GitHub shows one picture of each pair: the one for the reader's theme. */
const THEMES = {
  light: { fg: "#18181b", line: "#e7e5e0", mood: "smile" },
  dark: { fg: "#ececf1", line: "#2b2d34", mood: "cool" },
} as const satisfies Record<string, { fg: string; line: string; mood: Mood }>
type Theme = keyof typeof THEMES

// The moves play once, as on the site, and not at all with reduced motion. Without the
// animations each picture shows its last frame, so a viewer that ignores them is still right.
const MOTION = `
@media (prefers-reduced-motion: no-preference) {
  .pop { transform-box: fill-box; transform-origin: 50% 50%; animation: pop 520ms cubic-bezier(.3,1.5,.5,1) both; }
  .peek { animation: peek 900ms 1600ms both; }
  .unpeek { animation: unpeek 900ms 1600ms both; }
  .ink path { animation: write var(--l) linear var(--d) both; }
}
.peek { opacity: 0; }
@keyframes pop { from { opacity: 0; transform: scale(.4); } }
@keyframes peek { 0%, 100% { opacity: 0; } 3%, 97% { opacity: 1; } }
@keyframes unpeek { 0%, 100% { opacity: 1; } 3%, 97% { opacity: 0; } }
@keyframes write { 0% { stroke-dashoffset: 1; stroke-opacity: 0; } 0.1% { stroke-opacity: 1; } 100% { stroke-dashoffset: 0; stroke-opacity: 1; } }
`

/** Gri in a circle: the mood of the theme, with one wink a moment after it shows. */
function gri(theme: Theme) {
  const { line, mood } = THEMES[theme]
  const size = 240
  const face = (m: Mood) =>
    griSvg({ moods: [m] }).replace("<svg ", `<svg x="0" y="0" width="${size}" height="${size}" `)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Gri, a cartoon face of Griko">
<title>Gri, a cartoon face of Griko</title>
<style>${MOTION}</style>
<clipPath id="circle"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}"/></clipPath>
<g class="pop">
<g clip-path="url(#circle)">
<g class="unpeek">${face(mood)}</g>
<g class="peek">${face("wink")}</g>
</g>
<circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 1.5}" fill="none" stroke="${line}" stroke-width="3"/>
</g>
</svg>
`
}

/** The signature of the home page, which writes itself stroke by stroke (`signature.astro`). */
function signed(theme: Theme, label: string) {
  const WRITE_MS = 1400
  const LIFT_MS = 90
  const LIFT_PX = 80
  const point = (text: string) => text.replace("M", "").split(" ").map(Number)
  let clock = 400
  let previous: number[] | undefined
  const strokes = signature.strokes.map((stroke) => {
    const [x, y] = point(stroke.d.split("L")[0]!)
    if (previous && Math.hypot(x! - previous[0]!, y! - previous[1]!) > LIFT_PX) clock += LIFT_MS
    const duration = Math.max(20, Math.round((stroke.len / signature.total) * WRITE_MS))
    const path = `<path d="${stroke.d}" pathLength="1" style="--d:${clock}ms;--l:${duration}ms"/>`
    clock += duration
    previous = point(stroke.d.split("L").at(-1)!)
    return path
  })
  const [, , width, height] = signature.viewBox.split(" ").map(Number)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${signature.viewBox}" width="${Math.round(width! / 4)}" height="${Math.round(height! / 4)}" role="img" aria-label="${label}">
<title>${label}</title>
<style>.ink path { fill: none; stroke: #fff; stroke-width: 28; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1; }${MOTION}</style>
<mask id="ink" class="ink" maskUnits="userSpaceOnUse">${strokes.join("")}</mask>
<path d="${signature.fill}" fill="${THEMES[theme].fg}" mask="url(#ink)"/>
</svg>
`
}

const picture = (name: string, alt: string, attrs: string) => `<picture>
<source media="(prefers-color-scheme: dark)" srcset="./assets/${name}-dark.svg">
<img src="./assets/${name}-light.svg" alt="${alt}" ${attrs}>
</picture>`

/** A project's summary, short: its first sentence, up to a colon. */
const short = (summary = "") =>
  summary
    .split(/(?<=\.)\s/)[0]!
    .split(":")[0]!
    .replace(/\.$/, "")

function readme(card: Card) {
  const links = new Map(
    card.experience.flatMap((stop) => (stop.url ? [[stop.organization, stop.url]] : [])),
  )
  // The names in the intro are at the odd indexes: they become links, as on the home page.
  const about = intro(card)
    .map((part, index) => (index % 2 && links.has(part) ? `[${part}](${links.get(part)})` : part))
    .join("")
  const projects = card.projects.map((project) => {
    const name = project.url ? `[${project.name}](${project.url})` : project.name
    return `- **${name}**${project.summary ? `: ${short(project.summary)}.` : ""}`
  })
  const contact = [
    `[${new URL(card.website).hostname}](${card.website})`,
    `[Resume](${card.website}/resume)`,
    card.scheduleUrl && `[Book a call](${card.scheduleUrl})`,
    card.email && `[${card.email}](mailto:${card.email})`,
  ].filter(Boolean)

  return `<!-- Written by scripts/make-readme.ts in grikomsn/multiverse, from the facts on nibras.co. Change it there. -->

<a href="${card.website}">
${picture("gri", "Gri, a cartoon face of Griko", 'align="right" width="120"')}
</a>

### ${headline(card)}

${tagline(card).join("")} ${about}

${projects.join("\n")}

${contact.join(" · ")}

${picture("signature", card.givenName, 'width="140"')}
`
}

const card = await getCard(createSanityClient())
await mkdir(new URL("assets/", OUT), { recursive: true })
await writeFile(new URL("README.md", OUT), readme(card))
for (const theme of Object.keys(THEMES) as Theme[]) {
  await writeFile(new URL(`assets/gri-${theme}.svg`, OUT), gri(theme))
  await writeFile(new URL(`assets/signature-${theme}.svg`, OUT), signed(theme, card.givenName))
}
console.log("Wrote github-readme/README.md and its pictures.")
