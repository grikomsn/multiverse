import astro from "@multiverse/config/eslint/astro"

export default [
  ...astro,
  {
    // Toolchains and edition configs load period packages the way they did: CommonJS `require`.
    files: ["**/*.cjs"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
]
