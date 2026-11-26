/**
 * How many colors Ink's color library may use. Its own answer for a browser comes from the
 * browser's name, and only Chromium gets colors. The page's terminal has all of them in every
 * browser, so `scripts/build-web.ts` gives this file in place of that answer.
 */
const all = { level: 3, hasBasic: true, has256: true, has16m: true }

export default { stdout: all, stderr: all }
