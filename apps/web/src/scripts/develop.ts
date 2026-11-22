/**
 * Pictures that develop. A frame marked `data-develop` holds a tiny copy of its picture as a data
 * URI. The copy shows as coarse dots while the real file loads. When the frame is on screen the
 * dots get finer in a few steps, and then they fade to show the real picture.
 *
 * The frame needs `position: relative` and `overflow: hidden`, and one <img> inside.
 * With reduced motion, or without JavaScript, the picture loads as usual.
 */
import { coverage, fit, inkOf, paint, reducedMotion } from "@multiverse/ui/dither"

/** Dot sizes in CSS pixels, coarse to fine, and the time each one shows. */
const STEPS = [16, 10, 6, 4, 3]
const STEP_MS = 90
/** Frames that enter the view together start a little apart. */
const STAGGER_MS = 70

function draw(canvas: HTMLCanvasElement, source: HTMLImageElement, px: number) {
  const { columns, rows } = fit(canvas, px)
  paint(canvas, coverage(source, columns, rows, { tone: "light" }), columns, rows, inkOf(canvas))
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function develop(frame: HTMLElement, canvas: HTMLCanvasElement, source: HTMLImageElement) {
  for (const px of STEPS.slice(1)) {
    await wait(STEP_MS)
    draw(canvas, source, px)
  }
  const image = frame.querySelector("img")
  // A lazy image starts to load only near the view; wait for it, however long it takes.
  if (image && !image.complete) {
    await new Promise((resolve) => {
      image.addEventListener("load", resolve, { once: true })
      image.addEventListener("error", resolve, { once: true })
    })
  }
  await wait(STEP_MS * 2)
  canvas.classList.add("is-done")
  canvas.addEventListener("transitionend", () => canvas.remove(), { once: true })
}

export function startDevelop() {
  if (reducedMotion() || !("IntersectionObserver" in window)) return
  const ready = new Map<Element, () => void>()
  const observer = new IntersectionObserver(
    (entries) => {
      let order = 0
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        const start = ready.get(entry.target)
        if (start) setTimeout(start, order++ * STAGGER_MS)
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  )
  for (const frame of document.querySelectorAll<HTMLElement>("[data-develop]")) {
    const canvas = document.createElement("canvas")
    canvas.className = "develop"
    canvas.setAttribute("aria-hidden", "true")
    const source = new Image()
    source.src = frame.dataset.develop!
    source
      .decode()
      .then(() => {
        frame.append(canvas)
        draw(canvas, source, STEPS[0]!)
        ready.set(frame, () => void develop(frame, canvas, source))
        observer.observe(frame)
      })
      .catch(() => {})
  }
}
