'use strict';
// One gentle arrival cue for the participation tiles on the first page of a visit.
// Nothing is stored: "first page" means the visitor arrived from another site.
(() => {
  const nav = document.querySelector('.participation-nav');
  if (!nav || nav.querySelector('[aria-current="page"]')) return;
  // The homepage already cues the Parent action plan; don't compete with it.
  if (document.querySelector('.parent-plan-spotlight')) return;
  if (!matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  let internal = false;
  try { internal = Boolean(document.referrer) && new URL(document.referrer).origin === location.origin; } catch { internal = false; }
  if (!internal) document.documentElement.classList.add('voice-cue');
})();
