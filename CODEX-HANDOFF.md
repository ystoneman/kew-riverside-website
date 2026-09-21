# Codex handoff: publish the Kew Riverside evidence hub

## User's goal

Publish this complete static website publicly on GitHub Pages. It centralises public information about the Kew Riverside School Closure, with a searchable document index, historical timeline, infographics and seven numbered approaches to retaining provision.

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

- 42 source entries: 37 reviewed, 2 index-only and 3 not retrieved.
- sources.json is the structured research index and chart-data export.
- index.html includes the actual source cards and content; changes to sources.json alone do not update the rendered page.
- applications.csv contains the Richmond resident on-time Reception application series.
- response-checklist.md is the public downloadable evidence checklist.
- Rankings are editorial priorities, not measured probabilities.
- Original documents are linked, not bundled; their publishers retain their rights.

The school-specific consultation, leaflet, FAQ and response form were retrieved on 21 September 2026. The form states 16 October 2026 as the response deadline. Closure effective 1 September 2027 is proposed; the November 2026 and April 2027 committee stages are planned and conditional. The new proposal.html explains document discrepancies, institutional roles, text-only chair/vice-chair entries, evidence questions and a decision record without fabricated votes. corrections.html submits private human-review requests only. Preserve the distinction between a vote to consult and a vote to close. Portraits and individual statements/votes remain deferred until appropriately sourced and reviewed.

The site distinguishes dated forecasts from actual observations and borough-wide figures from school-specific counts. Retain those distinctions when updating it. Do not introduce private correspondence, individual family information or children's identifying details.

## Validation already completed

JavaScript syntax, internal anchor targets, local asset references, unique record IDs, source counts, chart arithmetic and source-filter behaviour were checked. The current environment had no browser runtime, so visual browser checks and deployment remain outstanding.

## Deployment boundary

Publish only this extracted website folder. Its earlier source was staged inside a private repository. Never make that parent repository public, copy unrelated files, or transfer its Git history into the public website repository.

## Parent-led identity and contributions (21 September 2026)

The homepage now states Yann Stoneman’s aim to keep Kew Riverside open and his parent connection. about.html now uses the longer family account supplied by the user from Sofiya’s wording, including the explicitly supplied recent Reception start, school visits, sense of belonging and values. The teacher conversation is paraphrased as a family recollection without a name or unverified role. Nursery name, unverified institutional causes/dates, children’s names, exact ages and home postcode remain excluded. School comparisons are the family’s impressions; no academic-results claim or claim to speak for other parents was added. This is Yann’s personal initiative, not a claim to a group mandate.

supporters.html uses separate consent and requires private confirmation plus human approval. Public supporters.json is initially empty. Do not add anyone automatically, including letter authors, Yann or Sofiya. Contact messages remain private. No outreach, confirmation email or organising meeting has been sent/arranged by this implementation. The original feedback and crowdfunding delivery tests were confirmed in the private Formspree inbox on 21 September 2026 after authorised CAPTCHA checks. Both were recorded as private setup tests. Hourly moderation remains paused; funding responses always receive private human review.

## Crowdfunding exploration

The user requested ideas from CROWDFUNDING-OPTION-PLAN.md. The website now explains an exploratory option immediately after the costed recovery plan, with eight question-specific private feedback routes. `kind=crowdfunding` must stay private with human review regardless of permission fields. No fundraiser, pledges, donor identities or third-party contact has been authorised or created. Existing letter/supporter consent workflows are unchanged.


## Security review — 21 September 2026

Deployment now uses the checked Pages workflow rather than publishing the repository root directly. Run `.github/scripts/check_site.py` before committing, and inspect named staged files: GitHub source history remains public even when an asset is excluded from the deployed website. The 26-file public artifact excludes these handoff notes and README. Do not switch back to branch-root publishing to bypass a failed check.

All pages have a restrictive meta CSP; maintain local external scripts/styles instead of adding inline code. Private council fields are disabled in HTML. All public boards must pass the shared strict schema used by both private writers and the deployment check. The private helpers remain outside this public repository, now guard state paths (including symlinks), serialize letter publication, and prevent removed letters/supporters being silently recreated from old approvals.

Formspree CAPTCHA, Formshield and required message validation were inspected; its project domain restriction is now `ystoneman.github.io`. Do not submit localhost/file previews to the live inbox. The public endpoint ID is not a secret. The hourly task remains paused. No security test submissions or real community entries were published during this review.
