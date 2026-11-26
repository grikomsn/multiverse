/**
 * Node's streams and buffers in a browser, as far as the card and Ink use them. The bundler
 * has complete ones, but they are a third of the page's own code. These are a hundred lines.
 *
 * `node.ts` gives them in place of `node:stream`, `node:buffer` and `node:string_decoder`.
 */
import { EventEmitter } from "node:events"

/** Bytes that read as text: what the card asks of a Buffer. */
export class Bytes extends Uint8Array {
  override toString(encoding = "utf8") {
    if (encoding === "utf8" || encoding === "utf-8") return new TextDecoder().decode(this)
    // One letter for each byte. The card reads only short answers of the terminal this way.
    let text = ""
    for (const byte of this) text += String.fromCharCode(byte)
    return encoding === "base64" ? btoa(text) : text
  }
}

export const Buffer = {
  from(data: string | ArrayLike<number>, encoding = "utf8"): Bytes {
    if (typeof data !== "string") return Bytes.from(data)
    if (encoding === "utf8" || encoding === "utf-8") {
      const bytes = new TextEncoder().encode(data)
      return new Bytes(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    }
    return Bytes.from(encoding === "base64" ? atob(data) : data, (letter) => letter.charCodeAt(0))
  },
  isBuffer: (value: unknown): value is Bytes => value instanceof Bytes,
}

/** Bytes to text, with a letter that comes in two pieces kept until its end is there. */
export class StringDecoder {
  private readonly decoder = new TextDecoder()

  write(chunk: Uint8Array) {
    return this.decoder.decode(chunk, { stream: true })
  }

  end() {
    return this.decoder.decode()
  }
}

/** Ink asks whether its output is one of these. */
export class Stream extends EventEmitter {}

/**
 * A stream that gives what it gets. It has the two ways of Node's streams to read:
 *
 * - "data" events, after `resume()` and until `pause()`. The card reads the keyboard so.
 * - A "readable" event and then `read()`, for a stream that nobody resumed. Ink reads so.
 *
 * What comes while nobody reads, waits.
 */
export class PassThrough extends Stream {
  private waiting: Bytes[] = []
  private flowing = false
  private encoding: string | undefined

  setEncoding(encoding: string) {
    this.encoding = encoding
    return this
  }

  write(chunk: string | Uint8Array) {
    this.waiting.push(typeof chunk === "string" ? Buffer.from(chunk) : Bytes.from(chunk))
    if (this.flowing) this.flow()
    else queueMicrotask(() => this.waiting.length > 0 && this.emit("readable"))
    return true
  }

  read() {
    const next = this.waiting.shift()
    if (!next) return null
    return this.encoding ? next.toString(this.encoding) : next
  }

  pause() {
    this.flowing = false
    return this
  }

  resume() {
    this.flowing = true
    this.flow()
    return this
  }

  end() {
    this.emit("end")
    return this
  }

  private flow() {
    // A listener may pause the stream, or stop to listen: then the rest waits.
    while (this.flowing && this.listenerCount("data") > 0) {
      const next = this.read()
      if (next === null) return
      this.emit("data", next)
    }
  }
}
