---
title: Documentation
layout: default
date: 2026-01-01
summary: Documentation for your Xanthan site, matched to the code in this repository.
---

{::nomarkdown}<div class="docs-index">{:/nomarkdown}

# Documentation

This documentation is bundled with your site and matches the version of Xanthan code you're running. For the latest updates, visit [xanthan-web.github.io/xanthan](https://xanthan-web.github.io/xanthan/).

---

## Getting Started

From zero to a live site in 15 minutes. Choose a template, create your repository, make your first edit.

{% assign gs = site.pages | where_exp: "pg", "pg.path contains 'docs/getting-started/'" | sort: "title" %}
{% for pg in gs %}{% unless pg.path contains 'index' %}
- [{{ pg.title }}]({{ pg.url | prepend: site.baseurl }})
{% endunless %}{% endfor %}

---

## ScrollStories

Give images, maps, and words room to make an argument together. Explore the form, then try a passage of your own.

- [What ScrollStories Are]({{ site.baseurl }}/docs/scrollstories/)
- [Try a Scrolling Story]({{ site.baseurl }}/docs/scrollstories/try-a-story)
- [Start Your Own Story]({{ site.baseurl }}/docs/scrollstories/start-your-story)
- [Seedling: A Simple Essay]({{ site.baseurl }}/scrollstories/seedling/)
- [Forest: Explore the Possibilities]({{ site.baseurl }}/scrollstories/forest/)
- [Trail: A Story Map]({{ site.baseurl }}/scrollstories/trail/)

---

## Reference

Look things up when you need them. Typography, images, colors, navigation, front matter, components, and troubleshooting.

{% assign ref = site.pages | where_exp: "pg", "pg.path contains 'docs/reference/'" | sort: "title" %}
{% for pg in ref %}{% unless pg.path contains 'index' %}
- [{{ pg.title }}]({{ pg.url | prepend: site.baseurl }})
{% endunless %}{% endfor %}

### ScrollStory technique guides

Examples, code, and settings for particular effects. The [Component Library]({{ site.baseurl }}/docs/reference/component-library#scrollstory-components) connects these guides to the reusable pieces.

- [Background Scroll Boxes]({{ site.baseurl }}/docs/scrollstories/bg-scrollbox)
- [Background Switching]({{ site.baseurl }}/docs/scrollstories/bg-switch)
- [Side-Scrolling Text]({{ site.baseurl }}/docs/scrollstories/side-scroll)
- [Peekaboo Images]({{ site.baseurl }}/docs/scrollstories/peekaboo)

---

## Using AI

Use AI inside a structure that keeps your site understandable, editable, and teachable.

{% assign ai = site.pages | where_exp: "pg", "pg.path contains 'docs/using-ai/'" | sort: "title" %}
{% for pg in ai %}{% unless pg.path contains 'index' %}
- [{{ pg.title }}]({{ pg.url | prepend: site.baseurl }})
{% endunless %}{% endfor %}

---

{::nomarkdown}</div>{:/nomarkdown}

{: .text-muted}
You can remove the `/docs` link from your navigation whenever you like---the documentation will still be there if you need it.
