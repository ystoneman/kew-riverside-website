// TEMPORARY DIAGNOSTIC, NOT FOR MERGE. Times each legacy redirect with a 40 s budget
// to learn whether a stalled redirect is late or never completes, and tags each
// visit with ?probe= (homepage.js preserves the query) to find it in the server log.
const { test, expect } = require('./fixtures');

const legacyDestinations = [
  ['evidence', 'evidence.html'], ['school-roll-title', 'evidence.html'], ['borough-context', 'evidence.html'],
  ['timeline', 'evidence.html'], ['earlier-record', 'evidence.html'], ['records', 'evidence.html'],
  ['source-lessons-report', 'evidence.html'], ['source-inspection-2003', 'evidence.html'], ['source-inspection-2026', 'evidence.html'],
  ['source-consultation-response', 'evidence.html'], ['gaps', 'evidence.html'], ['method', 'evidence.html'],
  ['options', 'options.html'], ['option-recovery-plan', 'options.html'], ['option-crowdfunding', 'options.html'],
  ['crowdfunding-recipient', 'options.html'], ['option-demand', 'options.html'], ['option-enrolment', 'options.html'],
];

// Protocol logging replaces the trace; otherwise keep the suite's retain-on-failure trace.
test.use({ trace: process.env.KEW_DIAG_PROTOCOL === '1' ? 'off' : 'retain-on-failure' });

test('diag legacy redirects', async ({ page }, testInfo) => {
  test.setTimeout(600_000);
  const tag = `${testInfo.project.name}-${testInfo.repeatEachIndex}`;
  for (const [id, destination] of legacyDestinations) {
    const probe = `${tag}-${id}`;
    const started = Date.now();
    let error = '';
    try {
      await page.goto(`/index.html?probe=${probe}#${id}`, { timeout: 40_000 });
      await expect(page).toHaveURL(new RegExp(destination.replace('.', '\\.') + '\\?probe=' + probe + '#' + id + '$'));
    } catch (e) { error = e.message.split('\n')[0].slice(0, 120); }
    const ms = Date.now() - started;
    console.log(`DIAG ${JSON.stringify({ probe, t0: started, ms, ok: !error, error, worker: testInfo.workerIndex })}`);
    if (error) {
      // Does the same page recover on a new visit, or stay wedged?
      const again = Date.now();
      let retry = '';
      try { await page.goto(`/index.html?probe=${probe}-retry#${id}`, { timeout: 20_000 }); } catch (e) { retry = e.message.split('\n')[0].slice(0, 120); }
      console.log(`DIAG-RETRY ${JSON.stringify({ probe, t0: again, ms: Date.now() - again, ok: !retry, error: retry })}`);
      throw new Error(`Stalled redirect ${probe}: ${error}`);
    }
  }
});
