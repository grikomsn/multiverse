/**
 * The Chakra UI compile step, shared by the chakra-x.y toolchains. Chakra is CSS-in-JS, so
 * there is no stylesheet to ship. Instead this resolves an edition's styles with the version's
 * own theme, styled-system, CSS reset and Emotion serializer, and writes the result as static
 * CSS. Nothing from Chakra or React runs in the browser.
 *
 * In an edition stylesheet:
 *
 *   @chakra reset;            the version's <CSSReset />
 *   @chakra global;           theme.styles.global, for the edition's color mode
 *   @chakra vars;             the theme's --chakra-* custom properties (1.6 and later)
 *   .a { @chakra Button { variant: ghost; size: sm; } }
 *                             a component recipe (base style, size, variant), resolved as
 *                             useStyleConfig did; `Alert.title` picks one part, and
 *                             `only: variant` (or "base size", …) emits just those
 *                             layers; the component's own styles come with `base`
 *   .a { @chakra sx { px: 4; fontSize: ["md", null, "lg"]; _hover: { color: "yellow.300" }; } }
 *                             style props, as in the original JSX
 *   token(colors.gray.300)    a theme value, in any declaration or at-rule
 *
 * Declarations after an `@chakra` rule in the same block override it, like a `sx` prop.
 */
const PLACEHOLDER = ".__chakra__"

const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value)
const isFunction = (value) => typeof value === "function"
const runIfFn = (value, ...args) => (isFunction(value) ? value(...args) : value)

/** lodash `mergeWith` with Chakra's `mergeThemeCustomizer`, as `extendTheme` used it. */
function mergeTheme(target, source) {
  const out = { ...target }
  for (const [key, value] of Object.entries(source)) {
    const current = out[key]
    if (isFunction(current) || isFunction(value)) {
      out[key] = (...args) =>
        mergeTheme(runIfFn(current, ...args) ?? {}, runIfFn(value, ...args) ?? {})
    } else if (isObject(current) && isObject(value)) {
      out[key] = mergeTheme(current, value)
    } else {
      out[key] = value
    }
  }
  return out
}

