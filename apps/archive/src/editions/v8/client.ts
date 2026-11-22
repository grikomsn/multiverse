/**
 * v8's client behaviour without React: a kbar-style command palette (⌘K, `g x` shortcuts,
 * nested Extras/Multiverse and "Search Posts" actions), react-hot-toast-like toasts, copy-email
 * buttons, rough-notation underlines and medium-zoom images.
 */
import mediumZoom from "medium-zoom"
import { annotate, annotationGroup } from "rough-notation"

type Action = {
  id: string
  name: string
  section?: string
  parent?: string
  shortcut?: string
  href?: string
  subtitle?: string
}

let toastTimer: ReturnType<typeof setTimeout> | undefined
export function toast(message: string) {
  const root = document.getElementById("v8-toast")
  const text = document.getElementById("v8-toast-text")
  if (!root || !text) return
  text.textContent = `✅ ${message}`
  root.style.opacity = "1"
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (root.style.opacity = "0"), 2000)
}

function initKbar() {
  const root = document.getElementById("kbar")
  const input = document.getElementById("kbar-search") as HTMLInputElement | null
  const results = document.getElementById("kbar-results")
  const icons = document.getElementById("kbar-icons") as HTMLTemplateElement | null
  if (!root || !input || !results) return
  const actions = JSON.parse(root.dataset.actions ?? "[]") as Action[]
  let parent: string | undefined
  let activeIndex = 0
  let visible: Action[] = []

  const icon = (id: string) => icons?.content.querySelector(`[data-icon="${id}"]`)?.innerHTML ?? ""
  const perform = (action: Action) => {
    if (!action.href) {
      parent = action.id
      input.value = ""
      render()
      return
    }
    close()
    if (/^https?:/.test(action.href)) window.open(action.href, "_blank", "noopener")
    else location.href = action.href
  }
  const render = () => {
    const query = input.value.trim().toLowerCase()
    visible = actions.filter((action) =>
      query
        ? action.name.toLowerCase().includes(query) && (parent ? action.parent === parent : true)
        : action.parent === parent && (parent || action.section),
    )
    activeIndex = Math.min(activeIndex, Math.max(visible.length - 1, 0))
    results.innerHTML = ""
    let section: string | undefined
    visible.forEach((action, index) => {
      if (!parent && action.section && action.section !== section) {
        section = action.section
        const heading = document.createElement("div")
        heading.className = "px-4 py-2"
        heading.innerHTML = `<h4 class="font-bold tracking-tighter text-neutral-500"></h4>`
        heading.firstElementChild!.textContent = section
        results.append(heading)
      }
      const row = document.createElement("div")
      row.role = "option"
      row.className = `cursor-pointer border-l-2 px-4 py-2 ${index === activeIndex ? "border-primary bg-gray-500/20" : "border-transparent"}`
      row.innerHTML = `<div class="flex gap-4"><div class="flex flex-col items-center justify-center">${icon(action.id)}</div><div class="flex grow flex-col"><h4></h4><p class="truncate text-xs text-neutral-400"></p></div><div class="flex items-center gap-1 font-mono text-xs uppercase text-gray-500"></div></div>`
      row.querySelector("h4")!.textContent = action.name
      row.querySelector("p")!.textContent = action.subtitle ?? ""
      for (const key of action.shortcut ?? "") {
        const kbd = document.createElement("span")
        kbd.className = "rounded border border-gray-500/50 px-[4px] py-[2px]"
        kbd.textContent = key
        row.lastElementChild!.lastElementChild!.append(kbd)
      }
      row.addEventListener("mousemove", () => {
        if (activeIndex !== index) {
          activeIndex = index
          render()
        }
      })
      row.addEventListener("click", () => perform(action))
      results.append(row)
    })
  }
  const open = (root_?: string) => {
    parent = root_
    input.value = ""
    activeIndex = 0
    root.classList.replace("hidden", "flex")
    render()
    input.focus()
  }
  const close = () => root.classList.replace("flex", "hidden")
  const isOpen = () => root.classList.contains("flex")

  for (const button of document.querySelectorAll("[data-kbar-toggle]")) {
    button.addEventListener("click", () => (isOpen() ? close() : open()))
  }
  for (const button of document.querySelectorAll<HTMLElement>("[data-kbar-open]")) {
    button.addEventListener("click", () => open(button.dataset.kbarOpen))
  }
  root.addEventListener("click", (event) => {
    if (event.target === root) close()
  })
  input.addEventListener("input", () => {
    activeIndex = 0
    render()
  })
  input.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") activeIndex = Math.min(activeIndex + 1, visible.length - 1)
    else if (event.key === "ArrowUp") activeIndex = Math.max(activeIndex - 1, 0)
    else if (event.key === "Enter" && visible[activeIndex]) return perform(visible[activeIndex]!)
    else if (event.key === "Backspace" && !input.value && parent) {
      parent = actions.find((action) => action.id === parent)?.parent
    } else return
    event.preventDefault()
    render()
  })

  let sequence = ""
  let sequenceAt = 0
  window.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault()
      return isOpen() ? close() : open()
    }
    if (event.key === "Escape" && isOpen()) return close()
    if (isOpen() || (event.target as HTMLElement).closest("input, textarea, [contenteditable]"))
      return
    if (event.metaKey || event.ctrlKey || event.altKey) return
    sequence = (Date.now() - sequenceAt < 1000 ? sequence : "") + event.key.toLowerCase()
    sequenceAt = Date.now()
    const action = actions.find((item) => item.shortcut && sequence.endsWith(item.shortcut))
    if (action) {
      sequence = ""
      perform(action)
    }
  })
}

export function initV8() {
  initKbar()

  // ui/core/home-frame.tsx: copy the address unless Shift is held.
  for (const button of document.querySelectorAll<HTMLElement>("[data-copy-email]")) {
    button.addEventListener("click", (event) => {
      if (event.shiftKey) {
        location.href = `mailto:${button.dataset.copyEmail}`
        return
      }
      void navigator.clipboard?.writeText(button.dataset.copyEmail ?? "")
      toast("Copied email address!")
    })
  }
  for (const button of document.querySelectorAll<HTMLElement>("[data-copy-url]")) {
    button.addEventListener("click", () => {
      void navigator.clipboard?.writeText(document.URL)
      toast("Copied to clipboard!")
    })
  }
  for (const button of document.querySelectorAll<HTMLElement>("[data-share]")) {
    if (!("share" in navigator)) continue
    button.classList.replace("hidden", "flex")
    button.addEventListener("click", () => {
      navigator.share({ title: button.dataset.share, url: document.URL }).catch(console.error)
    })
  }

  // <Underline show> / <Stabilo>: rough-notation drawn after 1000ms.
  const notes = [...document.querySelectorAll<HTMLElement>("[data-underline], [data-stabilo]")].map(
    (element) =>
      annotate(element, {
        type: element.dataset.stabilo === undefined ? "underline" : "highlight",
        multiline: true,
        color: element.dataset.stabilo === undefined ? "currentColor" : "rgb(14 165 233 / 0.4)",
      }),
  )
  if (notes.length) setTimeout(() => annotationGroup(notes).show(), 1000)

  mediumZoom("[data-zoomable]", { background: "transparent" })
}
