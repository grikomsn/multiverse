/**
 * Node's two global names, for code that uses them with no import. `page.ts` imports this
 * file first, so the names are there before any other code runs.
 */
import { Buffer } from "node:buffer"

import { process } from "./node"

Object.assign(globalThis, { process, Buffer })
