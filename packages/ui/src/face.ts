/**
 * The drawing that the mascots share: Gri (`gri.ts`), Nia (`nia.ts`) and Ash (`ash.ts`).
 *
 * A face is a head with a few fixed layers, and one set of parts for each mood: each eye, the
 * mouth, the marks around the head. This module puts them in one <svg>, so a page can show one
 * mood and move its parts (`face.css`). The class of every drawing is `gri`, for the first face.
 *
 * Coordinates are in a 200 by 200 box. The head turns about its centre, (100, 110).
 */

export const INK = "#18181b"
export const PAPER = "#fbfaf7"
export const BLUSH = "#f7b9b6"
export const HEART = "#e5484d"
export const WATER = "#bcd7f7"
export const TONGUE = "#f08a84"

/** The accent amber of the light theme: the ground of every face. */
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

/** The resting pose of a mood: the turn of the head in degrees, and how far it sits lower. */
export type Pose = readonly [turn: number, drop: number]

/** The resting pose of each mood, for a face that leans as Gri does. */
export const POSE: Record<Mood, Pose> = {
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

export const VIEW_BOX = "-15 -14 230 230"

export const round = (value: number) => Math.round(value * 10) / 10

export const line = (inner: string, width = 5.5, color = INK) =>
  `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`
export const solid = (inner: string, color = INK) => `<g fill="${color}">${inner}</g>`

export const heart = (x: number, y: number, scale = 1) => {
  const at = (dx: number, dy: number) => `${round(x + dx * scale)} ${round(y + dy * scale)}`
  return `M${at(0, 9)}C${at(-15, -1)} ${at(-9, -12)} ${at(0, -4)}C${at(9, -12)} ${at(15, -1)} ${at(0, 9)}Z`
}
export const star = (x: number, y: number, outer = 10.5, inner = 4.7) => {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI) / 5
    const reach = index % 2 === 0 ? outer : inner
    return `${round(x + reach * Math.cos(angle))} ${round(y + reach * Math.sin(angle))}`
  })
  return `M${points.join("L")}Z`
}
export const spark = (x: number, y: number, r: number) =>
  `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${PAPER}"/>`

/**
 * The eyes, mouths and marks that the faces share, for eyes at the height `eye` and a mouth at
 * `mouth`. `out` moves the marks away from a head that is wider than Gri's.
 */
