/**
 * `npx grikomsn`: Griko Nibras in a terminal. Node.js starts here; the card is `main.tsx`.
 */
import { main } from "./main"

process.exitCode = await main(process.argv.slice(2))
