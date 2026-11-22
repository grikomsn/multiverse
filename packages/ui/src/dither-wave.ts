/**
 * The hero backdrop: the "wave" shape of the Paper dithering shader in the accent color.
 *
 * The shader package loads after the page is idle, so it never delays the first paint. The
 * canvas fades in when its first frame is ready. Without WebGL the host stays empty, and the
 * page looks as it did before. With reduced motion the wave is a still picture.
 */
import { onThemeChange, reducedMotion, toRgba } from "./dither"

/** Dot size in CSS pixels, wave size, and loop speed. Chosen on 2026-11-22. */
const DOT = 3
const SCALE = 1.4
const SPEED = 0.3
/** How far the wave leans toward the pointer, as a part of the host's size. */
const LEAN = 0.12

export async function mountDitherWave(host: HTMLElement) {
  if (!document.createElement("canvas").getContext("webgl2")) return
  const {
    ShaderMount,
    ditheringFragmentShader,
    DitheringShapes,
    DitheringTypes,
    ShaderFitOptions,
    defaultPatternSizing,
  } = await import("@paper-design/shaders")

  // The host's text color is the ink: `color: var(--color-accent)` in CSS.
  const ink = () => toRgba(getComputedStyle(host).color).map((part) => part / 255)
  const still = reducedMotion()
  let mount: InstanceType<typeof ShaderMount>
  try {
    mount = new ShaderMount(
      host,
      ditheringFragmentShader,
      {
        u_colorBack: [0, 0, 0, 0],
        u_colorFront: ink(),
        u_shape: DitheringShapes.wave,
        u_type: DitheringTypes["4x4"],
        u_pxSize: DOT,
        u_fit: ShaderFitOptions[defaultPatternSizing.fit],
        u_scale: SCALE,
        u_rotation: 0,
        u_offsetX: 0,
        u_offsetY: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0,
      },
      { alpha: true, premultipliedAlpha: true },
      still ? 0 : SPEED,
      // A fixed start frame: the still picture under reduced motion is a good one.
      24_000,
      1,
      // Room for a band as wide as a large window at 2× density: a smaller limit blurs the dots.
      6_000_000,
    )
  } catch {
    return
  }
  requestAnimationFrame(() => host.classList.add("is-ready"))
  onThemeChange(() => mount.setUniforms({ u_colorFront: ink() }))

  // The wave leans a little toward the pointer, on devices that have one.
  const area = host.closest<HTMLElement>("[data-dither-area]")
  if (!area || still || !matchMedia("(hover: hover) and (pointer: fine)").matches) return
  let x = 0
  let y = 0
  let targetX = 0
  let targetY = 0
  let frame = 0
  const step = () => {
    x += (targetX - x) * 0.08
    y += (targetY - y) * 0.08
    mount.setUniforms({ u_offsetX: x, u_offsetY: y })
    const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.0005
    frame = moving ? requestAnimationFrame(step) : 0
  }
  area.addEventListener(
    "pointermove",
    (event) => {
      const box = area.getBoundingClientRect()
      targetX = ((event.clientX - box.left) / box.width - 0.5) * -LEAN
      targetY = ((event.clientY - box.top) / box.height - 0.5) * LEAN
      if (!frame) frame = requestAnimationFrame(step)
    },
    { passive: true },
  )
}

/** Start every wave on the page once the browser is idle. */
export function startDitherWaves() {
  const hosts = document.querySelectorAll<HTMLElement>("[data-dither-wave]")
  if (hosts.length === 0) return
  const start = () => hosts.forEach((host) => void mountDitherWave(host))
  if ("requestIdleCallback" in window) requestIdleCallback(start, { timeout: 1500 })
  else setTimeout(start, 200)
}
