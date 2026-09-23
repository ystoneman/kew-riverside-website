# Changelog

Visitor-facing changes and significant maintenance changes, newest first. The historical entries below were reconstructed from repository commits on 22 September 2026. Dates are commit dates, not independently verified publication times. A commit records a change; it does not by itself prove a successful deployment or a particular test result.

## Unreleased

### Video QR Back position after analytics

The analytics script attached its hidden choices panel while `videos.html#upload` loaded. In iPhone WebKit, returning from the intercepted permission-form handoff then kept the fragment in the URL but showed the top of the page, outside the upload card (J9). Keep the panel detached until someone opens Analytics choices. The existing QR and analytics controls retain their assertions; the analytics test now checks the panel's deferred insertion. The pre-analytics commit passed three QR repetitions, while the analytics commit and later main failed repeatedly; removing only the initial panel insertion restored Back position in a diagnostic copy. On this branch, the unchanged QR test passed 10 iPhone WebKit repetitions and all 120 analytics tests passed across the four scripted browser projects. These were Playwright browser checks, not native Safari verification. No real form or analytics call was sent, and no deployment is claimed.

### External-link arrows render as text on iPhone

In iOS Safari a bare “↗” (U+2197) renders as a blue emoji square, including on the homepage’s main “Respond by 16 October ↗” button. Every ↗ on the site is now followed by the text-presentation selector U+FE0E (`&#xFE0E;`), which keeps the plain arrow. The change covers 84 arrows across the homepage, Evidence, FAQ, Proposal, Understand and Videos pages, plus the two page builders that generate some of them. Link text, accessible names and destinations are unchanged. A new structural test fails if any public page or script contains a ↗ without the selector. It failed on the previous `faq.html` and passes now. Found in the iPhone Air / iOS 26.5 simulator on the live site. The same simulator showed plain arrows on the homepage and Evidence pages of a local preview of this change. Review: lead-agent UX check. This is a rendering fix with no change in meaning or behaviour.

### Legacy-redirect stalls in WebKit browser tests

