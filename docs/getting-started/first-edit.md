---
layout: default
title: Make Your First Edit
date: 2026-02-14
summary: Edit a file, save it, and watch the change appear on your live site — the full cycle, once, so you can see how it works.
---

{% include nav/scrollspy-toc.html %}

# Make Your First Edit

{: .lede}
Your site is live. Now let's change something so you can see the full cycle: edit a file, save it, and watch the change appear on your live site.

---

## Open the code editor

GitHub has a built-in code editor--right in your browser, so you can do all the editing your need to do without other software.

1. Go to your repository on GitHub (e.g., `github.com/YOUR-USERNAME/YOUR-REPO`)
2. Press the **`.`** key on your keyboard

That's it. GitHub opens a code editor in your browser, with your file tree on the left and an editor on the right. Easy to see your files and make quick changes!

If the key does nothing (it depends on your browser and keyboard layout), change `github.com` to `github.dev` in the address bar, so `github.com/YOUR-USERNAME/YOUR-REPO` becomes `github.dev/YOUR-USERNAME/YOUR-REPO`, and press Enter. It opens the same editor.

---

## Make a change

1. In the file tree on the left, click **`index.md`** to open your homepage
2. Find the `title:` line in the front matter (the section between the `---` markers at the top)
3. Change the title to something of your own---your name, your project name, whatever fits
4. Below the front matter, add a sentence or two of your own text

For example, if the front matter says:
```yaml
title: My Portfolio
```
Change it to:
```yaml
title: Sarah Martinez
```

And below the closing `---`, add something like:
```markdown
I study medieval cartography at UNM and I'm interested in how maps shape political imagination.
```

---

## Save and publish

1. In the left sidebar, click the **Source Control** icon (it looks like a branch, and should show a badge with the number of changed files)
2. You'll see your changed file listed
3. Type a short message describing what you changed (e.g., "Update homepage title")
4. Click the **checkmark** icon or press **Ctrl+Enter** (Cmd+Enter on Mac) to commit
5. When prompted, click **"Sync Changes"** to push your changes to GitHub

---

## See it live

GitHub Pages will rebuild your site automatically. This takes about 1--2 minutes.

1. Go to your repository page on GitHub (press the GitHub icon in the bottom-left of the editor, or navigate to `github.com/YOUR-USERNAME/YOUR-REPO`)
2. Click the **Actions** tab to watch the build progress
3. When the yellow dot turns green, refresh your live site

Your change is live on the open web.

---

## What just happened

You edited a file, committed the change (saving a versioned snapshot), and pushed it to GitHub, which rebuilt your site automatically. The tools are just text files and the GitHub platform that makes and publishes your site from those files. You can take the files for your site and host them anywhere, and if you do nothing to your site for a decade, your site will still be working.

---

## Next step

**[Add an Image](add-an-image)** --- put a photo on your site.
