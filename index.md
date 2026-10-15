---
title: Xanthan — Websites for Digital Humanities
layout: default
date: 2026-01-01
summary: Open, transparent, AI-ready websites for scholars, instructors, and students. Built for public work people can understand, teach, and maintain.
opening:
  title: "What is Xanthan?"
  text: |
    Xanthan is a framework for publishing academic work on the web. Start with a complete design for a portfolio, a collection, or a visual story, then shape it around your research and your readers.

    Your site is a folder of text files and images that you control. GitHub can publish it for free. Editing a page means changing its text, adding images, and choosing how readers encounter them.

    You can edit those files yourself or describe a change to an AI assistant. Xanthan supplies the named pieces; you make the editorial decisions. The examples below show how ordinary writing and a few instructions become a page.
  story-heading: "Reading a campus"
  story-text: "Buildings tell one part of a campus's history. This essay follows the paths, gathering places, and everyday journeys that give those buildings meaning."
  image-path: "/assets/images/site/default.jpg"
  alt-text: "Aerial photograph of campus buildings, roads, and open ground."
  caption: "An aerial view makes the campus's paths and open spaces visible."
  quote-text: "Buildings tell one part of a campus's history."
  note-title: "Reading the photograph"
  note-text: "An aerial photograph shows routes and buildings, but leaves out the voices of people who used them. Read the view alongside oral histories and other accounts."
  section-heading: "Paths and gathering places"
  section-text: "Tracing the paths between buildings brings everyday journeys into view. The spaces between landmarks become part of the story."
reasons:
  - title: "You own your content"
    text: "Your site is text files in a repository you control. Move it to any host, take it between institutions, keep it after the grant ends. Hosting on GitHub Pages is free---no ads, no subscription, no terms-of-service surprises."
  - title: "Built to last"
    text: "HTML, CSS, and Markdown have worked for decades and will keep working. There's no database to secure, no software to update, no security patches to apply. What you build today will still run in 2050 without maintenance."
  - title: "You learn by working"
    text: "Start with plain-language prompts and Markdown, then pick up HTML, CSS, and Git as you go. These aren't \"website skills\"---they're foundational to digitally-engaged humanities work, and you learn them by building something real."
  - title: "Built for collaboration"
    text: "Your site is a folder of plain documents, not text sealed inside a system you can't open. A colleague can fix a typo, a student can add an essay, and you can hand the whole thing to whoever comes next---without everyone arriving with the same technical confidence."
---

{% include layout/editorial-demo.html
  heading=page.opening.title
  intro=page.opening.text
  story-heading=page.opening.story-heading
  story-text=page.opening.story-text
  image-path=page.opening.image-path
  alt-text=page.opening.alt-text
  caption=page.opening.caption
  quote-text=page.opening.quote-text
  note-title=page.opening.note-title
  note-text=page.opening.note-text
  section-heading=page.opening.section-heading
  section-text=page.opening.section-text
  primary-url="/docs/getting-started/templates"
  secondary-url="/docs/getting-started/gallery"
%}

{% include layout/section.html style="alt" %}

{% assign featured_sites = site.data.gallery | where: "featured", true %}
{% include nav/gallery-grid.html
  items=featured_sites
  heading="What Can You Build?"
  intro="Course archives, oral history collections, digital exhibits, scrolling narratives, mapped directories, annual reports---every one of these is a real Xanthan site, and every one of them is plain text underneath."
  variant="uniform"
  class="gallery-grid--wide"
  min-width="190px"
  gap="var(--spacing-md)"
  show-summary=true
%}

{% include layout/section-end.html %}

{% include layout/section.html style="alt" %}

## Why Xanthan?
Digital humanities work should be as open in its process as in its product. Xanthan is built on a simple conviction: scholars shouldn't have to rent their web presence from proprietary platforms, and they shouldn't need a computer science degree to publish online.

{% include layout/feature-grid.html features=page.reasons %}

{: .link-callout}
[See more in our FAQs →](faqs#why-not-use-a-commercial-platform){: .btn-secondary}

{% include layout/section-end.html %}


{% include images/jumbotron.html
  image-path="/assets/images/site/scaffolding-hand.png"
  fade-start="50%"
  fade-end="100%"
  text-shadow=false
  bg-color="var(--bg-section-alt-flat)"
  text="

## Built for AI collaboration
AI is more useful when you can direct the work and understand what changed. Xanthan gives you and your assistant a shared vocabulary: a figure with its caption, a pull quote, a gallery. Each is a named piece with a defined job and documented options.

> Put the photograph beside the opening paragraph, keep its caption, and leave the rest of the page as it is.

The assistant can translate that request into a focused change to the relevant component. The same names and documentation let you follow the work, learn the vocabulary, and make the next edit yourself.

You remain the editor: judging the result, asking for revisions, and deciding what serves your argument. The framework supplies the structure; the vision is yours.

[See our AI guide →](docs/using-ai/){: .btn-secondary}
"
%}

## Who is Xanthan for?

**Scholars seeking public engagement.** Move your work beyond paywalls and PDFs. Build research portfolios, multimedia essays, and interactive arguments that reach broader audiences---on a site you control, not a platform that controls you.

**Instructors teaching digital literacy.** Turn class projects into real public scholarship. Students build collectively around shared themes---local history archives, community documentation, thematic collections---learning web fundamentals while creating work that outlasts the semester.

**Students building professional presence.** Create a portfolio that showcases your research, teaching, and digital skills. Own your academic identity rather than scattering it across platforms.

{% include layout/section.html style="warm" %}

## Yes, it's like the gum!

Xanthan gum is a polysaccharide used as a binder and emulsifier---it transforms disparate ingredients into something cohesive and stable. This platform does the same: it binds simple, durable web technologies into a framework for digital scholarship. Text, media, code, and argument become a coherent whole with a long shelf life.

Good infrastructure, like good binding agents, should be reliable, unobtrusive, and built to last. [Read more about our philosophy](about).

{% include layout/section-end.html %}

## Easier done than said.

This is one of those things that takes longer to describe than to do. The guides run long because every step is written out---you shouldn't have to work anything out on your own, or guess what a page means by "commit."

The doing is short. Make a site from one of the starting points, change a line of text, watch it go live. Ten minutes of that will teach you more about how this works than any paragraph here can.

{: style="text-align: right;"}
[Choose a Starter Site →](docs/getting-started/templates){: .btn-primary}