Stop `homepage.spec.js`'s legacy-fragment test stalling in WebKit on CI, which had blocked three deployments until reruns, the last being the analytics release. Each legacy visit's redirect cancels the homepage's remaining requests. Playwright's Linux WebKit bundles libsoup 3.6.5, which can then lose the redirected navigation ([microsoft/playwright#42803](https://github.com/microsoft/playwright/issues/42803)), and routing every request kept more of them in flight. The test server now uses HTTP/2, like GitHub Pages, with an HTTP/1.1 fallback. The four legacy-route tests run without request routing. For them, the network guard still fails a test on any other-origin request, local write or real letters board, and first checks that no page's policy lets it reach another origin from the test server; the analytics collector sends only from the production host. All other tests, apart from one harness check of the observing guard, still block external requests before they are sent. New harness checks pin HTTP/2 and both guard modes. In Linux CI stress, the unchanged test stalled in 0 of 700 runs, before and after merging the analytics release, against 46 of 400 on `main` at the same times. Stalls never completed within 40 s, while completed redirects took at most 1.8 s, so the 10 s navigation budget is unchanged. Journeys and assertions are unchanged. The diagnosis and measurements are in TESTING.md. This is an internal test-harness change, so no specialist panel was needed. A lead-delegated independent code review found nothing blocking; its suggestions were applied.

Validation: six hosted full runs passed, two on each pre-merge commit (748 browser checks) and two after merging the analytics release (868). Each passed 41 Python checks and validated every public file. Locally, under Node 24.19.0 on a separate port, one full run passed all 868 checks. A second passed 867; one android-chromium long-letter check failed while the Mac's load average was about 600, when a Space press on the focused summary did not reopen the letter. That check passed 300 focused repetitions on this branch and 60 on `main`, and it involves no network activity, so this change does not cause it; its cause was not established.

### Repeated source-link check

Add a regression for a rare desktop Chromium failure. Following gap 7's source link a second time, after a filter had hidden the inspection record, left the page at the link instead of the record. Clearing the filters re-expands the list above the link, scroll anchoring keeps the link in place, and the animated jump to the record did not take effect. Since the shorter-homepage release the library has been on `evidence.html`, whose jumps are immediate. No failure has been seen there: 0 of 160 stressed runs, against 36 of 240 on the homepage version. With animation restored on Evidence it returned in 2 of 79 runs, both with an extra explicit scroll in `app.js`, so that change was not made. The test now requires the repeated jump to land at once; it failed 38 of 40 runs with the animation restored. Its existing assertions are unchanged, and no visitor-facing file changed. Validation: 160 focused repetitions and all 732 browser checks passed locally, as did all 41 Python checks and the 73-file validation; hosted PR run `35854258428` passed the same checks. After merging the analytics release, 80 further focused repetitions and all 852 browser checks passed locally, with the 76-file validation. Details are in TESTING.md.

### Website analytics: basic page counts by default, detailed usage opt-in

- Add a local Umami collector, sending to the operator's Umami Cloud website, in two tiers. **Basic page counts** are on without a banner: one page-view event with a fixed page label and grouped referrer, no cookies and nothing written to the device. **Detailed usage** (section reached/viewed, active-time milestones, named link/download opens) stays off unless the visitor chooses “Allow detailed usage”; that permission expires after 180 days.
- “Turn analytics off” stops both tiers and is remembered. Do Not Track, Global Privacy Control, unreadable storage, private request/Share ideas routes, localhost and other paths on the GitHub host send nothing. Queries, fragments, searches, form values and names never leave the page. CSP permits only the exact collection endpoint; all scripts stay local.
- Add “Analytics choices” to every footer (three equal options, current one marked) and replace the Evidence page's “no analytics” statement. Rewrite the privacy section: legitimate interests for basic counts, consent for detailed usage, Umami's derived location/device and hashed monthly session grouping, six-month retention, objection and deletion routes, and measurement limits.
- Rebased from the unpublished opt-in-only branch (`codex/site-analytics`) onto current main, including the new Evidence and Options pages. Rebuilt Understand and research pages from their generators.

## 23 September 2026 — plainer research shortcut labels

### Plainer research shortcut labels

Replace the homepage shortcut heading “Looking for the 44-page report?” with “What happened to other schools proposed for closure?” under a “Historical research” label. On Evidence, replace “Find the 44-page research report” with “Find lessons from other schools”, which matches the card it jumps to. Visitors who have never heard of the report now see its subject, while the download button still gives its 44-page length. Links, files, destinations and the research wording are unchanged. Review: lead-agent UX and evidence check at the owner's request. The heading describes the research's existing scope of closure proposals, 12 reprieves and four closures. At 320, 390 and 1440 px it wraps to three, two and one line(s), with no horizontal overflow, and the Evidence jump lands on its card. Validation: 356 focused homepage, Evidence, journey, layout and no-JavaScript checks passed.

Publication verification: merged as `921cc5a` (#7) after hosted PR run `35831539219` passed all 732 browser checks. Main run `35832240369` attempt 1 hit the known WebKit legacy-redirect stall (731 passed; see TESTING.md). Rerun attempt 2 passed all 732 checks and deployed `921cc5a`. All 73 public files then matched `921cc5a` byte for byte. The live homepage heading and Evidence jump link show the new wording and the old wording is gone. Native iPhone Air / iOS 26.5 Safari showed the new homepage shortcut.

### Long-letter check time budget

Give the 30,000-character letter `fill` a 20 s action budget. Automated insertion takes about 1.5 s with page scripts on or off, while the page's input handler takes about 1 ms. The 5 s default failed on loaded CI and local runs; the preservation, counter, preview and submission assertions are unchanged.

## 23 September 2026 — shorter homepage, research and video arrival

### Shorter homepage with complete Evidence and Options pages

Move the full evidence library, charts, history, gaps and collection method to `evidence.html`, and all eight strategies to `options.html`. Keep Parent Action Plan, Letters and Share ideas prominent; retain the official response/deadline, compact school meeting, six task routes, research PDF/HTML and school-enquiry route. The homepage has a clear stopping point and about 89% less height in the measured 1280×720 desktop view.

Preserve all 86 moved homepage anchors through automatic replacement routing with native no-JavaScript Continue links. Preserve saved evidence-search queries, filters, source recovery, all source/download data and the exact shared `videos.html#upload` QR route. Update internal links and generators together; new page contents remain reachable from their arrival points.

Independent campaign, UX and evidence reviews informed the design. Final campaign/evidence source reviews found no unresolved issues. Initial validation: all 41 Python checks passed; 73 public assets validated. All 285 focused non-QR browser cases and six repeated QR cases passed. The new QR tests first reproduced an existing WebKit smooth-scroll failure on unchanged baseline content; scoped immediate scrolling fixes direct arrival/tap and Back without changing the URL, provider or permissions. Independent rendered UX review found no remaining issues at desktop 1210×902 and mobile 320×568/390×844. Native iPhone 17 / iOS 26.5 Safari separately passed arrival/action/menu, Evidence/report, old filtered source-link recovery, Back, portrait/landscape and QR/provider/Back checks. No real form was submitted. The official response form was reread through the browser and still states 16 October 2026. Final local validation passed all 718 browser checks across the five projects under Node 24.19.0, all 41 Python checks and the 73-file public artifact validation. A separate temporary test-server port avoided other active project checks; the repository harness and submission interception were unchanged. No publication is claimed here.

Integrated the merged video-permission release (`1cb3f52`) into this branch. The Parent plan keeps its canonical `evidence.html#records` link with the current publication-consent wording; both branches' new no-JavaScript video checks are retained; the identical `#upload` immediate-scroll rule now appears once, with both reasons recorded. No older permission wording remains on the homepage, Evidence or Options pages. This integration adds no new visitor-facing change, so no new specialist panel was run; the lead agent checked the merged wording and routes. Local validation after integration: all 723 browser checks across the five projects under Node 24.19.0 on a separate temporary port, all 41 Python checks and the 73-file public artifact validation passed. Deployment is verified below.

Integrated the merged research-arrival fix (`74ce73e`, #5) as a clean merge and added the video-page scrolling fix below. The QR route, lessons page hooks and permission wording were rechecked after integration. Deployment is verified below.

### Research links land immediately

Make fragment jumps on `lessons.html` and `lessons-sources.html` immediate instead of animated, like the existing FAQ, parent-plan, upload and learning rules. Main deployment run `35781407831` was blocked when desktop WebKit clicked the first research graphic while arrival at `#visual-guide` was still scrolling: the retained trace shows `scrollTop` 1,568 at the click and 1,904 at rest, and `#exhibit-1` stayed closed. Local measurements found every measured research arrival animating after the load event, by up to 33,693 px; at load the linked section's top was still 1,794–3,013 px below the top of the viewport in all five browser projects. The failing test and its assertions are unchanged. New JavaScript and no-JavaScript regressions require shared graphic, case and source links to be in view at load and, where scripts run, to stay still for 600 ms; they failed in all five projects before the fix. Destinations, header offsets, disclosures and layout are unchanged. Validation: 270 focused research repetitions passed; a full local run passed 675 of 676 checks, the exception being a rare, unrelated homepage recovery case explained in TESTING.md, which then passed 100 focused repetitions; the next full run passed all 676. All 40 Python checks passed and 69 public assets validated. Merged as `74ce73e` (#5) after hosted PR run `35787718900` passed all 676 browser checks, 40 Python checks and the 69-file validation; an automated, lead-delegated UX review of the actual diff found no actionable findings. Its main run `35823364131` was then blocked by the video-page failure below and did not deploy; the fix was published with the shorter-homepage release.

### Video page scrolls immediately

Make jumps and focus changes on `videos.html` land immediately by extending the existing `#upload` arrival rule to the whole contribution page, like the forms and research pages. Main run `35823364131` was blocked when desktop WebKit clicked the original Google-form link while focusing the upload-help summary was still smooth-scrolling the page: the retained trace records `scrollTop` 1,209 at the click and 1,511 afterwards, and the page never navigated. The same test also failed main run `35773688429`. A new regression requires focusing and opening the upload help to leave the page still; it failed on the previous CSS in all four JavaScript projects and passed 20 of 20 afterwards. Existing assertions, the exact `videos.html#upload` QR URL, provider links and permission wording are unchanged.

Publication verification: PR #4 merged as `01fc2d3` after hosted PR run `35826772084` passed all 732 browser checks, 41 Python checks and the 73-file validation. Main run `35827695065` attempt 1 failed two intermittent harness checks that had passed on the same commit: the long-letter `fill` limit (see above) and a WebKit legacy-redirect stall, both described in TESTING.md. Rerun attempt 2 passed all 732 browser checks and deployed `01fc2d3`. All 73 public files then matched `01fc2d3` byte for byte. Read-only live checks in desktop WebKit, desktop Chromium and iPhone WebKit emulation confirmed:

- the protected homepage routes, on a 2,206 px desktop homepage;
- Evidence and Options;
- the old `index.html#source-inspection-2026` link reaching its Evidence card;
- still research and QR arrivals, with a graphic opening;
- private contact with Back.

External requests were aborted. Native iPhone Air / iOS 26.5 Safari showed the homepage arrival, the old source link on its Evidence card, the research arrival with graphic 02 opening in place, and the QR upload card. On the earlier video release it also followed private contact and returned with Back.

## 22 September 2026 — video publication consent

### Video publication and optional news-media permission

Change new video submissions to require explicit YouTube publication permission, with separate optional unchecked news-media permission and a visible private-contact alternative. Preserve earlier saved scopes, including delayed uploads, existing provider links, manual review and private unmatched files. Align both Google forms, Dropbox guidance and video/privacy pages; document permission versions in maintenance-only VIDEO-PERMISSIONS.md. Add direct-arrival, private-contact and no-JavaScript regression coverage. Independent campaign, evidence and UX planning reviews informed the consent migration and media wording. Independent actual-diff reviews found and resolved stale invitation copy; rendered UX covered desktop, 390px and 320px. Both live Google forms now show required unchecked YouTube and optional unchecked media checkboxes, adjacent scope/withdrawal text and linked notices; Dropbox public guidance and its owner-only destination were verified. No response or video was sent. All 671 browser checks and 40 Python checks passed; 69 public assets validated. A new JavaScript-disabled private-contact tap failure reproduced three times; scoped immediate scrolling at the upload target fixed it. A recurring existing chart-link click failure received the same bounded fix at the learning target. All 51 focused repetitions passed, with original assertions retained. Native iPhone Air / iOS 26.5 Safari separately checked private contact/Back, the signed-out permission-form handoff and portrait/landscape layout. These provider checks establish UI configuration, not completed backend receipt. PR #3 was merged as `1cb3f52` after hosted run `35780002723` passed all 671 browser checks. Main deployment run `35781407831` then failed the unchanged desktop WebKit research-exhibit disclosure test (`lessons.spec.js:26`); 670 tests passed, validation passed and deploy was skipped. Publication verification: after the research-arrival diagnosis above, evidence-justified rerun attempt 2 of main run `35781407831` passed its browser-test job (the same 671-check suite) and deployed `1cb3f52`. All 69 public files then matched `1cb3f52` byte for byte over HTTPS. Read-only live checks in desktop WebKit, desktop Chromium and iPhone WebKit emulation confirmed the upload-card consent wording, the three provider links, private contact with Back, and the privacy-notice versions; external requests were aborted and nothing was submitted.

### Developer contributions and main-branch protection

Add a fork-to-PR contribution guide, pull-request template and repository-wide code ownership by `@ystoneman`. Document fictional test data, source attribution, private reporting routes, required validation and the distinction between public repository files and deployed assets. Record the intended main-branch protection: one code-owner approval, stale-review dismissal, resolved conversations, current-branch checks from GitHub Actions, and no force-pushes or branch deletion. Keep the owner administrator exception explicit to avoid self-review deadlock and preserve the existing private letter-publication workflow. External-contributor workflows require maintainer approval. The new guidance and configuration are maintenance files only; no visitor-facing asset changes.

Validation: all 40 Python checks passed; the staged artifact contains exactly the same 69 public files, byte-identical to the preceding release, with the contribution files excluded. Local documentation links and protection JSON were checked. On 22 September 2026, the main-branch rules and external-contributor workflow approval policy were applied and read back from GitHub. Administrator enforcement remains explicitly off. This maintenance change adds no visitor interaction; browser/PR results are recorded with the setup pull request, and no new native iOS check is required.

## 22 September 2026 — educational evidence and protected journeys

### Sofiya feedback: educational evidence and existing visitor routes

- Add the school-hosted full 8 July 2026 inspection, all category judgements and improvement areas; resolve gap 7 visibly and reconcile history, newsletter/index records, HTML/JSON/CSV. The original-source library now contains 47 records (42 reviewed, two index-only, three not retrieved); the site-research report keeps its separate identity/count.
- Add `understand.html#learning-and-results` after the existing substantive comparisons. Keep national/borough context, small cohorts, fluctuating results and Darell’s newer recovery visible. Provide responsive chart facets, accessible optional tables, final/provisional/school-reported provenance, and matching aggregate CSV/JSON downloads. Do not infer missing 2024 eligible counts.
- Explain the school’s two-year curriculum with its current alternating-topic example; distinguish inspection observations, personal experience and mixed-age/tutoring research. Hold the conflicting current class count. Append four sourced FAQ answers after the original school-place answers; add contextual family-story and consultation-question links.
- Preserve Letters, Share ideas, the complete Parent action plan arrival shortcut, six task cards, existing anchors and all report/download routes. Add learning links inside the existing comparison preview and visit card. Broaden the existing enrolment option and retain direct school enquiry, proposal context and current official admissions guidance.
- Clarify the contextual evidence route from letters and use a neutral optional mixed-age prompt on the website video page. External permission forms and their prompts are unchanged. Prepare `ENROLMENT-OUTREACH-BRIEF.md` as maintenance material only; no outreach or tracking is launched.
- Reveal linked result disclosures on incoming, repeated and history navigation. Make direct visit-card arrival immediate to fix a reproducible JavaScript-disabled WebKit tap failure. Keep native disclosure fallback and independent publication permissions.

Review: independent campaign/community, UX/discovery and evidence/editorial reviews occurred before implementation and on the actual changes. Source findings corrected inspection locators and added six available 2026 higher-standard cells. UX found the closed-disclosure chart link; it is fixed and rechecked. No remaining actionable review findings. Validation: all 666 browser checks passed under Node 24.19.0; all 40 Python checks passed and 69 public assets validated. The first focused no-JavaScript visit-card test failed in three unchanged repetitions; the scoped immediate-scroll correction passed the same regression and the full suite. One initial desktop WebKit chart-link check did not recur in four unchanged repetitions or the full run. Native iPhone Air / iOS 26.5 Safari separately verified the learning-section arrival, readable chart, direct table URL opening, touch collapse, inspection-source navigation, Safari Back, portrait/landscape inspection-card layout and temporarily enlarged text (then reset). Native horizontal table swiping was not established; labelled table scrolling was verified in rendered/browser checks. No external form was submitted. Published and verified on 22 September 2026 at 18:54 BST: commit `bc80fbb` passed all 666 hosted browser checks, 40 Python checks and the 69-file validation, then deployed successfully in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35762169088). Seventeen live files returned HTTP 200 and matched the tested commit byte for byte: all seven changed HTML pages, three stylesheets, the comparison script, both attainment downloads, both source exports and the preserved research web/PDF routes. Native iPhone Air / iOS 26.5 Safari followed the published visit card’s learning link and displayed the sourced summary and chart. This later documentation commit changes no public assets.

### Project specialist reviews and protected journeys

- Add campaign/community, UX/discovery and evidence/editorial review skills, with scoped routing before substantive implementation and before release. Reviewers return read-only findings; the lead integrates them. Routine corrections use the criteria without requiring a panel.
- Establish one current journey register in `UX-DESIGN-DECISIONS.md`, protecting prominent participation actions and existing evidence, family, utility and download routes.
- Allowlist the six skill files as maintenance material only. The public asset set and visitor-facing files are unchanged. The surrounding school workspace routes tasks to the same repository instructions and skills without duplicating them.

Validation: all three skills passed the bundled skill validator; UI metadata and 17 local document references/anchors were checked. An independent, source-only scenario review exercised a substantive homepage/claim change, a meaning-neutral typo and a small school-visit factual update; it confirmed relevant routing, proportional review and parent-workspace access, with no material instruction defect found. All 29 existing Python checks passed. A temporary staged artifact contained exactly the same 67 public files, byte-identical to HEAD, with no instructions or skills included. No visitor interaction changed, so no new browser or native iOS run was performed. The initial setup changed no public assets; these skills were subsequently versioned with the educational-evidence release above.

## 22 September 2026 — find the 44-page other-schools report

- Add a compact homepage route with direct links to the existing PDF, readable web research and its Evidence entry.
- Make the report searchable by remembered terms including other schools, 12 schools, saved schools, closure reversals and 44-page PDF. Give the site's synthesis its own labelled card and result count; retain the 46 original source records and their CSV unchanged.
- Preserve `lessons-report.pdf`, `lessons.html` and the proposal's existing report links. Direct and repeated Evidence anchors clear incompatible filters to reveal the report; all report routes also work without JavaScript.

Validation: all 587 browser checks and 29 Python checks passed; 67 public assets validated. New journeys cover remembered search terms, both report formats, provenance, separate counts, filters/reset, direct and repeated anchors, and no-JavaScript access. Native iPhone Air / iOS 26.5 Safari separately verified the homepage web link, Safari Back, the PDF opening with 44 pages, the Evidence link and portrait/landscape layouts against a local public-file preview. No external forms were submitted. Published and verified: commit `3d14a7e` passed the hosted checks and deployed successfully in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35750966395). The homepage, search script, new stylesheet, PDF, both research pages and existing proposal page returned HTTP 200 and matched that commit byte for byte. The live Evidence search found the report for “44-page PDF”; native iPhone Air Safari verified the published homepage shortcut and opened the 44-page PDF.

## 22 September 2026 — additional verified releases

Previously listed under Unreleased. The seven linked Actions runs were rechecked on 22 September: all completed successfully with the recorded implementation SHAs. Their original validation and live-verification records are preserved below.

### Longer letters with expandable stories

- Increase the community-letter limit to 30,000 characters across the form, public-data validation and private letter processing; preserve the complete text. Other suggestion forms retain their existing 3,000-character limit.
- Show a short opening for letters longer than 1,200 characters, with keyboard-accessible “Read full letter” and top/bottom “Show less” controls. Collapse returns the reading control into view. Short letters remain fully visible; letter links open the full story and reporting/removal links remain outside the disclosure.
- Version the changed letter script and stylesheet. Permit only reviewed local CSS with an optional numeric version in the resource validator.

Validation: all 628 browser checks and 32 Python checks passed; 67 public assets validated. Boundary tests cover 30,000/30,001 characters, emoji, exact preview/intercepted submission text, full public text, disclosure focus, incoming links/history and unchanged permission choices. Independent UX review covered the proposal and rendered desktop/narrow mobile implementation; its offscreen-collapse finding was fixed and rechecked. Native iPhone Air / iOS 26.5 Safari separately verified a fictional near-limit letter, touch expansion, both collapse controls and portrait/landscape layout against a local public-file preview. The saved provider maximum was updated and verified after reload; no external test submission was sent. Published and verified on 22 September 2026: commit `3742ec1` passed all 628 hosted browser checks and the public validation gates, then deployed successfully in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35756354425). The letter page, script, stylesheet, unchanged letter data and general feedback page returned HTTP 200 and matched that commit byte for byte. Live Chrome confirmed the 30,000-character form and full-text expansion/collapse. Native iPhone Air / iOS 26.5 Safari followed the live reading shortcut and verified touch expansion plus top/bottom collapse with the reading control remaining visible.

### Mixed-age class video prompt

Add “What benefits has your child experienced in a mixed-age class?” to the optional recording prompts on the video page and both existing submission forms. Keep it as guidance for a video, with no new required answer or permission change. Validation: all 570 browser checks and 29 Python checks passed; 66 public assets validated. The new optional prompt was verified in both published responder views, with the existing bullet styling retained. Published and verified on 22 September 2026: commit `87598b4` passed the hosted checks and deployed successfully in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35748329219). The public video page returned HTTP 200, matched the tested file byte for byte and displayed the prompt in the refreshed browser tab.

