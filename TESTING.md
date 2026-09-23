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

The browser harness serves the site locally over HTTP/2, as GitHub Pages does, uses fictional form inputs, and intercepts external requests. The four legacy-route tests observe requests instead of routing them (see Legacy redirect fix below). It never delivers a test submission to Formspree. Hosted CAPTCHA, real inbox delivery, council submission and real contribution moderation are outside the automated suite.

## Coverage and maintenance

| Area | Checks |
| --- | --- |
| Shared navigation | Mobile touch links on every public page; participation actions; keyboard focus and dismissal; desktop links; JavaScript-disabled fallback |
| Responsive layout | Narrow/mobile and desktop layouts; horizontal overflow and usable navigation |
| Contributions | Entry routes, feedback categories, private-only funding/privacy behaviour, previews, validation and independent letter consents |
| Participation invitation | Header tiles on every page (labels, tap size, current page, 320 px fit, one-time cue); write-first letters, starters, counter, drafts, full-form clearing, Send/Back arrival panel and next-steps page without inferred receipt; dated official asks; optional quotes only with publication; Share ideas cards and meeting dates, including no-JavaScript fallback; next-steps page by kind, age and date; copy fallback; calendar file; link previews |
| Discovery and FAQ | Parent-plan entry routes, PTA session dates, consent and deadline distinctions, optional further actions, reordered/searchable school-place answers; six homepage task routes; deadline links; 16 sourced answers; keyboard/native disclosures; search, no matches and reset; answer links/history; no-JavaScript use; historical record and six conditional future stages |
| Evidence | Search/filter/reset journeys and visitor download formats |
| School comparisons | Dated source sentinels; aggregate-only export; HTML/CSV/JSON agreement; count/percentage controls; local/borough tables; downloads; no-JavaScript and failed-script fallbacks |
| Historical school lessons | Eight chart/data disclosures and downloads; complete 16-case catalogue; search/outcome filters, empty/reset states; direct links; keyboard and no-JavaScript use; 45 sources / 49 claims; preserved denominators and forecasts |
| Parent Voices videos | Entry routes from letters/ideas; external permission, Dropbox and legacy Google handoffs intercepted locally; required YouTube / optional media permission, earlier-scope preservation and private-contact explanation; native disclosures and keyboard/touch; private withdrawal route; written alternative; no-JavaScript access |
| Site integrity | Local links/anchors, source consistency, resource loading and script errors |
| Security and privacy | Public data schemas, private-field rejection, consent defaults, local script allowlist, restrictive CSP and explicit deployment artifact contents; the test guard's blocking and reporting of external requests |

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


## Short homepage and stable shared links — 22 September 2026

`homepage.spec.js` checks the shorter overview, dedicated Evidence/Options contents, independently specified former homepage fragments, query-only saved evidence searches, incompatible filters, reload, same-document fragment changes and Back/Forward. `test_site_structure.py` independently pins all 86 moved IDs and verifies each explicit destination and no-JavaScript link. Existing source counts, provenance, chart, download and participation checks remain applicable at their canonical pages. The all-page suites discover Evidence and Options automatically.

The video flyer contract is the exact `videos.html#upload` path and fragment. New browser checks cover arrival, an intercepted provider handoff and Back with and without scripting. Repeated WebKit failures were reproduced on the unchanged baseline: smooth scrolling prevented the no-JavaScript tap from settling and lost the return viewport. Scoped immediate scrolling in `videos.css` fixed both; all six repeated cases passed without removing assertions. No provider URL or permission content changed in this redesign. These checks establish website navigation, not successful file receipt.

Independent rendered UX review covered desktop 1210×902, 320×568 arrival and 390×844 homepage/Options/Evidence entries. Lead checks separately measured 1280×720 and inspected 320×568/390×844. A native iPhone 17 / iOS 26.5 Safari check used the public-files-only local preview: exposed arrival priorities, menu → Evidence, report shortcut, legacy inspection link with incompatible filters, Back to the previous research entry, portrait/landscape layout, exact video fragment, provider handoff and Back to upload. No forms were submitted. The preview omits only the HTTP-incompatible CSP upgrade directive in its responses; production HTML retains the complete policy. Full suite results and release status are recorded in `CHANGELOG.md`.

