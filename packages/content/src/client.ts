import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "@multiverse/sanity/constants"
import { createClient } from "@sanity/client"

export interface SanityClientOptions {
  projectId?: string
  dataset?: string
  /** Needed only for drafts or dotted `_id`s. Published content is public. */
  token?: string
  useCdn?: boolean
}

/**
 * The one Sanity client factory for every app and Worker. It never reads `import.meta.env`,
 * so Workers can call it too; Astro apps pass their env values in.
 */
export function createSanityClient({
  projectId,
  dataset,
  token,
  useCdn = false,
}: SanityClientOptions = {}) {
  return createClient({
    projectId: projectId || SANITY_PROJECT_ID,
    dataset: dataset || SANITY_DATASET,
    apiVersion: SANITY_API_VERSION,
    token: token || undefined,
    perspective: "published",
    useCdn,
  })
}
