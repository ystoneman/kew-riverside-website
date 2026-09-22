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
