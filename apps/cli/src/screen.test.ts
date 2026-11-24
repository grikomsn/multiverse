import assert from "node:assert/strict"
import { PassThrough } from "node:stream"
import { describe, it } from "node:test"

import { fitScroll, lineOfRow, nearestRow, toLines, windowOf } from "./list"
import { readReports, tapInput, type TerminalEvent } from "./pointer"
import { scanLine, Screen, type Terminal } from "./screen"

/** A terminal that keeps what is written to it: the letters of each cell, and all the text. */
function fakeTerminal(columns: number, rows: number) {
  const cells = Array.from({ length: rows }, () => new Array<string>(columns).fill(" "))
  let row = 0
  let column = 0
  const terminal = {
    columns,
    rows,
    written: "",
    writes: 0,
    write(text: string) {
      terminal.written += text
      terminal.writes++
      for (const part of text.matchAll(/\x1b\[([?\d;]*)([A-Za-z])|([\s\S])/gu)) {
        if (part[2] === "H") {
          const [toRow, toColumn] = part[1]!.split(";").map(Number)
          row = toRow! - 1
          column = toColumn! - 1
        } else if (part[2] === "K") cells[row]!.fill(" ", column)
        else if (part[2] === "J") cells.forEach((line) => line.fill(" "))
        else if (part[3] !== undefined && column < columns) cells[row]![column++] = part[3]
      }
      return true
    },
    on() {},
    off() {},
    text: () => cells.map((line) => line.join("")),
  }
  return terminal satisfies Terminal
}

const isDot = (letter: string) => letter >= "⠁" && letter <= "⣿"
const dotsIn = (line: string) => [...line].filter(isDot).length

/** A frame as Ink gives it: every line as wide as the screen, on the page's ground. */
const frame = (lines: string[], columns: number, rows: number) =>
  Array.from(
    { length: rows },
    (_, row) => `\x1b[48;5;234m${(lines[row] ?? "").padEnd(columns)}\x1b[49m`,
  ).join("\n")

function openScreen(columns = 60, rows = 10) {
  const terminal = fakeTerminal(columns, rows)
  const screen = new Screen({ terminal, depth: 8, fps: 12, motion: false })
  screen.start({ pointer: false })
  return { terminal, screen }
}

describe("the screen", () => {
  it("reads the letters and the grounds of a line", () => {
    const scan = scanLine("\x1b[48;2;1;2;3m ab\x1b[38;5;9;48;5;7m c\x1b[0m 界", 10)
    assert.deepEqual([...scan.ink], [0, 1, 1, 0, 1, 0, 1, 1, 0, 0])
    assert.deepEqual(scan.grounds.slice(0, 8), [
      ...Array<string>(3).fill("48;2;1;2;3"),
      "48;5;7",
      "48;5;7",
      "",
      "",
      "",
    ])
    assert.equal(scan.width, 8)
  })

  it("draws Ink's frame, and the wave only in the empty cells away from letters", () => {
    const { terminal, screen } = openScreen()
    screen.write(frame(["", "                                              Home  Work"], 60, 10))
    screen.setWave({ hero: 3, band: 2, color: "#eab308" })
    const text = terminal.text()
    assert.match(text[1]!, /Home {2}Work/)
    assert.ok(dotsIn(text[0]!) > 5, "the hero wave is in the first row")
    assert.ok(dotsIn(text[9]!) > 20, "the band is in the last row")
    assert.equal(dotsIn(text.slice(3, 8).join("")), 0, "no dots between the two")
    // Two cells on each side of the words stay clear, and the gap between them too.
    assert.match(text[1]!, / {2}Home {2}Work {2}/)
    screen.close()
  })

  it("writes only the lines of a frame that changed", () => {
    const { terminal, screen } = openScreen()
    const lines = ["one", "two", "three"]
    screen.write(frame(lines, 60, 10))
    terminal.written = ""
    screen.write(frame(["one", "TWO", "three"], 60, 10))
    assert.match(terminal.written, /\x1b\[2;1H/)
    assert.doesNotMatch(terminal.written, /\x1b\[1;1H|\x1b\[3;1H/)
    assert.equal(terminal.text()[1]!.trim(), "TWO")
    terminal.written = ""
    screen.write(frame(["one", "TWO", "three"], 60, 10))
    assert.doesNotMatch(terminal.written, /\x1b\[\d+;\d+H/)
    screen.close()
  })

  it("takes the dots away when the wave gets smaller, and from under new text", () => {
    const { terminal, screen } = openScreen()
    screen.write(frame([], 60, 10))
    screen.setWave({ hero: 4, band: 0, color: "#eab308" })
    assert.ok(dotsIn(terminal.text().slice(0, 4).join("")) > 20)
    // Text comes where dots were: the line is written again, and no dot is in the text.
    screen.write(frame(["", "", "x".repeat(60)], 60, 10))
    assert.equal(terminal.text()[2], "x".repeat(60))
    // The wave gets smaller, and Ink's frame does not change: the screen must erase the dots.
    screen.setWave({ hero: 1, band: 0, color: "#eab308" })
    const text = terminal.text()
    assert.ok(dotsIn(text[0]!) > 5)
    assert.equal(dotsIn(text.slice(1).join("")), 0)
    screen.close()
  })

  it("leaves a cell with a ground of its own alone", () => {
    const { terminal, screen } = openScreen()
    const tinted = `\x1b[48;5;234m${" ".repeat(30)}\x1b[48;5;58m${" ".repeat(30)}\x1b[49m`
    screen.write([tinted, ...frame([], 60, 9).split("\n")].join("\n"))
    screen.setWave({ hero: 2, band: 0, color: "#eab308" })
    assert.equal(dotsIn(terminal.text()[0]!.slice(30)), 0)
    assert.ok(dotsIn(terminal.text()[1]!.slice(30)) > 5)
    screen.close()
  })

  it("writes every dot again in a new color", () => {
    const { terminal, screen } = openScreen()
    screen.write(frame([], 60, 10))
    screen.setWave({ hero: 3, band: 0, color: "#eab308" })
    const dots = dotsIn(terminal.text().join(""))
    terminal.written = ""
    screen.setWave({ hero: 3, band: 0, color: "#ffffff" })
    assert.equal(dotsIn(terminal.written), dots)
    assert.match(terminal.written, /38;5;231/)
    screen.close()
  })

  it("passes control codes on, and gives the terminal back when it closes", () => {
    const { terminal, screen } = openScreen()
    assert.match(terminal.written, /\x1b\[\?1049h/)
    terminal.written = ""
    screen.write("\x1b[?25l")
    assert.equal(terminal.written, "\x1b[?25l")
    screen.setPointer(true)
    assert.match(terminal.written, /\x1b\[\?1003h/)
    terminal.written = ""
    screen.close()
    assert.match(terminal.written, /\x1b\[\?1003l.*\x1b\[\?1049l/)
    terminal.written = ""
    screen.close()
    screen.write(frame(["late"], 60, 10))
    assert.equal(terminal.written, "")
  })

  it("calls back after a write, open or closed: Ink waits for that before it ends", async () => {
    const { screen } = openScreen()
    await new Promise<void>((resolve) => screen.write("", resolve))
    screen.close()
    await new Promise<void>((resolve) => screen.write("", "utf8", resolve))
  })
})

describe("the pointer", () => {
  it("takes the reports out of the keyboard's text", () => {
    const { events, rest, open } = readReports("a\x1b[<35;10;5Mb\x1b[<0;3;2M\x1b[<0;3;2m\x1b[Ac")
    assert.equal(rest, "ab\x1b[Ac")
    assert.equal(open, "")
    assert.deepEqual(events, [
      { kind: "move", x: 9, y: 4 },
      { kind: "down", x: 2, y: 1 },
      { kind: "up", x: 2, y: 1 },
    ])
  })

  it("reads the wheel, the focus and a report in two pieces", () => {
    assert.deepEqual(readReports("\x1b[<64;1;1M\x1b[<65;1;1M\x1b[I\x1b[O").events, [
      { kind: "wheel", x: 0, y: 0, by: -1 },
      { kind: "wheel", x: 0, y: 0, by: 1 },
      { kind: "focus", on: true },
      { kind: "focus", on: false },
    ])
    const first = readReports("q\x1b[<0;12")
    assert.deepEqual([first.rest, first.open, first.events.length], ["q", "\x1b[<0;12", 0])
    assert.deepEqual(readReports(first.open + ";7M").events, [{ kind: "down", x: 11, y: 6 }])
  })

  it("gives Ink the keys and the card the reports, also from a stream that was paused", async () => {
    // The terminal's input, after the question about its ground: paused.
    const source = Object.assign(new PassThrough(), { setRawMode() {}, ref() {}, unref() {} })
    source.pause()
    const events: TerminalEvent[] = []
    let any = 0
    const input = tapInput(source as unknown as NodeJS.ReadStream, () => any++)
    input.subscribe((event) => events.push(event))
    source.write("j\x1b[<0;5;3M")
    const typed = await new Promise<string>((resolve) =>
      input.stream.once("data", (chunk: Buffer) => resolve(chunk.toString())),
    )
    assert.equal(typed, "j")
    assert.deepEqual(events, [{ kind: "down", x: 4, y: 2 }])
    assert.equal(any, 1)
    input.close()
  })

  it("leaves the keys alone: Escape, an arrow, and the other buttons", () => {
    assert.equal(readReports("\x1b").rest, "\x1b")
    assert.equal(readReports("\x1b[B").rest, "\x1b[B")
    assert.deepEqual(readReports("\x1b[<2;1;1M").events, [])
  })
})

describe("a long list", () => {
  const row = (title: string) => ({ title, url: `https://example.com/${title}`, group: "Rows" })
  const lines = toLines([
    { rows: ["a", "b"].map(row) },
    { heading: "More", rows: ["c", "d", "e", "f", "g", "h"].map(row) },
  ])
  // a b gap More c d e f g h: ten lines, eight rows.

  it("shows the whole list when it fits", () => {
    assert.equal(fitScroll(lines, 0, lineOfRow(lines, 7), 20), 0)
    assert.equal(
      windowOf(lines, 0, 20).some((line) => line.kind === "more"),
      false,
    )
  })

  it("moves only when the cursor would leave the screen, and never puts it under “more”", () => {
    const height = 5
    let start = 0
    for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0]) {
      const before = start
      start = fitScroll(lines, start, lineOfRow(lines, index), height)
      const shown = windowOf(lines, start, height)
      assert.ok(
        shown.some((line) => line.kind === "row" && line.index === index),
        `row ${index} is on the screen`,
      )
      // The same row again does not move the list: the pointer can stay on a row.
      assert.equal(fitScroll(lines, start, lineOfRow(lines, index), height), start)
      assert.ok(Math.abs(start - before) <= 3)
    }
    assert.equal(start, 0)
  })

  it("shows the heading over the first row of a section", () => {
    const start = fitScroll(lines, 5, lineOfRow(lines, 2), 4)
    assert.deepEqual(
      windowOf(lines, start, 4).map((line) => line.kind),
      ["more", "heading", "row", "more"],
    )
  })

  it("shows no heading at the bottom with none of its rows under it", () => {
    // a b gap More c …: in five lines, "More" would sit over "↓ more".
    assert.deepEqual(
      windowOf(lines, 0, 5).map((line) => line.kind),
      ["row", "row", "more"],
    )
  })

  it("finds the row nearest to a line of the screen", () => {
    assert.equal(nearestRow(lines, 3, 5, 3), 2)
    assert.equal(nearestRow(lines, 3, 5, 99), 4)
    assert.equal(nearestRow(toLines([]), 0, 5, 0), undefined)
  })
})
