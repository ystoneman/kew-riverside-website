# Website usage analytics

Status (23 September 2026): the operator's Umami Cloud website (EU dashboard) exists and its Website ID is configured. On the owner's instruction the collector has two tiers: **basic page views on by default without a banner**, and **detailed usage only after opt-in**. Deployment and receiving-dashboard evidence are recorded in CHANGELOG.md once verified; local tests do not prove Cloud receipt. A website ID is public routing information, not an API key. Never put account passwords, API tokens, raw correspondence or private intake in this repository.

## What the dashboard answers

| Question | Report / signal | Interpretation |
| --- | --- | --- |
| Is the site being used? | Overview: views, visitors, visits over time | Browsers that did not object, block Umami or send a privacy signal; not verified people, parents or supporters. |
| Where do people begin and go next? | Pages and Journey report, pageview steps | Fixed page paths, including the return from browser Back. No query or fragment, private reference or individual letter. |
| Which parts do people reach? *(detailed, opt-in only)* | `Section reached`, grouped by page and `section` | A meaningful part of a broad editorial section was visible during an active foreground visit. Not proof it was read. |
| Do people spend time there? | `Section viewed 10s`, grouped by page and `section` | At least ten cumulative active seconds with that section occupying the largest visible area. Divide by measured visits reaching the same section and period. |
| How long are people active? | `Active viewing`, grouped by `seconds` | Cumulative thresholds 15, 30, 60, 120 and 300 seconds per page view. Each is emitted at most once. **Do not sum thresholds as elapsed time.** |
| What useful action do they open? | `Action opened`, grouped by `action` | Named page routes, official form, school enquiry, video handoffs and downloads. Counted at most once per action per page view. Download labels say “Download clicked”, not successful delivery. Not confirmation of provider receipt. |
| What kind of devices / locations? | Device/browser and approximate location reports | Umami derives these from connection information. City/region are approximate, sometimes wrong. No age, gender, class, child or parent status is collected. |

Suggested private dashboard: daily visits and views; top pages; pageview Journey from the homepage; section reached versus ten-second viewing; named action opens; device split. Start with the last seven days, compare the preceding period, and avoid judging small groups. No public counter or shared dashboard is necessary.

“Ignored” is not a measured outcome. A visitor may never reach a section, get an answer quickly, decline analytics, use a blocker, leave a hidden tab, or follow a direct link. Investigate low exposure separately from low viewing among people who reached the section. Use reports to inform subsequent UX inspection, not automatically remove less-visited evidence or family-information routes. The protected journey register still applies.

## Collection contract

The local `analytics.js` posts only to `https://cloud.umami.is/api/send`, using the documented public collection API. No external JavaScript is granted access to the DOM. CSP permits only that precise new connection endpoint; scripts remain local. Requests omit credentials and HTTP referrers. No server credential is needed.

Tiers. **Basic** (default, legitimate interests): one page view per page load with the fixed page label and bucketed referrer. No cookie is set and nothing is written to storage for it; the script only reads a saved choice. **Detailed** (consent): section, active-time and named-action events, only after “Allow detailed usage”. Choices are `allow`, `basic` or `deny`; no saved choice means basic. `allow` expires after 180 days (falling back to basic); `basic`/`deny` are kept for five years so measurement never silently widens. Unreadable storage means no analytics at all, because an objection could not be honoured. Do Not Track and Global Privacy Control turn off both tiers. There is no banner: the choices panel opens from the footer “Analytics choices” link and privacy/evidence page links. No-JavaScript browsing sends nothing. Share ideas and private correction/removal pages, links to them and referrers from them are completely excluded. Submission permissions do not enable analytics.

Payloads use hardcoded page, broad section and action labels. Never add form contents, search queries, arbitrary DOM text, user-generated IDs, per-letter viewing, political-opinion classifications, SEND/health question identifiers, user identifiers or cross-device matching. Referrer values are reduced to known search services, a generic social bucket (`social.example`), a generic other-site bucket (`external.example`), or a known site page. These example hosts are report labels, not destinations we contact; messaging-app visits often have no referrer.

Detailed viewing accrues only while the tab is visible and focused, the analytics panel is closed and activity occurred within the last 60 seconds. One-second tick deltas are capped after suspension. Section time excludes open menus, focused form controls and content under the header. Hidden/filtered sections do not qualify. The longest page view emits five time thresholds, plus at most two events per mapped section. A dropped request is not retried or persisted. Revocation stops timers and aborts outstanding requests where possible; a request already received cannot be recalled. Other open tabs receive the changed preference.

