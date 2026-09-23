# UX design decisions

Recorded: 22 September 2026. Status: implementation in progress; final verification and publication are recorded separately in [CHANGELOG.md](CHANGELOG.md). This is a design rationale, not a report of a user study or a claim that every visitor will complete these tasks successfully.

## Purpose and constraints

Help people understand the proposal, check its evidence and take useful action in support of Kew Riverside. Visitors should quickly distinguish a proposed outcome from a decision, an official council response from a contribution to this independent website, and verified figures from forecasts or unanswered questions.

The owner's feedback identified practical needs: make participation easier to find, explain the next steps for families, make the financial figures understandable, and keep navigation usable on an iPhone. The growing collection also needs clearer entry points. These inputs justify the changes below; they do not establish how representative any preference is across the wider community.

Keep the static site, working incoming links, source citations, accessible tables and separate publication permissions. The site takes no donations. A funding idea is a suggestion, not a payment or pledge.

## Protected visitor journeys

Adopted 22 September 2026 for ongoing change review. Owner: Yann Stoneman; the implementing agent maintains this register when an intentional change affects it. These priorities reflect the owner's goals and inspection of the site, not a measured ranking from a visitor study. This section is the canonical current register; the dated decisions below explain its history.

Priority allocates attention; every existing task retains usable access. Visitors may start with an action, evidence or a family question. Do not require them to follow a learning sequence before reaching their destination. The ranking of campaign options on the dedicated Options page is separate from journey priority.

| ID / emphasis | Visitor outcome | Protected entry and destination |
| --- | --- | --- |
| J1 · Essential orientation | Understand the proposal, current decision status and relevant dates | Homepage status/date information, `proposal.html`, `faq.html` and directly cited official records; distinguish proposed, conditional and decided outcomes. |
| J2 · Prominent action | Find what I can usefully do now | Named Parent action plan shortcut visible on homepage arrival, plus shared navigation to `proposal.html#parent-plan`; no disclosure or familiarity with the containing page required for the shortcut. |
| J3 · Prominent action | Give my views to the decision-maker | Explicit official-response links and current verified deadline/stage; a website letter, idea or video does not replace an official response. |
| J4 · Prominent participation | Read community experience or write a letter | Exposed Community letters / Read or write header action to `letters.html`, with reading and writing shortcuts and independent permissions. |
| J5 · Prominent participation | Offer an idea, evidence, question or correction | Exposed Share ideas / Evidence & suggestions header action to `feedback.html`, with contextual category links and clear private/public choices. |
| J6 · Easy to discover | Understand and check the case | All six homepage task destinations; Understand, `options.html`, Evidence navigation and `evidence.html#records` (with `index.html#records` retained as a compatibility entry); the full report and readable research through the homepage shortcut, Evidence and existing proposal route. Educational evidence at `understand.html#learning-and-results`, reached through the existing comparison/visit areas and `faq.html#learning`. Preserve sources, charts/tables, filters, direct anchors and downloads. |
| J7 · Protected family task | Understand my child's practical next steps | Homepage child-next-steps card and `faq.html#school-places`; distinguish current-family contingencies from prospective-family admissions and preserve both. |
| J8 · Contextual recruitment | Decide whether to enquire about the school | `index.html#visit-school` with a direct current school enquiry route and proposal context; related `options.html#option-enrolment` route. Reading campaign strategy is not a prerequisite. |
| J9 · Contextual participation | Contribute in another format or offer further help | Existing Parent plan, letters and ideas links to `videos.html` (including the fixed shared QR address `videos.html#upload`), `supporters.html` and relevant help categories; preserve written alternatives and older shared links. |

Across all journeys, preserve About/contact, corrections/removal, privacy, the checklist, source CSV, research source register, accessible tables and source links. Lower visual emphasis does not justify hiding or removing these routes. Maintain readable text, keyboard operation, useful no-JavaScript access and recovery through Back, clear/reset and incoming anchors.

### Placement and change criteria