### Lightweight action-button motion

- Add a brief, single arrow nudge to the prominent homepage Parent action plan link, plus directional feedback on hover and keyboard focus.
- Give action-link buttons a 2px hover/focus lift and a quick press response. Use CSS transforms, no animation library, and no repeating attention animation.
- Respect reduced-motion preferences: all new movement is opt-in through the browser's no-preference media query. Labels, focus indicators and native links remain available immediately, including without JavaScript.

Validation: all 570 browser checks and 29 Python checks passed; 66 public assets validated. New coverage checks the finite arrow cue, stable spotlight hit area, hover feedback, reduced-motion behaviour and keyboard activation. Native iPhone 17 / iOS 26.5 Safari separately verified the visible homepage shortcut, meeting action button, both plan destinations and Safari Back against the local preview. No external forms were submitted. Published and verified on 22 September 2026: commit `e7d8a94` passed the hosted checks and deployed in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35747962434). All 13 public HTML pages and the new motion stylesheet returned HTTP 200 and matched the tested files byte for byte. Native Safari checks above used the local preview; reduced-motion checks used Chromium/WebKit emulation.

### Make the parent action plan easy to find

- Add an always-visible homepage shortcut named “Parent action plan” before the meeting invitation, with a brief description of its preparation times and practical actions.
- Use the same name on the meeting invitation button and add the plan to the shared desktop navigation and mobile Menu on every public page.
- Preserve `proposal.html#parent-plan` and the separate proposal, dates, evidence and official-response routes. Let desktop links wrap at intermediate widths and load the entry-point styling as a new public asset.
- Add regression checks for discovery before scrolling on a small phone, navigation at mobile/intermediate/desktop widths and access without JavaScript. The new homepage test failed on the old page because the named shortcut was absent.

