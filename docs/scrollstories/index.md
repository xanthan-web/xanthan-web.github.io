---
title: Visual Storytelling with ScrollStories
layout: default
date: 2026-10-14
summary: Give images, maps, and words room to make an argument together, in a story whose materials you can keep and reshape.
---

# Visual Storytelling with ScrollStories

{: .lede}
A photograph can establish a place before you write a word. A map can make the distance in a journey palpable. Two images can reveal a change that paragraphs struggle to describe. A ScrollStory gives those materials room to do intellectual work together, unfolding as the reader moves down the page.

You decide what stays in view, what changes, and when the reader encounters the next piece of evidence. Scrolling becomes part of the telling.
{% assign forest = site.pages | where: 'path', 'scrollstories/forest/index.md' | first %}
{% assign forest_opening = forest.demo-scenes | slice: 0, 1 %}
{% include scrollstory/sequence.html
  scenes=forest_opening
  heading="Let the words move"
  intro="Keep a photograph in view while a passage crosses it. The words travel from the bottom of the screen to the top; only then does the photograph move away."
  id="forest-scroll"
  show-source=true
%}

{% assign forest_changes = forest.demo-scenes | slice: 1, 2 %}
{% include scrollstory/sequence.html
  scenes=forest_changes
  heading="Change the view"
  intro="A change of photograph can mark a change in the argument. Here the frame holds still, and the second view fades in when the first text box reaches the top."
  id="forest-fade"
  transition="fade"
  show-source=true
%}

{% include maps/story-map.html
  map-id="trail-intro"
  heading="Follow a journey"
  intro="A map can carry the reader from one place to the next while the words explain the journey. This example borrows the map and two stops from the Old Spanish Trail essay."
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

The words, images, and places are named in a text file. Open **See the text** under an example to inspect it. Read the full [Forest]({{ site.baseurl }}/scrollstories/forest/) and [Trail]({{ site.baseurl }}/scrollstories/trail/) essays, or [try changing a passage]({{ site.baseurl }}/docs/scrollstories/try-a-story) and borrow the arrangement for your own work.

---

## Let the reader linger

The form works for a close reading of a painting, a walk through an archive, a field report, an oral history, or an argument about a changing landscape. Text, images, maps, audio, and video can share a continuous narrative. In Xanthan, that narrative is a page in your own website.

Think of the screen as a place to arrange evidence. Hold a photograph beside several paragraphs so readers can look back at the detail you are discussing. Change from an old view to a new one at the moment your argument turns. Follow a route across a historic map while the text explains what made each crossing possible.

These choices shape attention. An image held in place gives the reader time to inspect it. A change of scale can connect one object to a landscape. A quiet passage of prose lets a complicated visual moment settle.

Start with the relationship between your materials. What should the reader see while reading this sentence? What becomes clearer when these two images appear in sequence? The answer gives a visual effect a purpose.

A ScrollStory can also stay simple: generous images, careful typography, captions, and footnotes. You choose the rhythm that suits the argument.

---

## Keep the work in your hands

If you know Esri's ArcGIS StoryMaps, the reading experience will feel familiar. ArcGIS StoryMaps provides a visual builder within the ArcGIS platform. Its [account types determine which features are available](https://doc.esri.com/en/arcgis-storymaps/latest/reference/licensing.html): free public accounts have limits, including on custom themes and embedded web content.

Xanthan gives you the visual storytelling form through an open-source framework. Your writing lives in readable text files alongside your images, page settings, and design. You can download the whole project, keep a copy, revise it, and publish the site on GitHub Pages, a university server, or another web host. Using the framework requires no Xanthan subscription.

That matters for work that outlives a course, a grant, or an institutional account. A future collaborator can open the materials and understand how the story was assembled. You can reuse a section in another project, change the site's design, or move the site to another host. Maps and media you embed from outside services still depend on those services; keeping copies of your own materials makes the project easier to preserve.

Working with files takes some getting used to. Xanthan makes that work legible: named settings, reusable pieces, and examples you can copy. An AI assistant can read the same materials and help arrange them. You can ask it to hold an image beside a passage, give a section more breathing room, or explain a change before you accept it. You remain the author and editor; the framework and the assistant help with the typesetting.

---

## Explore three examples

For a short story beside its editable text file, [try a scrolling story]({{ site.baseurl }}/docs/scrollstories/try-a-story). Change the words, swap the images, and see how the arrangement changes the reading.

Read these first as a visitor. Notice where you pause, what stays visible, and how the movement changes your understanding. Then choose something worth borrowing.

### [Where the Name Comes From: Amaranth](https://amaranth.unm.edu/about/name-origins/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-amaranth.jpg"
  image-width="100%"
  alt-text="Amaranth's naming story opens with a large red title over a botanical illustration."
%}

Amaranth's naming story moves between botanical illustrations, literary history, food, and agriculture. Changing images connect the meanings people give a plant to the work of a digital humanities studio. Read it as a finished essay, and notice how the visual materials help carry the argument.

### [Forest: explore the possibilities]({{ site.baseurl }}/scrollstories/forest/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-forest.jpg"
  image-width="100%"
  alt-text="Forest's opening, with a large title and subtitle over a photograph of misty woodland."
%}

Background images hold still, change, and give way to other views. Text moves beside images, and a comparison slider lets the reader inspect differences. Forest brings the toolkit together in one essay. Borrow a moment that suits your story; there is no obligation to use the whole forest.

### [Trail: a story map]({{ site.baseurl }}/scrollstories/trail/)

{% include images/figure.html
  image-path="/assets/images/site/scrollstory-trail.jpg"
  image-width="100%"
  alt-text="Trail's historic map with a highlighted route beside the passage Armijo’s crossing, 1829."
%}

The Old Spanish Trail moves across an 1854 survey map as the essay follows a mule route from Santa Fe to Los Angeles. The route and the map tell different stories about the same country. Trail shows how a map can become part of an interpretation, with places and paths coming into focus as the argument develops.

---

## Follow an argument

The most useful possibilities emerge from a subject worth looking at closely. This finished story offers another way to use images as evidence, giving readers time to compare, notice, and return to the argument.

### [A Cultural History of Arkham Asylum](https://hadas496.github.io/comics-and-Reaganomics-/)

Hadas Segal puts Batman comics, personal memory, and the history of psychiatric institutions into conversation. Image comparisons and close readings make the visual sources part of the interpretation.

---

## One story within a larger site

Every Xanthan starter site can publish ScrollStories. A **Portfolio** can put a visual essay beside your research and teaching. An **Essay Collection** can gather stories by a class or project team. An **Object Collection** can connect individual objects through a larger narrative. **Single Story** puts one continuous narrative at the center of the site.

The story shares your site's navigation and design. You can connect it to sources, related essays, a collection, or an account of how the research was done. The reader can follow the argument and then explore the work around it.

[Start your own story]({{ site.baseurl }}/docs/scrollstories/start-your-story) with a few images and one passage of writing. You can build the rest from there.
