/**
 * The page of a mascot: `/gri`, `/nia` and `/ash` (`components/mascot-page.astro`,
 * `styles/gri.css`). Browser code.
 *
 * Every part is optional: without this script the page shows the same faces and text. With
 * `prefers-reduced-motion`, a press still changes a mood, and nothing moves by itself.
 */
import {
  animate,
  fit,
  inkOf,
  onThemeChange,
  paint,
  reducedMotion,
  threshold,
  toRgba,
} from "@multiverse/ui/dither"
import { faces, showMood } from "@multiverse/ui/gri-moods"

const still = reducedMotion()
const SPRING = "cubic-bezier(0.3, 1.45, 0.5, 1)"

const find = <T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
) => scope.querySelector<T>(selector)
const all = <T extends HTMLElement = HTMLElement>(
  selector: string,
  scope: ParentNode = document,
) => [...scope.querySelectorAll<T>(selector)]
const seconds = () => performance.now() / 1000
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const two = (value: number) => String(value).padStart(2, "0")

/** Call `run` once, when `element` comes near the view. */
function near(element: Element, run: () => void, rootMargin = "0px 0px -10% 0px") {
  new IntersectionObserver(
    (entries, observer) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      run()
    },
    { rootMargin },
  ).observe(element)
}

/**
 * A drawing in the page as a file, in a data URL. Give it a drawing that holds one mood: a file
 * has no style sheet to hide the others.
 */
function fileOf(face: SVGSVGElement, { ground = true, round = false } = {}) {
  const copy = face.cloneNode(true) as SVGSVGElement
  for (const name of ["data-live", "style", "aria-hidden"]) copy.removeAttribute(name)
  copy.setAttribute("width", "512")
  copy.setAttribute("height", "512")
  if (!ground) copy.querySelector(".ground")?.remove()
  if (round) {
    // Cut to a circle, as `scripts/make-icons.sh` cuts the tab icon.
    const space = "http://www.w3.org/2000/svg"
    const clip = document.createElementNS(space, "clipPath")
    const circle = document.createElementNS(space, "circle")
    const group = document.createElementNS(space, "g")
    clip.id = "round"
    circle.setAttribute("cx", "100")
    circle.setAttribute("cy", "101")
    circle.setAttribute("r", "115")
    clip.append(circle)
    group.setAttribute("clip-path", "url(#round)")
    group.append(...copy.childNodes)
    copy.append(clip, group)
  }
  return `data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(copy))}`
}

/**
 * The head and the eyes of `face` lean toward the pointer while it is over `area` (`gri.css`).
 * For a mouse, as on the home page.
 */
function look(face: SVGSVGElement, area: HTMLElement, reach: number, quiet = () => false) {
  if (still || !matchMedia("(hover: hover) and (pointer: fine)").matches) return
  const at = { x: 0, y: 0 }
  const to = { x: 0, y: 0 }
  let frame = 0
  const step = () => {
    at.x += (to.x - at.x) * 0.2
    at.y += (to.y - at.y) * 0.2
    const done = Math.abs(to.x - at.x) + Math.abs(to.y - at.y) < 0.004
    if (done) Object.assign(at, to)
    face.style.setProperty("--gri-look-x", at.x.toFixed(3))
    face.style.setProperty("--gri-look-y", at.y.toFixed(3))
    frame = done ? 0 : requestAnimationFrame(step)
  }
  const aim = (x: number, y: number) => {
    to.x = Math.max(-1, Math.min(1, x))
    to.y = Math.max(-1, Math.min(1, y))
    frame ||= requestAnimationFrame(step)
  }
  area.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" || quiet()) return aim(0, 0)
    const box = face.getBoundingClientRect()
    aim(
      (event.clientX - box.left - box.width / 2) / reach,
      (event.clientY - box.top - box.height / 2) / (reach * 0.7),
    )
  })
  area.addEventListener("pointerleave", () => aim(0, 0))
}

/** Put `text` on the clipboard. False when the browser does not allow it. */
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * The stage: the large face at the top.
 *
 * A press shows the next mood. A pull moves the face, and a spring takes it back: a short pull
 * makes it laugh, and a long or fast one makes it dizzy. Rings of dots spread from the face,
 * with one ripple for each change of mood. The face blinks now and then.
 */
