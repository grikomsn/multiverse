import astro from "eslint-plugin-astro"
import tseslint from "typescript-eslint"

import base from "./index.js"

export default tseslint.config(...base, ...astro.configs.recommended)
