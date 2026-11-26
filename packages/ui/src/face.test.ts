import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { faceLayers, faceMix, faceSvg, layersOf, MOODS, POSE } from "./face"
import { FAMILY, WHO } from "./family"

describe("the family", () => {
  it("has Gri first, with no name on his drawing", () => {
    assert.deepEqual(WHO, ["gri", "nia", "ash"])
    assert.equal(FAMILY.gri.face.who, undefined)
    assert.equal(FAMILY.nia.face.who, "nia")
    assert.equal(FAMILY.ash.face.who, "ash")
  })

  it("draws every mood of every face", () => {
    for (const who of WHO) {
      const svg = faceSvg(FAMILY[who].face, { moods: MOODS })
      assert.equal(svg.match(/<g class="mouth">/g)?.length, MOODS.length, who)
      assert.equal(svg.match(/<g class="eye l">/g)?.length, MOODS.length, who)
      // Without a style sheet, only the first mood shows.
      assert.ok(svg.includes(`<g data-m="${MOODS[1]}" display="none">`), who)
    }
  })

  it("names a face other than Gri on its drawing and in its rules", () => {
    const nia = faceSvg(FAMILY.nia.face, { moods: ["smile", "sad"], rules: true })
    assert.ok(nia.includes(`class="gri" data-who="nia" data-mood="smile"`))
    // Her pose is her own, and a rule with her name is stronger than a rule of Gri.
    assert.ok(nia.includes(`.gri[data-who="nia"][data-mood="sad"]{--gri-turn:9deg;--gri-drop:5px}`))
    const gri = faceSvg(FAMILY.gri.face, { moods: ["sad"], rules: true })
    assert.ok(gri.includes(`.gri[data-mood="sad"]{--gri-turn:-9deg;--gri-drop:5px}`))
  })
})

describe("the poses", () => {
  it("lean Nia the other way from Gri and Ash", () => {
    for (const mood of MOODS) {
      assert.equal(FAMILY.nia.face.pose[mood][0], -POSE[mood][0])
      assert.deepEqual(FAMILY.ash.face.pose[mood], POSE[mood])
    }
  })
})

describe("the parts", () => {
  it("gives brows to Ash only, as a part of their own", () => {
    const ash = faceSvg(FAMILY.ash.face, { moods: ["smile"] })
    assert.equal(ash.match(/<g class="brow">/g)?.length, 1)
    for (const who of ["gri", "nia"] as const) {
      assert.ok(!faceSvg(FAMILY[who].face, { moods: MOODS }).includes(`class="brow"`), who)
    }
    // A mixed face of Ash takes the brows with the eyes.
    const mixed = faceSvg(FAMILY.ash.face, { moods: MOODS, mix: true })
    assert.ok(
      mixed.includes(
        `.gri[data-who="ash"][data-eyes="smile"] [data-m="smile"]>:is(.eye,.lens,.brow)`,
      ),
    )
  })

  it("gives every face sunglasses for the cool mood", () => {
    for (const who of WHO) {
      const svg = faceSvg(FAMILY[who].face, { moods: ["cool"] })
      assert.equal(svg.match(/<g class="lens" fill="#18181b">/g)?.length, 1, who)
    }
  })

  it("marks the cloth and the hem of Nia, so a page can change their color", () => {
    const svg = faceSvg(FAMILY.nia.face, { moods: ["smile"] })
    assert.equal(svg.match(/class="cloth"/g)?.length, 1)
    assert.equal(svg.match(/class="hem"/g)?.length, 1)
  })
})

describe("the layers and the mixes", () => {
  it("names the layers of each face from the back to the front", () => {
    assert.deepEqual(layersOf(FAMILY.nia.face), [
      "ground",
      "head",
      "blush",
      "hijab",
      "hem",
      "face",
      "marks",
    ])
    assert.deepEqual(layersOf(FAMILY.ash.face), [
      "ground",
      "head",
      "blush",
      "hair",
      "face",
      "marks",
    ])
    for (const who of WHO) {
      const face = FAMILY[who].face
      assert.deepEqual(Object.keys(faceLayers(face, "love")), layersOf(face), who)
    }
  })

  it("has one mood for each different part", () => {
    for (const who of WHO) {
      for (const moods of Object.values(faceMix(FAMILY[who].face))) {
        assert.equal(new Set(moods).size, moods.length, who)
      }
    }
    // Smile and laugh share the eyes of Gri and of Nia. Ash laughs without brows.
    assert.ok(!faceMix(FAMILY.nia.face).eyes.includes("laugh"))
    assert.ok(faceMix(FAMILY.ash.face).eyes.includes("laugh"))
  })

  it("shows a color for each key of a palette", () => {
    for (const who of WHO) {
      for (const color of Object.values(FAMILY[who].palette)) assert.match(color, /^#[0-9a-f]{6}$/)
    }
  })
})
