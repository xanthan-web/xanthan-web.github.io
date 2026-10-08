#!/bin/bash

# Image Optimization Script for Xanthan Sites
# Optimizes images in-place within image folders
# Skips images that are already optimized to avoid re-processing
#
# This one file is shared by Xanthan core, every starter template, and the
# sites made from them, and it runs both on laptops (macOS) and on GitHub's
# Linux runners through .github/workflows/optimize-images.yml. Keep it to
# tools both have: bash, find, awk and ImageMagick — no bc, no stat flags.

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Default optimization parameters
MAX_WIDTH=1600
MAX_HEIGHT=0  # 0 means unlimited height
MAX_EDGE=0    # 0 means disabled (use width/height instead)
QUALITY=85
SMALL_BYTES=300000  # under this, and within the size limits, counts as done
TARGET_FOLDER=""  # Empty means process all subfolders

# Base directories to search (can specify multiple with --base-dir)
BASE_DIRS=()
RECURSIVE=false
MAKE_BACKUP=true   # copies of changed files in .image-backups/; pointless where git already has them

# Folders that hold copies or third-party files, never a site's own images.
# _site/ in particular mirrors every image on a Jekyll site, so a whole-project
# run would otherwise optimize each image twice, and the next build overwrites
# the _site/ copies anyway.
SKIP_DIRS=(_site .git .jekyll-cache .sass-cache node_modules vendor .image-backups)
PRUNE_ARGS=()
for d in "${SKIP_DIRS[@]}"; do PRUNE_ARGS+=(-name "$d" -o); done
PRUNE_ARGS+=(-name "*-backup-*")   # backups made by older versions of this script

IMAGE_FIND=(\( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \))

# In a git repository, anything git ignores is skipped too — built output,
# caches, and backups under whatever name an older script gave them. SKIP_DIRS
# covers the same ground for a folder that isn't a git repository.
is_ignored() {
    [ "$IN_GIT" = true ] && git -C "$PROJECT_ROOT" check-ignore -q "$1" 2>/dev/null
}

# Stop unless $2 (the value given to option $1) is a whole number from $3 to
# $4. "2000px", "2,000" or 0 used to reach ImageMagick as a size of 0, which
# shrinks every image to a single pixel.
check_number() {
    if ! [[ "$2" =~ ^[0-9]{1,5}$ ]] || [ "$2" -lt "$3" ] || [ "$2" -gt "$4" ]; then
        echo -e "${RED}Error: $1 must be a whole number from $3 to $4, with nothing after it — got '$2'${NC}"
        exit 1
    fi
}

# Parse command line arguments
PREVIEW_MODE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --preview)
            PREVIEW_MODE=true
            shift
            ;;
        --folder)
            TARGET_FOLDER="$2"
            shift 2
            ;;
        --base-dir)
            BASE_DIRS+=("$2")
            shift 2
            ;;
        --recursive)
            RECURSIVE=true
            shift
            ;;
        --no-backup)
            MAKE_BACKUP=false
            shift
            ;;
        --max-edge)
            check_number --max-edge "$2" 1 20000
            MAX_EDGE="$2"
            MAX_WIDTH=0
            MAX_HEIGHT=0
            shift 2
            ;;
        --width)
            check_number --width "$2" 1 20000
            MAX_WIDTH="$2"
            MAX_EDGE=0
            shift 2
            ;;
        --height)
            check_number --height "$2" 0 20000
            MAX_HEIGHT="$2"
            MAX_EDGE=0
            shift 2
            ;;
        --quality)
            check_number --quality "$2" 1 100
            QUALITY="$2"
            shift 2
            ;;
        --help)
            echo "Image Optimization Script"
            echo "Usage: bash optimize-images.sh [options]"
            echo ""
            echo "Options:"
            echo "  --preview              Show what would be optimized (no changes)"
            echo "  --base-dir PATH        Base image directory to process (default: assets/images)"
            echo "                         Can be specified multiple times for multiple directories"
            echo "  --no-backup            Skip the backup copy. Safe inside a git repository,"
            echo "                         where the originals are already in history"
            echo "  --recursive            Find all image-containing directories within each base dir"
            echo "                         Use with --base-dir to scan a whole folder tree"
            echo "  --folder NAME          Process only a specific subfolder within each base dir"
            echo "  --max-edge N           Limit longest edge to N pixels"
            echo "  --width N              Max width in pixels (default: 1600)"
            echo "  --height N             Max height in pixels (default: 0, unlimited)"
            echo "  --quality N            JPEG quality 1-100 (default: 85)"
            echo ""
            echo "Examples:"
            echo "  bash optimize-images.sh --preview"
            echo "  bash optimize-images.sh"
            echo "  bash optimize-images.sh --base-dir . --recursive"
            echo "  bash optimize-images.sh --base-dir assets/images --max-edge 1600"
            echo "  bash optimize-images.sh --base-dir alice/images --base-dir bob/images"
            echo "  bash optimize-images.sh --base-dir essays/ --recursive"
            echo "  bash optimize-images.sh --folder backgrounds --max-edge 2000"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Resolve script directory so relative paths work from any CWD
