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
| Discovery and FAQ | Parent-plan entry routes, PTA session dates, consent and deadline distinctions, optional further actions, reordered/searchable school-place answers; six homepage task routes; deadline links; 16 sourced answers; keyboard/native disclosures; search, no matches and reset; answer links/history; no-JavaScript use; historical record and six conditional future stages |
| Evidence | Search/filter/reset journeys and visitor download formats |
| School comparisons | Dated source sentinels; aggregate-only export; HTML/CSV/JSON agreement; count/percentage controls; local/borough tables; downloads; no-JavaScript and failed-script fallbacks |
| Historical school lessons | Eight chart/data disclosures and downloads; complete 16-case catalogue; search/outcome filters, empty/reset states; direct links; keyboard and no-JavaScript use; 45 sources / 49 claims; preserved denominators and forecasts |
| Parent Voices videos | Entry routes from letters/ideas; external permission, Dropbox and legacy Google handoffs intercepted locally; independent private-review explanation; native disclosures and keyboard/touch; private withdrawal route; written alternative; no-JavaScript access |
| Site integrity | Local links/anchors, source consistency, resource loading and script errors |
| Security and privacy | Public data schemas, private-field rejection, consent defaults, local script allowlist, restrictive CSP and explicit deployment artifact contents |

Public pages and navigation links are discovered from the site rather than maintained as a separate fixed page count. When adding a feature, add tests for its user-visible success, invalid/empty state and important privacy choices. Include a test that would catch a reported bug before fixing it. Add source or chart checks when changing the underlying data contract. Keep test expectations independent of implementation details where possible.

Every pull request and push runs the suite. The Pages deployment requires both the security/asset validation job and browser-test job to pass. Failures retain a browser report and diagnostic artifacts in GitHub Actions for seven days.

## Manual iOS Safari check

Use the Xcode iPhone simulator and record the model and iOS version. For navigation changes:

1. Open the contribution page in Safari, tap Menu, then test each destination: Home, Proposal & dates, Understand, FAQ, About and Evidence.
2. Confirm the expected page or anchored section appears, and the menu closes after selection. Return with Safari Back and repeat. Also test the same-page anchors on the homepage.
3. Check Community letters and Share ideas, tapping outside the menu, reopening/closing it, scrolling and portrait/landscape layouts.
4. Inspect contribution forms and the onscreen keyboard without sending a real submission. Automated tests cover intercepted form submissions separately.
5. Repeat the reported failing journey on the deployed HTTPS site. Confirm the updated script is served; retain relevant screenshots outside the public repository.

For local manual HTTP previews, Safari's `upgrade-insecure-requests` policy upgrades subresources to HTTPS. A local-only preview may omit that directive in its responses, but must not change the published HTML. The automated HTTPS harness preserves the production CSP. Final live-site checks use the full production policy.

## Safari menu regression — 22 September 2026

The original menu closed on `focusout`, even when Safari supplied no next focused element. On an iPhone 17 simulator running iOS 26.5, tapping Proposal & dates from the contribution menu closed the menu without navigating. The fix closes it when focus actually arrives outside the menu instead. Touch activation, outside dismissal, keyboard movement, Escape and desktop resize are regression cases. The navigation script URL is versioned so browsers can fetch the correction even if they have cached the previous script.

The first Linux CI run also caught an outside-tap dismissal failure on a noninteractive area in iPhone WebKit. Outside dismissal now handles pointerdown directly instead of relying only on a synthesized click. Link activation still uses its normal click, and pointerdown inside the menu does not close it. The outside-touch regression remains in the suite.

## School comparisons

The comparison builder’s freshness check runs within the Python tests. After an intentional data update, regenerate with `python3 .github/scripts/build_understand.py` and review independently pinned source expectations before changing them. Tests distinguish May 2025 capacity/roll from January 2026 cohorts, reconcile the two Thomson House sites, and preserve source-year school identifiers.

For manual mobile QA, open Understand from the contribution-page menu, switch Pupil numbers / Percentage change, expand each borough comparison, horizontally scroll a wide table, inspect cohort labels and follow a source link. Confirm date labels remain visible and charts remain readable at narrow widths. Record simulator checks separately from responsive browser screenshots and automated WebKit runs.

## Discovery and submissions update — 22 September 2026

`visitor-journeys.spec.js` covers the six homepage cards, meeting and response routes, all FAQ disclosures, keyword search and reset/no-match states, answer links and history, search-hidden topic recovery, the historical disclosure, and the conditional future timetable. The no-JavaScript project separately checks the FAQ’s native disclosures. The existing form suite covers all six categories, legacy category links, a private-by-default minimal submission, optional public details, preview email exclusion, funding/privacy resets and browser restoration. All external posts remain intercepted.

Keep new FAQ answers sourced and add tests for materially different interactions. Keep current-family closure transfers distinct from normal admissions, and keep projected/cumulative finances distinct from annual losses. Update the discovery guide and its destination tests together if the information architecture changes. Manual checks should include reading the school-choice and deficit answers on a narrow screen, searching, clearing and following an answer link from another page.


## Historical research maintenance

