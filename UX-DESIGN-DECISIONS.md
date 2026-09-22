# UX design decisions

Recorded: 22 September 2026. Status: implementation in progress; final verification and publication are recorded separately in [CHANGELOG.md](CHANGELOG.md). This is a design rationale, not a report of a user study or a claim that every visitor will complete these tasks successfully.

## Purpose and constraints

Help people understand the proposal, check its evidence and take useful action in support of Kew Riverside. Visitors should quickly distinguish a proposed outcome from a decision, an official council response from a contribution to this independent website, and verified figures from forecasts or unanswered questions.

The owner's feedback identified practical needs: make participation easier to find, explain the next steps for families, make the financial figures understandable, and keep navigation usable on an iPhone. The growing collection also needs clearer entry points. These inputs justify the changes below; they do not establish how representative any preference is across the wider community.

Keep the static site, working incoming links, source citations, accessible tables and separate publication permissions. The site takes no donations. A funding idea is a suggestion, not a payment or pledge.

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

The owner reported that the Google upload sign-in requirement blocked participation and requested Dropbox while preserving links already circulated. Use a copy of the styled form for permissions, with a required typed email and filename, followed by an account-free private Dropbox file request. The original Google file-upload form remains live and separately labelled. A direct Dropbox request alone cannot capture the existing independent publication choice; the two-step route retains it. The confirmation page explicitly says the video still needs uploading. The website offers a continuation link for someone who has already saved permissions and explains matching by email and filename, no automatic publication and what to do if storage is full. Keep the providers as external links, without embedded scripts or local private data fields. Verification and deployment are recorded in the changelog; this is a design choice, not a measured conversion improvement.
