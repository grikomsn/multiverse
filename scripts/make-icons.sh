#!/usr/bin/env bash
# Favicons for every app, from one drawing: packages/ui/src/mascot.svg.
#
# The mascot is Gri: a cartoon face of Griko on the site's amber. Run this after the drawing
# changes, and commit the files it writes. It needs rsvg-convert (librsvg) and magick
# (ImageMagick):
#
#   ./scripts/make-icons.sh
#
# What it writes:
#   apps/web/public, apps/archive/public   favicon.svg, favicon.ico, icon-192w.png, icon-512w.png
#   apps/studio/static                     the names Sanity Studio looks for
#
# nbr.st (apps/links) has no files: its Worker sends favicon requests to nibras.co.
set -euo pipefail
cd "$(dirname "$0")/.."

SOURCE=packages/ui/src/mascot.svg
WORK=$(mktemp -d)
trap 'rm -r "$WORK"' EXIT

# Browser tabs get a circle; home-screen icons get the full square, which the system masks.
VIEW=$(grep -o 'viewBox="[^"]*"' "$SOURCE" | head -1 | sed 's/viewBox="//; s/"//')
read -r X Y SIZE _ <<<"$VIEW"
HALF=$(echo "$SIZE / 2" | bc -l)
CX=$(echo "$X + $HALF" | bc -l)
CY=$(echo "$Y + $HALF" | bc -l)
BODY=$(sed -e '1d' -e '$d' "$SOURCE")
cat >"$WORK/favicon.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="$VIEW" width="512" height="512">
<clipPath id="circle"><circle cx="$CX" cy="$CY" r="$HALF"/></clipPath>
<g clip-path="url(#circle)">
$BODY
</g>
</svg>
SVG

square() { rsvg-convert -w "$1" -h "$1" "$SOURCE" -o "$2"; }
circle() { rsvg-convert -w "$1" -h "$1" "$WORK/favicon.svg" -o "$2"; }

for size in 16 32 48; do circle "$size" "$WORK/$size.png"; done
magick "$WORK/16.png" "$WORK/32.png" "$WORK/48.png" "$WORK/favicon.ico"

for app in web archive; do
  out="apps/$app/public"
  mkdir -p "$out"
  cp "$WORK/favicon.svg" "$WORK/favicon.ico" "$out/"
  square 192 "$out/icon-192w.png"
  square 512 "$out/icon-512w.png"
done

out=apps/studio/static
mkdir -p "$out"
cp "$WORK/favicon.svg" "$WORK/favicon.ico" "$out/"
circle 96 "$out/favicon-96.png"
circle 192 "$out/favicon-192.png"
circle 512 "$out/favicon-512.png"
square 180 "$out/apple-touch-icon.png"

echo "Icons written from $SOURCE"
