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
  await page.goto('/evidence.html#records');
  expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
  await page.goto('/letters.html');
  await expect(page.locator('#council-name')).toBeDisabled();
  await expect(page.locator('#council-postcode')).toBeDisabled();
  await expect(page.locator('#letter-consent')).not.toBeChecked();
  await expect(page.locator('#allow-public')).not.toBeChecked();
  await expect(page.locator('#allow-council')).not.toBeChecked();
});

test('No JavaScript: homepage and Evidence expose the full report and web research', async ({ page }) => {
  await page.goto('/index.html');
  const shortcut = page.locator('#research-shortcut');
  await expect(shortcut).toContainText('44-page PDF');
  await shortcut.locator('a[href="lessons.html"]').tap();
  await expect(page).toHaveURL(/lessons\.html$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What can other schools teach us?');
  await page.goBack();
  await shortcut.locator('a[href="evidence.html#source-lessons-report"]').tap();
  const report = page.locator('#source-lessons-report');
  await expect(report).toBeInViewport();
  await expect(report).toContainText(/site research/i);
  await expect(report.locator('a[href="lessons.html"]')).toBeVisible();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    report.locator('a[href="lessons-report.pdf"]').tap(),
  ]);
  expect(download.suggestedFilename()).toBe('lessons-report.pdf');
  expect(await download.failure()).toBeNull();
  await page.goto('/evidence.html?q=impossible-report-search&type=Inspection#source-lessons-report');
  await expect(report).toBeVisible();
  await expect(report).toBeInViewport();
  await expect(page.locator('.source-card:visible')).toHaveCount(47);
});

for (const [publish, council] of [[false, false], [true, false], [false, true], [true, true]]) {
  test(`No JavaScript: letter permissions submit independently: public=${publish}, council=${council}`, async ({ page }) => {
    const submissions = await captureSubmissions(page);
    await page.goto('/letters.html');
    await page.locator('#message').fill('A fictional community letter submitted without JavaScript.');
    await page.locator('#letter-consent').check();
    if (publish) await page.locator('#allow-public').check();
    if (council) await page.locator('#allow-council').check();
    await page.locator('#letter-form button[type="submit"]').tap();
    await expect.poll(() => submissions.length).toBe(1);
    expect(submissions[0].get('notice_version')).toBe('2026-09-22-letters-v3');
    expect(submissions[0].get('letter_consent')).toBe('yes-process-my-letter-v3');
    expect(submissions[0].get('allow_public')).toBe(publish ? 'yes-publish-with-display-name-v3' : null);
    expect(submissions[0].get('allow_council')).toBe(council ? 'yes-share-with-richmond-council-v2' : null);
    for (const field of ['council_name', 'council_postcode']) expect(submissions[0].has(field)).toBe(false);
  });
}

test('No JavaScript: letter accepts a full 30000-character message including an emoji', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  const body = 'F'.repeat(29998) + '🙂';
  await page.goto('/letters.html');
  await expect(page.locator('#message')).toHaveAttribute('maxlength', '30000');
  await page.locator('#message').fill(body);
  await expect(page.locator('#message')).toHaveValue(body);
  await page.locator('#letter-consent').check();
  await page.locator('#allow-public').check();
  await page.locator('#letter-form button[type="submit"]').tap();
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0].get('message')).toBe(body);
  expect(submissions[0].get('allow_public')).toBe('yes-publish-with-display-name-v3');
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

