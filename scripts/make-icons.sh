#!/usr/bin/env bash
# The mascot as files, and favicons for every app, from one drawing: packages/ui/src/gri.ts.
#
# The mascot is Gri: a cartoon face of Griko on the site's amber. Run this after the drawing
# changes, and commit the files it writes. It needs bun, rsvg-convert (librsvg) and magick
# (ImageMagick):
#
#   ./scripts/make-icons.sh
#
# What it writes:
#   packages/ui/src/mascot.svg             the smile, as a file: the picture to upload to Sanity
#   apps/web/public, apps/archive/public   favicon.svg, favicon.ico, icon-192w.png, icon-512w.png,
#                                          and favicon-asleep.svg, favicon-asleep.ico: the tab
#                                          icon while the tab is in the background
#   apps/studio/static                     the names Sanity Studio looks for
#
# nbr.st (apps/links) has no files: its Worker sends favicon requests to nibras.co.
set -euo pipefail
cd "$(dirname "$0")/.."

SOURCE=packages/ui/src/mascot.svg
WORK=$(mktemp -d)
trap 'rm -r "$WORK"' EXIT

# The smile on amber, and the sleeping face on grey with no marks around the head.
SOURCE="$SOURCE" WORK="$WORK" bun -e '
  import { ASLEEP_GROUND, griFile } from "./packages/ui/src/gri.ts"
  await Bun.write(process.env.SOURCE, griFile("smile"))
  await Bun.write(`${process.env.WORK}/asleep-square.svg`, griFile("sleepy", { ground: ASLEEP_GROUND, marks: false }))
'

# Browser tabs get a circle; home-screen icons get the full square, which the system masks.
VIEW=$(grep -o 'viewBox="[^"]*"' "$SOURCE" | head -1 | sed 's/viewBox="//; s/"//')
read -r X Y SIZE _ <<<"$VIEW"
HALF=$(echo "$SIZE / 2" | bc -l)
CX=$(echo "$X + $HALF" | bc -l)
CY=$(echo "$Y + $HALF" | bc -l)
# round <square drawing> <name>: the drawing cut to a circle, as <name>.svg and <name>.ico.
round() {
  local body
  body=$(sed -e '1d' -e '$d' "$1")
  cat >"$WORK/$2.svg" <<SVG
<svg xmlns="http://www.w3.org/2000/svg" viewBox="$VIEW" width="512" height="512">
<clipPath id="circle"><circle cx="$CX" cy="$CY" r="$HALF"/></clipPath>
<g clip-path="url(#circle)">
$body
</g>
</svg>
SVG
  for size in 16 32 48; do rsvg-convert -w "$size" -h "$size" "$WORK/$2.svg" -o "$WORK/$2-$size.png"; done
  magick "$WORK/$2-16.png" "$WORK/$2-32.png" "$WORK/$2-48.png" "$WORK/$2.ico"
}
round "$SOURCE" favicon
round "$WORK/asleep-square.svg" favicon-asleep

square() { rsvg-convert -w "$1" -h "$1" "$SOURCE" -o "$2"; }
circle() { rsvg-convert -w "$1" -h "$1" "$WORK/favicon.svg" -o "$2"; }

for app in web archive; do
  out="apps/$app/public"
  mkdir -p "$out"
  cp "$WORK/favicon.svg" "$WORK/favicon.ico" "$out/"
  cp "$WORK/favicon-asleep.svg" "$WORK/favicon-asleep.ico" "$out/"
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

echo "Mascot and icons written from packages/ui/src/gri.ts"
