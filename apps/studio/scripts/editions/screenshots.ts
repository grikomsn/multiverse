/**
 * Uploads tracking screenshots for an edition ([rebuild, original?]) and sets its status.
 * The archive index shows screenshots[0].
 *
 *   bunx sanity exec scripts/editions/screenshots.ts --with-user-token -- \
 *     <key> <rebuild.png> [original.png] [--status rebuilt|reconstruction|inProgress]
 */
import { randomUUID } from "node:crypto"
import { readFileSync } from "node:fs"
import { basename } from "node:path"
import { parseArgs } from "node:util"

import { getCliClient } from "sanity/cli"

const client = getCliClient({ apiVersion: "2026-11-01" })

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  allowPositionals: true,
  options: { status: { type: "string", default: "rebuilt" } },
})
const [key, rebuild, original] = positionals
if (!key || !rebuild) throw new Error("Usage: <key> <rebuild.png> [original.png] [--status …]")

async function upload(path: string, alt: string) {
  const asset = await client.assets.upload("image", readFileSync(path), {
    filename: `edition-${key}-${basename(path)}`,
  })
  return { _type: "figure", asset: { _type: "reference", _ref: asset._id }, alt }
}

const screenshots = [
  await upload(rebuild, `Rebuilt ${key} on archive.nibras.co`),
  ...(original ? [await upload(original, `Original ${key}, as archived at the time`)] : []),
].map((figure) => ({ _key: randomUUID().slice(0, 12), ...figure }))

await client.patch(`edition-${key}`).set({ screenshots, status: values.status }).commit()
console.log(`edition-${key}: ${screenshots.length} screenshot(s), status ${values.status}`)
