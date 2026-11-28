export const SANITY_PROJECT_ID = "lboasusv"
export const SANITY_DATASET = "production"

/** Pin for Studio Vision and every frontend client. */
export const SANITY_API_VERSION = "2026-11-01"

/**
 * Every `project.status`, with its name. Studio lists them, and nibras.co names the light that
 * the home page shows next to a project.
 */
export const PROJECT_STATUSES = [
  { value: "waitlist", title: "Waitlist" },
  { value: "beta", title: "Beta" },
  { value: "active", title: "Active" },
  { value: "maintained", title: "Maintained" },
  { value: "archived", title: "Archived" },
  { value: "discontinued", title: "Discontinued" },
] as const satisfies readonly { value: string; title: string }[]

/** Every `project.kind`, with its name. Studio lists them, and the Work page labels each tile. */
export const PROJECT_KINDS = [
  { value: "library", title: "Library or tool" },
  { value: "extension", title: "Editor extension" },
  { value: "app", title: "App" },
  { value: "work", title: "Built at work" },
] as const satisfies readonly { value: string; title: string }[]

/**
 * Every `socialLink.platform`, with its name and the kind of site it is. One table for Studio,
 * nibras.co and the archive: a profile link's `label` is set only when the name here is wrong.
 * Designs that sort profiles under headings ("Blogs", "Development", "Social") map the kind.
 */
export const SOCIAL_PLATFORMS = [
  { value: "github", title: "GitHub", kind: "code" },
  { value: "linkedin", title: "LinkedIn", kind: "social" },
  { value: "bluesky", title: "Bluesky", kind: "social" },
  { value: "x", title: "X", kind: "social" },
  { value: "mastodon", title: "Mastodon", kind: "social" },
  { value: "matrix", title: "Matrix", kind: "social" },
  { value: "telegram", title: "Telegram", kind: "social" },
  { value: "keybase", title: "Keybase", kind: "code" },
  { value: "devto", title: "DEV Community", kind: "writing" },
  { value: "medium", title: "Medium", kind: "writing" },
  { value: "gitlab", title: "GitLab", kind: "code" },
  { value: "npm", title: "npm", kind: "code" },
  { value: "docker", title: "Docker Hub", kind: "code" },
  { value: "hackernews", title: "Hacker News", kind: "code" },
  { value: "steam", title: "Steam", kind: "social" },
  { value: "twitch", title: "Twitch", kind: "social" },
  { value: "soundcloud", title: "SoundCloud", kind: "social" },
  { value: "deviantart", title: "DeviantArt", kind: "social" },
  { value: "gravatar", title: "Gravatar", kind: "social" },
  { value: "email", title: "Email", kind: "social" },
  { value: "website", title: "Website", kind: "social" },
  { value: "other", title: "Other", kind: "social" },
] as const satisfies readonly {
  value: string
  title: string
  kind: "code" | "writing" | "social"
}[]

export type PlatformKind = (typeof SOCIAL_PLATFORMS)[number]["kind"]

/** A profile link's name: its own label when set, otherwise the platform's. */
export function platformLabel(platform?: string | null, label?: string | null) {
  return (
    label ||
    SOCIAL_PLATFORMS.find((item) => item.value === platform)?.title ||
    platform ||
    "Profile"
  )
}

export const platformKind = (platform?: string | null): PlatformKind =>
  SOCIAL_PLATFORMS.find((item) => item.value === platform)?.kind ?? "social"

/**
 * The portrait document that holds the mascot. While the profile's `icon` points at it, pages
 * draw the mascot in the page, so it can change its mood (`@multiverse/ui/gri.astro`).
 */
export const MASCOT_ID = "portrait-gri"

/** The public repository that holds these sites. */
export const REPOSITORY_URL = "https://github.com/grikomsn/multiverse"

/**
 * The name that pages show when Profile cannot be read. Profile holds the real name; these are
 * only safety nets, so a build without Sanity still names the site.
 */
export const FALLBACK_NAME = "Griko Nibras"
export const FALLBACK_GIVEN_NAME = "Griko"

/** The line under the greeting when Site has none. Words in [brackets] get a mark. */
export const FALLBACK_TAGLINE = "I make [useful], [fast], and [friendly] things."

/**
 * The pages that say the most, in this order, by slug. The header links the ones marked `nav`
 * after Blog and Work. The command bar and llms.txt list all of them before other pages.
 */
export const KEY_PAGES = [
  { slug: "about", label: "About", nav: true },
  { slug: "now", label: "Now", nav: true },
  { slug: "uses", label: "Uses", nav: false },
] as const
