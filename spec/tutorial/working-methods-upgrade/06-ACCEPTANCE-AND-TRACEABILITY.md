# Acceptance, verification and audit traceability

This is a checklist specification. Unless explicitly recorded otherwise during implementation, all application checks below are **not run for the proposed changes**.

## Acceptance matrix

| ID | Requirement | Owner PR | Verification | Required evidence |
|---|---|---|---|---|
| A01 | Audience and promise reflect agreed working-method intent | 1 | Editorial comparison and owner review | Spec decision + representative passages |
| A02 | 11 chapters, existing IDs/routes/anchors retained | 1–3 | Content and route tests | Before/after identifiers and link report |
| A03 | Existing processing example reachable from homepage | 1 | Homepage test + browser journey | Destination/anchor + screenshot |
| A04 | Readable DEL-101 shows actual metadata and relations | 1 | Contract/content tests + browser | Rendered fields, raw-byte identity and return link |
| A05 | Mobile diagram meaning is readable without tiny labels | 1 | Manual review + semantic comparison | 320/390 px screenshots and description |
| A06 | Source/preview tabs preserve edits and work by keyboard | 1 | Learning test + browser | State and focus observations |
| A07 | Navigation, status, references and roadmap reconciled | 1 | Content/editorial review | Changed/checked-unchanged register |
| A08 | Page-specific canonical/social metadata use correct public base | 1 | Built HTML check | Metadata report |
| A09 | Source model preserves plan/commitment/forecast/proposal | 2 | Model tests + owner semantic review | Source-to-claim mapping |
| A10 | Actual input-derived 5-day, 8-hour and SEK 26,000 comparisons | 2 | Unit/integration tests | Rule IDs, inputs, expected/observed output |
| A11 | Missing evidence stays unknown; conflicting claims stay visible | 2 | Negative fixtures + UI | Partial and conflicting result states |
| A12 | Catalogue reuses sources rather than copying values | 2 | Loader and mutation tests | One-source change reflected in all dependent views |
| A13 | Every important briefing claim has source/derivation support | 2 | Coverage test + manual read | Clickable source/field/rule trail |
| A14 | Agent walkthrough is labeled deterministic, with no real AI/action | 2 | Browser network test + content review | Disclosure and permitted-operation record |
| A15 | Existing labs, no-JS reading, slides and dashboard behavior retained | 1–3 | Existing suites + E2E | Suite results and manual exceptions |
| A16 | Hosted pages verified against expected deployed revision | 3 | Public smoke test | URLs, expected/observed revision, timestamp/status |
| A17 | Reader-study kit targets the agreed audience without leading tasks | 3 | Protocol review | Screening, tasks and observation template |
| A18 | Actual reader evidence not invented or conflated with technical checks | 3 | Evidence review | Real observations or explicit not-run status |
| A19 | Personal/company data absent from public study material | 3 | Publication/path review | Public-summary inspection |
| A20 | Browser-only changes never overwrite maintained sources | 1–3 | Network/state/byte tests | No persistence/external write evidence |

## Trace the earlier audit, do not silently lose findings

| Earlier finding | Disposition |
|---|---|
| WEB-01: source reading hides key frontmatter | PR 1, P1-04, A04 |
| WEB-02: mobile process diagrams too small | PR 1, P1-05, A05 |
| WEB-03: existing demo not prominent enough | PR 1, P1-02, A03 |
| WEB-04: mobile source/result too far apart | PR 1 component improvement; reused by PR 2; A06 |
| WEB-05: Contract Explorer information density | PR 1 disclosures; PR 2 question-led connection; A07/A13 |
| WEB-06: navigation/orientation/status repetition | PR 1, P1-05, A07 |
| WEB-07: missing search/share metadata | PR 1, P1-06, A08 |
| Fresh mobile versus resized desktop menu behavior | Test both in PR 1/3; do not describe fresh mobile as already broken |
| Blank quiz submission gives a premature score | PR 1 feedback adjustment; learning/browser test |
| Extra headings inside rendered demonstrations | PR 1 targeted hierarchy audit; preserve the Markdown lesson |
| Redirecting old reference link | PR 1 fix destination; preserve compatibility redirects |
| Public-network / presentation / physical-device gaps | PR 3 separate evidence rows; not inferred from local render |
| Audience too engineering-led | PR 1 shared baseline and targeted prose changes |
| Procedure teaching first links to requirement template | PR 1 replace primary optional example, keep deeper reference |
| Stale reference and roadmap statements | PR 1 dated reconciliation, no historical rewriting |
| Refinement, quality, provenance and time meaning | PR 2 one coherent example, not new mandatory chapters |
| AI beyond text assistance | PR 2 bounded task and explicit deterministic demonstration |
| Reader outcomes and scenario questions | PR 3 observation kit, with focused content checks in PR 1/2 |

## Existing commands verified in the repository

Prepare Python/Node dependencies using the repository guidance; preserve full Git history. These are existing commands, not claims they have been run during specification preparation.

```bash
# From repository root, when Python processing/measurement is affected:
.venv/bin/python -m unittest discover -s tests

cd site
npm ci
ASTRO_TELEMETRY_DISABLED=1 npm run check
ASTRO_TELEMETRY_DISABLED=1 npm run build
npm run test:learning
npm run test:scenarios
npm run test:content
npm run test:homepage
npm run test:contracts
npm run test:dashboard
node scripts/test-budget.mjs
cd ..
git diff --check
```

Use the project's documented Python environment if `.venv` has not yet been created. Do not alter measurement outputs merely to make tests pass. Reuse existing fault-handling tests; broad external API availability should not block offline core-content verification.

Proposed new commands: `npm run test:refinement` in PR 2; `npm run test:e2e` and `npm run test:hosted` in PR 3. Add them before documenting them as available. Browser-test dependency and executable setup belong in CI/developer instructions, not reader instructions.

## Review contract for every PR

Report: scope, source revision, changed files, explicit non-changes, checks with results, screenshots where relevant, remaining limitations and owner decisions. Keep code verification, content review, deployment and learning evidence separate. A pass with no command/output reference is not sufficient evidence. A skipped test must say why.

## Deliberately outside these three PRs

Full-text search/Pagefind, automated prose linting/Vale, a new video platform, more mandatory chapters, real PDM/ERP/CRM connectors, LLM accounts/provider integration, enterprise authentication, a general knowledge graph and broad framework updates. These may be separate future decisions; none is necessary to demonstrate the agreed learning promise.
