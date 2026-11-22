import type { ShikiConfig } from "astro"

/** v7's Prism theme (components/markdown/prism-theme.ts, react-syntax-highlighter's atomDark). */
export const atomDark: ShikiConfig["theme"] = {
  name: "prism-atom-dark",
  type: "dark",
  colors: { "editor.background": "#1d1f21", "editor.foreground": "#c5c8c6" },
  tokenColors: [
    { settings: { foreground: "#c5c8c6", background: "#1d1f21" } },
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#7C7C7C" } },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "entity.name.tag",
        "support.type.property-name",
        "meta.object-literal.key",
      ],
      settings: { foreground: "#96CBFE" },
    },
    {
      scope: ["entity.name.type", "entity.name.class", "support.class"],
      settings: { foreground: "#FFFFB6", fontStyle: "underline" },
    },
    {
      scope: ["constant.language", "constant.language.boolean", "variable.other.constant"],
      settings: { foreground: "#99CC99" },
    },
    { scope: ["constant.numeric"], settings: { foreground: "#FF73FD" } },
    {
      scope: [
        "string",
        "punctuation.definition.string",
        "string.template",
        "entity.other.attribute-name",
        "support.function.builtin",
        "markup.inserted",
      ],
      settings: { foreground: "#A8FF60" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter"],
      settings: { foreground: "#C6C5FE" },
    },
    { scope: ["keyword.operator"], settings: { foreground: "#EDEDED" } },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call"],
      settings: { foreground: "#DAD085" },
    },
    { scope: ["string.regexp"], settings: { foreground: "#E9C062" } },
    { scope: ["punctuation"], settings: { foreground: "#c5c8c6" } },
  ],
}