Validation: all 562 browser checks and 29 Python checks passed; 65 public assets validated. Native iPhone 17 / iOS 26.5 Safari verified the shortcut before scrolling, its destination, Safari Back, the named mobile-menu entry and portrait/landscape layouts. Desktop layout was visually reviewed. No external forms were submitted. Published and verified on 22 September 2026: commit `678db20` passed the hosted browser and privacy/security checks in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35744829073) and deployed successfully. All 13 public HTML pages and the new stylesheet matched the tested files byte for byte. The live homepage and plan link were also verified in desktop Chrome and native iPhone Safari.


### Dropbox video uploads without sign-in

- Make a no-account permission form followed by a private Dropbox file request the primary video route. Keep the existing Google upload form live and linked for older flyers.
- Preserve the styled prompts, adult/self-recording declaration, independent YouTube choice and private-review permissions. Match the two steps by email and upload details (filename is optional for phone users); a permission response alone is not an uploaded video, and unmatched files are never publication permission.
- Explain the two storage providers, limited storage, continuation link, legacy route and withdrawal process. Add intercepted handoff coverage for all three links.

Validation: all 553 browser checks and 29 Python checks passed; 64 public assets validated. Native iPhone 17 / iOS 26.5 Safari verified the permission handoff without Google sign-in, Dropbox continuation and the account-free file picker, Safari Back, and portrait/landscape layout. Signed-out desktop checks verified required-field validation; the new editor is Restricted and its response summaries are off. Dropbox request details confirmed private ownership and zero uploaded items. The original Google form remains published and accepting responses. No completed test upload was submitted, so backend receipt is not claimed. A one-off existing desktop WebKit funding-template check passed eight unchanged repetitions and the final full suite; no funding behavior or assertions were changed. The first Linux CI run exposed a pre-existing supporter-form failure: native validation scrolled the page while the next label click was being targeted. Contribution pages now use immediate scrolling; the original required-consent, blocked-submission and label-click assertions remain, with an added in-viewport check. The isolated final suite passed all 553 browser checks and 29 Python checks, with 64 public assets validated; 80 repeated funding/supporter checks passed on all four browser projects. After incorporating the parent-plan navigation update, all 562 browser checks and 29 Python checks passed, with 65 public assets validated. A separate native iPhone Air / iOS 26.5 Safari check blocked an attempt with missing consents and verified label selection; the invalid checkbox did not automatically come into view, so native scroll-to-invalid behavior is not claimed. No real form was sent. Published and verified on 22 September 2026: commit `ae833c9` passed the final 562 browser checks and 29 Python checks and deployed in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35746612746). The public video page, privacy page and validation stylesheet returned HTTP 200 and matched the tested files byte for byte. The existing browser tab was refreshed and displayed the no-sign-in wording.