function stage() {
  const root = find("[data-stage]")
  const body = root && find("[data-stage-body]", root)
  const button = root && find<HTMLButtonElement>("[data-stage-face]", root)
  const face = button && faces(button)[0]
  const rings = root?.querySelector<HTMLCanvasElement>(".gri-stage-rings canvas")
  if (!root || !body || !button || !face || !rings) return

  const moods: [name: string, turn: string][] = JSON.parse(root.dataset.moods ?? "[]")
  const names = moods.map(([name]) => name)
  const indexText = find("[data-stage-index]", root)
  const nameText = find("[data-stage-name]", root)
  const turnText = find("[data-stage-turn]", root)

  // The readout names the mood that shows, whatever changed it. Each change starts a ripple.
  const ripples: number[] = []
  let shown = face.dataset.mood ?? "smile"
  new MutationObserver(() => {
    const mood = face.dataset.mood
    if (!mood) return
    ripples.push(seconds())
    if (ripples.length > 4) ripples.shift()
    if (mood === shown) return
    const index = names.indexOf(mood)
    const back = index < names.indexOf(shown)
    shown = mood
    if (indexText) indexText.textContent = two(index + 1)
    if (turnText) turnText.textContent = moods[index]?.[1] ?? ""
    if (!nameText) return
    nameText.textContent = mood
    if (!still) {
      nameText.animate([{ translate: `0 ${back ? "-110%" : "110%"}` }, { translate: "0 0" }], {
        duration: 360,
        easing: SPRING,
      })
    }
  }).observe(face, { attributes: true, attributeFilter: ["data-mood"] })

  // The resting mood: the one a press chose. Short moods go back to it.
  let rest = 0
  const go = (index: number) => {
    rest = (index + names.length) % names.length
    const mood = names[rest] ?? "smile"
    face.dataset.rest = mood
    showMood(face, mood)
  }

  // "Play all moods" shows every mood in turn, and stops at the smile.
  const play = find<HTMLButtonElement>("[data-stage-play]")
  const label = play?.textContent ?? ""
  let playing = 0
  const stop = () => {
    if (!playing) return
    clearInterval(playing)
    playing = 0
    if (play) play.textContent = label
  }
  play?.addEventListener("click", () => {
    if (playing) return stop()
    play.textContent = play.dataset.stop ?? label
    go(rest + 1)
    playing = window.setInterval(() => {
      go(rest + 1)
      if (rest === 0) stop()
    }, 1150)
  })
  find("[data-stage-next]")?.addEventListener("click", () => {
    stop()
    go(rest + 1)
  })
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return
    event.preventDefault()
    stop()
    go(rest + (event.key === "ArrowRight" ? 1 : -1))
  })

  // Where the face is, from the middle of the stage, and how fast it moves (pixels a second).
  const pos = { x: 0, y: 0 }
  const vel = { x: 0, y: 0 }
  const apply = () => {
    body.style.translate = `${pos.x.toFixed(1)}px ${pos.y.toFixed(1)}px`
    body.style.rotate = `${(pos.x * 0.05 + vel.x * 0.006).toFixed(2)}deg`
    // The face is longer along the line it moves on.
    const stretch = Math.min(0.14, Math.hypot(vel.x, vel.y) / 9000)
    const angle = Math.atan2(vel.y, vel.x)
    button.style.transform =
      stretch > 0.004
        ? `rotate(${angle}rad) scale(${1 + stretch}, ${1 - stretch}) rotate(${-angle}rad)`
        : ""
  }
  let frame = 0
  let last = 0
  const spring = (now: number) => {
    const step = Math.min(0.032, (now - last) / 1000 || 0.016)
    last = now
    vel.x += (-170 * pos.x - 9 * vel.x) * step
    vel.y += (-170 * pos.y - 9 * vel.y) * step
    pos.x += vel.x * step
    pos.y += vel.y * step
    const home = Math.hypot(pos.x, pos.y) < 0.4 && Math.hypot(vel.x, vel.y) < 8
    if (home) pos.x = pos.y = vel.x = vel.y = 0
    apply()
    frame = home ? 0 : requestAnimationFrame(spring)
  }

  // The pull. `far` is the longest distance of this pull: under 6 pixels it is a press.
  let pull: { id: number; x: number; y: number; time: number; far: number } | undefined
  let pulled = false
  if (!still) {
    button.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return
      cancelAnimationFrame(frame)
      frame = 0
      pull = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        far: 0,
      }
      button.setPointerCapture(event.pointerId)
    })
    button.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pull?.id) return
      const step = Math.max(1, event.timeStamp - pull.time) / 1000
      const moveX = event.clientX - pull.x
      const moveY = event.clientY - pull.y
      vel.x = vel.x * 0.5 + (moveX / step) * 0.5
      vel.y = vel.y * 0.5 + (moveY / step) * 0.5
      pull.x = event.clientX
      pull.y = event.clientY
      pull.time = event.timeStamp
      // The face is harder to pull near the edge of the stage.
      const limitX = root.clientWidth / 2
      const limitY = root.clientHeight / 2
      pos.x += moveX * (1 - Math.min(0.92, Math.abs(pos.x) / limitX) ** 2)
      pos.y += moveY * (1 - Math.min(0.92, Math.abs(pos.y) / limitY) ** 2)
      const far = Math.hypot(pos.x, pos.y)
      if (far > 6 && pull.far <= 6) {
        stop()
        showMood(face, "wow")
      }
      pull.far = Math.max(pull.far, far)
      apply()
    })
    const release = (event: PointerEvent) => {
      if (event.pointerId !== pull?.id) return
      // A pointer that stood still before the release throws nothing.
      if (event.timeStamp - pull.time > 90) vel.x = vel.y = 0
      if (pull.far > 6) {
        const hard =
          Math.hypot(vel.x, vel.y) > 1100 || Math.hypot(pos.x, pos.y) > root.clientWidth * 0.28
        showMood(face, hard ? "dizzy" : "laugh", hard ? 1900 : 1000)
        // The click that follows this release is not a press.
        pulled = true
        window.setTimeout(() => (pulled = false), 60)
      }
      pull = undefined
      last = performance.now()
      frame ||= requestAnimationFrame(spring)
    }
    button.addEventListener("pointerup", release)
    button.addEventListener("pointercancel", release)
  }
  button.addEventListener("click", () => {
    if (pulled) return
    stop()
    go(rest + 1)
  })

  look(face, root, 240, () => ["sleepy", "dizzy"].includes(face.dataset.mood ?? ""))

  // The rings: dots in circles around the face, which move out slowly.
  const DOT = 3
  const box = rings.parentElement!
  let color = inkOf(box)
  let values = new Float32Array(0)
  const draw = (time: number) => {
    const { columns, rows } = fit(rings, DOT)
    if (values.length !== columns * rows) values = new Float32Array(columns * rows)
    const middleX = columns / 2 + pos.x / DOT
    const middleY = rows / 2 + pos.y / DOT
    const reach = Math.hypot(columns, rows) * 0.6
    // About five rings fit a small stage, and they are no wider than 26 dots on a large one.
    const pitch = (2 * Math.PI) / Math.min(26, Math.min(columns, rows) * 0.22)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const distance = Math.hypot(x - middleX, y - middleY)
        const fade = 1 - Math.max(0, Math.min(1, (distance - reach * 0.2) / (reach * 0.8)))
        const ring = 0.5 + 0.5 * Math.cos(distance * pitch - time * 1.5)
        let value = 0.46 * fade * fade * ring * ring
        for (const start of ripples) {
          const age = time - start
          if (age < 0 || age > 1.3) continue
          const gap = (distance - age * 140) / 6
          value += 0.85 * (1 - age / 1.3) * Math.exp(-gap * gap)
        }
        values[y * columns + x] = value
      }
    }
    paint(rings, values, columns, rows, color)
  }
  draw(0)
  new ResizeObserver(() => draw(still ? 0 : seconds())).observe(root)
  onThemeChange(() => {
    color = inkOf(box)
    draw(still ? 0 : seconds())
  })
  if (still) return
  let onScreen = false
  new IntersectionObserver(([entry]) => (onScreen = entry!.isIntersecting)).observe(root)
  animate(root, draw, 24)

  // A blink, every few seconds. Shut eyes and dark glasses do not blink.
  const blink = () => {
    window.setTimeout(blink, 2600 + Math.random() * 3400)
    const mood = face.dataset.mood ?? ""
    if (!onScreen || document.hidden || pull || ["sleepy", "dizzy", "cool", ""].includes(mood)) {
      return
    }
    for (const eye of face.querySelectorAll(`[data-m="${mood}"] > .eye`)) {
      eye.animate([{ scale: "1 1" }, { scale: "1 0.08" }, { scale: "1 1" }], {
        duration: 190,
        easing: "ease-in-out",
      })
    }
  }
  window.setTimeout(blink, 3200)
}

