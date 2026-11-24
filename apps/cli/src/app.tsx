/**
 * The card as a live screen: the home page of nibras.co in a terminal. The same parts, in the
 * same order: the wave in the top right corner, the mascot, the headline with its marked
 * words, lists with a row under the cursor, a search bar and the footer band.
 *
 * Motion follows the rules of the site (docs/redesign.md): the entrance plays once, a mood's
 * move plays once, and only the wave keeps moving. With reduced motion nothing moves.
 *
 * The wave is not drawn here. This file tells the screen (`screen.ts`) where the wave is, and
 * the screen draws it behind the text. So Ink draws only when the card changes.
 */
import type { Card } from "@multiverse/content/card"
import { rankRows } from "@multiverse/ui/command-index"
import { MOODS, type Mood } from "@multiverse/ui/gri"
import { Box, measureElement, Text, useApp, useInput, useWindowSize, type DOMElement } from "ink"
import { useEffect, useEffectEvent, useMemo, useRef, useState, type RefObject } from "react"

import {
  allRows,
  cityTime,
  headline,
  intro,
  isOnSite,
  tagline,
  views,
  WORD_MOODS,
  wrapParts,
  type Row,
} from "./content"
import { faceRows, moveOf, SMALL_FACES, type Depth, type FaceSize } from "./face"
import { fitScroll, lineOfRow, nearestRow, toLines, windowOf, type Line } from "./list"
import { liveCard } from "./load"
import { copyText, openUrl } from "./open"
import type { Input, TerminalEvent } from "./pointer"
import type { WaveSpec } from "./screen"
import { MIN_SIZE, type ColorDepth } from "./terminal"
import { THEMES, type Theme } from "./theme"

/** What the card asks of the screen. `screen.ts` is the real one. */
export interface Stage {
  setWave(wave: WaveSpec): void
  setPointer(on: boolean): void
  /** The pointer's place, from 0 to 1 over the screen. */
  point(x: number, y: number): void
}

export interface AppProps {
  card: Card
  /** The theme at the start: the terminal's own, as the site follows the system. */
  dark: boolean
  depth: ColorDepth
  /** False for still pictures: no entrance and no moves. */
  motion: boolean
  /** Whether the terminal's font has braille: without it there is no wave. */
  braille: boolean
  /** Do not read today's card from nibras.co. */
  offline: boolean
  /** Whether the card reads the pointer at the start. `m` changes it. */
  pointer: boolean
  stage?: Stage
  input?: Input
}

/** The time of one step of the entrance and of a move, in milliseconds. */
const STEP = 70

/** Counts from 0 to `count`, one step each `interval`. With a count of 0 it stays at 0. */
function useSteps(count: number, interval = STEP) {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= count) return
    const timer = setTimeout(() => setStep(step + 1), interval)
    return () => clearTimeout(timer)
  }, [step, count, interval])
  return step
}

type BoxRef = RefObject<DOMElement | null>

interface FaceProps {
  mood: Mood
  size: FaceSize
  bg: string
  depth: Depth
  /** Play the move of the mood. The parent gives a new `key` for each start. */
  play: boolean
  /** Where the head leans when it is at rest: toward the pointer, by one pixel. */
  look: readonly [x: number, y: number]
  boxRef: BoxRef
}

