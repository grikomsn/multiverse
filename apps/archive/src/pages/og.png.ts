import { ogImage } from "@multiverse/ui/og"
import type { APIRoute } from "astro"

import { indexCard } from "../lib/og"

/* /og.png: the social card of the archive's index, drawn in the build. See `lib/og.ts`. */
export const GET: APIRoute = async () =>
  new Response(new Uint8Array(await ogImage(await indexCard())), {
    headers: { "Content-Type": "image/png" },
  })
