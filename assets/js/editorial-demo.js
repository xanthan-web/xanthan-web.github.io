// Editorial demo: enhance a server-rendered passage with local source edits.
// This recognises only the three displayed examples. It never evaluates Liquid,
// inserts visitor HTML, or writes the visitor's changes back to the site.
(function () {
  'use strict';

  function parameters(source, expectedInclude, allowed) {
    if (source.length > 12000) throw new Error('Keep this example to a short passage.');
    var include = source.match(/^\s*{%\s*include\s+([a-z][a-z0-9/-]*\.html)\s*([\s\S]*?)\s*%}\s*$/);
    if (!include || include[1] !== expectedInclude) {
      throw new Error('Keep the include name and its opening {% and closing %}. Edit the values between them.');
    }
    var remaining = include[2];
    var values = Object.create(null);
    while (remaining.trim()) {
      var parameter = remaining.match(/^\s*([a-z][a-z0-9-]*)\s*=\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/);
      if (!parameter) throw new Error('Put each value in matching quotes, for example image-width="50%".');
      var name = parameter[1];
      if (allowed.indexOf(name) === -1) throw new Error('This example uses ' + allowed.join(', ') + '.');
      if (Object.prototype.hasOwnProperty.call(values, name)) throw new Error('Use ' + name + ' only once.');
      try {
        values[name] = parameter[2][0] === '"' ? JSON.parse(parameter[2]) : parameter[2].slice(1, -1).replace(/\\(['\\])/g, '$1');
      } catch (error) {
        throw new Error('Use plain text inside the quotes. Put a backslash before a quote inside your text.');
      }
      remaining = remaining.slice(parameter[0].length);
    }
    return values;
  }

  // Find the component among ordinary page text. A quoted caption may contain
  // %}, so only an unquoted closing tag ends the include.
  function passage(source) {
    if (source.length > 12000) throw new Error('Keep this example to a short passage.');
    var start = source.indexOf('{%');
    if (start === -1) return { before: source, include: '', after: '' };
    var quote = '';
    var escaped = false;
    for (var i = start + 2; i < source.length - 1; i++) {
      var character = source[i];
      if (escaped) { escaped = false; continue; }
      if (quote && character === '\\') { escaped = true; continue; }
      if (quote) {
        if (character === quote) quote = '';
      } else if (character === '"' || character === "'") {
        quote = character;
      } else if (character === '%' && source[i + 1] === '}') {
        var after = source.slice(i + 2);
        if (after.indexOf('{%') !== -1) throw new Error('Use one include in this short example, with headings and paragraphs around it.');
        return { before: source.slice(0, start), include: source.slice(start, i + 2), after: after };
      }
    }
    throw new Error('Finish the include with matching quotes and a closing %}.');
  }

  // The introductory editor supports headings and paragraphs. Build actual
  // elements with textContent, so pasted HTML and Liquid remain inert text.
  function markdownNodes(source, state) {
    var nodes = [];
    var paragraph = [];
    function flush() {
      if (!paragraph.length) return;
      var element = document.createElement('p');
      element.textContent = paragraph.join(' ');
      nodes.push(element);
      paragraph = [];
    }
    source.replace(/\r\n?/g, '\n').split('\n').forEach(function (line) {
      var heading = line.match(/^(#{1,6})[ \t]+(.+)$/);
      if (!line.trim()) {
        flush();
      } else if (heading) {
        flush();
        var element = document.createElement('h' + heading[1].length);
        element.className = state.headingSeen ? 'editorial-demo-section-heading' : 'editorial-demo-story-heading';
        element.textContent = heading[2].replace(/[ \t]+#+[ \t]*$/, '').trim();
        state.headingSeen = true;
        nodes.push(element);
      } else {
        paragraph.push(line.trim());
      }
    });
    flush();
    return nodes;
  }

  function percentage(value, fallback, maximum) {
    var width = value === undefined ? fallback : value.trim();
    var number = parseFloat(width);
    if (!/^\d+(?:\.\d+)?%$/.test(width) || number < 1 || number > maximum) {
      throw new Error('Use a width from 1% to ' + maximum + '% in this example.');
    }
    return width;
  }

  function localImage(path, baseurl) {
    if (!path || !path.trim()) throw new Error('The image needs an image-path value.');
    var raw = path.trim();
    if (raw[0] === '/' && raw[1] !== '/') raw = baseurl + raw;
    var url = new URL(raw, window.location.href);
    if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) {
      throw new Error('Use an image from this site, such as the sample image-path shown here.');
    }
    return url.href;
  }

  function fitEditor(editor) {
    if (editor.clientWidth) {
      editor.style.height = 'auto';
      editor.style.height = (editor.scrollHeight + 2) + 'px';
    }
  }

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
        var allowed = kind === 'quote' ? ['text', 'width'] : ['image-path', 'image-width', 'caption', 'alt-text'];
        if (kind === 'note') allowed = ['class', 'title', 'heading-level', 'text'];

        function update() {
          fitEditor(editor);
          try {
            var content = passage(editor.value);
            var markdownState = { headingSeen: false };
            var before = markdownNodes(content.before, markdownState);
            var after = markdownNodes(content.after, markdownState);
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
                if (!/^[2-6]$/.test(noteLevel)) throw new Error('Use a heading-level from 2 to 6 for the note.');
                var noteNodes = [];
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
