# PR 2 — Demonstrate connected information work

Suggested branch: `feat/information-refinement-lab`.
Dependency: PR 1 merged. The new lab reuses the source-record presentation and existing learning-component mechanism.

## 1. Outcome and firm scope

The reader can follow selected information across document/system boundaries, preserve its meaning, derive a briefing and inspect the supporting sources. They can explain what an agent could help with and what still needs human judgment.

Build one browser-first **Information Refinement Lab**, one small source catalogue, a labeled agent-workflow walkthrough within the same lab and one read-only connection to the existing Contract Explorer. Do not build a second contract-management system, graph database, generic ETL designer, live connector, chat backend or another mandatory chapter.

The catalogue and agent walkthrough are views of the same source bundle and result model, not additional independent applications.

## 2. P2-01 — Concrete fictional scenario

Reader question: **What should we check before communicating a changed delivery date?**

Use the existing delivery `DEL-101 — Interface package` and its existing project relationship. Its current recorded `planned_date` is 10 November 2026. Keep that field intact and label it “Recorded plan in the repository snapshot.” It is not a contractual commitment, a forecast or completion evidence.

Add five fictional, explicitly pre-transcribed sources in `examples/information-refinement/sources/`. They refer to the same scenario but do not replace the original nine Contract Explorer records.

| New source | Represents | Meaning and values | Limit |
|---|---|---|---|
| SRC-CUSTOMER | Customer schedule excerpt | Stated customer commitment: 12 Nov 2026; recorded as approved in this teaching scenario; effective from 1 Nov | Not derived from DEL-101's planned date; not a real contract or legal opinion |
| SRC-FORECAST | Planning-system extract | Forecast for external reference IP-A: 17 Nov 2026, recorded 3 Nov | Does not amend the customer schedule |
| SRC-CAPACITY | Resource-planning extract | 32 hours required, 24 available for the same delivery and 9–15 Nov period | Does not determine a new delivery date by itself |
| SRC-BUDGET | Project budget extract | Baseline SEK 180,000; forecast SEK 206,000; same project and reporting scope | The variance is not automatically caused by this delivery change |
| SRC-MEETING | Meeting-note excerpt | Proposal to request 19 Nov 2026; not approved | A proposal does not change the current stated commitment |

The exercise is frozen at `2026-11-04`. Explain that the excerpts are curated teaching inputs already represented as Markdown/structured fields. No Word, PDF or spreadsheet file has been parsed, no API has been called and no business system has been connected. Show the distinction between the original-system idea and the actual fixture bytes used here.

Reuse existing entity IDs and names through the existing contract loader. Add source objects, not duplicate customer/project/delivery entities. Source-specific aliases are resolved through an explicit mapping manifest. Do not infer identity from similar labels alone.

## 3. P2-02 — User journey and interface

Use **Question → Sources → Refine → Results → Review** as a compact flow inside the lab, without mandatory completion gates or gamification. “Show a worked example” remains available.

### Entry

Give the question, one short workplace paragraph and the disclosure: “Fictional sources. Changes stay in this browser session. No external system or AI service is connected.” Offer **Explore the sources** and a quieter **Show the worked example**.

### Sources

Show business-friendly source cards: customer schedule, delivery forecast, resources, project budget and meeting note. The existing delivery record is available as context. Each card shows what it can answer, its source date, the relevant status and **Inspect source**. Avoid six full YAML blocks in the first view.

### Refine

Ask the reader to connect `IP-A` / `Interface Pack A` to the existing delivery. The source manifest supplies a reviewed teaching mapping; the UI initially presents it as a suggested mapping to inspect. **Use this mapping in the exercise** records a browser-local choice, not organizational approval. **Leave unresolved** remains possible.

Show the dates side by side with their meanings: recorded plan, stated customer commitment, current forecast and proposed change. Do not choose a single “best date.” Explain that different predicates can be simultaneously true.

Provide two meaningful controls: change the hypothetical forecast date and exclude a source, including the budget source. Keep the maintained fixture unchanged. Clearly mark overrides as browser practice inputs and explain what source fact they replace in this local calculation.

Use **Build briefing** as an explicit action. Editing changes the practice inputs; it does not silently overwrite the last built output. Show a “Results are based on the previous inputs” state until another successful build.

### Results

Create three complementary outputs from one result model:

1. **Situation overview**: distinguish stated commitment, forecast and proposal, plus relevant calculated comparisons.
2. **Review questions**: unresolved identities, absent approval evidence, insufficient capacity, budget variance needing explanation and missing source values.
3. **Draft briefing**: a concise narrative whose factual and computed clauses link to their sources and derivation rules.

