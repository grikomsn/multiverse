/**
 * Gri, the mascot: a cartoon face of Griko with a tuft of hair, thick glasses and a blush.
 *
 * This module is the one drawing. It holds every mood as separate parts (each eye, the mouth,
 * the marks around the head), so a page can show one mood and move its parts (`gri.css`).
 * `scripts/make-icons.sh` writes `mascot.svg` and the favicons from it.
 *
 * Coordinates are in a 200 by 200 box. The head turns about its centre, (100, 110).
 */

const INK = "#18181b"
const PAPER = "#fbfaf7"
const BLUSH = "#f7b9b6"
const HEART = "#e5484d"
const WATER = "#bcd7f7"
const TONGUE = "#f08a84"

/** The accent amber of the light theme: the mascot's ground. */
export const GROUND = "#eab308"
/** The ground of the tab icon while the tab is in the background. */
export const ASLEEP_GROUND = "#c4c3bd"

/** In the order that a click on the home face shows them. */
export const MOODS = [
  "smile",
  "laugh",
  "wink",
  "cheeky",
  "wow",
  "love",
  "starstruck",
  "cool",
  "think",
  "side-eye",
  "sleepy",
  "shy",
  "oops",
  "sad",
  "grumpy",
  "dizzy",
] as const

export type Mood = (typeof MOODS)[number]

/** The resting pose of each mood: the turn of the head in degrees, and how far it sits lower. */
export const POSE: Record<Mood, readonly [turn: number, drop: number]> = {
  smile: [-5, 0],
  laugh: [-9, -1],
  wink: [-9, 0],
  cheeky: [5, 0],
  wow: [0, -2],
  love: [-10, 0],
  starstruck: [-2, -1],
  cool: [4, -1],
  think: [9, 0],
  "side-eye": [-1, 0],
  sleepy: [-14, 4],
  shy: [-9, 4],
  oops: [3, 0],
  sad: [-9, 5],
  grumpy: [0, 2],
  dizzy: [-3, 0],
}

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

const line = (inner: string, width = 5.5, color = INK) =>
  `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`
const solid = (inner: string, color = INK) => `<g fill="${color}">${inner}</g>`
const both = (eye: (x: number) => string): [string, string] => [eye(LEFT), eye(RIGHT)]
const round = (value: number) => Math.round(value * 10) / 10

// Eyes. Each takes the centre of its lens.
const arcUp = (x: number) =>
  line(`<path d="M${x - 9.5} ${EYE + 4.5} Q${x} ${EYE - 8.5} ${x + 9.5} ${EYE + 4.5}"/>`)
const arcDown = (x: number) =>
  line(`<path d="M${x - 9} ${EYE - 1} Q${x} ${EYE + 9} ${x + 9} ${EYE - 1}"/>`)
const dot = (x: number, radius = 5.2, dx = 0, dy = 1) =>
  solid(`<circle cx="${x + dx}" cy="${EYE + dy}" r="${radius}"/>`)
/** A dot under a slanted lid. `from` and `to` are the heights of the two ends of the lid. */
const lid = (x: number, from: number, to: number) =>
  line(`<path d="M${x - 9} ${EYE + from} L${x + 9} ${EYE + to}"/>`) + dot(x, 4.8, 0, 4)

const heart = (x: number, y: number, scale = 1) => {
  const at = (dx: number, dy: number) => `${round(x + dx * scale)} ${round(y + dy * scale)}`
  return `M${at(0, 9)}C${at(-15, -1)} ${at(-9, -12)} ${at(0, -4)}C${at(9, -12)} ${at(15, -1)} ${at(0, 9)}Z`
}
const star = (x: number, y: number, outer = 10.5, inner = 4.7) => {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5
    const reach = index % 2 === 0 ? outer : inner
    return `${round(x + reach * Math.cos(angle))} ${round(y + reach * Math.sin(angle))}`
  })
  return `M${points.join("L")}Z`
}
const spark = (x: number, y: number, r: number) =>
  `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${PAPER}"/>`

