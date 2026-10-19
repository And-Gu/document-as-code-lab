# Tutorial design decisions — owner-approved direction for v1.2

> 19 October 2026. Use this file for the tutorial update and as a small decision-register pattern for future tutorial projects. **Do not silently represent these design decisions as historical ADRs already in the source repository.**

| ID | Status | Decision | Rationale / boundaries |
| --- | --- | --- | --- |
| TD-01 | Agreed | Intended tutorial has **11 chapters**; Chapter 12 is removed | Avoid redundant adoption chapter. Clean up dependent links and slide sources without restoring deleted chapter. |
| TD-02 | Agreed | Browser-first core; optional local exercises | Conventional exercises are not required; reader can understand without installation or accounts. |
| TD-03 | Agreed | Short chapters, detail in reference guides | Each chapter earns its place through a distinct insight; link deeper material by value. |
| TD-04 | Agreed | Scenario-based, in-context knowledge checks with immediate rationale | Realistic decisions near the teaching moment; no scoring, streaks, compulsory completion, or obvious comparisons. |
| TD-05 | Agreed | Preserve existing labs/explorers when useful; guide entry to complex exploration | Add a meaningful first question, not a new graph application. |
| TD-06 | Agreed | Purposeful modern visual elements based on existing site visual identity | Preserve calm design; components must clarify a concept, state or navigation. |
| TD-07 | Agreed | Chapter 8 is about **agent-ready project information** | `AGENTS.md` entry point, architecture, terminology, rationale/decisions, authoritative sources, checks; avoid trivial context vs no-context benchmark. |
| TD-08 | Agreed | Design review by tutorial owner, then technical verification | No mandatory external reader studies at this stage; avoid claiming broad learning effectiveness. |
| TD-09 | Agreed | All seven v1.2 improvements in **one coordinated update** | One integration package/PR with internally reviewable workstreams and a verification report. |
| TD-10 | Conservative implementation default | Keep existing Astro, GitHub Pages, Mermaid, YAML/Reveal.js, stable IDs and palette | Only change tech when demonstrated necessary. |
| TD-11 | Owner review | Exact new visuals, scenario wording and whether a new project-knowledge map/ADR file is needed | Agent provides a concrete candidate; owner accepts or revises. No invented historical decisions. |
| TD-12 | Owner review | Chapter 8 headline: **Making Information Usable by AI Agents** | Working title; keep stable filename `08-ai-native.md` and frontmatter ID `04-ai-native`. |

## Open design boundaries, not blockers

- Use the existing site palette by default; show renderings for owner approval rather than pausing all work for a color decision.
- Chapter 11 can remain mostly unchanged; remove obsolete 'Next Ch 12' and fix factual inconsistencies.
- A lean source/architecture guide and decision log may be added **if** they reduce repeated instructions. Inspect and reuse `AGENTS.md`, `CONTRIBUTING.md`, `GLOSSARY.md`, `README.md` and existing reference files before creating anything.
- Scenario checks are optional per chapter, not a new mandated count. Initially implement in Ch 5/6/8; others may be proposed later.
