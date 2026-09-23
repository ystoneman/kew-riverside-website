# Current handoff — 23 September 2026

Claude Code completed and published the shorter-homepage PR (#4) at the owner's request. This section supersedes the historical handoff below. The owner allows Claude Code to merge PRs itself after required checks and project reviews pass, using the documented owner exception; branch protection settings stay unchanged.

## State

- **Live and verified: `01fc2d3` (#4).** It includes the video publication consent (#3), research-arrival (#5) and video-page scrolling changes. All 73 public files matched it byte for byte. Live browser checks and native iPhone Air / iOS 26.5 Safari checks are recorded in CHANGELOG.md.
- **Unchanged:** Google Forms, the Dropbox request and permission records. No real form or video was submitted.
- **Keep the exact shared video QR URL:** `https://ystoneman.github.io/kew-riverside-website/videos.html#upload`.

## Open items

1. **Theme PR #2 (`codex/site-theme`)** must merge `main`.
   - The new `evidence.html` and `options.html` need its theme assets and controls.
   - Its notes will conflict at the Unreleased insertion points in CHANGELOG.md, TESTING.md and UX-DESIGN-DECISIONS.md.
   - Its own appearance checks were failing at last inspection.
2. **Rare test-harness failures to investigate separately** (see TESTING.md):
   - the WebKit legacy-homepage redirect stall;
   - repeated same-hash source-link recovery under Chromium scroll anchoring.

Node 24 is available locally at `/Users/yannstoneman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`. Local runs used temporary configs outside the repository on separate ports; repository config and server files were not changed.

---

# Historical handoff (superseded where it conflicts with the current section)

# Codex handoff: publish the Kew Riverside evidence hub

## Completed handoff: video publication consent — 22 September 2026

The user asked to hand this task to Claude Code because of their remaining Codex credits. Stop at this handoff; do not assume the task is deployed. The user authorised updating the existing website, Dropbox request and both Google forms, including ordinary commit/push/deployment. Do not send messages, real form responses or test videos.

### Current state

- Implementation is committed, pushed and merged into `main`: `1cb3f5234d1730af8b01de1055848e29971b8217`, via PR https://github.com/ystoneman/kew-riverside-website/pull/3. Original reviewed branch commit: `cd13be342c55bebcb270112f661fad14de235dd3`.
- Both live Google forms and the Dropbox file request have already been updated and verified through their ordinary browser UIs. Do not recreate them or repeat edits unnecessarily.
- **Website deployment is NOT complete.** PR run `35780002723` passed all 671 browser tests, 40 Python tests and validation of 69 public assets. The subsequent main deployment run `35781407831` failed one browser test; `validate` passed, `deploy` was skipped, and 670 browser tests passed.
- Failure: `[desktop-webkit] tests/browser/lessons.spec.js:21`, “Research: all eight graphics expand with readable data, sources and working downloads”. At line 26, after clicking the summary, `#exhibit-1` lacked the `open` attribute. This research-page code was unchanged by this task. Do not assume the cause or dismiss it as flaky without inspecting the trace.
- Run: https://github.com/ystoneman/kew-riverside-website/actions/runs/35781407831 . Download `browser-test-failures` to a temporary directory with `gh run download 35781407831 -n browser-test-failures -D /tmp/kew-video-deploy-artifacts`. Failure screenshot, error context and trace are under `test-results/lessons-Research-all-eight-e7413-urces-and-working-downloads-desktop-webkit/` in that artifact.
- The full failed job log is already at `/tmp/kew-video-deploy-failure.log` on this Mac. Local successful full-suite log: `/tmp/kew-video-tests.log`; focused successful log: `/tmp/kew-video-fixed.log`; Python log: `/tmp/kew-video-python.log`.

### Claude Code continuation — 22 September 2026

- Diagnosed from the retained trace: arrival at `lessons.html#visual-guide` was still smooth-scrolling when the first graphic's summary was clicked (`scrollTop` 1,568 at the click, 1,904 at rest). `lessons.css` now makes research-page jumps immediate. The failing test and its assertions are unchanged. New `expectStillArrival` regressions (JavaScript and no-JavaScript) failed on the old CSS in all five projects. Details are in TESTING.md, “Research arrival”.
- Local validation: 270 focused research repetitions passed. The second full run passed all 676 checks. The first full run had one rare, unrelated homepage recovery failure, explained in TESTING.md and left for separate follow-up. All 40 Python checks passed and 69 public assets validated.
- Remaining: publish through a PR from this branch after hosted checks pass, confirm the main deployment and live files, then record the verified release. Provider settings were not changed again.

### Agreed product and consent model

New video submissions are intended for possible public publication on Kew Riverside Parent Voices on YouTube. Require affirmative, initially unchecked YouTube permission; remove private-review-only as a new submission choice. Keep separate required receipt/storage/personal-review consent and adult/self-recording attestation. Offer separate **optional, unchecked news-media permission**, with a visible private-contact alternative before handoff. No automatic publication.

Media permission covers Yann supplying the video and chosen public credit to news organisations reporting on Kew Riverside’s future, and their use of the recording/excerpts in broadcast and online coverage with accurate captions and edits preserving meaning. Exclude private contact details. Explain recipients control their publications and may require their own release/privacy arrangements. Withdrawal is separate, stops further sharing and prompts contact with known recipients; do not promise recall of copies or broadcasts.

Earlier recorded permissions retain their original scope, even when upload happens later. Old private-only remains private, old YouTube-only grants no media permission, and blank/missing media answers mean no. Unmatched/ambiguous uploads remain private. Match the actual recording to its actual permission record; never infer scope from upload date or the current form schema. See `VIDEO-PERMISSIONS.md` for versions and fictional manual-review cases.

### Provider state already completed

- Main permission-only form: https://docs.google.com/forms/d/e/1FAIpQLScJZ8ZnZWTaPUIoM9l2Vjir7TgNNTHuUyDEF5uLRJolm8iccg/viewform . Notice `2026-09-22-videos-dropbox-v2`; no Google sign-in required. Confirmation retains step 2 Dropbox URL and clearly says the video is not uploaded yet.
- Original Google upload form: https://docs.google.com/forms/d/e/1FAIpQLSfK3b8XtDJ5_mhKWTqxfZpZwPOJLGXjN1QIQYTKYlJ0dRAHHQ/viewform . Notice `2026-09-22-videos-v2`; Google sign-in, one video up to 1 GB, one response per account retained. Confirmation updated and saved.
- Dropbox request: https://www.dropbox.com/request/9uaa0fawrtdz6pv8b6hn . Title now “Kew Riverside Parent Voices — video submission”; instructions explain new public intent, optional media permission, private contact, same email matching and preservation of old saved choices. Owner-only destination/access unchanged and verified. Dropbox request descriptions render URLs as text; Google contact/privacy/withdrawal links were made clickable with rich-text paste and verified.
- Both Google forms have required unchecked YouTube checkbox, answer marker `[YouTube v2]`, plus optional unchecked media checkbox, marker `[Media v2]`, and visible adjacent scope/withdrawal explanation. Storage/review remains a separate required checkbox. Existing response scopes were not expanded. Public credit stays optional.
- No complete response, file upload, video publication, media disclosure or contributor message was performed. Verification establishes provider UI configuration/navigation, not completed backend file receipt.

### Local code and validation

Read the parent and checkout `AGENTS.md`, then `TESTING.md`, `UX-DESIGN-DECISIONS.md`, and `VIDEO-PERMISSIONS.md`. Website implementation touches `videos.html`, `privacy.html`, `letters.html`, `proposal.html`, `videos.css`, `understand.css`; tests extend `videos.spec.js`, `no-javascript.spec.js`, `visitor-journeys.spec.js`, and the video-consent expectation in `sofiya.spec.js`. Maintenance allowlist includes `VIDEO-PERMISSIONS.md` and excludes it from Pages. No private submissions/correspondence were committed.

Local final result: 671 browser tests / 40 Python tests / 69 assets passed; all 51 focused repetitions passed. The new no-JavaScript private-contact tap failed three repetitions before a scoped `html:has(#upload:target){scroll-behavior:auto}` fix. A recurring existing chart-link click failure was fixed with the analogous `#learning-and-results:target` rule in `understand.css`, retaining assertions. Independent campaign, evidence and UX reviews covered proposal and actual diff; all findings resolved. UX rendered desktop, 390px and 320px. Native iPhone Air / iOS 26.5 Safari checked private contact, Back, signed-out form handoff and portrait/landscape layout. Simulator was restored to portrait.

Use Node 24. On this Mac its executable is `/Users/yannstoneman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node`. Install/test as described in TESTING.md. Another task used default port 4173 from adjacent `theme-worktree`; do not kill it or overwrite that work. This task used `/tmp/kew-video-playwright.config.cjs` and `/tmp/kew-video-test-server.cjs` at HTTPS port 4287, preserving the real CSP and all original projects/assertions. Command: `PATH=/Users/yannstoneman/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node node_modules/playwright/cli.js test --config /tmp/kew-video-playwright.config.cjs`. The separate public-only preview at 4286 has been stopped. Temporary files are conveniences, not required repository dependencies.

### Finish from here

1. Inspect the failed research-disclosure trace and reproduce the exact desktop WebKit case. Fix an established issue or justify a rerun from evidence; do not weaken assertions or skip required checks. Run focused repetitions, then required checks. Keep the existing video consent design and live provider settings.
2. Fetch current remote state before changes/pushes. PR #2 (`codex/site-theme`) is concurrent work; preserve it. This handoff was prepared on `codex/video-consent-handoff`; the implementation is already on main. The handoff commit is documentation-only and does not publish anything. No active Codex work should be assumed after this handoff.
3. Use normal reviewed/validated publication. Main has required checks/review; the documented owner exception permits owner-authored work because the sole owner cannot self-approve. Do not change protection settings. PR #3 was merged only after its checks passed. Pages gates deploy on both validation and browser checks.
4. Confirm a successful main deployment. A convenience script `/tmp/verify-kew-video-release.py` compares the six changed public files over HTTPS against commit `1cb3f52`; adjust the expected revision if fixes or concurrent work produce a newer deployed commit. Do not mistake a merged commit for a live release.
5. Verify the live video page, private-contact route, privacy notice and preserved form links, ideally including native Safari. Update delivery notes with actual successful run/revision and give the user a concise completion report. Current public URL: https://ystoneman.github.io/kew-riverside-website/videos.html .

The earlier sections below are historical context, not a second active task. Do not resume WhatsApp archiving, Alice correspondence, council-question planning, letter moderation or other unrelated work as part of this handoff. Private WhatsApp content must remain outside all Git repositories and website assets.


## User's goal

Publish this complete static website publicly on GitHub Pages. It centralises public information about the Kew Riverside School Closure, with a searchable document index, historical timeline, infographics and eight numbered approaches to retaining provision.

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

Deployment now uses the checked Pages workflow rather than publishing the repository root directly. Run `.github/scripts/check_site.py` before committing, and inspect named staged files: GitHub source history remains public even when an asset is excluded from the deployed website. The explicit public artifact excludes these handoff notes and README. Do not switch back to branch-root publishing to bypass a failed check.

All pages have a restrictive meta CSP; maintain local external scripts/styles instead of adding inline code. Private council fields are disabled in HTML. All public boards must pass the shared strict schema used by both private writers and the deployment check. The private helpers remain outside this public repository, now guard state paths (including symlinks), serialize letter publication, and prevent removed letters/supporters being silently recreated from old approvals.

Formspree CAPTCHA, Formshield and required message validation were inspected; its project domain restriction is now `ystoneman.github.io`. Do not submit localhost/file previews to the live inbox. The public endpoint ID is not a secret. The hourly task remains paused. No security test submissions or real community entries were published during this review.


## Focused research additions — 21 September 2026

The homepage’s current-proposal panel is now a compact five-question practical FAQ (#quick-answers), and #evidence leads with Kew Riverside’s own reported/forecast pupil series. The council leaflet and FAQ were freshly fetched and matched the previously reviewed PDFs; forecast italics were visually verified. The official response form was rechecked read-only. All source IDs and the 42-record source count remain unchanged. New insights.css is in the deployment allowlist.

The full 11-year table is also in sources.json under charts.schoolRoll. Preserve the split after 2025/26 and the source/date/caveats. The leaflet’s prose percentage does not reconcile with the table endpoints; use the verified counts, not that percentage. Future pupil projections are not a guarantee of continuing operation, and the source does not explicitly identify an operating-school model assumption. The admissions FAQ describes only the current pre-statutory stage.

Borough charts, their data table and housing note are retained inside #borough-context, collapsed by default to reduce clutter. No extra page, new JavaScript dependency, tracker, submission route, public entry, fundraiser or automation was added. The source library remains unchanged.

## Participation UX refinement — 21 September 2026

The same header now appears across all eight pages, with outlined Letters and pale-green Contribute actions, plain research links, a native mobile Menu and current-page markers. The mobile header is non-sticky; action links remain exposed while research links are collapsed. Shared navigation.js and participation.css are in the public deployment allowlist. The latter loads last and uses a fresh asset URL because live testing caught browsers retaining the old shared styles after an HTML refresh. When editing navigation, maintain both desktop and mobile link groups and all eight headers.

The letters page offers Write/Read shortcuts, a form heading, an official-response reminder at the form, a writing route from the board, and bold labels for required private review versus optional publication/council sharing. Consent text, field names, unchecked defaults, private-field disabling and submission destinations are unchanged. No messages or submissions were sent during the UX review.

## Enrolment campaign option — 22 September 2026

Option 04 (#option-enrolment) proposes school-coordinated local outreach, authentic adult parent stories and a measured enquiries → visits → applications → enrolments journey. YouTube, TikTok and Instagram are labelled suggested channels, drawn as local SVG icons with adjacent text; they are not links to campaign accounts. There are now eight numbered approaches; later numbers and the formal-participation cross-reference were updated. No campaign was launched, third parties contacted or pupil target invented.

The compact #visit-school card links to the school’s verified Contact Us page for guided-tour enquiries. The campaign details cite school tour/admissions information and the council FAQ’s stage-specific admissions statement. Older admissions criteria or dates on the school page are not reproduced. The 42-record curated source library is unchanged; the new school links are cited directly and stored with the approach in sources.json. enrolment.css is loaded only on the homepage and is in the public deployment allowlist. No new JavaScript, embeds, trackers or intake form was added.

## Community letters — current workflow, 22 September 2026

The owner approved automatic screening and publication of routine relevant letters with explicit publication permission, followed by one email to a supplied reply address after live confirmation. This supersedes earlier letter-only statements about required private human review. Use notice `2026-09-22-letters-v3`, processing `yes-process-my-letter-v3`, publication `yes-publish-with-display-name-v3`, and unchanged council-sharing `yes-share-with-richmond-council-v2`. Earlier notices still require human approval. Labels must reflect the actual assessment: `AI screened` or `Human reviewed`. Keep the separate suggestions and supporter workflows unchanged, hold specific concerns for human review, and preserve the edit/removal route. See README.md and the private operating procedure. No deployment or automation status is established by this maintenance entry.
