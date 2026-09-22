const { test, expect, expectDestination } = require('./fixtures');

const questions = {
  'school-places': ['choose-school', 'school-choice', 'apply-during-consultation'],
  money: ['deficit-meaning', 'deficit-build-up', 'crowdfunding-target'],
  decisions: ['decided', 'next-meeting', 'respond-deadline'],
  'taking-part': ['useful-response', 'letters-official', 'share-evidence'],
};
const questionIds = Object.values(questions).flat();
const entryRoutes = [
  'index.html#options',
  'proposal.html#timetable',
  'understand.html',
  'index.html#records',
  'feedback.html?kind=evidence#feedback-form',
  'faq.html#school-places',
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

test('Parent plan: homepage invitation and meeting details both lead to preparation', async ({ page, hasTouch }) => {
  await page.clock.setFixedTime(new Date('2026-09-22T12:00:00Z'));
  await page.goto('/index.html');
  const invitation = page.locator('#meeting-invitation');
  await expect(invitation).toContainText('Prepare. Participate. Make a difference.');
  await expect(invitation.locator('.meeting-plan-steps > li')).toHaveText([
    'Prepare together', 'Attend the meeting', 'Respond with evidence',
  ]);
  await activate(invitation.getByRole('link', { name: 'Parent action plan', exact: true }), hasTouch);
  await expect(page).toHaveURL(/proposal\.html#parent-plan$/);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
  await expect(page.locator('#parent-plan')).toContainText('Closure is proposed, not decided.');
  for (const [name, id] of [['PTA prep times', 'prep-sessions'], ['Letters & videos', 'plan-share'], ['Council meeting', 'plan-attend'], ['Your response', 'plan-respond'], ['More ways to help', 'plan-keep-going']]) {
    await activate(page.getByRole('navigation', { name: 'Choose a parent action' }).getByRole('link', { name, exact: true }), hasTouch);
    await expect(page).toHaveURL(new RegExp('#' + id + '$'));
    await expect(page.locator('#' + id)).toBeInViewport();
  }
  await page.goto('/proposal.html#school-meeting');
  await activate(page.locator('#school-meeting a[href="#parent-plan"]'), hasTouch);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
});

test('Parent plan: correct PTA dates, independent video permission and official deadline stay distinct', async ({ page, hasTouch, baseURL }) => {
  await page.goto('/proposal.html#parent-plan');
  const prep = page.locator('#prep-sessions');
  await expect(prep).toContainText('school grounds');
  await expect(prep.locator('.prep-session-dates > li').first()).toContainText('Friday 25 September');
  await expect(prep.locator('.prep-session-dates > li').first()).toContainText('9am or 3.20pm');
  await expect(prep.locator('.prep-session-dates > li').last()).toContainText('Monday 28 September');
  await expect(prep.locator('.prep-session-dates > li').last()).toContainText('9am');
  await expect(prep).toContainText('separate from the council meeting');
  await expect(page.locator('#plan-attend')).toContainText('Tuesday 29 September · 3.30pm');
  await expect(page.locator('#plan-respond')).toContainText('You can respond now if you are ready.');
  await expect(page.locator('#plan-respond')).toContainText('16 October');
  await expect(page.locator('#plan-respond')).toContainText('does not replace your own official response');
  await expect(page.locator('#plan-share')).toContainText('only with your separate permission');
  await expect(page.locator('.parent-reassurance')).toContainText('Keep following any admissions or SEND instructions');
  for (const href of ['letters.html', 'videos.html', 'feedback.html?kind=evidence#feedback-form', 'feedback.html?kind=meeting#feedback-form', 'index.html#options']) {
    await page.goto('/proposal.html#parent-plan');
    await activate(page.locator(`#parent-plan a[href="${href}"]`), hasTouch);
    await expectDestination(page, href, baseURL);
  }
  await page.goto('/proposal.html#plan-respond');
  const official = 'https://docs.google.com/forms/d/e/1FAIpQLSda5oPsdUlrJkf6vACC_AjvXFR6-ki3iBymNIF5BAWNxf85xQ/viewform';
  await page.route(official, route => route.fulfill({ contentType: 'text/html', body: '<h1>Intercepted official consultation</h1>' }));
  await activate(page.locator('#plan-respond').getByRole('link', { name: /Send your official response/ }), hasTouch);
  await expect(page).toHaveURL(official);
  await expect(page.getByRole('heading')).toHaveText('Intercepted official consultation');
});

test('Parent plan: additional actions are optional native details without an invented petition link', async ({ page, hasTouch }) => {
  await page.goto('/proposal.html#plan-keep-going');
  const more = page.locator('#more-parent-actions');
  await expect(more).not.toHaveAttribute('open', '');
  await activate(more.locator('summary'), hasTouch);
  await expect(more).toHaveAttribute('open', '');
  await expect(more.getByRole('heading', { level: 4 })).toHaveCount(4);
  await expect(more).toContainText('in their own words');
  await expect(more).toContainText('A verified link and its wording are not yet available here');
  await expect(more.getByRole('link', { name: /petition/i })).toHaveCount(0);
  await more.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(more).not.toHaveAttribute('open', '');
  await expect(more.locator('summary')).toBeFocused();
});

test('FAQ: action comes first while school-place answers remain searchable and directly linked', async ({ page, hasTouch }) => {
  await page.goto('/faq.html');
  expect(await page.locator('.faq-group').evaluateAll(groups => groups.map(group => group.id))).toEqual(['taking-part', 'decisions', 'money', 'school-places']);
  expect(await page.locator('#school-places details').evaluateAll(answers => answers.map(answer => answer.id))).toEqual(['apply-during-consultation', 'school-choice', 'choose-school']);
  await expect(page.locator('#choose-school > summary')).toHaveText('If closure is approved, when would we need to arrange another school?');
  await page.getByRole('searchbox', { name: 'Find an answer', exact: true }).fill('choose another school');
  await expect(page.locator('#choose-school')).toBeVisible();
  await expect(page.locator('#choose-school')).toHaveAttribute('open', '');
  await expect(page.locator('#choose-school')).toContainText('Closure has not been decided.');
  await expect(page.locator('#choose-school')).toContainText('normal admissions');
  await page.goto('/faq.html#choose-school');
  await expect(page.locator('#choose-school')).toHaveAttribute('open', '');
  await expect(page.locator('#choose-school')).toBeInViewport();
  await activate(page.locator('#choose-school a[href="proposal.html#parent-plan"]'), hasTouch);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
  await page.goto('/index.html');
  const help = page.locator('#quick-answers details').filter({ hasText: 'What can we do together now?' });
  await activate(help.locator('summary'), hasTouch);
  await activate(help.locator('a[href="proposal.html#parent-plan"]'), hasTouch);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
});


test('Parent plan: a named homepage shortcut is visible before scrolling', async ({ page, hasTouch }) => {
  await page.setViewportSize({ width: hasTouch ? 320 : 1440, height: hasTouch ? 568 : 1000 });
  await page.goto('/index.html');
  const shortcut = page.getByRole('link', { name: 'Parent action plan', exact: true }).filter({ has: page.locator('strong') });
  await expect(shortcut).toBeInViewport({ ratio: 1 });
  await expect(shortcut).toHaveAttribute('href', 'proposal.html#parent-plan');
  await activate(shortcut, hasTouch);
  await expect(page).toHaveURL(/proposal\.html#parent-plan$/);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
});

test('Parent plan: the shared navigation names the plan at desktop and mobile sizes', async ({ page, hasTouch }) => {
  for (const width of [390, 1101, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/feedback.html');
    const navigation = width <= 1100 ? page.locator('.mobile-menu') : page.locator('.desktop-explore');
    if (width <= 1100) await activate(navigation.locator('summary'), hasTouch);
    const link = navigation.getByRole('link', { name: 'Parent action plan', exact: true });
    await expect(link).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const box = await link.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await activate(link, hasTouch);
    await expect(page).toHaveURL(/proposal\.html#parent-plan$/);
    await expect(page.locator('#parent-plan-title')).toBeInViewport();
  }
});
