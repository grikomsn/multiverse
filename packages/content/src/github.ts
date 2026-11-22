/**
 * Repository facts from the GitHub API at build time: stars for nibras.co's usage numbers, and
 * the counts v2's open-source list showed in the archive. A failed or slow request gives null,
 * never a failed build. Set GITHUB_TOKEN to lift GitHub's limit of 60 unauthenticated requests
 * an hour.
 */
export interface RepoStats {
  fullName: string
  stars: number
  watchers: number
  forks: number
  language: string | null
}

const cache = new Map<string, Promise<RepoStats | null>>()

/** "owner/repo" from a GitHub URL; null for star lists and other pages. */
export function repoOf(url?: string | null) {
  const match = url?.match(/github\.com\/([^/]+\/[^/#?]+)/)
  if (!match?.[1] || match[1].startsWith("stars/")) return null
  return match[1].replace(/\.git$/, "")
}

/** Stats for an "owner/repo" or a GitHub URL. */
export function repoStats(repoOrUrl?: string | null): Promise<RepoStats | null> {
  const repo = repoOrUrl?.includes("github.com") ? repoOf(repoOrUrl) : repoOrUrl
  if (!repo) return Promise.resolve(null)
  let stats = cache.get(repo)
  if (!stats) {
    // Read through globalThis: this package also builds for runtimes without Node types.
    const token = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
      ?.env?.GITHUB_TOKEN
    stats = fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "nibras.co-build",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal: AbortSignal.timeout(6000),
    })
      .then(async (response) => {
        if (!response.ok) return null
        const data = (await response.json()) as {
          full_name: string
          stargazers_count: number
          subscribers_count: number
          forks_count: number
          language: string | null
        }
        return {
          fullName: data.full_name,
          stars: data.stargazers_count,
          watchers: data.subscribers_count,
          forks: data.forks_count,
          language: data.language,
        }
      })
      .catch(() => null)
    cache.set(repo, stats)
  }
  return stats
}
