# Codex handoff: publish the Kew Riverside evidence hub

## User's goal

Publish this complete static website publicly on GitHub Pages. It centralises public information about the Kew Riverside School Closure, with a searchable document index, historical timeline, infographics and six ranked approaches to retaining provision.

The user has requested public publication. Use available authenticated GitHub capabilities, respecting runtime permissions. Do not claim the site is live until the deployment and public URL have been verified.

## Start here

1. Open this extracted folder as the project.
2. Read README.md and inspect index.html.
3. Preview with a simple static server, for example: python3 -m http.server 8000
4. Check desktop and mobile layout, source filters, chart tables, internal links and downloads.
5. Publish these files to a dedicated public GitHub repository and configure GitHub Pages for the repository root.
6. Wait for the deployment, verify the live page and return the public URL.

No build step, package installation, framework, secret, backend or database is needed. All asset paths are relative.

If GitHub CLI is available, check authentication with gh auth status. Create or use a dedicated repository such as kew-riverside-school. Inspect any existing repository before changing its contents. If repository creation or Pages administration is unavailable, explain the exact missing capability.

## Content and provenance

Research cut-off: 21 September 2026.
Original site source commit: 4236a6fba84531deae761d9489e09a440f705645.
This archive contains the nine original website files plus this handoff; it does not contain repository history.

- 34 source entries: 28 reviewed, 2 index-only and 4 not retrieved.
- sources.json is the structured research index and chart-data export.
- index.html includes the actual source cards and content; changes to sources.json alone do not update the rendered page.
- applications.csv contains the Richmond resident on-time Reception application series.
- response-checklist.md is the public downloadable evidence checklist.
- Rankings are editorial priorities, not measured probabilities.
- Original documents are linked, not bundled; their publishers retain their rights.

The live official closure pack and timetable were not retrieved during research. The site explicitly marks that gap and does not assert unverified deadlines or a final closure decision. Preserve these qualifications unless new public evidence resolves them.

The site distinguishes dated forecasts from actual observations and borough-wide figures from school-specific counts. Retain those distinctions when updating it. Do not introduce private correspondence, individual family information or children's identifying details.

## Validation already completed

JavaScript syntax, internal anchor targets, local asset references, unique record IDs, source counts, chart arithmetic and source-filter behaviour were checked. The current environment had no browser runtime, so visual browser checks and deployment remain outstanding.

## Deployment boundary

Publish only this extracted website folder. Its earlier source was staged inside a private repository. Never make that parent repository public, copy unrelated files, or transfer its Git history into the public website repository.
