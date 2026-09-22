# Kew Riverside: parent-led evidence and action

A static website with no runtime dependencies, created and maintained by Yann Stoneman, a Kew Riverside parent seeking to keep the school open. It does not claim a mandate from all parents or operate on behalf of the school, council or PTA. Factual sources and editorial positions remain distinct.

## Publishing on GitHub Pages

This directory is deployed from `main` at https://github.com/ystoneman/kew-riverside-website to https://ystoneman.github.io/kew-riverside-website/ using GitHub Pages and the validated `.github/workflows/pages.yml` workflow. Only the explicitly listed public assets are deployed; repository notes, workflow code and private working files are excluded from the website artifact.

The evidence pages need no build or API keys. Feedback and community letters use the private Formspree inbox behind the public form endpoint. Secrets and private submissions must never enter this repository. Relative asset paths support the repository subpath.

## Content and provenance

- Original research cut-off: **21 September 2026**. School comparison datasets and the council proposal comparison were checked on **22 September 2026**; individual source access dates are recorded.
- 46 source entries: 41 reviewed, 2 listed in a reviewed index without individual review, and 3 routes not retrieved.
- Sources: school website, Richmond Council and Schools Forum, Achieving for Children, Ofsted, Department for Education.
- The school-specific consultation page, leaflet, general FAQ and council-linked form were retrieved. The form states a 16 October 2026 response deadline. Closure effective 1 September 2027 is proposed; November 2026 and April 2027 committee stages are planned, not completed decisions. Wording differences between timetable documents remain explicit.
- The eight numbered approaches are editorial priorities, not probabilities or demonstrated school-specific solutions.
- Forecasts and pupil counts keep their dates and geographical definitions.
- `sources.csv` is the visitor download: all 46 source records, with readable column headings, source URLs and coverage caveats. It uses UTF-8 with a BOM for Excel.
- `sources.json` retains the structured source index, chart values and option rankings for maintenance.
- `applications.csv` provides the borough application series.
- `response-checklist.pdf` is the visitor download: a two-page A4 checklist with selectable text, tick boxes and clickable links.
- `response-checklist.md` is the editable source for the PDF.

This collection is not exhaustive. Original documents remain with their publishers. It contains no private correspondence, family records or reproduced pupil photographs.

## Files

| File | Purpose |
| --- | --- |
| about.html | Named owner, supplied family account, position, update history and private contact form |
| supporters.html / supporters.js / supporters.json | Specific supporter statement, separate consents, manual confirmation and human-approved public names only |
| community.css | Parent introduction, contribution routes and supporter styles |
| index.html | Complete, readable page and source cards; works without JavaScript |
| proposal.html / proposal.css | Dated proposal, conditional timetable, institutional roles, factual profiles, questions and decision record; no JavaScript required |
| corrections.html / corrections.js | Private corrections and objections, always kind=privacy, no publication option |
| styles.css / insights.css | Responsive screen/print styles, practical FAQ and school-specific pupil chart |
| app.js | Search, filters, shareable filter URLs and anchor handling |
| navigation.js / participation.css | Shared participation navigation, letter shortcuts and optional mobile menu dismissal |
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

See [TESTING.md](TESTING.md) for the automated browser suite, coverage matrix, local commands and manual Xcode iOS Simulator checklist. [AGENTS.md](AGENTS.md) requires future interaction changes to extend the relevant tests. Playwright is a development-only dependency. Both browser regression tests and privacy/security validation must pass before Pages deployment.

JavaScript syntax, internal anchor references, local asset references, source IDs, record counts, chart arithmetic and filtering behaviour are checked during preparation. Browser checks cover desktop/mobile forms, independent permission choices, excluded private fields, plain-text previews and empty public boards. Two harmless CAPTCHA-protected setup submissions were delivered and verified in the private inbox on 21 September 2026. Hourly moderation remains paused; delivery verification does not authorise starting it.

## Named support and contact

Feedback is the entry point for named support, letters/testimonials and site suggestions. Only kind=suggestion/accessibility may enter routine automatic moderation. kind=supporter always needs contributor confirmation of the exact name/statement and explicit human approval; kind=contact stays private. The supporter notice is 2026-09-21-supporters-v1, statement keep-open-2026-09-21; existing letter and feedback consent tokens remain unchanged. Never infer endorsement from another kind of contribution. The private helper and operating procedure live outside this public repository. Do not publish emails, private references, confirmation replies or unapproved names.

## Exploratory community funding

Option 02 (`index.html#option-crowdfunding`) is linked to the costed recovery plan. The £400,000 figure is the council’s forecast deficit by 2028/29, not a campaign target. Eight fixed question links route to `feedback.html?kind=crowdfunding&question=...#feedback-form`. Funding feedback stays private for human review even if publication permission is submitted; it is never eligible for the automatic board. There are no donations, pledges, donor lists or recipient agreements. Category selection also works without JavaScript. Do not interpret submitted ideas as permission to publish, forward, contact third parties or make financial commitments.

## Security checks and deployment

Run `python3 .github/scripts/check_site.py` **before committing** and `python3 -m unittest discover -s .github/scripts -p 'test_*.py'` after changing security or public-data handling. A public Git commit already exposes its contents; a later deployment check cannot undo that. Stage named files and inspect the staged diff. Never add inbox exports, private ledgers, confirmation correspondence, council drafts, credentials or fixtures derived from private submissions. Committed browser fixtures must contain only fictional test data. Ignore rules are only a convenience, not a confidentiality boundary.

