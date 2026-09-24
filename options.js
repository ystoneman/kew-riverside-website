/* Optional funding depth stays open if scripts fail. Shared question links reveal it. */
(() => {
  'use strict';
  document.querySelectorAll('[data-options-detail]').forEach(detail => { detail.open = false; });
  function reveal(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (!target) return;
    for (let node = target; node; node = node.parentElement) {
      if (node.tagName === 'DETAILS') node.open = true;
    }
    target.scrollIntoView({ block: 'start' });
  }
  window.addEventListener('hashchange', () => reveal(location.hash));
  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (link?.hash === location.hash) reveal(link.hash);
  });
  if (location.hash) reveal(location.hash);
})();
