const { test, expect, expectDestination } = require('./fixtures');
const upload = 'https://docs.google.com/forms/d/e/1FAIpQLSfK3b8XtDJ5_mhKWTqxfZpZwPOJLGXjN1QIQYTKYlJ0dRAHHQ/viewform';

for (const source of ['letters.html', 'feedback.html']) {
  test(`Video: discover private upload from ${source}`, async ({ page, baseURL, hasTouch }) => {
    await page.goto('/' + source);
    const entry = page.locator('main a[href="videos.html"]');
    await expect(entry).toBeVisible();
    if (hasTouch) await entry.tap(); else await entry.click();
    await expectDestination(page, 'videos.html', baseURL);
    await expect(page.locator('#upload-requirements')).toContainText('Google sign-in required');
    await expect(page.locator('#upload-requirements')).toContainText('Adults recording themselves only');
    await expect(page.locator('#video-title')).toHaveText('Some things are best said in your own voice.');
  });
}

test('Video: upload is a clear external handoff without embedded trackers or local data fields', async ({ page, hasTouch }) => {
  const requests = [];
  await page.route(upload, async route => {
    requests.push(route.request().method());
    await route.fulfill({contentType:'text/html',body:'<!doctype html><title>Fictional upload destination</title><main>External handoff intercepted. No upload sent.</main>'});
  });
  await page.goto('/videos.html');
  await expect(page.locator('iframe,video,form,input[type="file"]')).toHaveCount(0);
  await expect(page.locator('.video-process')).toContainText('Nothing is published automatically');
  await expect(page.locator('#video-upload-link')).toHaveAttribute('aria-describedby', 'upload-requirements');
  await expect(page.locator('.video-process a')).toHaveAttribute('href', 'https://www.youtube.com/@KewParentVoices');
  if (hasTouch) await page.locator('#video-upload-link').tap(); else await page.locator('#video-upload-link').click();
  await expect(page).toHaveURL(upload);
  expect(requests).toEqual(['GET']);
});

test('Video: native recording, consent and upload-help disclosures support touch and keyboard', async ({ page, hasTouch }) => {
  await page.goto('/videos.html');
  for (const id of ['recording-tips', 'video-choices', 'upload-help']) {
    const detail = page.locator('#' + id);
    const summary = detail.locator('summary');
    await expect(detail).not.toHaveAttribute('open','');
    if (hasTouch) await summary.tap(); else { await summary.focus(); await page.keyboard.press('Enter'); }
    await expect(detail).toHaveAttribute('open','');
    await expect(detail.locator('div')).toBeVisible();
    if (hasTouch) await summary.tap(); else await page.keyboard.press('Enter');
    await expect(detail).not.toHaveAttribute('open','');
  }
});

test('Video: withdrawal leads to private request and non-Google alternative stays available', async ({ page }) => {
  await page.goto('/videos.html');
  await page.locator('#video-choices summary').click();
  await expect(page.locator('#video-choices')).toContainText('No. Keep my video private');
  await expect(page.locator('#video-choices')).toContainText('Your face and voice can still identify you');
  await page.locator('#video-choices a[href^="feedback.html"]').click();
  await expect(page.locator('#kind')).toHaveValue('privacy');
  await expect(page.locator('#publication-options')).toBeHidden();
  await page.goto('/videos.html');
  await page.locator('#upload-help summary').click();
  await page.locator('#upload-help a[href="letters.html#letter-form"]').click();
  await expect(page.locator('#letter-form')).toBeInViewport();
  await page.goto('/videos.html');
  await page.locator('.video-upload a[href="privacy.html#video-privacy"]').click();
  await expect(page.locator('#video-privacy')).toBeInViewport();
  await expect(page.locator('section[aria-labelledby="video-privacy"]')).toContainText('2026-09-22-videos-v1');
});
