# PR 3 — Verify reader journeys and establish learning evidence

Suggested branch: `test/reader-journey-and-learning-evidence`.
Dependency: PR 1 and PR 2 merged. This PR completes cross-page assurance and prepares/records reader learning evidence; it does not postpone tests that belong in earlier PRs.

## 1. Two different completion statements

**Engineering verified** means identified checks passed on an identified build in an identified environment, with limitations reported.

**Learning investigated** means real representative people attempted real tasks and their observed behavior was recorded. It does not mean a small study proved generalized effectiveness.

A reader-study kit may be complete while the study status is **not run**. External learner participation is not a merge/release prerequisite under the existing project decision. Never invent participants, quotations, completion rates or measured time savings to close this PR.

## 2. P3-01 — Reproducible end-to-end browser journeys

Add a minimal Playwright setup as a development dependency if no equivalent now exists. Pin the implementation-selected tested version in the lockfile; no runtime bundle dependency. Test the production build served under the real `/document-as-code-lab/` base path, not only the development server or `file://` pages. The local test server must return genuine missing-route errors rather than masking all routes with an index fallback.

Proposed scripts: `test:e2e` for the local production build; `test:hosted` for an explicitly provided public URL and expected revision. These scripts do not exist in the inspected baseline. Extend existing CI rather than replacing unit/content tests with screenshots.

Required journeys:

| ID | Journey | Observable assertions |
|---|---|---|
| J1 | Homepage → existing processing demonstration | CTA reaches correct anchor; no account/setup barrier; source and result differ visibly |
| J2 | Edit → validate/build → inspect failure → recover | Stale output is labeled; failed input does not masquerade as a new successful output; reset works |
| J3 | Contract Explorer → DEL-101 source → return | ID, label, planned date, status and relation visible; raw bytes correct; return reaches relevant context |
| J4 | Refinement source → mapping → briefing | 5-day, 8-hour and SEK 26,000 comparisons derive from actual selected inputs |
| J5 | Remove budget/change forecast | Unknown stays unknown; date comparison updates; last output is labeled stale before rebuilding |
| J6 | Agent walkthrough | No model call; disclosure visible; sources and authority boundaries preserved |
| J7 | Mobile diagram/source/preview/navigation | Readable alternative, no page-wide clipping, keyboard/touch controls, preserved edits |
| J8 | Presentations, notes, legacy routes, dashboard | Direct routes and navigation retained; dashboard snapshot/live labels preserved; API failure remains explicit |

Run representative cases at 390 and 1440 px; add layout checks at 320 and 768 px. Test a fresh mobile page and desktop-to-mobile resize separately. Test keyboard-only navigation, focus order, text zoom, meaningful headings and source-table usability. Run Chromium in normal CI; use Firefox/WebKit for cross-engine checks where the environment supports them and report skips. Emulation is not a physical-device test.

Do not use pixel snapshots alone as the oracle. Check text/roles/state/URLs, computed values and source identity; add screenshots for owner review. Do not claim complete WCAG conformance from an automated scan or a few keyboard tests.

## 3. P3-02 — Public deployment verification

After an authorized deployment, run a read-only smoke check against the actual public URL. Record the expected source commit, deployment/run identifier, observed page URLs, viewport/browser and timestamps. Confirm the live artifact belongs to the expected revision using an explicit build manifest, not merely a 200 response or the repository's current main.

Add a small public build-information JSON if necessary containing only schema version, source commit and build time. Never include environment secrets or internal hostnames. If CDN propagation serves an older build, report a revision mismatch/pending verification; a bounded retry is acceptable but not an indefinite waiting loop.

Check homepage, representative chapters, the readable record, its raw source, new references, presentation entry/notes and one legacy redirect. Check browser console errors and missing local assets. Verify canonical/social metadata and correct base paths. Observe live-dashboard error behavior without making external API availability a prerequisite for core reading.

If hosted access is unavailable, mark **not verified in this environment** with the reason. An artifact rendered locally is not a substitute for hosted evidence. Physical mobile and manual assistive-technology checks are separate evidence rows, not automatically passed by browser automation.

Avoid adding a new scheduled watcher. A bounded smoke step after successful deployment or a manual workflow is sufficient. Preserve least-privilege Actions permissions, existing full-history checkout and measurement dependencies. No repository settings or branch-protection changes in this PR.

## 4. P3-03 — Reader study kit

Prepare an English facilitation guide and neutral tasks. Plan a first qualitative round with approximately 4–6 people matching the primary audience: experienced information users in projects, operations, sales/quotations, finance/planning or similar roles. They should not all be document-as-code enthusiasts, developers or technical writers. This sample size is a practical planning choice, not a statistical validity claim.

