---
# Maintainer instructions, not a page on the site. GitHub Pages publishes
# any README.md as a page (this one appeared at /scripts/); this stops it.
published: false
---

# Image Optimization Guide

This guide helps you optimize images for your Xanthan site to improve loading times.

**No command line needed:** every Xanthan site has an **Optimize Images** job in its
GitHub **Actions** tab that runs these same scripts and commits the result. See
[Making your images smaller](https://xanthan-web.github.io/docs/reference/images#making-your-images-smaller).
This guide is for running them on your own computer.

**These files are shared.** `scripts/optimize-images.sh`, `scripts/update-image-refs.sh`
and `.github/workflows/optimize-images.yml` are identical in Xanthan core, every
starter template, and the sites made from them — don't customize your copy. To
update an older site, copy those three files from
[xanthan-web](https://github.com/xanthan-web/xanthan-web.github.io). Put anything
specific to your site (which folders, what sizes) in your own notes instead.

## Why Optimize Images?

Large image files (5–6MB) significantly slow down page loading. Optimized images:
- Load 10–20x faster
- Use less bandwidth
- Improve user experience on mobile devices
- Improve SEO rankings

## Installation

### Install ImageMagick

**macOS:**
```bash
brew install imagemagick
```

**macOS 12 (Monterey) — If you encounter libraw checksum errors:**
```bash
# Install ImageMagick from pre-built binary instead
curl -O https://imagemagick.org/archive/binaries/ImageMagick-arm64-apple-darwin20.1.0.tar.gz
sudo tar xzf ImageMagick-arm64-apple-darwin20.1.0.tar.gz -C /opt/
export PATH="/opt/ImageMagick-7.1.1/bin:$PATH"
# Add to ~/.bash_profile or ~/.zshrc to make permanent
```

**Windows:**
1. Download from [imagemagick.org/script/download.php](https://imagemagick.org/script/download.php)
2. Run the installer
3. Use Git Bash or WSL to run the script

Verify installation:
```bash
convert --version
```

## Using the Optimization Script

### Step 1: Preview First (Recommended)

From the project root directory, always preview changes first:

```bash
bash scripts/optimize-images.sh --preview
```

This shows what would be optimized **without modifying any files**. It really processes each image (into a temporary folder), so the sizes it reports are the actual before and after.

### Step 2: Run the Optimization

Once you're confident about the changes:

```bash
bash scripts/optimize-images.sh
```

The script will:
- Process all image subfolders under `assets/images/` in-place (by default)
- Copy each original it changes into `.image-backups/TIMESTAMP/` first (skip with `--no-backup`)
- Convert PNG → JPG when the PNG has no transparency — unless a JPG of the same name already exists
- Turn phone photos the right way up before removing their metadata
- Skip images that are already small and within the size limit, and keep any original that re-compressing wouldn't make at least 10% smaller — so running it again never degrades an image
- Show before/after file sizes

**Specifying image directories**

By default the script looks in `assets/images/`. Use `--base-dir` to target a different location — or multiple locations, which is useful for class project sites where each student has their own image folder:

```bash
# Process a different directory
bash scripts/optimize-images.sh --base-dir assets/photos

# Process multiple student directories explicitly
bash scripts/optimize-images.sh \
  --base-dir students/alice/images \
  --base-dir students/bob/images \
  --base-dir students/carol/images
```

**Recursive search**

For class project sites where images are scattered across many student folders, use `--recursive` to find every image-containing directory within a base path automatically:

```bash
# Finds essays/essay1/images/, essays/essay2/images/, etc.
bash scripts/optimize-images.sh --base-dir essays/ --recursive

# Or scan the whole project
bash scripts/optimize-images.sh --base-dir . --recursive
```

`--recursive` discovers any directory containing image files at any depth within the base dir, regardless of what the folder is named. It never descends into the generated `_site/` folder (which holds copies of every image), `.git`, `.jekyll-cache`, `node_modules`, `vendor`, or earlier backup folders.

To process only one subfolder within a base directory:
```bash
bash scripts/optimize-images.sh --folder backgrounds
bash scripts/optimize-images.sh --base-dir students/alice/images --folder portraits
```

### Step 3: Verify Results

Review the output summary showing how much space was saved. The script displays:
- Files that were optimized (with size reduction)
- Files that were already optimized and skipped

### Step 4: Test Your Site

```bash
bundle exec jekyll serve
```

Visit http://localhost:4000 and verify all images display correctly.

### Step 5: Keep or Delete Backup

The originals of every changed file are in `.image-backups/TIMESTAMP/`, in the same
folder layout as your site. The folder ignores itself, so it never gets committed,
and Jekyll doesn't publish it. Delete it once you're happy: `rm -rf .image-backups`

Your originals are in git history too: `git checkout -- path/to/image.jpg`
restores one before you commit.

## Quick Reference

### Image Size Guidelines

| Image Type | Max Width | Quality | Use Case |
|------------|-----------|---------|----------|
| Hero/Header images | 2000px | 85% | Full-width background images |
| General content | 1600px | 85% | Page images, project images |
| Portraits/thumbnails | 1200px | 85% | Team photos, small thumbnails |

### Common Commands

**Check image dimensions:**
```bash
identify -format "%wx%h %f\n" assets/images/*/*.png
```

**Check file sizes:**
```bash
du -sh assets/images/*
```

**Manually resize a single image:**
```bash
convert input.png -resize '1200x>' -quality 85 output.jpg
```

**Process with custom settings:**
```bash
bash scripts/optimize-images.sh --max-edge 1200 --quality 80
bash scripts/optimize-images.sh --folder backgrounds --max-edge 2000
bash scripts/optimize-images.sh --base-dir students/alice/images --folder photos --width 800
```

## Updating References After PNG → JPG Conversion

If the script converts any PNG files to JPG, it logs the conversions to `png_to_jpg_conversions.txt`. Run the companion script to point every reference at the new `.jpg` — in pages (`.md`, `.html`), data files (`.yml`, `.json`), and styles and scripts (`.css`, `.scss`, `.js`):

```bash
bash scripts/update-image-refs.sh
```

It matches by filename, so if a different PNG with the same name still exists elsewhere in the site, it skips that one and tells you to update it by hand rather than guess. Review changes with `git diff` before committing.

## Troubleshooting

**"convert: command not found"**
- ImageMagick is not installed. Follow installation instructions above.

**I want to test the script without modifying files**
- Use preview mode: `bash scripts/optimize-images.sh --preview`

**Images look blurry after optimization**
- Restore the original: `cp .image-backups/TIMESTAMP/path/to/image.jpg path/to/image.jpg`, or `git checkout -- path/to/image.jpg`
- Re-run with higher quality: `bash scripts/optimize-images.sh --quality 90`

**Script skipped my images**
- Images under ~300KB that already fit the size limit are skipped
- "Already well compressed" means re-compressing would save less than 10%, so the original was kept
- Images sitting directly in a base folder are only found with `--recursive`

**I need to restore original images**
- From the backup: `.image-backups/TIMESTAMP/` mirrors your site's folders
- From git: `git checkout -- path/to/image.jpg` (or `git checkout HEAD~1 -- ...` after committing)

**Script fails on Windows**
- Use Git Bash or Windows Subsystem for Linux (WSL)

## Best Practices

1. **Always preview before optimizing** — run `--preview` first, then optimize
2. **Crop before uploading** — don't upload 4000px images if they display at 800px
3. **Use the right format:**
   - JPG: Photos, complex images (smaller file size)
   - PNG: Graphics, logos, images requiring transparency
   - SVG: Icons, simple graphics (scalable, tiny file size)
4. **Run quarterly** — newly-added images will be processed; already-optimized ones are skipped
