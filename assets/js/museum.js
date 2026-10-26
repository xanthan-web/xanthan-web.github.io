/*
  Museum interactions. Small, optional enhancements; every page still works
  without them.
    1. Reading-progress bar on essays
    2. Gentle fade-in of essay sections as they scroll into view
    3. Click-to-enlarge images (lightbox)
    4. Region and period filter buttons on the objects page
*/
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Reading progress
  var bar = document.querySelector('.essay-progress');
  if (bar) {
    var body = document.querySelector('.essay-body');
    var update = function () {
      var top = body.getBoundingClientRect().top + window.scrollY;
      var span = body.offsetHeight - window.innerHeight * 0.5;
      var p = span > 0 ? (window.scrollY - top + window.innerHeight * 0.5) / span : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, p)) + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // 2. Reveal on scroll
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.essay-body h2, .essay-body .m-figure, .essay-body .pullquote, .essay-body .m-callout, .essay-body .m-closer');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { el.classList.add('js-reveal'); io.observe(el); });
  }

  // 3. Lightbox
  var zooms = document.querySelectorAll('a.m-zoom');
  if (zooms.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'm-lightbox';
    dlg.innerHTML = '<button type="button" aria-label="Close image">Close</button><img alt=""><p></p>';
    document.body.appendChild(dlg);
    var img = dlg.querySelector('img'), cap = dlg.querySelector('p');
    zooms.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        ev.preventDefault();
        var thumb = a.querySelector('img');
        var fig = a.closest('figure');
        var c = fig && fig.querySelector('figcaption');
        img.src = a.href;
        img.alt = thumb ? thumb.alt : '';
        cap.textContent = c ? c.textContent : '';
        dlg.showModal();
      });
    });
    dlg.addEventListener('click', function (ev) { if (ev.target !== img) dlg.close(); });
  }

  // 4. Filters (region + period work together)
  document.querySelectorAll('[data-object-filter]').forEach(function (wrap) {
    var groups = wrap.querySelectorAll('.m-filters');
    var cards = wrap.querySelectorAll('.m-object');
    var empty = wrap.querySelector('.m-empty');
    var state = {};
    var apply = function () {
      var shown = 0;
      cards.forEach(function (card) {
        var ok = Object.keys(state).every(function (g) {
          return state[g] === 'all' || card.getAttribute('data-' + g) === state[g];
        });
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    groups.forEach(function (group) {
      var name = group.getAttribute('data-group');
      state[name] = 'all';
      var buttons = group.querySelectorAll('.m-filter');
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          state[name] = btn.getAttribute('data-filter');
          buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
          apply();
        });
      });
    });
  });
})();
