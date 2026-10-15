// Fade a shared image frame when the next passage reaches the reading area's
// top. Scroll mode and the complete static fallback require no JavaScript.
(function () {
  'use strict';
  function start() {
    document.querySelectorAll('[data-story-sequence="fade"]').forEach(function (sequence) {
      if (sequence.dataset.fadeReady) return;
      var backdrop = sequence.querySelector('[data-sequence-backdrop]');
      var layers = Array.from(backdrop.querySelectorAll('.story-sequence-layer'));
      var cards = Array.from(sequence.querySelectorAll('.story-sequence-card'));
      if (!layers.length || layers.length !== cards.length) {
        console.warn('Xanthan story sequence: each passage needs its own photograph.');
        return;
      }
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      var scheduled = false;

      function update() {
        scheduled = false;
        if (reduced.matches) return;
        var nav = document.querySelector('.top-nav');
        var top = nav ? Math.max(0, nav.getBoundingClientRect().bottom) : 0;
        var current = 0;
        cards.forEach(function (card, index) {
          if (card.getBoundingClientRect().top <= top) current = index;
        });
        layers.forEach(function (layer, index) {
          layer.classList.toggle('story-sequence-layer--active', index === current);
        });
      }
      function schedule() {
        if (!scheduled) { scheduled = true; window.requestAnimationFrame(update); }
      }
      function motionPreference() {
        sequence.classList.toggle('story-sequence--fade-ready', !reduced.matches);
        backdrop.hidden = reduced.matches;
        schedule();
      }
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', schedule);
      reduced.addEventListener('change', motionPreference);
      sequence.dataset.fadeReady = 'true';
      motionPreference();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
