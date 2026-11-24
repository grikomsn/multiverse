/**
 * Where the card's facts come from: a copy from the build, and today's copy from nibras.co.
 * The copy shows at once and works with no network; the site's copy replaces it when it comes.
 */
import { CARD_URL, isCard, type Card } from "@multiverse/content/card"

/** The build writes the card here (`scripts/build.ts`); `scripts/dev.ts` sets it for a run. */
declare const __CARD__: Card | undefined

export const builtCard = (): Card | undefined =>
  typeof __CARD__ === "undefined" ? undefined : __CARD__

/** Today's card from nibras.co, or nothing: offline, too slow, or a shape this code cannot read. */
export async function liveCard(wait = 3000): Promise<Card | undefined> {
  try {
    const response = await fetch(CARD_URL, {
      signal: AbortSignal.timeout(wait),
      headers: { Accept: "application/json" },
    })
    if (!response.ok) return undefined
    const card: unknown = await response.json()
    return isCard(card) ? card : undefined
  } catch {
    return undefined
  }
}