### Private video submissions

- Add a focused Parent Voices page reached from community letters and Share ideas, with filming prompts, clear Google sign-in/file limits, a private-review explanation and written alternatives.
- Configure a separate Google Forms intake: verified email, adult/self-recording declaration, required explicit private-review consent, separate unselected Yes/No YouTube permission, optional public credit, one video up to 1 GB, one response per account and 10 GB total cap. Keep editor access restricted and response summaries off.
- Add the video privacy notice and withdrawal route. Explain account metadata, manual review/retention, identifiable face/voice, limited editing permission and public-copy limits. Do not send videos to AI screening or publish them automatically.
- Add journey tests for entry routes, external handoff, privacy/removal, recording/help disclosures and no-JavaScript access; include the new page in existing navigation/layout/link checks.

Validation: all 528 browser checks and 29 Python checks passed; 64 public assets validated. The first suite run exposed the existing desktop WebKit native validation bubble consuming a consent-label click. The test now dismisses that bubble with Escape before the ordinary label click, retaining every focus, consent and blocked-submission assertion; 40 repetitions and the full suite passed. Product consent behavior is unchanged. Native iPhone 17 / iOS 26.5 Safari verified portrait/landscape layout, menu-to-proposal navigation, the permission disclosure, the video privacy anchor, the Google sign-in handoff and Safari Back.

