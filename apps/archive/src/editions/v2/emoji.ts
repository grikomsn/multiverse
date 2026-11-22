/** `:shortname:` in v2/v3 copy → the EmojiOne 4 class the original rendered (`e1a-<name>`). */
const SHORTNAME = /:([a-z0-9_]+):/g

const escape = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

/**
 * HTML for copy with inline emoji. `extra` renders shortnames that were not EmojiOne
 * (v2's Font Awesome terminal glyph).
 */
export function emojify(text: string | null | undefined, extra: Record<string, string> = {}) {
  if (!text) return ""
  let html = ""
  let last = 0
  for (const match of text.matchAll(SHORTNAME)) {
    const name = match[1] ?? ""
    html += escape(text.slice(last, match.index))
    html += extra[name] ?? `<i class="e1a-${name}"></i>`
    last = match.index + match[0].length
  }
  return html + escape(text.slice(last))
}
