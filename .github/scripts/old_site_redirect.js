'use strict';
(() => {
  const script = document.currentScript;
  const page = script && script.dataset.page;
  const roots = { 'ystoneman.github.io': '/kew-riverside-website/', 'savekewriverside.org': '/' };
  const prefix = roots[location.hostname];
  if (!prefix || !location.pathname.startsWith(prefix) || !page ||
      !/^(?:[a-z0-9-]+\.html)$/.test(page)) return;
  const relative = location.pathname.slice(prefix.length);
  if (relative !== page && !(page === 'index.html' && relative === '')) return;
  const destination = new URL(page === 'index.html' ? '/' : '/' + page, 'https://savekewriversideprimaryschool.org');
  destination.search = location.search;
  destination.hash = location.hash;
  // Recovery belongs to the old origin. Never copy, clear or migrate browser data.
  if (page === 'letters.html' || page === 'sent.html') {
    if (new URLSearchParams(location.search).get('recover') === 'draft') return;
    if (page === 'letters.html') {
      try { if (['https://savekewriverside.org', 'https://savekewriversideprimaryschool.org'].includes(new URL(document.referrer).origin)) return; }
      catch { /* absent referrer */ }
    }
    try {
      const read = (area, key) => {
        const raw = window[area].getItem(key);
        try { return JSON.parse(raw); } catch { return null; }
      };
      const draft = read('localStorage', 'kr-letter-draft');
      const cleared = read('sessionStorage', 'kr-letter-cleared');
      const fingerprint = text => {
        let h = 2166136261;
        for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
        return (h >>> 0).toString(36) + ':' + text.length;
      };
      if (draft && draft.v === 1 && typeof draft.text === 'string' && typeof draft.saved === 'number' &&
          Date.now() - draft.saved < 7 * 24 * 60 * 60 * 1000 &&
          !(cleared && cleared.id === fingerprint(draft.text))) return;
      const kind = read('sessionStorage', 'kr-sent-kind');
      if (kind && typeof kind.kind === 'string' && typeof kind.at === 'number' &&
          Date.now() - kind.at < 30 * 60 * 1000) return;
      const pending = read('sessionStorage', 'kr-sent-letter');
      if (pending && typeof pending.text === 'string' && typeof pending.at === 'number' &&
          Date.now() - pending.at < 30 * 60 * 1000 &&
          !(cleared && cleared.id === fingerprint(pending.text))) return;
    } catch { return; } // Inaccessible storage must not strand an old draft.
  }
  location.replace(destination.href);
})();
