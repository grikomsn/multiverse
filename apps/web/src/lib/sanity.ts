import { createSanityClient } from "@multiverse/content/client"

/** Build-time client. Published content is public; a token is only needed for dotted ids or drafts. */
export const sanity = createSanityClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET,
  token: import.meta.env.SANITY_API_READ_TOKEN,
})
