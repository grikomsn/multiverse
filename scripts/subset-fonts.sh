#!/bin/sh
# Subsets the licensed fonts in assets/fonts to Latin and writes WOFF2 files to
# assets/fonts/web/ (gitignored, like everything in assets/). Variable axes and OpenType
# layout features are kept. Needs uv (runs fonttools ephemerally).
#   ./scripts/subset-fonts.sh
set -eu
cd "$(dirname "$0")/../assets/fonts"
mkdir -p web timeless

# Timeless ships zipped; extract only the variable WOFF2 we use.
unzip -o -j -q Timeless-Type-Family-1.094.zip \
  "Timeless-Type-Family-1.094/Sans-Grotesk/TimelessSansVF.woff2" \
  -d timeless

LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0300-0301,U+0303-0304,U+0308-0309,U+0323,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2199,U+2212,U+2215,U+FEFF,U+FFFD"

FONTTOOLS="uvx --quiet --from fonttools[woff]==4.60.1"

# subset <source> <output> [axis limits…]: pins unused axes and narrows wght before subsetting.
subset() {
  src=$1 out=$2
  shift 2
  tmp="web/.$out.ttf"
  $FONTTOOLS fonttools varLib.instancer "$src" "$@" -q -o "$tmp"
  $FONTTOOLS pyftsubset "$tmp" \
    --unicodes="$LATIN" --layout-features='*' --flavor=woff2 --output-file="web/$out"
  rm "$tmp"
  echo "web/$out $(wc -c < "web/$out" | tr -d ' ') bytes (from $(wc -c < "$src" | tr -d ' '))"
}

# The weight range must match `timelessSans()` in packages/ui/src/fonts.ts.
subset timeless/TimelessSansVF.woff2 timeless-sans.woff2 wght=400:700 ital=0 STYL=0
