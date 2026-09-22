const { test, expect, pages, headerLinks, expectDestination } = require('./fixtures');

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
