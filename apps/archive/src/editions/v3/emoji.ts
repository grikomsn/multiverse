/** `:shortname:` in v3 copy → the EmojiOne 4.5 class the original rendered (`e1a-<name>`). */
const escape = (value: string) => value.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`)

export const emojify = (text: string | null | undefined) =>
  (text ?? "")
    .split(/(:[a-z0-9_]+:)/)
    .map((part, index) => (index % 2 ? `<i class="e1a-${part.slice(1, -1)}"></i>` : escape(part)))
    .join("")
