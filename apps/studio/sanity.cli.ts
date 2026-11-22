import { SANITY_DATASET, SANITY_PROJECT_ID } from "@multiverse/sanity/constants"
import { defineCliConfig } from "sanity/cli"

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? SANITY_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET ?? SANITY_DATASET,
  },
  // Hosted at https://nibras.sanity.studio (`bun run --filter studio deploy`).
  deployment: { appId: "eyhyld7q6ddf52abqc85ddgh" },
  typegen: {
    path: ["../../apps/*/src/**/*.{ts,tsx,astro}", "../../packages/content/src/**/*.ts"],
    schema: "./schema.json",
    generates: "../../packages/sanity/src/sanity.types.ts",
    overloadClientMethods: true,
  },
})
