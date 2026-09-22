'use strict';
(() => {
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  const toggle = menu.querySelector('summary');
  // Native details remains usable if JavaScript is unavailable.
  document.addEventListener('click', event => {
    if (menu.open && (!menu.contains(event.target) || event.target.closest('a'))) menu.open = false;
  });
  // Safari can blur the summary with no relatedTarget before a tapped link
  // activates. Close only when focus actually arrives outside the menu.
  document.addEventListener('focusin', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      menu.open = false;
      toggle.focus();
    }
  });
  const compact = matchMedia('(max-width: 1100px)');
  compact.addEventListener('change', () => { if (!compact.matches) menu.open = false; });
})();
