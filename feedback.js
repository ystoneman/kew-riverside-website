'use strict';
(() => {
  const form = document.getElementById('feedback-form');
  const message = document.getElementById('message');
  const kind = document.getElementById('kind');
  const displayName = document.getElementById('display-name');
  const permission = document.getElementById('allow-public');
  const button = form.querySelector('button[type="submit"]');
  const reference = document.getElementById('feedback-reference');
  if (globalThis.crypto && crypto.randomUUID) {
    reference.value = 'KR-' + crypto.randomUUID();
    document.getElementById('reference-display').textContent = reference.value;
    document.getElementById('reference-note').hidden = false;
  }
  const params = new URLSearchParams(location.search);
  const fundingQuestions = {
    'funding-needed': 'the funding needed and the recovery period',
    'council-assessment': 'how the school and council would assess a funded plan',
    'sustainability': 'making the school sustainable after initial funding',
    'recipient': 'who could receive and manage contributions',
    'outreach': 'reaching supporters beyond current parents',
    'examples': 'lessons from comparable school rescue campaigns',
    'appeal-terms': 'conditions and accountability for a future appeal',
    'expertise': 'expertise that could help assess this option'
  };
  const questionId = params.get('question');
  const fundingSubject = Object.prototype.hasOwnProperty.call(fundingQuestions, questionId)
    ? fundingQuestions[questionId] : 'assessing whether community funding could work';
  const fundingPrompt = 'Crowdfunding — ' + fundingSubject + '\n\nMy idea or relevant experience:\n\nSupporting public evidence, if available:\n';
  const isPrivateKind = () => ['privacy', 'crowdfunding'].includes(kind.value);
  function updateKind() {
    const privateOnly = isPrivateKind();
    const funding = kind.value === 'crowdfunding';
    if (privateOnly) permission.checked = false;
    permission.disabled = privateOnly;
    displayName.disabled = privateOnly;
    document.getElementById('display-name-field').hidden = privateOnly;
    document.getElementById('publication-choice').hidden = privateOnly;
    document.getElementById('public-preview').hidden = privateOnly;
    document.getElementById('funding-context').hidden = !funding;
    document.getElementById('funding-subject').textContent = 'Crowdfunding — ' + fundingSubject + '.';
    document.getElementById('feedback-title').textContent = funding ? 'Crowdfunding & funding ideas' : 'Website feedback';
    const privateNote = document.getElementById('privacy-only');
    privateNote.hidden = !privateOnly;
    privateNote.textContent = funding
      ? 'Funding ideas stay private for Yann to review. Add your email only if you would like a reply.'
      : 'Privacy and removal requests always stay private.';
    if (!button.disabled) button.textContent = funding ? 'Send private funding feedback' : 'Send feedback';
  }
  // Apply links only to a pristine form; restored or already-entered answers win.
  const pristine = kind.value === 'suggestion' && !permission.checked &&
    ![message, displayName, document.getElementById('source'), document.getElementById('email')].some(field => field.value);
  if (pristine && params.get('kind') === 'crowdfunding') {
    kind.value = 'crowdfunding';
    message.value = fundingPrompt;
  } else if (pristine && params.get('kind') === 'privacy') {
    kind.value = 'privacy';
    const letterId = params.get('letter');
    const publicId = params.get('suggestion');
    if (letterId && /^letter-[a-f0-9]{12}$/.test(letterId)) {
      message.value = 'Please review or remove letter ' + letterId + '.\n\n';
    } else if (publicId && /^idea-[a-f0-9]{12}$/.test(publicId)) {
      message.value = 'Please review or remove suggestion ' + publicId + '.\n\n';
    }
  }
  kind.addEventListener('change', updateKind);
  updateKind();
  function updateCount() {
    document.getElementById('preview-name').textContent = displayName.value.trim() || 'Anonymous';
    document.getElementById('preview-body').textContent = message.value.trim() || 'Your message will appear here.';
    document.getElementById('message-count').textContent = message.value.length.toLocaleString('en-GB') + ' / 3,000 characters';
  }
  message.addEventListener('input', updateCount);
  displayName.addEventListener('input', updateCount);
  updateCount();
  form.addEventListener('submit', event => {
    updateKind();
    if (kind.value === 'crowdfunding' && message.value.trim() === fundingPrompt.trim()) {
      event.preventDefault();
      message.setCustomValidity('Please add your idea, experience or concern before sending.');
      message.reportValidity();
      return;
    }
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
    updateKind();
    updateCount();
  });

  const boardMessage = document.getElementById('board-message');
  const board = document.getElementById('suggestions-list');
  fetch('suggestions.json', {cache: 'no-store'})
    .then(response => { if (!response.ok) throw new Error('Board unavailable'); return response.json(); })
    .then(data => {
      if (!data || Object.keys(data).sort().join(',') !== 'suggestions,version' || data.version !== 1 || !Array.isArray(data.suggestions)) throw new Error('Invalid board');
      const items = data.suggestions;
      const required = ['body', 'date', 'id', 'review', 'status'];
      const seen = new Set();
      items.forEach(item => {
        if (!item || required.some(key => typeof item[key] !== 'string') || Object.keys(item).some(key => !required.includes(key) && key !== 'displayName') || !/^idea-[a-f0-9]{12}$/.test(item.id) || seen.has(item.id) || item.body.trim().length < 10 || item.body.length > 3000 || !/^\d{4}-\d{2}-\d{2}$/.test(item.date) || Number.isNaN(Date.parse(item.date)) || item.status !== 'Received' || item.review !== 'AI reviewed' || (item.displayName !== undefined && (typeof item.displayName !== 'string' || !item.displayName.trim() || item.displayName.length > 60))) throw new Error('Invalid suggestion');
        seen.add(item.id);
      });
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
        const author = document.createElement('p');
        author.className = 'public-author';
        author.textContent = item.displayName || 'Anonymous';
        article.append(meta, author, body, removal);
        fragment.append(article);
      });
      board.replaceChildren(fragment);
      boardMessage.textContent = items.length ? items.length + ' reviewed suggestion' + (items.length === 1 ? '' : 's') + '.' : 'No suggestions have been published yet. You can be the first to suggest an improvement.';
    })
    .catch(() => { boardMessage.textContent = 'The suggestions board could not be loaded. Please reload the page to try again. You can still send private feedback above.'; });
})();