## Video permissions v2 — 22 September 2026

New direct-arrival coverage checks publication intent, optional media permission, old saved scopes, private contact and Back. Letters and Parent plan tests pin the revised invitations. Provider handoffs remain intercepted; no test response or video is sent. The new no-JavaScript private-contact tap failed three focused repetitions; a scoped immediate-scroll rule at the upload target passed the unchanged regression. The existing desktop WebKit chart-link failure recurred in focused checks; the same scoped rule at the learning target preserves the original link/history assertions. All 51 focused repetitions passed.

Independent rendered UX review covered desktop, 390×844 and 320×568, direct upload arrival, disclosures, private contact/Back, resume destination and no horizontal overflow. Native iPhone Air / iOS 26.5 Safari separately verified the private-contact link, Back, signed-out permission-form handoff and portrait/landscape layout. Both live Google forms were inspected for required unchecked YouTube and optional unchecked media consent, adjacent explanation, notice versions and working contact/privacy links. Confirmation text and preserved Dropbox continuation were inspected in the editor. The Dropbox request’s public wording and owner-only destination were verified. These checks establish UI configuration and navigation, not completed backend file delivery.

Final local verification: all 671 browser checks passed using Node 24 and a separate local port to avoid another task’s preview; all 40 Python checks passed and all 69 public assets validated. Dependencies and the installed Chromium/WebKit engines were verified. No actual contributor response, video, consent record or private correspondence was included in the test fixtures or repository.

Handoff status: hosted PR run `35780002723` passed all 671 browser tests. Main deployment run `35781407831` failed one unchanged desktop WebKit research-exhibit disclosure case at `lessons.spec.js:26` (`#exhibit-1` did not open); 670 passed. Validation passed and deploy was skipped. The cause and fix are recorded under Research arrival below.


## Research arrival — 22 September 2026

The retained trace of run `35781407831` shows the arrival at `lessons.html#visual-guide` still scrolling when the first graphic's summary was clicked. DOM snapshots record `scrollTop` 629 before the click, 1,568 at it and 1,904 at rest, and the screencast shows the list moving afterwards. Playwright logged the summary as stable just before the click, although the page kept scrolling. The site-wide `scroll-behavior:smooth` animated every fragment arrival on both research pages. Measured locally after the load event, WebKit arrivals began 110–210 ms late, and animations ran for 0.2–1.5 s, up to 33,693 px on the source register. The CI layout left exhibit 1 fully in view with 336 px of scrolling still to run. On macOS WebKit it came fully into view only in the last ~60 px, so 80 unchanged local repetitions, including taller viewports, did not reproduce the miss.

`lessons.css` now makes jumps on both research pages immediate. The failing test and its assertions are unchanged. The shared `expectStillArrival` fixture requires a linked section to be in view at load and, where scripts can run, to stay still for 600 ms. Page timers never fire with JavaScript disabled, so that project checks the load position only. The new research arrival tests failed in all five projects before the fix. With the fix, 270 focused research repetitions passed. One local full run failed an unrelated homepage case (`sofiya.spec.js:221`, desktop Chromium). After a repeated same-hash gap-07 click, the filter reset expanded the list and Chromium scroll anchoring kept the page at the gap link, so no fragment scroll reached the source card. The case then passed 100 focused repetitions and the next full run of all 676 checks. It is left for separate follow-up rather than changed in this release. All 40 Python checks passed and 69 public assets validated.

