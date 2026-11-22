/**
 * Brand marks (Simple Icons, 24×24) for every `socialLink.platform`: `brand-icon.astro` on
 * nibras.co, and archive editions whose own icon set lacks one (Font Awesome 5.5 has no X,
 * Bluesky or Matrix). LinkedIn is not in Simple Icons, so a plain "in" mark stands in.
 */
import {
  siBluesky,
  siDevdotto,
  siDeviantart,
  siDocker,
  siGithub,
  siGitlab,
  siGravatar,
  siKeybase,
  siMastodon,
  siMatrix,
  siMedium,
  siNpm,
  siSoundcloud,
  siSteam,
  siTelegram,
  siTwitch,
  siX,
  siYcombinator,
} from "simple-icons"

export const BRAND_MARKS: Record<string, { path: string; hex: string }> = {
  bluesky: siBluesky,
  devto: siDevdotto,
  deviantart: siDeviantart,
  docker: siDocker,
  github: siGithub,
  gitlab: siGitlab,
  gravatar: siGravatar,
  hackernews: siYcombinator,
  keybase: siKeybase,
  mastodon: siMastodon,
  matrix: siMatrix,
  medium: siMedium,
  npm: siNpm,
  soundcloud: siSoundcloud,
  steam: siSteam,
  telegram: siTelegram,
  twitch: siTwitch,
  x: siX,
  // LinkedIn left Simple Icons (at LinkedIn's request); a rounded square with "in", drawn here.
  linkedin: {
    path: "M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm2.5 7.5V18h3V9.5Zm1.5-4.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5ZM11 9.5V18h3v-4.5c0-1.2.6-2 1.6-2s1.4.8 1.4 2V18h3v-5.2c0-2.4-1.3-3.5-3.2-3.5-1.3 0-2.2.6-2.8 1.4V9.5Z",
    hex: "0A66C2",
  },
}

/** An inline SVG of the mark, sized by the caller's CSS. */
export const brandSvg = (platform: string, attrs = 'width="1em" height="1em"') => {
  const mark = BRAND_MARKS[platform]
  return mark
    ? `<svg ${attrs} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${mark.path}"/></svg>`
    : ""
}
