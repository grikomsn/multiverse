/** "/v4b" or "/v5", whichever edition is rendering (both share these components). */
export const baseOf = (url: URL) => {
  const root = import.meta.env.BASE_URL.replace(/\/$/, "")
  return `${root}/${url.pathname.slice(root.length).split("/")[1] ?? ""}`
}

export const postDate = (date: string | null | undefined) =>
  date
    ? new Date(`${date.slice(0, 10)}T00:00:00`).toLocaleDateString("en", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""
