---
title: Component Library
layout: default
date: 2026-02-14
---

{% include nav/scrollspy-toc.html %}

# Component Library

Every component in Xanthan, with its parameters and copy-paste code. Drop any of these into a page using the code shown, and the component renders automatically.

---

## Standalone Image

**File:** `images/figure.html`

Places a single centered image in your content, with caption and alt-text. The image sits on its own; whatever follows starts below it. To set an image beside a passage of text, use **Image + Text** (`figure-wrap.html`) below.

```
{% raw %}{% include images/figure.html
  image-width="60%"
  caption="A descriptive caption"
  alt-text="Description for screen readers"
  image-path="/assets/images/photo.jpg"
%}{% endraw %}
```

| Parameter | Required | Default | Options / Notes |
|-----------|----------|---------|-----------------|
| `image-path` | yes | --- | Relative or absolute path to image |
| `image-width` | no | `40%` | Any CSS width value |
| `caption` | no | --- | Supports Markdown |
| `alt-text` | no | uses caption | Accessibility text for screen readers |

---

## Image + Text (figure-wrap)

**File:** `images/figure-wrap.html`

Places an image beside a passage of text as a two-column pair. Nothing floats, so the text stays in its own column and never wraps under the image. This is the recommended way to put an image alongside text. On narrow screens the columns stack, image on top.

```
{% raw %}{% include images/figure-wrap.html
  image-path="/assets/images/photo.jpg"
  image-position="right"
  image-width="45%"
  caption="A descriptive caption"
  alt-text="Description for screen readers"
  text="The text that sits beside the image. Supports **Markdown**."
%}{% endraw %}
```

| Parameter | Required | Default | Options / Notes |
|-----------|----------|---------|-----------------|
| `image-path` | yes | --- | Relative or absolute path to image |
| `text` | yes | --- | Text beside the image; supports Markdown |
| `image-position` | no | `left` | `left` or `right` — which side the image is on |
| `image-width` | no | `40%` | CSS width of the image column |
| `caption` | no | --- | Caption below the image; supports Markdown |
| `alt-text` | no | uses caption | Accessibility text for screen readers |

---

## Jumbotron

**File:** `images/jumbotron.html`

Full-browser-width image that breaks out of the page content margins. Use it as a pure visual break, or add text — the gradient fade is applied automatically so text reads cleanly against the image.

