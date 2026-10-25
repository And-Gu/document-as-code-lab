# PR 1 — Clarify the audience and repair the reader journey

Suggested branch: `feat/audience-and-reader-experience`.
Dependency: the agreed audience and reader promise. Does not depend on PR 2.

## 1. Outcome and non-goals

A new visitor recognizes their information-work environment, can reach a meaningful existing demonstration, inspect its actual source and return to the explanation. The same journey is usable on mobile. Preserve the calm visual identity.

Do not add the new refinement lab, a new mandatory chapter, a live agent, an integration platform, learner accounts, progress tracking or a framework upgrade. Do not replace all prose just to normalize style.

## 2. P1-01 — Update governing intent, not just homepage wording

Update the product promise, audience, reader outcomes and scenario boundaries in `spec/tutorial/02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md`. Retain its stable path; record the next intended baseline as v1.4 and explicitly distinguish specification adoption from delivered implementation. Append the 25 October 2026 audience decision to `04-DESIGN-DECISIONS.md`. Mark detailed interaction choices as proposals until reviewed.

Update the reusable template to ask for: actual work environment; prior domain knowledge; prerequisites that must not be assumed; the opportunity the reader should see; how outcome evidence will be collected. Do not bake this particular audience into every future tutorial.

Update `CONTRIBUTING.md` with situation-first examples, non-writer/non-engineer assumptions and the prohibition on treating system integration as automatic. Update `AGENTS.md` with a link and concise preservation constraints. Reconcile `README.md`, `ROADMAP.md`, the specification register and project source map where affected.

Acceptance: no equal-priority “engineer/builder” primary audience remains in the current specification. Technical users remain welcome through optional depth. Historical decisions are not rewritten.

## 3. P1-02 — Homepage: relevance and one clear demonstration

Keep the product name. Proposed heading: **New ways of working with information**.

Use the reader promise from the shared baseline. Follow it with: “Explore how information from documents and business systems can be connected, refined, and reused—with clear sources, review, and responsibility.” Add “Try the examples in your browser. No coding or installation required.” This refers to the reader experience, not implementation effort.

Use two primary actions:

- **Start exploring** → existing Chapter 1 URL.
- **See one source change several results** → existing Chapter 7 Processing Lab anchor, resolved from the current rendered marker rather than guessed.

Keep the conceptual explanation lower on the page. Do not add a competing third primary CTA. Add a compact workplace bridge: customer commitment in a PDF, forecast in a spreadsheet, resource information in a planning system, and a decision brief someone currently assembles manually. Label it an illustration, not an implemented live connector.

Add Processing Lab to the lab overview. Rename “Choose a learning path” to **Explore the learning journey**. Reuse the existing four groups (1–4, 5–7, 8–9, 10–11), with labels matching reader intent. Group membership comes from a shared configuration used by homepage and navigation; it must not be maintained twice. Keep the Project Control Center as “Behind the lab,” not a competing first step.

Acceptance: both CTA destinations exist with the base path; all eleven chapters occur exactly once in the group navigation; the existing slide-deck and lab links remain available.

## 4. P1-03 — Targeted chapter changes

Chapter 1: retain the useful onboarding opening and selection lab, but replace the engineering-led “why now” emphasis with familiar documents/system boundaries and the new working-method promise. Add a short paragraph explaining why a small example is used before exploring cross-system information.

Chapter 5: make a procedure template the first optional template, matching the running example. Reuse the existing procedure schema; do not create a second definition. Keep requirement examples as deeper material. A new `examples/learning/procedure-template.md` is a proposed file if no equivalent exists.

Chapter 8: add one concise distinction between assistance with a text and assistance with a source-backed information task. Retain the substantive existing treatment of project knowledge, `AGENTS.md`, authority, access and checks. Do not claim that agent access is automatic.

Chapter 11: close with recognizing a possible working-method experiment, not “you must now set up Git.” Keep the architectural explanation for interested readers.

Review all eleven chapters for contradictory audience claims; change only relevant passages. Record changed, checked-unchanged and deferred items in the chapter map. Revised substantive content returns to `in-review`; do not fabricate approval.

## 5. P1-04 — Readable source records

The existing material route renders Markdown bodies and a raw-file link. Add a reusable record presentation to that route rather than inventing a parallel record store.

For `examples/contract-explorer/records/DEL-101.md`, show:

| Field | Expected presentation from the existing record |
|---|---|
| Heading | DEL-101 — Interface package |
| Type | Delivery |
| Status | Planned — execution/planning state, not approval |
| Planned date | 10 November 2026 — recorded planning data |
| Relationship | Belongs to PRJ-101, with a working readable link |
| Body | Existing explanatory prose |

Do not relabel the planned date as a customer commitment. Other record types need their own meaningful labels. Render only intended public fields; do not dump arbitrary frontmatter as trusted HTML. Maintain one page-level heading; avoid duplicating a source H1.

Provide **View original source** and **Source and revision**. The former exposes original bytes under the existing `/files/` route, including YAML. The latter can show exact revision, path and content hash in a disclosure. Reuse the existing loader's provenance; do not invent new digests with unclear byte normalization. Preserve explicit uncommitted labels.

