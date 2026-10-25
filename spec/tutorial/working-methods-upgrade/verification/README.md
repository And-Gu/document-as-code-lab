# Verification and learning evidence

Package 3 supplies a reproducible engineering check and a reader-study kit. They answer different questions: an identified build can pass an engineering procedure; learning can only be investigated through real representative people attempting tasks. Neither establishes owner approval automatically.

**Learning evidence: not run. Hosted verification: passed for `9ac44630269e220a8ea6f6607f7d81b971901bcd`, deployment 40238084101 on 25 October 2026. Physical-device and manual assistive-technology checks: not run.** Local browser emulation is not a physical-device test or full WCAG assessment.

- [Reader-study protocol](reader-study-protocol.md): recruitment, privacy, neutral tasks, facilitation and interpretation.
- [Unfilled findings template](reader-findings-template.md): private session worksheet and privacy-safe aggregate reporting structure.
- [Evidence index](evidence-index.json): procedures, environments, revision, status, artifacts and limitations by requirement.
- [Site guide](../../../../site/README.md): reproducible commands and CI/hosted behavior.

The explicit publication allowlist includes these three Markdown documents and the evidence-index JSON. Do not put transcripts, recordings, identifiable notes or recruitment contacts in this directory or elsewhere in the public repository. Adding private study files to Git is not an acceptable storage strategy.

## Engineering procedure

`npm run test:e2e` uses pinned Playwright and the already-built production output, with Chromium in normal CI. `npm run test:e2e:cross` runs Chromium, Firefox and WebKit when their installed runtimes are supported. Each journey is asserted at 390 and 1440 CSS pixels; supplementary checks cover 320/768px, desktop-to-mobile resize, keyboard/focus, text enlargement and JavaScript-off output. Screenshots supplement semantic assertions and do not replace them.

J1 finds the processing demo; J2 edits/builds/fails/recovers; J3 follows a contract record and raw source; J4 maps sources and computes a briefing; J5 removes evidence and changes a date; J6 checks the illustrative agent boundary; J7 checks mobile controls/diagrams; J8 retains slides, notes, legacy routes and dashboard failure labels. A separate check asserts the build revision and genuine 404 errors, rather than accepting an index fallback.

Public `build-information.json` contains only schema version, source commit and UTC build time. A dirty working tree produces a null source commit, so it cannot be mistaken for a verified commit build. `test:hosted` requires an explicit URL, full expected revision and deployment/run identifier, checks the manifest before/after bounded read-only smoke tests, and reports a mismatch rather than silently accepting older CDN content. It never deploys or starts a watcher.

## Status discipline

Use `planned`, `passed`, `failed`, `not_run`, `not_verified` or `not_applicable`, with a reason. Keep local results, hosted verification, physical/manual checks, actual reader observations and owner approval in separate rows. Never mark a study complete merely because this kit exists. The first qualitative round is approximately 4–6 people; no statistical effectiveness or time-savings claim follows from that plan.

Package 3 was prepared as a dependent draft at the owner's request. All three specification and implementation PRs are now merged after explicit owner authorization. Rollback removes the harness, workflow additions, build-information hook and study-kit links; it does not change maintained source facts or the eleven-chapter sequence.

## Recorded local result, 25 October 2026

Implementation `cc226ec61b0d3a61b25e7f2fc577a33b58d46288`: 57 browser checks passed (19 each in Chromium, Firefox and WebKit), plus build/type/content/model regressions and 17 Python tests. The hosted-check procedure passed a localhost rehearsal and rejected a deliberately incorrect local manifest; neither run is a public deployment check. See the [review report and rendered evidence](https://github.com/And-Gu/document-as-code-lab/blob/test/reader-journey-and-learning-evidence/reviews/package-3/README.md) for commands, exact environments and limitations. The study kit is prepared; learning evidence remains not run.

## Recorded public verification, 25 October 2026

[Deployment 40238084101](https://github.com/And-Gu/document-as-code-lab/actions/runs/40238084101) successfully built, published and verified `9ac44630269e220a8ea6f6607f7d81b971901bcd`. A separate invocation of `test:hosted` from the local environment passed against the actual public URL, checking the same manifest before/after page, raw-byte, canonical/social, console/asset and controlled dashboard-error checks at 390/1440px. The published homepage and lab were also visually inspected. [Dated release evidence](https://github.com/And-Gu/document-as-code-lab/blob/main/reviews/release-2026-10-25/README.md) retains observations and screenshots. Later builds have their own commit/time; this record is not silently refreshed.
