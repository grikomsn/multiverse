import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { withRange } from "./range"

const FILE = "0123456789"
const file = (headers: Record<string, string> = {}) =>
  new Response(FILE, { headers: { "Content-Type": "image/png", ETag: '"v1"', ...headers } })
const ask = (range?: string, more: Record<string, string> = {}, method = "GET") =>
  new Request("https://example.com/og/index.png", {
    method,
    headers: { ...(range ? { Range: range } : {}), ...more },
  })

describe("a request for a part of a file", () => {
  it("gets the part, with status 206 and its place in the file", async () => {
    const answer = await withRange(ask("bytes=2-5"), file())
    assert.equal(answer.status, 206)
    assert.equal(await answer.text(), "2345")
    assert.equal(answer.headers.get("Content-Range"), "bytes 2-5/10")
    assert.equal(answer.headers.get("Content-Length"), "4")
    assert.equal(answer.headers.get("Content-Type"), "image/png")
  })

  it("reads an open end, a last part, and an end past the file", async () => {
    assert.equal(await (await withRange(ask("bytes=7-"), file())).text(), "789")
    assert.equal(await (await withRange(ask("bytes=-3"), file())).text(), "789")
    const past = await withRange(ask("bytes=8-99"), file())
    assert.equal(await past.text(), "89")
    assert.equal(past.headers.get("Content-Range"), "bytes 8-9/10")
  })

  it("gets 416 for a part that starts after the end", async () => {
    const answer = await withRange(ask("bytes=10-12"), file())
    assert.equal(answer.status, 416)
    assert.equal(answer.headers.get("Content-Range"), "bytes */10")
  })

  it("gets the whole file with no range, a range it cannot read, or HEAD", async () => {
    for (const request of [
      ask(),
      ask("bytes=0-1,4-5"),
      ask("lines=1-2"),
      ask("bytes=0-3", {}, "HEAD"),
    ]) {
      const answer = await withRange(request, file())
      assert.equal(answer.status, 200)
      assert.equal(answer.headers.get("Accept-Ranges"), "bytes")
    }
    assert.equal(await (await withRange(ask(), file())).text(), FILE)
  })

  it("gets the whole file when the client's copy is of another version", async () => {
    assert.equal((await withRange(ask("bytes=0-3", { "If-Range": '"v0"' }), file())).status, 200)
    assert.equal((await withRange(ask("bytes=0-3", { "If-Range": '"v1"' }), file())).status, 206)
  })

  it("leaves a packed file and an answer that is not 200 as they are", async () => {
    const packed = file({ "Content-Encoding": "gzip" })
    assert.equal(await withRange(ask("bytes=0-3"), packed), packed)
    const missing = new Response("Not found", { status: 404 })
    assert.equal(await withRange(ask("bytes=0-3"), missing), missing)
  })
})
