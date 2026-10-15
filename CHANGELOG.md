# Changelog

All notable changes to Xanthan will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Screenshots illustrate Amaranth's naming story and the Forest and Trail examples on the
  ScrollStories introduction, using the existing figure component.
- Three short reading patterns on the ScrollStories introduction: a photograph
  that leaves after its text, a shared frame that fades as its first passage reaches the top,
  and two stops on the Old Spanish Trail map. Each has a “See the text” reveal.
- `layout/source-example.html`, a keyboard-operable disclosure for escaped,
  copyable source that wraps and grows with the page.
- Story maps accept an optional heading and introduction. `interactive=false`
  also disables route tooltips and marker interactions for passive reading.
- `scrollstory/sequence.html` presents photographs and text as part of ordinary
  page scrolling. Images stay in view for their passages; reduced-motion and
  print views show each photograph above its text.
- A live ScrollStory source example at `docs/scrollstories/try-a-story`, with
  editable prose, image order, and text position. The reusable
  `scrollstory/source-demo.html` opens with a large reading view and reveals
  copyable background-switching includes when readers choose to edit. Returning
  to the wide story preserves their edits. A static version works without JavaScript.
- Callout type and heading-level selectors in the homepage editor, synchronized
  with its text file. All six heading levels now have visibly different sizes.
- `layout/profile-intro.html`, a photograph beside a name, a bio, and a row of
  links, as the opening block of a personal homepage. It is the successor to
  the profile sidebar and reads the same `_data/nav-profile.yml`, so a site can
  switch without moving any content. Takes an optional `role:` line, a `circle`
  shape for anyone who wants the sidebar's crop, and `level=2` for a page that
  already has an `h1`. Styles live with the other landing bands in `home.css`.
- `nav/gallery-grid.html` takes `variant="masonry"`, which lays tiles out in
  columns and lets each image keep its own proportions instead of cropping
  everything to a square — the difference between a wall of screenshots and a
  wall of photographs of things. A `gallery-grid--bleed` class runs the wall
  the full width of the page, for a page that is the gallery rather than a page
  with one on it.
- **Landing page sections**: five components for a homepage that introduces a
  whole project rather than opening a single argument — `layout/home-hero.html`,
  `layout/split-intro.html`, `layout/feature-block.html`, `layout/picks.html`,
  and `layout/link-index.html`, with styles in the new `assets/css/home.css`.
  Each is a full-width band that takes its content from front matter. Documented
  under Landing Page Sections in the component library.
- `layout/picks.html` selects named items from a collection by slug, in the
  order given, in three variants (`strip`, `tiles`, `feature`). Items resolve
  against a declared Jekyll collection, a folder page, or a flat file, so it
  works whatever shape a site's content already has.
- `helpers/find-item.html`, an internal helper for resolving a collection name
  and slug to a page.
- Homepage prompts in the AI documentation, covering both the composed
  magazine-style front page and the plainer header-image-and-grids kind.
- `nav/map.html` takes `folder`, to map one part of a site rather than every
  page that has coordinates, and `fields`, which prints named front matter
  fields in each popup — so a collection's catalogue facts reach the map
  without being retyped. It also takes `image-field`, and a `map-wrap--wide`
  class that breaks the map out of the text column.

### Changed
- ScrollStory sequence cards travel from below the screen all the way past the
  top before a scrolling photograph moves away. Optional fade mode changes
  to the following image when the current card reaches the top of the reading area; reduced
  motion keeps an ordinary stacked layout.
- The homepage opens with "Academic websites, shaped by you," a serif headline,
  a distinct lead paragraph, and shorter supporting text. A CC0 photograph of
  xanthan gum sits alongside it, using the existing figure component.
- The ScrollStories overview puts a short Forest sequence in the page's own
  flow, so readers can scroll directly through the story into the rest of the
  introduction, without a contents sidebar. The separate editing exercise uses
  the same passages and photographs, kept together in Forest's front matter. Both pages
  link to Amaranth's naming story and Hadas Segal's Arkham Asylum essay.
- The homepage example band uses the same green as the later warm section.
- Callouts have explicit type labels, stronger tints, and distinct blue, amber,
  red, and green accents. Their heading-level parameter supports levels 1–6.
  Shared scrolling text panels use the theme's readable card surface.
- Both visual source editors share a restricted source reader; visitor Liquid
  and HTML are never executed.

- The Portfolio screenshot on the starter chooser is a fresh capture of the
  live example, which now opens with the profile block rather than the
  sidebar. Its alt text describes the live site rather than calling it the
  starter site, which it never was. Resized to the 1600px the project's own
  `optimize-images.sh` uses, taking it from 2.1MB to 237KB — a saving every
  template inherits, since the sync copies the gallery images the docs name.
- The homepage connects its named, documented parts to AI collaboration in
  one band. A plain-language request shows how those parts support focused
  changes that the author can inspect and revise.
- "Others can build on it" is now "Built for collaboration", and makes the
  argument through plain documents rather than through a platform. Naming
  GitHub there explained collaboration as a mechanism the reader has no model
  for; the tile now says what changes for the people involved.
- "Who is Xanthan for?" moves below the AI section, which is where the new
  band needed to sit. It still lands before the closing pair, so the gum
  section and the call to action stay together.
- The Portfolio starter site opens with `layout/profile-intro.html` rather than
  the `nav-profile` sidebar. The sidebar's only page was the homepage, so it
  was paying for a permanent column it never used, and on a phone it stacked
  above the content and pushed the homepage text below the fold. The sidebar,
  its layout, and its demo page all remain for sites that want them.
