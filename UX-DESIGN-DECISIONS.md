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

1. **My child's next steps** — practical answers about school places and admissions.
2. **What happens when?** — the meeting, response deadline and possible later stages.
3. **Make sense of the numbers** — the sourced Richmond comparisons.
4. **Could the school stay open?** — alternatives and their necessary conditions.
5. **Check the evidence** — the original documents.
6. **I have something to add** — evidence, ideas and meeting questions.

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

### Why not tabs on the homepage?

The [GOV.UK tabs guidance](https://design-system.service.gov.uk/components/tabs/) cautions against tabs as page navigation or when users need to read or compare content across panels. Visible route cards and ordinary page links fit the current task better. This does not prohibit tabs everywhere; a future use needs a specific task and verification.

## Verification and review

Follow [TESTING.md](TESTING.md). Before publication, verify the new routes, FAQ search and no-results recovery, direct answer links, native disclosures, conditional form states and public-board navigation. Include keyboard, no-JavaScript, narrow mobile layouts and iOS Safari simulator checks where available. Automated browser checks and a simulator session are distinct forms of evidence; record what actually ran.

Check financial and admissions wording against its cited source, including dates and any missing detail. Recheck future-stage labels when the official process changes. Keep data visualisations, accessible tables and downloads consistent.

After release, useful task checks include finding the official response deadline, finding a child's next-step answer, explaining what the deficit figure means, locating an original source, and sharing an idea without expecting a payment. Observe confusion and completion directly if participants are available. Do not claim these checks occurred until they have, or introduce tracking merely to maintain this document.

## Maintaining this record

For a material change, record the visitor problem, options considered, chosen behaviour, source or evidence, and verification status. Update the affected decision when it changes rather than leaving contradictory current guidance. Record the dated delivery in [CHANGELOG.md](CHANGELOG.md); keep private messages, submission content and personal data out of both files.
