/**
 * Changes the mood of a Gri drawing in the page (`gri.astro`). Browser code.
 *
 * `data-mood` on the <svg> is the mood that shows. `data-rest` is the mood it goes back to
 * after a short one; without it, that is the smile. `data-live` turns the moves on (`gri.css`).
 */
const timers = new WeakMap<Element, number>()

/** Every Gri drawing inside `scope`. */
export const faces = (scope: ParentNode = document) =>
  scope.querySelectorAll<SVGSVGElement>("svg.gri")

/** Whether the drawing holds `mood`. A small drawing holds only the moods its page needs. */
export const hasMood = (face: SVGSVGElement, mood: string) =>
  face.querySelector(`[data-m="${mood}"]`) !== null

/**
 * Shows `mood` and plays its move, also when the mood shows already. With `ms`, the drawing
 * goes back to its resting mood after that time.
 */
export function showMood(face: SVGSVGElement, mood: string, ms?: number) {
  if (!hasMood(face, mood)) return
  // An animation starts when its element shows. So hide every mood, let the browser see that,
  // and then show the new one.
  face.dataset.live = ""
  face.dataset.mood = ""
  void face.getBoundingClientRect()
  face.dataset.mood = mood
  clearTimeout(timers.get(face))
  if (ms) {
    timers.set(
      face,
      window.setTimeout(() => showMood(face, face.dataset.rest ?? "smile"), ms),
    )
  }
}