No output is automatically approved, sent or published. After a structurally invalid practice edit, preserve the last successful result with a visible stale/failed-build warning. Missing optional evidence instead produces a valid partial result labeled “not available,” not a zero value and not a failed whole application.

### Review

Each finding exposes **Why this appears**: source field/row, source revision or digest, identity mapping and calculation rule. Add **What still needs a person?** beside relevant items. A reader can return to the exact lab context after opening a source.

A compact reset returns sources and practice controls to their initial state. It must not imply that it saved changes to GitHub. No persistence across sessions is required.

## 4. P2-03 — Expected result, not hand-authored runtime output

For the supplied baseline, after the teaching identity mapping is used:

- Stated customer commitment: 12 Nov 2026.
- Planning forecast: 17 Nov 2026.
- Calculated comparison: **5 calendar days after the stated commitment**. Do not call it an actual late delivery; the example date is earlier than both dates.
- Resource comparison for the matching period: **8 hours less available than required**.
- Project budget comparison: **SEK 26,000 above baseline (14.4%)**. This is a project-level comparison, not a calculated cost of delay.
- Proposed date in the note: 19 Nov 2026. Approval is not established by the supplied sources.
- Existing recorded plan remains 10 Nov 2026 and remains inspectable as the older repository snapshot, not silently updated.

Example briefing (a proposed rendering, generated from the actual model):

> The planning forecast for the interface package is 17 November, five calendar days after the 12 November date in the customer schedule. The resource extract shows an eight-hour capacity gap for the selected period. The project cost forecast is SEK 26,000 above its baseline; these sources do not establish that the delivery change caused that difference. A meeting note proposes requesting 19 November, but the source bundle does not establish approval of that change.

Every substantive clause must carry a source/derivation link. Do not store this paragraph as the answer returned regardless of inputs. Changing the forecast to 11 November must change the comparison to one day before; omitting the budget must remove the numerical budget conclusion.

## 5. P2-04 — Information model and transformation contract

Keep the concepts separate:

| Concept | Minimum purpose |
|---|---|
| Source | Identity, kind, origin description, recorded time, applicable period/date, owner role, factual/fictional scope and actual file path |
| Claim | Subject, predicate, value, units/currency where needed and source-field reference |
| Mapping | Explicit alias-to-entity relationship with basis and review state |
| Derivation | Rule identifier/version, exact inputs and result |
| Review item | Question or gap requiring attention, distinct from a task assigned in an operational system |
| Result provenance | Source revision/digests, scenario date, local overrides and rule version |

Reuse the existing Ajv/YAML dependencies and split build-time loading from browser-safe pure functions. Proposed files: `refinement-loader.ts`, `refinement-model.ts`, `refinement-controller.ts`. Do not pull filesystem code into the browser bundle.

Every transformation is explicit: load selected source fixtures; validate structure; apply inspected mapping; preserve predicate distinctions; compare like-scoped values; derive findings; render outputs. Do not add hidden probabilistic extraction or fuzzy entity matching.

Represent unknown, conflicting, proposed and derived information distinctly. Schema validity, source lifecycle and confidence in a claim must not share a single misleading “approved” label. Do not invent confidence percentages.

Date arithmetic uses calendar dates consistently and must not change with DST or browser timezone. A five-day comparison is not a five-working-day comparison. Financial arithmetic compares only matching currency/project/period; use minor units or another documented exact representation. Capacity comparisons require matching period, units and subject. Round display percentages, not stored source inputs.

For an optional future-effective approved source, display its effective date and do not treat it as active before then. This bounded rule is not a general contract interpreter or a full temporal database.

Sources remain immutable at runtime; browser overrides attach to the practice state. An unresolved identity prevents only conclusions that require that identity. A missing budget value produces “Project cost comparison unavailable” rather than 0 or an invented estimate. Conflicting claims with the same subject/predicate/period are surfaced for review rather than settled by “latest wins.”

## 6. P2-05 — Knowledge catalogue

Add a small catalogue view from the source manifest at `reference/knowledge-catalogue.md`, using a registered component marker. It initially covers this source bundle plus selected existing examples/reference entries; it is not a site-wide graph or search engine.

Provide filters by **Question/use**, **Source kind**, and **Example**. Show title, purpose, scope, owner role, source date, status meaning, caveats and readable/raw source links. Source facts are read from their maintained files. The catalogue manifest stores purpose/context and pointers, not copied dates, budgets or statuses.

