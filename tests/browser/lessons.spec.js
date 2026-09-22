const { test, expect } = require('./fixtures');
const { readFileSync } = require('node:fs');
const data = JSON.parse(readFileSync(require('node:path').join(__dirname, '../../lessons-data.json'), 'utf8'));
async function activate(locator, hasTouch) { if (hasTouch) await locator.tap(); else await locator.click(); }

test('Research: proposal offers a compact route to the optional catalogue and report', async ({ page, hasTouch }) => {
  await page.goto('/proposal.html#other-schools');
  const section = page.locator('#other-schools');
  await expect(section).toContainText('12 reprieves');
  await expect(section.locator('img')).toHaveCount(0);
  await activate(section.getByRole('link', { name: 'Explore lessons from other schools' }), hasTouch);
  await expect(page).toHaveURL(/lessons.html$/);
  expect((await page.locator('h1').innerText()).replace(/\s+/g,' ').trim()).toBe('What can other schools teach us?');
  await expect(page.locator('.lesson-exhibit')).toHaveCount(8);
  await expect(page.locator('.lesson-exhibit[open]')).toHaveCount(0);
  const download = page.waitForEvent('download');
  await page.getByRole('link', { name: 'Download full report (PDF)', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('lessons-report.pdf');
});

test('Research: all eight graphics expand with readable data, sources and working downloads', async ({ page, hasTouch, request }) => {
  await page.goto('/lessons.html#visual-guide');
  for (const e of data.exhibits) {
    const exhibit = page.locator(`#exhibit-${e.number}`);
    await activate(exhibit.locator(':scope > summary'), hasTouch);
    await expect(exhibit).toHaveAttribute('open', '');
    const img = exhibit.locator('img');
    await expect(img).toBeVisible();
    await expect.poll(() => img.evaluate(node => node.complete && node.naturalWidth > 0)).toBe(true);
    const notes = exhibit.locator('.lesson-data');
    await activate(notes.locator('summary'), hasTouch);
    await expect(notes).toHaveAttribute('open', '');
    await expect(notes).toContainText(/\S/);
    const res = await request.get(`/lessons-${e.file}.png`);
    expect(res.ok()).toBe(true); expect(res.headers()['content-type']).toContain('image/png');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    for (const region of await notes.getByRole('region').all()) {
      await expect(region).toHaveAttribute('tabindex', '0');
      const dimensions = await region.evaluate(el => ({ width: el.clientWidth, full: el.scrollWidth }));
      if (dimensions.full > dimensions.width) {
        await region.evaluate(el => { el.scrollLeft = 100; });
        expect(await region.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
      }
    }
    await activate(exhibit.locator(':scope > summary'), hasTouch);
  }
});

test('Research: search and outcome filters combine, show no results and clear accessibly', async ({ page }) => {
  await page.goto('/lessons.html#catalogue');
  await expect(page.locator('.lesson-case:not([hidden])')).toHaveCount(16);
  await page.locator('#lesson-search').fill('Lambeth');
  await expect(page.locator('.lesson-case:not([hidden])')).toHaveCount(3);
  await page.locator('#lesson-outcome').selectOption('closure');
  await expect(page.locator('#lesson-empty')).toBeVisible();
  await expect(page.locator('#lesson-count')).toHaveText('0 schools shown');
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.locator('#lesson-search')).toBeFocused();
  await expect(page.locator('.lesson-case:not([hidden])')).toHaveCount(16);
  await page.locator('#lesson-outcome').selectOption('closure');
  await expect(page.locator('.lesson-case:not([hidden])')).toHaveCount(4);
});

test('Research: direct case and evidence links reveal disclosures and restore filtered cases', async ({ page }) => {
  await page.goto('/lessons.html#case-hazlewood');
  await expect(page.locator('#case-hazlewood')).toHaveAttribute('open','');
  await expect(page.locator('#case-hazlewood')).toContainText(/renewed/i);
  await page.locator('#lesson-outcome').selectOption('closure');
  await page.evaluate(() => { location.hash = '#case-pooles'; });
  await expect(page.locator('#case-pooles')).toHaveAttribute('open','');
  await expect(page.locator('#case-pooles')).toBeVisible();
  await expect(page.locator('#lesson-outcome')).toHaveValue('all');
  await page.goto('/lessons-sources.html#X04');
  await expect(page.locator('#X04')).toHaveAttribute('open','');
  await expect(page.locator('#X04')).toBeInViewport();
  await page.locator('#X04 a[href="lessons-sources.html#S01"]').click();
  await expect(page.locator('#S01')).toBeInViewport();
});

test('Research: keyboard disclosures and full citation register remain accessible', async ({ page }) => {
  await page.goto('/lessons.html');
  const summary = page.locator('#exhibit-4 > summary');
  await summary.focus();await page.keyboard.press('Enter');
  await expect(page.locator('#exhibit-4')).toHaveAttribute('open','');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('#exhibit-4')).not.toHaveAttribute('open','');
  await page.goto('/lessons-sources.html');
  expect((await page.locator('h1').innerText()).replace(/\s+/g,' ').trim()).toBe('Follow every claim back to its source.');
  await expect(page.locator('.lesson-source')).toHaveCount(45);
  await expect(page.locator('.lesson-claim')).toHaveCount(49);
  for (const s of data.sources) await expect(page.locator(`#${s.id} .lesson-full-url`)).toHaveAttribute('href',s.url);
});
