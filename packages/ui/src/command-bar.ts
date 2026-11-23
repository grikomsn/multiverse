/*
 * The command bar in the browser. `command-bar.astro` holds the dialog and loads this file
 * the first time someone asks for the bar, so no page pays for it at load.
 *
 * The bar reads two files from nibras.co. `/commands.json` has the titles of every page, post,
 * role, project and talk, and loads when the bar opens. `/llms.json` has the text of every
 * page, and loads at the second letter of a search. The text search is `searchDocuments()`,
 * which the MCP server uses too, so both give the same results.
 */
import { searchDocuments, type SiteIndex } from "@multiverse/content/site-index"
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  CalendarDays,
  ChevronRight,
  Code,
  Copy,
  Download,
  FileText,
  History,
  House,
  Image,
  Link,
  Mail,
  MicVocal,
  Monitor,
  Moon,
  Package,
  PenLine,
  Rss,
  Sun,
  SunMoon,
  TextSearch,
} from "lucide-static"

import {
  matchRanges,
  rankRows,
  termsOf,
  type CommandIndex,
  type CommandItem,
  type CommandKind,
} from "./command-index"
import { onThemeChange } from "./dither"
import { griSvg, type Mood } from "./gri"
import { showMood } from "./gri-moods"
import { lineIcon } from "./line-icon"

type SubKey = "versions" | "ai" | "theme"

/** A theme choice. "system" follows the device, and is the choice until a reader makes one. */
type Theme = "light" | "dark" | "system"

/** One row of the list. A row does one of four things: `href`, `copy`, `sub` or `run`. */
interface Row {
  group: string
  title: string
  /** Icon markup. */
  icon: string
  /** A short fact on the right: a date, a kind, a host. */
  meta?: string
  keywords?: string
  /** A line of the page's text, for a match in the text. */
  snippet?: string
  /** Opens this address. */
  href?: string
  newTab?: boolean
  /** Saves the address as a file with this name. */
  download?: string
  /** Copies this text. */
  copy?: () => string | Promise<string>
  /** Shows a list of more rows. */
  sub?: SubKey
  /** Does something on this page. The bar stays open. */
  run?: () => void
}

const icon = (svg: string) => lineIcon(svg, "command-row-icon")
const ICON = {
  out: icon(ArrowUpRight),
  bot: icon(Bot),
  briefcase: icon(Briefcase),
  calendar: icon(CalendarDays),
  more: lineIcon(ChevronRight, "command-row-more"),
  code: icon(Code),
  copy: icon(Copy),
  download: icon(Download),
  file: icon(FileText),
  history: icon(History),
  home: icon(House),
  image: icon(Image),
  link: icon(Link),
  mail: icon(Mail),
  mic: icon(MicVocal),
  package: icon(Package),
  pen: icon(PenLine),
  rss: icon(Rss),
  theme: icon(SunMoon),
  light: icon(Sun),
  dark: icon(Moon),
  system: icon(Monitor),
  text: icon(TextSearch),
}

/** `words` also find every row of the kind: "talk" lists the talks. */
const KIND: Record<CommandKind, { group: string; icon: string; meta?: string; words?: string }> = {
  page: { group: "Pages", icon: ICON.file },
  post: { group: "Posts", icon: ICON.pen, words: "blog" },
  role: { group: "Work", icon: ICON.briefcase, meta: "Role", words: "role experience job" },
  project: { group: "Work", icon: ICON.package, meta: "Project", words: "project" },
  talk: { group: "Work", icon: ICON.mic, meta: "Talk", words: "talk" },
}
/** Pages with their own icon. Every other page shows a sheet of paper. */
const PAGE_ICON: Record<string, string> = {
  "/": ICON.home,
  "/blog": ICON.pen,
  "/work": ICON.briefcase,
  "/media": ICON.image,
  "/ai": ICON.bot,
}

