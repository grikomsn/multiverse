/**
 * Gri, the mascot: a cartoon face of Griko with a tuft of hair, thick glasses and a blush.
 *
 * This module is Gri's drawing: the head, and the parts of every mood. `face.ts` puts them in
 * one <svg>, as it does for the other faces (`nia.ts`, `ash.ts`).
 * `scripts/make-icons.sh` writes `mascot.svg` and the favicons from it.
 *
 * Coordinates are in a 200 by 200 box. The head turns about its centre, (100, 110).
 */
import {
  ASLEEP_GROUND,
  BLUSH,
  faceFile,
  faceLayers,
  faceMix,
  faceSvg,
  GROUND,
  HEART,
  INK,
  kit,
  MOODS,
  PAPER,
  POSE,
  round,
  solid,
  TONGUE,
  WATER,
  type Face,
  type FaceOptions,
  type Mood,
  type Parts,
} from "./face"

export { ASLEEP_GROUND, GROUND, MOODS, POSE, type Mood }

/** Every color of the drawing, by the part that it paints. */
export const PALETTE = {
  ground: GROUND,
  ink: INK,
  paper: PAPER,
  blush: BLUSH,
  heart: HEART,
  water: WATER,
  tongue: TONGUE,
  asleep: ASLEEP_GROUND,
} as const

// The centre of each lens, and the height of the eyes and the mouth.
const LEFT = 72.5
const RIGHT = 127.5
const EYE = 117.5
const MOUTH = 154

const HEAD =
  "M46 104 C46 40 154 40 154 104 L154 122 C154 156 128 175 100 175 C72 175 46 156 46 122 Z"
const HAIR =
  "M43 106 C38 82 42 62 54 49 L51 40.5 L60.5 43.5 L63.5 32.5 L74.5 39.5 C92 32 112 31 127 37 " +
  "C146 44 157 62 158 84 C158.5 92 158 100 157 106 C156 96 153 88 150 82 " +
  "C148 86 145 89 141 91 C141 83 136 75 128 70 C108 75 84 73 68 64 C55 74 47 92 43 106 Z"
const EARS = `<circle cx="44" cy="120" r="10"/><circle cx="156" cy="120" r="10"/>`
const LENSES = `<rect x="50" y="99" width="45" height="37" rx="13"/><rect x="105" y="99" width="45" height="37" rx="13"/>`
const BRIDGE = `<path d="M95 111.95 Q100 106.95 105 111.95"/>`

const SKIN = `<g fill="${PAPER}" stroke="${INK}" stroke-width="6" stroke-linejoin="round">${EARS}<path d="${HEAD}"/></g>`
const TUFT = `<path d="${HAIR}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`
const FRAMES = `<g fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${LENSES}${BRIDGE}</g>`
const blushOf = (size: number) => {
  const rx = round(9.5 * size)
  const ry = round(5.5 * size)
  return `<ellipse cx="64" cy="147" rx="${rx}" ry="${ry}" fill="${BLUSH}"/><ellipse cx="136" cy="147" rx="${rx}" ry="${ry}" fill="${BLUSH}"/>`
}
const both = (eye: (x: number) => string): [string, string] => [eye(LEFT), eye(RIGHT)]
const K = kit(EYE, MOUTH)

const PARTS: Record<Mood, Parts> = {
  smile: { eyes: both(K.arcUp), mouth: K.smile },
  laugh: { eyes: both(K.arcUp), mouth: K.open },
  wink: { eyes: [K.dot(LEFT), K.arcUp(RIGHT)], mouth: K.smirk },
  cheeky: { eyes: [K.chevron(LEFT, 1), K.chevron(RIGHT, -1)], mouth: K.smile, extra: K.tongue },
  wow: { eyes: both(K.ring), mouth: K.oh(5.5, 6.5), marks: K.marks.wow },
  love: { eyes: both((x) => K.heart(x)), mouth: K.smile, marks: K.marks.love },
  starstruck: { eyes: both((x) => K.star(x)), mouth: K.open, marks: K.marks.starstruck },
  // A streak of light on each dark lens.
  cool: { lens: INK, eyes: both(K.glint), mouth: K.smirk },
  think: { eyes: both((x) => K.dot(x, 5.2, -6, -5)), mouth: K.flat, marks: K.marks.think },
  "side-eye": {
    eyes: both((x) => solid(`<rect x="${x + 4}" y="${EYE - 8.5}" width="8" height="17" rx="4"/>`)),
    mouth: K.smirk,
  },
  sleepy: { eyes: both(K.arcDown), mouth: K.oh(4, 4.6), marks: K.marks.sleepy },
  shy: {
    eyes: both((x) => K.dot(x, 5, -5, 5)),
    mouth: K.smallSmile,
    blush: 1.35,
    extra: K.hatch(64, 136, 147),
  },
  oops: { eyes: both((x) => K.dot(x, 4.6)), mouth: K.wavy, marks: K.marks.oops },
  sad: {
    eyes: [K.lid(LEFT, -2, -7), K.lid(RIGHT, -7, -2)],
    mouth: K.frown,
    blush: 0,
    extra: K.tear(66, 141),
  },
  grumpy: { eyes: [K.lid(LEFT, -7, -2), K.lid(RIGHT, -2, -7)], mouth: K.grimace, blush: 0 },
  dizzy: { eyes: both(K.cross), mouth: K.wavy, marks: K.marks.dizzy },
}

/** Gri as a face: the head, and the parts of every mood. */
export const GRI: Face = {
  title: "Griko Nibras",
  pose: POSE,
  back: [["head", SKIN]],
  mid: [["hair", TUFT]],
  front: [["glasses", FRAMES]],
  lenses: LENSES,
  blush: blushOf,
  parts: PARTS,
}

/**
 * The parts of a mixed face: eyes from one mood, the mouth from a second, and the blush and
 * the marks from a third (`faceMix` in `face.ts`).
 */
export const MIX = faceMix(GRI)

/** The drawing, as SVG markup, with every mood in `moods` (`faceSvg` in `face.ts`). */
export const griSvg = (options: FaceOptions) => faceSvg(GRI, options)

/** One mood as an SVG file. `mascot.svg` is the smile. */
export const griFile = (
  mood: Mood = "smile",
  options: Omit<FaceOptions, "moods" | "attrs" | "rules" | "mix"> = {},
) => faceFile(GRI, mood, options)

/** The layers of the drawing, from the back to the front. */
export const LAYERS = ["ground", "head", "blush", "hair", "face", "glasses", "marks"] as const

export type Layer = (typeof LAYERS)[number]

/**
 * One mood as separate drawings, one for each layer, all in the same box. For a view that
 * pulls the layers apart. A layer that the mood leaves empty has no drawing.
 */
export const griLayers = (mood: Mood = "smile"): Partial<Record<Layer, string>> =>
  faceLayers(GRI, mood)
