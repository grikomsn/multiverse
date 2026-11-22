import {
  faDev,
  faDeviantart,
  faDocker,
  faGithub,
  faGitlab,
  faHackerNewsSquare,
  faKeybase,
  faLinkedinIn,
  faMastodon,
  faMediumM,
  faNpm,
  faSoundcloud,
  faSteam,
  faTelegram,
  faTwitch,
  faWordpress,
  type IconDefinition,
} from "@fortawesome/free-brands-svg-icons"

import { BRAND_MARKS } from "@multiverse/ui/brand-marks"

/** metadata.js: Font Awesome 5.5 icon and tile color, now per `socialLink.platform`. */
const FONT_AWESOME: Record<string, { icon: IconDefinition; color: string }> = {
  devto: { icon: faDev, color: "#0a0a0a" },
  deviantart: { icon: faDeviantart, color: "#05cc47" },
  docker: { icon: faDocker, color: "#0db7ed" },
  github: { icon: faGithub, color: "#25292e" },
  gitlab: { icon: faGitlab, color: "#fa6d34" },
  gravatar: { icon: faWordpress, color: "#1e8cbe" },
  hackernews: { icon: faHackerNewsSquare, color: "#ff4000" },
  keybase: { icon: faKeybase, color: "#3ba2fc" },
  linkedin: { icon: faLinkedinIn, color: "#0077b5" },
  mastodon: { icon: faMastodon, color: "#3088d4" },
  medium: { icon: faMediumM, color: "#00ab6c" },
  npm: { icon: faNpm, color: "#cb3837" },
  soundcloud: { icon: faSoundcloud, color: "#ff7700" },
  steam: { icon: faSteam, color: "#171A21" },
  telegram: { icon: faTelegram, color: "#0088cc" },
  twitch: { icon: faTwitch, color: "#6441a5" },
}

/** Platforms Font Awesome 5.5 predates get the Simple Icons mark, drawn the same way. */
const icon = (platform: string): IconDefinition | null => {
  const mark = BRAND_MARKS[platform]
  return mark
    ? ({
        prefix: "fab",
        iconName: platform,
        icon: [24, 24, [], "", mark.path],
      } as unknown as IconDefinition)
    : null
}

export const brandOf = (platform: string | null) => {
  if (!platform) return null
  if (FONT_AWESOME[platform]) return FONT_AWESOME[platform]
  const fallback = icon(platform)
  return fallback ? { icon: fallback, color: `#${BRAND_MARKS[platform]!.hex}` } : null
}

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v2`

/** Site-relative links from the 2018 copy live under /v2 now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)
