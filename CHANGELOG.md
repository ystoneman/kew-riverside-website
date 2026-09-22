# Changelog

Visitor-facing changes and significant maintenance changes, newest first. The historical entries below were reconstructed from repository commits on 22 September 2026. Dates are commit dates, not independently verified publication times. A commit records a change; it does not by itself prove a successful deployment or a particular test result.

## 22 September 2026 — find the 44-page other-schools report

- Add a compact homepage route with direct links to the existing PDF, readable web research and its Evidence entry.
- Make the report searchable by remembered terms including other schools, 12 schools, saved schools, closure reversals and 44-page PDF. Give the site's synthesis its own labelled card and result count; retain the 46 original source records and their CSV unchanged.
- Preserve `lessons-report.pdf`, `lessons.html` and the proposal's existing report links. Direct and repeated Evidence anchors clear incompatible filters to reveal the report; all report routes also work without JavaScript.

Validation: all 587 browser checks and 29 Python checks passed; 67 public assets validated. New journeys cover remembered search terms, both report formats, provenance, separate counts, filters/reset, direct and repeated anchors, and no-JavaScript access. Native iPhone Air / iOS 26.5 Safari separately verified the homepage web link, Safari Back, the PDF opening with 44 pages, the Evidence link and portrait/landscape layouts against a local public-file preview. No external forms were submitted. Published and verified: commit `3d14a7e` passed the hosted checks and deployed successfully in [GitHub Actions](https://github.com/ystoneman/kew-riverside-website/actions/runs/35750966395). The homepage, search script, new stylesheet, PDF, both research pages and existing proposal page returned HTTP 200 and matched that commit byte for byte. The live Evidence search found the report for “44-page PDF”; native iPhone Air Safari verified the published homepage shortcut and opened the 44-page PDF.

## Unreleased

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

### Earlier work awaiting release documentation

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
