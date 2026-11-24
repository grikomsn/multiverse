import react from "@multiverse/config/eslint/react"

export default [
  ...react,
  {
    // A terminal program reads and tests escape codes, so its patterns hold control characters.
    rules: { "no-control-regex": "off" },
  },
]
