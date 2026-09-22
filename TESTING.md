# Testing the website

The suite covers the site's main visitor journeys across Chromium and WebKit, with touch, keyboard and JavaScript-disabled cases. It does not establish that every possible device, browser, assistive technology or third-party service works. Xcode Simulator Safari is checked separately for mobile interaction changes.

## Run locally

Use Node.js 24, Python 3 and OpenSSL. From this repository:

```sh
npm ci --ignore-scripts
npx playwright install chromium webkit
python3 -m unittest discover -s .github/scripts -p 'test_*.py' -v
python3 .github/scripts/check_site.py
npm test
```

On Linux, install browser system dependencies with `npx playwright install --with-deps chromium webkit` instead. `npm run test:iphone` runs the iPhone WebKit project; `npm run test:report` opens the generated browser report. Reports, traces, screenshots, downloaded test files and dependencies are ignored by Git and excluded from deployment.

The browser harness serves the site locally, uses fictional form inputs, and intercepts external requests. It never delivers a test submission to Formspree. Hosted CAPTCHA, real inbox delivery, council submission and real contribution moderation are outside the automated suite.

## Coverage and maintenance

| Area | Checks |
| --- | --- |
| Shared navigation | Mobile touch links on every public page; participation actions; keyboard focus and dismissal; desktop links; JavaScript-disabled fallback |
| Responsive layout | Narrow/mobile and desktop layouts; horizontal overflow and usable navigation |
| Contributions | Entry routes, feedback categories, private-only funding/privacy behaviour, previews, validation and independent letter consents |
| Evidence | Search/filter/reset journeys and visitor download formats |
| Site integrity | Local links/anchors, source consistency, resource loading and script errors |
| Security and privacy | Public data schemas, private-field rejection, consent defaults, local script allowlist, restrictive CSP and explicit deployment artifact contents |

Public pages and navigation links are discovered from the site rather than maintained as a separate fixed page count. When adding a feature, add tests for its user-visible success, invalid/empty state and important privacy choices. Include a test that would catch a reported bug before fixing it. Add source or chart checks when changing the underlying data contract. Keep test expectations independent of implementation details where possible.

Every pull request and push runs the suite. The Pages deployment requires both the security/asset validation job and browser-test job to pass. Failures retain a browser report and diagnostic artifacts in GitHub Actions for seven days.

## Manual iOS Safari check

Use the Xcode iPhone simulator and record the model and iOS version. For navigation changes:

1. Open the contribution page in Safari, tap Menu, then test each destination: Home, Proposal & dates, The numbers, Who decides, About and Evidence.
2. Confirm the expected page or anchored section appears, and the menu closes after selection. Return with Safari Back and repeat. Also test the same-page anchors on the homepage.
3. Check Letters and Contribute, tapping outside the menu, reopening/closing it, scrolling and portrait/landscape layouts.
4. Inspect contribution forms and the onscreen keyboard without sending a real submission. Automated tests cover intercepted form submissions separately.
5. Repeat the reported failing journey on the deployed HTTPS site. Confirm the updated script is served; retain relevant screenshots outside the public repository.

For local manual HTTP previews, Safari's `upgrade-insecure-requests` policy upgrades subresources to HTTPS. A local-only preview may omit that directive in its responses, but must not change the published HTML. The automated HTTPS harness preserves the production CSP. Final live-site checks use the full production policy.

## Safari menu regression — 22 September 2026

The original menu closed on `focusout`, even when Safari supplied no next focused element. On an iPhone 17 simulator running iOS 26.5, tapping Proposal & dates from the contribution menu closed the menu without navigating. The fix closes it when focus actually arrives outside the menu instead. Touch activation, outside dismissal, keyboard movement, Escape and desktop resize are regression cases. The navigation script URL is versioned so browsers can fetch the correction even if they have cached the previous script.
