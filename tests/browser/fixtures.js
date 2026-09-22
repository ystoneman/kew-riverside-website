const { test: base, expect } = require('@playwright/test');
const { readdirSync, readFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '../..');
// New public pages automatically inherit the navigation and layout checks.
const pages = readdirSync(root).filter(name => name.endsWith('.html')).sort();
function headerLinks(file, selector) {
  const html = readFileSync(path.join(root, file), 'utf8');
  const className = selector === 'mobile' ? 'mobile-menu' : 'desktop-explore';
  const container = html.match(new RegExp(`<${selector === 'mobile' ? 'details' : 'nav'}\\b[^>]*class="[^"]*\\b${className}\\b[^\"]*"[^>]*>([\\s\\S]*?)</${selector === 'mobile' ? 'details' : 'nav'}>`));
  if (!container) throw new Error(`${file} has no ${selector} navigation; review its navigation coverage.`);
  const links = [...container[1].matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1].replaceAll('&amp;', '&'));
  if (!links.length) throw new Error(`${file} has no ${selector} navigation links.`);
  return links;
}

const test = base.extend({
  // An unexpected external request fails the test and is aborted before sending.
  // Form tests install a more specific page route that returns a local fake response.
  networkGuard: [async ({ context, baseURL }, use) => {
    const unexpected = [];
    await context.route('**/*', async route => {
      const request = route.request();
      if (new URL(request.url()).origin === new URL(baseURL).origin && ['GET', 'HEAD'].includes(request.method())) {
        // Real published letters are not test fixtures or screenshot content.
        // Board journeys supply their own fictional page-level fixtures.
        if (new URL(request.url()).pathname === '/letters.json') {
          await route.fulfill({ json: { version: 1, letters: [] } });
        } else {
          await route.continue();
        }
      } else {
        unexpected.push(`${request.method()} ${request.url()}`);
        await route.abort('blockedbyclient');
      }
    });
    await use();
    expect(unexpected, 'No real submissions, analytics or other external traffic during tests').toEqual([]);
  }, { auto: true }],
  browserErrors: [async ({ page }, use) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && response.headers()['x-test-fixture'] !== 'intentional-error') errors.push(`HTTP ${response.status()}: ${response.url()}`);
    });
    page.on('requestfailed', request => {
      const message = request.failure()?.errorText || 'Request failed';
      // Navigation may cancel an in-flight read. Documents also use a cancellation
      // when a download starts; neither is a missing runtime dependency.
      if (['script', 'stylesheet', 'image', 'fetch', 'xhr'].includes(request.resourceType()) && !/aborted|cancelled|canceled/i.test(message)) errors.push(`${message}: ${request.url()}`);
    });
    await use();
    expect(errors, 'No uncaught browser JavaScript errors').toEqual([]);
  }, { auto: true }],
});

async function expectDestination(page, href, baseURL) {
  const expected = new URL(href, baseURL + new URL(page.url()).pathname);
  await expect(page).toHaveURL(expected.href);
  await expect(page.locator('main')).toBeVisible();
  if (expected.hash) {
    const target = page.locator(expected.hash);
    await expect(target).toBeVisible();
    await expect(target).toBeInViewport();
  }
}

async function captureSubmissions(page) {
  const submissions = [];
  await page.route('https://formspree.io/**', async route => {
    const request = route.request();
    expect(request.url()).toBe('https://formspree.io/f/mwlpollw');
    expect(request.method()).toBe('POST');
    submissions.push(new URLSearchParams(request.postData() || ''));
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Test capture only</title><p>Submission intercepted locally. Nothing was sent.</p>' });
  });
  return submissions;
}

module.exports = { test, expect, pages, headerLinks, expectDestination, captureSubmissions };