The owner explicitly approved Google Forms/private Drive collection and the intake was published. The upload folder is private to the owner; form editor access is restricted, response summaries are off, and all declared limits were checked. Empty Google form submission is rejected. A synthetic file upload could not be completed because the Chrome extension lacks file-URL access; receipt of a completed upload is not yet verified. No parent video or YouTube post was created.

Published and verified on 22 September 2026: commit `25961bf` passed all 528 browser checks and 29 Python checks in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35733671997) and deployed successfully. All five changed public assets returned HTTP 200 and matched the tested local files byte for byte. Native iPhone Safari also verified the deployed page and its Google sign-in handoff. This later log-only commit changes no deployed assets.

### Lessons from other schools

- Add a concise, cited proposal summary linking to optional historical research, keeping the eight graphics and full catalogue off the main proposal page.
- Provide 12 selected reprieves, four closure comparisons, eight expandable vector graphics, readable chart data, search/outcome filters, complete methodology and a 45-source / 49-claim citations appendix.
- Redesign the financial comparison with a zero baseline and explicit forecast/scenario labels; separate cash, pledges and resolutions. Replace implied effort rankings with timing groups, highlight the transition concession, and separate paper from online petition counts.
- Offer 4800 × 3000 PNG downloads and a 44-page PDF with vector charts, searchable text and clickable source URLs. Preserve evidence limitations, current-status caveats and the distinction between 12 schools and nine grouped episodes.
- Recheck all 16 school statuses. Of 45 source URLs, 42 were retrievable; S04, S05 and S28 returned HTTP 403. Preserve their earlier inspection record and explicitly disclose the integration access limit.
- Add regression coverage for research routes, every graphic/data disclosure and download, keyboard controls, filters/reset/no results, direct links, citations and no-JavaScript use. Correct an initial table-container class mismatch exposed by the iPhone WebKit overflow check, and mobile heading word spacing found in native Safari.

Validation: all 496 browser checks and 29 Python security/data/structure checks passed; 62 public assets validated. The updated standalone pack passed its viewport, filter, citation and SVG-bounds checks. All 44 PDF pages were rendered and reviewed, with the final source-access note inspected again after its update. Native Safari on iPhone 17 / iOS 26.5 verified the menu-to-proposal route, proposal summary, chart expand/collapse, search (three Lambeth cases), outcome filter (four closures), reset (16 cases) and portrait/landscape layouts. Automated WebKit separately verified horizontal table scrolling and no page overflow.

Published and verified on 22 September 2026: implementation commit `86015ea` passed the same 496 browser checks and 29 Python checks in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35727959355), then deployed successfully. All 23 changed public pages, scripts/data, graphics and PDF returned HTTP 200 and matched the tested local files byte for byte. The published financial graphic and deep-link disclosure were also checked in native iPhone Safari. This later log-only commit changes no deployed assets.

