interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string
  readonly SANITY_DATASET?: string
  readonly SANITY_API_READ_TOKEN?: string
  readonly PUBLIC_SITE_URL?: string
  /** Where links to the archive go. Default: :4322 in dev, archive.nibras.co otherwise. */
  readonly PUBLIC_ARCHIVE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** The greeting for the browser console. `astro.config.ts` sets it at build time. */
declare const __CONSOLE_HELLO__: { face: string; text: string }
