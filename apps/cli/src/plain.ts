/**
 * The card as text, with no motion: for a pipe, a script, an AI agent, a small terminal, and
 * the lines that stay on the screen after the card closes.
 */
import type { Card } from "@multiverse/content/card"
import { isoDate } from "@multiverse/content/format"

import { statusOf, tagline } from "./content"

/** The site's amber, as one of the 256 colors: close enough on any terminal with color. */
const AMBER = "\x1b[38;5;178m"
const BOLD = "\x1b[1m"
const DIM = "\x1b[2m"
const RESET = "\x1b[0m"

interface PlainOptions {
  color?: boolean
  /** Only the name, the headline and the links: what stays after the card closes. */
  short?: boolean
}

export function plainCard(card: Card, { color = false, short = false }: PlainOptions = {}) {
  const paint = (code: string, text: string) => (color ? code + text + RESET : text)
  const links: [label: string, value: string][] = [
    ["Website", card.website],
    ...(card.email ? [["Email", card.email] as [string, string]] : []),
    ...(card.scheduleUrl ? [["Call", card.scheduleUrl] as [string, string]] : []),
    ["Resume", `${card.website}/resume`],
    ...card.profiles
      .filter((profile) => profile.featured)
      .map((profile): [string, string] => [profile.label, profile.url]),
  ]
  const width = Math.max(...links.map(([label]) => label.length))
  const table = links.map(([label, value]) => `  ${paint(AMBER, label.padEnd(width))}  ${value}`)

  const head = [
    paint(BOLD, card.name),
    [card.headline, card.location].filter(Boolean).join(" · "),
    "",
    tagline(card).join(""),
    "",
    ...table,
  ]
  if (short) return head.join("\n") + "\n"

  const current = card.experience.filter((stop) => !stop.end)
  const blocks = [
    head,
    current.length > 0 && [
      paint(BOLD, "Now"),
      ...current.map((stop) => `  ${stop.roles.join(", ")} at ${stop.organization}`),
    ],
    card.projects.length > 0 && [
      paint(BOLD, "Apps and things"),
      ...card.projects.flatMap((project) => {
        const status = statusOf(project)
        const about = project.summary ?? project.tagline
        return [
          `  ${project.name}${status ? ` (${status.title})` : ""}${project.url ? paint(DIM, `  ${project.url}`) : ""}`,
          ...(about ? [`    ${about}`] : []),
        ]
      }),
    ],
    card.posts.length > 0 && [
      paint(BOLD, "Latest posts"),
      ...card.posts.map(
        (post) => `  ${paint(DIM, isoDate(post.date))}  ${post.title}\n              ${post.url}`,
      ),
    ],
    [paint(BOLD, "For AI tools"), `  ${card.website}/llms.txt`, `  ${card.website}/mcp`],
  ]
  return (
    blocks
      .filter((block) => block !== false)
      .map((block) => block.join("\n"))
      .join("\n\n") + "\n"
  )
}