- Keep Letters and Share ideas outside the collapsed mobile Menu. Protect the Parent action plan shortcut's arrival visibility at the established normal-text 320 × 568 baseline and check wider layouts. Enlarged text may reflow; do not shrink it to satisfy a first-screen assertion.
- Prefer an existing destination and short contextual entry for new material. For the remaining Sofiya feedback plan, start with no additional global navigation items or standalone homepage bands. This is a scoped design budget, not an absolute ban: any exception needs a concrete visitor need, the cost to existing tasks and a tested rationale.
- Keep essential meaning, dates, consent and claim-changing limitations visible at the point of use. Disclose optional depth with descriptive labels. Keep the official response distinct from site contributions and recruitment enquiries.
- Preserve canonical URLs, anchors, remembered search terms and the original-source/site-synthesis distinction. Keeping a URL alive is insufficient if its entry point disappears or filters conceal it.
- Use the completed report-discovery release as the starting baseline for later changes. Inspect the current checkout and verified release in `CHANGELOG.md`; do not treat a dated screenshot or pre-release review as the current layout.

For each material change, record the visitor need and journey IDs; canonical destination and entry label; existing tasks potentially displaced; added space/attention/interactions and how those costs are contained; retained links/search terms/downloads; actual checks; and owner/review trigger. The specialist workflow in [AGENTS.md](AGENTS.md#specialist-reviews) supplies the relevant review lenses.

### Verification and maintenance

Start journey checks at realistic entry points, not only known destination URLs. Automatic all-page/link discovery tests must be supplemented by independent expectations for protected entries: a removed link must not disappear silently from the test's own input. Review relative emphasis and scroll depth as well as clicks; avoid a universal click-count rule or pixel-perfect snapshots as the sole usability test.

Follow `TESTING.md` for changed behaviour. Inspect narrow and desktop rendering, keyboard/focus, no-results recovery, direct links, Back and no-JavaScript paths where relevant. Run native iOS checks for affected touch/focus/menu/mobile changes when available and distinguish them from browser emulation. Use fictional data and intercepted submissions. Record checks actually run; automated success is not proof that unfamiliar visitors can find something.

Review this register when user evidence changes a priority, an official process stage/date changes, a provider changes the contribution experience, or a new feature would displace an existing route. Verify date-sensitive content from its maintained sources. Update the current register deliberately and record the reason below; do not copy live dates or entire source findings into specialist skills. No new analytics or scheduled automation is required by this process.

## Options considered

| Option | Decision and reason |
| --- | --- |
| Task-based homepage routes | Implement six visible routes so visitors can start with their question instead of learning the document structure. Keep the original evidence and action sections available. |
| Dedicated FAQ with local search | Implement 12 sourced answers on a separate page. Search filters the page's existing answers; it does not generate advice. Use native disclosures for individual answers, with essential status and deadlines visible outside them. |
| Clearer participation labels and icons | Use **Community letters / Read or write** and **Share ideas / Evidence & suggestions**. The supporting words explain the destination; simple decorative icons help recognition without carrying the meaning alone. |
| Future timeline separate from historical record | Give the upcoming process a six-stage timeline, marking later stages as conditional. Put the longer historical record in a labelled native disclosure. |
| Shorter, single-column contribution form | Keep one page with six categories, a clear main message field and optional details disclosed when relevant. Keep the reviewed public board available below the form. |
| Multi-step contribution wizard | Defer. The core submission is short; extra screens would add navigation and state without an established need. Reconsider if required questions grow. |
| AI question answering | Defer. First see whether the sourced FAQ and simple filtering meet the need. Generated answers would add factual, freshness and privacy requirements. |
| Homepage tabs or a carousel | Defer. Visitors need to discover the routes together, and some need to compare them. Avoid making essential destinations depend on selecting a hidden panel. |
| Heavy generated imagery | Defer. Use readable typography, spacing, simple local icons and evidence-based charts. Decorative imagery should have a clear visitor purpose before it adds download weight or competes with facts. |
| Complete information-architecture migration | Defer. Improve entry points while retaining established pages and anchors. Consider larger restructuring only after evidence of persistent difficulty. |

These choices are design judgments to verify, not measured conversion improvements.

## Selected page and interaction design

### Longer community letters — 22 September 2026

The owner requested room for 30,000-character letters and a way to expand longer stories (J4). Keep the existing reading/writing entry points, letter IDs and independent permissions. Increasing the input limit alone would make the public board difficult to scan; shortening stored text would lose the contributor's words. Instead, retain the full letter and display a roughly 360-character opening for stories over 1,200 characters, followed by a native “Read full letter” disclosure. Short letters stay fully visible.

Expanding hides the preview and reveals the exact full body with its paragraph spacing. Provide “Show less” at both ends so readers need not scroll back through a long story; collapsing brings the summary into view and the bottom control returns focus to it. Direct letter links, later hash changes and Back reveal the target story. Keep names, review labels and reporting/removal links visible outside the disclosure. No new page or navigation item is needed; existing journey priorities remain unchanged.

Independent UX review before implementation identified the bottom-collapse and direct-link requirements. Final rendered desktop and 320/390-pixel mobile review found that collapse could leave the summary offscreen; the corrected focus/scroll behaviour and shorter preview passed reinspection. All 628 browser checks passed, including exact full text, keyboard controls, narrow layouts, link/history recovery, 30,000-character limits and no-JavaScript form bounds. Native iPhone Air / iOS 26.5 Safari separately verified touch expansion, top/bottom collapse and portrait/landscape rendering with fictional near-limit text. These checks are implementation verification, not user research; publication evidence is recorded in the changelog.

### Homepage: a clear starting point

Place **Find what you need** near the top, with six routes:

1. **Could the school stay open?** — alternatives and their necessary conditions.
2. **What happens when?** — the meeting, response deadline and possible later stages.
3. **Make sense of the numbers** — the sourced Richmond comparisons.
4. **Check the evidence** — the original documents.
5. **I have something to add** — evidence, ideas and meeting questions.
6. **My child's next steps** — practical answers about school places and admissions.

The persistent Community letters action provides the reading/writing route alongside these cards. A compact upcoming-date strip links to the school meeting and the official council response, with the proposal's current status visible. Review this strip whenever a date passes or the council changes the process. It must not continue advertising an expired action.

Maintain semantic landmarks, descriptive headings and meaningful link text. The [W3C page-structure guidance](https://www.w3.org/WAI/tutorials/page-structure/) explains how these support orientation and navigation, including with assistive technology. Cards and icons supplement this structure rather than replacing it.

### FAQ: direct answers with traceable limits

Provide 12 practical questions covering the decision, consultation, school places, deadlines, finances and participation. Each answer should cite an official source or clearly identify the site's own policy. Explain where the public documents do not yet answer a question; do not invent a transfer deadline, an automatic allocation policy or an annual deficit from a cumulative projection.

The local search needs a visible label, result count, clear/reset action and a useful no-results message. Filtering must preserve accessible question headings and links to individual answers. Without JavaScript, all questions and their native disclosures remain usable. A link to a particular answer should reveal its content, including when it arrives from another page.

The [GOV.UK details guidance](https://design-system.service.gov.uk/components/details/) supports disclosing information only some users need and warns against hiding information most users need. That is why current status, urgent dates and the official-response action stay visible. The [GOV.UK accordion guidance](https://design-system.service.gov.uk/components/accordion/) also warns that people may miss hidden content and calls for evidence that an accordion helps. It does not establish that a FAQ accordion is right for this audience. Our native-disclosure choice remains a hypothesis to check with real tasks; expand or flatten answers if people overlook them.

### Timeline: distinguish dates from decisions

Present six stages: initial consultation, the school meeting, the committee's permission stage, a possible statutory notice and representation period, determination, and possible implementation. The meeting happens within consultation; it is not a separate statutory prerequisite. Show concrete published dates where available and label later stages as planned or conditional.

Keep the official response deadline prominent. Show the representation window relative to publication of a notice until exact dates exist. Separate the historical evidence record from what is coming next, preserving its existing anchor and records. Neither a proposed implementation date nor a forecast pupil series implies that closure has been approved.

### Participation: describe the action before asking for information

Keep Community letters and Share ideas visible in the shared navigation. Use the same wording, destinations and current-page state on every page and at each breakpoint. The envelope and idea icons are decorative; adjacent text supplies the accessible meaning.

The contribution form has these six categories:

- An idea or suggestion
- Evidence or a source
- A question for the meeting
- A factual correction
- A funding idea — no payment
- A privacy or removal request

Use a single reading order on desktop and mobile. Ask for the main contribution first; make optional contact or display details clear. Reveal publication choices progressively, keep consent explicit and unchecked, and retain the private-only treatment of funding and privacy requests. Explain review before publication and keep the reviewed public board visually separate from the act of submitting. A website suggestion or community letter must not be mistaken for an official consultation response.

### Community letters: routine publication with clear permission

The owner wants ordinary community letters to appear with less manual delay and contributors to receive a publication link with a way to request changes. We considered human approval for every letter and automated publication after screening. Choose automated screening for routine, relevant letters with new explicit processing and publication permissions, while holding specific content, authorship or permission concerns for human review. Treat supportive and critical views equally; an ordinary parent mention of a child's first name alone is not a reason to hold a testimonial.

Keep publication optional and separate from council sharing. The v3 notice explains that a person may not review a letter before publication; submissions under earlier notices retain their human-review requirement. Labels describe the assessment actually used. Only after a letter is confirmed live, send one publication email if the contributor supplied a reply address, with the public link, displayed name and an invitation to request edits or removal. Keep that address private. Check periodically without promising immediate publication. Firm submission guidelines remain visible, and the public explanation must match the workflow.

Verification: 81 focused browser checks passed across Chromium, WebKit and JavaScript-disabled projects, including independent permissions, private-field exclusion, notice wording, mixed review labels and invalid-label failure. Eleven security/schema checks and the 40-asset public-site validation passed. Tests use fictional data. Full integration checks and verified deployment are recorded separately in CHANGELOG.md.

### Why not tabs on the homepage?

The [GOV.UK tabs guidance](https://design-system.service.gov.uk/components/tabs/) cautions against tabs as page navigation or when users need to read or compare content across panels. Visible route cards and ordinary page links fit the current task better. This does not prohibit tabs everywhere; a future use needs a specific task and verification.

## Verification and review

Follow [TESTING.md](TESTING.md). Before publication, verify the new routes, FAQ search and no-results recovery, direct answer links, native disclosures, conditional form states and public-board navigation. Include keyboard, no-JavaScript, narrow mobile layouts and iOS Safari simulator checks where available. Automated browser checks and a simulator session are distinct forms of evidence; record what actually ran.

Check financial and admissions wording against its cited source, including dates and any missing detail. Recheck future-stage labels when the official process changes. Keep data visualisations, accessible tables and downloads consistent.

After release, useful task checks include finding the official response deadline, finding a child's next-step answer, explaining what the deficit figure means, locating an original source, and sharing an idea without expecting a payment. Observe confusion and completion directly if participants are available. Do not claim these checks occurred until they have, or introduce tracking merely to maintain this document.

## Maintaining this record

For a material change, record the visitor problem, options considered, chosen behaviour, source or evidence, and verification status. Update the affected decision when it changes rather than leaving contradictory current guidance. Record the dated delivery in [CHANGELOG.md](CHANGELOG.md); keep private messages, submission content and personal data out of both files.

## Meeting invitation — 22 September 2026

Parents need to notice the imminent face-to-face meeting before reading the longer evidence guide. Put a compact, high-contrast invitation above the homepage hero, showing Tuesday 29 September 2026, 3.30pm and the school location. Use the parent-led site’s own invitation and link the council’s published meeting details. Avoid staff quotations or personal attribution that could imply staff involvement in or endorsement of this initiative. Encourage attendance across families, classes and the PTA community without implying that turnout determines the decision.

The absolute date remains readable without JavaScript. A small local script uses London calendar dates for “Next week”, “Tomorrow” and “Today”, and removes the invitation from 30 September; the full timetable remains available. This avoids an out-of-date relative invitation without a countdown or tracking. Regression coverage includes the London midnight boundary, no-JavaScript fallback, source/details links and placement before the introduction.


## Optional historical research — 22 September 2026

Visitor need: understand what can be learned from other school closure decisions without making the proposal timetable harder to find. Considered placing all eight graphics on the proposal page, a separate document-only download, and a concise summary linking to an optional research page. Selected the third: it preserves discoverability and lets readers choose their depth without forcing a long graphic wall or a PDF download.

The research page starts with three paired lessons, explicitly distinguishing recorded outcomes from editorial implications. Question-led native disclosures expose the eight graphics on demand; readable HTML data, full-size SVG and high-resolution PNG are available for each. The most relevant decision, funding, work-plan and closure-comparison graphics come first. Essential selection limits remain visible. Search and outcome filters narrow the 16-case catalogue; cases and native disclosures remain available without JavaScript. Deep links open their target and recover filtered cases. The complete source register and claim ledger sit on a separate citations page.

Graphic decisions: use a shared zero baseline for the Fletching forecasts, separate raised money from promised support, show the third-year range as pupil scenarios, group suggested actions by timing rather than implied efficacy, and retain the extra transition term among the closure comparisons. Use vector charts in the report and website, with 4800 × 3000 exports for reuse. These are clarity improvements, not measured engagement or persuasion gains.

Verification: 496 browser checks and 29 Python checks passed. Native iPhone 17 / iOS 26.5 Safari checked the entry, menu, disclosures, search, outcome filter, reset and orientation. The test suite caught and now guards the table overflow; the simulator review caught and now guards missing mobile heading spaces. PDF pages and desktop/mobile previews were inspected visually. Publication is recorded separately in the changelog.

## 22 September 2026 — a dedicated video route

Visitor need: share a natural spoken testimonial without getting lost in the written contribution form or mistaking upload for public posting.

Options considered: add a file input to Formspree (current free plan has no upload; paid limit 25 MB per file); embed another form in the existing page; or use a short dedicated page and an external Google upload form. Choose the dedicated page, linked from letters and ideas, without another global navigation item. The page leads with a single upload action and puts recording/permission/troubleshooting details in native disclosures.

Google Forms provides private Drive storage and phone-sized files but requires Google sign-in. State this before the handoff and retain private contact and written-letter alternatives. The website does not load a Google or YouTube embed. Start with adults recording themselves. Keep private review consent and optional publication independent; the owner manually reviews and posts only authorised videos. No AI video moderation or YouTube automation is introduced.

The owner explicitly approved the Google Forms/private Drive collection and the form was published. All 528 browser checks and 29 Python checks passed. Native iPhone 17 / iOS 26.5 Safari covered navigation, portrait/landscape layout, a permission disclosure, the privacy anchor and the Google sign-in handoff. The upload picker and empty-form validation were checked; a completed upload remains unverified because the extension blocked the synthetic file transfer. No interviews or usability study are claimed.

## 22 September 2026 — prepare and participate together

Visitor need: understand the next useful action, coordinate with other parents and see that closure remains a proposal, while retaining honest answers for families thinking about contingencies.

Considered a ten-item homepage campaign list, an image containing all instructions, and a compact sequence linking to a fuller guide. Choose the compact sequence within the existing meeting invitation, with the detailed plan on Proposal & dates and additional actions in a native disclosure. This avoids another homepage section, image-only text, a carousel or a new navigation item. The formal council timeline remains separately labelled and directly linked. The existing dated meeting invitation expires after 29 September; the plan remains reachable from the FAQ, homepage quick answers and proposal navigation.

The guide distinguishes PTA preparation sessions, the council meeting, the response deadline and the conditional final decision. Family participation is voluntary; videos retain independent permission, children’s letters stay in appropriate official channels, and a proposed petition is not shown as available until its wording and link are verified. Encourage preparing a response using meeting answers, while making clear that people can respond now and must not miss the deadline waiting for more information.

Move school-place answers below participation, decisions and money; put continued applications first within that group. Keep the original anchors, search synonyms, topic shortcut, source citations and normal admissions/SEND instructions. Lead with conditional wording and reassurance without discouraging practical questions or telling families to postpone decisions regardless of their circumstances.

Add short in-page links for session times, letters/videos, the council meeting, the response and additional actions. Proposal and FAQ anchors jump immediately: long animated scrolling proved unreliable in the JavaScript-disabled WebKit journey. Preserve native links and all test assertions.

Verification: all 545 browser checks and 29 Python checks passed; 64 public assets validated. The previously failing native path passed three repetitions, and a one-off existing source-filter failure passed eight unchanged repetitions and the final full suite. Native iPhone 17 / iOS 26.5 Safari verified the homepage route, prep-session shortcut, native disclosure, menu and conditional school-place answer; portrait and landscape were visually inspected. Publication is tracked in CHANGELOG.md.

## Video uploads without an account — 22 September 2026

The owner reported that the Google upload sign-in requirement blocked participation and requested Dropbox while preserving links already circulated. Use a copy of the styled form for permissions, with a required typed email and an optional filename, followed by an account-free private Dropbox file request. The original Google file-upload form remains live and separately labelled. A direct Dropbox request alone cannot capture the existing independent publication choice; the two-step route retains it. The confirmation page explicitly says the video still needs uploading. The website offers a continuation link for someone who has already saved permissions and explains matching by email and upload details, no automatic publication and what to do if storage is full. Keep the providers as external links, without embedded scripts or local private data fields. Verification and deployment are recorded in the changelog; this is a design choice, not a measured conversion improvement.

A phone photo picker may hide the filename. Do not make finding it a prerequisite: the filename question is optional, email is required in both steps, and only one video should accompany each permission form. Yann must resolve an ambiguous match privately before publication.

Contribution forms use immediate scrolling so a native validation focus change does not move the next click target. The Linux WebKit trace showed the email-help paragraph briefly intercepting a consent-label click during the scroll. The regression retains all three independent consent and blocked-submission checks, and also requires the focused checkbox to be in view.

## Parent action plan discovery - 22 September 2026

The owner could not readily find the action plan from the homepage. Its main button was labelled “Our next steps & prep sessions”, while the explicit plan link was inside a disclosure and the shared navigation labelled its containing page “Proposal & dates”.

Keep the existing plan address. Add a named, always-visible shortcut above the meeting invitation, rename that invitation's button “Parent action plan”, and include the plan in both shared navigation variants. This gives the parent task its own clear entry without requiring familiarity with the proposal page or opening an answer. Keep the longer plan on its current page and preserve the official-response action. Allow the desktop link group to wrap rather than crowding the existing participation actions.

Verification: a regression first demonstrated that the named, immediately visible homepage shortcut was missing. All 562 browser checks and 29 Python checks passed, including no-JavaScript access and 320px arrival/1101px intermediate navigation layouts. Native iPhone 17 / iOS 26.5 Safari verified the visible shortcut, its destination, Back, the mobile-menu entry and portrait/landscape layouts. Desktop layout was visually reviewed. These checks demonstrate access and layout, not measured user discoverability.


## Lightweight action feedback

The owner requested a little contemporary motion, especially on Parent action plan. Use a single 900ms decorative-arrow cue after arrival, 180–200ms hover/keyboard feedback and an 80ms press response. The spotlight's text and clickable area stay still; action-link buttons lift just 2px on interaction. Keep navigation links and form controls out of this treatment.

A CSS-only treatment fits the static site and adds no script or third-party dependency. All new transforms, transitions and animation live inside `prefers-reduced-motion: no-preference`, so reduced-motion visitors get the existing static controls, underlines and focus indication. The arrow does not loop and no content is hidden while it animates. This is a design choice, not a measured improvement in discovery or engagement.

This adapts the emphasis on intentional, distinctive interactions in [Webflow's 2026 design review](https://webflow.com/blog/web-design-trends-2026), using the transform and reduced-motion guidance in [web.dev's CSS transitions reference](https://web.dev/learn/css/transitions). Verification and publication are recorded in CHANGELOG.md.

## Other-schools report discovery — 22 September 2026

Visitor need: find the previously published 44-page PDF without knowing which proposal section contains it. A compact strip beside the homepage task routes offers direct PDF and web links, plus a stable Evidence reference. The existing proposal route and file URLs remain intact.

The Evidence search includes a separate Site research card, with remembered search terms and its own count. Adding the synthesis to the original-source dataset was considered but would blur its provenance and change the source export. Keeping it outside search would preserve the discovery problem. The chosen design shares the search/filter controls, identifies the item as Synthesis, and leaves all 46 original records and their CSV unchanged. Empty-state messaging considers both collections; direct anchors recover from incompatible filters. The static card and links work without JavaScript. A small dedicated stylesheet avoids stale cached styles for the new route, and the updated Evidence script URL is versioned.

Verification: all 587 browser checks, 29 Python checks and 67-asset validation passed. Native iPhone Air / iOS 26.5 Safari checked both report formats, Back, the Evidence route and portrait/landscape layout on the local preview. Publication is recorded separately in CHANGELOG.md.

## Sofiya feedback: learning within the existing hierarchy

Visitor needs: find the retrieved inspection, understand educational provision/results, contribute evidence and enquire about a school visit (J5–J9), without displacing J1–J4 or current-family school-place guidance.

Keep the canonical priorities above. Add learning/results after the existing substantive Understand sections and before methodology, with a local jump and short links inside the existing comparison preview and visit card. No new global navigation item or homepage band is introduced. The six homepage task cards retain their destinations; Letters, Share ideas and the Parent plan keep their arrival positions. The visit card grows modestly to expose educational context and current official admissions alongside direct enquiry and the closure caveat. It does not require reading campaign strategy.

An always-expanded results appendix would lengthen every visit. Instead, keep the conclusion, small-cohort and attainment/progress limits, sources and newer Darell context visible, with optional labelled tables and method. Responsive chart facets share a zero-to-100 scale, direct value labels and accessible descriptions; they stack on phones. Tables scroll within keyboard-focusable labelled regions. A chart link opens the relevant disclosure with JavaScript, including direct/history/repeated anchors; without JavaScript its descriptive jump reaches the native summary. Underlying CSV/JSON remain downloadable in both cases.

Append a learning FAQ group after the original four topics and preserve all 12 previous answer IDs. Its four answers use the same search/hash/reset controller. The mixed-age account distinguishes school curriculum, inspection observations, family experience and mixed research. Leave only the unresolved class count and unverified 2024 eligible counts unasserted, rather than deferring verified material.

Keep evidence gap 7 in its familiar position, visibly resolved and linked to the full inspection source. The separate research report stays distinct from the original-source library. Broaden the existing enrolment option’s title and visible channel list together; operational ownership and measurement belong in the maintenance outreach brief. Contribution edits reuse existing evidence/video forms and permission boundaries.

Independent planning reviews supported these placements. Implementation reviews corrected the chart disclosure link and source details; campaign and rendered UX reviews found no further actionable issues. Rendered review covered 320/390px and desktop, retained arrival routes, keyboard tables and FAQ recovery. Regression checks and native Safari outcomes are recorded in `TESTING.md` and release evidence in `CHANGELOG.md`; this rationale is not user-research evidence.


## Short homepage and dedicated reference pages — 22 September 2026

The owner asked to move directly to a shorter homepage after feedback that scrolling through the site felt excessive. This supersedes earlier choices to keep complete options and the source library on the homepage. Preserving a destination alone does not establish comfortable discovery. The intended hierarchy remains J1–J9.

The homepage now provides the prominent Parent action plan, a concise conditional-status introduction and direct official response/deadline, a compact meeting invitation, all six task routes, the report's PDF/HTML shortcuts, three optional quick answers and direct prospective-family enquiry with proposal context. The family account has a short entry linking to its full About story. These are the default reading path; deeper research is a deliberate choice.

`evidence.html` contains the complete source library, separate site synthesis, charts/tables and context, history, unanswered questions and method. Evidence navigation still means the document library (`#records`), with local section links visible at that arrival. `options.html` contains the complete eight strategies, a local contents list and an introduction distinguishing exploratory work from immediate participation. No global navigation item is added. Complete units preserve essential qualifications and original-source versus site-research provenance.

All 86 relocated homepage IDs retain native, targeted Continue links. With JavaScript, old fragments and query-only evidence searches use replacement navigation, keeping filters and allowing Back to reach the real previous page. Without scripts, the targeted link is visible and the complete destination remains readable; a saved-search note leads to the full library. Maintained callers and generators use canonical destinations. Every original homepage ID remains valid. The exact video QR URL `https://ystoneman.github.io/kew-riverside-website/videos.html#upload` is unchanged.

The measured desktop homepage changed from 19,794 to 2,205 CSS pixels at 1280×720 (about 89% shorter). This is a rendering measurement, not a user-study result. At 320×568, the Parent plan and exposed participation actions remain in the arrival viewport without reducing text size. Final verification and any publication are recorded in the changelog. Independent pre-implementation campaign, UX and evidence reviews informed compatibility routing, visible official-response distinctions and local contents. Final campaign/evidence source reviews found no outstanding issue; rendered UX verification is recorded separately.

## Video submissions for publication — 22 September 2026

J9: new video submissions are intended for possible public YouTube publication. Require explicit YouTube permission, retain separate storage/review consent, and offer optional unchecked news-media permission. A private-only video option would introduce a second intake purpose and later permission follow-up; instead, provide private contact before the handoff. Explain this inside the upload card for direct arrivals and in provider introductions. Earlier saved permissions remain valid even when upload is delayed. Keep existing provider URLs and unmatched uploads private. Version rules are in VIDEO-PERMISSIONS.md; verification is recorded in CHANGELOG.md.

Direct `#upload` arrival uses immediate scrolling so the private-contact link stays still for JavaScript-disabled Safari. A recurring existing chart-link failure was addressed with the same narrow rule at `#learning-and-results`; neither change alters layout or destinations. The earlier video decisions above describe the v1 intake and are superseded by this v2 consent model for new submissions only.

## Research page arrival — 22 September 2026

J6: a visitor following a shared or in-page link to a research graphic, case or source claim should land on it and be able to open it at once. Site-wide smooth scrolling animated these jumps after load, by up to 33,693 px on the source register, and in hosted testing it moved the first graphic beneath a click. Options were a narrow `#visual-guide:target` rule, which fixes only the reported arrival, or immediate scrolling on both research pages. Choose the page-level rule. Every direct and in-page research anchor has the same long jump, including source-register links and arrivals without JavaScript, and the FAQ and parent-plan decisions already make long reference jumps immediate. Destinations, header offsets, disclosure behaviour and layout are unchanged; reduced-motion visitors already had immediate scrolling. Verification is recorded in TESTING.md and CHANGELOG.md.

## Video page scrolling — 23 September 2026

J9: a visitor opening upload help or following an in-page video link should be able to use the link they can see. Smooth scrolling after focusing the help summary moved the original-form link beneath a click in hosted testing. Options were more `:target` rules for individual anchors, or immediate scrolling for the whole contribution page. Choose the page-level rule, matching the contribution forms and research pages; it also keeps the exact QR arrival at `videos.html#upload` immediate. URL, providers, permission wording and layout are unchanged. This is a lead-agent review applying the kew-ux-review criteria. The same page-level choice for the research pages had an independent review with no actionable findings.
