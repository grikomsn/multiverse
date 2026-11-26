/**
 * Opens addresses and copies text in a browser: what Enter and `c` do on a row.
 * `scripts/build-web.ts` gives this file in place of `open.ts`, which starts programs.
 */
import type * as node from "../open"

/** Opens `url` in a new tab. False when the browser stopped it. */
export const openUrl: typeof node.openUrl = async (url) => {
  // The address comes from the card's facts. Open a page or a mail, and nothing that runs code.
  if (!/^(https?|mailto):/i.test(url)) return false
  // A mail address opens the mail program: it needs no tab, and a new tab would stay empty.
  if (url.startsWith("mailto:")) {
    location.href = url
    return true
  }
  // With "noopener" the call returns nothing, also for a tab that did open. So open an empty
  // tab, cut its tie to this page, and send it to the address.
  const tab = window.open("", "_blank")
  if (!tab) return false
  tab.opener = null
  tab.location.href = url
  return true
}

/** Copies `text`. "asked" when the browser did not allow it. */
export const copyText: typeof node.copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return "copied"
  } catch {
    return "asked"
  }
}
