#!/usr/bin/env bash
#
# The single source of truth for what core pushes to the starter templates.
#
# The sync used to be spelled out separately inside each job of
# .github/workflows/sync-templates.yml. Four near-identical copies meant they
# drifted: one job selected on the wrong template name, and when the docs
# gained a dependency on _data/gallery.yml no job learned about it, so the
# gallery page would have broken in every template on the next sync.
# Add a path here once and every template gets it.
#
# Usage:  sync-core-files.sh <source-dir> <template-dir> <template-name>
#
# Run it locally against a checkout to see what a sync would do:
#   scripts/sync-core-files.sh . ../class-project-template class-project

set -euo pipefail

SRC="${1:?usage: sync-core-files.sh <source-dir> <template-dir> <template-name>}"
DEST="${2:?usage: sync-core-files.sh <source-dir> <template-dir> <template-name>}"
NAME="${3:?usage: sync-core-files.sh <source-dir> <template-dir> <template-name>}"

RSYNC=(rsync -a --delete)
[ "${VERBOSE:-1}" = "1" ] && RSYNC=(rsync -av --delete)

echo "── syncing core → ${NAME}"

# --- Code libraries. Wholly owned by core; a template never edits these. ------
"${RSYNC[@]}" "$SRC/_includes/"   "$DEST/_includes/"
"${RSYNC[@]}" "$SRC/_layouts/"    "$DEST/_layouts/"
"${RSYNC[@]}" "$SRC/assets/css/"  "$DEST/assets/css/"
"${RSYNC[@]}" "$SRC/assets/js/"   "$DEST/assets/js/"

# The search index is a Liquid template Jekyll renders per site, not a built
# artefact, and it sits at assets/search-index.json rather than inside
# assets/js/ — which is how the four directories above missed it for so long.
# Without it, assets/js/search.js fetches a 404 and the overlay finds nothing,
# on every template whose config says search: true. Copied as a single file
# because assets/ itself is not ours to sync wholesale.
cp "$SRC/assets/search-index.json" "$DEST/assets/search-index.json"

# milton-snow is a private demo and stays out of the templates. Excluding it
# from the copy is not enough: rsync also protects excluded paths from
# --delete, so a copy that predates the exclusion would sit in the template
# forever, never updated. Two templates had exactly that, and the stale copy
# referenced an include core no longer ships, which broke their builds. Remove
# it from the destination as well as skipping it in the source.
"${RSYNC[@]}" --exclude='milton-snow/' "$SRC/scrollstories/" "$DEST/scrollstories/"
rm -rf "$DEST/scrollstories/milton-snow"

# --- Documentation, including its own root index.md --------------------------
"${RSYNC[@]}" "$SRC/docs/" "$DEST/docs/"

mkdir -p "$DEST/_data" "$DEST/assets/images" "$DEST/scripts"

# The gallery page — "Sites Built with Xanthan" — is core's own. It is an
# argument for choosing the framework, aimed at someone deciding; a person
# reading it inside the site they already made from a template is past that
# point. It cost 11MB of other people's screenshots in every template, so it
# does not ship. Delete rather than skip: a template synced before this change
# already has it, and rsync would leave it there forever.
rm -f "$DEST/docs/getting-started/gallery.md"
rm -f "$DEST/_data/gallery.yml"

# A few gallery screenshots are used by docs pages that *do* ship — the starter
# chooser and the scrollstory introduction. Rather than name them here and have
# the list rot, read them back out of the docs just synced. Rebuild the folder
# from scratch so images that stop being referenced do not linger.
rm -rf "$DEST/assets/images/gallery"
mkdir -p "$DEST/assets/images/gallery"
grep -rhoE 'assets/images/gallery/[A-Za-z0-9._-]+' "$DEST/docs" 2>/dev/null | sort -u | while read -r ref; do
    name="${ref##*/}"
    [ -f "$SRC/assets/images/gallery/$name" ] && cp "$SRC/assets/images/gallery/$name" "$DEST/assets/images/gallery/$name"
done

"${RSYNC[@]}" "$SRC/assets/images/backgrounds/"  "$DEST/assets/images/backgrounds/"

# site/ holds the sample photographs the docs themselves display — the images
# reference renders /assets/images/site/default.jpg directly. Core owns this
# directory outright, so --delete is safe here.
"${RSYNC[@]}" "$SRC/assets/images/site/" "$DEST/assets/images/site/"

