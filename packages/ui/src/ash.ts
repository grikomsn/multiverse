/**
 * Ash, the third face of the family: a round head, ears that stand out, hair that sweeps to
 * one side, shiny eyes with brows and a blush. Ash has the moods of Gri (`gri.ts`), and
 * `face.ts` draws them in the same way.
 *
 * Coordinates are in a 200 by 200 box. The head turns about its centre, (100, 110).
 */
import {
  BLUSH,
  faceFile,
  faceMix,
  faceSvg,
  GROUND,
  HEART,
  INK,
  kit,
  line,
  PAPER,
  POSE,
  round,
  TONGUE,
  WATER,
  type Face,
  type FaceOptions,
  type Mood,
  type Parts,
} from "./face"

/** The frame of the round sunglasses. */
const CREAM = "#f1e6cf"

/** Every color of the drawing, by the part that it paints. */
export const ASH_PALETTE = {
  ground: GROUND,
  ink: INK,
  paper: PAPER,
  blush: BLUSH,
  cream: CREAM,
  heart: HEART,
  water: WATER,
  tongue: TONGUE,
} as const

// The centre of each eye, and the height of the eyes and the mouth.
const LEFT = 75
const RIGHT = 125
const EYE = 124
const MOUTH = 156

const HEAD =
  "M42 106 C42 40 158 40 158 106 L158 126 C158 160 132 177 100 177 C68 177 42 160 42 126 Z"
const EARS = `<circle cx="38" cy="128" r="12.5"/><circle cx="162" cy="128" r="12.5"/>`
// Round the skull from the left temple to the right, then back along a fringe that sweeps
// to one side.
const HAIR =
  "M40 100 C36 74 44 52 62 40 L59 31 L70 35 C80 30 92 28 102 28 L107 21 L113 29 " +
  "C132 31 149 43 156 62 C161 75 162 88 160 100 C159 92 157 87 153 83 " +
  "C150 89 146 93 141 95 C141 87 137 80 131 76 C108 86 80 82 62 67 C52 75 43 87 40 100 Z"

const SKIN = `<g fill="${PAPER}" stroke="${INK}" stroke-width="6" stroke-linejoin="round">${EARS}<path d="${HEAD}"/></g>`
const SWEEP = `<path d="${HAIR}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`

// Round sunglasses. The group that holds them gives the ink; the frames are cream.
const SHADES =
  `<path d="M91 118 Q100 112 109 118" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/>` +
  `<path d="M91 118 Q100 112 109 118" fill="none" stroke="${CREAM}" stroke-width="6" stroke-linecap="round"/>` +
  [LEFT, RIGHT]
    .map(
      (x) =>
        `<circle cx="${x}" cy="${EYE - 1}" r="22.5"/><circle cx="${x}" cy="${EYE - 1}" r="19.5" fill="${CREAM}"/><circle cx="${x}" cy="${EYE - 1}" r="13"/>`,
    )
    .join("")

// The cheeks are fuller than Gri's.
const blushOf = (size: number) => {
  const rx = round(11.4 * size)
  const ry = round(6.6 * size)
  return `<ellipse cx="59" cy="151" rx="${rx}" ry="${ry}" fill="${BLUSH}"/><ellipse cx="141" cy="151" rx="${rx}" ry="${ry}" fill="${BLUSH}"/>`
}

const K = kit(EYE, MOUTH, 6)
const both = (eye: (x: number) => string): [string, string] => [eye(LEFT), eye(RIGHT)]

// Eyes.
/** A dot with a point of light. `dx` and `dy` move it inside the eye. */
const shiny =
  (radius = 9, dx = 0, dy = 1) =>
  (x: number) =>
    `<circle cx="${x + dx}" cy="${EYE + dy}" r="${radius}" fill="${INK}"/>` +
    `<circle cx="${round(x + dx - radius * 0.32)}" cy="${round(EYE + dy - radius * 0.36)}" r="${round(radius * 0.3)}" fill="${PAPER}"/>`
const arcUp = (x: number) =>
  line(`<path d="M${x - 10} ${EYE + 5} Q${x} ${EYE - 9} ${x + 10} ${EYE + 5}"/>`)
const arcDown = (x: number) =>
  line(`<path d="M${x - 10} ${EYE - 1} Q${x} ${EYE + 10} ${x + 10} ${EYE - 1}"/>`)
const glint = (x: number) =>
  line(`<path d="M${x - 8} ${EYE + 2} L${x - 1} ${EYE - 8}"/>`, 3.5, PAPER)

// Brows. They do much of the acting.
/**
 * One brow. `out` is -1 for the left brow and 1 for the right. `outer` and `inner` are the
 * heights of its two ends, and `lift` raises all of it; less is higher.
 */
