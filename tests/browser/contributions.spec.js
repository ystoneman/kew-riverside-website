const { test, expect, captureSubmissions } = require('./fixtures');

test('Contribution routes lead to the corresponding form', async ({ page }) => {
  for (const [name, destination, form] of [
    ['Add my name as a supporter', /supporters.html$/, '#supporter-form'],
    ['Share a testimonial or letter', /letters.html$/, '#letter-form'],
    ['Send website feedback', /feedback.html#feedback-form$/, '#feedback-form'],
  ]) {
    await page.goto('/feedback.html');
    await page.getByRole('link', { name: new RegExp(name) }).click();
    await expect(page).toHaveURL(destination);
    await expect(page.locator(form)).toBeVisible();
  }
});

for (const kind of ['suggestion', 'crowdfunding', 'correction', 'source', 'accessibility', 'privacy', 'other']) {
  test(`Feedback: ${kind} submits only the applicable publication fields`, async ({ page }) => {
    const submissions = await captureSubmissions(page);
    await page.goto('/feedback.html');
    await page.locator('#message').fill('Synthetic browser test feedback; intercepted locally.');
    await page.locator('#display-name').fill('Test contributor');
    await page.locator('#allow-public').check();
    await page.locator('#kind').selectOption(kind);
    const privateOnly = ['crowdfunding', 'privacy'].includes(kind);
    if (privateOnly) {
      await expect(page.locator('#allow-public')).not.toBeChecked();
      await expect(page.locator('#allow-public')).toBeDisabled();
      await expect(page.locator('#display-name')).toBeDisabled();
      await expect(page.locator('#publication-choice')).toBeHidden();
    } else {
      await expect(page.locator('#preview-name')).toHaveText('Test contributor');
      await expect(page.locator('#preview-body')).toContainText('Synthetic browser test feedback');
    }
    await page.locator('#feedback-form button[type="submit"]').click();
    await expect.poll(() => submissions.length).toBe(1);
    expect(submissions[0].get('kind')).toBe(kind);
    expect(submissions[0].has('display_name')).toBe(!privateOnly);
    expect(submissions[0].has('allow_public')).toBe(!privateOnly);
  });
}

test('Private categories do not restore publication consent when switching back', async ({ page }) => {
  await page.goto('/feedback.html');
  await page.locator('#allow-public').check();
  await page.locator('#kind').selectOption('privacy');
  await page.locator('#kind').selectOption('suggestion');
  await expect(page.locator('#allow-public')).toBeEnabled();
  await expect(page.locator('#allow-public')).not.toBeChecked();
});

test('Funding deep link selects its question and rejects an untouched template', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/feedback.html?kind=crowdfunding&question=recipient#feedback-form');
  await expect(page.locator('#kind')).toHaveValue('crowdfunding');
  await expect(page.locator('#message')).toHaveValue(/who could receive and manage contributions/);
  await page.locator('button[type="submit"]').click();
  expect(submissions).toHaveLength(0);
  expect(await page.locator('#message').evaluate(field => field.validity.valid)).toBe(false);
  await page.locator('#message').fill('Synthetic funding idea provided for this local test only.');
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => submissions.length).toBe(1);
});

test('Feedback rejects whitespace-only text and accepts a corrected message', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/feedback.html');
  await page.locator('#message').fill('            ');
  await page.locator('button[type="submit"]').click();
  expect(submissions).toHaveLength(0);
  await expect(page.locator('#message')).toBeFocused();
  await page.locator('#message').fill('This corrected test message has sufficient meaningful characters.');
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => submissions.length).toBe(1);
});

test('Letter requires private-review consent without requiring public sharing', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/letters.html');
  await page.locator('#message').fill('This synthetic community letter is intercepted locally.');
  await page.locator('button[type="submit"]').click();
  expect(submissions).toHaveLength(0);
  await expect(page.locator('#letter-consent')).toBeFocused();
  await page.locator('#letter-consent').check();
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0].has('letter_consent')).toBe(true);
  for (const field of ['allow_public', 'allow_council', 'council_name', 'council_postcode']) expect(submissions[0].has(field)).toBe(false);
});

