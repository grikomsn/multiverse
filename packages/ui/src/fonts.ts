import { fontProviders } from "astro/config"

type Variant = { src: [string]; weight: string; style: "normal" }

/**
 * Timeless Sans for the Astro Fonts API. The file is licensed for embedding only and lives in
 * the gitignored `assets/fonts/web`, written by `scripts/subset-fonts.sh`. Every app sits two
 * levels below the root, so the default path works from each app's `astro.config.ts`.
 */
export function timelessSans(dir = "../../assets/fonts/web") {
  const variants: [Variant] = [
    { src: [`${dir}/timeless-sans.woff2`], weight: "400 700", style: "normal" },
  ]
  return {
    provider: fontProviders.local(),
    name: "Timeless Sans",
    cssVariable: "--font-timeless-sans",
    fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    options: { variants },
  }
}

/**
 * Trial: Allo by Josh Puckett (SIL OFL 1.1), written by `scripts/fetch-allo.sh`. It takes the
 * same CSS variable as Timeless Sans, so no page changes when the font does.
 */
export function allo(dir = "../../assets/fonts/web") {
  const variants: [Variant] = [
    { src: [`${dir}/allo-sans.woff2`], weight: "400 700", style: "normal" },
  ]
  return {
    provider: fontProviders.local(),
    name: "Allo",
    cssVariable: "--font-timeless-sans",
    fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
    options: { variants },
  }
}

/** The site font: Timeless Sans, or Allo when the build runs with `SITE_FONT=allo`. */
export function siteFont(dir?: string) {
  return process.env.SITE_FONT === "allo" ? allo(dir) : timelessSans(dir)
}
