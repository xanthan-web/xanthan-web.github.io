---
title: Try a Scrolling Story
layout: default
date: 2026-10-15
summary: Read a passage from Forest, then open its text file and change the words, images, and their arrangement.
---

# Try a Scrolling Story

A change of image can turn a paragraph in a new direction. Read this passage from [Forest]({{ site.baseurl }}/scrollstories/forest/), then open its text file and see how the words and images work together.

{% assign forest = site.pages | where: 'path', 'scrollstories/forest/index.md' | first %}
{% include scrollstory/source-demo.html scenes=forest.demo-scenes heading="A walk through Forest" story-id="forest-walk" %}

The words and photographs come from [Forest]({{ site.baseurl }}/scrollstories/forest/). This excerpt arranges three of its passages over changing images; the full essay explores more ways of giving a reader time to look.

## Make one choice, then read again

Choose **See and edit the text**, then change a heading or replace a paragraph with your own words. Swap the images to see what their order does to the story. Move the text to the other side and consider which part of the photograph it leaves visible. Choose **Return to the story** to read your version.

The same text file can make a story that fills the reader's screen. Copy this passage into a story page, then replace the words and photographs with your own. [Start Your Own Story]({{ site.baseurl }}/docs/scrollstories/start-your-story) walks through making a copy you can keep.

## Read a finished story

- [Where the Name Comes From](https://amaranth.unm.edu/about/name-origins/) connects Amaranth's botanical namesake to the work of a humanities studio, moving between illustrations, historical sources, and photographs.
- [A Cultural History of Arkham Asylum](https://hadas496.github.io/comics-and-Reaganomics-/) brings Batman comics, personal memory, and histories of psychiatry into one visual argument.
- [The Old Spanish Trail]({{ site.baseurl }}/scrollstories/trail/) follows a journey across a historic map, showing how geography can carry part of a story.

When you want to look up a particular setting, the [background switching guide]({{ site.baseurl }}/docs/scrollstories/bg-switch) gives the full reference.
