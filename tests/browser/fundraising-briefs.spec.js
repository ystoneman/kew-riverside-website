const { test, expect, expectScrollSettled } = require('./fixtures');

for (const [file, title] of [
  ['fundraising-trustees.html', 'Could the charity host this fund?'],
  ['fundraising-admin.html', 'Help check the charity account setup'],
]) {
  test(`${file}: shared direct link gives the request, status and reply route without a donation flow`, async ({ page, hasTouch }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/kew-riverside-website/' + file);
    await expect(page.locator('main h1')).toHaveText(title);
    await expect(page.locator('.notice strong')).toContainText('charity approval pending. Donations are not open.');
    await expect(page.locator('form')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    // A shared anchor is a fresh arrival, not a same-document smooth scroll.
    await page.goto('about:blank');
    await page.goto('/kew-riverside-website/' + file + '#reply');
    await expect(page.locator('#reply')).toBeInViewport();
    await expect(page.locator('#reply')).toContainText('reply to the person who sent this brief');
    await expectScrollSettled(page, 'Shared reply anchor');
    // Readers can check the site's privacy terms and return to the brief.
    // Activating the footer link changes the departure position, so this checks
    // recovery of the correct document, separately from direct reply arrival.
    const privacy = page.locator('footer a[href="privacy.html"]');
    await privacy.scrollIntoViewIfNeeded();
    await expect(privacy).toBeInViewport();
    // Native smooth scrolling still runs without page scripts. Poll from the
    // test process so disabled in-page timers cannot freeze actionability.
    let previousY = null, stableReadings = 0;
    await expect.poll(async () => {
      const y = await page.evaluate(() => scrollY);
      stableReadings = y === previousY ? stableReadings + 1 : 0;
      previousY = y;
      return stableReadings;
    }, { intervals: [100] }).toBeGreaterThanOrEqual(3);
    await Promise.all([
      page.waitForURL(/kew-riverside-website\/privacy\.html$/, { waitUntil: 'load' }),
      hasTouch ? privacy.tap() : privacy.click(),
    ]);
    await expect(page).toHaveURL(/kew-riverside-website\/privacy\.html$/);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(file.replace('.', '\\.') + '#reply$'));
    await expect(page.locator('main h1')).toHaveText(title);
    await expect(page.locator('.notice strong')).toContainText('Donations are not open.');
    await expectScrollSettled(page, 'Back to brief');
  });
}