Publication: hosted PR run `35787718900` passed all 676 browser checks, 40 Python checks and the 69-file validation, and an automated, lead-delegated UX review found no actionable findings. PR #5 merged as `74ce73e`; its main run `35823364131` failed the video-page case below and did not deploy. Separately, with the research cause established, rerun attempt 2 of main run `35781407831` (the already merged `1cb3f52`) passed its browser-test job and deployed the video release. All 69 live public files matched `1cb3f52` byte for byte. Read-only live checks in desktop WebKit, desktop Chromium and iPhone WebKit emulation confirmed the upload-card consent wording, the three provider links, private contact with Back, and the privacy-notice versions, with external requests aborted.


## Video page scrolling and homepage integration — 23 September 2026

Main run `35823364131` failed `[desktop-webkit] videos.spec.js:77` (“keep the original Google upload available”): 675 checks passed and deploy was skipped. The retained trace shows the research mechanism again. Focusing the upload-help summary started a smooth scroll, Playwright reported the link stable, and the page moved from `scrollTop` 1,209 at the click to 1,511 afterwards, so the click missed and nothing navigated. The same test also failed main run `35773688429`. `videos.css` now makes jumps and focus changes on the whole video page immediate, extending the `#upload` arrival rule. A new `expectScrollSettled` fixture, now also used by `expectStillArrival`, backs a regression that focuses and opens the upload help. It failed on the previous CSS in all four JavaScript projects and passed 20 of 20 afterwards; 288 focused repetitions of the video, research and no-JavaScript suites passed.

Merging `74ce73e` into the shorter homepage was clean. After the merge and the video fix, all 41 Python checks passed and 73 public files validated. A full local run with CI's two workers passed 728 of 732 browser checks. The four exceptions were the existing 30,000-character letter check, whose `fill` exceeded its 5 s limit while the machine was heavily loaded (load average about 12, with simulator streaming). This branch changes only three Evidence links on `letters.html`, and letters code and tests are unchanged. The same check also failed twice in 16 runs on `main` under the same load, and it passed alone in 2.4 s; direct timing put the fill at 4.3–7.5 s on both versions. An earlier local run hit a rare harness hang in `homepage.spec.js:79` on iPhone WebKit: the redirected `evidence.html` request never received a response. The legacy-route tests then passed 240 repetitions. Hosted CI remains the release gate.

Publication: hosted PR run `35826772084` passed all 732 browser checks, 41 Python checks and the 73-file validation. Main run `35827695065` attempt 1 then failed two checks that had passed on the same commit.

- **Long-letter `fill` (android-chromium):** it timed out at 5 s. Profiling showed automated insertion of 30,000 characters takes about 1.5 s with page scripts on or off, while the page's input handler takes about 1 ms. This is therefore a harness budget, not a visitor delay. The fill now has a 20 s action budget, and its assertions are unchanged.
- **Legacy redirect, `homepage.spec.js:79` (desktop WebKit):** it timed out because the redirected `evidence.html` request never received a response after `homepage.js` replaced the loading homepage. That is the same signature as the one local occurrence. Afterwards, 480 targeted WebKit redirects all passed, whether waiting for `load` or `commit`, so the cause is not established and it is left for separate investigation.

Rerun attempt 2 passed all 732 checks and deployed. All 73 live public files matched `01fc2d3`. Live browser and native iPhone Air / iOS 26.5 Safari checks are recorded in CHANGELOG.md.

## Legacy redirect stalls — 23 September 2026

`homepage.spec.js:79` stalled again in main run `35832240369` (desktop WebKit, first step), which blocked the label release until a rerun. A local stress run (both WebKit projects, `--repeat-each=40`, six workers) reproduced it in 1–2 of 80 runs. A diagnostic tagged each navigation with a `?probe=` query, which `homepage.js` preserves, and used a logging copy of the test server. The stalled redirected requests did reach the server, but 6.5, 8.1 and 11.8 s after the homepage request (normally about 30 ms). During those gaps the server received almost no requests from any worker. The same log recorded heavy HTTP/1.1 connection churn: 5,530 TLS connections for 56,710 requests, 1,015 responses aborted mid-flight and 342 `ECONNRESET` handshake errors. Cancelling the homepage's in-flight requests closes those connections, and production GitHub Pages uses HTTP/2 instead. The likely cause is the test harness's HTTP/1.1 server under load rather than the page, but that is not proven. Candidate fixes (an HTTP/2 test server, cheaper TLS, or a justified navigation budget) are left for a separate change measured against the same stress run.

