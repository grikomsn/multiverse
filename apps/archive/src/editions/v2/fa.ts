import type { IconDefinition } from "@fortawesome/free-brands-svg-icons"

/** The SVG markup react-fontawesome 0.1 rendered for a Font Awesome 5 icon. */
export function faSvg(icon: IconDefinition, options: { fixedWidth?: boolean; size?: "3x" } = {}) {
  const [width, height, , , path] = icon.icon
  const units = Math.ceil((width / height) * 16)
  const classes = [
    "svg-inline--fa",
    `fa-${icon.iconName}`,
    `fa-w-${units}`,
    options.fixedWidth && "fa-fw",
    options.size && `fa-${options.size}`,
  ].filter(Boolean)
  const style = options.fixedWidth ? "" : ` style="width:${units / 16}em"`
  const d = Array.isArray(path) ? path.join(" ") : path
  return `<svg aria-hidden="true" data-prefix="${icon.prefix}" data-icon="${icon.iconName}" class="${classes.join(" ")}"${style} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path fill="currentColor" d="${d}"></path></svg>`
}
