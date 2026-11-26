/**
 * Nia, the second face of the family: a hijab with a soft peak, smiling eyes with lashes and a
 * blush. She has the moods of Gri (`gri.ts`), and `face.ts` draws her in the same way.
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
  MOODS,
  PAPER,
  POSE,
  round,
  TONGUE,
  WATER,
  type Face,
  type FaceOptions,
  type Mood,
  type Parts,
  type Pose,
} from "./face"

/** The thin line of the hem round the face. It keeps ink cloth from looking like hair. */
const HEM = "#63636c"

/** Every color of the drawing, by the part that it paints. */
export const NIA_PALETTE = {
  ground: GROUND,
  ink: INK,
  paper: PAPER,
  blush: BLUSH,
  hem: HEM,
  heart: HEART,
  water: WATER,
  tongue: TONGUE,
} as const

/**
 * The cloths that a page can offer: the color of the cloth, and of the hem on it. The first
 * one is the drawing's own. The outline stays ink.
 */
export const NIA_CLOTHS = {
  ink: [INK, HEM],
  navy: ["#252c52", "#6f77a6"],
  cocoa: ["#8a5a47", "#5c392c"],
  mauve: ["#b596b8", "#876a8b"],
  cream: ["#e8dcc8", "#b3a58d"],
  paper: [PAPER, "#b9b8b3"],
} as const

// The centre of each eye, and the height of the eyes and the mouth.
const LEFT = 75
const RIGHT = 125
const EYE = 122
const MOUTH = 153

/** The cloth from the outside: a dome that sits close to the head. */
const DOME =
  "M100 31 C142 31 172 60 172 106 C172 142 158 172 135 188 C124 196 112 199 100 199 " +
  "C88 199 76 196 65 188 C42 172 28 142 28 106 C28 60 58 31 100 31 Z"
/** The opening for the face, with a soft peak above the forehead. */
const OPENING =
  "M48 124 C48 100 70 84 101 67 C130 84 152 100 152 124 C152 154 130 174 100 174 C70 174 48 154 48 124 Z"

// The skin is larger than the opening, and the cloth covers its edge.
const SKIN = `<path d="M42 112 C42 72 72 58 100 58 C128 58 158 72 158 112 L158 130 C158 164 130 182 100 182 C70 182 42 164 42 130 Z" fill="${PAPER}"/>`
const CLOTH = `<path class="cloth" d="${DOME} ${OPENING}" fill="${INK}" fill-rule="evenodd" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`
const SEAM = `<path class="hem" d="${OPENING}" transform="translate(100 123) scale(1.14 1.13) translate(-100 -123)" fill="none" stroke="${HEM}" stroke-width="2.6" stroke-linejoin="round"/>`

// The cat-eye frames, as sunglasses. One lens; the other is its mirror.
const CAT_EYE =
  "M108 109 C122 107 140 104 156 96 C158 111 154 128 144 135 C133 142 116 141 109 132 C104 125 104 114 108 109 Z"
const SHADES =
  `<g transform="translate(100 120) scale(0.9) translate(-100 -120)" stroke="${INK}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round">` +
  `<path d="${CAT_EYE}"/><path d="${CAT_EYE}" transform="translate(200 0) scale(-1 1)"/><path d="M96 114 Q100 110 104 114" fill="none"/></g>`

const blushOf = (size: number) => {
  const rx = round(9.5 * size)
  const ry = round(5.5 * size)
  return `<ellipse cx="63" cy="146" rx="${rx}" ry="${ry}" fill="${BLUSH}"/><ellipse cx="137" cy="146" rx="${rx}" ry="${ry}" fill="${BLUSH}"/>`
}

// The marks sit further out than Gri's: the cloth is wider than his hair.
const K = kit(EYE, MOUTH, 12)

/** An eye for each side. `out` is -1 for the left eye and 1 for the right: the way to its outer corner. */
const sides = (eye: (x: number, out: 1 | -1) => string): [string, string] => [
  eye(LEFT, -1),
  eye(RIGHT, 1),
]
const both = (eye: (x: number) => string): [string, string] => [eye(LEFT), eye(RIGHT)]

// Eyes. Her lashes stay in every mood that has an eye to put them on.
/** A smiling eye with two lashes at its outer corner. */
const smiling = (x: number, out: 1 | -1) =>
  K.arcUp(x) +
  line(
    `<path d="M${x + out * 5.4} ${EYE - 0.6} l${out * 4.6} -5"/><path d="M${x + out * 9.5} ${EYE + 4.5} l${out * 6} -3.2"/>`,
    3.4,
  )
