# Package 2 implementation review

Prepared as a dependent draft at the owner's request after technical review of package 1. Base: `2207e46` on `feat/audience-and-reader-experience` (PR #21), not main. Specification #19 remains separate at `f952545338dbe9d8a0eb6b2530b5bc3bfed08771`; its five runtime sources and manifests were copied deliberately, not its planning documents. No PR has been merged or site deployed by this work.

## Scope and traceability

| Requirement | Implementation | Verification and remaining review |
| --- | --- | --- |
| P2-01 | Five curated fictional excerpts; existing DEL-101 and its project loaded from contract sources; frozen date and explicit alias manifest | Exact-byte/digest tests and source mutation checks; owner reviews business meaning |
| P2-02 | Question/sources/refine/results/review; mapping choice; forecast and source controls; explicit build; partial/failed/stale states; reset and bounded source-return context | Model and browser checks; owner reviews presentation and wording |
| P2-03 | One result model renders overview, review questions and source-linked draft; changing or excluding evidence changes outputs | Baseline 5 days, 8 hours, SEK 26,000/14.4%; before-date and absent-budget tests |
| P2-04 | Ajv/YAML loader and browser-safe pure functions; claims, mapping, rules, source digests/revisions and local overrides remain separate | Scope/currency/period, conflicts, future-effective/recorded inputs, unknowns, safe integer money, invalid dates, DST/leap, mutation and escaped text tests |
| P2-05 | Manifest-derived catalogue with seven entries and three filters; no-JS full list | Filter combinations, raw/readable source routes and source-derived metadata |
| P2-06 | Same model runs the explicitly labeled deterministic replay; task assignment and human decisions visible | Changed inputs affect replay; request checks and no browser storage; not an LLM evaluation |
| P2-07 | Material component registration; small chapter 7/8/9/11 bridges; DEL-101 entry; source map/site guide/roadmap/register updates; annotated W3C/Write the Docs references | Existing chapter IDs, raw originals, graph relations, labs, slides/dashboard and internal links retained |

## Owner review

Review the business interpretation of plan/commitment/forecast/proposal, local identity confirmation, partial briefing without budget, catalogue wording and agent disclosure. These technical checks cannot establish business approval, learning effectiveness or usability for all readers. Chapters remain in review.

The original onboarding processor, nine contract records and graph edges, historical charts, publication workflows and optional PDF pipeline are unchanged. Package 3's cross-engine/hosted harness and actual learning evidence remain future work. No live integration, agent service, database or new framework was added.

## Validation

Tested clean implementation revision: `0b161201b0138caa976d66edecacc3934d5505d1`. Node 22.23.3, Python 3.9.6 and local Chrome 155.0.8059.85. The later evidence-only commit does not change runtime code, source fixtures, publication selection or chapter text; history-derived measurements can naturally gain a revision.

From `site/`:

- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: 86 files, zero errors/warnings/hints.
- `PYTHON=<existing repository venv>/bin/python ASTRO_TELEMETRY_DISABLED=1 npm run build`: 92 pages plus 19 legacy redirects.
- `npm run test:refinement`, `test:learning`, `test:scenarios`, `test:content`, `test:homepage`, `test:contracts`, `test:dashboard`: passed. Content check covered 2,224 internal links/assets across 111 HTML pages. Dashboard used the same Python environment.
- `node scripts/test-budget.mjs`: passed.
- From repository root: `<existing repository venv>/bin/python -m unittest discover -s tests`: 17 tests passed.
- `node scripts/test-refinement-browser.mjs`: 10 checks passed, including keyboard build, stale/failed/partial/reset states, source navigation with exact state restoration, original bytes, replay, catalogue, 320/390/768/1440px, 200% text and JavaScript-off results. No uncaught errors or external/write requests.
- `node scripts/test-reader-experience.mjs`: all 14 existing reader-experience checks passed against the package-2 build, including the reviewed package-1 tab regression, labs, Contract Explorer, diagrams, slides, legacy routes and dashboard.
- `git diff --check`: passed. Original checkout’s three user-edited files remain outside this worktree and unchanged by this task.

Browser commands used `PLAYWRIGHT_MODULE` pointing to the installed runtime’s Playwright ESM entry, `CHROME_PATH` pointing to system Chrome and `REFINEMENT_TEST_URL` / `READER_TEST_URL` = `http://127.0.0.1:4330/document-as-code-lab/`. Exact browser results are in [refinement results](refinement-browser-results.json) and [existing reader regressions](reader-regression-results.json).

Rendered screenshots were inspected: [mobile entry](initial-390.png), [invalid edit and retained result warning](partial-failed-390.png), [readable source](source-390.png), [agent replay](replay-390.png), [catalogue](catalogue-390.png), [desktop evidence disclosure](worked-1440.png), [200% text](text-200.png).
 Local preview evidence does not establish a hosted deployment. Browser checks use Chromium, CSS viewports and text enlargement; physical devices, screen readers, native browser UI zoom and Firefox/WebKit are outside this run. The existing Mermaid bundle-size advisory remains.