export function kit(eye: number, mouth: number, out = 0) {
  const dot = (x: number, radius = 5.2, dx = 0, dy = 1) =>
    solid(`<circle cx="${x + dx}" cy="${eye + dy}" r="${radius}"/>`)
  const heartMark = (x: number, y: number, scale: number) =>
    `<path d="${heart(x, y, scale)}" fill="${HEART}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`
  return {
    // Eyes. Each takes the centre of the eye.
    arcUp: (x: number) =>
      line(`<path d="M${x - 9.5} ${eye + 4.5} Q${x} ${eye - 8.5} ${x + 9.5} ${eye + 4.5}"/>`),
    arcDown: (x: number) =>
      line(`<path d="M${x - 9} ${eye - 1} Q${x} ${eye + 9} ${x + 9} ${eye - 1}"/>`),
    dot,
    /** A dot under a slanted lid. `from` and `to` are the heights of the two ends of the lid. */
    lid: (x: number, from: number, to: number) =>
      line(`<path d="M${x - 9} ${eye + from} L${x + 9} ${eye + to}"/>`) + dot(x, 4.8, 0, 4),
    /** An eye shut hard. `side` is 1 for the left eye and -1 for the right. */
    chevron: (x: number, side: 1 | -1) =>
      line(
        `<path d="M${x - side * 7} ${eye - 6} L${x + side * 6} ${eye + 0.5} L${x - side * 7} ${eye + 7}"/>`,
      ),
    ring: (x: number) =>
      `<circle cx="${x}" cy="${eye + 0.5}" r="9" fill="${PAPER}" stroke="${INK}" stroke-width="4.5"/><circle cx="${x}" cy="${eye + 0.5}" r="3.4" fill="${INK}"/>`,
    heart: (x: number, scale = 1) => `<path d="${heart(x, eye + 1, scale)}" fill="${HEART}"/>`,
    star: (x: number, outer = 10.5, inner = 4.7) =>
      `<path d="${star(x, eye + 1, outer, inner)}" fill="${INK}"/>`,
    cross: (x: number) =>
      line(
        `<path d="M${x - 7} ${eye - 6} L${x + 7} ${eye + 8} M${x + 7} ${eye - 6} L${x - 7} ${eye + 8}"/>`,
      ),
    /** A streak of light on a dark lens. */
    glint: (x: number) => line(`<path d="M${x - 11} ${eye + 3} L${x - 3} ${eye - 7}"/>`, 4, PAPER),

    // Mouths.
    smile: line(`<path d="M88 ${mouth} Q100 ${mouth + 10} 112 ${mouth}"/>`),
    smallSmile: line(`<path d="M93 ${mouth + 2} Q100 ${mouth + 7} 107 ${mouth + 2}"/>`),
    smirk: line(`<path d="M90 ${mouth + 2} Q103 ${mouth + 9} 113 ${mouth - 3}"/>`),
    flat: line(`<path d="M91 ${mouth + 4} L109 ${mouth + 2}"/>`),
    wavy: line(`<path d="M87 ${mouth + 4} q4.3 -6 8.6 0 t8.6 0 t8.6 0"/>`),
    frown: line(`<path d="M89 ${mouth + 7} Q100 ${mouth - 3} 111 ${mouth + 7}"/>`),
    grimace: line(`<path d="M90 ${mouth + 6} Q100 ${mouth + 1} 110 ${mouth + 6}"/>`),
    open:
      `<path d="M85 ${mouth - 3} Q100 ${mouth} 115 ${mouth - 3} Q112 ${mouth + 14} 100 ${mouth + 14} Q88 ${mouth + 14} 85 ${mouth - 3} Z" fill="${INK}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>` +
      `<ellipse cx="100" cy="${mouth + 10.5}" rx="6.5" ry="3.6" fill="${TONGUE}"/>`,
    oh: (rx: number, ry: number) =>
      `<ellipse cx="100" cy="${mouth + 4}" rx="${rx}" ry="${ry}" fill="${INK}"/>`,
    /** The tongue of the cheeky mood: an extra part that belongs to the mouth. */
    tongue: `<path d="M95.5 ${mouth + 6} v5 a5.5 5.5 0 0 0 11 0 v-5.5" fill="${TONGUE}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round"/>`,

    // More parts of the face.
    /** A tear that starts at (x, y). */
    tear: (x: number, y: number) =>
      `<path d="M${x} ${y} C${x - 5} ${y + 8} ${x - 6} ${y + 14} ${x} ${y + 14} C${x + 6} ${y + 14} ${x + 5} ${y + 8} ${x} ${y} Z" fill="${WATER}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`,
    /** Red lines over the blush. `left` and `right` are the centres of the two marks. */
    hatch: (left: number, right: number, y: number) =>
      `<g stroke="${HEART}" stroke-opacity=".55" stroke-width="2.6" stroke-linecap="round"><path d="` +
      [left - 5, left + 1, left + 7, right - 7, right - 1, right + 5]
        .map((x) => `M${x} ${y + 4} l4 -8`)
        .join(" ") +
      `"/></g>`,

    // Marks around the head, by mood.
    marks: {
      wow: [
        line(`<path d="M${156 + out} 52 L${159 + out} 40"/>`, 5),
        line(`<path d="M${166 + out} 62 L${176 + out} 52"/>`, 5),
        line(`<path d="M${171 + out} 76 L${184 + out} 72"/>`, 5),
      ],
      love: [heartMark(170 + out, 56, 0.9), heartMark(184 + out, 82, 0.55)],
      starstruck: [spark(172 + out, 58, 11), spark(24 - out, 84, 8), spark(183 + out, 96, 6)],
      think: [
        line(`<path d="M${163 + out} 50 a8.5 8.5 0 1 1 12.5 7.5 q-4 2.2 -4 7"/>`) +
          `<circle cx="${171.5 + out}" cy="74" r="3.3" fill="${INK}"/>`,
      ],
      sleepy: [
        line(`<path d="M${165 + out} 55 h11 l-11 13 h11"/>`, 4.5),
        line(`<path d="M${179 + out} 34 h8 l-8 9.5 h8"/>`, 4.5),
      ],
      oops: [
        `<path d="M${27 - out} 62 C${19 - out} 74 ${17 - out} 84 ${27 - out} 84 C${37 - out} 84 ${35 - out} 74 ${27 - out} 62 Z" fill="${WATER}" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`,
      ],
      dizzy: [spark(170 + out, 62, 9), spark(28 - out, 70, 7), spark(152 + out, 30, 5)],
    },
  }
}

