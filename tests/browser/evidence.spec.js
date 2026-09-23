const fs = require('node:fs/promises');
const { test, expect } = require('./fixtures');

test('Report discovery: homepage links reach the web research and download the 44-page report', async ({ page, hasTouch }) => {
  await page.goto('/index.html');
  const shortcut = page.locator('#research-shortcut');
  await expect(shortcut).toContainText('44-page PDF');
  const web = shortcut.locator('a[href="lessons.html"]');
  if (hasTouch) await web.tap(); else await web.click();
  await expect(page).toHaveURL(/lessons\.html$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What can other schools teach us?');
  await page.goBack();
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    shortcut.locator('a[href="lessons-report.pdf"]').click(),
  ]);
  expect(download.suggestedFilename()).toBe('lessons-report.pdf');
  expect(await download.failure()).toBeNull();
  const contents = await fs.readFile(await download.path());
  expect(contents.subarray(0, 5).toString()).toBe('%PDF-');
});

test('Report discovery: remembered terms find the research and preserve its provenance', async ({ page }) => {
  await page.goto('/evidence.html#records');
  const report = page.locator('#source-lessons-report');
  for (const query of ['other schools', '12 schools', 'closure reversals', 'saved schools', 'report', '44-page PDF', '44 page PDF']) {
    await page.getByLabel('Search source records and research reports').fill(query);
    await expect(report).toBeVisible();
    await expect(page.locator('#research-count')).toHaveText('1 of 1 site research reports');
    await expect(page.locator('#no-results')).toBeHidden();
    await expect(report.locator('a[href="lessons.html"]')).toBeVisible();
    await expect(report.locator('a[href="lessons-report.pdf"]')).toBeVisible();
  }
  await expect(report).toContainText(/site research/i);
  await expect(report).toContainText(/synthesis/i);
  await expect(report).toContainText(/12 selected school reprieves/i);
  await expect(report).toContainText(/four closure comparisons/i);
  await expect(report).toContainText(/not an official record or a representative dataset/i);
  await expect(report).not.toHaveClass(/\bsource-card\b/);
  await expect(page.locator('.source-card')).toHaveCount(57);
  await page.reload();
  await expect(page.getByLabel('Search source records and research reports')).toHaveValue('44 page PDF');
  await expect(report).toBeVisible();
});

test('Report discovery: research filters, separate counts, empty state and reset agree', async ({ page }) => {
  await page.goto('/evidence.html#records');
  const report = page.locator('#source-lessons-report');
  await expect(page.locator('#result-count')).toHaveText('57 of 57 records');
  await expect(page.locator('#research-count')).toHaveText('1 of 1 site research reports');
  await page.getByLabel('Record type', { exact: true }).selectOption('Site research');
  await expect(report).toBeVisible();
  await expect(page.locator('.source-card:visible')).toHaveCount(0);
  await expect(page.locator('#result-count')).toHaveText('0 of 57 records');
  await expect(page.locator('#no-results')).toBeHidden();
  await page.getByLabel('Coverage', { exact: true }).selectOption('Synthesis');
  await expect(report).toBeVisible();
  await page.getByLabel('Year', { exact: true }).selectOption('2003');
  await expect(report).toBeHidden();
  await expect(page.locator('#research-count')).toHaveText('0 of 1 site research reports');
  await expect(page.locator('#no-results')).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(report).toBeVisible();
  await expect(page.locator('.source-card:visible')).toHaveCount(57);
  await expect(page.locator('#result-count')).toHaveText('57 of 57 records');
  await expect(page.locator('#research-count')).toHaveText('1 of 1 site research reports');
  await expect(page.locator('#no-results')).toBeHidden();
  await expect(page.getByLabel('Search source records and research reports')).toBeFocused();
});