/**
 * The moods. A tile plays its move under the pointer and under the keyboard focus. When the
 * list enters the view, the moves play one after another. A press also puts the mood in the
 * tab icon of this page.
 */
function moodTiles() {
  const grid = find("[data-mood-grid]")
  if (!grid) return
  const note = find("[data-mood-note]")
  const tiles = all("[data-mood-tile]", grid)
  const icons = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]')
  const plays: (() => void)[] = []
  for (const tile of tiles) {
    const face = faces(tile)[0]
    const mood = tile.dataset.moodTile
    if (!face || !mood) continue
    const play = () => showMood(face, mood)
    plays.push(play)
    tile.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") play()
    })
    tile.addEventListener("focus", () => {
      if (tile.matches(":focus-visible")) play()
    })
    tile.addEventListener("click", () => {
      play()
      for (const other of tiles) other.setAttribute("aria-pressed", String(other === tile))
      const file = fileOf(face, { round: true })
      for (const icon of icons) {
        icon.removeAttribute("sizes")
        icon.type = "image/svg+xml"
        icon.href = file
      }
      if (note) note.textContent = `The tab icon shows “${mood}” now.`
    })
  }
  if (still) return
  // The faces pop in 55 ms apart (`gri.css`). Each move starts as its face lands.
  near(grid, () => {
    plays.forEach((play, index) => window.setTimeout(play, 280 + index * 55))
  })
}

