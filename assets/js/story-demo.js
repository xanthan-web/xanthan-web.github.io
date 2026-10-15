import { sourceTokens, parameters, markdownNodes, localImage, fitEditor } from './demo-source.js';

// A small model of the existing bg-multi-long + bg-switch pattern. The preview
// scrolls within its own region; a copied story uses the full page. Only these
// named includes are recognised, and every visitor-supplied word is textContent.
(function () {
  const opening = 'scrollybox/bg-multi-long.html';
  const switching = 'scrollybox/bg-switch.html';
  const closing = 'scrollybox/bg-multi-long-close.html';
  const openKeys = ['bg-id', 'image-path', 'box-align'];
  const switchKeys = ['bg-id', 'switch-id', 'image-path'];

  function readStory(source, baseurl) {
    const tokens = sourceTokens(source);
    let state = 'before';
    let bgId;
    let align = 'left';
    let scene;
    const scenes = [];
    const switchIds = new Set();
    tokens.forEach(token => {
      if (token.type === 'text') {
        if (state !== 'open' && token.source.trim()) throw new Error('Keep the story between its opening and closing includes.');
        if (state === 'open') scene.text += token.source;
        return;
      }
      if (state === 'before') {
        const values = parameters(token.source, opening, openKeys);
        bgId = values['bg-id'];
        if (!bgId || !/^[a-zA-Z][\w-]*$/.test(bgId)) throw new Error('Give the story a short bg-id, such as my-story.');
        align = values['box-align'] || 'center';
        if (!['left', 'center', 'right'].includes(align)) throw new Error('Use left, center, or right for box-align.');
        scene = { image: localImage(values['image-path'], baseurl), text: '', token };
        scenes.push(scene);
        state = 'open';
      } else if (state === 'open' && token.source.includes(closing)) {
        parameters(token.source, closing, []);
        state = 'closed';
      } else if (state === 'open') {
        const values = parameters(token.source, switching, switchKeys);
        if (values['bg-id'] !== bgId) throw new Error('Use the same bg-id in the opening and image-change instructions.');
        const switchId = values['switch-id'];
        if (!switchId || !/^[a-zA-Z][\w-]*$/.test(switchId) || switchIds.has(switchId)) throw new Error('Give each image change its own switch-id.');
        switchIds.add(switchId);
        scene = { image: localImage(values['image-path'], baseurl), text: '', token };
        scenes.push(scene);
      } else {
        throw new Error('Keep one scrolling story in this example.');
      }
    });
    if (state !== 'closed') throw new Error('Finish the story with scrollybox/bg-multi-long-close.html.');
    if (scenes.length < 2 || scenes.length > 4) throw new Error('Use two to four image passages in this example.');
    scenes.forEach(item => { if (!item.text.trim()) throw new Error('Give each image a heading or passage of text.'); });
    return { scenes, align, tokens };
  }

  function start() {
    document.querySelectorAll('[data-story-demo]').forEach(demo => {
      if (demo.dataset.storyReady) return;
      const editor = demo.querySelector('[data-story-source]');
      const viewport = demo.querySelector('[data-story-viewport]');
      const sceneContainer = demo.querySelector('[data-story-scenes]');
      const background = demo.querySelector('[data-story-background-image]');
      const error = demo.querySelector('[data-story-error]');
      const alignControl = demo.querySelector('[data-story-align]');
      const toggle = demo.querySelector('[data-story-toggle]');
      const sourcePanel = demo.querySelector('[data-story-source-panel]');
      const initialSource = editor.value;
      const baseurl = (demo.dataset.baseurl || '').replace(/\/$/, '');
      try { readStory(initialSource, baseurl); }
      catch (problem) { console.warn('ScrollStory demo: showing the static version.', problem.message); return; }
      const imageDescriptions = new Map(Array.from(demo.querySelectorAll('[data-story-step]'), step => [step.dataset.image, step.dataset.alt]));
      let steps = [];

      function chooseBackground() {
        const threshold = viewport.getBoundingClientRect().top + viewport.clientHeight * 0.6;
        let current = steps[0];
        steps.forEach(step => { if (step.getBoundingClientRect().top <= threshold) current = step; });
        if (!current) return;
        if (background.src !== current.dataset.image) background.src = current.dataset.image;
        background.alt = current.dataset.alt;
      }

      function update() {
        fitEditor(editor);
        try {
          const story = readStory(editor.value, baseurl);
          const nodes = story.scenes.map(item => {
            const section = document.createElement('section');
            section.className = 'story-demo-step';
            section.dataset.storyStep = '';
            section.dataset.image = item.image;
            const card = document.createElement('div');
            card.className = 'story-demo-card';
            card.append(...markdownNodes(item.text));
            section.dataset.alt = imageDescriptions.get(new URL(item.image).pathname) || card.querySelector('h1, h2, h3, h4, h5, h6')?.textContent || 'Story background';
            section.append(card);
            return section;
          });
          const scrollPosition = viewport.scrollTop;
          sceneContainer.replaceChildren(...nodes);
          viewport.classList.remove('story-demo-viewport--left', 'story-demo-viewport--center', 'story-demo-viewport--right');
          viewport.classList.add('story-demo-viewport--' + story.align);
          alignControl.value = story.align;
          steps = nodes;
          viewport.scrollTop = scrollPosition;
          chooseBackground();
          editor.removeAttribute('aria-invalid');
          error.textContent = '';
          return story;
        } catch (problem) {
          editor.setAttribute('aria-invalid', 'true');
          error.textContent = problem.message + ' Your last working preview is still shown.';
          return null;
        }
      }

      function changeInstructions(change) {
        const story = readStory(editor.value, baseurl);
        change(story);
        editor.value = story.tokens.map(token => token.source).join('');
        update();
      }
      function writeInstruction(token, path, values) {
        token.source = '{% include ' + path + '\n' + Object.entries(values).map(([key, value]) => '  ' + key + '=' + JSON.stringify(value)).join('\n') + '\n%}';
      }
      function useControl(action) {
        try { action(); }
        catch (problem) { error.textContent = 'Finish the story instructions before using this control. Your last working preview is still shown.'; }
      }
      alignControl.addEventListener('change', () => useControl(() => changeInstructions(story => {
        const token = story.scenes[0].token;
        const values = parameters(token.source, opening, openKeys);
        values['box-align'] = alignControl.value;
        writeInstruction(token, opening, values);
      })));
      demo.querySelector('[data-story-swap]').addEventListener('click', () => useControl(() => changeInstructions(story => {
        const paths = story.scenes.map(scene => scene.image);
        story.scenes.forEach((scene, index) => {
          const path = index === 0 ? opening : switching;
          const values = parameters(scene.token.source, path, index === 0 ? openKeys : switchKeys);
          // Keep the copyable source site-root relative, including in a starter
          // published under /repo/. The preview itself resolves the prefix.
          const imagePath = new URL(paths[paths.length - 1 - index]).pathname;
          values['image-path'] = baseurl && imagePath.startsWith(baseurl + '/') ? imagePath.slice(baseurl.length) : imagePath;
          writeInstruction(scene.token, path, values);
        });
      })));
      demo.querySelector('[data-story-reset]').addEventListener('click', () => { editor.value = initialSource; viewport.scrollTop = 0; update(); });
      toggle.addEventListener('click', () => {
        const editing = sourcePanel.hidden;
        sourcePanel.hidden = !editing;
        demo.classList.toggle('story-demo--editing', editing);
        toggle.setAttribute('aria-expanded', String(editing));
        toggle.textContent = editing ? 'Return to the story' : 'See and edit the text';
        fitEditor(editor);
        chooseBackground();
      });
      viewport.addEventListener('scroll', chooseBackground, { passive: true });
      editor.addEventListener('input', update);
      background.addEventListener('error', () => { error.textContent = 'The image could not load. Check its image-path against the files in your site.'; });
      demo.classList.add('story-demo--ready');
      demo.querySelector('[data-story-background]').hidden = false;
      viewport.tabIndex = 0;
      editor.hidden = false;
      editor.readOnly = false;
      demo.querySelector('[data-story-static]').hidden = true;
      demo.querySelector('[data-story-controls]').hidden = false;
      demo.querySelector('[data-story-instruction]').hidden = false;
      sourcePanel.hidden = true;
      toggle.hidden = false;
      demo.dataset.storyReady = 'true';
      update();
      if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { fitEditor(editor); chooseBackground(); }).observe(viewport);
      window.addEventListener('resize', () => { fitEditor(editor); chooseBackground(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
