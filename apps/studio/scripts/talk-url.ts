import { getCliClient } from "sanity/cli"

// A talk has one link: its slides, a recording or the event page. Moves each into `url`.
const client = getCliClient({ apiVersion: "2025-01-01" })
const talks = await client.fetch<{ _id: string; _rev: string; link?: string; count: number }[]>(
  `*[_type == "talk"]{ _id, _rev, "link": coalesce(slidesUrl, recordingUrl, eventUrl),
    "count": count([slidesUrl, recordingUrl, eventUrl][defined(@)]) }`,
)
const doubled = talks.filter((talk) => talk.count > 1)
if (doubled.length) throw new Error(`More than one link: ${doubled.map((t) => t._id).join(", ")}`)
const tx = client.transaction()
for (const talk of talks) {
  const patch = client
    .patch(talk._id)
    .ifRevisionId(talk._rev)
    .unset(["slidesUrl", "recordingUrl", "eventUrl"])
  tx.patch(talk.link ? patch.set({ url: talk.link }) : patch)
}
const result = await tx.commit()
console.log(`Patched ${result.results.length} talks`)
