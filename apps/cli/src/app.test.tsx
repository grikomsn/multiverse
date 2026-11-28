import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { renderToString } from "ink"

import { List } from "./app"
import { views, type Section } from "./content"
import { FIXTURE } from "./fixture"
import { fitScroll, lineOfRow, toLines, windowOf } from "./list"
import { THEMES } from "./theme"

/** A list as the card draws it: the cursor on `selected`, in `height` lines. */
function draw(sections: Section[], selected: number, height: number) {
  const lines = toLines(sections)
  const start = fitScroll(lines, 0, lineOfRow(lines, selected), height)
  return renderToString(
    <List
      card={FIXTURE}
      theme={THEMES.dark}
      shown={windowOf(lines, start, height)}
      start={start}
      selected={selected}
      width={76}
    />,
    { columns: 80 },
  )
}

describe("a list", () => {
  it("draws every view with no warning from React", (context) => {
    // React reports two children with one key through console.error. That mistake left old
    // rows on the screen when the list moved: two roles at one organization had the same key.
    const error = context.mock.method(console, "error", () => {})
    for (const view of views(FIXTURE)) {
      for (const height of [6, 100]) {
        draw(view.sections, 2, height)
      }
    }
    assert.deepEqual(
      error.mock.calls.map((call) => String(call.arguments[0])),
      [],
    )
  })

  it("shows both roles at one organization, and the row under the cursor", () => {
    const work = views(FIXTURE)[1]!
    const text = draw(work.sections, 0, 100)
    assert.match(text, /❯ Example Works {2}Engineering Manager, Engineer/)
    assert.match(text, /Example Works {2}Founding Engineer/)
    assert.equal(text.match(/Example Works/g)?.length, 2)
  })

  it("shows a light between a project's name and its line", () => {
    const home = views(FIXTURE)[0]!
    assert.match(draw(home.sections, 0, 100), /Widget • {2}A widget for small jobs\./)
  })
})
