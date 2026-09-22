const { test, expect, pages, headerLinks, expectDestination, captureSubmissions } = require('./fixtures');

for (const file of pages) {
  test(`${file}: every native mobile menu link works without JavaScript`, async ({ page, baseURL }) => {
    for (const href of headerLinks(file, 'mobile')) {
      await page.goto('/' + file);
      await page.locator('.mobile-menu summary').tap();
      await page.locator(`.mobile-menu a[href="${href}"]`).tap();
      await expectDestination(page, href, baseURL);
    }
  });
}

test('No JavaScript: evidence is readable and council identity stays disabled', async ({ page }) => {
  await page.goto('/index.html');
  expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
  await page.goto('/letters.html');
  await expect(page.locator('#council-name')).toBeDisabled();
  await expect(page.locator('#council-postcode')).toBeDisabled();
  await expect(page.locator('#letter-consent')).not.toBeChecked();
  await expect(page.locator('#allow-public')).not.toBeChecked();
  await expect(page.locator('#allow-council')).not.toBeChecked();
});

test('No JavaScript: Understand retains charts, underlying data and council context', async ({ page }) => {
  await page.goto('/understand.html');
  const controls = page.locator('[role="group"][aria-label="Pupil trend measure"]');
  await expect(controls).toHaveCount(1);
  await expect(controls).toBeHidden();
  await expect(page.locator('[data-trend-view="count"]')).toBeVisible();
  await expect(page.locator('[data-trend-view="count"] svg')).toHaveCount(3);
  await expect(page.locator('[data-trend-view="change"]')).toBeHidden();
  const local = page.locator('#pupil-trends summary').filter({ hasText: /^View the local trend data$/ });
  await local.tap();
  await expect(local.locator('..').locator('table')).toBeVisible();
  for (const id of ['pupil-trends', 'school-places', 'year-groups']) {
    const summary = page.locator('#' + id + ' summary').filter({ hasText: /^Compare all Richmond primary schools$/ });
    await summary.tap();
    await expect(summary.locator('..').locator('table')).toBeVisible();
  }
  await expect(page.locator('#other-proposals')).toBeVisible();
  await expect(page.locator('#methodology')).toBeVisible();
});

test('No JavaScript: optional sharing details and reviewed ideas remain usable', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/feedback.html');
  await expect(page.locator('#publication-options')).not.toHaveAttribute('open', '');
  await page.locator('#publication-options > summary').tap();
  await expect(page.locator('#display-name')).toBeVisible();
  await expect(page.locator('#allow-public')).not.toBeChecked();
  await page.locator('#suggestions > summary').tap();
  await expect(page.locator('#suggestions')).toHaveAttribute('open', '');
  await expect(page.locator('#suggestions a[href="suggestions.json"]')).toBeVisible();
  await page.locator('#kind').selectOption('evidence');
  await page.locator('#message').fill('Synthetic source information entered without JavaScript.');
  await page.locator('#display-name').fill('Optional test alias');
  await page.locator('#allow-public').check();
  await page.locator('#feedback-form button[type="submit"]').tap();
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0].get('kind')).toBe('evidence');
  expect(submissions[0].get('display_name')).toBe('Optional test alias');
  expect(submissions[0].has('allow_public')).toBe(true);
});

test('No JavaScript: all FAQ answers retain native disclosure and official routes', async ({ page }) => {
  await page.goto('/faq.html');
  await expect(page.locator('#faq-search')).toBeHidden();
  const answers = page.locator('main details');
  await expect(answers).toHaveCount(12);
  for (const answer of await answers.all()) {
    await expect(answer).toBeVisible();
    await answer.locator(':scope > summary').tap();
    await expect(answer).toHaveAttribute('open', '');
    await expect(answer.locator('p').first()).toBeVisible();
    expect(await answer.locator('a[href]').count()).toBeGreaterThan(0);
  }
});

test('No JavaScript: the meeting invitation shows its fixed date and usable details link', async ({ page }) => {
  await page.goto('/index.html');
  const invitation = page.locator('#meeting-invitation');
  await expect(invitation).toBeVisible();
  await expect(page.locator('#meeting-relative')).toHaveText('School meeting');
  expect((await invitation.locator('time').innerText()).replace(/\s+/g, ' ')).toContain('Tuesday 29 September 2026');
  await expect(invitation).toContainText(/3[.:]30\s*p\.?m\.?/i);
  await invitation.locator('a[href="proposal.html#school-meeting"]').tap();
  await expect(page).toHaveURL(/proposal\.html#school-meeting$/);
  await expect(page.locator('#school-meeting')).toBeInViewport();
});
