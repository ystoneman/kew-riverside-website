const fs = require('node:fs/promises');
const { test, expect } = require('./fixtures');

test('Source search, combined filters, empty state and clear remain usable', async ({ page }) => {
  await page.goto('/index.html#records');
  const total = await page.locator('.source-card').count();
  await expect(page.locator('#result-count')).toHaveText(`${total} of ${total} records`);
  await page.getByLabel('Search the records').fill('Ofsted');
  expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
  expect(await page.locator('.source-card:visible').count()).toBeLessThan(total);
  await page.getByLabel('Record type', { exact: true }).selectOption('Inspection');
  await page.getByLabel('Year', { exact: true }).selectOption('2003');
  await expect(page.locator('.source-card:visible')).toHaveCount(1);
  await expect(page.locator('.source-card:visible h3')).toContainText('First Ofsted inspection');
  await expect(page).toHaveURL(/q=Ofsted/);
  await page.reload();
  await expect(page.getByLabel('Search the records')).toHaveValue('Ofsted');
  await expect(page.locator('.source-card:visible')).toHaveCount(1);
  await page.getByLabel('Search the records').fill('no-record-can-match-this-test-phrase');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('.source-card:visible')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.source-card:visible')).toHaveCount(total);
  await expect(page.locator('#no-results')).toBeHidden();
  await expect(page.getByLabel('Search the records')).toBeFocused();
});

test('Direct evidence references remain visible when URL filters exclude them', async ({ page }) => {
  await page.goto('/index.html?q=no-record-can-match-this-test-phrase#source-inspection-2003');
  await expect(page.locator('#source-inspection-2003')).toBeVisible();
  await expect(page.locator('#source-inspection-2003')).toBeInViewport();
  await expect(page.getByLabel('Search the records')).toHaveValue('');
});

test('Each source filter independently updates visible records', async ({ page }) => {
  for (const [label, value] of [['Topic', 'Funding & buildings'], ['Coverage', 'Index only']]) {
    await page.goto('/index.html#records');
    const total = await page.locator('.source-card').count();
    await page.getByLabel(label, { exact: true }).selectOption(value);
    expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
    expect(await page.locator('.source-card:visible').count()).toBeLessThan(total);
    await expect(page.locator('.source-card:visible').first()).toContainText(value);
  }
});

test('Checklist downloads as PDF and source index as CSV', async ({ page }) => {
  await page.goto('/index.html');
  for (const [name, filename, signature] of [
    ['Download the checklist (PDF)', 'kew-riverside-response-checklist.pdf', '%PDF-'],
    ['Download the source index (CSV)', 'kew-riverside-source-index.csv', '"Title","Publisher"'],
  ]) {
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('link', { name: new RegExp(name.replace(/[()]/g, '\\$&')) }).click(),
    ]);
    expect(download.suggestedFilename()).toBe(filename);
    expect(await download.failure()).toBeNull();
    const contents = await fs.readFile(await download.path(), 'utf8');
    expect(contents.replace(/^\uFEFF/, '').startsWith(signature)).toBe(true);
  }
});

test('Charts and option details provide usable nonvisual alternatives', async ({ page }) => {
  await page.goto('/index.html');
  await page.locator('#borough-context > summary').click();
  const tables = page.locator('details.data-table');
  expect(await tables.count()).toBeGreaterThan(0);
  for (const details of await tables.all()) {
    await details.locator('summary').click();
    await expect(details.locator('table')).toBeVisible();
    expect(await details.locator('tbody tr').count()).toBeGreaterThan(0);
  }
  const campaign = page.locator('#option-enrolment');
  await campaign.locator('summary').click();
  await expect(campaign.getByRole('heading', { name: 'A practical first step' })).toBeVisible();
  await campaign.getByRole('link', { name: /Offer campaign help/ }).click();
  await expect(page).toHaveURL(/about.html#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
});