for (const [publish, council] of [[true, false], [false, true], [true, true]]) {
  test(`Letter keeps independent permissions: public=${publish}, council=${council}`, async ({ page }) => {
    const submissions = await captureSubmissions(page);
    await page.goto('/letters.html');
    await expect(page.locator('#allow-public')).not.toBeChecked();
    await expect(page.locator('#allow-council')).not.toBeChecked();
    await page.locator('#message').fill('Synthetic letter for permission testing; never transmitted.');
    await page.locator('#display-name').fill('Public alias');
    await page.locator('#letter-consent').check();
    if (publish) await page.locator('#allow-public').check();
    if (council) {
      await page.locator('#allow-council').check();
      await expect(page.locator('#council-details')).toBeVisible();
      await page.locator('#council-name').fill('Example adult');
      await page.locator('#council-postcode').fill('ZZ1 1ZZ');
    }
    await expect(page.locator('#preview-name')).toHaveText('Public alias');
    await expect(page.locator('.submission-preview')).not.toContainText('Example adult');
    await page.locator('button[type="submit"]').click();
    await expect.poll(() => submissions.length).toBe(1);
    expect(submissions[0].has('allow_public')).toBe(publish);
    expect(submissions[0].has('allow_council')).toBe(council);
    expect(submissions[0].has('council_name')).toBe(council);
    expect(submissions[0].has('council_postcode')).toBe(council);
  });
}

test('Revoking council sharing excludes previously entered private details', async ({ page }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/letters.html');
  await page.locator('#message').fill('Synthetic letter demonstrating withdrawn council permission.');
  await page.locator('#letter-consent').check();
  await page.locator('#allow-council').check();
  await page.locator('#council-name').fill('Example adult');
  await page.locator('#council-postcode').fill('ZZ1 1ZZ');
  await page.locator('#allow-council').uncheck();
  await expect(page.locator('#council-details')).toBeHidden();
  await expect(page.locator('#council-name')).toBeDisabled();
  await page.locator('button[type="submit"]').click();
  await expect.poll(() => submissions.length).toBe(1);
  for (const field of ['allow_council', 'council_name', 'council_postcode']) expect(submissions[0].has(field)).toBe(false);
});

test('Supporter requests require all three independent consent statements', async ({ page, hasTouch }) => {
  const submissions = await captureSubmissions(page);
  await page.goto('/supporters.html');
  await page.locator('#public-name').fill('Test supporter');
  await page.locator('#supporter-email').fill('test@example.invalid');
  const choices = page.locator('#supporter-form input[type="checkbox"]');
  const labels = page.locator('#supporter-form .feedback-permission');
  const submit = page.locator('button[type="submit"]');
  expect(await choices.count()).toBe(3);
  for (let index = 0; index < await choices.count(); index++) {
    const choice = choices.nth(index);
    await expect(choice).not.toBeChecked();
    if (hasTouch) await submit.tap();
    else await submit.click();
    // Wait for native validation to identify the missing consent before responding.
    await expect(choice).toBeFocused();
    await expect(choice).not.toBeChecked();
    expect(submissions).toHaveLength(0);
    // A touch user can select the full consent label. Keep the gesture and the
    // observable result separate while the browser dismisses its validation UI.
    if (hasTouch) await labels.nth(index).tap();
    else await choice.check();
    await expect(choice).toBeChecked();
  }
  if (hasTouch) await submit.tap();
  else await submit.click();
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0].get('kind')).toBe('supporter');
  expect(submissions[0].get('email')).toBe('test@example.invalid');
  for (const name of ['adult_self', 'supporter_consent', 'allow_supporter']) expect(submissions[0].has(name)).toBe(true);
});

for (const [file, kind] of [['about.html', 'contact'], ['corrections.html', 'privacy']]) {
  test(`${file}: private contact route submits with no publication permission`, async ({ page }) => {
    const submissions = await captureSubmissions(page);
    await page.goto('/' + file);
    await page.locator('textarea[name="message"]').fill('Synthetic private message intercepted by the local test runner.');
    for (const checkbox of await page.locator('form input[type="checkbox"][required]').all()) await checkbox.check();
    await page.locator('button[type="submit"]').click();
    await expect.poll(() => submissions.length).toBe(1);
    expect(submissions[0].get('kind')).toBe(kind);
    expect(submissions[0].has('allow_public')).toBe(false);
  });
}
