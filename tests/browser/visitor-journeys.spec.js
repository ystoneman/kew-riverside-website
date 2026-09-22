const { test, expect, expectDestination } = require('./fixtures');

const questions = {
  'school-places': ['choose-school', 'school-choice', 'apply-during-consultation'],
  money: ['deficit-meaning', 'deficit-build-up', 'crowdfunding-target'],
  decisions: ['decided', 'next-meeting', 'respond-deadline'],
  'taking-part': ['useful-response', 'letters-official', 'share-evidence'],
};
const questionIds = Object.values(questions).flat();
const entryRoutes = [
  'faq.html#school-places',
  'proposal.html#timetable',
  'understand.html',
  'index.html#options',
  'index.html#records',
  'feedback.html?kind=evidence#feedback-form',
];

async function activate(locator, hasTouch) {
  if (hasTouch) await locator.tap();
  else await locator.click();
}

test('Homepage: responsive copy keeps words separated on mobile and desktop', async ({ page }) => {
  const originalViewport = page.viewportSize();
  try {
    for (const width of [390, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto('/index.html');
      const heading = page.locator('#brief-title');
      await expect(heading).toBeVisible();
      expect((await heading.innerText()).replace(/\s+/g, ' ').trim(), `Rendered heading at ${width}px`).toBe('We moved here for this school.');
      for (const [selector, wording] of [
        ['.discovery-heading > p', 'the evidence or a way'],
        ['#next-dates > p', 'proposed. No final'],
        ['#visit-school .visit-school-action > p', 'page. Tour invitation'],
      ]) {
        const copy = page.locator(selector);
        await expect(copy).toBeVisible();
        expect((await copy.innerText()).replace(/\s+/g, ' ').trim(), `${selector} rendered at ${width}px`).toContain(wording);
      }
    }
  } finally {
    if (originalViewport) await page.setViewportSize(originalViewport);
  }
});

test('Homepage: the meeting invitation appears before the hero with its date, public source and details', async ({ page, hasTouch }) => {
  await page.clock.setFixedTime(new Date('2026-09-22T12:00:00Z'));
  await page.goto('/index.html');
  const invitation = page.locator('main #meeting-invitation');
  await expect(invitation).toBeVisible();
  await expect(invitation.getByRole('heading', { name: 'Come and speak with the council.', exact: true })).toBeVisible();
  expect((await invitation.locator('time').innerText()).replace(/\s+/g, ' ')).toContain('Tuesday 29 September 2026');
  await expect(invitation).toContainText(/3[.:]30\s*p\.?m\.?/i);
  await expect(invitation).toContainText('Kew Riverside');
  await expect(invitation).toContainText('Meet local authority representatives');
  await expect(invitation).toContainText('share your views in person');
  await expect(invitation.locator('blockquote, .meeting-attribution')).toHaveCount(0);
  const position = await invitation.boundingBox();
  const hero = await page.locator('#top').boundingBox();
  expect(position.y + position.height).toBeLessThanOrEqual(hero.y + 1);
  await expect(invitation.locator('a[href="https://www.richmond.gov.uk/media/fxhbilws/kew_riverside_consultation_leaflet.pdf#page=8"]')).toBeVisible();
  await activate(invitation.locator('a[href="proposal.html#school-meeting"]'), hasTouch);
  await expect(page).toHaveURL(/proposal\.html#school-meeting$/);
  await expect(page.locator('#school-meeting')).toBeInViewport();
});

test.describe('Meeting invitation uses the London calendar date', () => {
  // A visitor outside the UK must still see the label for the school's day.
  test.use({ timezoneId: 'America/Los_Angeles' });
  for (const [date, label] of [
    ['2026-09-22T12:00:00Z', 'Next week’s meeting'],
    ['2026-09-28T12:00:00Z', 'Tomorrow’s meeting'],
    ['2026-09-29T12:00:00Z', 'Today’s meeting'],
    ['2026-09-30T12:00:00Z', null],
    ['2026-09-29T23:30:00Z', null],
  ]) {
    test(`${date}: ${label || 'invitation is over'}`, async ({ page }) => {
      await page.clock.setFixedTime(new Date(date));
      await page.goto('/index.html');
      const invitation = page.locator('#meeting-invitation');
      await expect(invitation).toHaveCount(1);
      if (label) {
        await expect(invitation).toBeVisible();
        await expect(page.locator('#meeting-relative')).toHaveText(label);
      } else {
        await expect(invitation).toBeHidden();
        await page.goto('/proposal.html#school-meeting');
        await expect(page.locator('#school-meeting')).toBeVisible();
        await expect(page.locator('#school-meeting')).toContainText(/29\s+September\s+2026/);
      }
    });
  }
});

test('Homepage: six clear entry routes lead to answers, dates, evidence and participation', async ({ page, hasTouch, baseURL }) => {
  await page.goto('/index.html');
  const routes = page.locator('#find-your-way .route-card');
  expect(await routes.evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(entryRoutes);
  for (const href of entryRoutes) {
    await page.goto('/index.html');
    const link = page.locator(`#find-your-way a[href="${href}"]`);
    await expect(link).toHaveAccessibleName(/\S/);
    await activate(link, hasTouch);
    await expectDestination(page, href, baseURL);
    if (href.includes('kind=evidence')) {
      await expect(page.locator('#kind')).toHaveValue('evidence');
      await expect(page.locator('#message')).toHaveValue('');
      await expect(page.locator('#allow-public')).not.toBeChecked();
    }
  }
});

test('Homepage: the next dates lead to the school meeting and official response route', async ({ page, hasTouch }) => {
  await page.goto('/index.html');
  const notice = page.locator('#next-dates');
  await expect(notice).toBeVisible();
  await expect(notice).toContainText(/29\s+Sep(?:tember)?/i);
  await expect(notice).toContainText(/3[.:]30\s*p\.?m\.?/i);
  await expect(notice).toContainText(/16\s+Oct(?:ober)?/i);
  const official = notice.locator('a[href^="https://"]');
  await expect(official).toHaveCount(1);
  await expect(official).toHaveAttribute('href', 'https://docs.google.com/forms/d/e/1FAIpQLSda5oPsdUlrJkf6vACC_AjvXFR6-ki3iBymNIF5BAWNxf85xQ/viewform');
  await activate(notice.locator('a[href="proposal.html#school-meeting"]'), hasTouch);
  await expect(page).toHaveURL(/proposal\.html#school-meeting$/);
  await expect(page.locator('#school-meeting')).toBeInViewport();
  await expect(page.locator('#school-meeting')).toContainText(/29\s+September/i);
  await activate(page.locator('#school-meeting a[href="feedback.html?kind=meeting#feedback-form"]'), hasTouch);
  await expect(page).toHaveURL(/feedback\.html\?kind=meeting#feedback-form$/);
  await expect(page.locator('#kind')).toHaveValue('meeting');
  await expect(page.locator('#meeting-context')).toBeVisible();
  await expect(page.locator('#meeting-context')).toContainText('does not put it on a meeting agenda or send it to the council');
  await expect(page.locator('#allow-public')).not.toBeChecked();
});

test('FAQ: every answer is a readable native disclosure with a useful destination', async ({ page, hasTouch }) => {
  await page.goto('/faq.html');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('main details')).toHaveCount(questionIds.length);
  for (const [section, ids] of Object.entries(questions)) {
    for (const id of ids) {
      const answer = page.locator(`#${section} details#${id}`);
      const summary = answer.locator(':scope > summary');
      await expect(answer).not.toHaveAttribute('open', '');
      await expect(summary).toHaveAccessibleName(/\S/);
      await activate(summary, hasTouch);
      await expect(answer).toHaveAttribute('open', '');
      await expect(answer.locator('p').first()).toBeVisible();
      expect(await answer.locator('a[href]').count()).toBeGreaterThan(0);
      await activate(summary, hasTouch);
      await expect(answer).not.toHaveAttribute('open', '');
    }
  }
});

test('FAQ: native answers work with the keyboard without moving focus', async ({ page }) => {
  await page.goto('/faq.html');
  const answer = page.locator('#choose-school');
  const summary = answer.locator(':scope > summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(answer).toHaveAttribute('open', '');
  await expect(answer.locator('p').first()).toBeVisible();
  await expect(summary).toBeFocused();
  await page.keyboard.press('Space');
  await expect(answer).not.toHaveAttribute('open', '');
  await expect(summary).toBeFocused();
});

test('FAQ: search finds and opens matching answers, handles no results and resets', async ({ page, hasTouch }) => {
  await page.goto('/faq.html');
  const query = page.getByRole('searchbox', { name: 'Find an answer', exact: true });
  await expect(page.locator('#faq-search')).toBeVisible();
  await expect(page.locator('#faq-empty')).toBeHidden();
  await query.fill('deficit');
  await expect(page.locator('#deficit-meaning')).toBeVisible();
  await expect(page.locator('#deficit-meaning')).toHaveAttribute('open', '');
  await expect(page.locator('#choose-school')).toBeHidden();
  expect(await page.locator('main details:visible').count()).toBeLessThan(questionIds.length);
  await expect(page.locator('#faq-results')).toContainText(/answer|result/i);
  await query.fill('zz-no-matching-answer-zz');
  await expect(page.locator('main details:visible')).toHaveCount(0);
  await expect(page.locator('#faq-empty')).toBeVisible();
  for (const section of Object.keys(questions)) await expect(page.locator('#' + section)).toBeHidden();
  await activate(page.getByRole('button', { name: 'Clear search', exact: true }), hasTouch);
  await expect(query).toHaveValue('');
  await expect(page.locator('#faq-empty')).toBeHidden();
  await expect(page.locator('main details:visible')).toHaveCount(questionIds.length);
  await expect(page.locator('main details[open]')).toHaveCount(0);
});

test('FAQ: a direct answer link opens the intended answer and brings it into view', async ({ page }) => {
  await page.goto('/faq.html#deficit-meaning');
  const answer = page.locator('#deficit-meaning');
  await expect(answer).toHaveAttribute('open', '');
  await expect(answer).toBeInViewport();
  await expect(answer.locator('p').first()).toBeVisible();
});

test('FAQ: answer permalinks survive closing an answer and browser history navigation', async ({ page, hasTouch }) => {
  await page.goto('/faq.html');
  const answer = page.locator('#deficit-meaning');
  const summary = answer.locator(':scope > summary');
  await activate(summary, hasTouch);
  const permalink = answer.getByRole('link', { name: /^Link to this answer:/ });
  await expect(permalink).toHaveAttribute('href', '#deficit-meaning');
  await activate(permalink, hasTouch);
  await expect(page).toHaveURL(/faq\.html#deficit-meaning$/);
  await expect(answer).toHaveAttribute('open', '');
  await activate(summary, hasTouch);
  await expect(answer).not.toHaveAttribute('open', '');
  await page.goBack();
  await expect(page).toHaveURL(/faq\.html$/);
  await page.goForward();
  await expect(page).toHaveURL(/faq\.html#deficit-meaning$/);
  await expect(answer).toHaveAttribute('open', '');
  await expect(answer).toBeInViewport();
});

test('FAQ: topic links restore answers hidden by a previous search', async ({ page, hasTouch }) => {
  await page.goto('/faq.html');
  await page.getByRole('searchbox', { name: 'Find an answer', exact: true }).fill('zz-no-matching-answer-zz');
  await expect(page.locator('#school-places')).toBeHidden();
  await activate(page.locator('a[href="#school-places"]'), hasTouch);
  await expect(page.locator('#faq-query')).toHaveValue('');
  await expect(page.locator('#school-places')).toBeVisible();
  await expect(page.locator('#school-places')).toBeInViewport();
  await expect(page.locator('main details:visible')).toHaveCount(questionIds.length);
  await expect(page.locator('#faq-empty')).toBeHidden();
});

test('Homepage: the earlier public record stays available behind its disclosure and direct link', async ({ page, hasTouch }) => {
  await page.goto('/index.html#timeline');
  const history = page.locator('#earlier-record');
  await expect(history).not.toHaveAttribute('open', '');
  await activate(history.locator(':scope > summary'), hasTouch);
  await expect(history).toHaveAttribute('open', '');
  await expect(history.locator('.timeline')).toBeVisible();
  await activate(history.locator('a[href="#source-inspection-2003"]'), hasTouch);
  await expect(page.locator('#source-inspection-2003')).toBeInViewport();
  await page.goto('/index.html#earlier-record');
  await expect(history).toHaveAttribute('open', '');
  await expect(history.locator('.timeline')).toBeVisible();
});

test('Proposal: the future timeline separates current participation from conditional later stages', async ({ page }) => {
  await page.goto('/proposal.html#timetable');
  const stages = page.locator('#future-timeline > li');
  expect(await stages.evaluateAll(items => items.map(item => item.dataset.stage))).toEqual([
    'consultation', 'meeting', 'proceed', 'notice', 'decision', 'implementation',
  ]);
  await expect(page.locator('#future-timeline')).toHaveJSProperty('tagName', 'OL');
  await expect(stages.nth(0)).toContainText(/16\s+October/i);
  await expect(stages.nth(1)).toHaveAttribute('id', 'school-meeting');
  await expect(stages.nth(1)).toContainText(/29\s+September/i);
  await expect(stages.nth(1)).toContainText(/3[.:]30\s*p\.?m\.?/i);
  await expect(stages.nth(0)).toContainText('21 September start is from the family letter');
  await expect(page.locator('#timetable .date-note')).toContainText('we have not located a public copy');
  await expect(page.locator('#timetable .timeline-provenance')).toContainText('planned and conditional');
  await expect(stages.nth(1).locator('a[href*="kew_riverside_consultation_leaflet.pdf#page=8"]')).toBeVisible();
  for (const name of ['proceed', 'notice', 'decision', 'implementation']) {
    await expect(page.locator(`#future-timeline [data-stage="${name}"]`)).toContainText(/if|could|would|propos|subject|indicative/i);
  }
  await expect(page.locator('#future-timeline [data-stage="implementation"]')).toContainText(/2027/);
  await expect(page.locator('#future-timeline [data-stage="implementation"] .stage-label')).toContainText('ONLY IF APPROVED');
  await expect(page.locator('#future-timeline [data-stage="decision"]')).toContainText('could still be rejected');
});
