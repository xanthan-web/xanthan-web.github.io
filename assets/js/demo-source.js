// Shared, deliberately small source readers for the visual demos.
// Only named includes and plain values are parsed. Markdown becomes text nodes;
// visitor HTML and Liquid are never executed. Loaded as an ES module.
export function parameters(source, expectedInclude, allowed) {
  if (source.length > 12000) throw new Error('Keep this example to a short passage.');
  var include = source.match(/^\s*{%\s*include\s+([a-z][a-z0-9/-]*\.html)\s*([\s\S]*?)\s*%}\s*$/);
  if (!include || include[1] !== expectedInclude) {
    throw new Error('Keep the include name and its opening {% and closing %}. Edit the values between them.');
  }
  var remaining = include[2];
  var values = Object.create(null);
  while (remaining.trim()) {
    var parameter = remaining.match(/^\s*([a-z][a-z0-9-]*)\s*=\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\.\d+)?(?=\s|$))/);
    if (!parameter) throw new Error('Put each value in matching quotes, for example image-width="50%".');
    var name = parameter[1];
    if (allowed.indexOf(name) === -1) throw new Error('This example uses ' + allowed.join(', ') + '.');
    if (Object.prototype.hasOwnProperty.call(values, name)) throw new Error('Use ' + name + ' only once.');
    try {
      var raw = parameter[2];
      if (raw[0] === '"') values[name] = JSON.parse(raw);
      else if (raw[0] === "'") values[name] = raw.slice(1, -1).replace(/\\(['\\])/g, '$1');
      else if (name === 'heading-level') values[name] = raw;
      else throw new Error('Quote this value.');
    } catch (error) {
      throw new Error('Use plain text inside the quotes. Put a backslash before a quote inside your text.');
    }
    remaining = remaining.slice(parameter[0].length);
  }
  return values;
}

// Find the component among ordinary page text. A quoted caption may contain
// %}, so only an unquoted closing tag ends the include.
export function sourceTokens(source, maximum = 20000) {
  if (source.length > maximum) throw new Error('Keep this example to a short passage.');
  var tokens = [];
  var cursor = 0;
  while (cursor < source.length) {
    var start = source.indexOf('{%', cursor);
    if (start === -1) { tokens.push({ type: 'text', source: source.slice(cursor) }); break; }
    if (start > cursor) tokens.push({ type: 'text', source: source.slice(cursor, start) });
    var quote = '';
    var escaped = false;
    var end = -1;
    for (var i = start + 2; i < source.length - 1; i++) {
      var character = source[i];
      if (escaped) { escaped = false; continue; }
      if (quote && character === '\\') { escaped = true; continue; }
      if (quote) { if (character === quote) quote = ''; }
      else if (character === '"' || character === "'") quote = character;
      else if (character === '%' && source[i + 1] === '}') { end = i + 2; break; }
    }
    if (end === -1) throw new Error('Finish the include with matching quotes and a closing %}.');
    tokens.push({ type: 'include', source: source.slice(start, end) });
    cursor = end;
  }
  return tokens;
}

export function passage(source) {
  var tokens = sourceTokens(source, 12000);
  var includes = tokens.filter(function (token) { return token.type === 'include'; });
  if (includes.length > 1) throw new Error('Use one include in this short example, with headings and paragraphs around it.');
  if (!includes.length) return { before: source, include: '', after: '' };
  var index = tokens.indexOf(includes[0]);
  return { before: index ? tokens[index - 1].source : '', include: includes[0].source, after: index < tokens.length - 1 ? tokens[index + 1].source : '' };
}

// The introductory editor supports headings and paragraphs. Build actual
// elements with textContent, so pasted HTML and Liquid remain inert text.
export function markdownNodes(source) {
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
      element.textContent = heading[2].replace(/[ \t]+#+[ \t]*$/, '').trim();
      nodes.push(element);
    } else {
      paragraph.push(line.trim());
    }
  });
  flush();
  return nodes;
}

export function percentage(value, fallback, maximum) {
  var width = value === undefined ? fallback : value.trim();
  var number = parseFloat(width);
  if (!/^\d+(?:\.\d+)?%$/.test(width) || number < 1 || number > maximum) {
    throw new Error('Use a width from 1% to ' + maximum + '% in this example.');
  }
  return width;
}

export function localImage(path, baseurl) {
  if (!path || !path.trim()) throw new Error('The image needs an image-path value.');
  var raw = path.trim();
  if (raw[0] === '/' && raw[1] !== '/') raw = baseurl + raw;
  var url = new URL(raw, window.location.href);
  if (url.origin !== window.location.origin || !/^https?:$/.test(url.protocol)) {
    throw new Error('Use an image from this site, such as the sample image-path shown here.');
  }
  return url.href;
}

export function fitEditor(editor) {
  if (editor.clientWidth) {
    editor.style.height = 'auto';
    editor.style.height = (editor.scrollHeight + 2) + 'px';
  }
}
