---
layout: default
title: Add an Image
date: 2026-02-14
summary: "Upload an image and put it on a page, using the one Xanthan workflow you will reuse everywhere: find something that works, copy it, adapt it."
---

{% include nav/scrollspy-toc.html %}

# Add an Image

{: .lede}
You've edited text. Now let's add an image to your site---the full process from uploading the file to seeing it on a page.

Before we start, keep in mind that we're really just doing one core Xanthan workflow: **find something that already works, copy it, then adapt it**.

---

## Start with a working example

Find a `figure.html` example in the guide, copy it, and paste it into your page. Then edit just these values:

- `image-path="/assets/images/..."`
- `caption="..."`
- `alt-text="..."`
- optional `image-width="..."`

This copy/adapt pattern is how most Xanthan edits should work, especially when you're new.

---

## Upload the image

1. Go to your repository on GitHub
2. Navigate to the **`assets/images/`** folder
3. Click **"Add file"** then **"Upload files"**
4. Drag and drop an image from your computer (JPG or PNG work well)
5. Click **"Commit changes"**

Your image is now in your repository at `assets/images/your-image.jpg`.

---

## Add it to a page

1. Press **`.`** on your repository page (or change `github.com` to `github.dev` in the address bar) to open the code editor
2. Open the page where you want the image (e.g., `index.md`)
3. Paste this code where you want the image to appear:

```
{%raw%}{% include images/figure.html
  image-path="/assets/images/your-image.jpg"
  image-width="60%"
  caption="A brief description of what's shown."
  alt-text="Describe the image for screen readers"
%}{%endraw%}
```

4. Replace `your-image.jpg` with your actual filename (capitalization matters)
5. Update caption/alt text so they describe your image
6. Commit and sync your changes

---

## See it live

Wait 1--2 minutes for GitHub Pages to rebuild, then refresh your site. Your image should appear centered at 60% width with a caption below it.

---

## Quick reference

The `figure.html` include has a few options you can adjust:

- **`image-width`** --- any percentage like `40%`, `80%`, `100%`
- **`caption`** --- text that appears below the image
- **`alt-text`** --- description for accessibility (always include this)

`figure.html` always centers the image. To place an image *beside* text instead, use `figure-wrap.html`. For the full range of image options---side-by-side layouts, carousels, full-width jumbotrons, and more---see the [Images guide](../reference/images).

---

## Next step

**[Customizing Your Site](customizing)** --- your site still looks like the starter. Here is how to make it yours.
