import { parameters, passage, markdownNodes, percentage, localImage, fitEditor } from './demo-source.js';

// Editorial demo: enhance a server-rendered passage with local source edits.
// This recognises only the three displayed examples. It never evaluates Liquid,
// inserts visitor HTML, or writes the visitor's changes back to the site.
(function () {
  'use strict';

  function start() {
    document.querySelectorAll('[data-editorial-demo]').forEach(function (demo) {
      if (demo.hasAttribute('data-demo-ready')) return;
      var tabs = Array.from(demo.querySelectorAll('[data-demo-tab]'));
      var panels = Array.from(demo.querySelectorAll('[data-demo-panel]'));
      if (tabs.length !== 3 || panels.length !== 3) {
        console.warn('Editorial demo needs its three tabs and example panels. Showing the static examples.');
        return;
      }
      var baseurl = (demo.getAttribute('data-baseurl') || '').replace(/\/$/, '');

      panels.forEach(function (panel) {
        var editor = panel.querySelector('[data-demo-source]');
        var preview = panel.querySelector('[data-demo-preview]');
        var page = panel.querySelector('[data-demo-page]');
        var error = panel.querySelector('[data-demo-error]');
        var kind = panel.getAttribute('data-demo-panel');
        var figure = preview.querySelector('figure');
        var image = preview.querySelector('img');
        var quote = preview.querySelector('.pullquote');
        var note = preview.querySelector('.alert');
        var noteStyle = panel.querySelector('[data-demo-note-style]');
        var noteLevelControl = panel.querySelector('[data-demo-note-level]');
        var allowed = kind === 'quote' ? ['text', 'width'] : ['image-path', 'image-width', 'caption', 'alt-text'];
        if (kind === 'note') allowed = ['class', 'title', 'heading-level', 'text'];

        function update() {
          fitEditor(editor);
          try {
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
                noteStyle.value = noteClass;
                noteLevelControl.value = noteLevel;
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
        if (kind === 'note') {
          panel.querySelector('[data-demo-controls]').hidden = false;
          function changeNote(name, value) {
            try {
              var content = passage(editor.value);
              var values = parameters(content.include, panel.getAttribute('data-demo-include'), allowed);
              values[name] = value;
              var include = '{% include typography/alert.html\n';
              ['class', 'title', 'heading-level', 'text'].forEach(function (key) {
                if (values[key] !== undefined) include += '  ' + key + '=' + (key === 'heading-level' ? values[key] : JSON.stringify(values[key])) + '\n';
              });
              editor.value = content.before + include + '%}' + content.after;
              update();
            } catch (problem) {
              error.textContent = 'Finish the include in the text before using these controls. Your last working preview is still shown.';
            }
          }
          noteStyle.addEventListener('change', function () { changeNote('class', noteStyle.value); });
          noteLevelControl.addEventListener('change', function () { changeNote('heading-level', noteLevelControl.value); });
        }
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
