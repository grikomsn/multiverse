/**
 * Fails the build if a page states a fact from a past version: an old host, a dead profile or
 * address, a period email. Every version shows today's content, so none of these may appear
 * outside post bodies (posts keep their wording, so the list avoids words posts use).
 *
 *   bun scripts/check-period-facts.ts   (runs after `astro build`)
 */
import { readdir, readFile } from "node:fs/promises"
import { join } from "node:path"

const FORBIDDEN = [
  "Hosted on Netlify",
  "Hosted on Vercel",
  "zeit.co/now",
  "Powered by Ghost",
  "griko.dev",
  "griko@pm.me",
  "poly.work",
  "polywork.com",
  "showwcase.com",
  "cohost.org",
  "twitter.com/griko_nibras",
  "@griko_nibras",
  "discord.gg",
  "nbrs.fyi",
  "resume.io",
  "nbr.st/schedule",
]

const dist = join(import.meta.dirname, "../dist")
const files = (await readdir(dist, { recursive: true })).filter((file) => file.endsWith(".html"))
const problems: string[] = []
for (const file of files) {
  const html = await readFile(join(dist, file), "utf8")
  for (const text of FORBIDDEN) if (html.includes(text)) problems.push(`${file}: "${text}"`)
}
if (problems.length) {
  console.error(`Period facts in ${problems.length} places:\n${problems.join("\n")}`)
  process.exit(1)
}
console.log(`No period facts in ${files.length} pages.`)