/** The moods of the face in the field. "cool" and "cheeky" answer a theme change (`gri.astro`). */
const MOODS: Mood[] = ["smile", "think", "sad", "wink", "cool", "cheeky"]

const escapeHtml = (text: string) => text.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`)

/** `text` as markup, with the parts that match a term in <mark>. */
function marked(text: string, terms: string[]) {
  let html = ""
  let at = 0
  for (const [start, end] of matchRanges(text, terms)) {
    html += `${escapeHtml(text.slice(at, start))}<mark>${escapeHtml(text.slice(start, end))}</mark>`
    at = end
  }
  return html + escapeHtml(text.slice(at))
}

/** One line of a text match, with the first term near its start. */
function lineOf(snippet: string, terms: string[]) {
  const flat = snippet.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[[\]]/g, "")
  const at = Math.max(0, ...terms.slice(0, 1).map((term) => flat.toLowerCase().indexOf(term)))
  const start = flat.lastIndexOf(" ", Math.max(0, at - 24)) + 1
  return `${start > 0 ? "…" : ""}${flat.slice(start).replace(/^…/, "")}`
}

const THEME: Record<Theme, string> = { light: "Light", dark: "Dark", system: "System" }

/** The reader's choice: the theme on <html>, or "system" when there is none. */
const themeNow = (): Theme =>
  (document.documentElement.dataset.theme as Theme | undefined) ?? "system"

function createBar(dialog: HTMLDialogElement) {
  const part = <Part extends HTMLElement>(name: string) =>
    dialog.querySelector<Part>(`[data-command-${name}]`)!
  const input = part<HTMLInputElement>("input")
  const list = part("list")
  const chip = part<HTMLButtonElement>("chip")
  const status = part("status")
  const verb = part("verb")

  /** "" on nibras.co. On other sites, the address of nibras.co. */
  const origin = dialog.dataset.origin ?? ""
  const site = origin || location.origin
  const at = (path: string) => `${origin}${path}`
  const markdown = document.querySelector<HTMLLinkElement>(
    'link[rel="alternate"][type="text/markdown"]',
  )?.href

  let index: CommandIndex | undefined
  let text: SiteIndex | null | undefined
  let textAsked = false
  let rows: Row[] = []
  let active = 0
  let sub: SubKey | undefined
  let closing = 0

  // The face in the field, for a site whose icon is the mascot.
  let face: SVGSVGElement | null = null
  let mood: Mood = "smile"
  let settle = 0
  if (dialog.dataset.mascot !== undefined) {
    const lead = part("lead")
    lead.innerHTML = griSvg({
      moods: MOODS,
      marks: false,
      rules: true,
      attrs: `aria-hidden="true"`,
    })
    lead.classList.add("command-lead-face")
    face = lead.querySelector("svg")
  }
  function feel(next: Mood, ms?: number) {
    if (!face || (!ms && next === mood)) return
    mood = ms ? "smile" : next
    showMood(face, next, ms)
  }

  void fetch(at("/commands.json"))
    .then((response) => (response.ok ? (response.json() as Promise<CommandIndex>) : undefined))
    .catch(() => undefined)
    .then((value) => {
      index = value
      if (dialog.open) render(true)
    })

  /** Loads the text of every page, once. The list shows title matches until it is here. */
  function askText() {
    if (textAsked) return
    textAsked = true
    void fetch(at("/llms.json"))
      .then((response) => (response.ok ? (response.json() as Promise<SiteIndex>) : null))
      .catch(() => null)
      .then((value) => {
        text = value
        if (dialog.open && input.value.trim()) render(true)
      })
  }

  const itemRow = (item: CommandItem): Row => ({
    group: KIND[item.kind].group,
    title: item.title,
    icon: (item.kind === "page" && PAGE_ICON[item.path]) || KIND[item.kind].icon,
    meta: item.kind === "page" ? item.path : (item.date ?? KIND[item.kind].meta),
    keywords: [item.keywords, KIND[item.kind].words].filter(Boolean).join(" "),
    href: at(item.path),
  })

  /** `theme-toggle.astro` sets the theme, so the bar has theme rows only where the button is. */
  const hasThemes = document.querySelector("[data-theme-toggle]") !== null

  function themeRow(): Row | undefined {
    if (!hasThemes) return
    return {
      group: "Actions",
      title: "Change theme",
      icon: ICON.theme,
      meta: THEME[themeNow()],
      keywords: "appearance mode",
      sub: "theme",
    }
  }

  function themeRows(): Row[] {
    if (!hasThemes) return []
    return (["light", "dark", "system"] as const).map((theme) => ({
      group: "Theme",
      title: `Use the ${theme} theme`,
      icon: ICON[theme],
      meta: theme === themeNow() ? "In use" : undefined,
      keywords: "appearance mode",
      run: () => document.dispatchEvent(new CustomEvent("theme:set", { detail: theme })),
    }))
  }

  function mailRow(): Row | undefined {
    const email = index?.email
    if (!email) return
    return {
      group: "Actions",
      title: "Copy the email address",
      icon: ICON.mail,
      keywords: "contact mail",
      copy: () => email,
    }
  }

  function callRow(): Row | undefined {
    if (!index?.scheduleUrl) return
    return {
      group: "Actions",
      title: "Book a call",
      icon: ICON.calendar,
      keywords: "schedule meeting contact",
      href: index.scheduleUrl,
    }
  }

  const askTitle = markdown ? "Ask AI about this page" : "Ask AI about this site"

  /** Actions that are not in "Suggested". */
  function otherActions(): Row[] {
    const group = "Actions"
    const found: Row[] = [
      {
        group,
        title: "Download the resume",
        icon: ICON.download,
        meta: "PDF",
        keywords: "cv pdf",
        href: at("/resume.pdf"),
        download: "resume.pdf",
      },
    ]
    if (markdown) {
      found.push({
        group,
        title: "Copy this page as Markdown",
        icon: ICON.copy,
        keywords: "md text",
        copy: () =>
          fetch(markdown).then((response) => {
            if (!response.ok) throw new Error(String(response.status))
            return response.text()
          }),
      })
    }
    found.push(
      { group, title: askTitle, icon: ICON.bot, keywords: "claude chatgpt mcp llm", sub: "ai" },
      {
        group,
        title: "Subscribe to the feed",
        icon: ICON.rss,
        meta: "RSS",
        keywords: "rss atom follow",
        href: at("/feed.xml"),
      },
    )
    if (index) {
      found.push({
        group,
        title: "See the source code",
        icon: ICON.code,
        meta: "GitHub",
        keywords: "repository github",
        href: index.repository,
      })
    }
    return found
  }

  const ask = (question: string) => encodeURIComponent(question)

  function aiRows(): Row[] {
    const question = markdown
      ? `Read ${markdown}. Then answer my questions about it. Use only facts from the page.`
      : `Read ${site}/llms.txt and the pages it links to. Then answer my questions about ${index?.name ?? "the owner of the site"}. Use only facts from the site.`
    return [
      {
        group: askTitle,
        title: "Ask Claude",
        icon: ICON.bot,
        meta: "claude.ai",
        href: `https://claude.ai/new?q=${ask(question)}`,
        newTab: true,
      },
      {
        group: askTitle,
        title: "Ask ChatGPT",
        icon: ICON.bot,
        meta: "chatgpt.com",
        href: `https://chatgpt.com/?q=${ask(question)}`,
        newTab: true,
      },
      {
        group: askTitle,
        title: "Copy the MCP server address",
        icon: ICON.link,
        keywords: "connector tools",
        copy: () => `${site}/mcp`,
      },
    ]
  }

  const versionRows = (): Row[] =>
    (index?.versions ?? []).map((version) => ({
      group: "Older versions",
      title: version.title,
      icon: ICON.history,
      meta: version.year,
      keywords: "archive",
      href: version.url,
    }))

  function elsewhere(): Row[] {
    const found: Row[] = []
    if (index?.versions.length) {
      found.push({
        group: "Elsewhere",
        title: "Older versions",
        icon: ICON.history,
        meta: String(index.versions.length),
        keywords: "archive",
        sub: "versions",
      })
    }
    for (const profile of index?.profiles ?? []) {
      found.push({
        group: "Elsewhere",
        title: profile.label,
        icon: ICON.out,
        meta: new URL(profile.url).hostname.replace(/^www\./, ""),
        keywords: "profile",
        href: profile.url,
      })
    }
    return found
  }

  const subRows = (key: SubKey) =>
    key === "ai" ? aiRows() : key === "theme" ? themeRows() : versionRows()
  const SUB_TITLE: Record<SubKey, string> = {
    ai: "Ask AI",
    theme: "Theme",
    versions: "Older versions",
  }

  /** Pages that repeat the text of every entry. A match there is a match in an entry too. */
  const WHOLE = new Set(["resume", "work", "blog"])

  /** Matches in the text of the pages, for documents that `shown` does not list already. */
  function textRows(query: string, terms: string[], shown: Row[]): Row[] {
    if (!text) return []
    const origin = text.origin
    const listed = new Set(shown.map((row) => row.href))
    const hits = searchDocuments(text.documents, query, { limit: 12 })
      .map((hit) => ({ ...hit, href: at(hit.url.replace(origin, "") || "/") }))
      .filter((hit) => !listed.has(hit.href))
    // The resume and Work show only when no entry, post or page has the words.
    const parts = hits.filter((hit) => !WHOLE.has(hit.id))
    const found: Row[] = []
    for (const hit of parts.length > 0 ? parts : hits) {
      if (listed.has(hit.href)) continue
      listed.add(hit.href)
      found.push({
        group: "In the text",
        title: hit.title,
        icon: ICON.text,
        snippet: lineOf(hit.snippet, terms),
        href: hit.href,
      })
      if (found.length === 4) break
    }
    return found
  }

  function build(query: string, terms: string[]): Row[] {
    if (sub) {
      const all = subRows(sub)
      return terms.length ? rankRows(all, query, all.length) : all
    }
    const items = (index?.items ?? []).map(itemRow)
    const pages = items.filter((row) => row.group === "Pages")
    const suggested = [callRow(), mailRow(), themeRow()].filter((row) => row !== undefined)
    if (terms.length === 0) {
      const latest = items.find((row) => row.group === "Posts")
      const first = [latest && { ...latest, meta: "Latest post" }, ...suggested]
        .filter((row) => row !== undefined)
        .map((row) => ({ ...row, group: "Suggested" }))
      return [...first, ...pages, ...otherActions(), ...elsewhere()]
    }
    const rest = items.filter((row) => row.group !== "Pages")
    const found = rankRows(
      [
        ...pages,
        ...suggested,
        ...otherActions(),
        ...rest,
        ...elsewhere(),
        ...versionRows(),
        ...aiRows(),
        ...themeRows(),
      ],
      query,
    )
    if (query.length >= 2) {
      askText()
      found.push(...textRows(query, terms, found))
    }
    return found
  }

  /** What Enter does to a row, for the hint under the list. */
  const verbOf = (row: Row | undefined) =>
    !row || row.href ? "Open" : row.copy ? "Copy" : row.sub ? "More" : "Use"

  function rowHtml(row: Row, index: number, terms: string[]) {
    const tag = row.href ? "a" : "div"
    const link = row.href
      ? ` href="${escapeHtml(row.href)}"${row.newTab ? ` target="_blank" rel="noopener"` : ""}${row.download ? ` download="${escapeHtml(row.download)}"` : ""} tabindex="-1"`
      : ""
    return (
      `<${tag} class="command-row" role="option" id="command-row-${index}" data-row="${index}" aria-selected="${index === active}"${link}>` +
      row.icon +
      `<span class="command-row-text"><span class="command-row-title">${marked(row.title, terms)}</span>` +
      (row.snippet
        ? `<span class="command-row-snippet">${marked(row.snippet, terms)}</span>`
        : "") +
      `</span>` +
      (row.meta ? `<span class="command-row-meta">${escapeHtml(row.meta)}</span>` : "") +
      (row.sub ? ICON.more : "") +
      `</${tag}>`
    )
  }

  /** Draws the list. `keep` holds the selected row and the scroll position where it can. */
  function render(keep = false) {
    const query = input.value.trim()
    const terms = termsOf(query)
    rows = build(query, terms)
    let html = ""
    if (rows.length === 0 && query) {
      html = `<p class="command-empty">Nothing matches <strong>“${escapeHtml(query)}”</strong>.</p>`
      if (!sub) {
        const question = `Read ${site}/llms.txt and the pages it links to. Then answer this question about ${index?.name ?? "the owner of the site"}: ${query}. Use only facts from the site.`
        rows = [
          {
            group: "Try",
            title: `Ask Claude about “${query}”`,
            icon: ICON.bot,
            meta: "claude.ai",
            href: `https://claude.ai/new?q=${ask(question)}`,
            newTab: true,
          },
        ]
      }
    }
    active = keep ? Math.min(active, Math.max(0, rows.length - 1)) : 0
    // A group's rows sit in one box, so a screen reader says the group's name with a row.
    let group = ""
    rows.forEach((row, index) => {
      if (row.group !== group) {
        if (group) html += `</div>`
        group = row.group
        html += `<div role="group" aria-labelledby="command-group-${index}"><p class="command-group" id="command-group-${index}">${escapeHtml(group)}</p>`
      }
      html += rowHtml(row, index, group === "Try" ? [] : terms)
    })
    if (group) html += `</div>`
    const top = list.scrollTop
    list.innerHTML = html
    list.scrollTop = keep ? top : 0
    chip.hidden = !sub
    chip.textContent = sub ? SUB_TITLE[sub] : ""
    input.placeholder = sub ? "Filter" : "Search or run a command"
    const found = rows.length > 0 && rows[0]?.group !== "Try"
    status.textContent = !query
      ? ""
      : found
        ? `${rows.length} ${rows.length === 1 ? "result" : "results"}`
        : "No results"
    select(active)
    return found
  }

  /** Marks row `next` as the selected one and brings it into the list's view. */
  function select(next: number) {
    list.querySelector('[aria-selected="true"]')?.setAttribute("aria-selected", "false")
    active = next
    const row = list.querySelector<HTMLElement>(`#command-row-${next}`)
    row?.setAttribute("aria-selected", "true")
    if (row) input.setAttribute("aria-activedescendant", row.id)
    else input.removeAttribute("aria-activedescendant")
    verb.textContent = verbOf(rows[next])
    if (!row) return
    // The first row scrolls its group's name into view too.
    if (next === 0) list.scrollTop = 0
    else row.scrollIntoView({ block: "nearest" })
  }

  function open(key: SubKey | undefined) {
    sub = key
    input.value = ""
    render()
    input.focus()
  }

  function close() {
    if (dialog.open) dialog.close()
  }

  /** Shows `message` on the row, and closes the bar after a short time when `done`. */
  function report(element: HTMLElement, message: string, done: boolean) {
    let meta = element.querySelector(".command-row-meta")
    if (!meta) {
      meta = document.createElement("span")
      meta.className = "command-row-meta"
      element.append(meta)
    }
    meta.textContent = message
    status.textContent = message
    if (!done) return
    feel("wink", 900)
    clearTimeout(closing)
    closing = window.setTimeout(close, 700)
  }

  async function copy(row: Row, element: HTMLElement) {
    try {
      const value = row.copy!()
      // Safari needs the clipboard write to start inside the click, so pass a promise.
      if (typeof value !== "string" && "ClipboardItem" in window) {
        const blob = value.then((result) => new Blob([result], { type: "text/plain" }))
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })])
      } else {
        await navigator.clipboard.writeText(await value)
      }
      report(element, "Copied", true)
    } catch {
      report(element, "Copy failed", false)
    }
  }

  /** Does what a row does. A link row is an <a>: the browser opens it, and the bar closes. */
  function act(index: number, event?: Event) {
    const row = rows[index]
    const element = list.querySelector<HTMLElement>(`#command-row-${index}`)
    if (!row || !element) return
    if (row.href) {
      feel("wink", 900)
      close()
      return
    }
    event?.preventDefault()
    if (row.sub) open(row.sub)
    else if (row.copy) void copy(row, element)
    else row.run?.()
  }

  input.addEventListener("input", () => {
    const found = render()
    const query = input.value.trim()
    clearTimeout(settle)
    if (!query) return feel("smile")
    feel("think")
    // The face thinks while the reader types, then shows what it found. The text of the pages
    // can come later, so look at the list again at that time.
    settle = window.setTimeout(() => {
      const some = found || (rows.length > 0 && rows[0]?.group !== "Try")
      feel(some ? "smile" : "sad")
    }, 550)
  })

  input.addEventListener("keydown", (event) => {
    if (event.isComposing) return
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      if (rows.length === 0) return
      select((active + (event.key === "ArrowDown" ? 1 : rows.length - 1)) % rows.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      const row = rows[active]
      const element = list.querySelector<HTMLElement>(`#command-row-${active}`)
      if (!row || !element) return
      // A link row acts through its own click, so the browser treats it as any link.
      if (row.href) {
        if (event.metaKey || event.ctrlKey) window.open(row.href, "_blank", "noopener")
        else element.click()
      } else act(active)
    } else if (event.key === "Escape" && sub) {
      event.preventDefault()
      open(undefined)
    } else if (event.key === "Backspace" && sub && !input.value) {
      event.preventDefault()
      open(undefined)
    }
  })

  list.addEventListener("pointermove", (event) => {
    const row = (event.target as Element).closest<HTMLElement>("[data-row]")
    if (row && Number(row.dataset.row) !== active) select(Number(row.dataset.row))
  })
  list.addEventListener("click", (event) => {
    const row = (event.target as Element).closest<HTMLElement>("[data-row]")
    if (row) act(Number(row.dataset.row), event)
  })
  // The list keeps the focus in the field, so the keys work after a click on a row.
  list.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") event.preventDefault()
  })
  chip.addEventListener("click", () => open(undefined))
  part("close").addEventListener("click", close)
  // A click on the veil lands on the dialog itself: the panel is a child that covers it.
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close()
  })

  // A phone keyboard covers the lower part of the window. The list ends above it.
  const view = window.visualViewport
  const fit = () => dialog.style.setProperty("--command-view", `${view?.height ?? innerHeight}px`)
  view?.addEventListener("resize", fit)

  dialog.addEventListener("close", () => {
    clearTimeout(closing)
    clearTimeout(settle)
    sub = undefined
    input.value = ""
    mood = "smile"
    if (face) face.dataset.mood = "smile"
  })
  onThemeChange(() => {
    if (dialog.open) render(true)
  })

  return {
    show() {
      fit()
      dialog.showModal()
      render()
      input.focus()
    },
    close,
  }
}

let bar: ReturnType<typeof createBar> | undefined

/** Gets the bar ready: loads the list, so the bar is full when it opens. */
export function prepareCommandBar(dialog: HTMLDialogElement) {
  return (bar ??= createBar(dialog))
}

/** Opens the bar, or closes it when it is open. */
export function toggleCommandBar(dialog: HTMLDialogElement) {
  const ready = prepareCommandBar(dialog)
  if (dialog.open) ready.close()
  else ready.show()
}
