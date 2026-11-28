import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { isCard } from "@multiverse/content/card"
import { MOODS } from "@multiverse/ui/gri"

import { allRows, cityTime, headline, intro, isOnSite, tagline, views, wrapParts } from "./content"
import { FACE_SIZES, faceRows, moveOf, SMALL_FACES, to256 } from "./face"
import { FIXTURE } from "./fixture"
import { plainCard } from "./plain"
import { reducedMotion } from "./terminal"
import { mix, THEMES } from "./theme"
import { waveRows } from "./wave"

/** The text of a line without its color codes. */
const bare = (line: string) => line.replace(/\x1b\[[\d;]*m/g, "")

describe("the card's facts", () => {
  it("accepts a card and refuses other JSON", () => {
    assert.equal(isCard(FIXTURE), true)
    assert.equal(isCard({ ...FIXTURE, version: 2 }), false)
    assert.equal(isCard({ ...FIXTURE, posts: undefined }), false)
    assert.equal(isCard("<html>"), false)
    assert.equal(isCard(null), false)
  })
})

describe("the sentences", () => {
  it("greets by the given name", () => {
    assert.equal(headline(FIXTURE), "Hey there, I’m Ada.")
  })

  it("puts the marked words at the odd indexes", () => {
    assert.deepEqual(
      tagline(FIXTURE).filter((_, index) => index % 2),
      ["useful", "fast", "friendly"],
    )
    assert.equal(tagline({ ...FIXTURE, tagline: undefined }).join(""), tagline(FIXTURE).join(""))
  })

  it("names the two current organizations and the city", () => {
    const parts = intro(FIXTURE)
    assert.deepEqual(
      parts.filter((_, index) => index % 2),
      ["Example Works", "Example School", "Lisbon, Portugal"],
    )
    assert.equal(
      parts.join(""),
      "I lead engineering at Example Works and teach new developers at Example School. " +
        "I also make developer tools and small apps, for humans and lately for AI agents too. " +
        "I live in Lisbon, Portugal.",
    )
  })

  it("has an intro with no role and no city", () => {
    const parts = intro({ ...FIXTURE, experience: [], location: undefined })
    assert.equal(
      parts.join(""),
      "I also make developer tools and small apps, for humans and lately for AI agents too.",
    )
  })

  it("does not name apps when the card has no project", () => {
    const parts = intro({ ...FIXTURE, experience: [], location: undefined, projects: [] })
    assert.equal(
      parts.join(""),
      "I also make developer tools for humans, and lately for AI agents too.",
    )
  })

  it("wraps between words and keeps the strong pieces", () => {
    const parts = intro(FIXTURE)
    for (const width of [20, 33, 53, 80]) {
      const lines = wrapParts(parts, width)
      for (const line of lines) {
        const text = line.map((piece) => piece.text).join("")
        assert.ok(text.length <= width, `"${text}" is wider than ${width}`)
        assert.equal(text, text.trim())
      }
      const text = lines.map((line) => line.map((piece) => piece.text).join("")).join(" ")
      assert.equal(text, parts.join(""))
      const strong = lines.flatMap((line) => line.filter((piece) => piece.strong))
      assert.equal(
        strong.map((piece) => piece.text).join(" "),
        "Example Works Example School Lisbon, Portugal",
      )
    }
  })

  it("tells the time in the card's time zone", () => {
    const night = cityTime(FIXTURE, new Date("2026-01-01T02:30:00Z"))
    assert.deepEqual(night, { clock: "02:30", city: "Lisbon", day: false, asleep: true })
    const noon = cityTime(FIXTURE, new Date("2026-01-01T12:05:00Z"))
    assert.deepEqual(noon, { clock: "12:05", city: "Lisbon", day: true, asleep: false })
    assert.equal(cityTime({ ...FIXTURE, timeZone: undefined }), undefined)
    assert.equal(cityTime({ ...FIXTURE, timeZone: "Not/AZone" }), undefined)
  })
})

describe("the lists", () => {
  const list = views(FIXTURE)

  it("has four views, and the home view starts with the shortcuts", () => {
    assert.deepEqual(
      list.map((view) => view.key),
      ["home", "work", "blog", "links"],
    )
    assert.deepEqual(
      list[0]!.sections[0]!.rows.map((row) => row.title),
      ["Resume", "Book a call", "Send an email", "Open the website"],
    )
  })

  it("puts the lists of the home view in the order of the site's home page", () => {
    assert.deepEqual(
      list[0]!.sections.map((section) => section.heading),
      [undefined, "Apps and things", "Experience", "Talks", "Latest posts"],
    )
    assert.deepEqual(
      list[1]!.sections.map((section) => section.heading),
      ["Experience", "Projects", "Talks", undefined],
    )
  })

  it("shows a project with its short line and a light for its status", () => {
    const [row] = list[0]!.sections[1]!.rows
    assert.equal(row?.detail, "A widget for small jobs.")
    assert.equal(row?.light, "on")
    assert.match(row?.keywords ?? "", /Beta/)
    const lights = (["waitlist", "archived", "active", undefined, "unknown"] as const).map(
      (status) =>
        views({ ...FIXTURE, projects: [{ ...FIXTURE.projects[0]!, status }] })[0]!.sections[1]!
          .rows[0]!.light,
    )
    assert.deepEqual(lights, ["ring", "off", "on", undefined, undefined])
  })

  it("gives every row an address", () => {
    for (const row of allRows(list)) assert.match(row.url, /^(https:\/\/|mailto:)/)
  })

  it("lists only featured profiles", () => {
    const profiles = list[3]!.sections.find((section) => section.heading === "Profiles")
    assert.deepEqual(
      profiles?.rows.map((row) => row.title),
      ["GitHub"],
    )
  })

  it("lists each row once for search, and keeps two roles at one organization", () => {
    const rows = allRows(list)
    const ids = rows.map((row) => [row.url, row.title, row.detail].join("|"))
    assert.equal(new Set(ids).size, ids.length)
    assert.deepEqual(
      rows.filter((row) => row.title === "Example Works").map((row) => row.detail),
      ["Engineering Manager, Engineer", "Founding Engineer"],
    )
  })

  it("knows a page of the site from another site", () => {
    assert.equal(isOnSite(FIXTURE, "https://example.com/resume"), true)
    assert.equal(isOnSite(FIXTURE, "https://github.com/example"), false)
  })
})

describe("the plain card", () => {
  it("has the name, the links and the posts, with no color codes", () => {
    const text = plainCard(FIXTURE)
    assert.match(text, /^Ada Example\n/)
    assert.match(text, /Email {4}ada@example\.com/)
    assert.match(
      text,
      /Apps and things\n {2}Widget \(Beta\) {2}https:\/\/github\.com\/example\/widget/,
    )
    assert.match(text, /\n {4}A small widget\. It does one job/)
    assert.match(text, /2026-01-02 {2}Hello, terminal/)
    assert.match(text, /https:\/\/example\.com\/llms\.txt/)
    assert.doesNotMatch(text, /\x1b/)
  })

  it("is short after the live screen", () => {
    const text = plainCard(FIXTURE, { short: true })
    assert.match(text, /GitHub {3}https:\/\/github\.com\/example\n$/)
    assert.doesNotMatch(text, /Latest posts/)
  })

  it("colors the labels when asked", () => {
    assert.match(plainCard(FIXTURE, { color: true }), /\x1b\[1mAda Example\x1b\[0m/)
  })
})

describe("the wave", () => {
  it("is a grid of braille and spaces", () => {
    for (const shape of ["hero", "band"] as const) {
      const lines = waveRows(shape, 40, 3, 24)
      assert.equal(lines.length, 3)
      for (const line of lines) assert.match(line, /^[ ⠁-⣿]{40}$/u)
    }
  })

  it("moves with time and stands still without it", () => {
    assert.deepEqual(waveRows("hero", 60, 5, 24), waveRows("hero", 60, 5, 24))
    assert.notDeepEqual(waveRows("hero", 60, 5, 24), waveRows("hero", 60, 5, 25))
  })

  it("hangs from the top right corner", () => {
    const dots = (text: string) => [...text].filter((letter) => letter !== " ").length
    const lines = waveRows("hero", 80, 6, 24)
    const left = lines.map((line) => line.slice(0, 20)).join("")
    const right = lines.map((line) => line.slice(60)).join("")
    assert.equal(dots(left), 0)
    assert.ok(dots(right) > 20)
    assert.ok(dots(lines[0]!) > dots(lines[5]!))
  })
})

describe("the mascot", () => {
  it("draws every mood in every size", () => {
    for (const size of FACE_SIZES) {
      for (const mood of MOODS) {
        const lines = faceRows(mood, size, { bg: THEMES.dark.bg, depth: 24 })
        assert.equal(lines.length, size / 2)
        for (const line of lines) assert.equal(bare(line), "▀".repeat(size))
      }
    }
  })

  it("draws a different picture for each mood and each step of a move", () => {
    const draw = (mood: (typeof MOODS)[number], shift?: readonly [number, number]) =>
      faceRows(mood, 20, { bg: THEMES.dark.bg, depth: 24, shift }).join("\n")
    assert.equal(new Set(MOODS.map((mood) => draw(mood))).size, MOODS.length)
    assert.notEqual(draw("smile"), draw("smile", [0, -1]))
  })

  it("uses only the 256 colors when the terminal has no more", () => {
    const lines = faceRows("smile", 20, { bg: THEMES.light.bg, depth: 8 })
    assert.doesNotMatch(lines.join(""), /\x1b\[[34]8;2;/)
    assert.equal(to256([0, 0, 0]), 16)
    assert.equal(to256([255, 255, 255]), 231)
    assert.equal(to256([255, 0, 0]), 196)
    assert.equal(to256([128, 128, 128]), 244)
  })

  it("ends every move at rest", () => {
    for (const mood of MOODS) assert.deepEqual(moveOf(mood).at(-1), [0, 0])
  })

  it("has a small face of five letters for every mood", () => {
    for (const mood of MOODS) assert.equal([...SMALL_FACES[mood]].length, 5)
  })
})

describe("the terminal", () => {
  it("reads the names for reduced motion", () => {
    assert.equal(reducedMotion({}), false)
    assert.equal(reducedMotion({ NO_MOTION: "1" }), true)
    assert.equal(reducedMotion({ REDUCE_MOTION: "true" }), true)
    assert.equal(reducedMotion({ NO_MOTION: "0" }), false)
  })

  it("mixes the row tint as the site does", () => {
    assert.equal(mix("#000000", "#ffffff", 0.5), "#808080")
    assert.equal(THEMES.dark.tint, mix(THEMES.dark.bg, THEMES.dark.accent, 0.09))
  })
})