// Mouths.
const smile = line(`<path d="M88 ${MOUTH} Q100 ${MOUTH + 10} 112 ${MOUTH}"/>`)
const smallSmile = line(`<path d="M93 ${MOUTH + 2} Q100 ${MOUTH + 7} 107 ${MOUTH + 2}"/>`)
const smirk = line(`<path d="M90 ${MOUTH + 2} Q103 ${MOUTH + 9} 113 ${MOUTH - 3}"/>`)
const flat = line(`<path d="M91 ${MOUTH + 4} L109 ${MOUTH + 2}"/>`)
const wavy = line(`<path d="M87 ${MOUTH + 4} q4.3 -6 8.6 0 t8.6 0 t8.6 0"/>`)
const frown = line(`<path d="M89 ${MOUTH + 7} Q100 ${MOUTH - 3} 111 ${MOUTH + 7}"/>`)
const grimace = line(`<path d="M90 ${MOUTH + 6} Q100 ${MOUTH + 1} 110 ${MOUTH + 6}"/>`)
const open =
  `<path d="M85 ${MOUTH - 3} Q100 ${MOUTH} 115 ${MOUTH - 3} Q112 ${MOUTH + 14} 100 ${MOUTH + 14} Q88 ${MOUTH + 14} 85 ${MOUTH - 3} Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
  `<ellipse cx="100" cy="${MOUTH + 10.5}" rx="6.5" ry="3.6" fill="${TONGUE}"/>`
const oh = (rx: number, ry: number) =>
  `<ellipse cx="100" cy="${MOUTH + 4}" rx="${rx}" ry="${ry}" fill="${INK}"/>`

interface Parts {
  eyes: [left: string, right: string]
  mouth: string
  /** A fill for the lenses, under the frame. */
  lens?: string
  /** One more part of the face, such as a tear. */
  extra?: string
  /** Marks around the head. They come in one after another. */
  marks?: string[]
  /** The size of the blush. 1 when left out; 0 for none. */
  blush?: number
}

const PARTS: Record<Mood, Parts> = {
  smile: { eyes: both(arcUp), mouth: smile },
  laugh: { eyes: both(arcUp), mouth: open },
  wink: { eyes: [dot(LEFT), arcUp(RIGHT)], mouth: smirk },
  cheeky: {
    eyes: [
      line(`<path d="M${LEFT - 7} ${EYE - 6} L${LEFT + 6} ${EYE + 0.5} L${LEFT - 7} ${EYE + 7}"/>`),
      line(
        `<path d="M${RIGHT + 7} ${EYE - 6} L${RIGHT - 6} ${EYE + 0.5} L${RIGHT + 7} ${EYE + 7}"/>`,
      ),
    ],
    mouth: smile,
    extra: `<path d="M95.5 ${MOUTH + 6} v5 a5.5 5.5 0 0 0 11 0 v-5.5" fill="${TONGUE}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`,
  },
  wow: {
    eyes: both(
      (x) =>
        `<circle cx="${x}" cy="${EYE + 0.5}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="4.5"/><circle cx="${x}" cy="${EYE + 0.5}" r="3.4" fill="${INK}"/>`,
    ),
    mouth: oh(5.5, 6.5),
    marks: [
      line(`<path d="M156 52 L159 40"/>`, 5),
      line(`<path d="M166 62 L176 52"/>`, 5),
      line(`<path d="M171 76 L184 72"/>`, 5),
    ],
  },
  love: {
    eyes: both((x) => `<path d="${heart(x, EYE + 1)}" fill="${HEART}"/>`),
    mouth: smile,
    marks: [
      `<path d="${heart(170, 56, 0.9)}" fill="${HEART}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`,
      `<path d="${heart(184, 82, 0.55)}" fill="${HEART}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`,
    ],
  },
  starstruck: {
    eyes: both((x) => `<path d="${star(x, EYE + 1)}" fill="${INK}"/>`),
    mouth: open,
    marks: [spark(172, 58, 11), spark(24, 84, 8), spark(183, 96, 6)],
  },
  cool: {
    lens: INK,
    // A streak of light on each dark lens.
    eyes: both((x) => line(`<path d="M${x - 11} ${EYE + 3} L${x - 3} ${EYE - 7}"/>`, 4, PAPER)),
    mouth: smirk,
  },
  think: {
    eyes: both((x) => dot(x, 5.2, -6, -5)),
    mouth: flat,
    marks: [
      line(`<path d="M163 50 a8.5 8.5 0 1 1 12.5 7.5 q-4 2.2 -4 7"/>`) +
        `<circle cx="171.5" cy="74" r="3.3" fill="${INK}"/>`,
    ],
  },
  "side-eye": {
    eyes: both((x) => solid(`<rect x="${x + 4}" y="${EYE - 8.5}" width="8" height="17" rx="4"/>`)),
    mouth: smirk,
  },
  sleepy: {
    eyes: both(arcDown),
    mouth: oh(4, 4.6),
    marks: [
      line(`<path d="M165 55 h11 l-11 13 h11"/>`, 4.5),
      line(`<path d="M179 34 h8 l-8 9.5 h8"/>`, 4.5),
    ],
  },
  shy: {
    eyes: both((x) => dot(x, 5, -5, 5)),
    mouth: smallSmile,
    blush: 1.35,
    extra: `<g stroke="${HEART}" stroke-opacity=".55" stroke-width="2.6" stroke-linecap="round"><path d="M59 151 l4 -8 M65 151 l4 -8 M71 151 l4 -8 M129 151 l4 -8 M135 151 l4 -8 M141 151 l4 -8"/></g>`,
  },
  oops: {
    eyes: both((x) => dot(x, 4.6)),
    mouth: wavy,
    marks: [
      `<path d="M27 62 C19 74 17 84 27 84 C37 84 35 74 27 62 Z" fill="${WATER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
    ],
  },
  sad: {
    eyes: [lid(LEFT, -2, -7), lid(RIGHT, -7, -2)],
    mouth: frown,
    blush: 0,
    extra: `<path d="M66 141 C61 149 60 155 66 155 C72 155 71 149 66 141 Z" fill="${WATER}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`,
  },
  grumpy: { eyes: [lid(LEFT, -7, -2), lid(RIGHT, -2, -7)], mouth: grimace, blush: 0 },
  dizzy: {
    eyes: both((x) =>
      line(
        `<path d="M${x - 7} ${EYE - 6} L${x + 7} ${EYE + 8} M${x + 7} ${EYE - 6} L${x - 7} ${EYE + 8}"/>`,
      ),
    ),
    mouth: wavy,
    marks: [spark(170, 62, 9), spark(28, 70, 7), spark(152, 30, 5)],
  },
}