/** The parts of one mood. */
export interface Parts {
  eyes: [left: string, right: string]
  mouth: string
  /** A fill for the lenses of the face (`Face.lenses`), under the frame. */
  lens?: string
  /** The brows, for a face that has them. */
  brows?: string
  /** One more part of the face, such as a tear. */
  extra?: string
  /** Marks around the head. They come in one after another. */
  marks?: string[]
  /** The size of the blush. 1 when left out; 0 for none. */
  blush?: number
}

/** A fixed layer of a face: its name, and its drawing. */
export type Fixed = readonly [name: string, drawing: string]

/** One mascot. */
export interface Face {
  /** The name on the drawing, as `data-who`. The first face, Gri, has none. */
  who?: string
  /** The title of the drawing as a file. */
  title: string
  pose: Record<Mood, Pose>
  /** The layers behind the blush, such as the head. */
  back: readonly Fixed[]
  /** The layers between the blush and the parts of a mood, such as the hair. */
  mid: readonly Fixed[]
  /** The layers over the parts of a mood, such as glasses. */
  front: readonly Fixed[]
  /** The shapes that `Parts.lens` fills. */
  lenses?: string
  blush: (size: number) => string
  parts: Record<Mood, Parts>
}

/** The mood whose extra part belongs to its mouth: the tongue. Every other extra part belongs to the head. */
const TONGUE_MOOD: Mood = "cheeky"

/** The groups that move and turn the head, around `parts`: one line for each part. */
const posed = (parts: string[], [turn, drop]: Pose) => [
  `<g class="hm" transform="translate(0 ${drop})"><g transform="translate(100 108)"><g class="hr" transform="rotate(${turn})"><g transform="translate(-100 -110)">`,
  ...parts,
  `</g></g></g></g>`,
]

/** The moods that differ in one part: the first mood of each different drawing. */
const distinct = (face: Face, key: (part: Parts, mood: Mood) => string) => {
  const seen = new Set<string>()
  return MOODS.filter((mood) => {
    const drawing = key(face.parts[mood], mood)
    return !seen.has(drawing) && seen.add(drawing)
  })
}

/**
 * The parts of a mixed face: eyes from one mood, the mouth from a second, and the blush and
 * the marks from a third. Each list holds one mood for each different drawing of that part,
 * so no two mixed faces look the same.
 */
export const faceMix = (face: Face) =>
  ({
    eyes: distinct(face, (part) => (part.lens ?? "") + part.eyes.join("") + (part.brows ?? "")),
    mouth: distinct(face, (part, mood) => part.mouth + (mood === TONGUE_MOOD ? part.extra : "")),
    extra: distinct(
      face,
      (part, mood) =>
        `${part.blush ?? 1}${mood === TONGUE_MOOD ? "" : (part.extra ?? "")}${(part.marks ?? []).join("")}`,
    ),
  }) as const

export interface FaceOptions {
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
  /**
   * A face that a page mixes from three moods (`faceMix`). `data-eyes`, `data-mouth` and
   * `data-extra` on the <svg> name them, and `data-mood` is empty. Give it every mood.
   */
  mix?: boolean
}

/** The selector of every drawing of `face`. A rule for a named face is stronger than one for Gri. */
const selectorOf = (face: Face) => (face.who ? `.gri[data-who="${face.who}"]` : ".gri")

/**
 * A face as SVG markup, with every mood in `moods`.
 *
 * Each mood is a few groups with `data-m`. With `rules`, a <style> in the drawing shows the
 * parts of the mood that `data-mood` on the <svg> names, and sets its pose; `face.css` has the
 * moves. The attributes hold the first mood, so the drawing is right without a style sheet, as
 * a file.
 *
 * Groups, from the outside: `.hm` moves the head, `.hr` turns it. The parts that move are the
 * children of a `data-m` group: `.blush`, `.lens`, `.eye`, `.brow`, `.extra`, `.mouth` and
 * `.mark`.
 */