/** The layers: a row of the list makes the other layers faint. A press keeps it. */
function layers() {
  const root = find("[data-layers]")
  if (!root) return
  const sheets = all("[data-layer]", root)
  const buttons = all("[data-layer-pick]", root)
  let kept: string | undefined
  const pick = (name = kept) => {
    if (name) root.dataset.active = name
    else delete root.dataset.active
    for (const sheet of sheets) sheet.classList.toggle("is-active", sheet.dataset.layer === name)
  }
  for (const button of buttons) {
    const name = button.dataset.layerPick
    button.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") pick(name)
    })
    button.addEventListener("pointerleave", () => pick())
    button.addEventListener("focus", () => pick(name))
    button.addEventListener("blur", () => pick())
    button.addEventListener("click", () => {
      kept = kept === name ? undefined : name
      for (const other of buttons) {
        other.setAttribute("aria-pressed", String(other.dataset.layerPick === kept))
      }
      pick()
    })
  }
}

/**
 * The mixer: a face with the eyes of one mood, the mouth of a second and the marks of a
 * third. "Mix a face" spins three reels, which stop one after another. The address holds the
 * face (`#wink.laugh.love`), so a link opens the same one.
 */
function mixer() {
  const root = find("[data-mixer]")
  const face = root && faces(root)[0]
  if (!root || !face) return
  const turns: Record<string, number> = JSON.parse(root.dataset.turns ?? "{}")
  const reels = all("[data-reel]", root).map((element) => ({
    element,
    key: element.dataset.reel ?? "",
    moods: (element.dataset.reelMoods ?? "").split(","),
    value: find("[data-reel-value]", element),
    at: 0,
  }))
  type Reel = (typeof reels)[number]
  const number = find("[data-mix-number]", root)
  const buttons = all<HTMLButtonElement>("button", root)
  // The address changes only after the reader changed the face.
  let touched = false
  const sync = () => {
    const count = reels.reduce((total, reel) => total * reel.moods.length + reel.at, 0)
    if (number) number.textContent = String(count + 1).padStart(4, "0")
    if (touched) {
      history.replaceState(null, "", `#${reels.map((reel) => reel.moods[reel.at]).join(".")}`)
    }
  }
  /** Show the mood at `at` on `reel`. A reel that still spins shows it for a moment only. */
  const set = (reel: Reel, at: number, direction = 1, last = true) => {
    reel.at = (at + reel.moods.length) % reel.moods.length
    const mood = reel.moods[reel.at] ?? "smile"
    face.dataset.live = ""
    face.dataset[reel.key] = mood
    // The head takes the pose of the mood that gives the eyes.
    if (reel.key === "eyes" && last) face.style.setProperty("--gri-turn", `${turns[mood] ?? -5}deg`)
    if (!reel.value) return
    reel.value.textContent = mood
    if (!still) {
      reel.value.animate(
        [{ translate: `0 ${direction > 0 ? "100%" : "-100%"}` }, { translate: "0 0" }],
        last ? { duration: 340, easing: SPRING } : { duration: 80 },
      )
    }
  }
  const bob = () => {
    if (still) return
    face
      .querySelector(".hm")
      ?.animate([{ translate: "0 0" }, { translate: "0 -5px" }, { translate: "0 0" }], {
        duration: 260,
        easing: "ease-out",
      })
  }

  for (const reel of reels) {
    for (const button of all("[data-reel-step]", reel.element)) {
      const direction = Number(button.dataset.reelStep)
      button.addEventListener("click", () => {
        touched = true
        set(reel, reel.at + direction, direction)
        sync()
      })
    }
  }

  let spinning = false
  find("[data-mix]", root)?.addEventListener("click", async () => {
    if (spinning) return
    spinning = true
    touched = true
    const ends = reels.map((reel) => {
      // A different mood on each reel, so every spin changes the whole face.
      const other = 1 + Math.floor(Math.random() * (reel.moods.length - 1))
      return (reel.at + other) % reel.moods.length
    })
    if (still) {
      reels.forEach((reel, index) => set(reel, ends[index] ?? 0))
    } else {
      for (const button of buttons) button.disabled = true
      await Promise.all(
        reels.map(async (reel, index) => {
          for (let step = 0; step < 6 + index * 5; step++) {
            set(reel, reel.at + 1, 1, false)
            await wait(70)
          }
          set(reel, ends[index] ?? 0)
          bob()
        }),
      )
      for (const button of buttons) button.disabled = false
    }
    sync()
    spinning = false
  })

  const share = find("[data-mix-copy]", root)
  const shareText = share && find("span", share)
  const shareLabel = shareText?.textContent ?? ""
  share?.addEventListener("click", async () => {
    touched = true
    sync()
    if (!shareText || !(await copy(location.href))) return
    shareText.textContent = share.dataset.done ?? shareLabel
    window.setTimeout(() => (shareText.textContent = shareLabel), 1400)
  })

  // A link to a face: show it, and bring the mixer into view.
  const named = location.hash.slice(1).split(".")
  const places = named.map((mood, index) => reels[index]?.moods.indexOf(mood) ?? -1)
  if (named.length === reels.length && !places.includes(-1)) {
    reels.forEach((reel, index) => set(reel, places[index] ?? 0))
    touched = true
    sync()
    root.scrollIntoView({ block: "center" })
  }
}

