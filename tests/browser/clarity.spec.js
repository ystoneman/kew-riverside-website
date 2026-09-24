const { test, expect, expectStillArrival } = require('./fixtures');
async function activate(locator, hasTouch) { if (hasTouch) await locator.tap(); else await locator.click(); }

test('Options: the Parent plan arrives at conclusions before the option index', async ({ page, hasTouch }) => {
  await page.goto('/proposal.html#plan-keep-going');
  await activate(page.locator('#plan-keep-going a[href="options.html#options"]'), hasTouch);
  await page.waitForURL('**/options.html#options', { waitUntil: 'load' });
  await expectStillArrival(page, '#options');
  await expect(page.locator('#options-findings-title')).toBeInViewport();
  const findings = page.locator('.options-takeaways');
  await expect(findings.locator('article')).toHaveCount(3);
  await expect(findings).toContainText('willing delivery partner');
  await expect(findings).toContainText('not confirmed enrolments');
  await expect(page.locator('.options-scope')).toContainText('not proven solutions');
  expect(await findings.evaluate(el => Boolean(el.compareDocumentPosition(document.getElementById('options-navigation')) & Node.DOCUMENT_POSITION_FOLLOWING))).toBe(true);
  for (const card of await page.locator('#options .action-card').all()) {
    await expect(card.locator('.option-step')).toBeVisible();
    await expect(card.locator('.option-limit')).toBeVisible();
    expect(await card.locator('.option-step').evaluate(el => el.closest('details') === null)).toBe(true);
  }
  await expect(page.locator('.options-immediate a[href*="docs.google.com/forms"]')).toBeVisible();
});

test('Options: optional funding questions remain reachable through shared links and Back', async ({ page, hasTouch }) => {
  await page.goto('/options.html#option-crowdfunding');
  const questions = page.locator('.funding-questions');
  await expect(questions).not.toHaveAttribute('open', '');
  await expect(page.locator('.funding-status')).toContainText('No donations or pledges');
  await expect(page.locator('.funding-status')).toContainText('no recipient is agreed');
  await activate(questions.locator(':scope > summary'), hasTouch);
  await expect(questions).toHaveAttribute('open', '');
  await expect(questions.locator('li[id]')).toHaveCount(8);
  await questions.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  await expect(questions).not.toHaveAttribute('open', '');
  await expect(questions.locator(':scope > summary')).toBeFocused();
  await page.goto('/options.html#crowdfunding-recipient');
  await expectStillArrival(page, '#crowdfunding-recipient');
  await expect(questions).toHaveAttribute('open', '');
  await activate(page.locator('#crowdfunding-recipient a'), hasTouch);
  await expect(page.locator('input[name="kind"][value="crowdfunding"]')).toBeChecked();
  await page.goBack();
  await expect(page.locator('#crowdfunding-recipient')).toBeInViewport();
  await expect(questions).toHaveAttribute('open', '');
});

test('Options: a failed enhancement leaves funding questions available', async ({ page }) => {
  await page.route('**/options.js*', route => route.fulfill({ status: 503, contentType: 'application/javascript', headers: { 'x-test-fixture': 'intentional-error' }, body: '' }));
  await page.goto('/options.html#crowdfunding-recipient');
  await expect(page.locator('.funding-questions')).toHaveAttribute('open', '');
  await expect(page.locator('#crowdfunding-recipient')).toBeVisible();
  await expect(page.locator('#crowdfunding-recipient a')).toBeVisible();
});

test('Proposal: immediate actions and stage dates stay outside optional detail', async ({ page }) => {
  await page.goto('/proposal.html');
  await expect(page.locator('.proposal-actions')).toContainText('You can respond now');
  await expect(page.locator('.proposal-actions a')).toBeVisible();
  await expect(page.locator('.parent-plan-lead')).toContainText('optional');
  await expect(page.locator('.parent-reassurance a[href="faq.html#school-places"]')).toBeVisible();
  for (const stage of await page.locator('#future-timeline > li').all()) {
    await expect(stage.locator(':scope > h3')).toBeVisible();
    await expect(stage.locator(':scope > .stage-label')).toBeVisible();
    expect(await stage.evaluate(el => el.closest('details') === null)).toBe(true);
  }
  for (const id of ['parent-plan', 'school-meeting', 'question-budget', 'who-decides', 'decision-record']) {
    await page.goto('/proposal.html#' + id);
    await expect(page.locator('#' + id)).toBeInViewport();
  }
});

test('Proposal: fuller roles and decision records open with keyboard and touch', async ({ page, hasTouch }) => {
  await page.goto('/proposal.html#who-decides');
  for (const id of ['roles-detail', 'decision-record-detail']) {
    const detail = page.locator('#' + id);
    await expect(detail).not.toHaveAttribute('open', '');
    await activate(detail.locator(':scope > summary'), hasTouch);
    await expect(detail).toHaveAttribute('open', '');
    await expect(detail.locator('a').first()).toBeVisible();
    await detail.locator(':scope > summary').focus();
    await page.keyboard.press('Enter');
    await expect(detail).not.toHaveAttribute('open', '');
    await expect(detail.locator(':scope > summary')).toBeFocused();
  }
});

test('Clarity pages: enlarged main text reflows at a narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const url of ['/options.html#options', '/proposal.html#timetable', '/lessons.html#key-lessons']) {
    await page.goto(url);
    await page.evaluate(() => {
      const nodes = [...document.querySelectorAll('main h1,main h2,main h3,main h4,main p,main summary,main a,main span,main dt,main dd')];
      const sizes = nodes.map(el => parseFloat(getComputedStyle(el).fontSize));
      nodes.forEach((el, i) => el.style.fontSize = `${sizes[i] * 2}px`);
    });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await expect(page.locator('main h2').first()).toBeVisible();
  }
});
