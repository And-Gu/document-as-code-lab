# Tutorial Design Baseline

The intended **v1.4 baseline** adopts the audience and working-methods promise agreed on 25 October 2026 in the existing product specification and decision register. Package 1 implementation, exact wording and visual treatment are in review; packages 2 and 3 remain separate future implementation work. The v1.3 history below remains evidence of the earlier editorial pass.

The functional direction comes from v1.2; the current v1.3 specification adds the editorial style accepted after three sample reviews on 19 October 2026. A specification records intent, not proof of implementation, chapter approval, accessibility conformance, or learning effectiveness.

- [Reusable specification template](01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md): a starting point for another tutorial.
- [Lab specification](02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md): reader outcomes, curriculum, and acceptance criteria.
- [Audit and backlog](03-V1-SITE-AUDIT-AND-PRIORITIZED-BACKLOG.md): the seven coordinated workstreams and their original observations.
- [Design decisions](04-DESIGN-DECISIONS.md): dated direction, conservative defaults, and details awaiting owner review.
- [v1.3 editorial audit](V1-3-EDITORIAL-AUDIT.md): original observations, reconciled with the deployed v1.2 baseline.
- [Accepted editorial samples](V1-3-EDITORIAL-DECISIONS.md): owner-approved examples and the boundaries of that approval.
- [Editorial review](EDITORIAL-REVIEW.md): chapter-by-chapter changes and regression evidence.

## Baseline Reconciliation

Implementation started from a clean `main` at `a7b88a8`. At that revision, Chapter 12 had already been removed and published. Its seven slide-source references, quiz, navigation, and counts had been reconciled; three legacy URLs redirect to the first-increment reference. The package's observations about a remaining remote chapter describe an earlier inspection, not the current state.

The current sequence contains eleven chapters. Existing historical measurement snapshots retain their original counts and paths. Review current behavior against the specification rather than treating the audit as a live status report.

## Ownership and Review

The tutorial owner reviews the resulting chapter text, scenario wording, guided explorer entry, and visual treatment. Technical checks establish working behavior, not educational effectiveness. No external learner study is a release prerequisite.

See the [implementation review](IMPLEMENTATION-REVIEW.md) for changed files, local preview links, verification evidence, and remaining owner decisions.

That review describes v1.2. The v1.3 pass starts from clean main at `6d8ee1d`; it preserves all existing interactions and source IDs, and returns substantively revised chapters to review.

Use the [project source map](../../reference/project-knowledge.md) to locate maintained sources and checks. Keep specific writing rules in [CONTRIBUTING.md](../../CONTRIBUTING.md) and terminology in [GLOSSARY.md](../../GLOSSARY.md), rather than duplicating them here.

## Working-methods upgrade — planning packages, 25 October 2026

The [three-package specification register](working-methods-upgrade/README.md) records the agreed audience and proposed audience/reader-experience, information-refinement, and verification/learning work. These specification PRs upload planning material; they do not deliver the described functionality or replace the current implementation baseline. Read the register for package locations, agent instructions and the distinction between specification adoption and sequential implementation.
