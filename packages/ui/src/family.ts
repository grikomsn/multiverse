/**
 * The family of mascots: Gri, the mascot of the site, and the two faces next to him. Each has
 * a drawing of its own (`gri.ts`, `nia.ts`, `ash.ts`) and a page (`/gri`, `/nia`, `/ash`).
 */
import { ASH, ASH_PALETTE } from "./ash"
import type { Face } from "./face"
import { GRI, PALETTE } from "./gri"
import { NIA, NIA_PALETTE } from "./nia"

/** In the order of a family picture. */
export const FAMILY = {
  gri: { name: "Gri", path: "/gri", face: GRI, palette: PALETTE },
  nia: { name: "Nia", path: "/nia", face: NIA, palette: NIA_PALETTE },
  ash: { name: "Ash", path: "/ash", face: ASH, palette: ASH_PALETTE },
} as const satisfies Record<
  string,
  { name: string; path: string; face: Face; palette: Record<string, string> }
>

export type Who = keyof typeof FAMILY

export const WHO = Object.keys(FAMILY) as Who[]
