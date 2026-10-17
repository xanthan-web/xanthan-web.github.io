import { parameters, passage, markdownNodes, percentage, localImage, fitEditor } from './demo-source.js';

// Editorial demo: enhance a server-rendered passage with local source edits.
// This recognises only the four displayed examples. It never evaluates Liquid,
// inserts visitor HTML or CSS, or writes the visitor's changes back to the site.
(function () {
  'use strict';

  // The fonts view maps the two theme settings onto properties scoped to its
  // own preview, so an edit cannot restyle anything else on the page.
  var fontProperties = { '--font-heading': '--demo-heading-font', '--font-body': '--demo-body-font' };

  // Read the :root rule in the fonts view. Each value must be a list of font
  // names or generic families; url(), braces, and other properties are refused.
  function fontDeclarations(source) {
    if (source.length > 2000) throw new Error('Keep this example to the two font settings.');
    var rule = source.replace(/\/\*[\s\S]*?\*\//g, '').match(/^\s*:root\s*\{([^{}]*)\}\s*$/);
    if (!rule) throw new Error('Keep :root { at the start and the closing } at the end.');
    var values = Object.create(null);
    rule[1].split(';').forEach(function (declaration) {
      if (!declaration.trim()) return;
      var parts = declaration.match(/^\s*(--[a-z-]+)\s*:\s*([\s\S]*?)\s*$/);
      if (!parts || !fontProperties[parts[1]]) throw new Error('This example sets --font-heading and --font-body. End each line with a semicolon.');
      if (values[parts[1]] !== undefined) throw new Error('Use ' + parts[1] + ' only once.');
      var names = parts[2].split(',').map(function (name) { return name.trim(); });
      if (!names.every(function (name) { return /^(?:'[A-Za-z0-9 -]+'|"[A-Za-z0-9 -]+"|[A-Za-z][A-Za-z0-9 -]*)$/.test(name); })) {
        throw new Error("List font names separated by commas, such as 'Space Grotesk', sans-serif.");
      }
      values[parts[1]] = names.join(', ');
    });
    return values;
  }

  function start() {
    document.querySelectorAll('[data-editorial-demo]').forEach(function (demo) {
      if (demo.hasAttribute('data-demo-ready')) return;
      var tabs = Array.from(demo.querySelectorAll('[data-demo-tab]'));
      var panels = Array.from(demo.querySelectorAll('[data-demo-panel]'));
      if (tabs.length !== 4 || panels.length !== 4) {
        console.warn('Editorial demo needs its four tabs and example panels. Showing the static examples.');
        return;
      }
      var baseurl = (demo.getAttribute('data-baseurl') || '').replace(/\/$/, '');

      panels.forEach(function (panel) {
        var editor = panel.querySelector('[data-demo-source]');
        var preview = panel.querySelector('[data-demo-preview]');
        var page = panel.querySelector('[data-demo-page]');
        var error = panel.querySelector('[data-demo-error]');
        var kind = panel.getAttribute('data-demo-panel');
        var figure = preview && preview.querySelector('figure');
        var image = preview && preview.querySelector('img');
        var quote = preview && preview.querySelector('.pullquote');
        var note = preview && preview.querySelector('.alert');
        var allowed = kind === 'quote' ? ['text', 'width'] : ['image-path', 'image-width', 'caption', 'alt-text'];
        if (kind === 'note') allowed = ['class', 'title', 'heading-level', 'text'];

        function renderFonts() {
          var values = fontDeclarations(editor.value);
          Object.keys(fontProperties).forEach(function (property) {
            if (values[property]) page.style.setProperty(fontProperties[property], values[property]);
            else page.style.removeProperty(fontProperties[property]);
          });
        }

        function update() {
          fitEditor(editor);
          try {
            if (kind === 'font') {
              renderFonts();
              editor.removeAttribute('aria-invalid');
              error.textContent = '';
              return;
            }
            var content = passage(editor.value);
            var before = markdownNodes(content.before);
            var after = markdownNodes(content.after);
            if (content.include) {
              var values = parameters(content.include, panel.getAttribute('data-demo-include'), allowed);
              if (kind === 'quote') {
                if (!values.text || !values.text.trim()) throw new Error('Give the pull quote a text value.');
                var quoteWidth = percentage(values.width, '70%', 100);
                quote.style.width = quoteWidth;
                var quoteText = document.createElement('p');
                quoteText.textContent = values.text;
                quote.replaceChildren(quoteText);
              } else if (kind === 'note') {
                if (!values.text || !values.text.trim()) throw new Error('Give the note a text value.');
                var noteClass = values.class || 'info';
                if (['info', 'warning', 'danger', 'success'].indexOf(noteClass) === -1) {
                  throw new Error('Use info, warning, danger, or success for the note class.');
                }
                var noteLevel = values['heading-level'] || '3';
                if (!/^[1-6]$/.test(noteLevel)) throw new Error('Use a heading-level from 1 to 6 for the note.');
                var noteNodes = [];
                var noteLabel = document.createElement('span');
                noteLabel.className = 'alert-label';
                noteLabel.textContent = { info: 'Information', warning: 'Warning', danger: 'Danger', success: 'Success' }[noteClass];
                noteNodes.push(noteLabel);
                if (values.title) {
                  var noteHeading = document.createElement('h' + noteLevel);
                  noteHeading.className = 'alert-heading';
                  noteHeading.textContent = values.title;
                  noteNodes.push(noteHeading);
                }
                var noteText = document.createElement('p');
                noteText.textContent = values.text;
                noteNodes.push(noteText);
                note.className = 'alert alert-' + noteClass;
                note.replaceChildren(...noteNodes);
              } else {
                var imageUrl = localImage(values['image-path'], baseurl);
                var imageWidth = percentage(values['image-width'], '40%', 100);
                figure.style.width = imageWidth;
                // textContent keeps even pasted markup as plain text. The original
                // include handles the initial Markdown; live edits are plain text.
                var caption = figure.querySelector('figcaption');
                if (values.caption) {
                  if (!caption) {
                    caption = document.createElement('figcaption');
                    figure.appendChild(caption);
                  }
                  var captionText = document.createElement('p');
                  captionText.textContent = values.caption;
                  caption.replaceChildren(captionText);
                } else if (caption) {
                  caption.remove();
                }
                image.alt = values['alt-text'] === undefined ? (values.caption || '') : values['alt-text'];
                var link = figure.querySelector('a.image');
                if (link) link.href = imageUrl;
                if (image.src !== imageUrl) image.src = imageUrl;
              }
            }
            page.replaceChildren(...before, ...(content.include ? [preview] : []), ...after);
            editor.removeAttribute('aria-invalid');
            error.textContent = '';
          } catch (problem) {
            editor.setAttribute('aria-invalid', 'true');
            var message = problem.message + ' Your last working preview is still shown.';
            if (error.textContent !== message) error.textContent = message;
          }
        }

        if (image) image.addEventListener('error', function () {
          error.textContent = 'The image could not load. Check image-path against the files in your site.';
          console.warn('Editorial demo image could not load:', image.getAttribute('src'));
        });
        editor.readOnly = false;
        editor.hidden = false;
        panel.querySelector('[data-demo-static]').hidden = true;
        panel.querySelector('[data-demo-hint]').hidden = false;
        editor.addEventListener('input', update);
        if (typeof ResizeObserver !== 'undefined') {
          new ResizeObserver(function () { fitEditor(editor); }).observe(editor);
        }
      });

      function select(index, focus) {
        tabs.forEach(function (tab, i) {
          tab.setAttribute('aria-selected', i === index ? 'true' : 'false');
          tab.tabIndex = i === index ? 0 : -1;
          panels[i].hidden = i !== index;
          panels[i].setAttribute('role', 'tabpanel');
          panels[i].setAttribute('aria-labelledby', tab.id);
        });
        fitEditor(panels[index].querySelector('[data-demo-source]'));
        if (focus) tabs[index].focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { select(index, false); });
        tab.addEventListener('keydown', function (event) {
          var next;
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
          if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
          if (event.key === 'Home') next = 0;
          if (event.key === 'End') next = tabs.length - 1;
          if (next !== undefined) {
            event.preventDefault();
            select(next, true);
          }
        });
      });
      demo.setAttribute('data-demo-ready', '');
      demo.querySelector('[data-demo-tabs]').hidden = false;
      select(0, false);
      window.addEventListener('resize', function () {
        panels.forEach(function (panel) { fitEditor(panel.querySelector('[data-demo-source]')); });
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
