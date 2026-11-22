/**
 * v7's client behaviour without React: tinykeys-style `g x` sequences, the keybinds cheatsheet
 * (open state synced across tabs over BroadcastChannel, as `useCheatsheetSyncSetup` did), the
 * mobile menu modal, and copy buttons on code snippets.
 */
const BASE = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/v7`
const ROUTES: Record<string, string> = {
  h: "/",
  b: "/blog",
  a: "/appearances",
  p: "/projects",
  m: "/about",
}

export function initV7() {
  const menu = document.getElementById("v7-menu") as HTMLDialogElement | null
  const cheatsheet = document.getElementById("v7-cheatsheet") as HTMLDialogElement | null
  const toast = document.getElementById("v7-toast")
  const channel = "BroadcastChannel" in window ? new BroadcastChannel("state-cheatsheet") : null

  const setCheatsheet = (open: boolean, broadcast = true) => {
    if (!cheatsheet || cheatsheet.open === open) return
    if (open) cheatsheet.showModal()
    else cheatsheet.close()
    if (broadcast) channel?.postMessage({ state: open, ts: Date.now() })
  }
  channel?.addEventListener("message", (event: MessageEvent<{ state: boolean }>) =>
    setCheatsheet(event.data.state, false),
  )
  cheatsheet?.addEventListener("close", () =>
    channel?.postMessage({ state: false, ts: Date.now() }),
  )

  for (const dialog of [menu, cheatsheet]) {
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close()
    })
  }
  for (const button of document.querySelectorAll<HTMLElement>("[data-v7-open]")) {
    button.addEventListener("click", () => {
      if (button.dataset.v7Open === "menu") menu?.showModal()
      else setCheatsheet(true)
    })
  }

  let toastTimer: ReturnType<typeof setTimeout> | undefined
  const notify = (title: string) => {
    if (!toast) return
    toast.textContent = title
    toast.setAttribute("data-open", "")
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => toast.removeAttribute("data-open"), 3000)
  }

  let pendingG = 0
  window.addEventListener("keydown", (event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest("input, textarea, [contenteditable]")) return
    if (event.metaKey && event.code === "KeyK") {
      event.preventDefault()
      if (menu?.open) menu.close()
      else menu?.showModal()
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (event.key === "?") {
      setCheatsheet(!cheatsheet?.open)
      return
    }
    const route = ROUTES[event.key]
    if (route && Date.now() - pendingG < 1000) {
      pendingG = 0
      notify(`Navigating to ${route}`)
      location.href = `${BASE}${route}`
      return
    }
    pendingG = event.key === "g" ? Date.now() : 0
  })

  for (const button of document.querySelectorAll<HTMLButtonElement>(".v7-copy")) {
    button.addEventListener("click", () => {
      const code = button.parentElement?.querySelector("pre")?.textContent ?? ""
      void navigator.clipboard?.writeText(code)
      button.setAttribute("data-copied", "")
      button.setAttribute("aria-label", "Snippet copied!")
      setTimeout(() => {
        button.removeAttribute("data-copied")
        button.setAttribute("aria-label", "Copy snippet")
      }, 1500)
    })
  }

  document
    .querySelector("[data-v7-top]")
    ?.addEventListener("click", () => window.scrollTo({ behavior: "smooth", top: 0 }))
}
