# Working-methods release — 25 October 2026

The owner explicitly authorized merge, push, deployment and publication after reviewing the linked proposals. Specification PRs #18–20 and implementation PRs #21–23 are merged. Package 1 was first merged into specification #18 to include its fix for the specification's previously broken portal link; #18 then passed Astro/PDF checks before reaching main. Packages 2 and 3 were retargeted, synchronized with main and merged after fresh passing checks. Original checkout edits were preserved.

Published and verified source: **`9ac44630269e220a8ea6f6607f7d81b971901bcd`**.

[Deployment 40238084101](https://github.com/And-Gu/document-as-code-lab/actions/runs/40238084101) passed build, Pages deployment and hosted verification. A separate `npm run test:hosted` passed from the local environment using:

- `HOSTED_URL=https://and-gu.github.io/document-as-code-lab/`
- `EXPECTED_REVISION=9ac44630269e220a8ea6f6607f7d81b971901bcd`
- `DEPLOYMENT_RUN_ID=40238084101`

The public manifest matched before and after the check. It visited the homepage, representative chapters, readable DEL-101 record and raw bytes, refinement guide/catalogue, presentations/notes, a legacy redirect and dashboard at 390/1440 CSS pixels. Canonical/social metadata, missing local assets and natural console errors passed. Controlled API failure remained explicit without relying on live API availability. [Observed URLs and environment](hosted-results.json), [public build information](build-information.json).

Published renderings were visually inspected: [desktop homepage](home-public.png), [mobile refinement result](refinement-public.png). The earlier local/cross-engine evidence stays tied to its original tested revisions; it has not been relabeled as hosted evidence.

The subsequent release-record commit only updates status documentation, the capability/evidence registers and this report. Its own build/deployment generates a new manifest and is checked separately; the evidence captured here remains a dated snapshot of the identified release. It does not claim to identify every future deployment.

Learning evidence remains **not run**. Physical devices and manual assistive technology remain **not run**. The prepared protocol and passing engineering checks do not prove learning or complete WCAG conformance. Release authorization does not blanket-approve every earlier chapter draft or any fictional business commitment.
