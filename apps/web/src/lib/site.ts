import { FALLBACK_NAME } from "@multiverse/sanity/constants"
import type { SITE_SHELL_QUERY_RESULT } from "@multiverse/sanity/types"

/** The site's title: the short name from Profile, "Griko Nibras". */
export function siteTitle(profile: SITE_SHELL_QUERY_RESULT["profile"]) {
  return (
    [profile?.givenName, profile?.familyName].filter(Boolean).join(" ") ||
    profile?.name ||
    FALLBACK_NAME
  )
}

/**
 * The default meta description: who, what and where from Profile, then the site's own line.
 * `site.description` holds only that line, so a new role or city changes one field.
 * "Griko Nibras: Senior Product Engineer, leading engineering at Wayfindr. Based in Tangerang,
 * Indonesia. Building …"
 */
export function siteDescription({
  site,
  profile,
}: Pick<SITE_SHELL_QUERY_RESULT, "site" | "profile">) {
  const name = siteTitle(profile)
  return [
    name && profile?.headline ? `${name}: ${profile.headline}.` : name,
    profile?.location && `Based in ${profile.location}.`,
    site?.description,
  ]
    .filter(Boolean)
    .join(" ")
}