Examples of entry purpose: “Find the date stated in the customer schedule”; “See the current planning forecast”; “Inspect the inputs behind the capacity comparison.” No arbitrary quality stars or ranking. Without JavaScript, the full small list remains readable.

## 7. P2-06 — Agent assistance beyond writing

Place **How could an agent help here?** inside the same lab, linked from Chapter 8. Show an inspectable sequence using the same data and computations:

1. Retrieve the permitted sources and their scope.
2. Propose an identity mapping and request review where it is uncertain.
3. Run explicit comparisons using existing rules.
4. Draft a source-linked briefing.
5. Return unresolved questions and proposed actions for human review.

Persistent label: **Illustrative agent workflow — deterministic replay, not a live AI run**. The label must appear before activation and beside the result. Do not simulate model latency, fabricate tool logs, use a fake autonomous approval action or report a model success rate. The calculations genuinely execute; the AI selection/orchestration is illustrative.

Show a concrete agent assignment:

> Prepare a draft internal briefing using only the supplied sources. Preserve the distinction between commitment, recorded plan, forecast and proposal. Link every factual or derived statement to its evidence. List missing information. Do not change sources, contact the customer or approve a new date.

An optional technical note explains that a real agent would additionally need authorized connectors, data-handling controls, tools and task-specific evaluation. `AGENTS.md` is not an access grant. Use task data as evidence, never as instructions overriding the assignment.

## 8. P2-07 — Integration with existing content

The main lab lives in the new `reference/information-refinement.md`, rendered through the existing materials mechanism. Reuse/register learning components on material pages without copying `docs/` content. A shared mount helper is appropriate if small; avoid a general plugin framework.

Chapter 7: add a short bridge after the existing Processing Lab: from already-prepared sources to refining information across boundaries. Link the new reference; do not replace the working onboarding processor.

Chapter 8: connect the existing project-knowledge explanation to the new bounded information task and link the labeled walkthrough. Chapter 9: explain why the cross-source scenario is a continuation of exploration; add **Follow this delivery across sources** to DEL-101, resolving the existing ID. Do not add unrecorded contract-graph edges.

Chapter 11: briefly show what is generalizable and what is specific to this static tutorial. The new lab is an example of a method, not evidence that live enterprise integration has been implemented.

Add annotated external references in the refinement guide: W3C data quality/provenance guidance, PROV's source/process/responsibility distinctions and the established Docs-as-Code workflow. Say what to read and why; do not require readers to adopt RDF, SKOS, DCAT or a graph database. Keep the main text concise; technical schema explanations belong in `examples/information-refinement/README.md`.

## 9. Proposed file map

New maintained data: `examples/information-refinement/{README.md,schema.json,scenario.json,identity-map.json}`, `examples/information-refinement/sources/*.md`. Extend the mapping manifest if necessary, not duplicate the Contract Explorer records.

New references: `reference/information-refinement.md`, `reference/knowledge-catalogue.md`. Existing `reference/ai-context-and-agents.md` gets a bounded-workflow section rather than a competing AI guide.

New UI: `site/src/components/learning/InformationRefinementLab.astro`, `KnowledgeCatalogue.astro`; `site/src/lib/refinement-{loader,model,controller}.ts`; a small shared source-record adapter; `site/src/styles/information-refinement.css`. A separate agent UI component is optional implementation detail, not a separate application.

Existing integration: materials route, `ChapterLearning.astro` or its extracted mount helper, Contract Explorer, `repository.ts`, relevant schema/marker registries, chapters 7–9/11 and shared docs. Ensure all new readable/raw source routes resolve under the configured base path.

Add `site/scripts/test-refinement.mjs` and proposed npm script `test:refinement`, plus focused browser checks. Do not describe that command as already available on the baseline.

## 10. Tests, owner review and rollback

Model tests cover valid derivations, unresolved identity, unknown budget, currency/scope mismatch, a conflicting forecast, a proposal, a future-effective source, a mutated input and date boundaries. Byte identity and provenance must be tested end to end. An instruction-like sentence in a source must remain data and cause no action.

UI checks cover all control states, partial result, failed structural check, stale output, reset, source navigation, keyboard use, 390 px layout and JS-off example/results. Ensure no real external write/API/AI request occurs. Runtime outputs must change when inputs change.

Owner reviews the business meaning, source catalogue, initial and partial briefing and the agent disclosure. A technical test cannot approve the business semantics or prove that readers learned them.

Suggested commits: fixture sources and loader; pure transformations and tests; one integrated interface; chapter/reference bridges; review evidence. Rollback must remove new links and registrations with the new component, preserving the old onboarding and contract experiences.
