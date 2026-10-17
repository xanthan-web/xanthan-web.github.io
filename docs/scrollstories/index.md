---
title: Visual Storytelling with ScrollStories
layout: default
date: 2026-10-14
summary: Give images, maps, and words room to make an argument together, in a story whose materials you can keep and reshape.
examples:
  - title: "Where the Name Comes From: Amaranth"
    thumbnail: "/assets/images/site/scrollstory-amaranth.jpg"
    alt-text: "Amaranth's naming story opens with a large red title over a botanical illustration."
    link: "https://amaranth.unm.edu/about/name-origins/"
    position: 1
  - title: "Forest: explore the possibilities"
    thumbnail: "/assets/images/site/scrollstory-forest.jpg"
    alt-text: "Forest's opening, with a large title and subtitle over a photograph of misty woodland."
    link: "/scrollstories/forest/"
    position: 2
  - title: "Trail: a story map"
    thumbnail: "/assets/images/site/scrollstory-trail.jpg"
    alt-text: "Trail's historic map with a highlighted route beside the passage Armijo’s crossing, 1829."
    link: "/scrollstories/trail/"
    position: 3
  - title: "A Cultural History of Arkham Asylum, by Hadas Segal"
    thumbnail: "/assets/images/gallery/asylum.png"
    alt-text: "A passage on superhero comics set between 1940s covers of Superman and Batman."
    link: "https://hadas496.github.io/comics-and-Reaganomics-/"
    position: 4
---

# Visual Storytelling with ScrollStories

{: .lede}
Scrollstories are built into all Xanthan starter sites, and are our open-source version of StoryMaps. A ScrollStory lets words, images, and maps unfold together as the reader moves down the page. You decide what stays in view, what changes, and when as the reader scrolls.

{% assign forest = site.pages | where: 'path', 'scrollstories/forest/index.md' | first %}
{% assign forest_opening = forest.demo-scenes | slice: 0, 1 %}
{% include scrollstory/sequence.html
  scenes=forest_opening
  heading="Let the words move"
  intro="Hold a photograph while its passage crosses the screen. Once the words clear the top, the image moves away."
  id="forest-scroll"
  show-source=true
%}

{% assign forest_changes = forest.demo-scenes | slice: 1, 2 %}
{% include scrollstory/sequence.html
  scenes=forest_changes
  heading="Change the view"
  intro="Hold the frame while the view changes. The second photograph fades in as the first text box reaches the top."
  id="forest-fade"
  transition="fade"
  show-source=true
%}

{% include maps/story-map.html
  map-id="trail-intro"
  heading="Follow a journey"
  intro="Let the map follow the narrative. These two stops use the map from the Old Spanish Trail essay."
  overlay-image="/assets/images/maps/whipple-1854.webp"
  overlay-bounds="32.45416, -119.73999, 37.10777, -106.34216"
  overlay-alt="Whipple's 1854 survey map, with the routes of the Old Spanish Trail drawn across it"
  overlay-opacity="0.92"
  geojson="/assets/data/old-spanish-trail.geojson"
  basemap="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  basemap-attribution="&copy; OpenStreetMap contributors"
  attribution="Trail data: National Park Service. Historic map: Whipple survey, 1854."
  center="35.9, -111.5"
  zoom=7
  interactive=false
%}

{% include maps/story-map-panel.html map-id="trail-intro" center="35.9, -111.5" zoom=7 highlight="Armijo Route" panel-align="left" %}
### Let the map carry the journey

A journey has distance as well as events. As you scroll, the map moves from one stretch of the trail to another, keeping the words near the place they describe. The route gives the narrative a shape a paragraph alone cannot show.
{% include maps/story-map-panel-end.html %}

{% capture mojave_passage %}
### Bring the next place into view

The view shifts across the Mojave while the passage continues. A change of scale lets you move from the whole journey to one crossing or settlement. Choose the view that makes your point clearer, and give your reader time to look before moving on.
{% endcapture %}
{% include maps/story-map-panel.html map-id="trail-intro" center="35.3, -116.0" zoom=8 highlight="Mojave Road" panel-align="left" %}
{{ mojave_passage }}
{% include maps/story-map-panel-end.html %}
{% include maps/story-map-end.html %}

{% capture map_passage_source %}{% raw %}{% include maps/story-map-panel.html
  map-id="trail-intro"
  center="35.3, -116.0"
  zoom=8
  highlight="Mojave Road"
  panel-align="left"
%}{% endraw %}
{{ mojave_passage }}
{% raw %}{% include maps/story-map-panel-end.html %}{% endraw %}{% endcapture %}
{% include layout/source-example.html
  source=map_passage_source
  intro="This is one passage from the map above. Its place and scale tell the map where to move. The map image and route are set once, before the passages."
%}

Open **See the text** beneath an example to inspect the words and instructions behind it. Borrow an arrangement, then replace its images and passages with your own.

---

## Keep the work in your hands

If you know Esri's ArcGIS StoryMaps, the reading experience will feel familiar. But there's one key difference. 

In StoryMaps, everything you do is through their interface and stored in their proprietary platform. Stories are not portable and are tied to a particular account.

In Xanthan, the story is driven by simple text files that you control. You keep your writing, images, and other files together. You can always use a different host to share your story. It's a little more DIY, but there's no coding, and after a few hours, you'll be glad for the flexibility and freedom.

Because Xanthan is built for GitHub Pages, collaboration is already baked in. A future collaborator can open the same files, understand how the story was assembled, and add to it.

That independence truly matters after a course, grant, or institutional account ends, or for ongoing projects where contributors come and go.


---

## Explore examples

Read these first as a visitor, then borrow an arrangement that serves your story.

{% include nav/gallery-grid.html
  items=page.examples
  variant="uniform"
  aspect-ratio="16 / 9"
  min-width="300px"
  gap="var(--spacing-sm)"
%}

---

## One story within a larger site

A visual essay can sit beside research and teaching in a **Portfolio**, join a class **Essay Collection**, or connect objects in an **Object Collection**. **Single Story** puts one narrative at the site's center. Every starter supports the same storytelling tools.

The story shares your site's navigation and design. Connect it to sources, related essays, a collection, or an account of how the research was done. Readers can follow the argument and then explore the work around it.

[Start your own story]({{ site.baseurl }}/docs/scrollstories/start-your-story) with a few images and one passage of writing. You can build the rest from there.
