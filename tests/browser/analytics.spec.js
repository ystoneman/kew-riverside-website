const { test, expect, captureSubmissions, revealLetterChoices } = require('./fixtures');
const { readFileSync, readdirSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
const origin = 'https://ystoneman.github.io';
const prefix = '/kew-riverside-website/';
const site = origin + prefix;
const endpoint = 'https://cloud.umami.is/api/send';
const choiceKey = 'kew-analytics-choice-v1';
const fakeConfig = { enabled: true, websiteId: '01234567-89ab-4cde-8123-456789abcdef' };
const officialForm = 'https://docs.google.com/forms/d/e/1FAIpQLSda5oPsdUlrJkf6vACC_AjvXFR6-ki3iBymNIF5BAWNxf85xQ/viewform';
const sentinel = 'FICTIONAL_PRIVATE_VALUE_NEVER_SEND_84';
const types = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.csv': 'text/csv',
  '.ico': 'image/x-icon',
};
const localAssets = new Set(readdirSync(root).filter(name => types[path.extname(name)]));
const emptyBoards = {
  'letters.json': { version: 1, letters: [] },
  'suggestions.json': { version: 1, suggestions: [] },
  'supporters.json': {
    version: 1, statementVersion: 'keep-open-2026-09-21',
    statement: 'We support keeping Kew Riverside Primary School open.', supporters: [],
  },
};

// Exercise the production hostname gate without contacting the live website or
// analytics service. The shared networkGuard remains active underneath these
// exact, local-fixture routes. No real board entries enter this suite.
async function virtualProduction(context, options = {}) {
  const sent = [];
  const configReads = [];
  const servedPrefix = options.prefix || prefix;
  await context.route(origin + '/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    expect(request.method(), 'Virtual production serves only local GET assets').toBe('GET');
    expect(url.pathname.startsWith(servedPrefix)).toBe(true);
    const relative = decodeURIComponent(url.pathname.slice(servedPrefix.length));
    const name = relative || 'index.html';
    expect(name, 'No nested paths or traversal in the fixture server').toMatch(/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/);
    expect(localAssets.has(name), 'Only an existing local static asset can be served: ' + name).toBe(true);
    if (name === 'analytics-config.json') {
      configReads.push(request.url());
      if (options.configFailure) {
        await route.fulfill({ status: 503, body: 'Intentional local config outage', headers: { 'X-Test-Fixture': 'intentional-error' } });
      } else {
        await route.fulfill({ json: options.config === undefined ? fakeConfig : options.config });
      }
    } else if (Object.hasOwn(emptyBoards, name)) {
      await route.fulfill({ json: emptyBoards[name] });
    } else {
      await route.fulfill({ contentType: types[path.extname(name)], body: readFileSync(path.join(root, name)) });
    }
  });
  await context.route(endpoint, async route => {
    const request = route.request();
    expect(request.method()).toBe('POST');
    sent.push({ body: request.postDataJSON(), headers: request.headers() });
    if (options.collectorFailure) {
      await route.fulfill({ status: 503, body: 'Intentional local collector outage', headers: { 'X-Test-Fixture': 'intentional-error' } });
    } else {
      await route.fulfill({ json: { cache: 'fictional-test-session-only' } });
    }
  });
  return { sent, configReads };
}

async function savedChoice(page, choice = 'allow', until = 'future') {
  await page.addInitScript(({ key, value, expiry }) => {
    localStorage.setItem(key, JSON.stringify({ v: 1, choice: value, until: Date.now() + (expiry === 'future' ? 86_400_000 : -1000) }));
  }, { key: choiceKey, value: choice, expiry: until });
}

async function choices(page) {
  await page.getByRole('link', { name: 'Analytics choices', exact: true }).click();
  const panel = page.locator('#analytics-panel');
  await expect(panel).toBeVisible();
  return panel;
}

const ALLOW = 'Allow detailed usage';
const BASIC = 'Basic counts only';
const OFF = 'Turn analytics off';

async function allowAnalytics(page) {
  const panel = await choices(page);
  await expect(panel.getByRole('button', { name: ALLOW, exact: true })).toBeEnabled();
  await panel.getByRole('button', { name: ALLOW, exact: true }).click();
  await expect(panel).toBeHidden();
}

function pageViews(sent) {
  return sent.filter(item => !item.body.payload.name);
}

