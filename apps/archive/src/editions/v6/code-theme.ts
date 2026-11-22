import type { ShikiConfig } from "astro"

/** prism-react-renderer's `oceanicNext`, which v6's Snippet used, as a Shiki theme. */
const c = {
  char: "#D8DEE9",
  comment: "#999999",
  keyword: "#c5a5c5",
  primitive: "#5a9bcf",
  string: "#8dc891",
  variable: "#d7deea",
  boolean: "#ff8b50",
  punctuation: "#5FB3B3",
  tag: "#fc929e",
  function: "#79b6f2",
  className: "#FAC863",
}

export const oceanicNext: ShikiConfig["theme"] = {
  name: "prism-oceanic-next",
  type: "dark",
  colors: { "editor.background": "#282c34", "editor.foreground": "#ffffff" },
  tokenColors: [
    { settings: { foreground: "#ffffff", background: "#282c34" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: c.comment } },
    {
      scope: ["string", "punctuation.definition.string", "string.template"],
      settings: { foreground: c.string },
    },
    {
      scope: [
        "constant.numeric",
        "support.type.property-name",
        "meta.object-literal.key",
        "constant.other",
        "variable.other.constant",
      ],
      settings: { foreground: c.primitive },
    },
    {
      scope: ["constant.language.boolean", "constant.language"],
      settings: { foreground: c.boolean },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.control",
        "entity.other.attribute-name",
      ],
      settings: { foreground: c.keyword },
    },
    { scope: ["entity.name.tag", "keyword.operator"], settings: { foreground: c.tag } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: c.function },
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.class", "support.type"],
      settings: { foreground: c.className },
    },
    {
      scope: ["punctuation", "meta.brace", "punctuation.separator", "punctuation.terminator"],
      settings: { foreground: c.punctuation },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: c.variable },
    },
    {
      scope: ["support.constant", "entity.name.selector", "markup.inserted"],
      settings: { foreground: c.char },
    },
  ],
}