## Website analytics — 23 September 2026

`analytics.spec.js` covers the two-tier collector with fictional configuration and locally served production-origin fixtures; every collection request is intercepted. Basic: exactly one canonical page view with no banner, cookie, stored choice, viewing-time, section or action event; “Turn analytics off” persists across reloads and other tabs; privacy signals, unreadable storage, disabled/invalid/unavailable configuration, localhost, other GitHub paths and private routes (with and without a saved choice) send nothing. Detailed: sections, active time, hidden/idle exclusions, BFCache resets, named actions, expiry back to basic, and reduction from detailed to basic. The 320px check confirms nothing fixed covers keyboard-focused letter fields and that the choices panel fits the viewport and returns focus. Treat controlled-clock checks as timing tests, not attention measurement. Local interception does not prove Cloud receipt; verify the live dashboard separately.

## Participation invitation — 23 September 2026

`participation.spec.js` covers the header tiles on every discovered page (visible labels, 44 px targets, `aria-current`, decorative medallions), both tiles on one row at 320 px, and the arrival cue (once, never looping, not after internal navigation, on the homepage, on its own page or with reduced motion). Letters: write first (Next explains a short letter and moves focus to step 2), links to later fields show every step, starters, the counter near the limit, drafts that hold only the letter and public name (restore, seven-day expiry, Clear draft), and Send → Back showing “Did your letter arrive?” focused and in view. Clear draft resets private fields and sharing choices. A Send click and direct next-steps visit do not infer receipt or erase a pending draft; explicit removal clears both browser copies and a restored form. The official-form asks switch at the London-time boundary between 16 and 17 October. Quote permission appears only with publication, starts unticked, is dropped and disabled with it, and submits `yes-quote-published-letter-v1` only when chosen. Share ideas: default category, meeting card before and after 29 September, and only the message kind kept for the next-steps page. The next-steps page is neutral with no record or one older than 30 minutes; after an idea it shows one official line; after a letter, the official card comes before sharing, copying works and falls back to a selected text box, and dated parts switch on 13 and 17 October. The calendar file is checked for CRLF lines, 75-octet folding, the London-time event and no organiser or attendee. Link previews use local 1200 × 630 PNGs. Page-independent file checks run once, in desktop Chromium.

`no-javascript.spec.js` adds every letter step visible without scripts, an unticked quote choice that submits its exact value when ticked (policy, not the browser, treats it as no permission without publication), a neutral next-steps page, an exposed privacy/removal category and date-safe static copy. `contributions.spec.js` and the security checks confirm the new value is optional, never preselected and absent unless chosen. Two analytics tests now reveal the letter steps before typing into them; their assertions are unchanged.

Two browser behaviours found while testing are handled in `letters.js`: Chromium restores the old scroll position after loading when a visitor comes Back after Send (so Send marks that history entry for manual restoration), and WebKit restores it even so (so the panel is brought back into view once loading finishes, only if it is off-screen or low). The step entrance animation now plays only after Next; on page load it kept WebKit's layout moving while scrolling, which made the consent box untappable in automated no-JavaScript runs.
## Repeated source-link recovery — 23 September 2026

One local full run on 22 September failed `sofiya.spec.js` “Inspection: original-source counts, search and the resolved gap agree” in desktop Chromium (see Research arrival). After a Year filter hid the inspection card, the test clicked gap 7's `#source-inspection-2026` link again while the URL already had that fragment. `app.js` cleared the filters, re-expanding about 8,000 px of cards above the link. The page then stayed at the link (`scrollTop` 10,745 → 18,819) for 5 s. The records library was on the smooth-scrolling homepage at the time. Since the shorter-homepage release it has been on `evidence.html`, where `homepage.css` makes jumps immediate (`html:has(.directory-page)`).

