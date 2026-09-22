'use strict';
(() => {
  const controls = document.querySelector('[aria-label="Pupil trend measure"]');
  const views = Array.from(document.querySelectorAll('[data-trend-view]'));
  const status = document.getElementById('trend-status');
  if (!controls || views.length !== 2 || !status) return;
  const buttons = Array.from(controls.querySelectorAll('button'));
  function show(mode) {
    if (!['count', 'change'].includes(mode)) return;
    views.forEach(view => { view.hidden = view.dataset.trendView !== mode; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.measure === mode)));
    status.textContent = mode === 'count'
      ? 'Pupil numbers · the same scale for each school.'
      : 'Percentage change · each school starts at 0% in the first year shown.';
  }
  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.measure)));
  show('count');
  controls.hidden = false;
})();
