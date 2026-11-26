import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { Buffer, type Bytes, PassThrough, StringDecoder } from "./streams"

describe("bytes in a browser", () => {
  it("reads text as Node's Buffer does", () => {
    assert.equal(Buffer.from("né ▀").toString("utf8"), "né ▀")
    assert.equal(Buffer.from("\x1b]11;rgb:17/18/1c").toString("latin1"), "\x1b]11;rgb:17/18/1c")
    assert.equal(Buffer.from("hello").toString("base64"), "aGVsbG8=")
    assert.equal(Buffer.from("aGVsbG8=", "base64").toString(), "hello")
    assert.ok(Buffer.isBuffer(Buffer.from([1, 2])))
  })

  it("keeps a letter that comes in two pieces", () => {
    const decoder = new StringDecoder()
    const bytes = Buffer.from("▀")
    assert.equal(decoder.write(bytes.subarray(0, 1)), "")
    assert.equal(decoder.write(bytes.subarray(1)), "▀")
  })
})

describe("a stream in a browser", () => {
  it("gives data after resume, and keeps it while paused", () => {
    const stream = new PassThrough()
    const got: string[] = []
    stream.write("early")
    stream.on("data", (chunk: Bytes) => got.push(chunk.toString()))
    assert.deepEqual(got, [])
    stream.resume()
    stream.write("now")
    stream.pause()
    stream.write("late")
    assert.deepEqual(got, ["early", "now"])
    stream.resume()
    assert.deepEqual(got, ["early", "now", "late"])
  })

  it("keeps the rest when a listener stops in the middle", () => {
    const stream = new PassThrough()
    const got: string[] = []
    const once = (chunk: Bytes) => {
      got.push(chunk.toString())
      stream.off("data", once)
    }
    stream.on("data", once)
    stream.write("a")
    stream.write("b")
    stream.resume()
    assert.deepEqual(got, ["a"])
    assert.equal(String(stream.read()), "b")
  })

  it("says readable, and reads text when it has an encoding", async () => {
    const stream = new PassThrough()
    stream.setEncoding("utf8")
    const readable = new Promise((resolve) => stream.once("readable", resolve))
    stream.write("q")
    await readable
    assert.equal(stream.read(), "q")
    assert.equal(stream.read(), null)
  })
})
