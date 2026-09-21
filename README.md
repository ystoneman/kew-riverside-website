# Kew Riverside evidence hub

A dependency-free static website for browsing public information about the Kew Riverside school closure question.

## Publishing on GitHub Pages

This directory is deployed from `main` at https://github.com/ystoneman/kew-riverside-website to https://ystoneman.github.io/kew-riverside-website/ using GitHub Pages (repository root, `.nojekyll`).

The evidence pages need no build or API keys. Feedback and community letters use the private Formspree inbox behind the public form endpoint. Secrets and private submissions must never enter this repository. Relative asset paths support the repository subpath.

## Content and provenance

- Research cut-off: **21 September 2026**.
- 42 source entries: 37 reviewed, 2 listed in a reviewed index without individual review, and 3 routes not retrieved.
- Sources: school website, Richmond Council and Schools Forum, Achieving for Children, Ofsted, Department for Education.
- The school-specific consultation page, leaflet, general FAQ and council-linked form were retrieved. The form states a 16 October 2026 response deadline. Closure effective 1 September 2027 is proposed; November 2026 and April 2027 committee stages are planned, not completed decisions. Wording differences between timetable documents remain explicit.
- The six ranked approaches are editorial priorities, not probabilities or demonstrated school-specific solutions.
- Forecasts and pupil counts keep their dates and geographical definitions.
- `sources.csv` is the visitor download: all 42 source records, with readable column headings, source URLs and coverage caveats. It uses UTF-8 with a BOM for Excel.
- `sources.json` retains the structured source index, chart values and option rankings for maintenance.
- `applications.csv` provides the borough application series.
- `response-checklist.pdf` is the visitor download: a two-page A4 checklist with selectable text, tick boxes and clickable links.
- `response-checklist.md` is the editable source for the PDF.

This collection is not exhaustive. Original documents remain with their publishers. It contains no private correspondence, family records or reproduced pupil photographs.

## Files

| File | Purpose |
| --- | --- |
| index.html | Complete, readable page and source cards; works without JavaScript |
| proposal.html / proposal.css | Dated proposal, conditional timetable, institutional roles, factual profiles, questions and decision record; no JavaScript required |
| corrections.html | Private corrections and objections, always kind=privacy, no publication option |
| styles.css | Responsive screen and print styles |
| app.js | Search, filters, shareable filter URLs and anchor handling |
| favicon.svg | Original code-drawn site mark |
| sources.csv | Spreadsheet-friendly source index for visitors |
| sources.json | Structured provenance and data for maintenance |
| applications.csv | Chart values with source attribution |
| response-checklist.pdf | Printable evidence checklist for visitors |
| response-checklist.md | Editable checklist source |
| feedback.html / feedback.js | Website feedback, optional public display names and reviewed suggestions |
| letters.html / letters.js | Community letters, separate public and council permissions, private optional council identity fields |
| feedback.css | Shared form and public-board styles |
| privacy.html | Versioned privacy and moderation notice |
| suggestions.json | Approved website suggestions only |
| letters.json | Human-approved letters only; no council identity fields or reply emails |
| .nojekyll | Disables Jekyll processing for branch-based Pages |

## Maintenance

For a source addition or correction, retain a stable ID, publisher, document date (or explicitly unknown), URL, summary, location and collection coverage. Update both `sources.json` and the static cards in `index.html`, then regenerate `sources.csv`. Regenerate `response-checklist.pdf` whenever `response-checklist.md` changes. Update counts when coverage changes. Recheck the guidance edition and official notice before changing any process or deadline statement.

Recheck the proposal, deadline, current public roles and meeting records before updates and after relevant committee meetings. Do not infer a position from office or a vote from attendance. Only add exact motions and individual votes from verified official records. Text-only profiles are deliberate; portraits need separately verified reuse rights. The private public-role assessment is held outside this repository. Corrections are human-reviewed and never auto-published.

When updating charts, retain the complete data table and specify geography, measure, units and date. Do not silently turn a projection into an actual observation.

There are no analytics, advertising scripts or remote fonts. Forms post to Formspree, which runs a hosted security check; see `privacy.html`. The letters and suggestions boards render approved data as text, never visitor HTML. Council sharing requires separate, recorded consent and an operator check of the official receiving requirements; it is not an official consultation submission service. Outgoing links open the publisher's site. Search parameters remain in the page URL so a filtered view can be shared.

## Verification in this environment

JavaScript syntax, internal anchor references, local asset references, source IDs, record counts, chart arithmetic and filtering behaviour are checked during preparation. Browser checks cover desktop/mobile forms, independent permission choices, excluded private fields, plain-text previews and empty public boards. Live delivery remains unverified pending the hosted CAPTCHA; hourly moderation must remain paused until that test is complete.
