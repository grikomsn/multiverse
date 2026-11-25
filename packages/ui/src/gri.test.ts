import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { describe, it } from "node:test"

import { griFile, griLayers, griSvg, LAYERS, MIX, MOODS } from "./gri"

describe("the drawing", () => {
  it("is the committed mascot file", () => {
    // `scripts/make-icons.sh` writes the file from the drawing. Run it after a change.
    const file = readFileSync(new URL("./mascot.svg", import.meta.url), "utf8")
    assert.equal(griFile("smile"), file)
  })

  it("shows only the first mood without a style sheet", () => {
    const svg = griSvg({ moods: MOODS })
    assert.equal(svg.match(/<g class="mouth">/g)?.length, MOODS.length)
    // Blush, face and marks of every other mood are hidden by an attribute.
    assert.ok(!svg.includes(`<g data-m="${MOODS[0]}" display="none">`))
    assert.ok(svg.includes(`<g data-m="${MOODS[1]}" display="none">`))
  })
})

describe("a mixed face", () => {
  it("has one mood for each different part", () => {
    // Smile and laugh share their eyes; the smile's eyes stand for both.
    assert.ok(MIX.eyes.includes("smile") && !MIX.eyes.includes("laugh"))
    for (const moods of Object.values(MIX)) {
      assert.equal(new Set(moods).size, moods.length)
      assert.ok(moods.every((mood) => MOODS.includes(mood)))
    }
  })

  it("starts as the first mood, with no mood named", () => {
    const svg = griSvg({ moods: MOODS, mix: true })
    assert.ok(svg.includes(`data-mood="" data-eyes="smile" data-mouth="smile" data-extra="smile"`))
    // The tongue belongs to the mouth, so the marks of that mood do not show it.
    assert.ok(svg.includes(`.gri[data-mouth="cheeky"] [data-m="cheeky"]>:is(.mouth,.extra)`))
    assert.ok(!svg.includes(`data-extra="cheeky"]`))
  })
})

describe("the layers", () => {
  it("gives a drawing for each layer that the mood uses", () => {
    assert.deepEqual(Object.keys(griLayers("love")), [...LAYERS])
    // The smile has no marks around the head, and a sad face has no blush.
    assert.equal(griLayers("smile").marks, undefined)
    assert.equal(griLayers("sad").blush, undefined)
  })
})