/** A dot with one lash. `dx` and `dy` move it inside the eye. */
const looking =
  (radius = 5.4, dx = 0, dy = 1) =>
  (x: number, out: 1 | -1) =>
    K.dot(x, radius, dx, dy) +
    line(
      `<path d="M${x + dx + out * (radius - 1)} ${EYE + dy - 0.5} q${out * 4} -0.5 ${out * 7.5} -4"/>`,
      3.8,
    )
const wide = (x: number, out: 1 | -1) =>
  K.ring(x) + line(`<path d="M${x + out * 7.5} ${EYE - 6.5} l${out * 5} -4"/>`, 4)
const shut = (x: number, out: 1 | -1) =>
  K.arcDown(x) + line(`<path d="M${x + out * 7} ${EYE + 3} l${out * 5} 3.5"/>`, 3.6)
const glint = (x: number) => line(`<path d="M${x - 9} ${EYE + 3} l7 -9"/>`, 3.5, PAPER)

const PARTS: Record<Mood, Parts> = {
  smile: { eyes: sides(smiling), mouth: K.smile },
  laugh: { eyes: sides(smiling), mouth: K.open },
  wink: { eyes: [looking()(LEFT, -1), smiling(RIGHT, 1)], mouth: K.smirk },
  cheeky: { eyes: [K.chevron(LEFT, 1), K.chevron(RIGHT, -1)], mouth: K.smile, extra: K.tongue },
  wow: { eyes: sides(wide), mouth: K.oh(5.5, 6.5), marks: K.marks.wow },
  love: { eyes: both((x) => K.heart(x)), mouth: K.smile, marks: K.marks.love },
  starstruck: { eyes: both((x) => K.star(x)), mouth: K.open, marks: K.marks.starstruck },
  cool: { lens: INK, eyes: both(glint), mouth: K.smirk },
  think: { eyes: sides(looking(5.2, -5, -4)), mouth: K.flat, marks: K.marks.think },
  "side-eye": { eyes: sides(looking(5.2, 7, 1)), mouth: K.smirk },
  // Her head turns toward the edge of the frame here, so these marks sit closer.
  sleepy: { eyes: sides(shut), mouth: K.oh(4, 4.6), marks: kit(EYE, MOUTH, 2).marks.sleepy },
  shy: {
    eyes: sides(looking(5, -5, 5)),
    mouth: K.smallSmile,
    blush: 1.35,
    extra: K.hatch(63, 137, 146),
  },
  oops: { eyes: sides(looking(4.6)), mouth: K.wavy, marks: K.marks.oops },
  sad: {
    eyes: [K.lid(LEFT, -2, -7), K.lid(RIGHT, -7, -2)],
    mouth: K.frown,
    blush: 0,
    extra: K.tear(LEFT - 6, EYE + 19),
  },
  grumpy: { eyes: [K.lid(LEFT, -7, -2), K.lid(RIGHT, -2, -7)], mouth: K.grimace, blush: 0 },
  dizzy: { eyes: both(K.cross), mouth: K.wavy, marks: K.marks.dizzy },
}

/** Nia leans the other way from Gri, so the two lean toward each other. */
export const NIA_POSE: Record<Mood, Pose> = { ...POSE }
for (const mood of MOODS) NIA_POSE[mood] = [-POSE[mood][0], POSE[mood][1]]

/** Nia as a face: the head, and the parts of every mood. */
export const NIA: Face = {
  who: "nia",
  title: "Nia",
  pose: NIA_POSE,
  back: [["head", SKIN]],
  mid: [
    ["hijab", CLOTH],
    ["hem", SEAM],
  ],
  front: [],
  lenses: SHADES,
  blush: blushOf,
  parts: PARTS,
}

/** The parts of a mixed face (`faceMix` in `face.ts`). */
export const NIA_MIX = faceMix(NIA)

/** The drawing, as SVG markup, with every mood in `moods` (`faceSvg` in `face.ts`). */
export const niaSvg = (options: FaceOptions) => faceSvg(NIA, options)

/** One mood as an SVG file. */
export const niaFile = (
  mood: Mood = "smile",
  options: Omit<FaceOptions, "moods" | "attrs" | "rules" | "mix"> = {},
) => faceFile(NIA, mood, options)
