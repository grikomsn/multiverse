export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v4`

/** Site-relative links from the 2019 copy live under /v4 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)

/** Framework colors from the home headline, the signature of this version. */
const LINK_COLORS: Record<string, string> = {
  "laravel.com": "orange",
  "nodejs.org": "green",
  "gatsbyjs.org": "purple",
  "nextjs.org": "gray",
  // Today's stack, for the current-content build. React and TypeScript keep the default blue.
  "vuejs.org": "green",
  "nestjs.com": "orange",
  "tauri.app": "orange",
}

export const linkColor = (value: string) => {
  try {
    return LINK_COLORS[new URL(value).hostname]
  } catch {
    return undefined
  }
}

export const trimProtocol = (value: string) => value.replace(/^\w+:(\/\/)?/, "")