function events(sent, name) {
  return sent.filter(item => item.body.payload.name === name).map(item => item.body.payload.data);
}

// Timers use Playwright's clock. Focus/visibility are explicitly simulated only
// in timing tests, so they do not claim to validate native browser tab lifecycle.
// Section visibility itself uses the real page layout and scrolling.
async function simulatedAttentionState(page) {
  await page.addInitScript(() => {
    window.analyticsFixtureVisible = 'visible';
    window.analyticsFixtureFocused = true;
    Object.defineProperty(document, 'visibilityState', { get: () => window.analyticsFixtureVisible });
    Object.defineProperty(document, 'hasFocus', { value: () => window.analyticsFixtureFocused });
  });
}

async function controlledAttention(page) {
  await simulatedAttentionState(page);
  await page.clock.install({ time: new Date('2026-09-22T12:00:00Z') });
  // Freeze before navigation: pausing after an already-consented page loads
  // would legitimately run a first interval while advancing the clock.
  await page.clock.pauseAt(new Date('2026-09-22T12:00:10Z'));
}

async function freezeAfterLoad(page) {
  // The choices panel is created but stays detached until someone opens it.
  await expect(page.locator('#analytics-panel')).toHaveCount(0);
}

test('A basic page view is sent without a banner, stored choice or detailed events', async ({ page, context }) => {
  const { sent, configReads } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site);
  await freezeAfterLoad(page);
  await expect(page.locator('.analytics-invitation')).toHaveCount(0);
  await expect(page.locator('#analytics-panel')).toBeHidden();
  await expect.poll(() => sent.length).toBe(1);
  expect(configReads).toHaveLength(1);
  expect(sent[0].body).toEqual({ type: 'event', payload: {
    website: fakeConfig.websiteId, hostname: 'ystoneman.github.io',
    url: prefix, title: 'Home & evidence', referrer: '',
  } });
  expect(sent[0].headers).not.toHaveProperty('cookie');
  expect(sent[0].headers).not.toHaveProperty('referer');
  expect(sent[0].headers).not.toHaveProperty('authorization');
  expect(await page.evaluate(key => localStorage.getItem(key), choiceKey)).toBeNull();
  expect(await page.context().cookies()).toEqual([]);
  // Viewing time, sections and actions are detailed usage: never sent by default.
  await page.locator('#evidence').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.clock.runFor(310_000);
  const download = page.waitForEvent('download');
  await page.locator('a[download][href="response-checklist.pdf"]').first().click();
  await download;
  expect(sent).toHaveLength(1);
  const panel = await choices(page);
  await expect(panel.getByRole('heading')).toBeFocused();
  await expect(panel.getByRole('status')).toContainText('basic page counts only');
  await expect(panel.getByRole('button', { name: BASIC, exact: true })).toHaveAttribute('aria-pressed', 'true');
  for (const name of [ALLOW, BASIC, OFF]) {
    const button = panel.getByRole('button', { name, exact: true });
    await expect(button).toBeEnabled();
    expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
  }
  const styles = await panel.locator('.analytics-actions button:not([aria-pressed="true"])').evaluateAll(buttons => buttons.map(button => {
    const style = getComputedStyle(button);
    return { color: style.color, background: style.backgroundColor, weight: style.fontWeight };
  }));
  expect(styles[0]).toEqual(styles[1]);
});

test('Turning analytics off survives reload; detailed usage can later be allowed and reduced to basic', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site);
  await freezeAfterLoad(page);
  await expect.poll(() => sent.length).toBe(1);
  let panel = await choices(page);
  await panel.getByRole('button', { name: OFF, exact: true }).click();
  await expect(panel).toBeHidden();
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).choice, choiceKey)).toBe('deny');
  await page.reload();
  await freezeAfterLoad(page);
  await page.clock.runFor(30_000);
  expect(sent).toHaveLength(1);
  panel = await choices(page);
  await expect(panel.getByRole('status')).toContainText('analytics off');
  await expect(panel.getByRole('button', { name: OFF, exact: true })).toHaveAttribute('aria-pressed', 'true');
  await panel.getByRole('button', { name: ALLOW, exact: true }).click();
  await expect.poll(() => pageViews(sent).length).toBe(2);
  await page.clock.runFor(15_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  panel = await choices(page);
  await panel.getByRole('button', { name: BASIC, exact: true }).click();
  const atReduction = sent.length;
  await page.evaluate(() => window.dispatchEvent(new Event('pointerdown')));
  await page.clock.runFor(300_000);
  expect(sent).toHaveLength(atReduction);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).choice, choiceKey)).toBe('basic');
});