/**
 * Gri in dots: the drawing on a dark plate, as light dots. The pointer is a light: the dots
 * are dense near it. Without a pointer, the light moves by itself. A new mood develops from
 * coarse dots to fine ones, as the pictures of this site do.
 */
function dots() {
  const root = find("[data-dots]")
  const plate = root && find("[data-dots-plate]", root)
  const canvas = plate?.querySelector("canvas")
  // The drawings of the mood tiles are the source: each holds one mood.
  const sources = all("[data-mood-tile]").flatMap((tile) => [...faces(tile)])
  if (!root || !plate || !canvas || !sources.length) return
  const size = find<HTMLInputElement>("[data-dots-size]", root)
  const pad = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!

  let px = Number(size?.value) || 3
  /** The dots are this many times larger while a mood develops. */
  let coarse = 1
  let at = 0
  let image: HTMLImageElement | undefined
  let grid = { columns: 0, rows: 0 }
  /** For each dot: how much of it the head covers, how light the head is there, and its color. */
  let cover = new Float32Array(0)
  let light = new Float32Array(0)
  let tint = new Uint8ClampedArray(0)
  let amber = toRgba(getComputedStyle(plate).accentColor || "#eab308")
  /** The light, as parts of the plate. `to` is the pointer; without one, the light wanders. */
  const lamp = { x: 0.84, y: 0.45 }
  let to: { x: number; y: number } | undefined

  const sample = () => {
    grid = fit(canvas, px * coarse)
    const { columns, rows } = grid
    pad.canvas.width = columns
    pad.canvas.height = rows
    pad.clearRect(0, 0, columns, rows)
    // The box of the drawing is as high as the plate, so its round ground fits.
    const side = Math.min(columns, rows)
    if (image) pad.drawImage(image, (columns - side) / 2, (rows - side) / 2, side, side)
    tint = pad.getImageData(0, 0, columns, rows).data
    cover = new Float32Array(columns * rows)
    light = new Float32Array(columns * rows)
    for (let index = 0; index < cover.length; index++) {
      const from = index * 4
      cover[index] = tint[from + 3]! / 255
      // The strongest channel, so a red heart is as dense as the paper, and ink is empty.
      light[index] = Math.max(tint[from]!, tint[from + 1]!, tint[from + 2]!) / 255
    }
  }
  /**
   * The drawing in its own colors. The head is dots of the color at each place, more of them
   * where the color is light: the dark plate shows where the drawing is ink. The round ground
   * is amber dots. Past the ground, dots show only near the light.
   */
  const draw = (time: number) => {
    const { columns, rows } = grid
    if (!columns || cover.length !== columns * rows) return
    if (!still) {
      const goal = to ?? {
        x: 0.5 + 0.34 * Math.cos(time * 0.55),
        y: 0.45 + 0.3 * Math.sin(time * 0.8),
      }
      lamp.x += (goal.x - lamp.x) * 0.25
      lamp.y += (goal.y - lamp.y) * 0.25
    }
    const reach = Math.min(columns, rows) * 0.42
    const ground = Math.min(columns, rows) * 0.47
    const context = canvas.getContext("2d")!
    const output = context.createImageData(columns, rows)
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const index = y * columns + x
        const glow = Math.exp(
          -(((x - lamp.x * columns) / reach) ** 2 + ((y - lamp.y * rows) / reach) ** 2),
        )
        const head = cover[index]! > 0.5
        const inside = Math.hypot(x + 0.5 - columns / 2, y + 0.5 - rows / 2) < ground
        const value = head
          ? light[index]! * (0.66 + 0.5 * glow)
          : inside
            ? 0.42 + 0.55 * glow
            : 0.04 + 0.5 * glow * glow
        if (value * 255 <= threshold(x, y)) continue
        if (head) output.data.set(tint.subarray(index * 4, index * 4 + 3), index * 4)
        else output.data.set(amber, index * 4)
        output.data[index * 4 + 3] = 255
      }
    }
    context.putImageData(output, 0, 0)
  }
  const show = async (index: number) => {
    at = (index + sources.length) % sources.length
    const picture = new Image()
    picture.src = fileOf(sources[at]!, { ground: false })
    await picture.decode().catch(() => {})
    image = picture
    for (const step of still ? [1] : [4, 2, 1]) {
      coarse = step
      sample()
      draw(still ? 0 : seconds())
      if (step > 1) await wait(110)
    }
  }
  const redraw = () => {
    sample()
    draw(still ? 0 : seconds())
  }

  // Nothing is drawn until the plate comes near the view.
  near(
    plate,
    async () => {
      await show(0)
      new ResizeObserver(redraw).observe(plate)
      onThemeChange(() => {
        amber = toRgba(getComputedStyle(plate).accentColor || "#eab308")
        redraw()
      })
      if (still) return
      animate(plate, draw, 20)
      plate.addEventListener("pointermove", (event) => {
        const box = plate.getBoundingClientRect()
        to = {
          x: (event.clientX - box.left) / box.width,
          y: (event.clientY - box.top) / box.height,
        }
      })
      for (const type of ["pointerleave", "pointercancel"]) {
        plate.addEventListener(type, () => (to = undefined))
      }
    },
    "400px 0px",
  )
  size?.addEventListener("input", () => {
    px = Number(size.value) || 3
    redraw()
  })
  find("[data-dots-next]", root)?.addEventListener("click", () => void show(at + 1))
  plate.addEventListener("click", () => void show(at + 1))
}

