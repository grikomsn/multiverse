import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { resolve } from "node:path"
import { describe, it } from "node:test"

import { OG_SIZE, ogFormat, ogImage, ogKey, ogType, siteFontFile, type OgCard } from "./og"

const card: OgCard = { name: "Griko Nibras", label: "Jul 21, 2025", title: "A [marked] title" }

describe("a social card", () => {
  it("has a key that changes with the card, and only then", () => {
    assert.equal(ogKey(card), ogKey({ ...card }))
    assert.notEqual(ogKey(card), ogKey({ ...card, title: "Another title" }))
    assert.match(ogKey(card), /^[0-9a-z]{6}$/)
  })

  it("is a JPEG when it has a cover, because a cover is a photo", () => {
    const covered = { ...card, cover: "https://example.com/cover.jpg" }
    assert.deepEqual([ogFormat(card), ogType(card)], ["png", "image/png"])
    assert.deepEqual([ogFormat(covered), ogType(covered)], ["jpg", "image/jpeg"])
    assert.notEqual(ogKey(card), ogKey(covered))
  })

  // The font is licensed and not in the repository, so a machine without it skips the drawing.
  const fonts = resolve(import.meta.dirname, "../../../assets/fonts/web")
  const hasFont = existsSync(resolve(fonts, "timeless-sans.woff2"))

  it("is a PNG of the size that every app accepts, and small", { skip: !hasFont }, async () => {
    const png = await ogImage(
      { ...card, title: "A title that is long enough to take more than one line on the card" },
      siteFontFile(fonts),
    )
    assert.equal(png.subarray(1, 4).toString("latin1"), "PNG")
    assert.equal(png.readUInt32BE(16), OG_SIZE.width)
    assert.equal(png.readUInt32BE(20), OG_SIZE.height)
    // WhatsApp shows no picture over 600 KB.
    assert.ok(png.length < 600_000, `${png.length} bytes`)
  })
})