test('Turning analytics off in one tab stops the other tab and updates its visible choice', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site);
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await expect.poll(() => sent.length).toBe(1);
  const other = await context.newPage();
  // Playwright's clock belongs to the entire context: do not reinstall it
  // while the first tab already has a running interval.
  await simulatedAttentionState(other);
  await other.goto(site + 'faq.html');
  await freezeAfterLoad(other);
  await expect.poll(() => sent.length).toBe(2);
  const firstPanel = await choices(page);
  await firstPanel.getByRole('button', { name: OFF, exact: true }).click();
  const otherPanel = await choices(other);
  await expect(otherPanel.getByRole('status')).toContainText('analytics off');
  await otherPanel.getByRole('button', { name: 'Close analytics choices' }).click();
  await other.clock.runFor(30_000);
  expect(sent).toHaveLength(2);
  await other.close();
});

for (const operation of ['getItem', 'setItem']) {
  test(`Analytics fails closed when localStorage.${operation} is unavailable`, async ({ page, context }) => {
    const { sent } = await virtualProduction(context);
    await page.addInitScript(method => {
      Storage.prototype[method] = () => { throw new DOMException('Fictional blocked storage', 'SecurityError'); };
    }, operation);
    await page.goto(site);
    const panel = await choices(page);
    // An unreadable objection cannot be honoured, so nothing is counted. When only
    // saving fails, the default page view precedes the failed attempt to save.
    const expected = operation === 'getItem' ? 0 : 1;
    await expect.poll(() => sent.length).toBe(expected);
    if (operation === 'setItem') await panel.getByRole('button', { name: ALLOW, exact: true }).click();
    await expect(panel.getByRole('status')).toContainText('could not save a choice');
    for (const name of [ALLOW, BASIC, OFF]) await expect(panel.getByRole('button', { name, exact: true })).toBeDisabled();
    expect(sent).toHaveLength(expected);
  });
}

for (const signal of ['globalPrivacyControl', 'doNotTrack']) {
  test(`The ${signal} privacy signal blocks basic counts and an earlier allow choice`, async ({ page, context }) => {
    const { sent } = await virtualProduction(context);
    await savedChoice(page);
    await page.addInitScript(property => {
      Object.defineProperty(navigator, property, { value: property === 'doNotTrack' ? '1' : true });
    }, signal);
    await page.goto(site);
    const panel = await choices(page);
    await expect(panel.getByRole('status')).toContainText('privacy signal');
    await expect(panel.getByRole('button', { name: ALLOW, exact: true })).toBeDisabled();
    expect(sent).toEqual([]);
  });
}

test('An expired detailed-usage permission falls back to basic counts only', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await savedChoice(page, 'allow', 'past');
  await page.goto(site);
  await freezeAfterLoad(page);
  await expect.poll(() => sent.length).toBe(1);
  await page.clock.runFor(30_000);
  expect(sent).toHaveLength(1);
  expect(events(sent, 'Active viewing')).toEqual([]);
});

for (const state of ['disabled', 'invalid-id', 'unavailable']) {
  test(`Analytics stays disconnected with ${state} configuration`, async ({ page, context }) => {
    const config = state === 'disabled' ? { enabled: false, websiteId: fakeConfig.websiteId } : { enabled: true, websiteId: 'not-a-provider-id' };
    const { sent } = await virtualProduction(context, { config, configFailure: state === 'unavailable' });
    await savedChoice(page);
    await page.goto(site);
    const panel = await choices(page);
    await expect(panel.getByRole('status')).toContainText('not connected');
    await expect(panel.getByRole('button', { name: ALLOW, exact: true })).toBeDisabled();
    expect(sent).toEqual([]);
  });
}

