export { assetUrl, assetSize } from "../_kit/assets"

export const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/2023a`

/** Site-relative links from the 2023 copy live under /2023a now. */
export const href = (value: string) => (value.startsWith("/") ? `${BASE}${value}` : value)
