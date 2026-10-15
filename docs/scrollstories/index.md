---
title: Visual Storytelling with ScrollStories
layout: default
date: 2026-10-14
summary: Give images, maps, and words room to make an argument together, in a story whose materials you can keep and reshape.
---

# Visual Storytelling with ScrollStories

{: .lede}
A photograph establishes a place. A change of view can turn an argument. A ScrollStory lets words, images, and maps unfold together as the reader moves down the page.

You decide what stays in view, what changes, and when. The reader sets the pace.
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

## Let the reader linger

Use the form where looking closely matters: a painting, an archive, a field report, or a changing landscape. Ask what the reader should see while reading each passage. Keep movement that helps the argument, and let a still image linger when it needs time.

A ScrollStory can also stay simple, with generous images, captions, and footnotes. You choose the rhythm.

---

## Keep the work in your hands

If you know Esri's ArcGIS StoryMaps, the reading experience will feel familiar. In Xanthan, the story is part of a website whose files you control. Keep your writing, images, and design together; download the project, revise it, or move it to another host. Using the framework requires no Xanthan subscription.

You can publish on GitHub Pages, a university server, or another host. A future collaborator can open the same materials, understand how the story was assembled, and reuse a section in another project.

That independence matters after a course, grant, or institutional account ends. An AI assistant can help arrange the materials; you remain the author and editor. Embedded maps and media still depend on their outside services.

The file names and reusable pieces give you and an assistant a shared vocabulary. Ask it to hold a photograph beside a passage or give a section more breathing room, then judge the result as an editor.

---

## Explore three examples

Read these first as a visitor, then borrow an arrangement that serves your story.

### [Where the Name Comes From: Amaranth](https://amaranth.unm.edu/about/name-origins/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-amaranth.jpg"
  image-width="100%"
  alt-text="Amaranth's naming story opens with a large red title over a botanical illustration."
%}

Botanical illustrations, literary history, and food connect a plant's changing meanings to the work of a humanities studio. Notice how the images help carry the argument.

Read it as a finished essay, noticing where the changing view invites you to pause or connects one source to another.

### [Forest: explore the possibilities]({{ site.baseurl }}/scrollstories/forest/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-forest.jpg"
  image-width="100%"
  alt-text="Forest's opening, with a large title and subtitle over a photograph of misty woodland."
%}

Images hold still, change, and give way to other views. Forest brings the toolkit together in one essay; borrow a moment that suits your argument.

Text moves beside images, and a comparison slider lets the reader inspect differences. There is no obligation to use the whole forest.

### [Trail: a story map]({{ site.baseurl }}/scrollstories/trail/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-trail.jpg"
  image-width="100%"
  alt-text="Trail's historic map with a highlighted route beside the passage Armijo’s crossing, 1829."
%}

Follow a mule route from Santa Fe to Los Angeles across an 1854 survey map. Places and paths come into focus as the argument develops.

The route and the historic map tell different stories about the same country; their relationship becomes part of the interpretation.

---

## Follow an argument

### [A Cultural History of Arkham Asylum](https://hadas496.github.io/comics-and-Reaganomics-/)

Hadas Segal puts Batman comics, personal memory, and the history of psychiatric institutions into conversation. Image comparisons and close readings make the visual sources part of the interpretation.

---

## One story within a larger site

A visual essay can sit beside research and teaching in a **Portfolio**, join a class **Essay Collection**, or connect objects in an **Object Collection**. **Single Story** puts one narrative at the site's center. Every starter supports the same storytelling tools.

The story shares your site's navigation and design. Connect it to sources, related essays, a collection, or an account of how the research was done. Readers can follow the argument and then explore the work around it.

[Start your own story]({{ site.baseurl }}/docs/scrollstories/start-your-story) with a few images and one passage of writing. You can build the rest from there.