Keep existing raw links working. Add an explicit **Read source record** link in Contract Explorer and a deterministic return link to its chapter/lab. Do not use `history.back()` as the only return mechanism. If returning to a selected record, use a validated known record ID; do not accept arbitrary return URLs.

Implement a record-kind adapter so PR 2 can add refinement-source records without giving every material file the contract schema. Ordinary reference pages retain normal Markdown rendering. Extend existing related-chapter return links only where missing; several already exist.

Acceptance: raw bytes match the repository file; readable view contains the real ID/label/status/date/relations; no unknown field is invented; source and back links work on direct page entry.

## 6. P1-05 — Mobile and orientation

For process diagrams in Chapters 6–7, preserve the complete meaning in a readable mobile view. Prefer a vertical layout or a visible equivalent step/relationship list, with an optional enlarged diagram. Do not solve the problem solely by shrinking the SVG. Use the existing diagram source as authority; where a separate mobile layout is necessary, test semantic equivalence. Provide human-readable alternative descriptions, not Mermaid syntax.

Review at 320, 390, 768 and 1440 CSS pixels, plus zoom. Our component design target is approximately 16 px for essential explanatory labels or a same-screen readable equivalent; this is a project target, not a claimed WCAG font-size rule. Two-dimensional diagrams/tables may have local scrolling, but the page and ordinary text should reflow.

On mobile, add **Source / Preview** tabs to the existing Markdown component. Reuse this in metadata and processing contexts; keep validation/build feedback separate and visible. Switching tabs must preserve editor contents, cursor state where practicable and latest result state. Keep source and preview side by side on desktop. Provide accessible tab behavior, labels and focus; without JavaScript, show both sections in normal reading order.

Group the chapter menu from the same configuration as the homepage. Keep a visible current chapter. Add a compact in-page contents list only to chapters where length warrants it, generated from existing headings and excluding headings inside demonstrations. Preserve anchor IDs.

Show chapter editorial status once, with a short explanation. Preserve the distinction between approval and deployment. Fix blank quiz submissions so they request an answer without immediately displaying a misleading 0-of-2 score.

Contract Explorer: retain all three views and the existing change-impact action. Prioritize the question, result and explanation; keep technical revision details behind disclosure. Do not remove the accessible table alternative or the record source links.

## 7. P1-06 — Reference cleanup and share metadata

Remove stale present-tense claims from `reference/automation-quality.md`: “final chapter,” a Chapter 1 assignment that no longer exists, and an already available dashboard described as future work. Preserve genuine historical notes with their dates. Update redirecting reference links to current final destinations without deleting redirects.

Reorganize `ROADMAP.md` into established baseline, next work and later possibilities. Completion still requires evidence, not merely a new heading.

Add page descriptions, canonical URLs, Open Graph title/description/URL/image and useful image alternative text to the shared layout. Each homepage/chapter description must be specific. Generate absolute public URLs from configured site/base settings, without localhost or duplicated base paths. Use a simple local share asset consistent with the current identity; no decorative redesign or runtime third-party image service.

New nested specification pages need an explicit materials collection pattern in `site/src/content.config.ts`. Keep source exposure deliberate in `repository.ts`; workflow links that cannot be served by Pages must continue using GitHub.

## 8. File map

Existing: `spec/tutorial/{README.md,01-REUSABLE-TUTORIAL-SPECIFICATION-TEMPLATE.md,02-DOCUMENT-AS-CODE-LAB-V1-SPECIFICATION.md,04-DESIGN-DECISIONS.md}`, `AGENTS.md`, `CONTRIBUTING.md`, `README.md`, `ROADMAP.md`, affected `docs/*.md`, `reference/automation-quality.md`, `reference/project-knowledge.md`, `site/README.md`.

Existing implementation: `site/src/pages/index.astro`, `site/src/pages/chapters/[slug].astro`, `site/src/pages/materials/[...slug].astro`, `site/src/layouts/Documentation.astro`, `site/src/content.config.ts`, `site/src/lib/repository.ts`, learning components `MarkdownPlayground.astro`, `ContractExplorer.astro`, `Quiz.astro`, and their existing controllers/styles. Inspect controller ownership before editing; do not build a second renderer.

Proposed new files, only where needed: `site/src/components/materials/RecordDetails.astro`, `site/src/lib/material-records.ts`, `site/src/lib/learning-journey.ts`, `examples/learning/procedure-template.md`, one local sharing asset. Reuse existing equivalents if present on the implementation revision.

## 9. Verification, delivery and rollback

Run all existing site checks and affected tests listed in the shared matrix. Add focused assertions to existing content/homepage/learning/contracts tests. Inspect homepage, Chapters 1/5/7/8/9/11, a normal reference and DEL-101 at desktop/mobile sizes. Verify JS-off content, keyboard controls, raw-source identity, base paths, material return links and unaffected presentation navigation.

Attach before/after passages and screenshots; record exact commit, commands and unverified items. Owner acceptance covers wording and visual treatment. Hosted verification follows authorized publication and is not inferred from local success.

Suggested commits: intent and editorial samples; source-record renderer; responsive/navigation changes; targeted content and metadata; tests and review evidence. Reverting the PR restores the previous frontend without rewriting maintained source facts or deleting old routes. Do not mark PR 2 functionality present.
