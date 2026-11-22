# multiverse

The sites of Griko Nibras and the Sanity CMS that feeds them.

- **[nibras.co](https://nibras.co)**: the blog, work, resume and photos, with Markdown and MCP access for AI tools.
- **archive.nibras.co**: every past version of the site, rebuilt in its original design.
- **nbr.st**: short links.

This repository held each earlier version of the site from 2018 on. The archive app now rebuilds all of them in one place. [docs/legacy](docs/legacy/README.md) tells the history of each version. The `legacy/*` tags keep the source of each old version: `legacy/v2` to `legacy/v9`.

## Layout

| Path               | What                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| `apps/web`         | nibras.co: Astro, static, with a small Worker for `/mcp` and `/resume.pdf` |
| `apps/archive`     | archive.nibras.co: each past version under `/<edition>/`                   |
| `apps/links`       | nbr.st: short links, one Worker that reads KV                              |
| `apps/studio`      | Sanity Studio, and scripts that write content                              |
| `packages/sanity`  | Schema, Studio structure and generated types                               |
| `packages/content` | Sanity client and format helpers                                           |
| `packages/ui`      | Shared design: tokens, fonts, header, footer                               |
| `packages/config`  | Shared TypeScript and ESLint configs                                       |
| `docs`             | Content model, design notes and research on old versions                   |

## Requirements

- [Bun](https://bun.sh) 1.4.4
- Node.js 22.23.4 or later (see `.node-version`)
- [uv](https://docs.astral.sh/uv/), to make the web fonts
- [GitHub CLI](https://cli.github.com), to download the Allo font

## Start

```bash
bun install
./scripts/fetch-allo.sh
SITE_FONT=allo bun run --filter web dev    # http://localhost:4321
```

### Fonts

The sites use Timeless Sans. Its license allows embedding only, so the font files are not in this repository.

- **With the licensed files:** put `Timeless-Type-Family-1.094.zip` in `assets/fonts/`, then run `./scripts/subset-fonts.sh`. Commands need no `SITE_FONT`.
- **Without them:** run `./scripts/fetch-allo.sh` to get [Allo](https://github.com/joshpuckett/allo) (SIL OFL 1.1). Then set `SITE_FONT=allo` for each command.

Both scripts write to `assets/fonts/web/`, which git ignores.

### Environment

The apps read Sanity project `lboasusv`, dataset `production`. The dataset is public, so local work needs no token. To change a value, copy `.env.example` to `.env` in the app folder.

Set `GITHUB_TOKEN` to avoid GitHub's limit of 60 requests per hour when the build reads project stars:

```bash
GITHUB_TOKEN=$(gh auth token) SITE_FONT=allo bun run --filter web dev
```

## Commands

| Command                           | What it does                                    |
| --------------------------------- | ----------------------------------------------- |
| `bun run dev`                     | Starts every app                                |
| `bun run --filter web dev`        | Starts nibras.co on port 4321                   |
| `bun run --filter archive dev`    | Starts the archive on port 4322                 |
| `bun run --filter studio dev`     | Starts Sanity Studio on port 3333               |
| `bun run check`                   | Runs lint, typecheck and tests in every package |
| `bun run format`                  | Formats every file with Prettier                |
| `bun run build`                   | Builds every app                                |
| `bun run --filter studio typegen` | Makes types again after schema changes          |

Each app deploys as a Cloudflare Worker (`multiverse-web`, `multiverse-archive`, `multiverse-links`). GitHub Actions deploys them after the checks pass on `main`, and when Sanity publishes. [docs/deploy.md](docs/deploy.md) has the setup and the cutover from the old hosts.

[AGENTS.md](AGENTS.md) has the full conventions, for people and for coding agents.

## License

The code is under the [MIT License](LICENSE).

The content is not. Posts, photos, resume text, the handwritten signature and other personal material belong to Griko Nibras, with all rights reserved. Most of it lives in the Sanity dataset, not in this repository. Fonts, stylesheets and libraries from other authors keep their own licenses.
