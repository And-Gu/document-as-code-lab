# Working-methods upgrade: three specification packages

Prepared and uploaded: 25 October 2026. Repository: `And-Gu/document-as-code-lab`.
Inspected baseline: `9b63bdbc14c0c5352e364ba0289ec071e5566e48`.

## Delivery status and scope

These are implementation specifications, not implemented features. The owner requested three GitHub pull requests containing the agreed planning package. The specification PRs add documentation and fictional teaching fixtures only; they do not implement or publish the website changes, approve chapter revisions, or establish learning effectiveness.

The three specification branches independently target `main` and add different files. Review and merge the specification packages in order 1, 2, 3. All three packages can be adopted before implementation starts. The subsequent **implementation** PRs must run sequentially: implement package 1 first; implement package 2 from current main after implementation 1 is merged; implement package 3 after implementation 2 is merged. Merging a specification is not completing its implementation.

| Package | Specification branch | Contents | Subsequent implementation branch |
|---|---|---|---|
| 1 | `spec/working-methods-01-audience` | Shared baseline, audience/reader-experience specification, chapter map, acceptance matrix, handoff, references and copy | `feat/audience-and-reader-experience` |
| 2 | `spec/working-methods-02-refinement` | Information-refinement specification, five fictional sources, scenario/mapping data, eleven expected cases and fixture check | `feat/information-refinement-lab` |
| 3 | `spec/working-methods-03-verification` | Verification/learning specification and assembled-package integrity manifest | `test/reader-journey-and-learning-evidence` |

The numbered PR labels in the source documents identify work packages, not GitHub PR numbers. The handoff's implementation instructions apply to later authorized implementation work, not to these documentation-only PRs. No PR is merged automatically.

## Read in this order

1. [Shared design baseline](01-SHARED-DESIGN-BASELINE.md).
2. [Package 1](02-PR1-AUDIENCE-AND-READER-EXPERIENCE.md), [package 2 on its specification branch](https://github.com/And-Gu/document-as-code-lab/blob/spec/working-methods-02-refinement/spec/tutorial/working-methods-upgrade/03-PR2-INFORMATION-REFINEMENT.md), [package 3 on its specification branch](https://github.com/And-Gu/document-as-code-lab/blob/spec/working-methods-03-verification/spec/tutorial/working-methods-upgrade/04-PR3-VERIFICATION-AND-LEARNING.md).
3. [Chapter changes](05-CHAPTER-CHANGE-MAP.md), [acceptance and traceability](06-ACCEPTANCE-AND-TRACEABILITY.md), [agent handoff](07-AGENT-HANDOFF.md).
4. [References and baseline](08-REFERENCES-AND-BASELINE.md), [draft copy](09-CONTENT-SAMPLES.md), [fixture documentation on package 2's branch](https://github.com/And-Gu/document-as-code-lab/blob/spec/working-methods-02-refinement/spec/tutorial/working-methods-upgrade/fixtures/README.md).

Cross-package links use the specification branches while the PRs are open. After all three specification PRs are merged, use the same filenames in this directory on `main`; reconcile these links before deleting the specification branches.

## Agent starting point

Read the repository's current `AGENTS.md`, `CONTRIBUTING.md`, project source map and tutorial specification register, then the shared baseline, complete relevant package, acceptance matrix and handoff. Reconcile current main against the inspected baseline without discarding intervening work. The audience and direction record the owner's agreed intent; exact prose, interactions and thresholds remain reviewable proposals.

Keep eleven chapters, stable IDs/routes/anchors, existing labs and the browser-first/no-account core. Documentation and website copy remain English. No enterprise connector, live AI execution, new platform or private operational data is introduced by these packages.

Do not automatically execute implementation work simply because the specification files exist. When implementation is authorized, implement one package only, provide actual test evidence and leave its PR for owner review. No external reader study is a merge prerequisite. Record a study not performed as not run.

## Publication and validation boundaries

This directory is linked from the existing specification register; it does not replace the product specification. Updating governing intent and registering selected nested material pages in the portal are package 1 implementation tasks, not changes made by uploading these plans. Treat these files as public: existing source-publication rules can expose repository specifications.

The fixture directory contains proposed fictional teaching inputs, not runtime data. The existing DEL-101 record must be loaded from the repository during implementation, not recreated. Run `python spec/tutorial/working-methods-upgrade/checks/validate-fixtures.py` after package 2 is available (requires PyYAML). This checks specification consistency only, not the proposed application. The integrity manifest in package 3 describes the assembled package after all three specification PRs are merged.

The earlier audit is historical evidence with its original limitations. No application, browser, deployment or reader-study success is claimed by uploading the package.