test('No JavaScript: contextual learning entry exposes the results, native tables and downloads', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#visit-school a[href="understand.html#learning-and-results"]').tap();
  const section = page.locator('#learning-and-results');
  await expect(section).toBeInViewport();
  await expect(page.locator('svg#attainment-chart')).toBeVisible();
  for (const value of ['75%', '67%', '73%', '60%', '61%', '62%', '74%', '76%', '78%']) {
    await expect(section).toContainText(value);
  }
  await page.locator('#attainment-tables > summary').tap();
  await expect(page.locator('#attainment-tables')).toHaveAttribute('open', '');
  expect(await page.locator('#attainment-tables table:visible').count()).toBeGreaterThan(0);
  await page.locator('#attainment-method > summary').tap();
  await expect(page.locator('#attainment-method')).toHaveAttribute('open', '');
  for (const filename of ['attainment.csv', 'attainment-data.json']) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      section.locator(`a[href="${filename}"][download]`).tap(),
    ]);
    expect(download.suggestedFilename()).toBe(filename);
    expect(await download.failure()).toBeNull();
  }
  await section.locator('#inspection-summary a[href="evidence.html#source-inspection-2026"]').tap();
  await expect(page.locator('#source-inspection-2026')).toBeInViewport();
  await expect(page.locator('#source-inspection-2026')).toContainText('Reviewed');
});