test('Report discovery: direct and repeated report anchors recover incompatible filters', async ({ page, hasTouch }) => {
  await page.goto('/evidence.html?q=impossible-report-search&type=Inspection&year=2003&status=Reviewed#source-lessons-report');
  const report = page.locator('#source-lessons-report');
  await expect(report).toBeVisible();
  await expect(report).toBeInViewport();
  await expect(page.getByLabel('Search source records and research reports')).toHaveValue('');
  await expect(page.getByLabel('Record type', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Year', { exact: true })).toHaveValue('');
  await expect(page.getByLabel('Coverage', { exact: true })).toHaveValue('');
  await page.getByLabel('Record type', { exact: true }).selectOption('Inspection');
  await expect(report).toBeHidden();
  await expect(page).toHaveURL(/#source-lessons-report$/);
  const shortcut = page.locator('#research-shortcut[href="#source-lessons-report"]');
  if (hasTouch) await shortcut.tap(); else await shortcut.click();
  await expect(report).toBeVisible();
  await expect(report).toBeInViewport();
  await expect(page.getByLabel('Record type', { exact: true })).toHaveValue('');
});

test('Source search, combined filters, empty state and clear remain usable', async ({ page }) => {
  await page.goto('/evidence.html#records');
  const total = await page.locator('.source-card').count();
  await expect(page.locator('#result-count')).toHaveText(`${total} of ${total} records`);
  await page.getByLabel('Search source records and research reports').fill('Ofsted');
  expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
  expect(await page.locator('.source-card:visible').count()).toBeLessThan(total);
  await page.getByLabel('Record type', { exact: true }).selectOption('Inspection');
  await page.getByLabel('Year', { exact: true }).selectOption('2003');
  await expect(page.locator('.source-card:visible')).toHaveCount(1);
  await expect(page.locator('.source-card:visible h3')).toContainText('First Ofsted inspection');
  await expect(page).toHaveURL(/q=Ofsted/);
  await page.reload();
  await expect(page.getByLabel('Search source records and research reports')).toHaveValue('Ofsted');
  await expect(page.locator('.source-card:visible')).toHaveCount(1);
  await page.getByLabel('Search source records and research reports').fill('no-record-can-match-this-test-phrase');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('.source-card:visible')).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('.source-card:visible')).toHaveCount(total);
  await expect(page.locator('#no-results')).toBeHidden();
  await expect(page.getByLabel('Search source records and research reports')).toBeFocused();
});

test('Direct evidence references remain visible when URL filters exclude them', async ({ page }) => {
  await page.goto('/evidence.html?q=no-record-can-match-this-test-phrase#source-inspection-2003');
  await expect(page.locator('#source-inspection-2003')).toBeVisible();
  await expect(page.locator('#source-inspection-2003')).toBeInViewport();
  await expect(page.getByLabel('Search source records and research reports')).toHaveValue('');
});

test('New source terms find the appropriate reviewed records without counting explanation links', async ({ page }) => {
  await page.goto('/evidence.html#records');
  const search = page.getByLabel('Search source records and research reports');
  await expect(search).toHaveAttribute('aria-describedby', 'record-search-help');
  await expect(page.locator('#record-search-help')).toContainText(/not the full text of linked documents or every website answer/i);
  for (const [term, record] of [
    ['reserves', 'source-school-balances-mar-2026'],
    ['amalgamation', 'source-prescribed-alterations-2025'],
    ['equality', 'source-school-organisation-eina-2026'],
    ['PFI', 'source-kew-finance-expenditure-history'],
  ]) {
    await search.fill(term);
    await expect(page.locator(`#${record}`)).toBeVisible();
    await expect(page.locator('#no-results')).toBeHidden();
    await expect(page.locator('.evidence-answer-links a')).toHaveCount(4);
    await expect(page.locator('.evidence-answer-links a').first()).toBeVisible();
  }
  await search.fill('nothing-in-this-source-register');
  await expect(page.locator('#no-results')).toBeVisible();
  await expect(page.locator('.evidence-answer-links a').first()).toBeVisible();
  await page.locator('#no-results a[href="evidence.html#records"]').click();
  await expect(search).toHaveValue('');
  await expect(page.locator('#result-count')).toHaveText('57 of 57 records');
  await expect(page.locator('#no-results')).toBeHidden();
});

test('Evidence arrival exposes explanations and source search at narrow width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/evidence.html#records');
  await expect(page.locator('#evidence-explainer-title')).toBeInViewport();
  await expect(page.getByLabel('Search source records and research reports')).toBeInViewport();
  await expect(page.locator('.evidence-answer-links a')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('Evidence gaps show dated requests without treating dispatch as disclosure', async ({ page }) => {
  await page.goto('/evidence.html#gap-budget');
  await expect(page.locator('#gaps .section-heading')).toContainText('Request dates record dispatch, not disclosure or agreement');
  for (const [id, subject] of [
    ['gap-budget', /budget.*forecast/i],
    ['gap-alternatives', /options appraisal/i],
    ['gap-closure-costs', /cost comparison/i],
    ['gap-forecasts', /forecast versions/i],
    ['gap-pupil-impacts', /equality assessment/i],
  ]) {
    const note = page.locator(`#${id} .request-status`);
    await expect(note).toContainText('Requested 23 September 2026');
    await expect(note).toContainText(subject);
    await expect(note).not.toContainText(/FS-Case|Stoneman|@/i);
  }
});

test('New source anchors recover from incompatible saved filters and repeat visits', async ({ page }) => {
  const source = page.locator('#source-school-balances-mar-2026');
  await page.goto('/evidence.html?q=impossible-source-query&type=Inspection#source-school-balances-mar-2026');
  await expect(source).toBeVisible();
  await expect(source).toBeInViewport();
  await expect(page.getByLabel('Search source records and research reports')).toHaveValue('');
  await page.getByLabel('Record type', { exact: true }).selectOption('Inspection');
  await expect(source).toBeHidden();
  await page.locator('#gap-budget a[href="#source-school-balances-mar-2026"]').click();
  await expect(source).toBeVisible();
  await expect(source).toBeInViewport();
  await expect(page.getByLabel('Record type', { exact: true })).toHaveValue('');
});

test('Each source filter independently updates visible records', async ({ page }) => {
  for (const [label, value] of [['Topic', 'Funding & buildings'], ['Coverage', 'Index only'], ['Record type', 'Official dataset']]) {
    await page.goto('/evidence.html#records');
    const total = await page.locator('.source-card').count();
    await page.getByLabel(label, { exact: true }).selectOption(value);
    expect(await page.locator('.source-card:visible').count()).toBeGreaterThan(0);
    expect(await page.locator('.source-card:visible').count()).toBeLessThan(total);
    await expect(page.locator('.source-card:visible').first()).toContainText(value);
  }
});

test('Checklist downloads as PDF and source index as CSV', async ({ page }) => {
  for (const [entry, name, filename, signature] of [
    ['/options.html#options', 'Download the checklist (PDF)', 'kew-riverside-response-checklist.pdf', '%PDF-'],
    ['/evidence.html#records', 'Download the source index (CSV)', 'kew-riverside-source-index.csv', '"Title","Publisher"'],
  ]) {
    await page.goto(entry);
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
  await page.goto('/evidence.html#evidence');
  await page.locator('#borough-context > summary').click();
  const tables = page.locator('details.data-table');
  expect(await tables.count()).toBeGreaterThan(0);
  for (const details of await tables.all()) {
    await details.locator('summary').click();
    await expect(details.locator('table')).toBeVisible();
    expect(await details.locator('tbody tr').count()).toBeGreaterThan(0);
  }
  await page.goto('/options.html#option-enrolment');
  const campaign = page.locator('#option-enrolment');
  await campaign.locator('summary').click();
  await expect(campaign.getByRole('heading', { name: 'A practical first step' })).toBeVisible();
  await campaign.getByRole('link', { name: /Offer campaign help/ }).click();
  await expect(page).toHaveURL(/about.html#contact$/);
  await expect(page.locator('#contact')).toBeInViewport();
});
