import js from "@eslint/js"
import prettier from "eslint-config-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"

/** Base flat config for TypeScript packages. Formatting is Prettier's job. */
export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/.astro/**",
      "**/.sanity/**",
      "**/.wrangler/**",
      "**/sanity.types.ts",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  prettier,
)