Use only the fictional materials. Do not ask participants to expose corporate data in this public tutorial. Obtain agreement before any recording; store identifiable notes outside the public repository. Public reporting uses anonymized aggregates and explicitly permitted excerpts only.

Introductory facilitator wording: “We are testing the material, not you. Please say what you are looking for and what you think the information means. You do not need to know the terminology.”

Tasks are goals, not step-by-step instructions:

| Task | Neutral participant prompt | What to observe |
|---|---|---|
| T1 — Relevance | “What do you expect to find here, and who does this seem intended for?” | Does the reader recognize new working methods, or assume a coding/writing course? |
| T2 — Discovery | “Find an example that helps you understand what happens when information changes.” | Path chosen, hesitation, setup assumptions, help needed |
| T3 — Meaning | “Prepare an internal note on the delivery date. What can you say, and what is still uncertain?” | Commitment/forecast/proposal distinctions; unsupported claims |
| T4 — Evidence | “Show where one important statement in your note came from.” | Readable record, source field/rule, ability to return |
| T5 — Missing evidence | “The budget extract is unavailable. What can you still report?” | No invented zero/no-cost conclusion; partial result understood |
| T6 — Agent boundary | “Which parts could an agent help with, and which decisions would you retain?” | Distinguishes access, calculation, proposal and authority |
| T7 — Transfer | “Where in your work might this approach help, and what would need to be in place?” | Recognizes opportunity without believing systems must be replaced |

Use a relevant subset per session rather than forcing all tasks. Avoid instructing participants to click “Sources,” select the correct mapping or repeat the headline; that would hide the question under investigation.

For each task record independent / completed with a prompt / not completed, observed misconception, page or control involved and a short factual observation. Record timing only as exploratory data; do not claim savings against a nonexistent baseline. If comparable pre-change evidence is unavailable, call it a first observation, not a before/after improvement.

## 5. P3-04 — Interpretation and bounded corrections

A serious semantic error is a participant leaving with an unsupported belief, such as “the newest date automatically changes the agreement,” “a generated briefing is approved,” or “the tutorial has live access to company systems.” Treat that as an actionable design issue even if the person completed every click.

Prioritize: blocking navigation/operation defects; misleading meaning or authority; repeated comprehension obstacles; then minor presentation preferences. Report counts with denominators where real data exists, not generalized percentages from a tiny sample. An isolated positive reaction is not evidence of learning.

Within PR 3, allow narrow fixes to labels, instructions, error states, focus/return behavior or specific explanatory passages discovered by these checks. Larger capabilities belong in the backlog. Link every correction to an observation or reproducible failing test; rerun its check.

If no real participants are available during implementation, deliver the complete kit, automated evidence and an explicitly unfilled findings template. Keep `learning_evidence: not_run`. Do not make synthetic agent role-play stand in for representative readers.

## 6. P3-05 — Evidence register and public reporting

Maintain an evidence index with test ID, requirement ID, source revision, environment, procedure, result, artifact reference, reviewer where applicable and limitations. Permitted statuses include `planned`, `passed`, `failed`, `not_run`, `not_verified`, `not_applicable` with a reason. A copied pre-update screenshot is baseline evidence, not a passed post-update test.

Keep reports separate: local build/browser verification; hosted verification; physical-device/manual accessibility checks; reader observations; owner content approval. Update `data/features.json` only against actual completion criteria and do not classify a study as complete merely because its protocol exists.

Publish only a concise, privacy-safe summary through `spec/tutorial/` if useful. Raw transcripts, personal details, recordings and recruitment contacts must not be placed in that tree because the site's file selection can publish it.

## 7. Proposed files and acceptance

New: `site/playwright.config.ts`, `site/tests/e2e/*.spec.ts`, a minimal hosted-check config/helper if needed, `spec/tutorial/working-methods-upgrade/verification/README.md`, `reader-study-protocol.md`, `reader-findings-template.md`, `evidence-index.json`. Private notes live outside the repository, not just in an easily published folder named “private.”

Modify: `site/package.json` and lockfile, existing PR/deploy workflows only as needed, `site/README.md`, specification/evidence registers and narrowly justified UI/text fixes. Add public build information via an existing build hook rather than a server dependency.

Accept when reproducible local journeys pass or have explicitly reviewed failures; hosted results are recorded truthfully; test commands are documented; the study kit can be used without interpretation by its author; all claims match available evidence; and prior chapter/lab/route behavior is retained. Pending hosted or learner evidence must remain visibly pending rather than becoming invented success.

Suggested commits: browser harness and journeys; hosted verification/provenance; reader-study kit and evidence register; narrow corrections and rerun evidence. A rollback removes this assurance layer without changing source facts or the learning sequence.
