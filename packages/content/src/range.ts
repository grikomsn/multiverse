/**
 * Answers a request for a part of a file: `Range: bytes=0-99` gets those bytes and status 206.
 *
 * Cloudflare's static assets answer such a request with the whole file. Signal reads the
 * picture of a link in parts and shows none without a 206, so the Workers pass the social
 * cards through this (see `docs/social-cards.md`). It is for small files: it reads the whole
 * file to cut a part from it.
 *
 * It takes the request and the whole answer (status 200). Any other answer comes back as it is.
 */
export async function withRange(request: Request, response: Response): Promise<Response> {
  // A packed body has other bytes than the file: leave it alone.
  if (response.status !== 200 || response.headers.has("Content-Encoding")) return response
  const headers = new Headers(response.headers)
  headers.set("Accept-Ranges", "bytes")
  const whole = () => new Response(response.body, { status: 200, headers })

  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get("Range")?.trim() ?? "")
  if (request.method !== "GET" || !range || (range[1] === "" && range[2] === "")) return whole()
  // `If-Range` asks for the part only if the file is still the one the client has.
  const known = request.headers.get("If-Range")
  if (known && known !== response.headers.get("ETag")) return whole()

  const bytes = await response.arrayBuffer()
  const size = bytes.byteLength
  // "-500" is the last 500 bytes. "500-" is from byte 500 to the end.
  const start = range[1] === "" ? Math.max(0, size - Number(range[2])) : Number(range[1])
  const end = range[1] === "" || range[2] === "" ? size - 1 : Math.min(Number(range[2]), size - 1)
  if (start >= size || start > end) {
    headers.set("Content-Range", `bytes */${size}`)
    headers.delete("Content-Length")
    return new Response(null, { status: 416, headers })
  }
  headers.set("Content-Range", `bytes ${start}-${end}/${size}`)
  headers.set("Content-Length", String(end - start + 1))
  return new Response(bytes.slice(start, end + 1), { status: 206, headers })
}
