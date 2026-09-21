'use strict';
(() => {
  const form = document.getElementById('feedback-form');
  const message = document.getElementById('message');
  const kind = document.getElementById('kind');
  const permission = document.getElementById('allow-public');
  const button = form.querySelector('button[type="submit"]');
  const reference = document.getElementById('feedback-reference');
  if (globalThis.crypto && crypto.randomUUID) {
    reference.value = 'KR-' + crypto.randomUUID();
    document.getElementById('reference-display').textContent = reference.value;
    document.getElementById('reference-note').hidden = false;
  }
  function updateKind() {
    const privateOnly = kind.value === 'privacy';
    if (privateOnly) permission.checked = false;
    permission.disabled = privateOnly;
    document.getElementById('privacy-only').hidden = !privateOnly;
  }
  const params = new URLSearchParams(location.search);
  if (params.get('kind') === 'privacy') {
    kind.value = 'privacy';
    const publicId = params.get('suggestion');
    if (publicId && /^idea-[a-f0-9]{12}$/.test(publicId)) message.value = 'Please review or remove suggestion ' + publicId + '.\n\n';
  }
  kind.addEventListener('change', updateKind);
  updateKind();
  function updateCount() {
    document.getElementById('message-count').textContent = message.value.length.toLocaleString('en-GB') + ' / 3,000 characters';
  }
  message.addEventListener('input', updateCount);
  updateCount();
  form.addEventListener('submit', event => {
    if (message.value.trim().length < 10) {
      event.preventDefault();
      message.setCustomValidity('Please enter at least 10 characters of feedback.');
      message.reportValidity();
      return;
    }
    button.disabled = true;
    button.textContent = 'Continuing to Formspree…';
  });
  message.addEventListener('input', () => message.setCustomValidity(''));
  window.addEventListener('pageshow', () => {
    button.disabled = false;
    button.textContent = 'Send feedback';
  });

  const boardMessage = document.getElementById('board-message');
  const board = document.getElementById('suggestions-list');
  fetch('suggestions.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('Board unavailable'); return response.json(); })
    .then(data => {
      if (data.version !== 1 || !Array.isArray(data.suggestions)) throw new Error('Invalid board');
      const items = data.suggestions;
      if (items.some(item => !item || !/^idea-[a-f0-9]{12}$/.test(item.id) || typeof item.body !== 'string' || item.body.length > 3000 || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || item.status !== 'Received' || item.review !== 'AI reviewed')) throw new Error('Invalid suggestion');
      const fragment = document.createDocumentFragment();
      items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'suggestion-card';
        article.id = item.id;
        const meta = document.createElement('div');
        meta.className = 'suggestion-meta';
        const status = document.createElement('span');
        status.className = 'suggestion-status';
        status.textContent = item.status;
        const review = document.createElement('span');
        review.textContent = item.review;
        const date = document.createElement('time');
        date.dateTime = item.date;
        date.textContent = new Date(item.date + 'T12:00:00Z').toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
        meta.append(status, review, date);
        const body = document.createElement('p');
        body.className = 'suggestion-body';
        body.textContent = item.body;
        const removal = document.createElement('a');
        removal.href = 'feedback.html?kind=privacy&suggestion=' + encodeURIComponent(item.id) + '#feedback-form';
        removal.textContent = 'Report this suggestion or request removal';
        article.append(meta, body, removal);
        fragment.append(article);
      });
      board.replaceChildren(fragment);
      boardMessage.textContent = items.length ? items.length + ' reviewed suggestion' + (items.length === 1 ? '' : 's') + '.' : 'No suggestions have been published yet. You can be the first to suggest an improvement.';
    })
    .catch(() => { boardMessage.textContent = 'The suggestions board could not be loaded. Please reload the page to try again. You can still send private feedback above.'; });
})();