function Face({ mood, size, bg, depth, play, look, boxRef }: FaceProps) {
  const move = moveOf(mood)
  const last = move.length - 1
  const step = useSteps(play ? last : 0)
  const shift = play && step < last ? move[step] : look
  return (
    <Box ref={boxRef} flexDirection="column" width={size} flexShrink={0}>
      {faceRows(mood, size, { bg, depth, shift }).map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
    </Box>
  )
}

interface HeroProps {
  card: Card
  theme: Theme
  width: number
  /** How far the entrance is. `Infinity` when it is over or does not play. */
  shown: number
  /** The note beside the mascot. Left out when the mascot is in the header. */
  note?: string
  now: Date
  /** The line with the marked words, for the pointer. */
  taglineRef: BoxRef
}

function Hero({ card, theme, width, shown, note, now, taglineRef }: HeroProps) {
  const words = headline(card).split(" ")
  const parts = tagline(card)
  const time = cityTime(card, now)
  // The entrance: the words of the headline, then the tagline, then its marks, then the rest.
  const afterWords = shown - words.length
  return (
    <Box flexDirection="column" width={width}>
      {note && <Text color={theme.accentInk}>{note}</Text>}
      {note && <Text> </Text>}
      <Text bold color={theme.fg}>
        {words.map((word, index) => (index < shown ? word : " ".repeat(word.length))).join(" ")}
      </Text>
      <Box ref={taglineRef} alignSelf="flex-start">
        <Text bold color={theme.fg}>
          {afterWords < 1
            ? " "
            : parts.map((part, index) => {
                if (index % 2 === 0) return part
                // A mark swipes in from the left, one after another.
                const mark = (index - 1) / 2
                const reach = Math.ceil((part.length * Math.min(3, afterWords - 2 - mark * 2)) / 3)
                const ground = theme.marks[mark % theme.marks.length]
                return (
                  <Text key={index}>
                    <Text backgroundColor={reach > 0 ? ground : undefined}>
                      {part.slice(0, Math.max(0, reach))}
                    </Text>
                    {part.slice(Math.max(0, reach))}
                  </Text>
                )
              })}
        </Text>
      </Box>
      <Text> </Text>
      {afterWords >= 3 &&
        wrapParts(intro(card), width).map((line, index) => (
          <Text key={index} color={theme.soft}>
            {line.map((piece, at) =>
              piece.strong ? (
                <Text key={at} color={theme.fg}>
                  {piece.text}
                </Text>
              ) : (
                piece.text
              ),
            )}
          </Text>
        ))}
      {afterWords >= 3 && time && (
        <Text color={theme.soft}>
          <Text color={theme.accentInk}>{time.day ? "☀" : "☾"}</Text> {time.clock}
          {time.city ? ` in ${time.city}` : ""} now
        </Text>
      )}
    </Box>
  )
}

/**
 * Bold and underline as plain codes. With NO_COLOR, Ink's color library writes no codes at
 * all, and the page and the row that are chosen must still stand out.
 */
const bold = (text: string) => `\x1b[1m${text}\x1b[22m`
const underline = (text: string) => `\x1b[4m${text}\x1b[24m`

interface ListProps {
  card: Card
  theme: Theme
  /** The terminal shows no colors. */
  plain?: boolean
  /** The lines on the screen, from `windowOf()`. */
  shown: Line[]
  /** The place of the first shown line in the whole list: the lines' keys count from it. */
  start: number
  selected: number
  width: number
  boxRef?: BoxRef
}

/** Rows with the cursor on one of them. */
export function List({ card, theme, plain, shown, start, selected, width, boxRef }: ListProps) {
  return (
    <Box ref={boxRef} flexDirection="column" width={width}>
      {shown.map((line, index) => {
        // The key is the line's place in the whole list. A row's address and title are not
        // enough: two roles at one organization have both the same.
        const key = start + index
        if (line.kind === "more")
          return (
            <Text key={key} color={theme.soft}>
              {line.to === "up" ? "  ↑ more" : "  ↓ more"}
            </Text>
          )
        if (line.kind === "gap") return <Text key={key}> </Text>
        if (line.kind === "heading") {
          return (
            <Box key={key}>
              <Text bold color={theme.fg}>
                {line.text}{" "}
              </Text>
              <Text color={theme.line}>
                {"─".repeat(Math.max(0, width - line.text.length - 1))}
              </Text>
            </Box>
          )
        }
        const { row } = line
        const on = line.index === selected
        return (
          <Box key={key} backgroundColor={on ? theme.tint : undefined}>
            <Text color={theme.accentInk}>{on ? "❯ " : "  "}</Text>
            <Box flexGrow={1} flexShrink={1} flexBasis={0}>
              <Text wrap="truncate-end">
                <Text color={theme.fg} bold={on}>
                  {on && plain ? bold(row.title) : row.title}
                </Text>
                {row.detail && <Text color={theme.soft}>{`  ${row.detail}`}</Text>}
              </Text>
            </Box>
            <Text color={theme.soft}>{row.date ? `  ${row.date}` : ""}</Text>
            <Text color={theme.accentInk}>
              {on ? (isOnSite(card, row.url) ? " →" : " ↗") : "  "}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}

type Action = "open" | "copy" | "search" | "theme" | "pointer" | "poke" | "quit" | "back"
interface Hint {
  label: string
  /** What a click on the hint does. The arrows have no click. */
  action?: Action
}

/** The keys, in as many words as the width has room for. A click on one does what its key does. */
const HINTS: Hint[][] = [
  [
    { label: "↑↓ ←→" },
    { label: "⏎ open", action: "open" },
    { label: "c copy", action: "copy" },
    { label: "/ search", action: "search" },
    { label: "t theme", action: "theme" },
    { label: "m mouse", action: "pointer" },
    { label: "space poke", action: "poke" },
    { label: "q quit", action: "quit" },
  ],
  [
    { label: "⏎ open", action: "open" },
    { label: "c copy", action: "copy" },
    { label: "/ search", action: "search" },
    { label: "t theme", action: "theme" },
    { label: "m mouse", action: "pointer" },
    { label: "q quit", action: "quit" },
  ],
  [
    { label: "⏎ open", action: "open" },
    { label: "/ search", action: "search" },
    { label: "q quit", action: "quit" },
  ],
]
const BAR_HINTS: Hint[] = [
  { label: "↑↓ move" },
  { label: "⏎ open", action: "open" },
  { label: "esc back", action: "back" },
]
const BETWEEN = " · "
const hintsFor = (width: number) =>
  HINTS.find((hints) => hints.map((hint) => hint.label).join(BETWEEN).length <= width) ??
  HINTS.at(-1)!

/** Which piece holds the cell `at`, when the pieces stand in a line with `gap` cells between. */
function pieceAt(lengths: number[], gap: number, at: number, first = 0) {
  let from = first
  for (let index = 0; index < lengths.length; index++) {
    if (at >= from && at < from + lengths[index]!) return index
    from += lengths[index]! + gap
  }
  return -1
}

/** What the pointer is on. `id` names it, so a press and its release can be compared. */
type Target = { id: string } & (
  | { kind: "nav"; index: number }
  | { kind: "row"; index: number }
  | { kind: "more"; to: "up" | "down" }
  | { kind: "face" }
  | { kind: "word"; mood: Mood }
  | { kind: "hint"; action: Action }
)

/** Where the cell (x, y) is inside a box, or nothing when it is outside. */
function inside(ref: BoxRef, x: number, y: number) {
  if (!ref.current) return undefined
  const box = measureElement(ref.current)
  const dx = x - box.x
  const dy = y - box.y
  return dx >= 0 && dy >= 0 && dx < box.width && dy < box.height ? { dx, dy, box } : undefined
}

export function App({
  card: built,
  dark,
  depth,
  motion,
  braille,
  offline,
  pointer,
  stage,
  input,
}: AppProps) {
  const { exit } = useApp()
  const { columns, rows } = useWindowSize()

  const [card, setCard] = useState(built)
  useEffect(() => {
    if (offline) return
    let current = true
    void liveCard().then((live) => {
      if (current && live) setCard(live)
    })
    return () => {
      current = false
    }
  }, [offline])

  const [theme, setTheme] = useState<Theme>(dark ? THEMES.dark : THEMES.light)
  const list = useMemo(() => views(card), [card])
  const [viewAt, setViewAt] = useState(0)
  const [cursors, setCursors] = useState<number[]>(() => list.map(() => 0))
  const [scrolls, setScrolls] = useState<number[]>(() => list.map(() => 0))
  const view = list[viewAt]!
  const viewLines = useMemo(() => toLines(view.sections), [view])
  const viewRows = view.sections.flatMap((section) => section.rows)

  // The search bar: `undefined` while it is closed.
  const [query, setQuery] = useState<string>()
  const [barAt, setBarAt] = useState(0)
  const [barScroll, setBarScroll] = useState(0)
  const everyRow = useMemo(() => allRows(list), [list])
  const found = useMemo(
    () => (query ? rankRows(everyRow, query) : (list[0]?.sections[0]?.rows ?? [])),
    [query, everyRow, list],
  )
  const foundLines = useMemo(() => toLines([{ rows: found }]), [found])

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(timer)
  }, [])
  const asleep = cityTime(card, now)?.asleep === true

  // The sizes. The column is narrow, as on the site; the wave and the band take the full width.
  const width = Math.max(20, Math.min(columns - 4, 84))
  const band = !braille ? 0 : rows >= 28 ? 2 : rows >= 22 ? 1 : 0
  const body = rows - 2 - 3 - band
  const home = view.key === "home" && query === undefined
  // The wave is the home page's. On the other pages it only touches the header.
  // A window made smaller than the layout needs: the card waits for a larger one.
  const tooSmall = columns < MIN_SIZE.columns || rows < MIN_SIZE.rows
  const waveHeight =
    !braille || tooSmall ? 0 : home ? Math.max(3, Math.min(7, Math.floor(rows / 5))) : 2
  const faceSize: FaceSize | undefined =
    depth < 8
      ? undefined
      : width >= 76 && body >= 20
        ? 28
        : width >= 60 && body >= 15
          ? 20
          : undefined
  const heroWidth = faceSize ? width - faceSize - 3 : width
  // The lines of the hero's text: the note and a space, the headline, the tagline, a space, the
  // intro and the clock.
  const heroText =
    (faceSize ? 2 : 0) +
    3 +
    wrapParts(intro(card), heroWidth).length +
    (cityTime(card, now) ? 1 : 0)
  const heroHeight = Math.max(faceSize ? faceSize / 2 : 0, heroText)
  const pixelDepth: Depth = depth >= 24 ? 24 : 8

  // The list that the keys and the pointer work on: the page's, or the search results.
  const inBar = query !== undefined
  const lines = inBar ? foundLines : viewLines
  const count = inBar ? found.length : viewRows.length
  const height = Math.max(1, inBar ? body - 2 : home ? body - heroHeight - 1 : body)
  const cursor = Math.max(0, Math.min((inBar ? barAt : cursors[viewAt]) ?? 0, count - 1))
  const start = fitScroll(
    lines,
    (inBar ? barScroll : scrolls[viewAt]) ?? 0,
    lineOfRow(lines, cursor),
    height,
  )
  const shown = windowOf(lines, start, height)
  const row = inBar ? found[cursor] : viewRows[cursor]

  /** Puts the cursor on a row, with `first` as the first line on the screen. */
  function place(index: number, first: number) {
    if (inBar) {
      setBarAt(index)
      setBarScroll(first)
    } else {
      setCursors((all) => all.map((value, at) => (at === viewAt ? index : value)))
      setScrolls((all) => all.map((value, at) => (at === viewAt ? first : value)))
    }
  }

  // The mood: a short one (a wink) wins over the pointer's, which wins over the row's, which
  // wins over the one a press on the face chose.
  const [flash, setFlash] = useState<Mood>()
  const [picked, setPicked] = useState<Mood>()
  const [beat, setBeat] = useState(0)
  const flashTimer = useRef<NodeJS.Timeout>(undefined)
  const pokes = useRef<number[]>([])
  const deaf = useRef(0)
  const rest: Mood = picked ?? (asleep ? "sleepy" : "smile")
  const barMood: Mood | undefined = !query ? undefined : found.length > 0 ? "think" : "sad"
  // A row sets the mood once the cursor has moved, as a link does under the pointer: the card
  // opens with the smile.
  const [moved, setMoved] = useState(false)
  const rowMood = moved && !inBar ? row?.mood : undefined
  // What the pointer is on, and the mood that it asks for: the face winks under the pointer.
  const [hover, setHover] = useState<Target>()
  const hoverMood: Mood | undefined =
    hover?.kind === "face" ? "wink" : hover?.kind === "word" ? hover.mood : undefined
  const mood: Mood = flash ?? barMood ?? hoverMood ?? rowMood ?? rest
  const faceKey = `${mood}:${beat}`
  const [firstFace] = useState(faceKey)
  // The head leans toward the pointer while it is over the hero. Not while asleep or dizzy.
  const [look, setLook] = useState<readonly [number, number]>([0, 0])
  const looks = motion && mood !== "sleepy" && mood !== "dizzy"

  function show(next: Mood, ms: number, then?: () => void) {
    clearTimeout(flashTimer.current)
    setFlash(next)
    setBeat((value) => value + 1)
    flashTimer.current = setTimeout(() => {
      setFlash(undefined)
      then?.()
    }, ms)
  }

  const [toast, setToast] = useState<string>()
  const toastTimer = useRef<NodeJS.Timeout>(undefined)
  function say(text: string) {
    clearTimeout(toastTimer.current)
    setToast(text)
    toastTimer.current = setTimeout(() => setToast(undefined), 3000)
  }
  useEffect(
    () => () => {
      clearTimeout(flashTimer.current)
      clearTimeout(toastTimer.current)
    },
    [],
  )

  /** A press on the mascot: the next mood, which stays. Five quick ones make it dizzy. */
  function poke() {
    const time = Date.now()
    if (time < deaf.current) return
    pokes.current = [...pokes.current.filter((before) => time - before < 600 * 4), time].slice(-5)
    const quick =
      pokes.current.length === 5 &&
      pokes.current.every((value, index, all) => index === 0 || value - all[index - 1]! < 600)
    if (quick) {
      pokes.current = []
      deaf.current = time + 4000
      show("dizzy", 1600, () => show("grumpy", 2400))
      return
    }
    const next = MOODS[(MOODS.indexOf(rest) + 1) % MOODS.length]!
    // The row under the cursor keeps quiet until the cursor moves again.
    setMoved(false)
    setPicked(next)
    setBeat((value) => value + 1)
  }

  function open(target: Row) {
    show("wink", 900)
    void openUrl(target.url).then((opened) =>
      say(opened ? `Opened ${target.copy ?? target.url}` : `Open ${target.url}`),
    )
  }

  function copy(target: Row) {
    const text = target.copy ?? target.url
    show("wink", 900)
    void copyText(text).then((result) =>
      say(result === "copied" ? `Copied ${text}` : `Asked the terminal to copy ${text}`),
    )
  }

  function toggleTheme() {
    const next = theme.name === "dark" ? THEMES.light : THEMES.dark
    setTheme(next)
    // Sunglasses for the dark theme, a squint at the light one: as on the site.
    if (next.name === "dark") show("cool", 2000)
    else show("cheeky", 1200)
  }

  // The pointer. A terminal that reports it does not let the reader select text with a plain
  // drag, so `m` turns the reports off.
  const [pointing, setPointing] = useState(pointer)
  function togglePointer() {
    setPointing(!pointing)
    setHover(undefined)
    setLook([0, 0])
    say(
      pointing
        ? "Mouse off: you can select text. Press m to turn it on."
        : "Mouse on. To select text, hold Shift, or press m.",
    )
  }
  useEffect(() => stage?.setPointer(pointing), [stage, pointing])
  useEffect(
    () => stage?.setWave({ hero: waveHeight, band: tooSmall ? 0 : band, color: theme.dither }),
    [stage, waveHeight, band, tooSmall, theme.dither],
  )

  const openBar = () => {
    setQuery("")
    setBarAt(0)
    setBarScroll(0)
  }
  const go = (to: number) => setViewAt((to + list.length) % list.length)
  /** Moves the cursor by rows. The list moves only as much as the cursor needs. */
  const move = (by: number) => {
    const next = Math.max(0, Math.min(count - 1, cursor + by))
    setMoved(true)
    place(next, fitScroll(lines, start, lineOfRow(lines, next), height))
  }
  /** Moves the list by lines, as the wheel does. The cursor stays on the screen. */
  const scroll = (by: number, under?: number) => {
    const first = Math.max(0, Math.min(Math.max(0, lines.length - height), start + by))
    const near = under === undefined ? lineOfRow(lines, cursor) : first + under
    const next = nearestRow(lines, first, height, near)
    if (next !== undefined) place(next, first)
  }

  function run(action: Action) {
    if (action === "open" && row) open(row)
    if (action === "copy" && row) copy(row)
    if (action === "search") openBar()
    if (action === "theme") toggleTheme()
    if (action === "pointer") togglePointer()
    if (action === "poke") poke()
    if (action === "quit") exit()
    if (action === "back") setQuery(undefined)
  }

  useInput((typed, key) => {
    if (query !== undefined) {
      if (key.escape) setQuery(undefined)
      else if (key.return) {
        if (row) open(row)
        setQuery(undefined)
      } else if (key.upArrow) move(-1)
      else if (key.downArrow) move(1)
      else if (key.backspace || key.delete) setQuery(query.slice(0, -1))
      else if (typed && !key.ctrl && !key.meta && !key.tab) {
        setQuery(query + typed.replace(/[\r\n]/g, ""))
        setBarAt(0)
        setBarScroll(0)
      }
      return
    }
    if (typed === "q" || key.escape) exit()
    else if (typed === "/" || (key.ctrl && typed === "k")) openBar()
    else if (key.upArrow || typed === "k") move(-1)
    else if (key.downArrow || typed === "j") move(1)
    else if (key.leftArrow || typed === "h" || (key.tab && key.shift)) go(viewAt - 1)
    else if (key.rightArrow || typed === "l" || key.tab) go(viewAt + 1)
    else if (/^[1-9]$/.test(typed) && Number(typed) <= list.length) go(Number(typed) - 1)
    else if (key.return || typed === "o") run("open")
    else if (typed === "c") run("copy")
    else if (typed === "t") toggleTheme()
    else if (typed === "m") togglePointer()
    else if (typed === " " || typed === "g") poke()
  })

  const hints = inBar ? BAR_HINTS : hintsFor(width)
  const words = tagline(card)

  const navRef = useRef<DOMElement>(null)
  const listRef = useRef<DOMElement>(null)
  const faceRef = useRef<DOMElement>(null)
  const heroRef = useRef<DOMElement>(null)
  const taglineRef = useRef<DOMElement>(null)
  const hintsRef = useRef<DOMElement>(null)
  /** What the main button went down on, until it comes up. */
  const pressed = useRef<string>(undefined)
  /** When the window got the focus. The click that gives the focus is not a click on the card. */
  const focusedAt = useRef(0)

  /** What is at the cell (x, y). The boxes are asked where they are, so no place is stored. */
  function targetAt(x: number, y: number): Target | undefined {
    const nav = inside(navRef, x, y)
    if (nav) {
      // One space before the first link, two between the links.
      const index = pieceAt(
        list.map((item) => item.label.length),
        2,
        nav.dx,
        1,
      )
      return index < 0 ? undefined : { id: `nav:${index}`, kind: "nav", index }
    }
    const rowsBox = inside(listRef, x, y)
    if (rowsBox) {
      const line = shown[rowsBox.dy]
      if (line?.kind === "row") return { id: `row:${line.index}`, kind: "row", index: line.index }
      if (line?.kind === "more") return { id: `more:${line.to}`, kind: "more", to: line.to }
      return undefined
    }
    if (inside(faceRef, x, y)) return { id: "face", kind: "face" }
    const mark = inside(taglineRef, x, y)
    if (mark) {
      const index = pieceAt(
        words.map((word) => word.length),
        0,
        mark.dx,
      )
      const word = words[index]?.toLowerCase()
      return index % 2 === 1 && word
        ? { id: `word:${index}`, kind: "word", mood: WORD_MOODS[word] ?? "starstruck" }
        : undefined
    }
    const hint = inside(hintsRef, x, y)
    if (hint) {
      const index = pieceAt(
        hints.map((item) => item.label.length),
        BETWEEN.length,
        hint.dx,
      )
      const action = hints[index]?.action
      return action ? { id: `hint:${action}`, kind: "hint", action } : undefined
    }
    return undefined
  }

  const onPointer = useEffectEvent((event: TerminalEvent) => {
    if (event.kind === "focus") {
      if (event.on) focusedAt.current = Date.now()
      return
    }
    if (!pointing) return
    stage?.point(event.x / columns, event.y / rows)
    const target = targetAt(event.x, event.y)
    if (event.kind === "wheel") {
      const over = inside(listRef, event.x, event.y)
      scroll(event.by * 2, over?.dy)
      return
    }
    if (target?.id !== hover?.id) setHover(target)
    // The row under the pointer is the row under the cursor, as `:hover` on the site.
    if (target?.kind === "row" && target.index !== cursor) {
      setMoved(true)
      place(target.index, start)
    }
    // The head leans toward the pointer while it is over the hero.
    const face = faceRef.current && measureElement(faceRef.current)
    const over = face && inside(heroRef, event.x, event.y)
    const lean = (from: number, size: number, at: number) =>
      at < from ? -1 : at >= from + size ? 1 : 0
    const next: readonly [number, number] = over
      ? [lean(face.x, face.width, event.x), lean(face.y, face.height, event.y)]
      : [0, 0]
    if (next[0] !== look[0] || next[1] !== look[1]) setLook(next)

    if (event.kind === "down") {
      pressed.current = Date.now() - focusedAt.current < 250 ? undefined : target?.id
    } else if (event.kind === "up") {
      const was = pressed.current
      pressed.current = undefined
      if (!target || target.id !== was) return
      if (target.kind === "nav") go(target.index)
      else if (target.kind === "row") run("open")
      else if (target.kind === "more") scroll(target.to === "up" ? 2 - height : height - 2)
      else if (target.kind === "face") poke()
      else if (target.kind === "hint") run(target.action)
    }
  })
  useEffect(() => input?.subscribe((event) => onPointer(event)), [input])

  // The entrance of the home page: once, when the card opens.
  const ENTRANCE = headline(card).split(" ").length + 12
  const step = useSteps(motion ? ENTRANCE : 0)
  const shownWords = motion && step < ENTRANCE ? step : Infinity

  const note = asleep && !picked ? "← asleep now" : "← that’s me"
  const small = <Text color={theme.accentInk}>{SMALL_FACES[mood]}</Text>

  if (tooSmall) {
    return (
      <Box
        width={columns}
        height={rows}
        backgroundColor={theme.bg}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Text color={theme.accentInk}>{SMALL_FACES.dizzy}</Text>
        <Text color={theme.fg}>The window is too small.</Text>
        <Text
          color={theme.soft}
        >{`Make it ${MIN_SIZE.columns} × ${MIN_SIZE.rows} or larger.`}</Text>
        <Text color={theme.soft}>q quits.</Text>
      </Box>
    )
  }

  return (
    <Box
      width={columns}
      height={rows}
      backgroundColor={theme.bg}
      flexDirection="column"
      alignItems="center"
    >
      <Box width={width} justifyContent="space-between">
        {home && faceSize ? (
          <Text> </Text>
        ) : (
          <Text bold color={theme.fg}>
            {!inBar && <>{small} </>}
            {card.name}
          </Text>
        )}
        <Box ref={navRef}>
          <Text>
            {list.map((item, index) => (
              <Text key={item.key}>
                {index > 0 ? "  " : " "}
                <Text
                  color={index === viewAt || hover?.id === `nav:${index}` ? theme.fg : theme.soft}
                  bold={index === viewAt}
                  underline={index === viewAt}
                >
                  {index === viewAt && depth === 0 ? bold(underline(item.label)) : item.label}
                </Text>
              </Text>
            ))}
          </Text>
        </Box>
      </Box>
      <Text> </Text>

      <Box width={width} height={body} flexDirection="column">
        {inBar && (
          <>
            <Box>
              <Text color={theme.fg}>
                {small} <Text color={theme.soft}>Search</Text> {query}
                <Text color={theme.accent}>▌</Text>
              </Text>
            </Box>
            <Text color={theme.line}>{"─".repeat(width)}</Text>
          </>
        )}
        {home && (
          <Box ref={heroRef} gap={3} height={heroHeight} alignItems="center" marginBottom={1}>
            {faceSize && (
              <Face
                key={faceKey}
                mood={mood}
                size={faceSize}
                bg={theme.bg}
                depth={pixelDepth}
                play={motion && faceKey !== firstFace}
                look={looks ? look : [0, 0]}
                boxRef={faceRef}
              />
            )}
            <Hero
              card={card}
              theme={theme}
              width={heroWidth}
              shown={shownWords}
              note={faceSize ? note : undefined}
              now={now}
              taglineRef={taglineRef}
            />
          </Box>
        )}
        {inBar && found.length === 0 ? (
          <Text color={theme.soft}>{`  Nothing matches “${query}”.`}</Text>
        ) : (
          <List
            card={card}
            theme={theme}
            plain={depth === 0}
            shown={shown}
            start={start}
            selected={cursor}
            width={width}
            boxRef={listRef}
          />
        )}
      </Box>

      <Text> </Text>
      <Box width={width}>
        <Text wrap="truncate-end" color={toast ? theme.accentInk : theme.soft}>
          {toast ?? row?.url.replace(/^mailto:/, "") ?? " "}
        </Text>
      </Box>
      <Box width={width}>
        <Box ref={hintsRef}>
          <Text wrap="truncate-end" color={theme.soft}>
            {hints.map((hint, index) => (
              <Text key={hint.label}>
                {index > 0 && BETWEEN}
                <Text
                  color={hint.action && hover?.id === `hint:${hint.action}` ? theme.fg : undefined}
                >
                  {hint.label}
                </Text>
              </Text>
            ))}
          </Text>
        </Box>
      </Box>
      {/* The last rows are the band's: the screen draws the wave there. */}
    </Box>
  )
}
