const { test, expect, expectDestination } = require('./fixtures');
const upload = 'https://docs.google.com/forms/d/e/1FAIpQLScJZ8ZnZWTaPUIoM9l2Vjir7TgNNTHuUyDEF5uLRJolm8iccg/viewform';
const dropbox = 'https://www.dropbox.com/request/9uaa0fawrtdz6pv8b6hn';
const legacy = 'https://docs.google.com/forms/d/e/1FAIpQLSfK3b8XtDJ5_mhKWTqxfZpZwPOJLGXjN1QIQYTKYlJ0dRAHHQ/viewform';

for (const source of ['letters.html', 'feedback.html']) {
  test(`Video: discover private upload from ${source}`, async ({ page, baseURL, hasTouch }) => {
    await page.goto('/' + source);
    const entry = page.locator('main a[href="videos.html"]');
    if (source === 'letters.html') await expect(page.locator('.form-route').filter({ has: page.locator('a[href="videos.html"]') })).toContainText('for possible YouTube publication after review, with optional news-media permission');
    await expect(entry).toBeVisible();
    if (hasTouch) await entry.tap(); else await entry.click();
    await expectDestination(page, 'videos.html', baseURL);
    await expect(page.locator('#upload-requirements')).toContainText('No Google or Dropbox sign-in required');
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
  await expect(page.locator('#upload-requirements')).toContainText('Step 2: follow its confirmation link to Dropbox');
  await expect(page.locator('#resume-instructions')).toContainText('same email in both steps');
  await expect(page.locator('.video-process')).toContainText('An unmatched upload stays private');
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
  await expect(page.locator('#video-choices')).toContainText('New submissions require YouTube publication permission');
  await expect(page.locator('#video-choices')).toContainText('filename question is optional');
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
  await expect(page.locator('section[aria-labelledby="video-privacy"]')).toContainText('2026-09-22-videos-dropbox-v1');
});

for (const [name, selector, destination] of [
  ['resume a permitted Dropbox upload', '#dropbox-upload-link', dropbox],
  ['keep the original Google upload available', '#legacy-google-upload-link', legacy],
]) {
  test(`Video: ${name}`, async ({ page, hasTouch }) => {
    const requests = [];
    await page.route(destination, async route => {
      requests.push(route.request().method());
      await route.fulfill({contentType:'text/html',body:'<!doctype html><title>Fictional external destination</title><p>No data sent.</p>'});
    });
    await page.goto('/videos.html');
    if (selector.includes('legacy')) {
      const summary = page.locator('#upload-help summary');
      if (hasTouch) await summary.tap(); else { await summary.focus(); await page.keyboard.press('Enter'); }
      await expect(page.locator('#upload-help')).toContainText('It requires Google sign-in');
      await expect(page.locator('#upload-help')).toContainText('you do not need to submit it again');
    } else {
      await expect(page.locator('#resume-instructions')).toContainText('Already saved your permissions?');
    }
    const link = page.locator(selector);
    if (hasTouch) await link.tap(); else await link.click();
    await expect(page).toHaveURL(destination);
    expect(requests).toEqual(['GET']);
  });
}


test('Video: direct arrival explains publication and offers private contact without consent', async ({ page, baseURL, hasTouch }) => {
  await page.goto('/videos.html#upload');
  const card = page.locator('#upload');
  await expect(card).toContainText('New submissions require your explicit YouTube permission');
  await expect(card).toContainText('News-media permission is optional');
  await expect(card.locator('#resume-instructions')).toContainText('including any earlier private-only choice, even if you upload later');
  const contact = card.getByRole('link', { name: 'Contact Yann privately', exact: true });
  await expect(contact).toBeVisible();
  if (hasTouch) await contact.tap(); else await contact.click();
  await expectDestination(page, 'about.html#contact', baseURL);
  await page.goBack();
  await expect(page).toHaveURL(/videos.html#upload$/);
  await page.locator('#video-choices summary').click();
  await expect(page.locator('#video-choices')).toContainText('News-media permission is optional and unchecked');
  await expect(page.locator('#video-choices')).toContainText('withdraw YouTube or news-media permission separately');
});
