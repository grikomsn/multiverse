interface ImportMetaEnv {
  readonly SANITY_PROJECT_ID?: string
  readonly SANITY_DATASET?: string
  readonly SANITY_API_READ_TOKEN?: string
  readonly PUBLIC_ARCHIVE_URL?: string
  readonly PUBLIC_WEB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