test('Query strings, individual anchors, incoming private routes and search words never enter analytics', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await savedChoice(page);
  const sources = [
    ['https://accounts.example.invalid/reset?token=' + sentinel, 'https://external.example/'],
    [site + 'letters.html?reply=' + sentinel + '#letter-' + sentinel, prefix + 'letters.html'],
    [site + 'feedback.html?kind=privacy&message=' + sentinel, ''],
    [site + 'corrections.html?email=' + sentinel, ''],
    ['https://www.google.com/search?q=' + sentinel, 'https://www.google.com/'],
  ];
  for (const [index, [referer, expected]] of sources.entries()) {
    const count = sent.length;
    await page.goto(site + 'faq.html?fixture=' + index + '&email=' + sentinel + '#' + sentinel, { referer });
    await expect.poll(() => sent.length).toBe(count + 1);
    const payload = sent.at(-1).body.payload;
    expect(payload.url).toBe(prefix + 'faq.html');
    expect(payload.title).toBe('FAQ');
    expect(payload.referrer).toBe(expected);
  }
  await page.locator('input[type="search"]').fill(sentinel);
  await page.keyboard.press('Enter');
  await page.clock.runFor(15_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  expect(JSON.stringify(sent)).not.toContain(sentinel);
  for (const request of sent) expect(request.headers).not.toHaveProperty('referer');
});

test('Typed letter content and a successful intercepted submission are never analytics completion events', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  const submissions = await captureSubmissions(page);
  await controlledAttention(page);
  await page.goto(site + 'letters.html?email=' + sentinel + '#letter-' + sentinel);
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await expect.poll(() => sent.length).toBe(1);
  await page.locator('#message').fill('An entirely fictional test letter: ' + sentinel);
  await revealLetterChoices(page);
  await page.locator('#display-name').fill(sentinel);
  await page.locator('#email').fill(sentinel + '@example.invalid');
  await page.locator('#letter-consent').check();
  await page.getByRole('button', { name: 'Send my letter', exact: true }).click();
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0].get('message')).toContain(sentinel);
  expect(sent).toHaveLength(1);
  expect(JSON.stringify(sent)).not.toContain(sentinel);
  expect(events(sent, 'Action opened')).toEqual([]);
});

for (const file of ['feedback.html?kind=privacy', 'corrections.html']) {
  for (const saved of ['allow', null]) {
    test(`The entire private route ${file} stays unmeasured (${saved || 'default'} choice)`, async ({ page, context }) => {
      const { sent } = await virtualProduction(context);
      await controlledAttention(page);
      if (saved) await savedChoice(page, saved);
      await page.goto(site + file);
      await freezeAfterLoad(page);
      await page.locator('#message').fill('Fictional private request ' + sentinel);
      await page.clock.runFor(30_000);
      expect(sent).toEqual([]);
      const panel = await choices(page);
      await expect(panel.getByRole('status')).toContainText(file.startsWith('feedback') ? 'Share ideas page' : 'private request page');
      await expect(panel.locator('[aria-pressed="true"]')).toHaveCount(0);
      await panel.getByRole('button', { name: 'Close analytics choices' }).click();
      await page.getByRole('link', { name: 'FAQ', exact: true }).last().click();
      await expect.poll(() => sent.length).toBe(1);
      expect(sent[0].body.payload.referrer).toBe('');
      expect(events(sent, 'Action opened')).toEqual([]);
      expect(JSON.stringify(sent)).not.toContain(sentinel);
    });
  }
}

test('Real visible sections distinguish reaching, ten seconds of viewing and active page thresholds', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site + 'lessons.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await page.locator('#visual-guide').evaluate(element => element.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.clock.runFor(9000);
  await expect.poll(() => events(sent, 'Section reached')).toContainEqual({ section: 'visual-guide' });
  expect(events(sent, 'Section viewed 10s')).toEqual([]);
  expect(events(sent, 'Active viewing')).toEqual([]);
  await page.clock.runFor(1000);
  await expect.poll(() => events(sent, 'Section viewed 10s')).toEqual([{ section: 'visual-guide' }]);
  await page.clock.runFor(5000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  await page.clock.runFor(15_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }, { seconds: 30 }]);
  for (let interval = 0; interval < 9; interval += 1) {
    await page.evaluate(() => window.dispatchEvent(new Event('pointerdown')));
    await page.clock.runFor(30_000);
  }
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([15, 30, 60, 120, 300].map(seconds => ({ seconds })));
  expect(events(sent, 'Section viewed 10s')).toHaveLength(1);
  expect(events(sent, 'Section reached').filter(event => event.section === 'visual-guide')).toHaveLength(1);
});