const brow = (x: number, out: 1 | -1, outer: number, inner: number, lift = 0) => {
  const top = EYE - 19 - lift
  return `<path d="M${x + out * 10} ${top + outer} Q${x + out} ${top - 4 + (outer + inner) / 2} ${x - out * 8} ${top + inner}"/>`
}
const brows = (outer = 2, inner = 0, lift = 0) =>
  line(brow(LEFT, -1, outer, inner, lift) + brow(RIGHT, 1, outer, inner, lift), 4.2)

// Mouths of Ash's own.
const smile = line(`<path d="M86 ${MOUTH} Q100 ${MOUTH + 11} 114 ${MOUTH}"/>`)
/** An open mouth with a row of teeth. */
const laugh =
  `<path d="M82 ${MOUTH - 6} Q100 ${MOUTH - 2} 118 ${MOUTH - 6} Q116 ${MOUTH + 15} 100 ${MOUTH + 15} Q84 ${MOUTH + 15} 82 ${MOUTH - 6} Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
  `<path d="M87 ${MOUTH - 4.5} Q100 ${MOUTH - 1} 113 ${MOUTH - 4.5} L112 ${MOUTH + 1} Q100 ${MOUTH + 4} 88 ${MOUTH + 1} Z" fill="${PAPER}"/>` +
  `<ellipse cx="100" cy="${MOUTH + 10.5}" rx="7" ry="3.6" fill="${TONGUE}"/>`

const PARTS: Record<Mood, Parts> = {
  smile: { eyes: both(shiny()), brows: brows(), mouth: smile },
  laugh: { eyes: both(arcUp), mouth: laugh },
  wink: {
    eyes: [shiny()(LEFT), arcUp(RIGHT)],
    brows: line(brow(LEFT, -1, 2, 0), 4.2),
    mouth: K.smirk,
  },
  cheeky: { eyes: [K.chevron(LEFT, 1), K.chevron(RIGHT, -1)], mouth: K.smile, extra: K.tongue },
  wow: {
    eyes: both(shiny(10.5)),
    brows: brows(1, 0, 7),
    mouth: K.oh(6.5, 7.5),
    marks: K.marks.wow,
  },
  love: { eyes: both((x) => K.heart(x, 1.15)), mouth: smile, marks: K.marks.love },
  starstruck: { eyes: both((x) => K.star(x, 12, 5.4)), mouth: laugh, marks: K.marks.starstruck },
  cool: { lens: INK, eyes: both(glint), mouth: K.smirk },
  think: {
    eyes: both(shiny(8, -5, -3)),
    // One brow goes up.
    brows: line(brow(LEFT, -1, 2, 0) + brow(RIGHT, 1, 0, 1, 6), 4.2),
    mouth: K.flat,
    marks: K.marks.think,
  },
  "side-eye": { eyes: both(shiny(8, 7, 1)), brows: brows(1, 2, -3), mouth: K.smirk },
  sleepy: { eyes: both(arcDown), mouth: K.oh(4.5, 5), marks: K.marks.sleepy },
  shy: {
    eyes: both(shiny(8, -5, 5)),
    brows: brows(3, -2),
    mouth: K.smallSmile,
    blush: 1.3,
    extra: K.hatch(59, 141, 151),
  },
  oops: { eyes: both(shiny(7)), brows: brows(4, -3), mouth: K.wavy, marks: K.marks.oops },
  sad: {
    eyes: both(shiny(8, 0, 3)),
    brows: brows(5, -4),
    mouth: K.frown,
    blush: 0,
    extra: K.tear(LEFT - 8, EYE + 16),
  },
  grumpy: { eyes: both(shiny(8, 0, 3)), brows: brows(-4, 6, -3), mouth: K.grimace },
  dizzy: { eyes: both(K.cross), mouth: K.wavy, marks: K.marks.dizzy },
}

/** Ash as a face: the head, and the parts of every mood. Ash leans as Gri does. */
export const ASH: Face = {
  who: "ash",
  title: "Ash",
  pose: POSE,
  back: [["head", SKIN]],
  mid: [["hair", SWEEP]],
  front: [],
  lenses: SHADES,
  blush: blushOf,
  parts: PARTS,
}

/** The parts of a mixed face (`faceMix` in `face.ts`). */
export const ASH_MIX = faceMix(ASH)

/** The drawing, as SVG markup, with every mood in `moods` (`faceSvg` in `face.ts`). */
export const ashSvg = (options: FaceOptions) => faceSvg(ASH, options)

/** One mood as an SVG file. */
export const ashFile = (
  mood: Mood = "smile",
  options: Omit<FaceOptions, "moods" | "attrs" | "rules" | "mix"> = {},
) => faceFile(ASH, mood, options)
