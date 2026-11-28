/**
 * Changes the mood of a mascot drawn in the page (`face.astro`). Browser code.
 *
 * `data-mood` on the <svg> is the mood that shows. `data-rest` is the mood it goes back to
 * after a short one; without it, that is the smile. `data-live` turns the moves on (`face.css`).
 */
import { reducedMotion } from "./dither"

const timers = new WeakMap<Element, number>()

/** Every Gri drawing inside `scope`. */
export const faces = (scope: ParentNode = document) =>
  scope.querySelectorAll<SVGSVGElement>("svg.gri")

/** Whether the drawing holds `mood`. A small drawing holds only the moods its page needs. */
export const hasMood = (face: SVGSVGElement, mood: string) =>
  face.querySelector(`[data-m="${mood}"]`) !== null

/**
 * Shows `mood` and plays its move, also when the mood shows already. With `ms`, the drawing
 * goes back to its resting mood after that time. A `soft` change fades the parts in and plays
 * no move (`face.css`): for a face that changes often, such as one of a few under a pointer.
 */
export function showMood(face: SVGSVGElement, mood: string, ms?: number, soft = false) {
  // A mixed face (`mix` in `face.astro`) shows parts of three moods, and has no mood to change.
  if (!hasMood(face, mood) || face.hasAttribute("data-eyes")) return
  // An animation starts when its element shows. So hide every mood, let the browser see that,
  // and then show the new one.
  face.dataset.live = ""
  face.toggleAttribute("data-soft", soft)
  face.dataset.mood = ""
  void face.getBoundingClientRect()
  face.dataset.mood = mood
  clearTimeout(timers.get(face))
  if (ms) {
    timers.set(
      face,
      window.setTimeout(() => showMood(face, face.dataset.rest ?? "smile", undefined, soft), ms),
    )
  }
}

/**
 * The head and the eyes of `face` lean toward the pointer while it is over `area`
 * (`--gri-look-x` and `--gri-look-y` in `face.css`). This is for a mouse, and reduced motion
 * stops it. `reach` is the distance in pixels at which the lean is full. A face does not look
 * while `quiet` is true. `ease` is the part of the way it moves in one frame: less is slower.
 */
export function look(
  face: SVGSVGElement,
  area: HTMLElement,
  reach: number,
  { quiet = () => false, ease = 0.2 }: { quiet?: () => boolean; ease?: number } = {},
) {
  if (reducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return
  const at = { x: 0, y: 0 }
  const to = { x: 0, y: 0 }
  let frame = 0
  const step = () => {
    at.x += (to.x - at.x) * ease
    at.y += (to.y - at.y) * ease
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
