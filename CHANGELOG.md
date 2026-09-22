# Changelog

Visitor-facing changes and significant maintenance changes, newest first. The historical entries below were reconstructed from repository commits on 22 September 2026. Dates are commit dates, not independently verified publication times. A commit records a change; it does not by itself prove a successful deployment or a particular test result.

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
