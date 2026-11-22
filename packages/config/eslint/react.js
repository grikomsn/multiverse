import reactHooks from "eslint-plugin-react-hooks"
import tseslint from "typescript-eslint"

import base from "./index.js"

export default tseslint.config(...base, reactHooks.configs.flat.recommended)
