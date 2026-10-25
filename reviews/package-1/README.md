# Package 1 implementation review

25 October 2026. Technical and browser checks below ran against **`fa7b0589b5f75eee6ffb2724011839c582e03057`**, with a clean working tree. The subsequent evidence-only commit adds this report, the browser result and screenshots; it changes no application code, chapter sources or publication selection. Rebuilding it would update Git revision/history metadata; the executable checks and screenshots identify the tested implementation revision above. All content and visual treatment remain for owner review.

## Dependency and source reconciliation

- Implementation branch: `feat/audience-and-reader-experience`.
- Base: specification PR [#18](https://github.com/And-Gu/document-as-code-lab/pull/18), still open at `b816ec79342fef680d01e286aa5d22c278151aa5`.
- Read package 2 independently from [#19](https://github.com/And-Gu/document-as-code-lab/pull/19), `f952545338dbe9d8a0eb6b2530b5bc3bfed08771`, including its fixture description. Read package 3 from [#20](https://github.com/And-Gu/document-as-code-lab/pull/20), `c53a5edb8f379bd4cd915472194f635a56a5d44f`. Both remain open; their files were not copied into this branch.
- GitHub main remains `9b63bdbc14c0c5352e364ba0289ec071e5566e48`, the specified historical baseline. No intervening application commits needed reconciliation. PR #18 adds planning files only.
- The draft implementation PR targets `spec/working-methods-01-audience`. Retarget it to `main` after #18 is merged; do not merge any specification as part of this implementation.
- The original checkout had three uncommitted changes: the budget reference URL, homepage budget anchor, and its test. They remain untouched there. The same necessary final-destination correction and regression assertion are included independently in the isolated implementation checkout.

## Requirement matrix

| Requirement | Implementation | Actual evidence | Remaining review |
| --- | --- | --- | --- |
| P1-01 / A01 | Existing product specification now records intended v1.4 audience/promise/outcomes; dated TD-14–17; generic template questions; concise agent/contributor guidance; registers reconciled | Source diff and [representative passages](editorial-samples.md) | Owner acceptance of exact copy; specification adoption is not delivery/learning approval |
| P1-02 / A02–03 | Two homepage actions, Processing Lab directory entry, workplace bridge, shared four-group configuration for homepage/menu, dashboard labeled Behind the lab | `test:homepage`, `test:content`, browser homepage-to-lab journey; desktop/mobile screenshots | Homepage wording and visual balance |
| P1-03 / A01–02 | All eleven chapters reviewed; targeted changes to 1/2/5/8/11; procedure template uses existing schema; 6/7 alt text fixed; optional depth retained | [Chapter map](../../spec/tutorial/working-methods-upgrade/05-CHAPTER-CHANGE-MAP.md), stable-ID tests, template validation, editorial samples | Revised chapter passages remain in review; broader style change deferred |
| P1-04 / A04, A20 | Kind adapter reuses existing loader; all nine records show real metadata, relationships, provenance and original source; validated record-ID return route | `test:contracts` includes mutation, digest and raw-byte identity checks; DEL-101 browser journey and screenshot | Readable field labels/layout. DEL-101 remains a recorded plan, never a contractual date |
| P1-05 / A05–07, A15, A20 | Source-derived diagram lists and optional full diagram; mobile Source/Preview tabs in existing editor; shared menu/current chapter; source-heading contents for longer chapters; one editorial status; blank quiz feedback; explorer source/provenance hierarchy | `test:content`, `test:learning`, `test:scenarios`, browser states/focus/reset/resize/no-JS/reflow; supplemental native-menu and explorer-filter checks | Visual treatment; no claim of complete accessibility conformance |
| P1-06 / A07–08 | Current reference destinations and roadmap; shared canonical/social metadata for documentation/decks; existing local illustration; explicit planning-page publication list | `test:content` checks 2,006 internal links/assets over 103 HTML files, metadata, diagrams; `test:homepage`, `test:architecture` publication list | Share wording and public planning selection |

## Commands and observed results

Environment: macOS, Node **22.23.3**, Python **3.9.6** from the existing project virtual environment, Chrome/Chromium **155.0.8059.85** through the supplied Playwright installation. `npm ci --no-audit --no-fund` installed the unchanged lockfile (527 packages). No global dependency or repository setting was changed.

From the repository root:

```sh
# PYTHON identifies the existing project .venv/bin/python.
"$PYTHON" -m unittest discover -s tests
git diff --check
git diff origin/spec/working-methods-01-audience --check
```

Result: **17 Python tests passed**; both whitespace checks passed. Python source/measurement behavior and historical chart assets were not changed.

From `site/`, with `PYTHON` set as above and `ASTRO_TELEMETRY_DISABLED=1`:

```sh
npm run check
npm run build
npm run test:learning
npm run test:scenarios
npm run test:content
npm run test:homepage
npm run test:contracts
npm run test:dashboard
node scripts/test-budget.mjs
```

All commands passed. Astro check: **77 files; 0 errors, 0 warnings, 0 hints**. Build: **84 generated pages plus 19 compatibility redirects**. The build reports a bundle-size advisory for chunks over 500 kB; no performance claim is inferred. Source/route tests count all 103 HTML files. The learning suite also runs scenario and architecture checks. Dashboard tests exercise pagination, rate limits, partial failures, snapshots, provenance and credentials exclusion, using controlled inputs.

For the production-build browser run:

```sh
npm run preview -- --host 127.0.0.1 --port 4321
# Astro reported the available preview port as 4328; use the reported URL.
READER_TEST_URL=http://127.0.0.1:4328/document-as-code-lab/ \
  PLAYWRIGHT_MODULE="$PLAYWRIGHT_ESM_ENTRY" \
  CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  node scripts/test-reader-experience.mjs
```

`PLAYWRIGHT_ESM_ENTRY` was the supplied runtime's `playwright/index.mjs`. This is a development/test prerequisite, not part of the browser learning path or runtime bundle. No diagnostic filter was set for the final run.

**14 browser checks passed**; see [machine-readable results](browser-results.json). The run covers primary entry, all three editors, source/preview keyboard and selection state, schema/build failure and recovery, last successful outputs, blank/partial quiz completion, source navigation/byte identity, all four widths, resize, 200% text enlargement, no-JS reading, slide keyboard navigation, notes, legacy route and dashboard unavailable-snapshot labels. No uncaught page errors or non-GET browser requests were observed.

Additional inspection on the same build: opened/closed the native chapter menu using Enter; switched Contract Explorer from impact to commitments with ArrowLeft; filtered PRJ-101/AGR-002 and observed two delivery rows. Captured the menu, impact view and mobile preview. These checks also passed.

## Visual evidence and review

Screenshots are local production-build renders, not deployed-page evidence. Component crops have names indicating the **page viewport**, not the crop's pixel width. Ordinary-page reflow was checked at 320, 390, 768 and 1440 CSS pixels. Representative screenshots were inspected visually; record field semantics, readable diagrams, editor state and menu orientation were also asserted programmatically.

| View | Evidence |
| --- | --- |
| Homepage | [390](screenshots/home-390.png), [1440](screenshots/home-1440.png) |
| Existing editor | [Source 390](screenshots/processing-390.png), [Preview 390](screenshots/processing-preview-390.png), [side by side 1440](screenshots/processing-1440.png) |
| DEL-101 | [390](screenshots/record-390.png), [1440](screenshots/record-1440.png), [200% text](screenshots/record-text-200.png) |
| Chapter 6 diagram | [320](screenshots/diagram-06-320.png), [390](screenshots/diagram-06-390.png) |
| Chapter 7 diagram | [320](screenshots/diagram-07-320.png), [390](screenshots/diagram-07-390.png) |
| Navigation and explorer | [Menu 390](screenshots/menu-390.png), [change impact 1440](screenshots/contract-impact-1440.png) |

The browser checks found and drove fixes for a focus handler that interfered with editing, source text extraction from highlighted Mermaid nodes, and a sidebar that left insufficient reading space at enlarged text sizes. Those failures are resolved in the tested revision. Menu collapse now starts at 1100 CSS pixels; editor tabs start at 700.

## Checked unchanged and limits

- Eleven chapters, all stable IDs, old routes/anchors and redirects, `/document-as-code-lab/`, `docs/` ownership, existing procedure/contract schemas and record facts, processing rules, quizzes, deck routes/slide counts, dashboard retrieval behavior, historical charts and workflow definitions retained.
- Chapter prose 3/4/6/7/9/10 checked unchanged, apart from 6/7 descriptive visual metadata. The full chapter map identifies every disposition. All chapter statuses remain in review.
- Final copy/design approval: **pending owner review**. No broad site-wide rewrite or inferred chapter approval.
- Public deployment: **not performed / not verified**. This is a draft branch. Existing Astro CI targets PRs to `main`; the stacked PR does not itself satisfy that trigger. Run/inspect CI again after retargeting. Repository settings and workflow triggers are unchanged.
- Physical devices, Firefox/WebKit, manual assistive technology and full WCAG conformance: **not verified**. 200% text enlargement and viewport reflow were checked; native browser-UI zoom was not automated.
- External reader study: **not run**. No learner effectiveness or time-saving claim.
- PDF proof/full book: not rebuilt in this frontend package. Existing source excerpts remain maintained; no PDF-release claim.
- Package 2: no refinement fixtures in runtime, lab, source catalogue, agent replay or cross-system integration. Package 3: no hosted-revision harness, cross-engine CI or study kit. Those implementations start only after their predecessor is reviewed and merged.

## Owner review

Review the [before/after passages](editorial-samples.md), homepage/diagram/editor/source-record screenshots, all eleven chapter dispositions and the publication allowlist. Decide whether the wording and treatment serve the agreed audience. The implementation and technical results support that decision; they do not make it on the owner's behalf.
