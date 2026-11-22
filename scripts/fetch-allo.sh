#!/bin/sh
# Trial only: downloads Allo 1.0 (SIL OFL 1.1, github.com/joshpuckett/allo) and writes a Latin
# subset to assets/fonts/web/allo-sans.woff2 (gitignored). Roundness is fixed at 50 (Allo's
# "Friendly" cut); weight 400–700 and optical size stay variable. Build with SITE_FONT=allo to
# use it. Needs gh and uv.
#   ./scripts/fetch-allo.sh
set -eu
cd "$(dirname "$0")/../assets/fonts"
mkdir -p web allo

[ -f allo/Allo-1.0.zip ] || gh release download v1.0 --repo joshpuckett/allo -p Allo-1.0.zip -D allo
unzip -o -q allo/Allo-1.0.zip -d allo

LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"
FONTTOOLS="uvx --quiet --from fonttools[woff]==4.60.1"
src=allo/Allo-1.0/fonts/webfonts/AlloVariable.woff2
tmp=web/.allo-sans.ttf

# The weight range must match `allo()` in packages/ui/src/fonts.ts.
$FONTTOOLS fonttools varLib.instancer "$src" wght=400:700 ROND=50 -q -o "$tmp"
$FONTTOOLS pyftsubset "$tmp" \
  --unicodes="$LATIN" --layout-features='*' --flavor=woff2 --output-file=web/allo-sans.woff2
rm "$tmp"
echo "web/allo-sans.woff2 $(wc -c < web/allo-sans.woff2 | tr -d ' ') bytes (from $(wc -c < "$src" | tr -d ' '))"
