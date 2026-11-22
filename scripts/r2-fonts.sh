#!/bin/sh
# Keeps the built font files in a private R2 bucket, so a build server can get them without git.
# The fonts are licensed for embedding only; the bucket has no public access.
#   ./scripts/r2-fonts.sh put   # after ./scripts/subset-fonts.sh: upload assets/fonts/web
#   ./scripts/r2-fonts.sh get   # in CI: download into assets/fonts/web
# Needs a Wrangler login, or CLOUDFLARE_API_TOKEN with R2 access.
set -eu
cd "$(dirname "$0")/.."

BUCKET=multiverse-build
# The files that packages/ui/src/fonts.ts loads. Keep the two lists in sync.
FILES="timeless-sans.woff2"
export CLOUDFLARE_ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-e02a25d4d8f0bacceba5cb29bcaa74de}"

mkdir -p assets/fonts/web
for file in $FILES; do
  case "${1:-}" in
    put) bunx wrangler r2 object put "$BUCKET/fonts/$file" --remote --file "assets/fonts/web/$file" ;;
    get) bunx wrangler r2 object get "$BUCKET/fonts/$file" --remote --file "assets/fonts/web/$file" ;;
    *) echo "usage: $0 put|get" >&2 && exit 1 ;;
  esac
done