Umami itself groups technical requests into session histories using hashed identifiers; its current documentation describes monthly visitor grouping. The deployment does not identify people, enable replay/heatmaps, enrich profiles or infer opinions/personal circumstances. Do not connect dashboard sessions to named correspondence. Umami's DPA restricts special-category data; adding such data would require a different assessment and provider agreement, not just another checkbox.

When adding or renaming a public page, deliberately review its entry in `PAGES`; unknown pages are unmeasured by default. Add section and action labels only for broad public editorial content, with privacy and browser regressions. Do not derive labels automatically from new content or forms. Existing source, family-information and participation routes remain protected even if their measured use is low.

## Account and activation checklist

1. Use an operator-owned Umami Cloud account. The verified public Hobby offer is $0/month, one website, 100,000 events/month, six-month retention, including custom events and Journey reports. Event properties also consume quota. Check the actual account plan; do not upgrade or enter payment details without the operator's instruction.
2. Choose EU region if offered, verify the selected region and keep the dashboard private. Do not enable Share URL, optional AI features, identification, replay or heatmaps. Enable account two-factor authentication. EU selection does not establish that all subprocessors are in the EU.
3. Read the current DPA/subprocessors and confirm the intended generic usage purpose. Verify six-month retention or revise the notice to the actual period. Record settings privately; don't claim they were verified merely because public documentation was read.
4. Add a website named Kew Riverside with domain `ystoneman.github.io` (the collector independently restricts the project path). Under Edit → Tracking code, find its **Website ID**; use that ID in `analytics-config.json` and set `enabled` to `true`. Do not paste a provider script or API key. The collector runs only on the production hostname and project path; local previews cannot pollute the real dashboard.
5. Run all checks in `TESTING.md` and the analytics tests with intercepted requests. Check narrow mobile choices, privacy links, refusal, return/withdrawal, and native iOS touch/focus. Do not send fictional letters or forms to providers.
6. Publish through the normal tested deployment, then make one deliberate operator visit. Verify an actual pageview (and, after opting in, a named viewing event) in the private dashboard. Confirm “Turn analytics off” stops requests and recorded payloads contain no private strings. Record the deployment and receiving-account evidence before calling analytics live. The local tests establish the collector contract, not actual Cloud receipt.
7. Select “Turn analytics off” on the operator's ordinary browser after the verification so routine maintenance is not counted. Review quota and usefulness after there is meaningful traffic. No scheduled reporting automation has been added.

If the account cannot be configured, keep `enabled: false` and `websiteId: ""`. There is no external traffic. The privacy/footer control explains that analytics is not connected. To stop new collection globally, disable this configuration and deploy; already-open pages must reload to receive that operational change.

## Sources checked 22 September 2026

- [Umami collection API](https://docs.umami.is/docs/api/sending-stats): supported public endpoint and payload; no authentication token.
- [Metric definitions](https://docs.umami.is/docs/metric-definitions): technical/location fields, session and visit definitions, duration limitations.
- [Journey reports](https://docs.umami.is/docs/journey): page/event paths.
- [Pricing](https://umami.is/pricing) and [Cloud FAQ](https://docs.umami.is/docs/cloud/faq): plan, retention and quota. Recheck the account before activation.
- [Current DPA](https://umami.is/dpa), [security](https://umami.is/security), [subprocessors](https://umami.is/subprocessors): contractual restrictions, regions, deletion/backup and transfer information.
- [ICO storage/access exceptions](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/): the basic tier relies on the statistical-purposes exception, PECR Sch. A1 para 5, added by the Data (Use and Access) Act 2025 s.112/Sch. 12 and in force from 5 February 2026 ([SI 2026/82](https://www.legislation.gov.uk/uksi/2026/82/regulation/2/made)). ICO conditions: statistics to improve the service as the sole purpose, clear and comprehensive information, a simple free way to object, and processors limited to that purpose. The exception does not cover individual visitor tracking, so use Umami reports (including Journeys) **in aggregate only; never review individual sessions**. Detailed usage remains consent-based. UK GDPR basis for basic counts: legitimate interests. Revisit if ICO guidance or the provider's session handling changes.

These checks are engineering and source reviews, not professional legal advice or certification.
