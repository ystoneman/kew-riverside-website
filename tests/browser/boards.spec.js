const { test, expect } = require('./fixtures');

const boards = [
  { file: 'feedback.html', resource: 'suggestions', list: '#suggestions-list', status: '#board-message', prefix: 'idea', review: 'AI reviewed', extra: { status: 'Received' } },
  { file: 'letters.html', resource: 'letters', list: '#letters-list', status: '#letters-message', prefix: 'letter', review: 'Human reviewed' },
  { file: 'supporters.html', resource: 'supporters', list: '#supporter-list', status: '#supporter-message', prefix: 'supporter', review: 'Confirmed with contributor; human reviewed' },
];

function boardData(board, entries) {
  const data = { version: 1, [board.resource]: entries };
  if (board.resource === 'supporters') Object.assign(data, { statementVersion: 'keep-open-2026-09-21', statement: 'We support keeping Kew Riverside Primary School open.' });
  return data;
}
function entry(board) {
  const item = { id: `${board.prefix}-0123456789ab`, date: '2026-09-21', review: board.review, displayName: 'Test contributor', ...board.extra };
  if (board.resource !== 'supporters') item.body = 'A synthetic contribution shown by a local test fixture.';
  return item;
}

async function readBoard(page, board, hasTouch) {
  if (board.resource !== 'suggestions') return;
  const summary = page.locator('#suggestions > summary');
  await expect(summary).toHaveText('Read reviewed ideas');
  await expect(page.locator('#suggestions')).not.toHaveAttribute('open', '');
  if (hasTouch) await summary.tap();
  else await summary.click();
  await expect(page.locator('#suggestions')).toHaveAttribute('open', '');
  await expect(page.locator(board.status)).toBeVisible();
}

for (const board of boards) {
  test(`${board.resource}: empty board explains its state without blocking the form`, async ({ page, hasTouch }) => {
    await page.route(`**/${board.resource}.json`, route => route.fulfill({ json: boardData(board, []) }));
    await page.goto('/' + board.file);
    await readBoard(page, board, hasTouch);
    await expect(page.locator(board.status)).toContainText(/No .*published yet/);
    await expect(page.locator('form button[type="submit"]')).toBeEnabled();
  });

  test(`${board.resource}: approved entry renders with a removal route`, async ({ page, hasTouch }) => {
    await page.route(`**/${board.resource}.json`, route => route.fulfill({ json: boardData(board, [entry(board)]) }));
    await page.goto('/' + board.file);
    await readBoard(page, board, hasTouch);
    await expect(page.locator(board.list)).toContainText('Test contributor');
    await page.locator(board.list).getByRole('link', { name: /remove|removal/ }).click();
    await expect(page).toHaveURL(new RegExp(board.resource === 'supporters' ? 'corrections.html\\?supporter=' : 'feedback.html\\?kind=privacy'));
    await expect(page.locator('textarea')).toHaveValue(new RegExp(`${board.prefix}-0123456789ab`));
  });

  test(`${board.resource}: unexpected private fields fail closed`, async ({ page, hasTouch }) => {
    const invalid = { ...entry(board), email: 'private@example.invalid' };
    await page.route(`**/${board.resource}.json`, route => route.fulfill({ json: boardData(board, [invalid]) }));
    await page.goto('/' + board.file);
    await readBoard(page, board, hasTouch);
    await expect(page.locator(board.status)).toContainText('could not be loaded');
    await expect(page.locator(board.list)).toBeEmpty();
    await expect(page.locator('body')).not.toContainText('private@example.invalid');
    await expect(page.locator('form button[type="submit"]')).toBeEnabled();
  });

  test(`${board.resource}: server failure leaves private intake usable`, async ({ page, hasTouch }) => {
    await page.route(`**/${board.resource}.json`, route => route.fulfill({ status: 503, body: 'Intentional test outage', headers: { 'X-Test-Fixture': 'intentional-error' } }));
    await page.goto('/' + board.file);
    await readBoard(page, board, hasTouch);
    await expect(page.locator(board.status)).toContainText('could not be loaded');
    await expect(page.locator('form button[type="submit"]')).toBeEnabled();
  });
}

test('Letter previews and boards render markup-shaped text as plain text', async ({ page }) => {
  const literal = '<strong>Literal test contribution, never HTML.</strong>';
  const board = boards.find(item => item.resource === 'letters');
  const sample = { ...entry(board), body: literal };
  await page.route('**/letters.json', route => route.fulfill({ json: boardData(board, [sample]) }));
  await page.goto('/letters.html');
  await expect(page.locator('#letters-list .suggestion-body')).toHaveText(literal);
  await expect(page.locator('#letters-list strong')).toHaveCount(0);
  await page.locator('#message').fill(literal);
  await expect(page.locator('#preview-body')).toHaveText(literal);
  await expect(page.locator('#preview-body strong')).toHaveCount(0);
});
