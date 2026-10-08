#!/bin/bash

# Update image references after PNG→JPG conversion
# Reads png_to_jpg_conversions.txt (written by optimize-images.sh) and points
# every reference to a converted PNG at its new .jpg — in pages (.md, .html),
# data files (.yml, .json), and styles and scripts (.css, .scss, .js).
# Only rewriting .md files used to leave _data/*.yml thumbnails and CSS
# backgrounds pointing at PNGs that no longer exist.

# Work from the project root, wherever the script is run from — that's where
# optimize-images.sh writes the log
SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.." || exit 1

if [ ! -f png_to_jpg_conversions.txt ]; then
    echo "No conversions file found. Run optimize-images.sh first."
    exit 1
fi

# Generated or third-party folders; the copies in them aren't ours to edit.
# Keep in step with SKIP_DIRS in optimize-images.sh.
SKIP_DIRS=(_site .git .jekyll-cache .sass-cache node_modules vendor .image-backups)
PRUNE_ARGS=()
for d in "${SKIP_DIRS[@]}"; do PRUNE_ARGS+=(-name "$d" -o); done
PRUNE_ARGS+=(-name "*-backup-*")

# Replace every reference to $1 with $2 in the site's text files; prints
# each file changed and returns whether any were. perl rather than sed -i,
# whose arguments differ between macOS and Linux. The lookarounds stop
# "map.png" from also matching "sitemap.png" or "map.png.bak".
replace_refs() {
    local found=1
    while IFS= read -r -d '' f; do
        grep -qF "$1" "$f" || continue
        n=$(OLD="$1" NEW="$2" perl -i -pe '$n += s/(?<![\w.-])\Q$ENV{OLD}\E(?![\w-]|\.\w)/$ENV{NEW}/g; END { print STDERR $n + 0 }' "$f" 2>&1)
        if [ "$n" -gt 0 ]; then
            echo "    ${f#./} ($n)"
            found=0
        fi
    done < <(find . -mindepth 1 \( "${PRUNE_ARGS[@]}" \) -prune -o -type f \
               \( -name "*.md" -o -name "*.markdown" -o -name "*.html" \
                  -o -name "*.yml" -o -name "*.yaml" -o -name "*.json" \
                  -o -name "*.css" -o -name "*.scss" -o -name "*.js" \) -print0)
    return $found
}

echo "Updating image references..."
updated=""

while IFS= read -r line; do
    [ -z "$line" ] && continue

    # Each line reads "old/path.png -> new/path.jpg". Split on the whole arrow:
    # IFS=' -> ' splits on every space, hyphen and > instead, which cut
    # silk-road-website.png down to "silk" and rewrote the wrong references.
    old_path="${line%% -> *}"
    new_path="${line#* -> }"
    old_file=$(basename "$old_path")
    new_file=$(basename "$new_path")

    # Pages usually name an image by a short relative path (images/map.png), so
    # matching is by filename. If a different image with the same name is still
    # on the site, a filename could mean either one: update only references
    # that spell out the full path, and leave the rest for a person.
    other=$(find . -mindepth 1 \( "${PRUNE_ARGS[@]}" \) -prune -o -type f -name "$old_file" -print | head -1)
    if [ -n "$other" ]; then
        echo "  ⚠ $old_path → $new_file (full-path references only)"
        replace_refs "$old_path" "$new_path" || echo "    (no full-path references found)"
        echo "    Another $old_file still exists at ${other#./}, so check any shorter"
        echo "    references to $old_file by hand: grep -rn \"$old_file\" ."
        continue
    fi

    # The same name converted in two folders: the pass above already
    # rewrote every reference to it, so don't report it as unused
    if printf '%s\n' "$updated" | grep -Fxq "$old_file -> $new_file"; then
        echo "  $old_file → $new_file (same name as above; already updated)"
        continue
    fi

    echo "  $old_file → $new_file"
    replace_refs "$old_file" "$new_file" || echo "    (no references found — the image may be unused)"
    updated="$updated
$old_file -> $new_file"
done < png_to_jpg_conversions.txt

# The log is used up; optimize-images.sh appends to it, so a stale one would
# replay these conversions on the next run
rm png_to_jpg_conversions.txt

echo ""
echo "✓ Image references updated!"
echo "Review changes with: git diff"