Scroll anchoring explains the held position. On Evidence, clearing the filters with no click or scroll request moves the page by exactly 8,074 px in both desktop Chromium and WebKit, keeping the link in place; with `overflow-anchor: none` the page does not move. The failure itself has only been seen in desktop Chromium, where the animated jump that should follow did not take effect.

No failure has been seen with immediate scrolling. In local stress runs of this test in desktop and Android Chromium (`--repeat-each=40`, six workers), `74ce73e` failed 36 of 240 times, all in desktop Chromium at that assertion, while `origin/main` passed 160 of 160. A third `origin/main` round was discarded because the Mac slept during it; its five timeouts were at other steps. Frame sampling in desktop Chromium and WebKit showed the repeated click moving the page in one step, from the link (`scrollY` 4,130) to the card (1,767). A later desktop Chromium round under heavy memory pressure did not reproduce the failure on either version, so it cannot distinguish them.

The suggested extra `scrollIntoView` in `app.js` was not added. `discovery.js` runs on both the old homepage and Evidence. It already calls `requestAnimationFrame(() => target.scrollIntoView({block: 'start'}))` for every unmodified same-page link click, including a repeated hash, so that request was present when the test failed. That later round also ran Evidence with its immediate-scroll rule removed. The failure returned in 2 of the 79 desktop Chromium runs that reached the assertion (`scrollTop` 4,130 → 12,204, then still for 5 s). Both of those runs also had a duplicate request added in `app.js`, so the duplicate is not a fix. An explicit `behavior: 'instant'` request was not tried.