test('Hidden, unfocused, idle and open-choice time is excluded from active viewing', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site + 'lessons.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await page.clock.runFor(5000);
  await page.evaluate(() => { window.analyticsFixtureVisible = 'hidden'; document.dispatchEvent(new Event('visibilitychange')); });
  await page.clock.runFor(120_000);
  expect(events(sent, 'Active viewing')).toEqual([]);
  await page.evaluate(() => { window.analyticsFixtureVisible = 'visible'; window.analyticsFixtureFocused = false; document.dispatchEvent(new Event('visibilitychange')); });
  await page.clock.runFor(30_000);
  expect(events(sent, 'Active viewing')).toEqual([]);
  await page.evaluate(() => { window.analyticsFixtureFocused = true; window.dispatchEvent(new Event('pointerdown')); });
  const panel = await choices(page);
  await page.clock.runFor(30_000);
  expect(events(sent, 'Active viewing')).toEqual([]);
  await panel.getByRole('button', { name: 'Close analytics choices' }).click();
  await page.clock.runFor(10_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  await page.evaluate(() => window.dispatchEvent(new Event('pointerdown')));
  await page.clock.runFor(180_000);
  const before = events(sent, 'Active viewing');
  expect(before).toEqual([{ seconds: 15 }, { seconds: 30 }, { seconds: 60 }]);
  await page.clock.runFor(120_000);
  expect(events(sent, 'Active viewing')).toEqual(before);
});

test('Search-hidden FAQ sections produce no reached or viewed event', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site + 'faq.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await page.locator('#faq-query').fill('fictional-no-matching-answer-91284');
  await expect(page.locator('#faq-empty')).toBeVisible();
  for (const id of ['taking-part', 'decisions', 'money', 'school-places', 'learning']) {
    await expect(page.locator('#' + id)).toBeHidden();
  }
  await page.clock.runFor(15_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  expect(events(sent, 'Section reached')).toEqual([]);
  expect(events(sent, 'Section viewed 10s')).toEqual([]);
});

test('A collector 503 leaves reading and revocation usable without retries', async ({ page, context }) => {
  const { sent } = await virtualProduction(context, { collectorFailure: true });
  await controlledAttention(page);
  await page.goto(site + 'lessons.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await expect.poll(() => sent.length).toBe(1);
  await expect(page.locator('main')).toBeVisible();
  await page.clock.runFor(5000);
  expect(sent.filter(request => !request.body.payload.name)).toHaveLength(1);
  const bodies = sent.map(request => JSON.stringify(request.body));
  expect(new Set(bodies).size, 'A failed event is never retried').toBe(bodies.length);
  const panel = await choices(page);
  await panel.getByRole('button', { name: OFF, exact: true }).click();
  const atRevocation = sent.length;
  await page.clock.runFor(300_000);
  expect(sent).toHaveLength(atRevocation);
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).choice, choiceKey)).toBe('deny');
});

test('A simulated back-forward-cache return sends a fresh page view and resets viewing thresholds', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site + 'lessons.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await page.clock.runFor(15_000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  // This verifies the lifecycle handler, not whether a browser chooses BFCache.
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide', { persisted: true })));
  const beforeReturn = sent.length;
  await page.clock.runFor(30_000);
  expect(sent).toHaveLength(beforeReturn);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true })));
  await expect.poll(() => sent.filter(request => !request.body.payload.name).length).toBe(2);
  await page.clock.runFor(14_000);
  expect(events(sent, 'Active viewing')).toEqual([{ seconds: 15 }]);
  await page.clock.runFor(1000);
  await expect.poll(() => events(sent, 'Active viewing')).toEqual([{ seconds: 15 }, { seconds: 15 }]);
});

test('An official-form handoff records a fixed opening label, never a completed response', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  const handoffs = [];
  await context.route(officialForm, async route => {
    handoffs.push(route.request().url());
    await route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Fictional form destination</title><p>Locally intercepted. No council service contacted.</p>' });
  });
  await page.goto(site + 'letters.html');
  await allowAnalytics(page);
  await page.locator('.official-notice a').first().click();
  await expect.poll(() => handoffs.length).toBe(1);
  await expect.poll(() => events(sent, 'Action opened')).toEqual([{ action: 'Opened official response form' }]);
  expect(JSON.stringify(sent)).not.toMatch(/submitted|completed|conversion|email|message|display_name/i);
  expect(JSON.stringify(sent)).not.toContain(officialForm);
});

