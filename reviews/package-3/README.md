# Package 3 review evidence

Tested clean implementation: `cc226ec61b0d3a61b25e7f2fc577a33b58d46288`, based on package 2 `ed07f1a` (PR #22). Specification #20 was read at `c53a5edb8f379bd4cd915472194f635a56a5d44f` from its own branch. This is a dependent draft prepared at the owner's request while packages 1 and 2 remain open, not a merge or deployment.

## Actual checks

- Node 22.23.3; pinned `@playwright/test` 1.64.1; Chromium 156.0.8078.4, Firefox 157.0, WebKit 27.2 on macOS.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: 93 files; zero errors, warnings or hints.
- `PYTHON=<repository venv>/bin/python ASTRO_TELEMETRY_DISABLED=1 npm run build`: 95 pages plus 19 redirects. Existing Mermaid bundle-size advisory remains.
- `npm run test:e2e:cross`: **57 passed**, zero skipped/flaky/unexpected; 19 per engine. J1–J8 run at 390/1440px. Supplements check 320/768px, desktop-to-mobile focus/edit preservation, text enlargement, JavaScript-off worked results, touch-operated tabs, source-table usability, raw bytes, production manifest and genuine 404/405 responses.
- `npm run test:verification`: clean commit identification, dirty/untracked-tree null identity and minimal public fields passed.
- `npm run test:learning`, `test:content`, `test:homepage`, `test:refinement`, `test:contracts`, `test:dashboard` and `node scripts/test-budget.mjs`: passed. Content test covered 2,289 local links/assets across 114 HTML files. Learning includes scenario and architecture tests; dashboard used the same Python environment.
- Repository Python unittest discovery: **17 passed** with Python 3.9.6.
- Workflow YAML parsing and `git diff --check`: passed.

The production test server is owned by Playwright at `http://127.0.0.1:4340/document-as-code-lab/`; it serves actual output, rejects writes and does not turn missing routes into index HTML. No browser retries conceal failures. [Per-test local results](local-results.json) retain revision, engine, viewport/timestamps, result and procedure. [Build information](build-information.json) identifies the tested output.

The read-only hosted command was rehearsed at `http://127.0.0.1:4341/document-as-code-lab/` with `EXPECTED_REVISION=cc226ec61b0d3a61b25e7f2fc577a33b58d46288` and `DEPLOYMENT_RUN_ID=local-rehearsal-only`: one smoke test passed across 390/1440px, metadata, routes/raw sources, missing assets, console and controlled dashboard API failure. This is **not hosted verification**. [Rehearsal result](smoke-rehearsal.json).

A second local rehearsal deliberately replaced only the generated test manifest's commit with an incorrect value. The smoke check rejected it with “Revision mismatch/pending” before route verification; the original generated manifest was restored. [Mismatch guard](mismatch-guard.json). No public artifact was changed.

## Traceability and corrections

| Requirement | Delivered evidence | Boundary |
| --- | --- | --- |
| P3-01 | Pinned dev-only runner, J1–J8 and supplements, normal Chromium CI, three local engines, review screenshots | Emulation is not a physical phone or full accessibility audit |
| P3-02 | Minimal build manifest, explicit URL/commit/run smoke command, post-deployment bounded verification job, successful local rehearsal and rejection guard | Public package deployment not authorized/performed; hosted status remains not verified |
| P3-03 | Audience/recruitment plan, neutral T1–T7 cards, consent/privacy/storage guidance, facilitating/scoring procedure | Kit ready; no participant recruited or measured |
| P3-04 | Serious semantic-error rubric, prioritization, blank corrections log, source-linked assertions | No synthetic reader observations or invented UI defect |
| P3-05 | Explicit evidence index, source revisions/environments/status/artifact/limitations; selected public summary only | Owner acceptance, manual accessibility and physical devices remain separate, not run |

The first harness run exposed assertion errors rather than product defects: comparing `innerText` to Playwright's hidden-inclusive text assertion, and using its text engine for `noscript` content that the engine deliberately excludes. The corrected checks compare consistent full text for retained outputs and rendered DOM innerText for the no-JS view. The publication-selection regression was extended by exactly the newly authorized evidence-index JSON. Rerun: all 57 passed. No chapter-wide rewrite or unsupported semantic “fix” was made.

## Rendered review samples

Selected screenshots were visually inspected across all three engines. These are screenshots from this build, not copied package-1/2 baseline evidence.

- [Chromium mobile refinement entry after source return](chromium-390-J4.png)
- [Firefox desktop refinement entry](firefox-1440-J4.png)
- [WebKit mobile refinement entry](webkit-390-J4.png)
- [Chromium desktop Contract Explorer after return](chromium-1440-J3.png)

Additional J1/J3/J4/J6 screenshots are stored beside this report. They supplement the assertions; they do not prove learning.

## Remaining evidence and review

Public deployment: **not verified**; no release was authorized. Reader study: **not run**; no participants, quotations, task outcomes or time savings have been invented. Physical devices, native browser UI zoom and manual screen-reader testing: **not run**. Owner acceptance of content/design: **not recorded**. CI execution is reported on the PR separately from these local results.

The final evidence/documentation commit does not change runtime or harness behavior. Its public evidence-index values and history measurements differ from the tested revision; the recorded build manifest is deliberately retained as evidence of that exact earlier build. New CI builds generate their own manifest from their actual checkout.

The existing eleven chapters/IDs/routes, source facts, graph edges, labs, historical images and PDF pipeline remain. The optional PDF pipeline was not rerun. Full-history checkout and Python setup are retained; no settings, branch protection, new schedule or broader token permission was introduced. The original user's checkout edits were preserved.
