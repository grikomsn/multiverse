/**
 * `bun apps/cli/scripts/dev.ts`: the card from the source, with today's facts from Sanity in
 * place of the copy that a build holds. Arguments go to the card: `--plain`, `--theme light`.
 */
import { getCard } from "@multiverse/content/card"
import { createSanityClient } from "@multiverse/content/client"

Object.assign(globalThis, { __CARD__: await getCard(createSanityClient()) })
await import("../src/cli")