```
{% raw %}{% include images/jumbotron.html
  image-path="/assets/images/backgrounds/pano-1.jpg"
  height="50vh"
  box-align="left"
  text="A pull quote or caption that sits on the clear left side of the image."
  background-position="center right"
  caption="Source: Maxwell Museum of Anthropology."
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `image-path` | yes | --- | Path to image |
| `height` | no | --- | CSS height; e.g. `50vh` |
| `box-align` | no | `left` | `left`, `right`, or `center` — positions text and sets gradient direction |
| `title` | no | --- | Heading above the text |
| `text` | no | --- | Body text; supports Markdown. Gradient applied automatically when present |
| `fade-start` | no | `35%` | How far the solid colour extends before it starts fading. At `0%` there is no solid region and the text sits on a wash |
| `fade-end` | no | `85%` | Where the fade becomes transparent. Lower it to show more photograph, but keep it past the text or the words end up on bare image |
| `overlay` | no | `panel` | `panel` or `image` — see below |
| `bg-color` | no | by mode | Colour the gradient fades from |
| `text-color` | no | by mode | Colour of the title and body text |
| `background-position` | no | `center` | CSS `background-position`; aim the photo subject away from the text side |
| `zoom` | no | `cover` | CSS `background-size`; e.g. `150%` to zoom in |
| `caption` | no | --- | Caption below the image; supports Markdown |
| `text-shadow` | no | `true` | Set to `false` when text sits on a solid/opaque area rather than busy image detail |

**`overlay` picks which of the two the jumbotron is:**

| `overlay` | What you see | Default `bg-color` | Default `text-color` |
|-----------|--------------|--------------------|----------------------|
| `panel` (default) | The text sits on a band of solid colour that fades sideways to reveal the photograph | `var(--bg-page)` | `var(--text-body)` |
| `image` | The photograph runs the full width and the text sits on it, over a sheer dark scrim | `var(--bg-scrim-sheer)` | `var(--text-on-photo)` |

Panel mode reads as part of the page; image mode reads as a picture you happen
to be reading on. Use panel when the words matter more than the photograph, and
image when the photograph is doing the work.

```
{% raw %}{% include images/jumbotron.html
  image-path="/assets/images/backgrounds/pano-1.jpg"
  overlay="image"
  box-align="right"
  title="Text over the photograph"
  text="The picture runs the full width; a sheer scrim keeps the words readable."
%}{% endraw %}
```

**Set `text-color` whenever you change `bg-color`.** The two are not linked: a
dark `bg-color` with the default dark text is the one way to make this component
unreadable, and it is the mistake worth guarding against.

```
{% raw %}{% include images/jumbotron.html
  image-path="/assets/images/backgrounds/pano-1.jpg"
  box-align="right"
  bg-color="var(--bg-feature-band)"
  text-color="var(--text-on-dark)"
  title="A dark panel"
  text="Dark band, light text — both stated, because neither implies the other."
%}{% endraw %}
```

**`box-align` controls both text placement and gradient direction:**

| `box-align` | Text position | Gradient direction |
|-------------|---------------|--------------------|
| `left` (default) | Left side | Left opaque → right transparent |
| `right` | Right side | Right opaque → left transparent |
| `center` | Centered over image | No gradient; text shadow used for legibility |

No `text` or `title`? The gradient is omitted — the include renders as a clean full-width image break.

---

## Before/After Slider

**File:** `images/juxtapose.html`

Draggable slider for comparing two images. Uses the [Juxtapose](https://juxtapose.knightlab.com/) library.

```
{% raw %}{% include images/juxtapose.html
  image1="/assets/images/before.jpg"
  image2="/assets/images/after.jpg"
  alt-text-left="Description of the before image"
  alt-text-right="Description of the after image"
  caption="Before and after renovation."
  starting-position="50%"
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `image1` | yes | --- | Left image path |
| `image2` | yes | --- | Right image path |
| `caption` | no | --- | Caption below slider |
| `starting-position` | no | `50%` | Initial slider position |
| `alt-text-left` | no | uses caption | Accessibility description for left image |
| `alt-text-right` | no | uses caption | Accessibility description for right image |

---

## Image Carousel

**File:** `images/carousel.html`

Slideshow of multiple images with optional titles and captions. Requires pre-defined lists.

```
{% raw %}{% assign images =
"/assets/images/photo-1.jpg,
/assets/images/photo-2.jpg,
/assets/images/photo-3.jpg" | split: ','
%}

{% assign headers =
"First Title,,Third Title" | split: ','
%}

{% assign captions =
"Caption for first image|
Caption for second image|
" | split: '|'
%}

{% assign alt_texts =
"Description of first image|
Description of second image|
Description of third image" | split: '|'
%}

{% include images/carousel.html
  width="80%"
  class="center"
  images=images
  headers=headers
  captions=captions
  alt-texts=alt_texts
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `images` | yes | --- | Pre-assigned list of image paths (comma-separated) |
| `headers` | no | --- | Slide titles (comma-separated; use empty values to skip) |
| `captions` | no | --- | Slide captions (pipe-separated to allow commas in text) |
| `alt-texts` | no | uses caption or header | Image descriptions (pipe-separated) |
| `width` | no | `100%` | CSS width |
| `class` | no | `center` | `left`, `center`, `right` |
| `id` | no | `carouselExample` | Unique ID (required for multiple carousels on one page) |

---

## Alert Box

**File:** `typography/alert.html`

Colored callout box for tips, warnings, or important information.

```
{% raw %}{% include typography/alert.html
  class="info"
  title="Note"
  text="Your message here. **Markdown** is supported."
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `class` | no | `info` | `info` (blue), `warning` (yellow), `danger` (red), `success` (green) |
| `text` | yes | --- | Alert content; supports Markdown |
| `title` | no | --- | Bold heading at top of alert |

---

## Pull Quote

**File:** `typography/pullquote.html`

A centered callout that highlights a key passage from your text. Good for drawing attention to a memorable phrase or key argument.

```
{% raw %}{% include typography/pullquote.html
  text="The interesting thing about this approach is that it challenges conventional assumptions."
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `text` | yes | --- | Quote content; supports Markdown |
| `width` | no | `70%` | CSS width override |

For quoted source material, use Markdown blockquotes with `>` and style the resulting `blockquote` element in `assets/css/typography.css`.

---

## Audio Player

**File:** `media/audio.html`

HTML5 audio player. See [Images & Media](images#embedding-media) for details on hosting audio files.

```
{% raw %}{% include media/audio.html
  src="/assets/audio/interview.mp3"
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `src` | yes | --- | Path to audio file (MP3, WAV, OGG) |

---

## Scrollspy Table of Contents

**File:** `nav/scrollspy-toc.html`

Sticky sidebar that auto-generates a table of contents from the headings on the page. Highlights the current section as the reader scrolls.

```
{% raw %}{% include nav/scrollspy-toc.html %}{% endraw %}
```

| Parameter | Default | Description |
|---|---|---|
| `headings` | `h2` | CSS selector for the headings to track. |

By default it tracks `h2` headings. If your sections are `h3`—as on an FAQ page, where each question is a smaller heading—pass the selector explicitly:

```
{% raw %}{% include nav/scrollspy-toc.html headings="h3" %}{% endraw %}
```

Place near the top of your page content (after front matter). On screens under 1100px it collapses to a horizontal list above the content; at wider sizes it moves into a sidebar column and the page's text column narrows to make room. If the page has no matching headings, the component removes itself so no empty sidebar is reserved.

---

## Card: Table of Contents

**File:** `cards/card-toc.html`

Renders a list of compact, text-focused cards from a set of pages.

```
{% raw %}{% assign card_pages = site.pages | where_exp: "page", "page.path contains 'essays/'" %}

{% include cards/card-toc.html rows = card_pages %}{% endraw %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `rows` | yes | A Liquid-assigned collection of pages |

Pages should have `title`, `author`, and `summary` in their front matter for best results. Add `position: 1`, `position: 2`, etc. to control sort order.

---

## Card: Compact List

**File:** `cards/card-toc-compact.html`

Smaller, text-only cards stacked vertically---more compact than `card-toc.html` and better suited for long lists or documentation indexes. Shows title, summary, and an optional `topics` list as sub-bullets.

```
{% raw %}{% assign card_pages = site.pages | where_exp: "page", "page.path contains 'docs/'" %}

{% include cards/card-toc-compact.html rows = card_pages %}{% endraw %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `rows` | yes | A Liquid-assigned collection of pages |

Pages should have `title` and `summary` in their front matter. Add `position: 1`, `position: 2`, etc. to control sort order. Optional `topics:` list in front matter renders as sub-bullets under the summary.

---

## Card: Stacked

**File:** `cards/card-stack.html`

Wide horizontal cards with larger images, stacked vertically.

```
{% raw %}{% assign stacked_cards = site.pages | where_exp: "page", "page.path contains 'essays/'" %}

{% include cards/card-stack.html cards = stacked_cards %}{% endraw %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `cards` | yes | A Liquid-assigned collection of pages |
| `card-class` | no | Additional CSS class added to each card |


Cards sort by `position` front matter if present. Pages without `position` appear last.

### Showing who made it

Two optional front-matter fields on the page (or keys on the card object) let a
card carry attribution --- the thing a collaborative site needs most:

| Field | Renders as | Example |
|-------|-----------|---------|
| `kicker` | small uppercase line above the title | `kicker: Casa Fresco Farm` |
| `byline` | italic line under the title | `byline: Seth Matteucci` |

```
{% raw %}---
title: Chess across the Silk Road
byline: Seth Matteucci
summary: Traces of the game's history across old trade routes.
---{% endraw %}
```

Both are optional and collapse to nothing when unset, so existing cards are
unaffected. Use `kicker` for the group a piece belongs to (a farm, a course, a
theme) and `byline` for the people who made it.

---

## Card: Grid

**File:** `cards/card-grid.html`

Traditional card grid layout with balanced text and images.

```
{% raw %}{% assign stories = site.pages | where_exp: "page", "page.path contains 'essays/'" %}

{% include cards/card-grid.html cards = stories %}{% endraw %}
```

| Parameter | Required | Notes |
|-----------|----------|-------|
| `cards` | yes | A Liquid-assigned collection of pages |

Cards sort by `position` front matter if present. Pages without `position` appear last.

---


## Gallery Grid

**File:** `nav/gallery-grid.html`

Image-first navigation for collections. Use it when readers are choosing among pages by looking first: project galleries, visual archives, place collections, or exhibit-style indexes. Titles stay visible over the image; summaries reveal on hover or keyboard focus when `show-summary=true`.

```
{% raw %}{% assign gallery_pages = site.pages | where_exp: "page", "page.path contains 'projects/'" %}

{% include nav/gallery-grid.html
  items = gallery_pages
  variant = "mosaic"
  show-summary = false
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `items` | yes | --- | A Liquid-assigned collection of pages or data objects |
| `variant` | no | `mosaic` | `mosaic` gives varied tile sizes; `uniform` keeps all tiles equal; `masonry` keeps each image's own proportions |
| `min-width` | no | `180px` | Minimum tile width before the grid wraps, and the column width under `masonry` |
| `gap` | no | `var(--spacing-xs)` | Space between tiles |
| `max-height` | no | `26rem` | Under `masonry`, the tallest a tile may grow before its image crops |
| `image-field` | no | `thumbnail` | Front matter field to use for images |
| `show-title` | no | `true` | Show titles over images |
| `show-summary` | no | `false` | Show summaries over images |
| `class` | no | --- | Additional CSS class on the gallery wrapper |

Items should have `title`, `thumbnail`, and either `url` or `link`. If an item does not have an image, Xanthan renders a visible warning so the missing field is easy to find.

Pass `heading` and `intro` rather than writing them above the include: the
grid is wider than the text column, so a heading written in the page body
would sit on a different left edge and the two would read as unrelated.

| Parameter | Notes |
|-----------|-------|
| `heading` | Section heading, aligned to the grid's left edge |
| `intro` | Paragraph under the heading; Markdown supported |
| `heading-level` | 2--6, level for each tile title (default 3) |

### The masonry variant

`mosaic` and `uniform` crop every tile to a square. That is right for
screenshots, which are all the same shape to begin with, and wrong for
photographs of things: a scroll is tall, a dish is wide, and squaring them
throws away what the picture tells you for free.

`masonry` lays the tiles out in columns instead, each one keeping its image's
own proportions. Add `gallery-grid--bleed` and the wall runs the full width of
the page rather than stopping at the text measure.

```
{% raw %}{% assign objects = site.pages | where_exp: "p", "p.path contains 'objects/'" %}

{% include nav/gallery-grid.html
  items = objects
  variant = "masonry"
  min-width = "220px"
  show-summary = true
  class = "gallery-grid--bleed"
%}{% endraw %}
```

A single very tall image would otherwise become a column of its own, so images
crop from the centre once a tile reaches `max-height`. Raise it to let tall
objects run their full length; lower it for a more even wall.

Write the heading and introduction in the page body for a bleed gallery rather
than passing `heading` and `intro`. Those align to the grid's left edge, which
here is the edge of the window; a centred introduction above a full-width wall
is what you want instead.

| Class | Notes |
|-------|-------|
| `gallery-grid--wide` | Breaks out of the text column to 64rem, centred |
| `gallery-grid--bleed` | Runs the full width of the page |

---

## Interactive Map

**File:** `nav/map.html`

Leaflet-based map that auto-generates markers from pages with `geo` front matter, and builds each popup from the rest of that page's front matter.

```
{% raw %}{% include nav/map.html
  folder="objects"
  fields="object-date,medium,collection"
  class="map-wrap--wide"
  height="70vh"
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `folder` | no | every page | Map only the pages under this folder |
| `fields` | no | --- | Front matter fields printed in the popup under the place name, comma-separated |
| `image-field` | no | `thumbnail` | Field holding the popup image, falling back to `header-image` |
| `height` | no | `700px` | CSS height |
| `width` | no | `100%` | CSS width |
| `class` | no | --- | Extra classes on the wrapper; `map-wrap--wide` breaks out of the text column |
| `start-coords` | no | fits the markers | Opening center `"[lat, lng]"` |
| `zoom` | no | `8` | Opening zoom with `start-coords`; otherwise the closest the fit may go |
| `id` | no | `map` | Unique ID for multiple maps |

Pages appear as markers when they have `geo: [lat, lng]` in their front matter. Optional fields: `placename`, `summary`, `thumbnail` or `header-image`, `alt-text`, and anything named in `fields`. With nothing to draw, the component prints a note saying so rather than an empty box.

---

## Historic Map

**File:** `maps/figure-map.html`

Lays a scanned map over real coordinates and draws GeoJSON on top of it. Sits in the text column like an illustration.

```
{% raw %}{% include maps/figure-map.html
  overlay-image="/assets/images/maps/whipple-1854.webp"
  overlay-bounds="32.45416, -119.73999, 37.10777, -106.34216"
  overlay-alt="Whipple's 1854 survey of a route near the 35th parallel"
  geojson="/assets/data/old-spanish-trail.geojson"
  caption="The Old Spanish Trail, drawn over Whipple's survey."
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `overlay-image` | no | --- | The scanned map to place on the world |
| `overlay-bounds` | with an overlay | --- | `"south, west, north, east"` corners of that scan |
| `overlay-alt` | with an overlay | --- | Description of the scan for screen readers |
| `overlay-opacity` | no | `0.9` | 0--1 |
| `geojson` | no | --- | Path to a GeoJSON file of routes and places |
| `basemap` | no | --- | XYZ tile URL drawn underneath, e.g. OpenStreetMap |
| `basemap-opacity` | no | `0.5` | 0--1 |
| `basemap-attribution` | no | --- | Credit for the basemap |
| `attribution` | no | --- | Credit for the scan and the data |
| `center` | no | fits the overlay | `"lat, lng"` |
| `zoom` | no | fits the overlay | Zoom level |
| `height` | no | `32rem` | CSS height |
| `interactive` | no | `true` | `false` stops the reader panning and zooming |
| `map-id` | no | `figure-map` | Needed only if a page holds more than one map |
| `caption` | no | --- | Printed under the map |

Give it an overlay, a GeoJSON file, or both. With neither it says so rather than rendering an empty box.

### What the GeoJSON needs

Any GeoJSON works. These property names are the ones the component reads:

| Property | Used for |
|----------|----------|
| `name` | The hover label, and the value `highlight` matches against |
| `description` | Body of the popup |
| `place` | Small grey line under the popup title |
| `url` | Adds a "More information" link to the popup |

Lines are drawn as routes, points as markers. Anything else in the file is ignored, so a file exported from somewhere else usually works without editing.

### Finding the corner coordinates

`overlay-bounds` is the south, west, north, and east edges of the scan, in decimal degrees. Three ways to get them:

- **The map is already georeferenced somewhere.** Collections that publish through ArcGIS or a tile server state the extent in their metadata; convert it to degrees if it is in Web Mercator.
- **Georeference it yourself.** [Allmaps](https://allmaps.org/) and Map Warper both take a scan, let you pin it to known points, and give you back the corners.
- **Read them off a modern map.** For a map covering a wide area, finding the latitude and longitude of each corner by eye is often close enough.

Expect the fit to be approximate. `overlay-bounds` stretches the image to a rectangle; it cannot correct a projection, and most historic maps use a different one. For an essay about how a mapmaker saw a place, that is usually the honest result — but do not use it to make claims about precise locations.

---

## Story Map

**Files:** `maps/story-map.html`, `maps/story-map-panel.html`, `maps/story-map-panel-end.html`, `maps/story-map-end.html`

The same map, pinned to the viewport while passages of text scroll over it. Each passage can move the map somewhere new.

```
{% raw %}{% include maps/story-map.html map-id="trail"
  overlay-image="/assets/images/maps/whipple-1854.webp"
  overlay-bounds="32.45416, -119.73999, 37.10777, -106.34216"
  overlay-alt="Whipple's 1854 survey of a route near the 35th parallel"
  geojson="/assets/data/old-spanish-trail.geojson"
  center="35.9, -112.0" zoom="6" %}

{% include maps/story-map-panel.html map-id="trail" center="35.688, -105.938" zoom="9" %}
## Santa Fe

Your prose, in ordinary Markdown.
{% include maps/story-map-panel-end.html %}

{% include maps/story-map-panel.html map-id="trail" highlight="Armijo Route" %}
The named route stays bold; everything else dims.
{% include maps/story-map-panel-end.html %}

{% include maps/story-map-end.html %}{% endraw %}
```

`maps/story-map.html` takes every parameter the historic map takes, plus:

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `map-id` | **yes** | --- | Unique id; the panels use it to find this map |
| `height` | no | `100vh` | CSS height of the pinned map |

`maps/story-map-panel.html`:

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `map-id` | **yes** | --- | Which map this panel drives |
| `center` | no | --- | `"lat, lng"` the map moves to |
| `zoom` | no | holds | Zoom level to settle at |
| `highlight` | no | --- | A feature's `name`; everything else dims |
| `overlay` | no | --- | Swap in a different scan |
| `opacity` | no | --- | Set the overlay's opacity, 0--1 |
| `panel-align` | no | `center` | `left`, `right`, or `center` |

The map moves when a panel reaches the middle of the screen. Between panels it holds its last position, and scrolling back up retraces the steps.

> **Close what you open.** `maps/story-map.html` and `maps/story-map-panel.html` each leave a `div` open so your prose stays ordinary Markdown. Every panel needs `maps/story-map-panel-end.html`, and the sequence needs `maps/story-map-end.html`. Without them the rest of the page ends up inside the map.

For a beat with no words --- a wide view between two passages --- use `maps/story-map-step.html`, which takes the same parameters as a panel but renders nothing.

See [The Old Spanish Trail](../../scrollstories/trail/) for all of it working together.

---

## Breadcrumbs

**File:** `nav/breadcrumbs.html`

Auto-generated navigation trail based on the page's URL path.

```
{% raw %}{% include nav/breadcrumbs.html %}{% endraw %}
```

No parameters. Renders a trail like: Home > Section > Page.

---

## Feature Row

**File:** `layout/feature-row.html`

A horizontal row with text and a button link. Useful for landing pages or feature lists.

```
{% raw %}{% include layout/feature-row.html
  title="Explore Projects"
  text="See what students have built with Xanthan."
  link="/projects/"
  button="View Projects"
  text-width="50"
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `title` | yes | --- | Heading text |
| `text` | yes | --- | Description text |
| `link` | yes | --- | Button destination URL |
| `button` | no | uses `title` | Button label |
| `text-width` | no | `50` | Percentage width of text area |

---

## Section Band

**Files:** `layout/section.html` and `layout/section-end.html`

A full-width tinted or dark band behind a run of content, used to break a long
page into visually distinct stretches.

Page content normally sits inside a centred column. A band has to span the
whole window, which means stepping outside that column and back in again --- so
this comes as a pair. Put your content between them and write ordinary Markdown
in the middle.

```
{% raw %}{% include layout/section.html style="cool" %}

## Who this is for

Ordinary Markdown goes here---headings, paragraphs, images, other includes.

{% include layout/section-end.html %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `style` | no | `alt` | `alt`, `cool`, or `warm` |

- **`alt`** --- a subtle tint. The everyday band.
- **`cool`** --- a second tint, for when two bands would otherwise sit close
  enough to read as the same interruption twice.
- **`warm`** --- a dark band with light text, for a deliberate change of voice.

**Always close what you open.** A band without its `section-end` will run to
the bottom of the page.

---

## Feature Grid

**File:** `layout/feature-grid.html`

A set of short titled points set side by side instead of stacked. Use it for the
"here's what this gives you" passages that otherwise become a long column of
small headings and paragraphs. It collapses to a single column on phones.

The points live in your page's front matter, so the page body stays short:

```
{% raw %}---
title: About This Project
principles:
  - title: "Open"
    text: "Your site is made of files you control and can move elsewhere."
  - title: "Transparent"
    text: "The structure is visible: content, navigation, and design."
  - title: "Accessible"
    text: "Start with Markdown, then learn the vocabulary of the web."
  - title: "Collaborative"
    text: "Projects can grow through many contributors."
---{% endraw %}
```

Then place it wherever you want the grid to appear:

```
{% raw %}{% include layout/feature-grid.html features=page.principles %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `features` | yes | --- | Array of `title` / `text` pairs, usually `page.<name>` |
| `columns` | no | `2` | `2` or `3` columns on wide screens |

`text` accepts Markdown, so links and emphasis work inside a point.

---

## Page Header (via front matter)

**File:** `layout/page-header.html`

Called automatically by the page layout when `header-image` is in the front matter. You don't call it directly — just add fields to your page. Three tiers control the header's visual weight; five filter modes transform how the background image appears.

```yaml
---
header-image: /assets/images/backgrounds/canyon.jpg
header-tier: section
header-filter: photo
header-title: River Crossings
header-position: center right
---
```

**Tier** controls height and text layout:

| `header-tier` | Height | Text elements |
|---------------|--------|---------------|
| `hero` | 100vh | eyebrow, title, divider, subtitle |
| `section` | 60vh | title only |
| `banner` | 22vh | title only, sans-serif |

**Filter** transforms the background image:

| `header-filter` | Best for |
|-----------------|----------|
| `photo` | Color photos (default) |
| `botanical` | Line-art engravings, dark lines on white background |
| `sketch` | Faint line drawings (boosts contrast before inverting) |
| `woodcut` | Historical color images; preserves natural color |
| `etching` | Line art → dark brown lines on a muted sheet (not inverted) |

**All front matter fields:**

| Field | Default | Notes |
|-------|---------|-------|
| `header-image` | --- | Path to image (required to trigger header) |
| `header-tier` | `hero` | `hero`, `section`, or `banner` |
| `header-filter` | `photo` | See filter table above |
| `header-title` | --- | Title text overlaid on image |
| `header-eyebrow` | --- | Small caps line above title (hero only) |
| `header-subtitle` | --- | Paragraph below title (hero only) |
| `header-divider` | --- | Text between decorative lines (hero only) |
| `header-position` | `center right` | CSS `background-position` value |
| `header-opacity` | tier default | Override image opacity (0–1) |
| `header-zoom` | `cover` | CSS background-size; e.g. `150%` to zoom in |
| `header-height` | tier default | CSS height override; e.g. `60vh` |
---

## Landing Page Sections

The six components below are for a homepage that has to introduce a whole
project, or a person, rather than open a single argument. Each one is a
full-width band that takes its content from front matter, so the page body ends
up as a short list of includes and everything editable sits at the top of the
file.

They are designed to be stacked. A common order is hero, split intro, feature
block, picks, link index --- but nothing requires all six, and a homepage built
from two of them is a perfectly good homepage. A portfolio site usually opens
with **Profile Intro** instead of a hero.

Every band spans the window and re-centres its own contents. To make them all
wider or narrower at once, override one variable in your site's CSS:

```css
:root { --home-measure: 76rem; }
```

---

## Home Hero

**File:** `layout/home-hero.html`

A full-bleed opening image with a headline and, if you want them, buttons.

This is the sibling of **Page Header**, and which one you want depends on where
the opening sits. A page header comes from front matter and is drawn above your
content by the layout. A home hero is a component you place in the page body,
so other sections can follow it directly --- and unlike the page header, it can
carry buttons.

```yaml
{% raw %}---
title: The Silk Road
hero:
  image: /assets/images/gate.jpg
  alt: The tiled Ata Darvaza gate in Khiva, Uzbekistan
  kicker: A digital exhibition of movement, material, and myth
  title: The Silk Road Was Stranger Than Silk
  text: Games, cosmetics, glass, and religion moved along the same routes.
  buttons:
    - label: Read the Essays
      url: /essays/
    - label: Browse Objects
      url: /objects/
---{% endraw %}
```

```
{% raw %}{% include layout/home-hero.html hero=page.hero %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `hero` | yes | --- | The front matter block, usually `page.hero` |
| `align` | no | `left` | `left` or `center` |

Inside `hero`: `image` (required), `alt`, `kicker`, `title`, `text`, and
`buttons` (a list of `label` / `url` pairs).

The dark scrim that keeps the headline readable is drawn by the stylesheet, not
baked into your image, so you can drop in any photo without editing it first.

---

## Profile Intro

**File:** `layout/profile-intro.html`

A photograph beside a name, a short bio, and a row of links. The opening block
of a personal or portfolio homepage.

This is the successor to the profile sidebar. The sidebar puts the same
material in a permanent left rail, which costs a column of the window on every
page it appears on --- and on a phone it stacks above the content anyway, so it
becomes this block, only pushing your actual homepage text below the fold.
Reach for the sidebar when a reader genuinely needs your links present on every
page. Reach for this when they need them once, on the way in.

It reads `_data/nav-profile.yml`, the same file the sidebar uses, so a site
already set up for the sidebar can switch without editing any data.

```yaml
{% raw %}# _data/nav-profile.yml
image_url: /assets/images/profile/headshot.jpg
alt_text: A photograph of Your Name
name: Your Name
role: Associate Professor of History
description: One or two sentences about who you are and what you do.

links:
  - title: GitHub
    url: https://github.com/you
    icon: fab fa-github
  - title: Email
    url: mailto:you@example.edu
    icon: fas fa-envelope{% endraw %}
```

```
{% raw %}{% include layout/profile-intro.html %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `profile` | no | `site.data.nav-profile` | An object to use instead of the data file |
| `shape` | no | `rounded` | `rounded` or `circle` |
| `width` | no | `content` | `content` lines the block up with the page's text column; `wide` matches the other landing bands |
| `level` | no | `1` | `2` if the page already has an `h1`, such as one with a page header |

Unlike the other bands here, this one sits on the text column by default. A
portfolio homepage is usually prose with an opening block on top rather than a
stack of bands, and a wider opening reads as off-grid against the paragraph
beneath it. Pass `width="wide"` on a page that really is built from bands.

The name is set as the page's `h1` by default, so the page body should not also
open with a `# Heading` --- that would give the page two.

`role` is optional and new; the sidebar does not display it. Everything else
comes from keys the sidebar already reads.

Icons come from [Font Awesome](https://fontawesome.com/icons), the same set the
sidebar uses. Links to other sites open in a new tab; internal links, anchors,
and `mailto:` links do not.

---

## Split Intro

**File:** `layout/split-intro.html`

One large claim on the left, the explanation on the right. For an opening
argument where a single sentence carries the point and a paragraph or two does
the qualifying.

```yaml
{% raw %}---
opening_argument:
  kicker: Opening Argument
  title: The Silk Road was not a single road, and it was not only about silk.
  text:
    - The name evokes caravans crossing the breadth of the known world.
    - The history is stranger, and this site follows those threads.
---{% endraw %}
```

```
{% raw %}{% include layout/split-intro.html intro=page.opening_argument %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `intro` | yes | --- | The front matter block, usually `page.<name>` |

Inside `intro`: `title` (required), `kicker`, and `text`. Write `text` as a list
of paragraphs or as a single string; either works, and both accept Markdown.

---

## Feature Block

**File:** `layout/feature-block.html`

One item given the full width: a large image on one side, its title, summary,
byline, and a link on the other. For the single thing you most want a visitor to
read.

You name the item by its slug --- the folder or file name --- and the component
reads the rest off that page, so the block stays current when the page is
edited.

```
{% raw %}{% include layout/feature-block.html
    collection="essays"
    slug="chess"
    label="Featured Essay"
    cta="Follow the game" %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `collection` | yes | --- | Folder the item lives in, e.g. `essays` |
| `slug` | yes | --- | The item's folder or file name |
| `label` | no | `Featured` | Small caps kicker above the title |
| `cta` | no | `Read more` | Text on the link at the bottom |
| `image` | no | the page's `thumbnail` | Override the image |
| `flip` | no | `false` | `true` puts the image on the right |

Read from the item's own front matter: `title`, `summary`, `thumbnail`, and
`author`.

---

## Picks

**File:** `layout/picks.html`

A chosen handful of pages from a collection, shown image-first.

Card grids and gallery grids show everything in a folder, in whatever order the
folder gives. Picks shows the few items you name, in the order you name them ---
which is what lets a homepage make an editorial selection instead of a directory
listing.

```yaml
{% raw %}---
reading_paths:
  - slug: chess
    title: "Games & Play"
    text: Chess, polo, and sport as evidence of cultural movement.
  - slug: greco-buddhist-art
    title: "Faith & Transformation"
    text: Images and beliefs crossing languages and regions.
---{% endraw %}
```

```
{% raw %}{% include layout/picks.html
    items=page.reading_paths
    collection="essays"
    variant="tiles"
    kicker="Reading Paths"
    title="Choose a thread and follow it across cultures." %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `items` | yes | --- | List of items, each with a `slug` |
| `collection` | yes | --- | Folder the items live in |
| `variant` | no | `tiles` | `strip`, `tiles`, or `feature` |
| `title` | no | --- | Heading above the block |
| `kicker` | no | --- | Small caps label above the heading |
| `columns` | no | by variant | Tiles across on wide screens |

The three variants:

- **`strip`** --- a row of upright thumbnails with the caption underneath. For
  objects, people, or anything where the picture is the identifier. Five across
  by default.
- **`tiles`** --- equal tiles on a dark band, caption laid over the image. For
  themes or routes into the site, where the text does real work. Four across.
- **`feature`** --- like tiles, but the first item gets double height, for an
  editor's-picks block with a clear lead. Two across.

Each item takes `slug` plus any of `label`, `title`, `text`, `image`, and `alt`.
Anything you leave out comes from the item's own page: `title` from its title,
`text` from its summary, `image` from its thumbnail, `label` from its
`category` if it has one.

One deliberate exception: in the `strip` variant, `text` appears only if you
write one. A row of small upright thumbnails has no room for a paragraph under
each, so summaries are not pulled in there automatically.

**Where items are looked up.** Three shapes are tried in order, so this works
whether or not your site uses Jekyll collections: a declared collection matched
on slug, then `<collection>/<slug>/index.md`, then `<collection>/<slug>.md`. If
none match, the page shows a warning box naming what it looked for.

---

## Link Index

**File:** `layout/link-index.html`

A titled block of labelled links, one per row --- the "where to go from here"
section at the foot of a landing page. Each row gives a destination a name and a
sentence, which a plain list of links cannot do.

```yaml
{% raw %}---
explore_links:
  - label: Thematic Essays
    url: /essays/
    text: Read the full set of thematic studies.
  - label: Eurasian Map
    url: /map/
    text: See where the stories sit across Eurasia.
---{% endraw %}
```

```
{% raw %}{% include layout/link-index.html
    links=page.explore_links
    kicker="Explore More"
    title="The collection keeps opening outward." %}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `links` | yes | --- | List of `label` / `url` / `text` entries |
| `title` | yes | --- | Heading for the block |
| `kicker` | no | --- | Small caps label above the heading |

Use it for a handful of major destinations. It is not a substitute for site
navigation.



---

## Peekaboo Background

**File:** `scrollybox/bg.html`

A fixed background image that is revealed as page content scrolls over it, creating a parallax-like effect. Optionally adds a text box that scrolls past the image.

```
{% raw %}{% include scrollybox/bg.html
  height="100vh"
  image-path="/assets/images/backgrounds/pano-1.jpg"
  box-content="Text that scrolls past the image."
  above-box-space="50vh"
  below-box-space="50vh"
  box-align="right"
%}{% endraw %}
```

| Parameter | Required | Default | Notes |
|-----------|----------|---------|-------|
| `image-path` | yes | --- | Path to image |
| `height` | no | `40vh` | CSS height of the background section |
| `box-content` | no | --- | Text to scroll past the image; supports Markdown |
| `above-box-space` | no | --- | Space above the text box (e.g. `50vh`) |
| `below-box-space` | no | --- | Space below the text box |
| `box-align` | no | `center` | `left`, `right`, or `center` — horizontal position of text box |

---

## ScrollStory components

The `scrollybox/` directory contains additional includes for building ScrollStory narratives. These are documented in the [ScrollStories](../scrollstories/) section.

All scrollybox includes that display a text box support the `box-align` parameter (`left`, `right`, `center`):

| Include | Purpose |
|---------|---------|
| `scrollybox/bg.html` | Revealed background + optional scrolling text box |
| `scrollybox/bg-sticky.html` | Background stays fixed while text scrolls over it |
| `scrollybox/bg-multi-long.html` | Multiple background sections in sequence |
| `scrollybox/bg-switch.html` | Switch background images as the reader scrolls |
| `scrollybox/auto-scroll.html` | Side-scrolling text panels |
| `maps/story-map.html` | A historic map pinned in place while text scrolls over it |

See the [ScrollStory examples](../scrollstories/) for these components in action.
