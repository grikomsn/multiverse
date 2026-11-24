/**
 * The site's colors (`packages/ui/src/styles.css`), as plain values: a terminal has no
 * `light-dark()`. The card paints its own ground, so both themes look the same in any terminal.
 */

export type Rgb = readonly [red: number, green: number, blue: number]

export const rgb = (hex: string): Rgb => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

/** `part` of `over` on `under`: what a color with that alpha looks like on a ground. */
export const mix = (under: string, over: string, part: number) =>
  "#" +
  rgb(under)
    .map((value, index) => Math.round(value + (rgb(over)[index]! - value) * part))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")

export interface Theme {
  name: "light" | "dark"
  bg: string
  fg: string
  soft: string
  line: string
  accent: string
  accentInk: string
  /** The dots of the wave: the accent, part of the way to the ground (`--color-dither`). */
  dither: string
  /** The ground of the row under the cursor: 9% accent, as `row-link` on the site. */
  tint: string
  /** The grounds of the marked words: red, green, blue. */
  marks: readonly [string, string, string]
}

const theme = (
  name: Theme["name"],
  colors: Omit<Theme, "name" | "dither" | "tint">,
  dither: number,
): Theme => ({
  name,
  ...colors,
  dither: mix(colors.bg, colors.accent, dither),
  tint: mix(colors.bg, colors.accent, 0.09),
})

export const THEMES = {
  light: theme(
    "light",
    {
      bg: "#fbfaf7",
      fg: "#18181b",
      soft: "#5b5b66",
      line: "#e7e5e0",
      accent: "#eab308",
      accentInk: "#8a5a00",
      marks: ["#fde2e1", "#dcf3e4", "#dde9fb"],
    },
    0.55,
  ),
  dark: theme(
    "dark",
    {
      bg: "#17181c",
      fg: "#ececf1",
      soft: "#a1a1ad",
      line: "#2b2d34",
      accent: "#facc15",
      accentInk: "#facc15",
      marks: ["#5b2422", "#1f4a33", "#1f3a63"],
    },
    0.38,
  ),
} as const satisfies Record<Theme["name"], Theme>
