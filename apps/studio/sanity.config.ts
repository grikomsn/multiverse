import { SANITY_API_VERSION, SANITY_DATASET, SANITY_PROJECT_ID } from "@multiverse/sanity/constants"
import { schemaTypes } from "@multiverse/sanity/schema"
import { singletons } from "@multiverse/sanity/singletons"
import { structure } from "@multiverse/sanity/structure"
import { visionTool } from "@sanity/vision"
import { defineConfig, isDev } from "sanity"
import { structureTool } from "sanity/structure"

export default defineConfig({
  name: "default",
  title: "Multiverse",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET ?? SANITY_DATASET,
  plugins: [
    structureTool({ structure }),
    ...(isDev ? [visionTool({ defaultApiVersion: SANITY_API_VERSION })] : []),
  ],
  schema: {
    types: schemaTypes,
  },
  document: {
    singletons,
  },
})
