# Source and reference register

Repository checks were made against commit `9b63bdbc14c0c5352e364ba0289ec071e5566e48` on 25 October 2026. These references support the design constraints; they do not prove implementation or learner effectiveness.

## Repository evidence

- `AGENTS.md`: authority, source paths, base path, verification and publication constraints.
- `CONTRIBUTING.md`: English documentation; stable IDs; editorial review and approval distinctions.
- `spec/tutorial/README.md` and `02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md`: eleven chapters, existing curriculum, optional exercises and no mandatory external learner study.
- `reference/project-knowledge.md`: source ownership and maintenance boundaries.
- `site/README.md`: existing lab behavior, raw sources, loaders, static snapshots, progressive enhancement and test commands.
- `site/package.json`: existing scripts/dependencies; the newly proposed refinement/browser scripts are not yet present.
- `site/src/pages/materials/[...slug].astro`: current material rendering and existing related-chapter links.
- `site/src/content.config.ts`: materials collection matches flat `spec/tutorial/*.md`; new nested spec pages need explicit registration.
- `site/src/lib/repository.ts`: public-file selection, including recursive specification publication; never put private study data there.
- `examples/contract-explorer/README.md` and existing `records/DEL-101.md`: nine authoritative fictional records and the distinction between recorded planned dates, statuses and proposed changes.

Canonical source form: `https://github.com/And-Gu/document-as-code-lab/blob/9b63bdbc14c0c5352e364ba0289ec071e5566e48/<path>`.

Earlier supplied audit: `webbgranskning-document-as-code-2026-10-25/README.md`, based on the downloaded GitHub Pages artifact for workflow run 40211446440. Its public-network/physical-device limitations remain limitations, not verified defects. The current specification package does not repeat that browser audit.

## External primary guidance checked on 25 October 2026

| ID | Reference | Use in these PRs | Not a requirement to… |
|---|---|---|---|
| R1 | W3C Data on the Web Best Practices — https://www.w3.org/TR/dwbp/ | Source metadata, quality, provenance, versioning and fitness for use | Publish corporate data openly or implement every recommendation |
| R2 | W3C PROV Model Primer — https://www.w3.org/TR/prov-primer/ | Distinguish source objects, transformations, derivations and responsible agents | Adopt RDF or a provenance database |
| R3 | W3C WCAG 2.2 Understanding Reflow — https://www.w3.org/WAI/WCAG22/Understanding/reflow.html | Reflow of ordinary content; meaningful alternatives for complex diagrams | Claim that fitting an SVG proves accessibility, or that 16 px is a WCAG minimum |
| R4 | W3C ARIA APG Tabs Pattern — https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ | Source/preview semantics and keyboard interaction | Force every section into tabs |
| R5 | GOV.UK moderated usability testing — https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing | Observe realistic tasks with neutral prompts and appropriate participants | Treat a small formative study as statistical proof |
| R6 | Playwright official introduction — https://playwright.dev/docs/intro | Production-browser test harness and supported engines | Replace manual/physical-device/accessibility observation |
| R7 | Playwright web server guidance — https://playwright.dev/docs/test-webserver | Repeatable test-server setup with a real HTTP origin | Assume the development server is equivalent to published output |
| R8 | Diátaxis — https://diataxis.fr/ | Separate learning, reference and implementation depth when editing | Reorganize the entire website |
| R9 | Write the Docs, Docs as code — https://www.writethedocs.org/guide/docs-as-code/ | Explain the established versioning/review/testing lineage and this lab's broader application | Recast the primary audience as technical writers |

In reader-facing references, explain the question a source answers and the useful section. Do not paste a bare reading list or imply these sources endorse the entire proposed lab. The small example datasets, control labels and numerical test expectations are original design proposals, not findings from these external sources.
