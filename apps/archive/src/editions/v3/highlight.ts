import Prism from "prismjs"
import loadLanguages from "prismjs/components/index.js"

export { assetUrl } from "../_kit/assets"

loadLanguages(["jsx", "typescript", "json", "bash"])

const ALIASES: Record<string, string> = { js: "javascript", ts: "typescript", sh: "bash" }

/** gatsby-remark-prismjs markup: `.gatsby-highlight > pre.language-x > code.language-x`. */
export function highlight(code: string, language = "text") {
  const lang = ALIASES[language] ?? language
  const grammar = Prism.languages[lang]
  const html = grammar
    ? Prism.highlight(code, grammar, lang)
    : code.replace(/[&<>]/g, (char) => `&#${char.charCodeAt(0)};`)
  return `<div class="gatsby-highlight" data-language="${lang}"><pre class="language-${lang}"><code class="language-${lang}">${html}</code></pre></div>`
}