- The Object Collection starter site is selectable on both chooser pages. It
  was listed but disabled while its repository was empty; the repository is
  filled, published, and syncing, so the "coming soon" label, the disabled
  button, and the `comingSoon` flag are gone. Its description now names the
  gallery and the essays folder alongside the grid and the map.
- The collection map opens on the view that fits its markers unless
  `start-coords` says otherwise, rather than defaulting to a point in South
  Dakota. `start-coords` replaces `start_coords`, which is still read.
- Popups are built from `thumbnail` before `header-image`, and their text is
  escaped rather than written into markup as-is.
- `map.css` is linked from `html/html-head.html` with every other component
  stylesheet, and holds the popup styles that `nav/map.html` had been
  duplicating in an inline `<style>` block. The map layout no longer links it,
  and a map now looks the same on any layout.

### Removed
- The **Sapling** sample ScrollStory. The examples now come in two tiers —
  Seedling for a plain typographic essay, Forest for the whole scrollybox
  toolkit — with the story map (Trail) alongside them rather than as a step in
  a sequence. A middle rung asked readers to place themselves on a ladder
  before they knew what the rungs did, and demonstrated nothing the other two
  did not. Seedling's closing links now point at Forest.

### Fixed
- Story maps follow the last passage reached during fast scrolling and page
  jumps. Going back restores earlier overlay images and opacity as well as
  the map's position and scale.
- Background image changes follow the last marker passed, including during
  fast scrolling, keyboard navigation, and jumps to an anchor. A one-pixel
  marker could previously skip the observer's narrow trigger band.
- A doubled phrase in the homepage's AI section ("That's impressive, but
  impressive but opaque").
- The `nav-profile` layout no longer reserves a column for a sidebar that is
  not there. It rendered `.left-bar` unconditionally while the include inside
  it checked for data, so a site with an empty `_data/nav-profile.yml` got a
  fixed, bordered 25vw column with nothing in it — and `.main-content` still
  pushed the page clear of it. Both are now gated on the profile existing.
- Site search works in the starter templates. `assets/search-index.json` sits
  outside the `assets/css/` and `assets/js/` directories the sync copies, so no
  template had ever received it and `search.js` was fetching a 404 on every one
  of them that had search switched on. `scripts/sync-core-files.sh` now copies
  it by name.
- Leaflet loads once per page rather than once per map. `nav/map.html` and the
  `maps/` components now share one guard, so a page carrying both kinds of map
  no longer runs the library twice.
- A collection map with nothing to draw says so on the page instead of
  rendering an empty grey box, and a page whose `geo` is not a usable
  coordinate pair is named in the console rather than silently dropped.
- A `baseurl` written with a trailing slash (`/my-site/`) no longer produces
  doubled separators in every path resolved through `helpers/image-path.html`
  and `helpers/link-path.html`. Both forms are natural to write in `_config.yml`
  and both now work.
- `helpers/image-path.html` no longer treats an internal path as an external URL
  just because the filename contains the letters `http`.

## [1.2.0] - 2026-03-04

### Added
- New gallery component and docs updates to support richer visual examples
- Expanded AI-focused documentation and onboarding guidance
- Optional Google Analytics support with safer config patterns for local/private setup
- New docs styling support and layout refinements for `/docs/` pages

### Changed
- Migrated core layout patterns away from Bootstrap toward CSS Grid-based structure
- Renamed `header-image` usage to `page-header` in layout styling patterns
- Improved getting-started workflow, docs index readability, and navigation organization
- Updated template sync/workflow behavior and supporting automation metadata

### Fixed
- Improved link handling with better `baseurl` behavior
- Multiple navigation and docs-link consistency fixes
- Additional styling/spacing cleanup across typography and page sections

## [1.1.0] - 2026-01-04

### Added
- **Documentation auto-sync to templates**: All Xanthan documentation now automatically syncs to template repositories, ensuring docs always match code version
- **Centralized `/docs/` folder**: All documentation organized in clean `/docs/` structure (getting-started, content-design, navigation, scrollstories)
- **Documentation landing page**: New `/docs/index.md` provides organized access to all documentation sections
- **Template sync workflow**: Automated GitHub Actions workflow syncs code, docs, and examples from main Xanthan repo to all template repositories
- **Profile sidebar CSS**: New `sidebar.css` for portfolio-template with proper image sizing and responsive design

### Changed
- **ScrollStory examples location**: Moved from `/scrollstories/examples/` to `/scrollstories/` for cleaner structure
- **Documentation paths**: All internal links updated to use `/docs/` prefix for consistency
- **About and FAQs location**: Kept at root level (not synced to templates) as they're specific to main Xanthan site
- **Navigation structure**: Updated `top-nav.yml` to reflect new `/docs/` paths

### Fixed
- Profile sidebar image sizing issue in portfolio-template
- All internal documentation links updated to new structure

## [1.0.0] - 2026-01-01

- **Added**: First major release of Xanthan! Beginner-friendly web templates and extensive documentation for academics, educators, and students to build professional websites and collaborative projects with GitHub Pages.

- Start here: https://xanthan-web.github.io/


## Future Releases

Starting with 1.1.0, this changelog will document:
- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** for vulnerability patches

[1.2.0]: https://github.com/xanthan-web/xanthan-web.github.io/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/xanthan-web/xanthan-web.github.io/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/xanthan-web/xanthan-web.github.io/releases/tag/v1.0.0