interface GriOptions {
  /** The moods the drawing can show. The first one shows at the start. */
  moods: readonly Mood[]
  /** The marks around the head, such as hearts. Leave them out for small sizes. */
  marks?: boolean
  /** The color behind the head. `null` for none. */
  ground?: string | null
  /** More attributes for the <svg> element. */
  attrs?: string
  /**
   * Put the rules that show a mood and set its pose inside the drawing. For a drawing in a
   * page, whose mood changes. A file does not need them.
   */
  rules?: boolean
}

/**
 * The drawing, as SVG markup, with every mood in `moods`.
 *
 * Each mood is a few groups with `data-m`. With `rules`, a <style> in the drawing shows the
 * parts of the mood that `data-mood` on the <svg> names, and sets its pose; `gri.css` has the
 * moves. The attributes hold the first mood, so the drawing is right without a style sheet, as
 * a file.
 *
 * Groups, from the outside: `.hm` moves the head, `.hr` turns it. The parts that move are the
 * children of a `data-m` group: `.blush`, `.lens`, `.eye`, `.extra`, `.mouth` and `.mark`.
 */
export function griSvg({
  moods,
  marks = true,
  ground = GROUND,
  attrs = "",
  rules = false,
}: GriOptions) {
  const first = moods[0] ?? "smile"
  const hide = (mood: Mood) => (mood === first ? "" : ` display="none"`)
  const blush: string[] = []
  const faces: string[] = []
  const around: string[] = []
  for (const mood of moods) {
    const part = PARTS[mood]
    const size = part.blush ?? 1
    if (size) {
      const rx = round(9.5 * size)
      const ry = round(5.5 * size)
      blush.push(
        `<g data-m="${mood}"${hide(mood)}><g class="blush"><ellipse cx="64" cy="147" rx="${rx}" ry="${ry}" fill="${BLUSH}"/><ellipse cx="136" cy="147" rx="${rx}" ry="${ry}" fill="${BLUSH}"/></g></g>`,
      )
    }
    faces.push(
      `<g data-m="${mood}"${hide(mood)}>` +
        (part.lens ? `<g class="lens" fill="${part.lens}">${LENSES}</g>` : "") +
        `<g class="eye l">${part.eyes[0]}</g><g class="eye r">${part.eyes[1]}</g>` +
        (part.extra ? `<g class="extra">${part.extra}</g>` : "") +
        `<g class="mouth">${part.mouth}</g></g>`,
    )
    if (marks && part.marks) {
      around.push(
        `<g data-m="${mood}"${hide(mood)}>` +
          part.marks
            .map((mark, index) => `<g class="mark" style="--i:${index}">${mark}</g>`)
            .join("") +
          `</g>`,
      )
    }
  }
  const [turn, drop] = POSE[first]
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-15 -14 230 230" class="gri" data-mood="${first}"${attrs ? ` ${attrs}` : ""}>`,
    rules ? `<style>${griStyle(moods)}</style>` : "",
    ground
      ? `<rect class="ground" x="-15" y="-14" width="230" height="230" fill="${ground}"/>`
      : "",
    `<g class="hm" transform="translate(0 ${drop})"><g transform="translate(100 108)"><g class="hr" transform="rotate(${turn})"><g transform="translate(-100 -110)">`,
    `<g fill="${PAPER}" stroke="${INK}" stroke-width="6" stroke-linejoin="round">${EARS}<path d="${HEAD}"/></g>`,
    blush.join(""),
    `<path d="${HAIR}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`,
    faces.join(""),
    `<g fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">${LENSES}${BRIDGE}</g>`,
    around.join(""),
    `</g></g></g></g>`,
    `</svg>`,
  ]
    .filter(Boolean)
    .join("\n")
}

/** The style rules that show one of `moods` and set its pose. */
const griStyle = (moods: readonly Mood[]) =>
  moods
    .map(
      (mood) =>
        `.gri[data-mood="${mood}"]{--gri-turn:${POSE[mood][0]}deg;--gri-drop:${POSE[mood][1]}px}` +
        `.gri[data-mood="${mood}"] [data-m="${mood}"]>*{display:inline}`,
    )
    .join("")

/** One mood as an SVG file. `mascot.svg` is the smile. */
export const griFile = (
  mood: Mood = "smile",
  options: Omit<GriOptions, "moods" | "attrs" | "rules"> = {},
) =>
  griSvg({ ...options, moods: [mood], attrs: `width="1024" height="1024"` }).replace(
    "\n",
    "\n<title>Griko Nibras</title>\n",
  ) + "\n"