/** `fontSize: ["md", null, "lg"]` style values: JSON-ish arrays and objects, numbers, strings. */
function parseValue(raw) {
  const value = raw.trim()
  if (/^[[{]/.test(value)) {
    return JSON.parse(
      value
        .replace(/'/g, '"')
        .replace(/([{,]\s*)([A-Za-z_$][\w$]*)\s*:/g, '$1"$2":')
        .replace(/,\s*([}\]])/g, "$1"),
    )
  }
  if (/^-?\d*\.?\d+$/.test(value)) return Number(value)
  return value.replace(/^["']|["']$/g, "")
}

/**
 * Styles Chakra's React components apply themselves (`__css`), under the theme's recipe. They
 * are not in @chakra-ui/theme, so they are transcribed here from each component's source;
 * a toolchain passes its version's table.
 */
const COMPONENT_CSS_V1 = {
  // @chakra-ui/button 1.x button.tsx
  Button: {
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 250ms",
    userSelect: "none",
    position: "relative",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    outline: "none",
    width: "auto",
  },
  // @chakra-ui/alert 1.x alert.tsx
  "Alert.container": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  // @chakra-ui/tag 1.x tag.tsx
  "Tag.container": {
    display: "inline-flex",
    verticalAlign: "top",
    alignItems: "center",
    maxWidth: "100%",
  },
  // @chakra-ui/modal 1.x ModalContent
  "Modal.dialog": {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    outline: 0,
  },
  // @chakra-ui/modal 1.x DrawerContent
  "Drawer.dialog": {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    width: "100%",
    outline: 0,
  },
  // @chakra-ui/layout 1.x code.tsx
  Code: { display: "inline-block" },
}

/** Chakra 2 moved Button's transition into the theme and dropped the `width: auto`. */
const COMPONENT_CSS_V2 = {
  ...COMPONENT_CSS_V1,
  Button: {
    display: "inline-flex",
    appearance: "none",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    position: "relative",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    outline: "none",
  },
}

/** The style object in an @chakra block. `_hover: { color: yellow.300; }` nests. */
function collect(container) {
  const out = {}
  container.each((node) => {
    if (node.type === "decl") out[node.prop] = parseValue(node.value)
    else if (node.type === "rule") out[node.selector.replace(/:$/, "").trim()] = collect(node)
  })
  return out
}

/**
 * @param {NodeJS.Require} localRequire the toolchain package's `require`
 * @param {{ cssVars: boolean, components?: Record<string, object> }} options whether this Chakra
 *   version resolves tokens to CSS vars, and its components' own styles (default: 1.x)
 * @returns {import("./types").Compile}
 */
module.exports = chakra
module.exports.COMPONENT_CSS_V1 = COMPONENT_CSS_V1
module.exports.COMPONENT_CSS_V2 = COMPONENT_CSS_V2

function chakra(localRequire, { cssVars, components = COMPONENT_CSS_V1 }) {
  const postcss = localRequire("postcss")
  const themeModule = localRequire("@chakra-ui/theme")
  const baseTheme = themeModule.theme ?? themeModule.default
  const styledSystem = localRequire("@chakra-ui/styled-system")
  const { serializeStyles } = localRequire("@emotion/serialize")
  const stylis = localRequire("stylis")
  const { CSSReset } = localRequire("@chakra-ui/css-reset")

  /** Emotion's serializer plus stylis, which is what <Global> and `css` did at runtime. */
  function toCss(selector, styles) {
    const { styles: body } = serializeStyles([styles])
    return stylis.serialize(stylis.compile(`${selector}{${body}}`), stylis.stringify)
  }

  function resetCss() {
    const element = CSSReset({})
    const styles = element.props.styles
    return typeof styles === "string" ? styles : serializeStyles([styles]).styles
  }

  return async function compile({ css: source, from, config: file }) {
    delete require.cache[file]
    const edition = require(file)
    const overrides = runIfFn(edition.theme ?? {}, baseTheme)
    let theme = mergeTheme(baseTheme, overrides)
    if (cssVars) theme = styledSystem.toCSSVar(theme)
    const colorMode = edition.colorMode ?? "light"
    const props = { theme, colorMode, colorScheme: edition.colorScheme }

    const resolve = (styles) => styledSystem.css(styles)(theme)

    /** `token(colors.gray.300)`: a CSS var where Chakra used one, else the raw value. */
    function token(value) {
      return value.replace(/token\(\s*([\w.-]+)\s*\)/g, (_, key) => {
        const [scale, ...rest] = key.split(".")
        const name = rest.join(".")
        const mapped = cssVars && scale !== "breakpoints" && theme.__cssMap?.[key]
        if (mapped) return mapped.varRef
        const found = name.split(".").reduce((node, part) => node?.[part], theme[scale])
        const direct = theme[scale]?.[name]
        const result = direct ?? found
        if (result === undefined) throw new Error(`${from}: unknown Chakra token ${key}`)
        return String(result)
      })
    }

    function recipe(name, options) {
      const [component, part] = name.split(".")
      const config = theme.components[component]
      if (!config) throw new Error(`${from}: no Chakra component ${component}`)
      const { only, ...rest } = options
      const p = { ...props, ...config.defaultProps, ...rest }
      if (edition.colorScheme && !rest.colorScheme) p.colorScheme = edition.colorScheme
      const layers = {
        base: runIfFn(config.baseStyle, p) ?? {},
        size: runIfFn(config.sizes?.[p.size], p) ?? {},
        variant: runIfFn(config.variants?.[p.variant], p) ?? {},
      }
      const picked = only ? String(only).split(/[\s,]+/) : ["base", "size", "variant"]
      const styles = picked.reduce((merged, layer) => mergeTheme(merged, layers[layer]), {})
      const themed = part ? (styles[part] ?? {}) : styles
      return picked.includes("base") ? mergeTheme(components[name] ?? {}, themed) : themed
    }

    /** Replaces an @chakra rule with the CSS it stands for. */
    function expand(atRule) {
      const [kind, ...rest] = atRule.params.trim().split(/\s+/)
      const options = collect(atRule)

      if (atRule.parent.type === "root") {
        let output
        if (kind === "reset") output = resetCss()
        else if (kind === "global") {
          const global = resolve(runIfFn(theme.styles.global, props) ?? {})
          output = Object.entries(global)
            .map(([selector, styles]) => toCss(selector.replace(/&/g, ""), styles))
            .join("")
        } else if (kind === "vars") {
          if (!theme.__cssVars) throw new Error(`${from}: this Chakra version has no CSS vars`)
          output = toCss(":host, :root", theme.__cssVars)
        } else throw new Error(`${from}: @chakra ${kind} needs to sit inside a rule`)
        atRule.replaceWith(postcss.parse(output).nodes)
        return
      }

      const styles = kind === "sx" ? options : recipe(kind, options)
      if (rest.length) throw new Error(`${from}: unexpected "${rest.join(" ")}" in @chakra ${kind}`)
      const output = postcss.parse(toCss(PLACEHOLDER, resolve(styles)))
      const parent = atRule.parent
      const parentSelectors = parent.selectors
      const own = []
      const extra = []
      output.each((node) => {
        if (node.type === "rule" && node.selector === PLACEHOLDER) own.push(...node.nodes)
        else extra.push(node)
      })
      for (const node of extra) {
        node.walkRules?.((rule) => retarget(rule, parentSelectors))
        if (node.type === "rule") retarget(node, parentSelectors)
      }
      atRule.replaceWith(own.map((node) => node.clone()))
      parent.after(extra)
    }

    function retarget(rule, parentSelectors) {
      if (!rule.selector.includes(PLACEHOLDER)) return
      rule.selectors = rule.selectors.flatMap((selector) =>
        parentSelectors.map((parent) => selector.split(PLACEHOLDER).join(parent)),
      )
    }

    const root = postcss.parse(source, { from })
    const directives = []
    root.walkAtRules("chakra", (atRule) => {
      directives.push(atRule)
    })
    for (const atRule of directives) expand(atRule)
    root.walkDecls((decl) => {
      if (decl.value.includes("token(")) decl.value = token(decl.value)
    })
    root.walkAtRules((atRule) => {
      if (atRule.params.includes("token(")) atRule.params = token(atRule.params)
    })
    return { css: root.toString(), watch: [file], content: [] }
  }
}
