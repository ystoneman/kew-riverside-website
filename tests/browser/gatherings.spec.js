const { test, expect, expectScrollSettled } = require('./fixtures');

// Independently pinned provider destination. Intercepted locally; no real response.
const interestForm = 'https://docs.google.com/forms/d/e/1FAIpQLSdPLQ2NoRq9it6wkuJWH0Stx9o35-Pn_qbKCZWV2C8TLm4Bbg/viewform';
async function fakeForm(page) {
  await page.route(interestForm, route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><meta name="viewport" content="width=device-width, initial-scale=1"><title>Local interest form</title><main><h1>Form handoff intercepted</h1></main>' }));
}
async function activate(locator, hasTouch) { if (hasTouch) await locator.tap(); else await locator.click(); }
async function nativeSection(page, href, hasTouch) {
  await activate(page.locator('.page-sections > summary'), hasTouch);
  await activate(page.locator(`.section-links a[href="${href}"]`), hasTouch);
}


for (const entry of ['/gatherings', '/gatherings/', '/gatherings/index.html', '/kew-riverside-website/gatherings/']) {
  test(`Gatherings: permanent flyer route ${entry} reaches the information page`, async ({ page }) => {
    await page.goto(entry);
    await expect(page).toHaveURL(/\/gatherings\.html$/);
    await expect(page.locator('h1')).toHaveText('Proposed parent gatherings');
    await expect(page.locator('#register')).toContainText('Not yet confirmed');
    await expect(page.locator('#interest-form')).toHaveAttribute('href', interestForm);
    await expect(page.locator('.gathering-card')).toHaveCount(3);
    await expect(page.locator('#november-gathering')).toContainText('not yet confirmed that Kew Riverside will be on the agenda');
    await expect(page.locator('#official-response')).toContainText('not a consultation response, council meeting ticket or speaking registration');
  });
}

test('Gatherings: homepage and Parent plan entries reach the form and recover through Back', async ({ page, hasTouch, javaScriptEnabled }) => {
  await fakeForm(page);
  for (const start of ['/index.html', '/proposal.html#plan-attend']) {
    await page.goto(start);
    const entry = page.locator(start.startsWith('/index') ? '#meeting-invitation a[href="gatherings/"]' : '#plan-attend a[href="gatherings/"]');
    await activate(entry, hasTouch);
    await expect(page).toHaveURL(/\/gatherings\.html$/);
    await expect(page.locator('#register')).toContainText('optional');
    const form = page.locator('#interest-form');
    await activate(form, hasTouch);
    await page.waitForURL(interestForm, { waitUntil: 'load' });
    await expect(page.getByRole('heading')).toHaveText('Form handoff intercepted');
    await page.goBack();
    await expect(page).toHaveURL(/\/gatherings\.html$/);
    if (javaScriptEnabled) {
      await expect(form).toBeInViewport({ ratio: 0.8 });
      await expectScrollSettled(page, 'Gatherings form Back');
    } else {
      // Native WebKit may restore the page top without scripts. Verify its
      // existing section link provides recovery, then really use the form again.
      await expect(page.locator('#register')).toContainText('Not yet confirmed');
      await nativeSection(page, '#register', hasTouch);
      await expect(page).toHaveURL(/\/gatherings\.html#register$/);
      await expect(form).toBeInViewport({ ratio: 0.8 });
      await activate(form, hasTouch);
      await page.waitForURL(interestForm, { waitUntil: 'load' });
      await page.goBack();
      await expect(page).toHaveURL(/\/gatherings\.html#register$/);
      await expect(page.locator('#register')).toContainText('optional');
      // The native section jump added exactly one same-document history entry.
      await page.goBack();
      await expect(page).toHaveURL(/\/gatherings\.html$/);
    }
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(start.replace('.', '\\.').replace('#', '#') + '$'));
    if (javaScriptEnabled) {
      await expect(entry).toBeInViewport({ ratio: 0.8 });
      await expectScrollSettled(page, 'Gatherings entry Back');
    } else {
      await nativeSection(page, start.startsWith('/index') ? '#meeting-invitation' : '#plan-attend', hasTouch);
      await expect(entry).toBeInViewport({ ratio: 0.8 });
      await activate(entry, hasTouch);
      await expect(page).toHaveURL(/\/gatherings\.html$/);
      await expect(page.locator('h1')).toHaveText('Proposed parent gatherings');
    }
  }
});

test('Gatherings: narrow layout, local privacy and no identifying information in redirect', async ({ page, hasTouch }) => {
  await page.goto('/gatherings/?email=fictional%40example.invalid&url=https://example.invalid#fictional');
  await expect(page).toHaveURL(/\/gatherings\.html$/);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  await activate(page.locator('#interest-help a[href="#privacy"]'), hasTouch);
  await expect(page.locator('#privacy')).toBeInViewport();
  await expect(page.locator('#privacy')).toContainText('12 December 2026');
  await expect(page.locator('#privacy a[href="feedback.html?kind=privacy#feedback-form"]')).toBeVisible();
  expect(await page.locator('iframe, form').count()).toBe(0);
});

test('Gatherings: printed route has a usable fallback when automatic refresh is unavailable', async ({ page, hasTouch }) => {
  await page.route('**/gatherings/', async route => {
    const response = await route.fetch();
    await route.fulfill({ response, body: (await response.text()).replace(/<meta http-equiv="refresh"[^>]*>/, '') });
  });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/gatherings/');
  const link = page.getByRole('link', { name: 'continue to the proposed gatherings page' });
  await expect(link).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  await activate(link, hasTouch);
  await expect(page).toHaveURL(/\/gatherings\.html$/);
  await expect(page.locator('#interest-form')).toBeVisible();
});