export function faceSvg(
  face: Face,
  { moods, marks = true, ground = GROUND, attrs = "", rules = false, mix = false }: FaceOptions,
) {
  const first = moods[0] ?? "smile"
  const hide = (mood: Mood) => (mood === first ? "" : ` display="none"`)
  const blush: string[] = []
  const faces: string[] = []
  const around: string[] = []
  for (const mood of moods) {
    const part = face.parts[mood]
    const size = part.blush ?? 1
    if (size) {
      blush.push(`<g data-m="${mood}"${hide(mood)}><g class="blush">${face.blush(size)}</g></g>`)
    }
    faces.push(
      `<g data-m="${mood}"${hide(mood)}>` +
        (part.lens ? `<g class="lens" fill="${part.lens}">${face.lenses ?? ""}</g>` : "") +
        `<g class="eye l">${part.eyes[0]}</g><g class="eye r">${part.eyes[1]}</g>` +
        (part.brows ? `<g class="brow">${part.brows}</g>` : "") +
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
  const who = face.who ? ` data-who="${face.who}"` : ""
  const shown = mix
    ? `data-mood="" data-eyes="${first}" data-mouth="${first}" data-extra="${first}"`
    : `data-mood="${first}"`
  const drawings = (layers: readonly Fixed[]) => layers.map(([, drawing]) => drawing)
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX}" class="gri"${who} ${shown}${attrs ? ` ${attrs}` : ""}>`,
    rules || mix ? `<style>${mix ? mixStyle(face) : moodStyle(face, moods)}</style>` : "",
    ground
      ? `<rect class="ground" x="-15" y="-14" width="230" height="230" fill="${ground}"/>`
      : "",
    ...posed(
      [
        ...drawings(face.back),
        blush.join(""),
        ...drawings(face.mid),
        faces.join(""),
        ...drawings(face.front),
        around.join(""),
      ],
      face.pose[first],
    ),
    `</svg>`,
  ]
    .filter(Boolean)
    .join("\n")
}

/** The style rules that show one of `moods` and set its pose. */
const moodStyle = (face: Face, moods: readonly Mood[]) =>
  moods
    .map(
      (mood) =>
        `${selectorOf(face)}[data-mood="${mood}"]{--gri-turn:${face.pose[mood][0]}deg;--gri-drop:${face.pose[mood][1]}px}` +
        `.gri[data-mood="${mood}"] [data-m="${mood}"]>*{display:inline}`,
    )
    .join("")

/** The style rules that show the three parts of a mixed face. */
const mixStyle = (face: Face) => {
  const mix = faceMix(face)
  const drawing = selectorOf(face)
  const eyes = MOODS.some((mood) => face.parts[mood].brows) ? ".eye,.lens,.brow" : ".eye,.lens"
  return (
    [
      ...mix.eyes.map((mood) => `${drawing}[data-eyes="${mood}"] [data-m="${mood}"]>:is(${eyes})`),
      ...mix.mouth.map(
        (mood) =>
          `${drawing}[data-mouth="${mood}"] [data-m="${mood}"]>${mood === TONGUE_MOOD ? ":is(.mouth,.extra)" : ".mouth"}`,
      ),
      ...mix.extra.map(
        (mood) =>
          `${drawing}[data-extra="${mood}"] [data-m="${mood}"]>${mood === TONGUE_MOOD ? ":is(.blush,.mark)" : ":is(.blush,.mark,.extra)"}`,
      ),
    ].join(",") + "{display:inline}"
  )
}

/** One mood of a face as an SVG file. */
export const faceFile = (
  face: Face,
  mood: Mood = "smile",
  options: Omit<FaceOptions, "moods" | "attrs" | "rules" | "mix"> = {},
) =>
  faceSvg(face, { ...options, moods: [mood], attrs: `width="1024" height="1024"` }).replace(
    "\n",
    `\n<title>${face.title}</title>\n`,
  ) + "\n"

/** The names of the layers of a face, from the back to the front. */
export const layersOf = (face: Face) => [
  "ground",
  ...face.back.map(([name]) => name),
  "blush",
  ...face.mid.map(([name]) => name),
  "face",
  ...face.front.map(([name]) => name),
  "marks",
]

/**
 * One mood as separate drawings, one for each layer, all in the same box. For a view that
 * pulls the layers apart. A layer that the mood leaves empty has no drawing.
 */
export function faceLayers(face: Face, mood: Mood = "smile"): Record<string, string> {
  const part = face.parts[mood]
  const size = part.blush ?? 1
  const inner: Record<string, string> = {
    ...Object.fromEntries([...face.back, ...face.mid, ...face.front]),
    blush: size ? face.blush(size) : "",
    face:
      (part.lens ? `<g fill="${part.lens}">${face.lenses ?? ""}</g>` : "") +
      part.eyes.join("") +
      (part.brows ?? "") +
      (part.extra ?? "") +
      part.mouth,
    marks: (part.marks ?? []).join(""),
  }
  const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX}" aria-hidden="true">`
  const layers: Record<string, string> = {
    // The ground as a disc: the round frame that the site cuts from the square.
    ground: `${open}<circle cx="100" cy="101" r="115" fill="${GROUND}"/></svg>`,
  }
  for (const layer of layersOf(face)) {
    if (inner[layer]) {
      layers[layer] = `${open}${posed([inner[layer]], face.pose[mood]).join("")}</svg>`
    }
  }
  return layers
}
