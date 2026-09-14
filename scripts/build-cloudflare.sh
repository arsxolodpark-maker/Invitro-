#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="${1:-dist}"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

FILES=(
  index.html
  styles.css
  invitro-2026.css
  flow-guide.css
  v05.css
  v06.css
  v06-client-polish.css
  app.js
  v06-ui.js
  v06-patch.js
  flow-guide.js
  flow-fixes.js
  v06-client-polish.js
  _headers
)

for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "Missing deploy file: $file" >&2
    exit 1
  fi
  cp "$file" "$OUT_DIR/"
done

if [[ ! -f "$OUT_DIR/index.html" ]]; then
  echo "index.html was not packaged" >&2
  exit 1
fi

echo "Cloudflare artifact ready in $OUT_DIR"
find "$OUT_DIR" -maxdepth 1 -type f -printf '%f\n' | sort