## Earlier work awaiting release documentation

- Add the first contributor-approved, human-reviewed community letter to the existing public board, preserving the submitted wording and display name.
- Let routine, relevant letters with new explicit publication permission appear after automated screening, with specific concerns held for human review. Update the public form and privacy notice, preserve earlier letters' human-review requirement, and keep council sharing independent.
- Describe the single publication email sent to a supplied reply address after live confirmation, including the displayed name, link and edit/removal route. Show each letter's actual assessment as `AI screened` or `Human reviewed`.
- Extend consent, no-JavaScript, mixed-review-label and invalid-label coverage. Keep real published letters out of browser and deployment test fixtures.

Screening update validation: all 453 browser checks passed locally across Chromium, WebKit and JavaScript-disabled projects; all 24 Python security/data/structure checks passed and 40 public assets validated. Separately, all 80 private workflow tests passed with fictional fixtures, including consent, withdrawal, human reconciliation and interrupted-send recovery. The first Linux CI run passed 452 checks but stopped on the existing desktop WebKit supporter consent recovery test while a native validation popup remained visible; deployment was blocked. The test now clicks the full native consent label on desktop, as it already did on touch, retaining every focus, consent and blocked-submission assertion. All 80 repeated cases and the full 453-check local suite passed after this adjustment; the original failure was not reproduced locally. Follow-up deployment verification is pending. No new simulator check was needed; product touch, focus, menu and layout code are unchanged.

Earlier letter-publication validation, before the screening update: 417 browser checks and 22 Python security/data/structure checks passed; 40 public assets validated.

## 22 September 2026 — family story wording

- Correct the role description to “Our Reception teacher and SENDCo lead” and put “like cousins” in quotation marks, preserving the personal family account.
- Validation: all 545 browser checks and 29 Python checks passed; 64 public assets validated. This is a wording-only change; no visitor interaction has changed. Published and verified: commit `95ee6b1` passed [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35742072428) and deployed successfully. The live About page returned HTTP 200, matched the tested file exactly, and contained both requested corrections.

## 22 September 2026 — shared parent action plan

- Give the homepage meeting invitation a clear preparation → meeting → response sequence and a prominent link to the parent plan.
- Add the five-step guide on Proposal & dates, with PTA preparation sessions on Friday 25 September at 9am or 3.20pm and Monday 28 September at 9am, on school grounds. Keep the council meeting on Tuesday 29 September at 3.30pm and the official response deadline of 16 October distinct.
- Include evidence, voluntary adult videos, community letters, representatives, children’s own letters, friends/family participation and continued work on alternatives. Keep additional actions in a native disclosure and mark the proposed petition as awaiting a verified link.
- Lead the FAQ with participation; retain all school-place answers, citations, search and incoming links. Reframe transfer timing conditionally, retain normal admissions/SEND instructions, and keep practical questions accessible from the homepage.
- Add regression journeys for the plan, dates, privacy wording, official-response handoff, optional actions, FAQ order/search and JavaScript-disabled use.

Validation: all 545 browser checks and 29 Python checks passed; 64 public assets validated. The new JavaScript-disabled path exposed unstable animated anchor navigation; immediate section jumps on the proposal/FAQ pages passed three repetitions. One pre-existing desktop WebKit source-filter reset failure did not recur in eight unchanged repetitions or the final full suite. Native iPhone 17 / iOS 26.5 Safari checked menu navigation, the homepage plan link, session-time shortcut, disclosures, school-place answer and portrait/landscape layouts. No external form was submitted. Published and verified: commit `ab22a97` passed all 545 browser checks and 29 Python checks in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35739939328) and deployed successfully. All six changed public assets returned HTTP 200 and matched the tested local files. Native iPhone Safari verified the live homepage button, plan entry and PTA session-time shortcut.

## Meeting invitation — independent wording

- Paraphrase the meeting invitation in the parent-led site’s own voice and remove the staff quotation and personal attribution. Keep the council’s published meeting details as the public source.
- Update the existing meeting check to cover the paraphrase and absence of quotation/attribution markup.

Validation: all 417 browser checks and 22 Python security/data/structure checks passed; 40 public assets validated. Deployment remains gated on GitHub Actions; this entry records the edit without assigning an unverified publication date.

## Family story — a place to put down roots

- Rename the family-story section to “A place to put down roots” and remove the nursery-disruption paragraph. Keep the focus on deliberately choosing Kew Riverside, moving for the school and hoping for seven years of relationships and continuity.
- Copy-only change; no interaction, data or permission changes.

Validation: 417 existing browser checks and 22 Python security/data/structure checks passed. Deployment remains gated on GitHub Actions; this entry records the edit without assigning an unverified publication date.

## 22 September 2026 — meeting invitation and family story

- Put the Tuesday 29 September, 3.30pm school meeting above the homepage introduction, initially use a supplied letter excerpt and encourage broad parent/class/PTA attendance.
- Keep the date explicit; adapt the short timing label in London time and retire the invitation after the meeting date. The full proposal timetable stays available.
- Fix “herefor” in the homepage’s “Why I started this” heading. A literal space now separates the words when the responsive layout hides the line break; correct the same joining issue in the discovery introduction, date note and school-tour note.
- Add a paragraph before “Two schools in two years” expressing the family’s view of the quality of education alongside warmth, inclusion and high expectations.