The test now uses the shared `expectScrollSettled` check to require the repeated jump to have landed before its unchanged visibility and viewport assertions. With the Evidence rule removed, it failed 38 of 40 runs: all 20 in Chromium and 18 of 20 in WebKit. The two WebKit passes were probably animations that finished before sampling began under heavy load. On the current site it passed 160 focused repetitions, 40 in each JavaScript project. All 732 browser checks then passed across the five projects with Node 24.19.0 on a separate local port; all 41 Python checks passed and 73 public files validated. Hosted PR run `35854258428` passed the same 732 browser checks, 41 Python checks and 73-file validation. After merging the analytics release (#9), 80 further focused repetitions and all 852 browser checks passed locally, as did all 41 Python checks and the 76-file validation. No visitor-facing file changed.

## Legacy redirect fix — 23 September 2026

**Cause.** Each legacy visit loads the homepage. Its deferred `homepage.js` then calls `location.replace()` while later stylesheets and `navigation.js` are still loading, so WebKit cancels them. Playwright 1.63's Linux WebKit bundles libsoup 3.6.5, which can lose a navigation after in-flight requests are cancelled ([microsoft/playwright#42803](https://github.com/microsoft/playwright/issues/42803); fixed in libsoup 3.6.6, not yet in a Playwright release). Temporary CI diagnostics, not merged, timed each redirect with a 40 s budget and logged the server and Playwright's protocol. All six logged stalls, one over HTTP/2 and five over HTTP/1.1, followed one pattern: the redirect cancelled 10–14 in-flight requests, and WebKit intercepted and continued the redirected document request but never sent it to the server. The request then failed 17–33 s later with "WebKit encountered an internal error", or stayed pending until the next navigation. A new visit on the same page completed in 0.2–0.5 s.

**Why request routing mattered.** Once any Playwright route exists, WebKit pauses every request until Playwright continues it. That delay left more homepage requests in flight when the redirect ran. Redirects cancelled 6.3–6.9 requests on average with every request routed, about 1 when only other origins and the letters board were routed, and 0.2–0.3 without routes. The share of redirects cancelling nine or more fell from 46–52% to 7–9% and then 1.8%.

**Measurements.** Linux CI, desktop and iPhone WebKit, every run visiting all 18 fragments. The diagnostic copy used a 40 s budget; the real test was unchanged apart from `--repeat-each`.

| Test server | Network guard | Diagnostic runs stalled | Real-test runs stalled |
| --- | --- | --- | --- |
| HTTP/1.1 (previous) | Routes every request (previous) | 34 of 480 | 55 of 500 |
| HTTP/1.1 | No routes | — | 1 of 100 |
| HTTP/2 | Routes every request | 4 of 240 | 3 of 100 |
| HTTP/2 | Routes other origins and the letters board | 5 of 400 | — |
| HTTP/2 | No routes (this fix) | 0 of 240 | 0 of 800 |

In the real-test column, this branch (`35855474574`, `35855483278`, `35855492346`, `35855500232`: 0 of 400) ran at the same time as `main` (`35855510272`, `35855519747`: 24 of 200). After `main` gained the analytics release, the merged branch (`35861486773`, `35861495306`, `35861504169`: 0 of 300) ran alongside it (`35861512983`, `35861520932`: 22 of 200). Earlier 100-run jobs supply the rest: `35841422618` (9 stalled), `35846309383` (1), `35841425615` (3) and `35846316308` (0). Across about 27,000 timed diagnostic redirects, none that completed took longer than 1.8 s (median about 0.35 s), and none that stalled completed within 40 s. A larger navigation budget therefore could not help, and the 10 s budget is unchanged. TLS was not the constraint either. On the loaded Mac, a new handshake cost the server about 4.2 ms of CPU with the RSA-2048 certificate, 2.5–2.8 ms with ECDSA P-256 and 2.3–2.5 ms when resumed, which Node already allows. HTTP/2 also cut connections to one per browser context (82 for 43,886 requests in one diagnostic job), so the certificate is unchanged.

**Local stress.** macOS, both WebKit projects, six workers, `--repeat-each=40`, with four alternating rounds each for `main` and this branch. The stress wrapper allowed 120 s per test, so machine load could not fail a test before a navigation did; the 10 s navigation budget was unchanged. Other work kept the Mac's load average between about 60 and 410. `main` had one 10 s navigation timeout in 320 runs; its trace was overwritten, so the cause is unconfirmed. The branch had none in its first three rounds. In the fourth, one 10 s navigation timeout and five 120 s test timeouts coincided with a machine-wide slowdown. Steps that normally take 0.2–0.6 s took 4–8 s in every worker, every redirected document was served and nothing was left pending. Locally the defect is rare and load dominates, so the CI measurements above decide the question.

**Fix.** `server.js` serves HTTP/2 like GitHub Pages, keeping HTTP/1.1 for Playwright's request client and readiness check. The four legacy-route tests set `routeRequests: false`, so the network guard observes their requests instead of routing them. It still fails a test on any request to another origin, any local write or the real letters board. Without routes nothing can abort a request, so the guard first checks that every page's Content-Security-Policy allows loads only from the site itself. The one exception is the analytics collector, which `analytics.js` contacts only from the production host; `analytics.spec.js` checks that it stays off on the test server, and `check_site.py` separately pins the policy. The policy also allows form posts to Formspree, so only journeys that submit no forms and follow no links to other origins may run unrouted. All other tests keep the routed guard, which aborts external requests before they are sent; one harness check runs unrouted to test the observing guard. `harness.spec.js` checks four things:
- pages and their resources load over HTTP/2 (this check fails on the previous server);
- the routed guard reports a request to another origin and blocks it before it is sent;
- the routed guard serves the empty letters board;
- the unrouted guard still reports other origins, local writes and the real board.

WebKit can still open, but does not use, a connection to a blocked navigation target. The journeys, fresh navigations and assertions of the legacy tests are unchanged.

On macOS, WebKit uses CFNetwork rather than libsoup. There, the earlier probe's late redirected requests (6.5–11.8 s, on connections opened late) match WebKit's NetworkLoadScheduler. It can hold back a document load to an HTTP/1.1 origin until a 10 s preconnect finishes, and HTTP/2 origins are exempt. That match was not separately confirmed.

When a Playwright release bundles libsoup 3.6.6 or later, rerun the stress with routing restored for the legacy tests before deciding whether they still need to run unrouted.