`lessons-data.json` is the reviewed public input. Rebuild the two pages with `python3 .github/scripts/build_lessons.py`; the Python tests enforce freshness, citation coverage, 12 reprieves / nine grouped episodes / four closures, financial inputs, petition denominators and the eight vector/high-resolution assets. The original editable research pack stays outside the public repository; only named site assets enter the deployment allowlist.

`lessons.spec.js` checks the compact proposal route, PDF download, all eight graphics and readable notes, native disclosure keyboard controls, search/outcome combinations, empty/reset state, hash-linked disclosures and the complete citations register. The wide tables must scroll within their labelled region without expanding the page, including on iPhone WebKit. The no-JavaScript suite independently checks native disclosures, cases, figures and source claims.

Manual check on 22 September 2026: iPhone 17 simulator, iOS 26.5 Safari, local preview. The menu navigated to Proposal & dates; the summary and financial/work-plan graphics were legible, touch disclosures opened/closed, Lambeth search produced three cases, the native closure picker produced four cases, and Clear filters restored all 16 and search focus. Portrait and landscape layouts were inspected. Automated browser checks separately cover table scrolling, downloads, source anchors and narrow layouts. No real forms were submitted.

## Video intake — 22 September 2026

All 528 browser checks and 29 Python checks passed; 64 public assets validated. The new Google handoff is intercepted in automated tests. The site does not host a duplicate upload input or embed the provider, so the external form requires separate manual checks.

In native iPhone 17 / iOS 26.5 Safari: inspect portrait/landscape page layout; open Menu and navigate to Proposal & dates; expand the permission disclosure; follow the video privacy anchor; tap Upload a video and confirm Google sign-in is required; return with Safari Back. These checks passed against the local allowlisted preview. Google form settings and private Drive folder permissions were inspected separately in the signed-in browser, and empty-form validation was checked. A complete synthetic upload could not be verified because the Chrome extension lacks file-URL permission. Do not report the website handoff tests as proof of backend delivery.

The first full run hit the pre-existing desktop WebKit validation-bubble issue in the supporter form. Dismissing the native bubble with Escape before the desktop label click retains all required-consent, focus, blocked-submit and checked-state assertions. Forty repeated cases and the final full suite passed; no product consent code was changed.


## Parent action plan — 22 September 2026

The parent-plan journeys cover the homepage and meeting-detail entries; five native step shortcuts; correct PTA preparation dates/times; separate council meeting and official-response deadline; adult video permission language; written/video/evidence/question routes; an intercepted official response handoff; optional additional actions; and the conditional school-place answer's retained anchor and search synonyms. The no-JavaScript project follows the native links and opens the extra-actions and school-place disclosures.

All 545 browser checks and 29 Python checks passed; 64 public assets validated. Immediate proposal/FAQ anchor navigation resolved the new JavaScript-disabled WebKit failure and passed three focused repetitions. A one-off existing desktop WebKit source-filter failure passed eight unchanged repetitions and the final full suite. Native iPhone 17 / iOS 26.5 Safari separately checked the homepage plan button, session-time shortcut, menu, additional-actions disclosure and school-place answer, with portrait/landscape visual review. No real consultation, video or other form was submitted.

## Dropbox video route — 22 September 2026

All 553 browser checks and 29 Python checks passed; 64 public assets validated. The browser suite intercepts the new permission form, Dropbox continuation and preserved Google upload destinations, checks separate permissions and unmatched-upload handling, and keeps no-JavaScript access. Native iPhone 17 / iOS 26.5 Safari followed the new permission form without Google sign-in, returned with Back, opened Dropbox and its Photo Library / Choose Files menu without an account, and checked portrait/landscape layout. The signed-out desktop permission form rejected an empty submission; no complete response or test video was sent. Provider settings and private destination were verified separately. These results do not establish completed backend file receipt. A one-off existing desktop WebKit funding-template check passed eight unchanged repetitions and the final full suite; no funding behavior or assertions were changed.

The Linux CI supporter-label failure exposed smooth scrolling during native validation. Contribution pages now scroll immediately; the regression retains all blocked-submit, required-consent, focus and label-click assertions and adds an in-viewport assertion. Eighty focused repetitions and the final 553-check browser suite passed with Node 24; all 29 Python checks and the 64-asset validation passed. Native iPhone video-route checks above are separate. A follow-up in a separate iPhone Air / iOS 26.5 Safari simulator used fictional name/email fields: missing consents blocked submission and tapping the first label selected its checkbox. The invalid checkbox did not automatically come into view; returning through the form anchor made it reachable. This check does not establish native scroll-to-invalid behavior. No completed form was submitted. After preserving the newer parent-plan navigation, all 562 browser checks and 29 Python checks passed locally and in the successful release workflow; 65 public assets validated.

## Report discovery — 22 September 2026

`evidence.spec.js` now starts at the homepage and checks the report's web route and PDF download, all remembered search terms, separate research/source counts, research-only filters, empty/reset states and recovery from incompatible filters on both direct and repeated anchors. `no-javascript.spec.js` follows the homepage and Evidence routes and downloads the PDF with scripting disabled. The original-source integrity checks still require HTML/JSON/CSV agreement for the unchanged 46 records.