test('No JavaScript: prospective families can follow learning and open the sourced FAQ answers', async ({ page }) => {
  await page.goto('/index.html#visit-school');
  const visit = page.locator('#visit-school');
  await expect(visit.locator('a[href^="https://www.kewriverside.richmond.sch.uk/"]')).toBeVisible();
  await expect(visit.locator('a[href="proposal.html"]')).toBeVisible();
  await expect(visit.locator('a[href^="https://www.richmond.gov.uk/"][href*="primary"]')).toBeVisible();
  await visit.locator('a[href="understand.html#learning-and-results"]').tap();
  await expect(page.locator('#learning-and-results')).toBeInViewport();
  await page.goBack();
  await expect(visit).toBeInViewport();
  await page.goto('/faq.html#learning');
  await expect(page.locator('#learning')).toBeInViewport();
  for (const id of ['school-results', 'latest-inspection', 'mixed-age-learning', 'mixed-age-research']) {
    const answer = page.locator('details#' + id);
    await answer.locator(':scope > summary').tap();
    await expect(answer).toHaveAttribute('open', '');
    await expect(answer.locator('p').first()).toBeVisible();
    expect(await answer.locator('a[href]').count()).toBeGreaterThan(0);
  }
  await page.locator('#latest-inspection a[href="evidence.html#source-inspection-2026"]').tap();
  await expect(page.locator('#source-inspection-2026')).toBeInViewport();
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
  await expect(answers).toHaveCount(16);
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

test('No JavaScript: the parent plan, session dates and additional actions are available', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#meeting-invitation a[href="proposal.html#parent-plan"]').tap();
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
  await expect(page.locator('#prep-sessions')).toContainText('Friday 25 September');
  await expect(page.locator('#prep-sessions')).toContainText('Monday 28 September');
  await expect(page.locator('#plan-respond')).toContainText('16 October');
  await page.getByRole('navigation', { name: 'Choose a parent action' }).getByRole('link', { name: 'More ways to help' }).tap();
  await expect(page.locator('#plan-keep-going')).toBeInViewport();
  await page.locator('#more-parent-actions > summary').tap();
  await expect(page.locator('#more-parent-actions')).toHaveAttribute('open', '');
  await expect(page.locator('#more-parent-actions').getByRole('link', { name: 'Find your MP' })).toBeVisible();
  await page.locator('.parent-reassurance a[href="faq.html#school-places"]').tap();
  await expect(page.locator('#school-places')).toBeInViewport();
  await page.locator('#choose-school > summary').tap();
  await expect(page.locator('#choose-school')).toContainText('normal admissions');
});

test('No JavaScript: research keeps all cases, graphics, evidence notes and citations available', async ({ page }) => {
  await page.goto('/lessons.html');
  await expect(page.locator('#lesson-filters')).toBeHidden();
  await expect(page.locator('.lesson-case')).toHaveCount(16);
  await page.locator('#exhibit-4 > summary').tap();
  await expect(page.locator('#exhibit-4 img')).toBeVisible();
  await page.locator('#exhibit-4 .lesson-data > summary').tap();
  await expect(page.locator('#exhibit-4 .lesson-data')).toContainText('£74,368');
  await page.locator('#case-st-bartholomew > summary').tap();
  await expect(page.locator('#case-st-bartholomew')).toContainText(/extra school term/);
  await page.goto('/lessons-sources.html');
  await expect(page.locator('.lesson-source')).toHaveCount(45);
  await page.locator('#X04 > summary').tap();
  await expect(page.locator('#X04')).toHaveAttribute('open','');
});

test('No JavaScript: video guidance and external upload route remain available', async ({ page }) => {
  await page.goto('/letters.html');
  await page.locator('main a[href="videos.html"]').tap();
  await expect(page.locator('#upload-requirements')).toContainText('No Google or Dropbox sign-in required');
  const destination = await page.locator('#video-upload-link').getAttribute('href');
  await page.route(destination, route => route.fulfill({contentType:'text/html',body:'<!doctype html><title>Fictional permission handoff</title><p>No upload sent.</p>'}));
  for (const id of ['recording-tips','video-choices','upload-help']) {
    await page.locator('#'+id+' summary').tap();
    await expect(page.locator('#'+id)).toHaveAttribute('open','');
  }
  await page.locator('#video-upload-link').tap();
  await expect(page).toHaveURL(destination);
});


test('No JavaScript: the named parent action plan is visible on arrival', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/index.html');
  const plan = page.getByRole('complementary', { name: 'Parent action plan', exact: true }).getByRole('link', { name: 'Parent action plan', exact: true });
  await expect(plan).toBeInViewport({ ratio: 1 });
  await plan.tap();
  await expect(page).toHaveURL(/proposal\.html#parent-plan$/);
  await expect(page.locator('#parent-plan-title')).toBeInViewport();
});

test('No JavaScript: former homepage fragments offer an explicit route to the moved content', async ({ page }) => {
  // Independently pinned public links, including a detail nested in a disclosure.
  for (const [id, destination] of [
    ['records', 'evidence.html'],
    ['source-inspection-2026', 'evidence.html'],
    ['source-lessons-report', 'evidence.html'],
    ['earlier-record', 'evidence.html'],
    ['gaps', 'evidence.html'],
    ['method', 'evidence.html'],
    ['options', 'options.html'],
    ['option-enrolment', 'options.html'],
    ['crowdfunding-recipient', 'options.html'],
  ]) {
    await page.goto('/index.html#' + id);
    const fallback = page.locator('.legacy-route#' + id);
    await expect(fallback).toBeInViewport();
    const link = fallback.locator(`a[href="${destination}#${id}"]`);
    await expect(link).toHaveAccessibleName(/Continue/i);
    await link.tap();
    await expect(page).toHaveURL(new RegExp(destination.replace('.', '\\.') + '#' + id + '$'));
    if (id === 'crowdfunding-recipient') {
      const details = page.locator('#crowdfunding-recipient').locator('xpath=ancestor::details[1]');
      if (!(await details.evaluate(element => element.open))) await details.locator(':scope > summary').tap();
    }
    if (id === 'earlier-record' && !(await page.locator('#earlier-record').evaluate(element => element.open))) {
      await page.locator('#earlier-record > summary').tap();
    }
    await expect(page.locator('#' + id)).toBeVisible();
  }
});

test('No JavaScript: the exact video QR upload address keeps a working permission handoff', async ({ page }) => {
  await page.goto('/videos.html#upload');
  await expect(page).toHaveURL(/\/videos\.html#upload$/);
  await expect(page.locator('#upload')).toBeInViewport();
  await expect(page.locator('#upload-requirements')).toContainText('Adults recording themselves only');
  await expect(page.locator('#upload-requirements')).toContainText('No Google or Dropbox sign-in required');
  const link = page.locator('#video-upload-link');
  const destination = await link.getAttribute('href');
  await page.route(destination, route => route.fulfill({ contentType: 'text/html', body: '<h1>Fictional video permission handoff</h1><p>No upload sent.</p>' }));
  await link.tap();
  await expect(page).toHaveURL(destination);
  await page.goBack();
  await expect(page).toHaveURL(/\/videos\.html#upload$/);
  await expect(page.locator('#upload')).toBeInViewport();
  await expect(page.locator('main a[href="letters.html"]')).toBeVisible();
});
