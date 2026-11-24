import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { copyText, run } from "./open"

describe("copy", () => {
  it("does not stop when a program ends before it reads its input", async () => {
    // As a clipboard program does on a machine with no display. The write then breaks the
    // pipe, and with no listener that error stopped the whole card.
    assert.equal(await run("sh", ["-c", "exit 3"], "x".repeat(4_000_000)), false)
    assert.equal(await run("sh", ["-c", "cat > /dev/null"], "x".repeat(4_000_000)), true)
  })

  it("gives the text to the terminal, and does not stop when no clipboard program works", async () => {
    // A machine with no display: every clipboard program ends at once, or is not there. The
    // write into such a program breaks the pipe, and that error once stopped the whole card.
    const env = { ...process.env }
    delete process.env.WAYLAND_DISPLAY
    delete process.env.DISPLAY
    process.env.PATH = "/nonexistent"
    let written = ""
    try {
      const result = await copyText("hello", (code) => (written += code))
      assert.equal(result, "asked")
    } finally {
      process.env = env
    }
    assert.equal(written, `\x1b]52;c;${Buffer.from("hello").toString("base64")}\x07`)
  })
})
