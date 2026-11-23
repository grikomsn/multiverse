import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { matchRanges, rankRows, scoreRow, termsOf } from "./command-index"

const row = (group: string, title: string, keywords?: string) => ({ group, title, keywords })

const ROWS = [
  row("Pages", "Work", "experience projects talks"),
  row("Pages", "Resume", "cv"),
  row("Actions", "Download the resume", "cv pdf"),
  row("Posts", "Fixing tsup 'dynamic require' errors"),
  row("Posts", "Hello, Junior."),
  row("Work", "Graz"),
  row("Work", "Coding agent providers"),
  row("Work", "Engineering Manager at Wayfindr"),
  row("Work", "Senior JavaScript Engineer at Wayfindr"),
]

describe("termsOf", () => {
  it("splits on spaces and lowers the case", () => {
    assert.deepEqual(termsOf("  Graz   Hooks "), ["graz", "hooks"])
    assert.deepEqual(termsOf("   "), [])
  })
})

describe("scoreRow", () => {
  it("counts the start of the title most, then a word start, then any place", () => {
    const start = scoreRow(row("Work", "Graz"), ["gr"])
    const word = scoreRow(row("Work", "Coding agent providers"), ["prov"])
    const inside = scoreRow(row("Work", "Coding agent providers"), ["gent"])
    const keyword = scoreRow(row("Pages", "Resume", "cv"), ["cv"])
    assert.ok(start > word && word > inside && inside > keyword && keyword > 0)
  })

  it("needs every term", () => {
    assert.equal(scoreRow(row("Work", "Engineering Manager at Wayfindr"), ["manager", "skip"]), 0)
    assert.ok(scoreRow(row("Work", "Engineering Manager at Wayfindr"), ["manager", "wayf"]) > 0)
  })

  it("matches a keyword only from its start", () => {
    const media = row("Pages", "Media", "photos avatars pictures")
    assert.ok(scoreRow(media, ["pic"]) > 0)
    assert.equal(scoreRow(media, ["res"]), 0)
  })

  it("finds a row by the name of its group", () => {
    assert.ok(scoreRow(row("Posts", "Hello, Junior."), ["posts"]) > 0)
  })

  it("sees a word start after punctuation", () => {
    assert.equal(
      scoreRow(row("Posts", "Fixing tsup 'dynamic require' errors"), ["dynamic"]),
      scoreRow(row("Posts", "Fixing tsup dynamic require errors"), ["dynamic"]),
    )
  })
})

describe("rankRows", () => {
  it("gives nothing for an empty query", () => {
    assert.deepEqual(rankRows(ROWS, "  "), [])
  })

  it("puts the group with the best row first", () => {
    const titles = rankRows(ROWS, "res").map((item) => item.title)
    assert.deepEqual(titles, ["Resume", "Download the resume"])
  })

  it("keeps the rows of a group together, best first", () => {
    const found = rankRows(ROWS, "wayfindr e")
    assert.deepEqual(
      found.map((item) => item.title),
      ["Engineering Manager at Wayfindr", "Senior JavaScript Engineer at Wayfindr"],
    )
  })

  it("matches keywords, below titles", () => {
    const titles = rankRows(ROWS, "cv").map((item) => item.title)
    assert.deepEqual(titles, ["Resume", "Download the resume"])
    assert.equal(rankRows(ROWS, "projects")[0]?.title, "Work")
  })

  it("shows at most `perGroup` rows of a group", () => {
    const many = Array.from({ length: 9 }, (_, index) => row("Work", `Project ${index}`))
    assert.equal(rankRows(many, "project").length, 5)
    assert.equal(rankRows(many, "project", 3).length, 3)
  })
})

describe("matchRanges", () => {
  it("marks the first match of each term", () => {
    assert.deepEqual(matchRanges("Graz hooks for Graz", ["graz"]), [[0, 4]])
    assert.deepEqual(matchRanges("Engineering Manager", ["man", "eng"]), [
      [0, 3],
      [12, 15],
    ])
  })

  it("joins marks that touch", () => {
    assert.deepEqual(matchRanges("Wayfindr", ["way", "yfin"]), [[0, 6]])
  })

  it("gives nothing when no term is in the text", () => {
    assert.deepEqual(matchRanges("Graz", ["x"]), [])
  })
})