# The story-map components come with one worked example — scrollstories/trail —
# and that essay names two files outside the directories above: the
# georeferenced scan it lays on the world, and the GeoJSON it draws. Because
# scrollstories/ syncs wholesale the essay arrives in every template either
# way, and without these it renders a missing image over a failed fetch. Same
# shape of dependency as _data/gallery.yml, added here for the same reason.
# Core owns both directories outright, so --delete is safe.
mkdir -p "$DEST/assets/images/maps" "$DEST/assets/data"
"${RSYNC[@]}" "$SRC/assets/images/maps/" "$DEST/assets/images/maps/"
"${RSYNC[@]}" "$SRC/assets/data/"        "$DEST/assets/data/"

# The sample headshot that _data/nav-profile.yml points at. Copied as a single
# file rather than syncing profile/, because the portfolio template keeps its
# own photograph in that directory and --delete would take it away. Sending the
# data file without the image it names is what broke the nav demos.
mkdir -p "$DEST/assets/images/profile"
cp "$SRC/assets/images/profile/headshot_sketch.png" "$DEST/assets/images/profile/headshot_sketch.png"

# --- Image tools --------------------------------------------------------------
cp "$SRC/scripts/optimize-images.sh"   "$DEST/scripts/optimize-images.sh"
cp "$SRC/scripts/update-image-refs.sh" "$DEST/scripts/update-image-refs.sh"
cp "$SRC/scripts/README.md"            "$DEST/scripts/README.md"

# The Optimize Images workflow is what makes those scripts usable without a
# command line, so a template really should carry it — a site made from the
# template inherits .github/workflows/ along with everything else.
#
# It is off by default because GitHub refuses to let a Personal Access Token
# create or update a file under .github/workflows/ unless the token carries the
# `workflow` scope, and rejects the whole push when it tries. Every job failed
# that way once already.
#
# To turn it on: give SYNC_TOKEN the `workflow` scope (a separate checkbox on a
# classic token; "Workflows: Read and write" on a fine-grained one), then set
# SYNC_WORKFLOW_FILE=true in the workflow env.
if [ "${SYNC_WORKFLOW_FILE:-false}" = "true" ]; then
    mkdir -p "$DEST/.github/workflows"
    cp "$SRC/.github/workflows/optimize-images.yml" "$DEST/.github/workflows/optimize-images.yml"
else
    echo "  (skipping optimize-images.yml — set SYNC_WORKFLOW_FILE=true once SYNC_TOKEN has the workflow scope)"
fi

# --- Dependency and housekeeping files ---------------------------------------
cp "$SRC/Gemfile"      "$DEST/Gemfile"
cp "$SRC/.gitignore"   "$DEST/.gitignore"
cp "$SRC/CHANGELOG.md" "$DEST/XANTHAN_CHANGELOG.md"

# --- Per-template extras -----------------------------------------------------
case "$NAME" in
  scrollstory)
    # The Forest demo *is* this starter's front page. A scrollstory template
    # whose homepage is a page about scrollstories buries the thing it is
    # demonstrating one click deep, so the essay lands at the repo root.
    # Its includes reference images/ relative to themselves, which is why the
    # pictures go to a root images/ rather than staying alongside.
    cp "$SRC/scrollstories/forest/index.md" "$DEST/index.md"
    "${RSYNC[@]}" "$SRC/scrollstories/forest/images/" "$DEST/images/"

    # The demo used to land in your-story/ instead of at the root. A sync that
    # simply stops writing a path leaves the old one in place forever — the
    # same trap milton-snow fell into. The copy left behind was from before the
    # essay was updated and still called an include core no longer ships, which
    # broke the template's Pages build even though the sync itself succeeded.
    rm -rf "$DEST/your-story"
    ;;
esac

# nav-profile.yml is core's sample profile, needed by the nav demo pages. The
# portfolio template is excluded on purpose: there the file is the user's own
# profile ("Your Name", a bio to replace), and syncing would overwrite it.
case "$NAME" in
  portfolio) : ;;
  *) cp "$SRC/_data/nav-profile.yml" "$DEST/_data/nav-profile.yml" ;;
esac

# --- Never synced ------------------------------------------------------------
# _config.yml          — title, baseurl and theme are the template's own
# _data/nav-top.yml    — each template has its own navigation
# _data/nav-sections.yml
# assets/images/*      — apart from gallery/, backgrounds/, site/ and the
#                        sample headshot above
# .github/workflows/   — apart from optimize-images.yml above; the deploy and
#                        sync workflows are core's own
# anything at the root — index.md, about.md and friends are template content

echo "✓ ${NAME} synced"