SCRIPT_DIR="$(cd -- "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_ROOT="$PROJECT_ROOT/.image-backups"
IN_GIT=false
git -C "$PROJECT_ROOT" rev-parse --is-inside-work-tree &>/dev/null && IN_GIT=true
CONVERSION_LOG="$PROJECT_ROOT/png_to_jpg_conversions.txt"

# Default to assets/images if no base dirs specified
if [ ${#BASE_DIRS[@]} -eq 0 ]; then
    BASE_DIRS=("$PROJECT_ROOT/assets/images")
fi

# Resolve all base dirs to absolute paths
RESOLVED_DIRS=()
for dir in "${BASE_DIRS[@]}"; do
    # If relative, resolve from project root
    if [[ "$dir" != /* ]]; then
        dir="$PROJECT_ROOT/$dir"
    fi
    # Normalize "." and trailing slashes, so --base-dir . labels folders as
    # craft/images rather than ./craft/images
    [ -d "$dir" ] && dir="$(cd "$dir" && pwd)"
    RESOLVED_DIRS+=("$dir")
done

echo -e "${GREEN}=== Xanthan Image Optimizer ===${NC}"
echo -e "${BLUE}Settings:${NC}"
if [ "$MAX_EDGE" -gt 0 ]; then
    echo "  Max Edge:   ${MAX_EDGE}px (longest dimension)"
else
    echo "  Max Width:  ${MAX_WIDTH}px"
    if [ "$MAX_HEIGHT" -gt 0 ]; then
        echo "  Max Height: ${MAX_HEIGHT}px"
    else
        echo "  Max Height: unlimited"
    fi
fi
echo "  Quality:    ${QUALITY}"
echo "  Base dirs:"
for dir in "${RESOLVED_DIRS[@]}"; do
    if [ "$dir" = "$PROJECT_ROOT" ]; then echo "    . (the whole site)"; else echo "    ${dir#$PROJECT_ROOT/}"; fi
done
if [ -n "$TARGET_FOLDER" ]; then
    echo "  Subfolder:  $TARGET_FOLDER/"
fi
if [ "$PREVIEW_MODE" = true ]; then
    echo -e "${PURPLE}[PREVIEW MODE - No files will be modified]${NC}"
fi
echo ""

# Check if ImageMagick is installed and determine command
if command -v magick &> /dev/null; then
    MAGICK_CMD="magick"
    IDENTIFY_CMD="magick identify"
elif command -v convert &> /dev/null; then
    MAGICK_CMD="convert"
    IDENTIFY_CMD="identify"
else
    echo -e "${RED}Error: ImageMagick is not installed.${NC}"
    echo "Install it with: brew install imagemagick"
    exit 1
fi

# Preview renders each image for real, into here, so it reports actual sizes
# rather than a guess
WORK_DIR=$(mktemp -d "${TMPDIR:-/tmp}/optimize-images.XXXXXX")
trap 'rm -rf "$WORK_DIR"' EXIT

file_bytes() {
    wc -c < "$1" | tr -d ' '
}

kb() {
    echo $(( $1 / 1024 ))KB
}

# Function to check if PNG has transparency
has_transparency() {
    local file=$1
    local has_alpha=$($IDENTIFY_CMD -format "%A" "$file" 2>/dev/null)
    if [[ "$has_alpha" != "Blend" && "$has_alpha" != "True" && "$has_alpha" != "On" ]]; then
        return 1
    fi
    local alpha_min=$($IDENTIFY_CMD -format "%[fx:minima.a]" "$file" 2>/dev/null)
    [[ -n "$alpha_min" ]] && awk "BEGIN { exit !($alpha_min < 1.0) }"
}

# Does a WIDTHxHEIGHT image already fit the size limits?
fits_limits() {
    local w=$1 h=$2
    if [ "$MAX_EDGE" -gt 0 ]; then
        [ "$w" -le "$MAX_EDGE" ] && [ "$h" -le "$MAX_EDGE" ]
    else
        [ "$w" -le "$MAX_WIDTH" ] && { [ "$MAX_HEIGHT" -eq 0 ] || [ "$h" -le "$MAX_HEIGHT" ]; }
    fi
}

# Resize and compress $1 into $2 with the current settings. -auto-orient bakes
# in a phone photo's rotation before -strip discards the tag that records it;
# without it, photos taken holding the phone upright come out sideways.
#
# -strip also drops the color profile. iPhone photos (Display P3), Mac
# screenshots and Adobe RGB scans then look dull, because browsers read their
# colors as plain sRGB. So the original's profile is copied out first and put
# back afterwards: a kilobyte or so, while camera details and GPS stay gone.
# This works for JPG and WebP output, including PNGs converted to JPG. A PNG
# that stays PNG (it has transparency) still loses its profile, because
# ImageMagick won't write one into a PNG after -strip; those are rarely photos.
render() {
    local geometry
    if [ "$MAX_EDGE" -gt 0 ]; then
        geometry="${MAX_EDGE}x${MAX_EDGE}>"
    elif [ "$MAX_HEIGHT" -gt 0 ]; then
        geometry="${MAX_WIDTH}x${MAX_HEIGHT}>"
    else
        geometry="${MAX_WIDTH}x>"
    fi
    local icc="$WORK_DIR/color.icc" keep_color=()
    rm -f "$icc"
    if $MAGICK_CMD "$1" "$icc" 2>/dev/null && [ -s "$icc" ]; then
        keep_color=(-profile "$icc")
    fi
    $MAGICK_CMD "$1" -auto-orient -resize "$geometry" -quality "$QUALITY" -strip "${keep_color[@]}" "$2"
}

# Copy a file into .image-backups/<stamp>/ under its path in the project,
# before it is changed. The folder ignores itself, so it never gets committed
# even on a site whose .gitignore predates it; Jekyll skips dot-folders.
backup() {
    [ "$MAKE_BACKUP" = true ] || return 0
    local rel="${1#$PROJECT_ROOT/}"
    mkdir -p "$BACKUP_ROOT/$BACKUP_STAMP/$(dirname "$rel")"
    [ -f "$BACKUP_ROOT/.gitignore" ] || echo '*' > "$BACKUP_ROOT/.gitignore"
    cp -p "$1" "$BACKUP_ROOT/$BACKUP_STAMP/$rel"
}

# Process one image. Prints one line saying what happened, plus sizes.
optimize_image() {
    local img=$1
    local filename=$(basename "$img")
    local ext_lc=$(echo "${filename##*.}" | tr '[:upper:]' '[:lower:]')
    local dims=$($IDENTIFY_CMD -format "%w %h" "$img[0]" 2>/dev/null)
    local w=${dims% *} h=${dims#* }
    local size_before=$(file_bytes "$img")

    if [ -z "$dims" ]; then
        echo -e "  ${YELLOW}⚠ Can't read, skipping: $filename${NC}"
        return
    fi

    local fits=false
    fits_limits "$w" "$h" && fits=true

    # Small and already within the limits: nothing to gain
    if [ "$fits" = true ] && [ "$size_before" -lt "$SMALL_BYTES" ]; then
        echo -e "  ${GREEN}✓ Already optimized: $filename${NC}"
        skipped=$((skipped + 1))
        return
    fi

    # PNGs without transparency become JPGs — unless a JPG of the same name is
    # already there, which converting would overwrite
    local convert_to=""
    if [ "$ext_lc" = "png" ] && ! has_transparency "$img"; then
        local jpg_file="${img%.*}.jpg"
        if [ -e "$jpg_file" ]; then
            echo -e "  ${YELLOW}⚠ $(basename "$jpg_file") already exists, so $filename stays a PNG${NC}"
        else
            convert_to="$jpg_file"
        fi
    fi

    local out="$WORK_DIR/out.${ext_lc}"
    [ -n "$convert_to" ] && out="$WORK_DIR/out.jpg"
    rm -f "$out"
    if ! render "$img" "$out" 2>/dev/null || [ ! -s "$out" ]; then
        echo -e "  ${RED}✗ ImageMagick couldn't process $filename — left as is${NC}"
        return
    fi
    local size_after=$(file_bytes "$out")

    # Keep the original unless the new file is meaningfully smaller. An image
    # that already fits must shrink by 10% to be worth re-encoding: JPEG loses
    # a little more each time, and without this every run re-compressed every
    # large JPEG again for no gain.
    local threshold=$size_before
    [ "$fits" = true ] && threshold=$(( size_before * 9 / 10 ))
    if [ "$size_after" -ge "$threshold" ]; then
        echo -e "  ${GREEN}✓ Already well compressed: $filename ($(kb $size_before))${NC}"
        skipped=$((skipped + 1))
        return
    fi

    local saved=$(( (size_before - size_after) * 100 / size_before ))
    local would="optimize" did="Optimized" target="$img"
    if [ -n "$convert_to" ]; then
        would="convert to JPG"
        did="Converted to JPG"
        target="$convert_to"
    fi
    if [ "$PREVIEW_MODE" = true ]; then
        echo -e "  ${PURPLE}⚙ WOULD ${would}: $filename${NC}  $(kb $size_before) → $(kb $size_after) (-${saved}%)"
    else
        backup "$img"
        mv "$out" "$target"
        if [ -n "$convert_to" ]; then
            rm "$img"
            # Log conversion for update-image-refs.sh
            echo "${img#$PROJECT_ROOT/} -> ${convert_to#$PROJECT_ROOT/}" >> "$CONVERSION_LOG"
        fi
        echo -e "  ${YELLOW}⚙ ${did}: $filename${NC}  $(kb $size_before) → $(kb $size_after) (-${saved}%)"
    fi
    [ -n "$convert_to" ] && converted=$((converted + 1))
    count=$((count + 1))
}

# Function to optimize all images in a given directory (not recursive)
optimize_dir() {
    local dir_path=$1   # absolute path to the directory to process
    local label=$2      # display label

    if [ ! -d "$dir_path" ]; then
        echo -e "${BLUE}ℹ No directory found: $dir_path${NC}"
        return
    fi
    if is_ignored "$dir_path"; then
        return
    fi

    echo -e "${BLUE}Processing: $label${NC}"

    count=0
    skipped=0
    converted=0

    while IFS= read -r img; do
        optimize_image "$img"
    done < <(find "$dir_path" -maxdepth 1 -type f "${IMAGE_FIND[@]}" | sort)

    if [ "$PREVIEW_MODE" = true ]; then
        echo -e "${GREEN}✓ Would process $count images, skip $skipped already optimized${NC}"
        [ $converted -gt 0 ] && echo -e "  Would convert $converted PNG→JPG (no transparency)"
    else
        echo -e "${GREEN}✓ Processed $count images, skipped $skipped already optimized${NC}"
        [ $converted -gt 0 ] && echo -e "  Converted $converted PNG→JPG (no transparency)"
    fi
    echo ""
}

# Main processing
echo -e "${YELLOW}Starting optimization...${NC}"
echo ""

# Conversions are appended to png_to_jpg_conversions.txt, never cleared here:
# a site with several image sizes runs this once per size, and clearing on
# each run lost every conversion but the last run's. update-image-refs.sh
# removes the log once it has applied it.

BACKUP_STAMP=$(date +%Y%m%d-%H%M%S)

for BASE_DIR in "${RESOLVED_DIRS[@]}"; do

    if [ ! -d "$BASE_DIR" ]; then
        echo -e "${RED}Warning: Directory not found, skipping: $BASE_DIR${NC}"
        echo ""
        continue
    fi

    if [ -n "$TARGET_FOLDER" ]; then
        optimize_dir "$BASE_DIR/$TARGET_FOLDER" "${BASE_DIR#$PROJECT_ROOT/}/$TARGET_FOLDER"
    elif [ "$RECURSIVE" = true ]; then
        # Find all directories that contain at least one image file, at any
        # depth, without descending into SKIP_DIRS or backups
        while IFS= read -r img_dir; do
            label="${img_dir#$PROJECT_ROOT}"
            optimize_dir "$img_dir" "${label#/}"
        done < <(find "$BASE_DIR" -mindepth 1 \( "${PRUNE_ARGS[@]}" \) -prune \
                      -o -type f "${IMAGE_FIND[@]}" -print \
                 | while IFS= read -r f; do dirname "$f"; done | sort -u)
    else
        for dir in "$BASE_DIR"/*/; do
            [ -d "$dir" ] || continue
            folder=$(basename "$dir")
            # Skip backups and generated/third-party folders
            [[ "$folder" == *-backup-* ]] && continue
            [[ " ${SKIP_DIRS[*]} " == *" $folder "* ]] && continue
            optimize_dir "${dir%/}" "${BASE_DIR#$PROJECT_ROOT/}/$folder"
        done

        # This mode looks one level down, at subfolders. Images sitting loose in
        # the base directory are not touched, which reads as the script doing
        # nothing at all. Say so rather than exiting quietly.
        loose=$(find "$BASE_DIR" -maxdepth 1 -type f "${IMAGE_FIND[@]}" | wc -l | tr -d ' ')
        if [ "$loose" -gt 0 ]; then
            echo -e "${YELLOW}Note: $loose image(s) sit directly in ${BASE_DIR#$PROJECT_ROOT/} and were skipped.${NC}"
            echo -e "${YELLOW}      This mode only walks subfolders. Use --recursive to include them.${NC}"
            echo ""
        fi
    fi

done

echo -e "${GREEN}=== Optimization Complete! ===${NC}"
echo ""

if [ "$PREVIEW_MODE" = true ]; then
    echo -e "${PURPLE}[PREVIEW MODE COMPLETE]${NC}"
    echo ""
    echo -e "${YELLOW}To actually optimize, run the same command without --preview.${NC}"
    echo ""
else
    if [ -f "$CONVERSION_LOG" ]; then
        echo -e "${YELLOW}⚠ PNG→JPG conversions detected!${NC}"
        echo "Point pages, data files and styles at the new .jpg names with:"
        echo "  bash scripts/update-image-refs.sh"
        echo ""
    fi
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  • Verify the optimized images look good in your browser"
    echo "  • Run again anytime — already-optimized images are skipped"
    if [ "$MAKE_BACKUP" = true ] && [ -d "$BACKUP_ROOT/$BACKUP_STAMP" ]; then
        echo "  • Originals are in .image-backups/$BACKUP_STAMP — delete it once you're happy"
    fi
fi