test('A checklist download records a fixed click label once per page, without claiming completion', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site);
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  for (let click = 0; click < 2; click += 1) {
    const download = page.waitForEvent('download');
    await page.locator('a[download][href="response-checklist.pdf"]').click();
    expect((await download).suggestedFilename()).toBe('kew-riverside-response-checklist.pdf');
  }
  await expect.poll(() => events(sent, 'Action opened')).toEqual([{ action: 'Download clicked: checklist' }]);
  expect(JSON.stringify(sent)).not.toMatch(/downloaded|completed/i);
});

test('Opening consent controls and private request links adds no action label', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await controlledAttention(page);
  await page.goto(site + 'letters.html');
  await freezeAfterLoad(page);
  await allowAnalytics(page);
  await expect.poll(() => sent.length).toBe(1);
  const panel = await choices(page);
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(page.getByRole('link', { name: 'Analytics choices', exact: true })).toBeFocused();
  await page.locator('footer a[href="feedback.html"]').click();
  await expect(page).toHaveURL(site + 'feedback.html');
  expect(sent).toHaveLength(1);
  expect(events(sent, 'Action opened')).toEqual([]);
});

test('At 320px, the choices panel fits, keeps letter fields unobstructed and returns focus', async ({ page, context }) => {
  const { sent } = await virtualProduction(context);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(site + 'letters.html#letter-form');
  await expect.poll(() => sent.length).toBe(1);
  // The choices and Send step follow a written letter.
  await page.locator('#message').fill('An entirely fictional test letter for the layout check.');
  await revealLetterChoices(page);
  // With no banner, nothing fixed covers a keyboard-focused form field.
  await page.locator('#email').focus();
  await expect(page.locator('#email')).toBeInViewport();
  expect(await page.locator('#email').evaluate(input => {
    const rect = input.getBoundingClientRect();
    return document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2) === input;
  })).toBe(true);
  const panel = await choices(page);
  const box = await panel.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await panel.getByRole('button', { name: OFF, exact: true }).click();
  await expect(panel).toBeHidden();
  await expect(page.getByRole('link', { name: 'Analytics choices', exact: true })).toBeFocused();
  expect(sent).toHaveLength(1);
});

test('On the privacy page at 320px, How analytics works closes the panel to reveal the explanation', async ({ page, context }) => {
  await virtualProduction(context);
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto(site + 'privacy.html');
  const panel = await choices(page);
  await panel.getByRole('link', { name: 'How analytics works', exact: true }).click();
  await expect(panel).toBeHidden();
  await expect(page).toHaveURL(site + 'privacy.html#analytics');
  await expect(page.locator('#analytics h2')).toBeInViewport();
});

test('An enabled collector remains off on localhost', async ({ page }) => {
  const sent = [];
  await page.route('**/analytics-config.json', route => route.fulfill({ json: fakeConfig }));
  await page.route(endpoint, async route => { sent.push(route.request().postData()); await route.fulfill({ json: {} }); });
  await savedChoice(page);
  await page.goto('/index.html');
  const panel = await choices(page);
  await expect(panel.getByRole('button', { name: ALLOW, exact: true })).toBeEnabled();
  expect(sent).toEqual([]);
});

test('An enabled collector remains off elsewhere on the GitHub hostname', async ({ page, context }) => {
  const { sent } = await virtualProduction(context, { prefix: '/unrelated-project/' });
  await savedChoice(page);
  await page.goto(origin + '/unrelated-project/index.html');
  const panel = await choices(page);
  await expect(panel.getByRole('button', { name: ALLOW, exact: true })).toBeEnabled();
  expect(sent).toEqual([]);
});

test.describe('Analytics with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });
  test('The website remains usable and analytics choices lead to the privacy explanation', async ({ page, context }) => {
    const { sent, configReads } = await virtualProduction(context);
    await page.goto(site);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('.analytics-invitation, #analytics-panel')).toHaveCount(0);
    await page.getByRole('link', { name: 'Analytics choices', exact: true }).click();
    await expect(page).toHaveURL(site + 'privacy.html#analytics');
    await expect(page.locator('#analytics')).toBeVisible();
    expect(configReads).toEqual([]);
    expect(sent).toEqual([]);
  });
});
