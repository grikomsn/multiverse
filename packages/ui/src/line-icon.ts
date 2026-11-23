/**
 * A Lucide icon (a string from `lucide-static`) as markup for a page: no fixed size, the
 * stroke of this design, and hidden from screen readers. `icon.astro` uses it at build time,
 * and the command bar uses it in the browser.
 */
export function lineIcon(svg: string, className = "size-4", stroke = 1.75) {
  return svg
    .replace(/\s*\n\s*/g, " ")
    .trim()
    .replace(/\s*class="[^"]*"/, "")
    .replace(/\s*width="24"\s*height="24"/, "")
    .replace('stroke-width="2"', `stroke-width="${stroke}"`)
    .replace("<svg", `<svg aria-hidden="true" focusable="false" class="shrink-0 ${className}"`)
}