All 587 browser checks and 29 Python checks passed; 67 public assets validated. Native iPhone Air / iOS 26.5 Safari separately checked the homepage report shortcut, web destination, Safari Back, PDF opening with a 44-page indicator, Evidence anchor and portrait/landscape layout against a local preview serving only public files. Automated emulation covers search/filter states, narrow layouts and downloads separately. No external forms were submitted.

Publication verification: the hosted checks passed in run 35750966395. Seven public files, including the new entry points and preserved PDF/web/proposal routes, returned HTTP 200 and matched commit `3d14a7e` byte for byte. The live Evidence search found the report; native iPhone Air / iOS 26.5 Safari followed the live homepage PDF link and displayed the 44-page document.


## Sofiya feedback: education and protected journeys — 22 September 2026

All 666 browser checks passed across touch Chromium/WebKit, desktop Chromium/WebKit and JavaScript-disabled iPhone WebKit with Node 24.19.0. All 40 Python checks and the 69-file public artifact validation passed. The new `sofiya.spec.js` covers contextual entries and Back, preserved section order/arrival priorities, all chart facets, independently pinned table/download values, keyboard disclosure operation, incoming/repeated/history table links, resolved inspection-gap/filter recovery, four appended FAQ answers, direct tour/admissions paths and contextual contribution permissions. Original FAQ answers and six homepage tasks remain independently pinned.

`test_learning.py` independently pins final DfE combined/subject expected and higher standards, older inspection subject values, the separate 2026 update, eligible counts and missing cells. It checks the minimal aggregate schema, exact source/status/locator provenance, all CSV rows, generated tables and chart geometry. Existing school-roll tests still validate their original four tables; the four additional attainment tables are checked separately. Regenerate both comparison exports through `build_understand.py`.

The new JavaScript-disabled direct visit-card journey failed three repetitions because its link would not settle for touch activation. `enrolment.css` now uses immediate scrolling when that card is the target; the unchanged regression and full suite passed. An initial focused desktop WebKit chart-link click failed once; four unchanged repetitions and the full run passed, so its cause was not established. No assertion was removed or relaxed to mask either outcome.

Independent rendered UX review inspected 320×568, 390×844 and desktop 1440×900, including readable stacked facets, keyboard horizontal table movement and FAQ search/recovery. The closed results-disclosure chart link was fixed in `understand.js` and rechecked through direct, repeated and history navigation. No-JavaScript visitors retain native summaries and downloads.

Separately, native iPhone Air / iOS 26.5 Safari checked learning-section arrival, chart readability, direct table URL expansion, touch collapse, the full inspection source link, Safari Back and portrait/landscape inspection-card layout. Temporarily enlarged Safari text remained readable and was reset afterwards. Native horizontal table swiping could not be established with the available input interaction; automated WebKit and rendered Chrome keyboard checks cover scrolling independently. The native preview served only public allowlisted files with the documented local-only HTTP CSP adjustment. No external forms or videos were submitted. Hosted run 35762169088 passed the same 666 browser/40 Python checks and deployed commit `bc80fbb`. Seventeen live files matched it byte for byte; native Safari separately followed the published visit-card learning link. Full delivery evidence is in `CHANGELOG.md`.

## Appearance preferences — 22 September 2026

`theme.spec.js` covers all 13 pages in system dark/light, visible HTML text contrast, canvas colour, 44px selector size, manual persistence across reload/page/Back, other-tab changes, invalid/blocked storage, JavaScript-disabled system matching, print-light output, unchanged permission defaults, form focus/disclosures, chart keys/forecast markers/series, preserved graphics and 320px parent-plan/menu access. External requests remain intercepted. The contrast audit paints the document before measurement; it is not a complete assistive-technology or image-contrast audit. SVG series/labels and download images have separate checks and visual review.

The initial WebKit runs exposed incomplete root-variable inheritance on later descendants and a native select that ignored the intended minimum size. The palette is also declared on body, and a styled arrow replaces only the native select appearance while preserving its semantics and picker. Three repeated footer cases and all 88 focused appearance cases passed after these corrections. No existing assertion or consent behaviour was weakened.

Native iPhone Air / iOS 26.5 Safari separately checked the footer picker, Dark and System selection, persistence onto the letter form, touch focus with a visible outline, and portrait/landscape reading. With System selected, changing the simulated iPhone’s own appearance switched the page to dark without reloading, then back to light. The original light setting and normal portrait orientation were restored. No form was submitted; the software keyboard was not shown in this simulator configuration. Independent UX review used supplied 320px/390px/desktop chart, form, menu and native screenshots; it did not independently run browser interactions.

Hosted run 35780141040 passed 749 checks; five long-page appearance checks stopped at Linux WebKit’s 32,767-pixel screenshot limit before their contrast assertion. Capture now uses CSS-pixel scale, preserving the full document and every contrast assertion while avoiding the device-scale multiplier. The prior complete local run passed all 754 checks; the corrected capture is verified through the focused appearance suite and the release workflow.