Every push and pull request runs privacy/schema checks, JavaScript syntax checks, asset validation and browser regression tests. Only a passing `main` build can deploy. GitHub Actions are pinned to exact commits, checkout credentials are not retained, and the separate deployment job has only Pages and deployment-identity permissions. The workflow packages an explicit asset list and excludes repository maintenance files. New intended assets must be deliberately added to the list in `.github/scripts/check_site.py`.

All eight HTML pages declare a restrictive Content Security Policy before resources: local scripts/styles/data only, no inline scripts or handlers, no embedded frames/plugins or base-URL changes, and form submissions restricted to this origin and Formspree. External source links still work. Formspree remains responsible for CAPTCHA, spam filtering, intake validation and private storage. Its project is restricted to `ystoneman.github.io`; localhost and file previews should not submit to the live inbox. Keep `strict-origin-when-cross-origin` so the domain check works without sending page query strings.

Public boards have exact field allowlists, bounds, valid dates and unique IDs checked **before deployment**; browser validation also fails closed and renders only text. These checks do not establish real identity, consent or the suitability of free text. Private moderation and human approval requirements remain in force. Council identity inputs are disabled in the initial HTML and require an explicit council-sharing choice and working JavaScript to be enabled.

GitHub Pages does not give this project control over custom HTTP response headers. The HTML policy cannot enforce `frame-ancestors` or `X-Frame-Options`, so full anti-framing protection would require a host or proxy with custom headers. Bot controls reduce spam but cannot eliminate it or guarantee availability within provider quotas. No automatic security scan can guarantee an absence of vulnerabilities.

## School-specific evidence and practical answers

The homepage leads its numbers section with the consultation leaflet’s full eleven-year Kew Riverside pupil series. Five reported years (2021/22–2025/26) use a solid line and filled points; six forecasts (2026/27–2031/32) use a dashed line and hollow points. The zero-based chart, accessible table and sources.json/charts/schoolRoll must stay in agreement. Forecasts are not a verified present headcount, an assurance the school remains open, or an enrolment target sufficient for financial viability. No percentage from the leaflet’s inconsistent prose is copied into this chart.

Five practical FAQ answers reuse the existing current-proposal panel, including the council’s statement that applications and admissions can continue during pre-statutory consultation. Keep that answer stage-specific and recheck the council FAQ when the process changes. Every answer cites its source or the site’s own contribution policy. The existing borough application chart, occupancy comparison and housing context remain available in a collapsed native disclosure. The chart, FAQ and data table work without JavaScript. No source-library count or contribution permissions changed.

## Shared navigation and letter entry points

All eight pages share the same header: research links, outlined Letters and a pale-green Contribute action. The council response remains the dark primary homepage action. Below 1,101px, research navigation uses native details; Letters and Contribute remain visible. Below 701px, the action pair spans its own row. The compact header scrolls away rather than covering content. Keep the duplicated desktop/mobile research links in agreement when editing them. Only the visible navigation is exposed to keyboard users; the current destination has aria-current="page".

Navigation JavaScript only adds dismissal on link selection, outside click, Escape, focus arriving outside the menu and transition to desktop; native disclosure still works without it. Letters has direct writing/reading shortcuts, a writing link at the board and concise consent lead-ins. Full consent wording, separate unchecked permissions and disabled private fields are preserved.

The participation styles use a separate asset URL so the new shared header cannot pick up a cached pre-header version of styles.css. Keep participation.css loaded after the existing page styles.

## Enrolment campaign option — 22 September 2026

Option 04 (#option-enrolment) proposes school-coordinated local outreach, authentic adult parent stories and a measured enquiries → visits → applications → enrolments journey. YouTube, TikTok and Instagram are labelled suggested channels, drawn as local SVG icons with adjacent text; they are not links to campaign accounts. There are now eight numbered approaches; later numbers and the formal-participation cross-reference were updated. No campaign was launched, third parties contacted or pupil target invented.

The compact #visit-school card links to the school’s verified Contact Us page for guided-tour enquiries. The campaign details cite school tour/admissions information and the council FAQ’s stage-specific admissions statement. Older admissions criteria or dates on the school page are not reproduced. That campaign update kept the source library unchanged; its school links are cited directly and stored with the approach in sources.json. enrolment.css is loaded only on the homepage and is in the public deployment allowlist. No new JavaScript, embeds, trackers or intake form was added.

## Understand the situation — September 2026 comparisons

`understand.html` is linked from the shared Understand navigation and a compact homepage preview. It shows the three Kew planning-area schools first, with count/percentage trend controls and native disclosures for all 45 Richmond primary-phase schools. Capacity is a matched May 2025 snapshot; year groups are January 2026 headcounts excluding nursery. The existing council-leaflet series and borough applications remain on the homepage, separately labelled.

`understand-data.json` holds only reviewed school-level aggregates and provenance, including source hashes, split-site aggregation and changed school reference numbers. It does not include the national download’s pupil demographic breakdowns. `richmond-schools.csv` is the spreadsheet-friendly download. These files and `understand.css` / `understand.js` are explicitly published. The Python builder and tests are maintenance-only.

To update the comparisons, check the source definitions, dates and raw records; update the reviewed JSON, then run `python3 .github/scripts/build_understand.py`. Its `--check` mode detects stale HTML or CSV and runs through the data test suite. Do not hand-edit generated `understand.html` or `richmond-schools.csv`. Review `.github/scripts/build_understand.py` for dated narrative and source links when changing dataset editions. Run all checks in TESTING.md. Reconcile source-library changes across JSON, CSV and homepage cards.

Charts are rendered as HTML/SVG, with no third-party chart package, embeds, tracking, live requests or extra visitor data collection. The small local script only switches between already-rendered trend views. Tables and disclosures remain usable without it.