/** The family, and where Gri lives: the small live copies of each face and place. */
function places() {
  for (const area of all("[data-look-area]")) {
    const face = faces(area)[0]
    if (face) look(face, area, 150)
  }

  // A face that plays one mood while the pointer is on its card, and on a press.
  for (const holder of all("[data-replay]")) {
    const face = faces(holder)[0]
    const mood = holder.dataset.replay
    const card = holder.closest<HTMLElement>(".gri-place")
    if (!face || !mood || !card) continue
    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse") showMood(face, mood)
    })
    card.addEventListener("pointerleave", () => {
      if (face.dataset.mood !== "smile") showMood(face, "smile")
    })
    holder.addEventListener("click", () => showMood(face, mood, 1400))
    if (!still) near(card, () => showMood(face, mood, 1400))
  }

  // "Change the theme" asks the theme toggle for the other theme (`theme-toggle.astro`).
  find("[data-theme-flip]")?.addEventListener("click", () => {
    const root = document.documentElement
    const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const next = (root.dataset.theme ?? system) === "dark" ? "light" : "dark"
    document.dispatchEvent(new CustomEvent("theme:set", { detail: next }))
  })

  // Two tabs. Gri sleeps while the other tab is the one in front.
  const tabs = find("[data-tabs]")
  const tabFace = tabs && faces(tabs)[0]
  if (tabs && tabFace) {
    const buttons = all("[data-tab]", tabs)
    for (const button of buttons) {
      button.addEventListener("click", () => {
        const awake = button.dataset.tab === "gri"
        if (awake === tabs.hasAttribute("data-awake")) return
        tabs.toggleAttribute("data-awake", awake)
        for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
        showMood(tabFace, awake ? "smile" : "sleepy")
      })
    }
  }

  // The terminal: the command types itself, and then the face draws in rows of pixels.
  const terminal = find("[data-terminal]")
  const text = terminal && find("[data-terminal-text]", terminal)
  const pixels = terminal?.querySelector<HTMLCanvasElement>("[data-terminal-face]")
  const smile = faces(find("[data-mood-tile]") ?? document.createElement("div"))[0]
  if (terminal && text && pixels && smile) {
    const picture = new Image()
    picture.src = fileOf(smile)
    void picture
      .decode()
      .then(() => pixels.getContext("2d")?.drawImage(picture, 0, 0, pixels.width, pixels.height))
      .catch(() => {})
    const command = text.textContent ?? ""
    if (still) {
      terminal.classList.add("is-typed")
    } else {
      text.textContent = ""
      near(terminal, async () => {
        await wait(300)
        for (const letter of command) {
          text.textContent += letter
          await wait(45 + Math.random() * 70)
        }
        await wait(250)
        terminal.classList.add("is-typed")
      })
    }
  }
}

/** The colors: a press copies the value, and the value says so for a moment. */
function colors() {
  for (const button of all("[data-color]")) {
    const value = button.dataset.color ?? ""
    const code = find("[data-color-value]", button)
    button.addEventListener("click", async () => {
      if (!code || !(await copy(value))) return
      code.textContent = "Copied"
      window.setTimeout(() => (code.textContent = value), 1300)
    })
  }
}

/** Cloth for Nia: a press gives every hijab on the page that color. */
function cloths() {
  const buttons = all("[data-cloth]")
  for (const button of buttons) {
    button.addEventListener("click", () => {
      for (const other of buttons) other.setAttribute("aria-pressed", String(other === button))
      // The attributes change, not a style: a copy of a drawing keeps them (`fileOf`).
      for (const cloth of document.querySelectorAll(".cloth")) {
        cloth.setAttribute("fill", button.dataset.cloth ?? "")
      }
      for (const hem of document.querySelectorAll(".hem")) {
        hem.setAttribute("stroke", button.dataset.hem ?? "")
      }
    })
  }
}

stage()
moodTiles()
layers()
mixer()
dots()
places()
cloths()
colors()
