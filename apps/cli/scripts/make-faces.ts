/**
 * The mascot as pixels for the terminal: every mood of `packages/ui/src/gri.ts`, in each size
 * of `FACE_SIZES`. A terminal has no vectors, so the build of the drawing happens here.
 * `./scripts/make-icons.sh` runs this file; commit the file it writes.
 */
import { writeFile } from "node:fs/promises"
import { deflateSync } from "node:zlib"

import { griFile, MOODS } from "@multiverse/ui/gri"
import sharp from "sharp"

/** Pixels on each side. A terminal cell shows two pixels, one over the other. */
const SIZES = [28, 20]
/**
 * The part of the drawing that shows, in its own units: a square around the head, (100, 103)
 * in the middle. The drawing's own frame leaves more space, which a small picture cannot spare.
 */
const CROP = 190

const parts: Buffer[] = []
for (const size of SIZES) {
  for (const mood of MOODS) {
    const svg = griFile(mood).replace(
      /viewBox="[^"]*"/,
      `viewBox="${100 - CROP / 2} ${103 - CROP / 2} ${CROP} ${CROP}"`,
    )
    parts.push(
      await sharp(Buffer.from(svg))
        .resize(size, size, { kernel: "lanczos3" })
        .removeAlpha()
        .raw()
        .toBuffer(),
    )
  }
}
const data = deflateSync(Buffer.concat(parts), { level: 9 }).toString("base64")

await writeFile(
  new URL("../src/faces.gen.ts", import.meta.url),
  `// Written by scripts/make-faces.ts from packages/ui/src/gri.ts. Do not edit.

/** Pixels on each side of a face, largest first. */
export const FACE_SIZES = [${SIZES.join(", ")}] as const

/**
 * Every mood in every size: for each size, for each mood in the order of \`MOODS\`, rows of
 * red, green and blue bytes. Deflated, then base64.
 */
export const FACES =
  "${data}"
`,
)
console.log(
  `Faces written: ${MOODS.length} moods, ${SIZES.join(" and ")} pixels, ${data.length} characters`,
)
