import { repoOf, repoStats } from "@multiverse/content/github"

const sum = (values: (number | undefined)[]) => values.reduce<number>((a, b) => a + (b ?? 0), 0)

/**
 * Usage numbers for projects, read when the site builds: GitHub stars, npm downloads in the
 * last month and VS Code Marketplace installs. Every source is optional. A failed or slow
 * request gives no number, never a failed build. Set GITHUB_TOKEN to lift GitHub's limit of
 * 60 unauthenticated requests an hour.
 */

export interface Metrics {
  stars: number
  /** npm downloads in the last 30 days. */
  downloads: number
  installs: number
  /** npm downloads per week for the last year, oldest first. Empty without npm packages. */
  trend: number[]
}

interface Source {
  _id: string
  repoUrl?: string | null
  metrics?: { github?: string[] | null; npm?: string[] | null; vscode?: string[] | null } | null
}

const TIMEOUT = 6000
// The dev server renders on every request; keep results for an hour so reloads stay fast.
const TTL = 60 * 60 * 1000
const cache = new Map<string, { at: number; value: Promise<unknown> }>()

function remember<T>(key: string, load: () => Promise<T | undefined>): Promise<T | undefined> {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < TTL) return hit.value as Promise<T | undefined>
  const value = load().catch(() => undefined)
  cache.set(key, { at: Date.now(), value })
  return value
}

async function json<T>(url: string, init?: RequestInit): Promise<T | undefined> {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT) })
  return response.ok ? ((await response.json()) as T) : undefined
}

/** Stars, through the shared GitHub helper, kept for an hour like the other numbers. */
const stars = (repo: string) =>
  remember<number>(`github:${repo}`, async () => (await repoStats(repo))?.stars)

/** Daily downloads for the last year, oldest first. */
function daily(name: string) {
  return remember<number[]>(`npm:${name}`, async () => {
    const data = await json<{ downloads: { day: string; downloads: number }[] }>(
      `https://api.npmjs.org/downloads/range/last-year/${name}`,
    )
    return data?.downloads.map((entry) => entry.downloads)
  })
}

/** Adds daily series together, aligned on the newest day. */
function addSeries(series: number[][]) {
  const length = Math.max(0, ...series.map((list) => list.length))
  return Array.from({ length }, (_, index) =>
    sum(series.map((list) => list[list.length - length + index])),
  )
}

/** Whole weeks, newest last; a partial oldest week is dropped. */
function weekly(days: number[]) {
  const weeks: number[] = []
  for (let end = days.length; end >= 7; end -= 7) weeks.unshift(sum(days.slice(end - 7, end)))
  return weeks
}

export interface Extension {
  name: string
  installs: number
}

/** One Marketplace request for every extension; the result is split per id (lowercase). */
let marketplace: { at: number; key: string; value: Promise<Map<string, Extension>> } | undefined

export function extensions(ids: string[]) {
  const key = [...ids].sort().join(",")
  if (marketplace && marketplace.key === key && Date.now() - marketplace.at < TTL) {
    return marketplace.value
  }
  const value = (async () => {
    const result = new Map<string, Extension>()
    if (ids.length === 0) return result
    type Response = {
      results: {
        extensions: {
          extensionName: string
          displayName?: string
          publisher: { publisherName: string }
          statistics?: { statisticName: string; value: number }[]
        }[]
      }[]
    }
    const data = await json<Response>(
      "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
      {
        method: "POST",
        headers: {
          Accept: "application/json;api-version=7.2-preview.1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filters: [
            {
              criteria: [
                { filterType: 8, value: "Microsoft.VisualStudio.Code" },
                ...ids.map((id) => ({ filterType: 7, value: id })),
              ],
              pageSize: 100,
            },
          ],
          flags: 256, // IncludeStatistics
        }),
      },
    ).catch(() => undefined)
    for (const extension of data?.results[0]?.extensions ?? []) {
      const install = extension.statistics?.find((stat) => stat.statisticName === "install")
      const id = `${extension.publisher.publisherName}.${extension.extensionName}`.toLowerCase()
      if (install) {
        const name = extension.displayName ?? extension.extensionName
        result.set(id, { name, installs: Math.round(install.value) })
      }
    }
    return result
  })()
  marketplace = { at: Date.now(), key, value }
  return value
}

/** Numbers per project id. Projects with no sources get zeros. */
export async function getMetrics(projects: Source[]) {
  const extensionIds = projects.flatMap((project) => project.metrics?.vscode ?? [])
  const installed = await extensions(extensionIds)
  const entries = await Promise.all(
    projects.map(async (project): Promise<[string, Metrics]> => {
      const repos = [repoOf(project.repoUrl), ...(project.metrics?.github ?? [])].filter(
        (repo): repo is string => Boolean(repo),
      )
      const [starCounts, dailyCounts] = await Promise.all([
        Promise.all([...new Set(repos)].map(stars)),
        Promise.all((project.metrics?.npm ?? []).map(daily)),
      ])
      const days = addSeries(dailyCounts.filter((list): list is number[] => Boolean(list)))
      return [
        project._id,
        {
          stars: sum(starCounts),
          downloads: sum(days.slice(-30)),
          trend: weekly(days),
          installs: sum(
            (project.metrics?.vscode ?? []).map((id) => installed.get(id.toLowerCase())?.installs),
          ),
        },
      ]
    }),
  )
  return new Map(entries)
}

export function totals(metrics: Iterable<Metrics>): Metrics {
  const all = [...metrics]
  return {
    stars: sum(all.map((item) => item.stars)),
    downloads: sum(all.map((item) => item.downloads)),
    installs: sum(all.map((item) => item.installs)),
    trend: addSeries(all.map((item) => item.trend).filter((list) => list.length > 0)),
  }
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })

export const formatCount = (value: number) => compact.format(value).toLowerCase()