Validation: 417 browser checks and 22 Python security/data/structure checks passed. The responsive word-spacing regression also reproduces the original “herefor” defect with the old markup. Meeting checks cover date labels, expiry at London midnight, source/details links, placement before the introduction and the no-JavaScript fallback. Publication remains gated on GitHub Actions validation and browser checks.

## 22 September 2026 — visitor routes, practical answers and simpler contributions

Implemented 22 September 2026. See the design record for the options considered and the reasons for this iteration.

- Add six homepage routes and an upcoming-date strip to make practical answers, evidence and actions easier to find.
- Add a dedicated 12-question FAQ with local search, source links and native disclosures, including school-place timing and the limits of the published deficit figure.
- Separate the six-stage conditional future process from the longer historical record.
- Clarify shared actions as **Community letters / Read or write** and **Share ideas / Evidence & suggestions**.
- Simplify contributions into a single-column, six-category form with progressive optional details and publication choices, retaining private intake and a reviewed public board.
- Record the rationale in [UX-DESIGN-DECISIONS.md](UX-DESIGN-DECISIONS.md), and extend regression coverage for the changed visitor journeys.

Validation: 388 browser checks passed across Chromium, WebKit, touch, keyboard and JavaScript-disabled projects; 22 Python security, source/data and structure checks passed. Manual responsive browser review covered the action buttons, homepage routes, submission page and FAQ. A fresh Xcode Simulator check was blocked by the locked Mac; responsive browser checks are not claimed as native iOS verification. GitHub Pages deployment remains gated on the repository checks.

## 22 September 2026

- Added the Understand page with sourced Richmond school comparisons, pupil-trend views, a matched capacity snapshot, year-group comparisons, accessible tables, CSV download and reproducible data checks. [e6ca3af](https://github.com/ystoneman/kew-riverside-website/commit/e6ca3af)
- Expanded mobile consent recovery coverage to touch interactions and native validation focus. [d711b41](https://github.com/ystoneman/kew-riverside-website/commit/d711b41)
- Updated outside-touch menu dismissal for Safari without depending on synthetic click events. [acefdc6](https://github.com/ystoneman/kew-riverside-website/commit/acefdc6)
- Fixed iOS menu-link interaction and added a browser regression suite as a deployment prerequisite, with testing and maintenance guidance. [8aed4ad](https://github.com/ystoneman/kew-riverside-website/commit/8aed4ad)
- Corrected the family's intended school journey to seven years and clarified the teacher's attribution and extended-family account. [86ae455](https://github.com/ystoneman/kew-riverside-website/commit/86ae455)
- Added a sourced, exploratory enrolment-campaign option with suggested social channels and a school-visit route. This did not launch a campaign. [5e9ea33](https://github.com/ystoneman/kew-riverside-website/commit/5e9ea33)

## 21 September 2026

- Moved shared participation styling to a fresh asset URL to avoid older cached styles. [06fef38](https://github.com/ystoneman/kew-riverside-website/commit/06fef38)
- Made participation more prominent in the shared navigation and refined the community-letter reading and writing journeys. [102c044](https://github.com/ystoneman/kew-riverside-website/commit/102c044)
- Added the council leaflet's pupil series, distinguishing reported years from forecasts, and practical consultation answers. [9e6f4e8](https://github.com/ystoneman/kew-riverside-website/commit/9e6f4e8)
- Excluded the legacy Pages marker from the validated deployment artifact. [0335ee7](https://github.com/ystoneman/kew-riverside-website/commit/0335ee7)
- Hardened forms, public-board data validation and the Pages publishing process, including explicit deployment allowlists and privacy/security checks. [07ebdb4](https://github.com/ystoneman/kew-riverside-website/commit/07ebdb4)
- Updated the maintenance record for verified private feedback delivery. [8d6ae14](https://github.com/ystoneman/kew-riverside-website/commit/8d6ae14)
- Added exploratory crowdfunding as an option and private funding feedback, without accepting donations or pledges. [0cbcf78](https://github.com/ystoneman/kew-riverside-website/commit/0cbcf78)
- Expanded the family story with Sofiya's account of choosing the school. [3e91cc5](https://github.com/ystoneman/kew-riverside-website/commit/3e91cc5)
- Carried supporter references into private removal requests. [a26271e](https://github.com/ystoneman/kew-riverside-website/commit/a26271e)
- Clarified the parent-led purpose and added confirmed supporter contributions. [0769218](https://github.com/ystoneman/kew-riverside-website/commit/0769218)
- Added the verified proposal timetable and guide to the public decision process. [5b036ff](https://github.com/ystoneman/kew-riverside-website/commit/5b036ff)
- Added reviewed community letters with separate public-publication and council-sharing permissions. [554e092](https://github.com/ystoneman/kew-riverside-website/commit/554e092)
- Added a printable PDF checklist and spreadsheet-friendly CSV source index. [aab36bc](https://github.com/ystoneman/kew-riverside-website/commit/aab36bc)
- Added private feedback intake and a reviewed suggestions board. [a40ce29](https://github.com/ystoneman/kew-riverside-website/commit/a40ce29)
- Created the initial Kew Riverside evidence hub. [f1fceab](https://github.com/ystoneman/kew-riverside-website/commit/f1fceab)

## How to add an entry

Start an Unreleased entry when a change affects a visitor journey, evidence or dates, privacy, security or publishing. State the problem and resulting behaviour briefly. Before moving it into a dated release, record the checks actually completed and the publication outcome; use a verified commit or deployment reference when available. If publication is unverified, say so. Link material design choices to [UX-DESIGN-DECISIONS.md](UX-DESIGN-DECISIONS.md). Do not include private correspondence, intake contents, secrets or invented verification claims.
