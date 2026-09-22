'use strict';
(() => {
  const form = document.getElementById('letter-form');
  const message = document.getElementById('message');
  const displayName = document.getElementById('display-name');
  const publicPermission = document.getElementById('allow-public');
  const councilPermission = document.getElementById('allow-council');
  const councilDetails = document.getElementById('council-details');
  const privateFields = [...councilDetails.querySelectorAll('input')];
  const button = form.querySelector('button[type="submit"]');
  if (globalThis.crypto && crypto.randomUUID) {
    const reference = 'KR-' + crypto.randomUUID();
    document.getElementById('letter-reference').value = reference;
    document.getElementById('reference-display').textContent = reference;
    document.getElementById('reference-note').hidden = false;
  }
  function updatePreview() {
    document.getElementById('preview-name').textContent = displayName.value.trim() || 'Anonymous';
    document.getElementById('preview-body').textContent = message.value.trim() || 'Your letter will appear here.';
    document.getElementById('message-count').textContent = message.value.length.toLocaleString('en-GB') + ' / ' + message.maxLength.toLocaleString('en-GB') + ' characters';
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
  message.addEventListener('input', updatePreview);
  displayName.addEventListener('input', updatePreview);
  publicPermission.addEventListener('change', updateChoices);
  councilPermission.addEventListener('change', updateChoices);
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
  });
  window.addEventListener('pageshow', () => {
    button.disabled = false;
    button.textContent = 'Send my letter';
    updateChoices();
    updatePreview();
  });
  updateChoices();
  updatePreview();

  const status = document.getElementById('letters-message');
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
      status.textContent = data.letters.length ? data.letters.length + ' published letter' + (data.letters.length === 1 ? '' : 's') + '.' : 'No community letters have been published yet. You can submit yours for review above.';
      openLinkedLetter();
    })
    .catch(() => { status.textContent = 'The letters could not be loaded. Please reload to try again. You can still send a letter for private review above.'; });
})();
