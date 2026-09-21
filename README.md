# Kew Riverside evidence hub

A dependency-free static website for browsing public information about the Kew Riverside school closure question.

## Publishing on GitHub Pages

The files in this directory are the complete site. They are currently staged on a task branch in a private repository.

**Publish only the contents of this directory to a dedicated public repository. Do not make the containing private repository public or copy its history.**

1. Create a public repository such as `kew-riverside-school` and initialise it with a README.
2. Copy this directory's contents into the new repository root. Include `.nojekyll`.
3. In the new repository, open **Settings → Pages**.
4. Select **Deploy from a branch**, then **main** and **/ (root)**. Save.
5. Wait for the Pages deployment to complete and open the URL shown in Settings.
6. Verify navigation, source filtering, downloads and mobile layout at the deployed URL.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

No build, dependency installation, API key or external service is required. Relative asset paths support a repository subpath such as `/kew-riverside-school/`.

The GitHub connector used for preparation could write repository files, but could not create a repository or configure Pages. No deployment is claimed by this source commit.

## Content and provenance

- Research cut-off: **21 September 2026**.
- 34 source entries: 28 reviewed, 2 listed in a reviewed index without individual review, and 4 routes not retrieved.
- Sources: school website, Richmond Council and Schools Forum, Achieving for Children, Ofsted, Department for Education.
- The live closure consultation pack could not be retrieved; the site does not assert unverified closure dates or deadlines.
- The six ranked approaches are editorial priorities, not probabilities or demonstrated school-specific solutions.
- Forecasts and pupil counts keep their dates and geographical definitions.
- `sources.csv` is the visitor download: all 34 source records, with readable column headings, source URLs and coverage caveats. It uses UTF-8 with a BOM for Excel.
- `sources.json` retains the structured source index, chart values and option rankings for maintenance.
- `applications.csv` provides the borough application series.
- `response-checklist.pdf` is the visitor download: a two-page A4 checklist with selectable text, tick boxes and clickable links.
- `response-checklist.md` is the editable source for the PDF.

This collection is not exhaustive. Original documents remain with their publishers. It contains no private correspondence, family records or reproduced pupil photographs.

## Files

| File | Purpose |
| --- | --- |
| index.html | Complete, readable page and source cards; works without JavaScript |
| styles.css | Responsive screen and print styles |
| app.js | Search, filters, shareable filter URLs and anchor handling |
| favicon.svg | Original code-drawn site mark |
| sources.csv | Spreadsheet-friendly source index for visitors |
| sources.json | Structured provenance and data for maintenance |
| applications.csv | Chart values with source attribution |
| response-checklist.pdf | Printable evidence checklist for visitors |
| response-checklist.md | Editable checklist source |
| .nojekyll | Disables Jekyll processing for branch-based Pages |

## Maintenance

For a source addition or correction, retain a stable ID, publisher, document date (or explicitly unknown), URL, summary, location and collection coverage. Update both `sources.json` and the static cards in `index.html`, then regenerate `sources.csv`. Regenerate `response-checklist.pdf` whenever `response-checklist.md` changes. Update counts when coverage changes. Recheck the guidance edition and official notice before changing any process or deadline statement.

When updating charts, retain the complete data table and specify geography, measure, units and date. Do not silently turn a projection into an actual observation.

There are no analytics, cookies, remote fonts, trackers, submission forms or user database. Outgoing links open the publisher's site. Search parameters remain in the page URL so a filtered view can be shared.

## Verification in this environment

JavaScript syntax, internal anchor references, local asset references, source IDs, record counts, chart arithmetic and filtering behaviour are checked during preparation. A browser runtime was unavailable, so visual browser testing and an actual GitHub Pages deployment must be completed when hosting is available.
