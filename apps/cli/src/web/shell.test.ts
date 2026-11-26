import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { hexOf } from "../screen"
import { parseArgs } from "./node"
import { argsOf, typeInto } from "./shell"

describe("the page's prompt", () => {
  it("runs the card for an empty line", () => {
    assert.deepEqual(argsOf(""), [])
    assert.deepEqual(argsOf("   "), [])
  })

  it("runs the command with its options, with or without npx", () => {
    assert.deepEqual(argsOf("npx grikomsn"), [])
    assert.deepEqual(argsOf("npx grikomsn --theme light"), ["--theme", "light"])
    assert.deepEqual(argsOf("grikomsn --plain"), ["--plain"])
  })

  it("does not run another command", () => {
    assert.equal(argsOf("ls"), undefined)
    assert.equal(argsOf("npx cowsay"), undefined)
  })

  it("takes letters, Backspace and Enter", () => {
    assert.deepEqual(typeInto("np", "x"), { line: "npx", done: false })
    assert.deepEqual(typeInto("npxx", "\x7f"), { line: "npx", done: false })
    assert.deepEqual(typeInto("npx", "\r"), { line: "npx", done: true })
    assert.deepEqual(typeInto("", "ls\rmore"), { line: "ls", done: true })
  })

  it("drops arrow keys, and starts again on Ctrl C", () => {
    assert.deepEqual(typeInto("a", "\x1b[A\x1b[Db"), { line: "ab", done: false })
    assert.deepEqual(typeInto("abc", "\x03"), { line: "", done: false })
  })
})

describe("parseArgs in a browser", () => {
  const options = {
    plain: { type: "boolean" },
    theme: { type: "string" },
    help: { type: "boolean", short: "h" },
  } as const

  it("reads long and short options", () => {
    assert.deepEqual(parseArgs({ args: ["--plain", "-h"], options }).values, {
      plain: true,
      help: true,
    })
  })

  it("reads a value after a space or an equals sign", () => {
    assert.deepEqual(parseArgs({ args: ["--theme", "light"], options }).values, { theme: "light" })
    assert.deepEqual(parseArgs({ args: ["--theme=dark"], options }).values, { theme: "dark" })
  })

  it("refuses what Node refuses", () => {
    assert.throws(() => parseArgs({ args: ["--nope"], options }), /Unknown option '--nope'/)
    assert.throws(() => parseArgs({ args: ["word"], options }), /Unexpected argument 'word'/)
    assert.throws(() => parseArgs({ args: ["--theme"], options }), /argument missing/)
  })
})

describe("the ground for the page", () => {
  it("is hex for a ground with all the colors, and nothing for another", () => {
    assert.equal(hexOf("48;2;23;24;28"), "#17181c")
    assert.equal(hexOf("48;5;234"), undefined)
    assert.equal(hexOf(""), undefined)
  })
})
