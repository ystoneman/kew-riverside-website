'use strict';
(() => {
  const form = document.getElementById('letter-form');
  const message = document.getElementById('message');
  const displayName = document.getElementById('display-name');
  const consent = document.getElementById('letter-consent');
  const publicPermission = document.getElementById('allow-public');
  const councilPermission = document.getElementById('allow-council');
  const councilDetails = document.getElementById('council-details');
  const privateFields = [...councilDetails.querySelectorAll('input')];
  const button = form.querySelector('button[type="submit"]');
  const count = document.getElementById('message-count');
  const DRAFT = 'kr-letter-draft';
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  // Browser storage can be unavailable (private modes, blocked site data); never let it break the form.
  const store = {
    get(key, area = localStorage) { try { return JSON.parse(area.getItem(key)); } catch { return null; } },
    set(key, value, area = localStorage) { try { area.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
    remove(key, area = localStorage) { try { area.removeItem(key); } catch { /* storage unavailable */ } }
  };
  // A short fingerprint of a letter, never its text, so a confirmed letter is recognised on return.
  const fingerprint = text => { let h = 2166136261; for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36) + ':' + text.length; };
  const confirmed = text => { const record = store.get('kr-letter-confirmed', sessionStorage); return Boolean(text) && Boolean(record) && record.id === fingerprint(text); };
  const londonDate = () => {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return `${values.year}-${values.month}-${values.day}`;
  };
  if (globalThis.crypto && crypto.randomUUID) {
    const reference = 'KR-' + crypto.randomUUID();
    document.getElementById('letter-reference').value = reference;
    document.getElementById('reference-display').textContent = reference;
    document.getElementById('reference-note').hidden = false;
  }
  function updatePreview() {
    document.getElementById('preview-name').textContent = displayName.value.trim() || 'Anonymous';
    document.getElementById('preview-body').textContent = message.value.trim() || 'Your letter will appear here.';
    count.textContent = message.value.length.toLocaleString('en-GB') + ' / ' + message.maxLength.toLocaleString('en-GB') + ' characters';
    // A counter from the first keystroke signals an essay; show it only near the limit.
    count.hidden = message.value.length < message.maxLength * 0.8;
    message.setCustomValidity('');
  }
  function updateChoices() {
    councilDetails.hidden = !councilPermission.checked;
    privateFields.forEach(field => { field.disabled = !councilPermission.checked; });
    const choices = [];
    if (publicPermission.checked) choices.push('Public display after automated screening or human review, using your display name or Anonymous.');
    if (councilPermission.checked) choices.push('May be included in a reviewed collection for Richmond Council, with any private name and postcode you provide.');
    document.getElementById('sharing-summary').textContent = choices.length ? choices.join(' ') : 'Both sharing choices are off. Your letter will stay in the private review queue.';
  }
  const input = () => message.dispatchEvent(new Event('input', { bubbles: true }));
  message.addEventListener('input', updatePreview);
  displayName.addEventListener('input', updatePreview);
  publicPermission.addEventListener('change', updateChoices);
  councilPermission.addEventListener('change', updateChoices);

  // With scripts, the device draft replaces the browser's own form restoring, which
  // could otherwise refill a letter that was already sent. Without scripts, it still helps.
  message.setAttribute('autocomplete', 'off');

  // Sentence starters; the static suggestion remains for visitors without scripts.
  document.getElementById('starters').hidden = false;
  document.getElementById('starter-static').hidden = true;
  document.querySelectorAll('.starter').forEach(starter => starter.addEventListener('click', () => {
    const current = message.value.replace(/\s+$/, '');
    message.value = current ? current + '\n\n' + starter.dataset.starter : starter.dataset.starter;
    message.focus();
    message.setSelectionRange(message.value.length, message.value.length);
    input();
  }));

  // A draft kept in this browser on this device: the letter and public name only,
  // never the email or council details. Not restored after seven days.
  const status = document.getElementById('draft-status');
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'draft-clear';
  clear.textContent = 'Clear draft';
  clear.hidden = true;
  status.after(clear);
  const returnPanel = document.getElementById('sent-return');
  function showStatus(text, withClear = true) {
    const next = '✓ ' + text;
    if (status.textContent !== next) status.textContent = next;
    status.hidden = false;
    clear.hidden = !withClear;
  }
  function forgetDraft(note) {
    store.remove(DRAFT);
    message.value = '';
    input();
    returnPanel.hidden = true;
    if (note) showStatus(note, false); else { status.hidden = true; clear.hidden = true; }
  }
  clear.addEventListener('click', () => { forgetDraft(); message.focus(); });
  let timer;
  let sent = false; // After Send, only a real edit resumes saving.
  function saveDraft(pending = false) {
    clearTimeout(timer);
    if (sent && !pending) return;
    if (!pending && confirmed(message.value)) return;
    if (message.value.trim().length < 3) { store.remove(DRAFT); status.hidden = true; clear.hidden = true; return; }
    if (store.set(DRAFT, { v: 1, text: message.value, name: displayName.value, saved: Date.now(), pending })) showStatus('Draft saved on this device');
  }
  const saved = store.get(DRAFT);
  if (saved && saved.v === 1 && typeof saved.text === 'string' && typeof saved.saved === 'number' && Date.now() - saved.saved < WEEK) {
    if (!message.value) {
      message.value = saved.text;
      if (typeof saved.name === 'string') displayName.value = saved.name;
      input();
    }
    if (saved.pending) returnPanel.hidden = false;
    else showStatus('Draft restored from this device');
  } else if (saved) {
    store.remove(DRAFT);
  }
  for (const field of [message, displayName]) {
    field.addEventListener('input', () => { sent = false; clearTimeout(timer); timer = setTimeout(saveDraft, 600); });
  }
  addEventListener('pagehide', () => { if (message.value.trim().length >= 3) saveDraft(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && message.value.trim().length >= 3) saveDraft(); });
  // Coming back to a letter the thank-you page confirmed: clear it rather than invite a duplicate.
  const forgetConfirmed = () => { if (confirmed(message.value)) forgetDraft('Your letter was sent. You can write another here'); };
  forgetConfirmed();
  addEventListener('pageshow', forgetConfirmed);

  // Returning after pressing Send without the thank-you page: copy for the official form, or clear.
  document.getElementById('return-copy').addEventListener('click', async () => {
    const note = document.getElementById('return-status');
    try {
      await navigator.clipboard.writeText(message.value);
      note.textContent = 'Copied. In the official form, answer the questions, then paste your letter into the comments box.';
    } catch {
      message.focus();
      message.select();
      note.textContent = 'Your letter is selected below; copy it with your device’s Copy command.';
    }
  });
  document.getElementById('return-clear').addEventListener('click', () => forgetDraft('Draft cleared from this device'));

  // Write first; the choices and Send follow. Everything stays visible without scripts,
  // after a restored draft, and for a link to a later field.
  const later = [document.getElementById('step-choose'), document.getElementById('step-send')];
  const next = document.getElementById('to-choices');
  const stepError = document.getElementById('step-error');
  function reveal(focus) {
    form.classList.remove('is-staged');
    later.forEach(section => section.classList.remove('is-waiting'));
    next.hidden = true;
    stepError.hidden = true;
    if (focus) {
      const heading = document.getElementById('step-choose-title');
      heading.focus({ preventScroll: true });
      heading.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }
  const hash = location.hash.slice(1);
  const linkedLater = /^[\w-]+$/.test(hash) && later.some(section => section.querySelector('#' + hash));
  if (message.value.trim().length >= 10 || linkedLater) {
    reveal(false);
  } else {
    form.classList.add('is-staged');
    later.forEach(section => section.classList.add('is-waiting'));
    next.hidden = false;
  }
  next.addEventListener('click', () => {
    if (message.value.trim().length < 10) {
      stepError.textContent = 'Write a sentence or two first. It needs at least 10 characters.';
      stepError.hidden = false;
      message.focus();
      return;
    }
    reveal(true);
  });
  addEventListener('hashchange', () => {
    const target = location.hash.slice(1);
    if (/^[\w-]+$/.test(target) && later.some(section => section.querySelector('#' + target))) reveal(false);
  });

  // The official-response line retires after the stated deadline (London date).
  if (londonDate() > '2026-10-16') document.getElementById('official-line').hidden = true;

  form.addEventListener('submit', event => {
    updateChoices();
    if (message.value.trim().length < 10) {
      event.preventDefault();
      message.setCustomValidity('Please enter at least 10 characters for your letter.');
      message.reportValidity();
      return;
    }
    if (message.value.length > message.maxLength) {
      event.preventDefault();
      message.setCustomValidity('Please keep your letter to 30,000 characters or fewer.');
      message.reportValidity();
      return;
    }
    button.disabled = true;
    button.textContent = 'Continuing to Formspree…';
    // Keep the words until a confirmation page says they arrived: the device draft is
    // marked pending, and this tab keeps a copy for the "make it official" step.
    saveDraft(true);
    sent = true;
    store.set('kr-sent-letter', { text: message.value, at: Date.now() }, sessionStorage);
    store.set('kr-sent-kind', { kind: 'letter', at: Date.now() }, sessionStorage);
  });
  window.addEventListener('pageshow', () => {
    button.disabled = false;
    button.textContent = 'Send my letter';
    updateChoices();
    updatePreview();
  });
  updateChoices();
  updatePreview();

  const boardStatus = document.getElementById('letters-message');
  const board = document.getElementById('letters-list');
  function openLinkedLetter() {
    const id = location.hash.slice(1);
    if (!/^letter-[a-f0-9]{12}$/.test(id)) return;
    const article = document.getElementById(id);
    if (!article) return;
    const story = article.querySelector('details');
    if (story) story.open = true;
    article.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  window.addEventListener('hashchange', openLinkedLetter);
  fetch('letters.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('Letters unavailable'); return response.json(); })
    .then(data => {
      const allowed = ['id', 'body', 'displayName', 'date', 'review'];
      if (!data || Object.keys(data).sort().join(',') !== 'letters,version' || data.version !== 1 || !Array.isArray(data.letters)) throw new Error('Invalid letters');
      const seen = new Set();
      if (data.letters.some(item => !item || Object.values(item).some(value => typeof value !== 'string') || Object.keys(item).some(key => !allowed.includes(key)) || typeof item.id !== 'string' || !/^letter-[a-f0-9]{12}$/.test(item.id) || typeof item.body !== 'string' || item.body.length < 10 || item.body.length > 30000 || typeof item.displayName !== 'string' || !item.displayName.trim() || item.displayName.length > 60 || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || !['Human reviewed', 'AI screened'].includes(item.review))) throw new Error('Invalid letter');
      data.letters.forEach(item => {
        if (seen.has(item.id) || Number.isNaN(Date.parse(item.date))) throw new Error('Invalid letter');
        seen.add(item.id);
      });
      const fragment = document.createDocumentFragment();
      data.letters.forEach(item => {
        const article = document.createElement('article');
        article.className = 'suggestion-card letter-card';
        article.id = item.id;
        const author = document.createElement('h3');
        author.className = 'public-author';
        author.textContent = item.displayName;
        const meta = document.createElement('div');
        meta.className = 'suggestion-meta';
        const review = document.createElement('span');
        review.textContent = item.review + ' · Opinion';
        const date = document.createElement('time');
        date.dateTime = item.date;
        date.textContent = new Date(item.date + 'T12:00:00Z').toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
        meta.append(review, date);
        const body = document.createElement('p');
        body.className = 'suggestion-body';
        body.textContent = item.body;
        const removal = document.createElement('a');
        removal.href = 'feedback.html?kind=privacy&letter=' + encodeURIComponent(item.id) + '#feedback-form';
        removal.textContent = 'Report this letter or request removal';
        article.append(author, meta);
        if (item.body.length > 1200) {
          const excerpt = document.createElement('p');
          excerpt.className = 'letter-excerpt';
          const opening = item.body.replace(/\s+/g, ' ').trim().slice(0, 360);
          const wordEnd = opening.lastIndexOf(' ');
          excerpt.textContent = (wordEnd > 270 ? opening.slice(0, wordEnd) : opening) + '…';
          const story = document.createElement('details');
          story.className = 'letter-story';
          const summary = document.createElement('summary');
          summary.textContent = 'Read full letter';
          summary.setAttribute('aria-label', 'Read full letter by ' + item.displayName);
          const collapse = document.createElement('button');
          collapse.type = 'button';
          collapse.className = 'letter-collapse';
          collapse.textContent = 'Show less';
          collapse.setAttribute('aria-label', 'Show less of the letter by ' + item.displayName);
          collapse.addEventListener('click', () => {
            story.open = false;
            summary.focus({preventScroll: true});
            summary.scrollIntoView({block: 'center', behavior: 'instant'});
          });
          story.addEventListener('toggle', () => {
            summary.textContent = story.open ? 'Show less' : 'Read full letter';
            summary.setAttribute('aria-label', (story.open ? 'Show less of the letter by ' : 'Read full letter by ') + item.displayName);
            if (!story.open) summary.scrollIntoView({block: 'center', behavior: 'instant'});
          });
          story.append(summary, body, collapse);
          article.append(excerpt, story);
        } else {
          article.append(body);
        }
        article.append(removal);
        fragment.append(article);
      });
      board.replaceChildren(fragment);
      boardStatus.textContent = data.letters.length ? data.letters.length + ' published letter' + (data.letters.length === 1 ? '' : 's') + '.' : 'No community letters have been published yet. You can submit yours for review above.';
      openLinkedLetter();
    })
    .catch(() => { boardStatus.textContent = 'The letters could not be loaded. Please reload to try again. You can still send a letter for private review above.'; });
})();
