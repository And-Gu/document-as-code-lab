# Information refinement fixtures

These fictional, curated Markdown/structured excerpts represent information that might come from a customer schedule, planning system, resource plan, budget and meeting note. There are no original Word/PDF/Excel binaries, parsers, business connectors or AI requests. The scenario is frozen at 4 November 2026.

`scenario.json` selects the source paths and existing DEL-101 / PRJ-101 records. The contract loader supplies those entities and their recorded relationship; they are not copied into this bundle. `identity-map.json` supplies the explicit IP-A mapping. Browser acceptance is an exercise choice, never business approval. `catalogue.json` stores purposes and file pointers; it does not duplicate facts, dates or source lifecycle states.

## Transformation contract

`schema.json` validates source structure with Ajv; YAML parsing rejects duplicate keys. The build-time loader records exact-byte SHA-256 hashes and Git revisions, or labels modified inputs as uncommitted. Claims identify a subject, predicate, value, unit, scope, period and exact source field. Date meanings remain separate. Inputs recorded after the scenario date or effective later are not current evidence.

The browser-safe model applies only an explicitly accepted mapping, then compares compatible claims. UTC calendar-day subtraction avoids DST-dependent results; it does not count working days. Capacity requires the same subject, hours and period. Budget values use safe integer minor units and a matching project, currency, scale and reporting scope. The project-total snapshot is cumulative, not an invented monthly budget. Percentages round only for display; a zero baseline gives an undefined percentage. Missing values and conflicting comparable claims withhold the affected conclusion. No latest-wins rule or inferred causal cost is used.

A pure result model feeds the situation overview, questions and source-linked draft. Every finding names its rule, source fields, revisions/digests, mapping and overrides. Browser edits are separate from maintained bytes. Explicit builds preserve the last successful output when input is invalid; excluded optional evidence gives a valid partial result. The deterministic agent replay calls the same model and never treats source prose as instructions.

## Reading, reset and verification

Source links carry a bounded fragment containing fictional practice inputs and last-built inputs. The fixed return destination restores both, including a stale/failed state; no cookie or browser storage is used. Reset restores the initial unresolved mapping, included sources and unchanged forecast. No edit is saved to GitHub. Without JavaScript, source cards and an independently calculated worked example remain available.

From `site/`, run `npm run test:refinement`, `npm run check`, `npm run build` and the existing tests. `scripts/test-refinement-browser.mjs` verifies the production site with an installed Playwright/Chromium runtime; see the site guide for environment variables. Technical success does not approve the business interpretation or establish reader learning.

The [lab](../../reference/information-refinement.md) and [catalogue](../../reference/knowledge-catalogue.md) are rendered through registered material markers. To roll back, remove their chapter and explorer links, markers, source adapter and components together. The existing onboarding processor and Contract Explorer remain independent.
